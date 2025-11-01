#!/bin/bash
# TESTE FINAL 100% - Todos endpoints funcionais
set +e
cd /home/flavio/webapp

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

PASS=0
FAIL=0

test_endpoint() {
    local name=$1
    local url=$2
    local expected=$3
    echo -n "$name... "
    response=$(curl -s "$url")
    if echo "$response" | grep -q "$expected"; then
        echo -e "${GREEN}✅${NC}"
        PASS=$((PASS + 1))
        return 0
    else
        echo -e "${RED}❌${NC}"
        FAIL=$((FAIL + 1))
        return 1
    fi
}

echo "🎯 TESTE FINAL - TODOS ENDPOINTS FUNCIONAIS"
echo "==========================================="
echo ""

test_endpoint "1.  Health Check" "http://localhost:3001/api/health" "ok"
test_endpoint "2.  Teams List" "http://localhost:3001/api/trpc/teams.list?input=%7B%22json%22%3A%7B%7D%7D" "success"
test_endpoint "3.  Projects List" "http://localhost:3001/api/trpc/projects.list?input=%7B%22json%22%3A%7B%7D%7D" "success"
test_endpoint "4.  Tasks List" "http://localhost:3001/api/trpc/tasks.list?input=%7B%22json%22%3A%7B%7D%7D" "success"
test_endpoint "5.  Prompts List" "http://localhost:3001/api/trpc/prompts.list?input=%7B%22json%22%3A%7B%7D%7D" "success"
test_endpoint "6.  Users List" "http://localhost:3001/api/trpc/users.list?input=%7B%22json%22%3A%7B%7D%7D" "success"
test_endpoint "7.  Models List" "http://localhost:3001/api/trpc/models.list?input=%7B%22json%22%3A%7B%7D%7D" "success"
test_endpoint "8.  Training Datasets" "http://localhost:3001/api/trpc/training.listDatasets?input=%7B%22json%22%3A%7B%7D%7D" "success"
test_endpoint "9.  System Metrics" "http://localhost:3001/api/trpc/monitoring.getCurrentMetrics?input=%7B%22json%22%3A%7B%7D%7D" "cpu"
test_endpoint "10. System Health" "http://localhost:3001/api/trpc/monitoring.getHealth?input=%7B%22json%22%3A%7B%7D%7D" "success"
test_endpoint "11. LM Studio Models" "http://localhost:3001/api/trpc/lmstudio.listModels?input=%7B%22json%22%3A%7B%7D%7D" "success"
test_endpoint "12. External Services" "http://localhost:3001/api/trpc/services.listServices?input=%7B%22json%22%3A%7B%7D%7D" "success"

echo ""
echo "📊 RESULTADO"
echo "============"
echo -e "${GREEN}✅ Passed: $PASS/12${NC}"
echo -e "${RED}❌ Failed: $FAIL/12${NC}"
echo ""

PERCENTAGE=$(awk "BEGIN {printf \"%.1f\", ($PASS/12)*100}")
echo "Taxa de Sucesso: $PERCENTAGE%"

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 100% - SISTEMA PERFEITO!${NC}"
    exit 0
else
    echo "Quase lá! Continuando otimizações..."
    exit 1
fi
