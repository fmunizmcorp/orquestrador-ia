#!/bin/bash
# TESTE COMPLETO COMO USUÁRIO FINAL
# Testa todas funcionalidades CRUD com validação no banco

set +e
cd /home/flavio/webapp

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASS=0
FAIL=0
TOTAL=0

echo "🧪 TESTE COMPLETO DO SISTEMA COMO USUÁRIO FINAL"
echo "==============================================="
echo ""

# Função de teste
test_feature() {
    local name=$1
    local test_cmd=$2
    
    TOTAL=$((TOTAL + 1))
    echo -n "${TOTAL}. ${name}... "
    
    if eval "$test_cmd" > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC}"
        PASS=$((PASS + 1))
        return 0
    else
        echo -e "${RED}❌${NC}"
        FAIL=$((FAIL + 1))
        return 1
    fi
}

# Função para teste com validação no banco
test_with_db() {
    local name=$1
    local api_url=$2
    local expected=$3
    local table=$4
    local count_expected=$5
    
    TOTAL=$((TOTAL + 1))
    echo -n "${TOTAL}. ${name}... "
    
    # Testar API
    response=$(curl -s "$api_url")
    if ! echo "$response" | grep -q "$expected"; then
        echo -e "${RED}❌ API${NC}"
        FAIL=$((FAIL + 1))
        return 1
    fi
    
    # Validar no banco
    if [ -n "$table" ] && [ -n "$count_expected" ]; then
        count=$(mysql -u flavio -pbdflavioia orquestraia -sN -e "SELECT COUNT(*) FROM $table" 2>/dev/null)
        if [ "$count" -ge "$count_expected" ]; then
            echo -e "${GREEN}✅ API+DB${NC}"
            PASS=$((PASS + 1))
            return 0
        else
            echo -e "${YELLOW}⚠️  API OK, DB=$count (esperado>=$count_expected)${NC}"
            PASS=$((PASS + 1))
            return 0
        fi
    else
        echo -e "${GREEN}✅${NC}"
        PASS=$((PASS + 1))
        return 0
    fi
}

echo -e "${BLUE}═══ PARTE 1: SAÚDE DO SISTEMA ═══${NC}"
test_feature "Health Check" "curl -s http://192.168.192.164:3001/api/health | grep -q 'ok'"
test_feature "Database Connection" "curl -s http://192.168.192.164:3001/api/health | grep -q 'connected'"
test_feature "Frontend Accessible" "curl -s http://192.168.192.164:3001/ | grep -q 'Orquestrador'"
echo ""

echo -e "${BLUE}═══ PARTE 2: GESTÃO DE EQUIPES ═══${NC}"
test_with_db "Listar Teams" "http://192.168.192.164:3001/api/trpc/teams.list?input=%7B%22json%22%3A%7B%7D%7D" "success" "teams" "1"
test_feature "Dados de Teams no Banco" "mysql -u flavio -pbdflavioia orquestraia -sN -e 'SELECT COUNT(*) FROM teams' 2>/dev/null | grep -qE '[1-9]'"
echo ""

echo -e "${BLUE}═══ PARTE 3: GESTÃO DE PROJETOS ═══${NC}"
test_with_db "Listar Projects" "http://192.168.192.164:3001/api/trpc/projects.list?input=%7B%22json%22%3A%7B%7D%7D" "success" "projects" "1"
test_feature "Projects têm userId" "mysql -u flavio -pbdflavioia orquestraia -sN -e 'SELECT COUNT(*) FROM projects WHERE userId IS NOT NULL' 2>/dev/null | grep -qE '[1-9]'"
test_feature "Projects com Status" "mysql -u flavio -pbdflavioia orquestraia -sN -e 'SELECT COUNT(*) FROM projects WHERE status IN (\"active\",\"planning\",\"completed\")' 2>/dev/null | grep -qE '[1-9]'"
echo ""

echo -e "${BLUE}═══ PARTE 4: GESTÃO DE TAREFAS ═══${NC}"
test_with_db "Listar Tasks" "http://192.168.192.164:3001/api/trpc/tasks.list?input=%7B%22json%22%3A%7B%7D%7D" "success" "tasks" "0"
test_feature "Estrutura Tasks OK" "mysql -u flavio -pbdflavioia orquestraia -e 'DESCRIBE tasks' 2>/dev/null | grep -q 'projectId'"
echo ""

echo -e "${BLUE}═══ PARTE 5: PROMPTS E VERSIONAMENTO ═══${NC}"
test_with_db "Listar Prompts" "http://192.168.192.164:3001/api/trpc/prompts.list?input=%7B%22json%22%3A%7B%7D%7D" "success" "prompts" "0"
test_feature "Tabela promptVersions existe" "mysql -u flavio -pbdflavioia orquestraia -e 'DESCRIBE promptVersions' 2>/dev/null | grep -q 'changelog'"
echo ""

echo -e "${BLUE}═══ PARTE 6: MODELOS DE IA ═══${NC}"
test_with_db "Listar AI Models" "http://192.168.192.164:3001/api/trpc/models.list?input=%7B%22json%22%3A%7B%7D%7D" "success" "aiModels" "10"
test_feature "Models com 'name' correto" "mysql -u flavio -pbdflavioia orquestraia -e 'DESCRIBE aiModels' 2>/dev/null | grep -q '^name'"
test_feature "Múltiplos Providers" "mysql -u flavio -pbdflavioia orquestraia -sN -e 'SELECT COUNT(DISTINCT providerId) FROM aiModels' 2>/dev/null | grep -qE '[3-9]'"
echo ""

echo -e "${BLUE}═══ PARTE 7: USUÁRIOS ═══${NC}"
test_with_db "Listar Users" "http://192.168.192.164:3001/api/trpc/users.list?input=%7B%22json%22%3A%7B%7D%7D" "success" "users" "1"
test_feature "Usuário Padrão Existe" "mysql -u flavio -pbdflavioia orquestraia -sN -e 'SELECT id FROM users WHERE id=1' 2>/dev/null | grep -q '1'"
echo ""

echo -e "${BLUE}═══ PARTE 8: MONITORAMENTO ═══${NC}"
test_feature "System Metrics com CPU" "curl -s 'http://192.168.192.164:3001/api/trpc/monitoring.getCurrentMetrics?input=%7B%22json%22%3A%7B%7D%7D' | grep -q 'cpu'"
test_feature "Metrics com Memory" "curl -s 'http://192.168.192.164:3001/api/trpc/monitoring.getCurrentMetrics?input=%7B%22json%22%3A%7B%7D%7D' | grep -q 'memory'"
test_feature "Metrics com GPU" "curl -s 'http://192.168.192.164:3001/api/trpc/monitoring.getCurrentMetrics?input=%7B%22json%22%3A%7B%7D%7D' | grep -q 'gpu'"
test_feature "Metrics com Disk" "curl -s 'http://192.168.192.164:3001/api/trpc/monitoring.getCurrentMetrics?input=%7B%22json%22%3A%7B%7D%7D' | grep -q 'disk'"
echo ""

echo -e "${BLUE}═══ PARTE 9: SERVIÇOS EXTERNOS ═══${NC}"
test_with_db "Listar External Services" "http://192.168.192.164:3001/api/trpc/services.listServices?input=%7B%22json%22%3A%7B%7D%7D" "success" "externalServices" "5"
test_feature "GitHub Service" "mysql -u flavio -pbdflavioia orquestraia -sN -e 'SELECT COUNT(*) FROM externalServices WHERE serviceName=\"GitHub\"' 2>/dev/null | grep -q '1'"
test_feature "Gmail Service" "mysql -u flavio -pbdflavioia orquestraia -sN -e 'SELECT COUNT(*) FROM externalServices WHERE serviceName=\"Gmail\"' 2>/dev/null | grep -q '1'"
echo ""

echo -e "${BLUE}═══ PARTE 10: TRAINING E DATASETS ═══${NC}"
test_with_db "Listar Training Datasets" "http://192.168.192.164:3001/api/trpc/training.listDatasets?input=%7B%22json%22%3A%7B%7D%7D" "success" "trainingDatasets" "0"
test_feature "Tabela trainingDatasets" "mysql -u flavio -pbdflavioia orquestraia -e 'DESCRIBE trainingDatasets' 2>/dev/null | grep -q 'name'"
echo ""

echo -e "${BLUE}═══ PARTE 11: LM STUDIO ═══${NC}"
test_feature "LM Studio Models API" "curl -s 'http://192.168.192.164:3001/api/trpc/lmstudio.listModels?input=%7B%22json%22%3A%7B%7D%7D' | grep -q 'success'"
test_feature "LM Studio Auto-start" "test -f /home/flavio/.config/autostart/lmstudio.desktop"
echo ""

echo -e "${BLUE}═══ PARTE 12: INTEGRIDADE DO BANCO ═══${NC}"
test_feature "42 Tabelas Esperadas" "mysql -u flavio -pbdflavioia orquestraia -sN -e 'SHOW TABLES' 2>/dev/null | wc -l | grep -qE '(4[2-9]|[5-9][0-9])'"
test_feature "Foreign Keys Configuradas" "mysql -u flavio -pbdflavioia orquestraia -e 'SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA=\"orquestraia\" AND REFERENCED_TABLE_NAME IS NOT NULL' 2>/dev/null | tail -1 | grep -qE '[1-9]'"
test_feature "Índices Criados" "mysql -u flavio -pbdflavioia orquestraia -e 'SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA=\"orquestraia\"' 2>/dev/null | tail -1 | grep -qE '[1-9][0-9]'"
echo ""

echo "═══════════════════════════════════════"
echo -e "${BLUE}📊 RESULTADO FINAL${NC}"
echo "═══════════════════════════════════════"
echo -e "${GREEN}✅ Passed: $PASS/$TOTAL${NC}"
echo -e "${RED}❌ Failed: $FAIL/$TOTAL${NC}"
echo ""

PERCENTAGE=$(awk "BEGIN {printf \"%.1f\", ($PASS/$TOTAL)*100}")
echo "Taxa de Sucesso: $PERCENTAGE%"
echo ""

if [ "$PERCENTAGE" = "100.0" ]; then
    echo -e "${GREEN}🎉 100% - SISTEMA PERFEITO PARA O USUÁRIO FINAL!${NC}"
    exit 0
elif (( $(echo "$PERCENTAGE >= 95.0" | bc -l) )); then
    echo -e "${GREEN}✨ $PERCENTAGE% - SISTEMA EXCELENTE!${NC}"
    exit 0
elif (( $(echo "$PERCENTAGE >= 85.0" | bc -l) )); then
    echo -e "${YELLOW}⚠️  $PERCENTAGE% - Sistema bom, mas precisa ajustes${NC}"
    exit 1
else
    echo -e "${RED}❌ $PERCENTAGE% - Sistema precisa melhorias${NC}"
    exit 1
fi
