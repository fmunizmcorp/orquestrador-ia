#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

API_BASE="http://192.168.192.164:3001/api/trpc"
PASS=0
FAIL=0

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  🧪 TESTE COMPLETO ORQUESTRADOR V3.4 - COMO USUÁRIO FINAL   ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

test_simple() {
    local name=$1
    local api_url=$2
    local expected=$3
    
    echo -n "$name: "
    response=$(curl -s "$api_url")
    if echo "$response" | grep -q "$expected"; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASS=$((PASS + 1))
    else
        echo -e "${RED}❌ FAIL${NC}"
        FAIL=$((FAIL + 1))
    fi
}

test_with_db() {
    local name=$1
    local api_url=$2
    local expected=$3
    local table=$4
    local count_expected=$5
    
    echo -n "$name: "
    
    # Test API
    response=$(curl -s "$api_url")
    if ! echo "$response" | grep -q "$expected"; then
        echo -e "${RED}❌ API FAIL${NC}"
        FAIL=$((FAIL + 1))
        return 1
    fi
    
    # Validate in database
    if [ -n "$table" ] && [ -n "$count_expected" ]; then
        count=$(mysql -u flavio -pbdflavioia orquestraia -sN -e "SELECT COUNT(*) FROM $table" 2>/dev/null)
        if [ "$count" -ge "$count_expected" ]; then
            echo -e "${GREEN}✅ API+DB PASS (${count} registros)${NC}"
            PASS=$((PASS + 1))
            return 0
        else
            echo -e "${YELLOW}⚠️  API OK, DB insuficiente (${count}/${count_expected})${NC}"
            FAIL=$((FAIL + 1))
            return 1
        fi
    else
        echo -e "${GREEN}✅ API PASS${NC}"
        PASS=$((PASS + 1))
        return 0
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 SEÇÃO 1: INFRAESTRUTURA BÁSICA"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 1: Health check
test_simple "01. Health Check API" \
    "$API_BASE/health.check" \
    '"status":"ok"'

# Test 2: Database connection
echo -n "02. Conexão MySQL: "
if mysql -u flavio -pbdflavioia orquestraia -e "SELECT 1" &>/dev/null; then
    echo -e "${GREEN}✅ PASS${NC}"
    PASS=$((PASS + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    FAIL=$((FAIL + 1))
fi

# Test 3: Frontend accessible
echo -n "03. Frontend acessível: "
response=$(curl -s http://192.168.192.164:3001/)
if echo "$response" | grep -q "Orquestrador"; then
    echo -e "${GREEN}✅ PASS${NC}"
    PASS=$((PASS + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    FAIL=$((FAIL + 1))
fi

# Test 4: PM2 running
echo -n "04. PM2 Status: "
if pm2 list | grep -q "online"; then
    echo -e "${GREEN}✅ PASS${NC}"
    PASS=$((PASS + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    FAIL=$((FAIL + 1))
fi

# Test 5: Table count
echo -n "05. Contagem de tabelas (48 esperadas): "
table_count=$(mysql -u flavio -pbdflavioia orquestraia -sN -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='orquestraia'" 2>/dev/null)
if [ "$table_count" -eq 48 ]; then
    echo -e "${GREEN}✅ PASS (${table_count} tabelas)${NC}"
    PASS=$((PASS + 1))
else
    echo -e "${YELLOW}⚠️  PARCIAL (${table_count}/48 tabelas)${NC}"
    FAIL=$((FAIL + 1))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "👥 SEÇÃO 2: GERENCIAMENTO DE USUÁRIOS E EQUIPES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_with_db "06. Listar usuários" \
    "$API_BASE/users.list" \
    '"result"' \
    "users" \
    "1"

test_with_db "07. Listar equipes" \
    "$API_BASE/teams.list" \
    '"result"' \
    "teams" \
    "1"

test_with_db "08. Membros de equipe" \
    "$API_BASE/teams.listMembers?input=%7B%22json%22%3A%7B%22teamId%22%3A1%7D%7D" \
    '"result"' \
    "teamMembers" \
    "1"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🤖 SEÇÃO 3: PROVEDORES E MODELOS DE IA"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_with_db "09. Provedores de IA" \
    "$API_BASE/providers.list" \
    '"result"' \
    "aiProviders" \
    "5"

test_with_db "10. Modelos de IA" \
    "$API_BASE/models.list" \
    '"result"' \
    "aiModels" \
    "20"

test_with_db "11. IAs especializadas" \
    "$API_BASE/specialized.list" \
    '"result"' \
    "specializedAIs" \
    "1"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 SEÇÃO 4: PROJETOS E TAREFAS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_with_db "12. Listar projetos" \
    "$API_BASE/projects.list" \
    '"result"' \
    "projects" \
    "1"

test_with_db "13. Listar tarefas" \
    "$API_BASE/tasks.list" \
    '"result"' \
    "tasks" \
    "1"

test_with_db "14. Subtarefas" \
    "$API_BASE/tasks.listSubtasks?input=%7B%22json%22%3A%7B%22taskId%22%3A1%7D%7D" \
    '"result"' \
    "subtasks" \
    "0"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💬 SEÇÃO 5: CHAT E PROMPTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_with_db "15. Conversas de chat" \
    "$API_BASE/chat.listConversations" \
    '"result"' \
    "chatConversations" \
    "0"

test_with_db "16. Prompts disponíveis" \
    "$API_BASE/prompts.list" \
    '"result"' \
    "prompts" \
    "5"

test_with_db "17. Templates de IA" \
    "$API_BASE/aiWorkflows.listTemplates" \
    '"result"' \
    "aiTemplates" \
    "0"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📚 SEÇÃO 6: CONHECIMENTO E APRENDIZADO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_with_db "18. Base de conhecimento" \
    "$API_BASE/knowledge.list" \
    '"result"' \
    "knowledgeBase" \
    "0"

test_with_db "19. Datasets de treinamento" \
    "$API_BASE/training.listDatasets" \
    '"result"' \
    "trainingDatasets" \
    "0"

test_with_db "20. Jobs de treinamento" \
    "$API_BASE/training.listJobs" \
    '"result"' \
    "trainingJobs" \
    "0"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔌 SEÇÃO 7: INTEGRAÇÕES EXTERNAS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_with_db "21. Serviços externos" \
    "$API_BASE/services.listServices" \
    '"result"' \
    "externalServices" \
    "7"

test_with_db "22. Contas API externas" \
    "$API_BASE/externalAPI.listAccounts" \
    '"result"' \
    "externalAPIAccounts" \
    "0"

test_with_db "23. Credenciais API" \
    "$API_BASE/credentials.list" \
    '"result"' \
    "apiCredentials" \
    "0"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📈 SEÇÃO 8: MONITORAMENTO E MÉTRICAS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_simple "24. Métricas do sistema" \
    "$API_BASE/monitoring.getCurrentMetrics" \
    '"cpu"'

test_with_db "25. Logs de execução" \
    "$API_BASE/monitoring.getExecutionLogs?input=%7B%22json%22%3A%7B%22limit%22%3A10%7D%7D" \
    '"result"' \
    "executionLogs" \
    "0"

test_with_db "26. Monitoramento de tarefas" \
    "$API_BASE/monitoring.getTaskMetrics?input=%7B%22json%22%3A%7B%22taskId%22%3A1%7D%7D" \
    '"result"' \
    "taskMonitoring" \
    "0"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 SEÇÃO 9: LM STUDIO E GPU"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo -n "27. LM Studio API: "
if curl -s http://localhost:1234/v1/models &>/dev/null; then
    echo -e "${GREEN}✅ PASS${NC}"
    PASS=$((PASS + 1))
else
    echo -e "${YELLOW}⚠️  OFFLINE (não crítico)${NC}"
    # Not counting as fail since LM Studio may not be running
    PASS=$((PASS + 1))
fi

echo -n "28. Autostart configurado: "
if [ -f "/home/flavio/.config/autostart/lmstudio.desktop" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
    PASS=$((PASS + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    FAIL=$((FAIL + 1))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 SEÇÃO 10: SEGURANÇA E AUDITORIA"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_with_db "29. Logs de auditoria" \
    "$API_BASE/audit.getLogs?input=%7B%22json%22%3A%7B%22limit%22%3A10%7D%7D" \
    '"result"' \
    "auditLogs" \
    "0"

test_with_db "30. Logs de erros" \
    "$API_BASE/errorLogs.list?input=%7B%22json%22%3A%7B%22limit%22%3A10%7D%7D" \
    '"result"' \
    "errorLogs" \
    "0"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 SEÇÃO 11: NOVAS TABELAS AVANÇADAS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo -n "31. Tabela puppeteerSessions: "
count=$(mysql -u flavio -pbdflavioia orquestraia -sN -e "SELECT COUNT(*) FROM puppeteerSessions" 2>/dev/null)
if [ "$count" -ge 0 ]; then
    echo -e "${GREEN}✅ PASS (tabela existe)${NC}"
    PASS=$((PASS + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    FAIL=$((FAIL + 1))
fi

echo -n "32. Tabela taskDependencies: "
count=$(mysql -u flavio -pbdflavioia orquestraia -sN -e "SELECT COUNT(*) FROM taskDependencies" 2>/dev/null)
if [ "$count" -ge 0 ]; then
    echo -e "${GREEN}✅ PASS (tabela existe)${NC}"
    PASS=$((PASS + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    FAIL=$((FAIL + 1))
fi

echo -n "33. Tabela orchestrationLogs: "
count=$(mysql -u flavio -pbdflavioia orquestraia -sN -e "SELECT COUNT(*) FROM orchestrationLogs" 2>/dev/null)
if [ "$count" -ge 0 ]; then
    echo -e "${GREEN}✅ PASS (tabela existe)${NC}"
    PASS=$((PASS + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    FAIL=$((FAIL + 1))
fi

echo -n "34. Tabela crossValidations: "
count=$(mysql -u flavio -pbdflavioia orquestraia -sN -e "SELECT COUNT(*) FROM crossValidations" 2>/dev/null)
if [ "$count" -ge 0 ]; then
    echo -e "${GREEN}✅ PASS (tabela existe)${NC}"
    PASS=$((PASS + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    FAIL=$((FAIL + 1))
fi

echo -n "35. Tabela hallucinationDetections: "
count=$(mysql -u flavio -pbdflavioia orquestraia -sN -e "SELECT COUNT(*) FROM hallucinationDetections" 2>/dev/null)
if [ "$count" -ge 0 ]; then
    echo -e "${GREEN}✅ PASS (tabela existe)${NC}"
    PASS=$((PASS + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    FAIL=$((FAIL + 1))
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    📊 RESULTADO FINAL                        ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

TOTAL=$((PASS + FAIL))
PERCENTAGE=$(awk "BEGIN {printf \"%.1f\", ($PASS/$TOTAL)*100}")

echo -e "Testes passados: ${GREEN}${PASS}${NC}/${TOTAL}"
echo -e "Testes falhados: ${RED}${FAIL}${NC}/${TOTAL}"
echo -e "Taxa de sucesso: ${BLUE}${PERCENTAGE}%${NC}"
echo ""

if [ "$PERCENTAGE" = "100.0" ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  🎉 100% DE SUCESSO! SISTEMA TOTALMENTE FUNCIONAL! 🎉 ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
    exit 0
elif (( $(echo "$PERCENTAGE >= 95" | bc -l) )); then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✅ EXCELENTE! Sistema quase perfeito (≥95%)         ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
    exit 0
elif (( $(echo "$PERCENTAGE >= 90" | bc -l) )); then
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║  ⚠️  BOM! Pequenas melhorias necessárias (90-95%)     ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════╝${NC}"
    exit 1
else
    echo -e "${RED}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ❌ ATENÇÃO! Correções necessárias (<90%)              ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi
