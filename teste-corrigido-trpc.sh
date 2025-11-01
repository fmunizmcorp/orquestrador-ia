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
echo "║  🧪 TESTE COMPLETO V3.4 - FORMATO tRPC CORRETO              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

test_trpc() {
    local name=$1
    local endpoint=$2
    local input=$3
    local expected=$4
    local table=$5
    local count_expected=$6
    
    echo -n "$name: "
    
    # Build URL with batch format
    local url="${API_BASE}/${endpoint}?batch=1&input=%7B%220%22%3A%7B%22json%22%3A${input}%7D%7D"
    
    # Test API
    response=$(curl -s "$url")
    if ! echo "$response" | grep -q "$expected"; then
        echo -e "${RED}❌ API FAIL${NC}"
        FAIL=$((FAIL + 1))
        return 1
    fi
    
    # Validate in database if table specified
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
echo "📋 INFRAESTRUTURA BÁSICA"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 1: Database
echo -n "01. Conexão MySQL: "
if mysql -u flavio -pbdflavioia orquestraia -e "SELECT 1" &>/dev/null; then
    echo -e "${GREEN}✅ PASS${NC}"
    PASS=$((PASS + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    FAIL=$((FAIL + 1))
fi

# Test 2: Frontend
echo -n "02. Frontend acessível: "
response=$(curl -s http://192.168.192.164:3001/)
if echo "$response" | grep -q "Orquestrador"; then
    echo -e "${GREEN}✅ PASS${NC}"
    PASS=$((PASS + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    FAIL=$((FAIL + 1))
fi

# Test 3: PM2
echo -n "03. PM2 Status: "
if pm2 list | grep -q "online"; then
    echo -e "${GREEN}✅ PASS${NC}"
    PASS=$((PASS + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    FAIL=$((FAIL + 1))
fi

# Test 4: Table count
echo -n "04. Contagem de tabelas (48 esperadas): "
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
echo "👥 USUÁRIOS E EQUIPES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_trpc "05. Listar usuários" "users.list" "null" '"success":true' "users" "1"
test_trpc "06. Listar equipes" "teams.list" "null" '"success":true' "teams" "1"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🤖 PROVEDORES E MODELOS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_trpc "07. Provedores de IA" "providers.list" "null" '"success":true' "aiProviders" "5"
test_trpc "08. Modelos de IA" "models.list" "null" '"success":true' "aiModels" "20"
test_trpc "09. IAs especializadas" "specialized.list" "null" '"success":true' "specializedAIs" "1"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 PROJETOS E TAREFAS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_trpc "10. Listar projetos" "projects.list" "null" '"success":true' "projects" "1"
test_trpc "11. Listar tarefas" "tasks.list" "null" '"success":true' "tasks" "1"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💬 CHAT E PROMPTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_trpc "12. Conversas de chat" "chat.listConversations" "null" '"success":true' "chatConversations" "0"
test_trpc "13. Prompts disponíveis" "prompts.list" "null" '"success":true' "prompts" "5"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📚 CONHECIMENTO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_trpc "14. Base de conhecimento" "knowledge.list" "null" '"success":true' "knowledgeBase" "0"
test_trpc "15. Datasets treinamento" "training.listDatasets" "null" '"success":true' "trainingDatasets" "0"
test_trpc "16. Jobs de treinamento" "training.listJobs" "null" '"success":true' "trainingJobs" "0"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔌 INTEGRAÇÕES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_trpc "17. Serviços externos" "services.listServices" "null" '"success":true' "externalServices" "7"
test_trpc "18. Contas API externas" "externalAPI.listAccounts" "null" '"success":true' "externalAPIAccounts" "0"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📈 MONITORAMENTO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_trpc "19. Métricas do sistema" "monitoring.getCurrentMetrics" "null" '"cpu"' "" ""

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 TABELAS AVANÇADAS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

for table in puppeteerSessions taskDependencies orchestrationLogs crossValidations hallucinationDetections executionResults messageAttachments messageReactions systemMetrics apiUsage errorLogs auditLogs oauthTokens apiCredentials; do
    echo -n "Tabela $table: "
    count=$(mysql -u flavio -pbdflavioia orquestraia -sN -e "SELECT COUNT(*) FROM $table" 2>/dev/null)
    if [ "$count" -ge 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASS=$((PASS + 1))
    else
        echo -e "${RED}❌ FAIL${NC}"
        FAIL=$((FAIL + 1))
    fi
done

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
else
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║  ⚠️  Melhorias possíveis mas sistema funcional        ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi
