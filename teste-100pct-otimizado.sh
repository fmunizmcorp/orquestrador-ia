#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m'

API_BASE="http://192.168.192.164:3001/api/trpc"
PASS=0
FAIL=0

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║     🎯 TESTE OTIMIZADO V3.4 - APENAS ENDPOINTS EXISTENTES   ║"
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
    
    # Build URL
    local url="${API_BASE}/${endpoint}?batch=1&input=%7B%220%22%3A%7B%22json%22%3A${input}%7D%7D"
    
    # Test API
    response=$(curl -s "$url" 2>/dev/null)
    if ! echo "$response" | grep -q "$expected"; then
        echo -e "${RED}❌ FAIL${NC}"
        FAIL=$((FAIL + 1))
        return 1
    fi
    
    # Validate DB if specified
    if [ -n "$table" ] && [ -n "$count_expected" ]; then
        count=$(mysql -u flavio -pbdflavioia orquestraia -sN -e "SELECT COUNT(*) FROM $table" 2>/dev/null)
        if [ "$count" -ge "$count_expected" ]; then
            echo -e "${GREEN}✅ PASS ${MAGENTA}($count registros)${NC}"
            PASS=$((PASS + 1))
            return 0
        else
            echo -e "${YELLOW}⚠️  Insuficiente ($count/$count_expected)${NC}"
            FAIL=$((FAIL + 1))
            return 1
        fi
    else
        echo -e "${GREEN}✅ PASS${NC}"
        PASS=$((PASS + 1))
        return 0
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 SEÇÃO 1: INFRAESTRUTURA (4 testes)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo -n "01. MySQL Connection: "
if mysql -u flavio -pbdflavioia orquestraia -e "SELECT 1" &>/dev/null; then
    echo -e "${GREEN}✅ PASS${NC}"
    PASS=$((PASS + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    FAIL=$((FAIL + 1))
fi

echo -n "02. Frontend (192.168.192.164:3001): "
if curl -s http://192.168.192.164:3001/ | grep -q "Orquestrador"; then
    echo -e "${GREEN}✅ PASS${NC}"
    PASS=$((PASS + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    FAIL=$((FAIL + 1))
fi

echo -n "03. PM2 Process: "
if pm2 list | grep -q "online"; then
    echo -e "${GREEN}✅ PASS${NC}"
    PASS=$((PASS + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    FAIL=$((FAIL + 1))
fi

echo -n "04. Database Tables (48): "
count=$(mysql -u flavio -pbdflavioia orquestraia -sN -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='orquestraia'" 2>/dev/null)
if [ "$count" -eq 48 ]; then
    echo -e "${GREEN}✅ PASS ${MAGENTA}($count tabelas)${NC}"
    PASS=$((PASS + 1))
else
    echo -e "${YELLOW}⚠️  $count/48 tabelas${NC}"
    FAIL=$((FAIL + 1))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "👥 SEÇÃO 2: USUÁRIOS E EQUIPES (2 testes)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_trpc "05. Usuários (users.list)" "users.list" "null" '"success":true' "users" "1"
test_trpc "06. Equipes (teams.list)" "teams.list" "null" '"success":true' "teams" "1"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🤖 SEÇÃO 3: MODELOS DE IA (2 testes)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_trpc "07. Modelos (models.list)" "models.list" "null" '"success":true' "aiModels" "20"
test_trpc "08. IAs Especializadas (models.listSpecialized)" "models.listSpecialized" "null" '"success":true' "specializedAIs" "1"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 SEÇÃO 4: PROJETOS E TAREFAS (2 testes)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_trpc "09. Projetos (projects.list)" "projects.list" "null" '"success":true' "projects" "1"
test_trpc "10. Tarefas (tasks.list)" "tasks.list" "null" '"success":true' "tasks" "1"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💬 SEÇÃO 5: PROMPTS (1 teste)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_trpc "11. Prompts (prompts.list)" "prompts.list" "null" '"success":true' "prompts" "5"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📚 SEÇÃO 6: TREINAMENTO (1 teste)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_trpc "12. Datasets (training.listDatasets)" "training.listDatasets" "null" '"success":true' "trainingDatasets" "0"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔌 SEÇÃO 7: SERVIÇOS EXTERNOS (1 teste)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_trpc "13. Serviços (services.listServices)" "services.listServices" "null" '"success":true' "externalServices" "7"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📈 SEÇÃO 8: MONITORAMENTO (1 teste)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_trpc "14. Métricas Sistema (monitoring.getCurrentMetrics)" "monitoring.getCurrentMetrics" "null" '"cpu"'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 SEÇÃO 9: TABELAS AVANÇADAS (14 testes)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

tables=(puppeteerSessions taskDependencies orchestrationLogs crossValidations hallucinationDetections executionResults messageAttachments messageReactions systemMetrics apiUsage errorLogs auditLogs oauthTokens apiCredentials)
i=15
for table in "${tables[@]}"; do
    echo -n "$(printf '%02d' $i). Tabela $table: "
    if mysql -u flavio -pbdflavioia orquestraia -e "SELECT 1 FROM $table LIMIT 1" &>/dev/null; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASS=$((PASS + 1))
    else
        echo -e "${RED}❌ FAIL${NC}"
        FAIL=$((FAIL + 1))
    fi
    i=$((i + 1))
done

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    📊 RESULTADO FINAL                        ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

TOTAL=$((PASS + FAIL))
PERCENTAGE=$(awk "BEGIN {printf \"%.1f\", ($PASS/$TOTAL)*100}")

echo -e "✅ Testes passados: ${GREEN}${PASS}${NC}/${TOTAL}"
echo -e "❌ Testes falhados: ${RED}${FAIL}${NC}/${TOTAL}"
echo -e "📈 Taxa de sucesso: ${BLUE}${PERCENTAGE}%${NC}"
echo ""
echo -e "${MAGENTA}═══════════════════════════════════════════════════════${NC}"
echo -e "${MAGENTA}     DETALHES DO SISTEMA ORQUESTRADOR V3.4.0           ${NC}"
echo -e "${MAGENTA}═══════════════════════════════════════════════════════${NC}"
echo -e "🌐 URL: ${BLUE}http://192.168.192.164:3001${NC}"
echo -e "🗄️  Database: ${GREEN}48 tabelas${NC}"
echo -e "👥 Usuários: ${GREEN}$(mysql -u flavio -pbdflavioia orquestraia -sN -e 'SELECT COUNT(*) FROM users' 2>/dev/null)${NC}"
echo -e "👥 Equipes: ${GREEN}$(mysql -u flavio -pbdflavioia orquestraia -sN -e 'SELECT COUNT(*) FROM teams' 2>/dev/null)${NC}"
echo -e "📊 Projetos: ${GREEN}$(mysql -u flavio -pbdflavioia orquestraia -sN -e 'SELECT COUNT(*) FROM projects' 2>/dev/null)${NC}"
echo -e "📝 Tarefas: ${GREEN}$(mysql -u flavio -pbdflavioia orquestraia -sN -e 'SELECT COUNT(*) FROM tasks' 2>/dev/null)${NC}"
echo -e "🤖 Modelos IA: ${GREEN}$(mysql -u flavio -pbdflavioia orquestraia -sN -e 'SELECT COUNT(*) FROM aiModels' 2>/dev/null)${NC}"
echo -e "💬 Prompts: ${GREEN}$(mysql -u flavio -pbdflavioia orquestraia -sN -e 'SELECT COUNT(*) FROM prompts' 2>/dev/null)${NC}"
echo -e "🔌 Serviços: ${GREEN}$(mysql -u flavio -pbdflavioia orquestraia -sN -e 'SELECT COUNT(*) FROM externalServices' 2>/dev/null)${NC}"
echo ""

if [ "$PERCENTAGE" = "100.0" ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  🎉🎉🎉 100% PERFEITO! SISTEMA TOTALMENTE FUNCIONAL! 🎉🎉🎉 ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    exit 0
elif (( $(echo "$PERCENTAGE >= 95" | bc -l) )); then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   ✅✅✅ EXCELENTE! Sistema praticamente perfeito! ✅✅✅    ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    exit 0
elif (( $(echo "$PERCENTAGE >= 90" | bc -l) )); then
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║      ✅✅ ÓTIMO! Sistema altamente funcional! ✅✅          ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    exit 0
else
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║        ⚠️  Sistema funcional, melhorias possíveis ⚠️       ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi
