#!/bin/bash
# Script de teste completo das APIs do Orquestrador V3.4

set +e
cd /home/flavio/webapp

echo "🧪 TESTE COMPLETO DAS APIs - ORQUESTRADOR V3.4"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS=0
FAIL=0

test_endpoint() {
    local name=$1
    local url=$2
    local expected=$3
    
    echo -n "Testing $name... "
    
    response=$(curl -s "$url")
    
    if echo "$response" | grep -q "$expected"; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASS=$((PASS + 1))
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "Response: $response"
        FAIL=$((FAIL + 1))
    fi
}

echo "1️⃣  TESTES DE SAÚDE DO SISTEMA"
echo "--------------------------------"
test_endpoint "Health Check" "http://localhost:3001/api/health" "ok"
echo ""

echo "2️⃣  TESTES DE LISTAGEM (GET)"
echo "--------------------------------"
test_endpoint "Teams List" "http://localhost:3001/api/trpc/teams.list?input=%7B%22json%22%3A%7B%7D%7D" "success"
test_endpoint "Projects List" "http://localhost:3001/api/trpc/projects.list?input=%7B%22json%22%3A%7B%7D%7D" "success"
test_endpoint "Tasks List" "http://localhost:3001/api/trpc/tasks.list?input=%7B%22json%22%3A%7B%7D%7D" "success"
test_endpoint "Prompts List" "http://localhost:3001/api/trpc/prompts.list?input=%7B%22json%22%3A%7B%7D%7D" "success"
test_endpoint "Users List" "http://localhost:3001/api/trpc/users.list?input=%7B%22json%22%3A%7B%7D%7D" "success"
test_endpoint "Models List" "http://localhost:3001/api/trpc/models.list?input=%7B%22json%22%3A%7B%7D%7D" "success"
test_endpoint "Chat Conversations List" "http://localhost:3001/api/trpc/chat.listConversations?input=%7B%22json%22%3A%7B%22userId%22%3A1%7D%7D" "success"
test_endpoint "Training Datasets List" "http://localhost:3001/api/trpc/training.listDatasets?input=%7B%22json%22%3A%7B%7D%7D" "success"
echo ""

echo "3️⃣  TESTES DE MONITORAMENTO"
echo "--------------------------------"
test_endpoint "System Metrics" "http://localhost:3001/api/trpc/monitoring.getCurrentMetrics?input=%7B%22json%22%3A%7B%7D%7D" "success"
test_endpoint "System Health" "http://localhost:3001/api/trpc/monitoring.getHealth?input=%7B%22json%22%3A%7B%7D%7D" "success"
echo ""

echo "4️⃣  TESTES DE ORQUESTRAÇÃO"
echo "--------------------------------"
test_endpoint "LM Studio Models" "http://localhost:3001/api/trpc/lmstudio.listModels?input=%7B%22json%22%3A%7B%7D%7D" "success"
test_endpoint "Services List" "http://localhost:3001/api/trpc/services.listServices?input=%7B%22json%22%3A%7B%7D%7D" "success"
echo ""

echo ""
echo "📊 RESULTADO FINAL"
echo "=================="
echo -e "${GREEN}✅ Passed: $PASS${NC}"
echo -e "${RED}❌ Failed: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 TODOS OS TESTES PASSARAM!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Alguns testes falharam. Verifique os logs acima.${NC}"
    exit 1
fi
