#!/bin/bash
# Testes CRUD Granulares - FASE 4
set +e
cd /home/flavio/webapp

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASS=0
FAIL=0

echo "🧪 TESTES CRUD GRANULARES - FASE 4"
echo "==================================="
echo ""

# Função de teste
test_crud() {
    local name=$1
    local method=$2
    local url=$3
    local data=$4
    local expected=$5
    
    echo -n "Testing $name... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s "$url")
    else
        response=$(curl -s -X POST "$url" -H "Content-Type: application/json" -d "$data")
    fi
    
    if echo "$response" | grep -q "$expected"; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASS=$((PASS + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "Response: $response" | head -100
        FAIL=$((FAIL + 1))
        return 1
    fi
}

echo "1️⃣  CREATE OPERATIONS"
echo "---------------------"

# Test: Create Team
TEAM_DATA='{"0":{"json":{"name":"Team CRUD Test","description":"Testing CRUD operations","ownerId":1}}}'
test_crud "Create Team" "POST" "http://localhost:3001/api/trpc/teams.create" "$TEAM_DATA" "success"

# Test: Create Project  
PROJECT_DATA='{"0":{"json":{"name":"Project CRUD Test","description":"Testing project creation","userId":1,"status":"active"}}}'
test_crud "Create Project" "POST" "http://localhost:3001/api/trpc/projects.create" "$PROJECT_DATA" "success"

# Test: Create Task
TASK_DATA='{"0":{"json":{"title":"Task CRUD Test","description":"Testing task creation","projectId":1,"assignedToUserId":1,"status":"pending","priority":"medium"}}}'
test_crud "Create Task" "POST" "http://localhost:3001/api/trpc/tasks.create" "$TASK_DATA" "success"

# Test: Create Prompt
PROMPT_DATA='{"0":{"json":{"title":"Prompt CRUD Test","content":"Testing prompt creation","category":"test","userId":1}}}'
test_crud "Create Prompt" "POST" "http://localhost:3001/api/trpc/prompts.create" "$PROMPT_DATA" "success"

echo ""
echo "2️⃣  READ OPERATIONS (já testados)"
echo "--------------------------------"
test_crud "List Teams" "GET" "http://localhost:3001/api/trpc/teams.list?input=%7B%22json%22%3A%7B%7D%7D" "" "success"
test_crud "List Projects" "GET" "http://localhost:3001/api/trpc/projects.list?input=%7B%22json%22%3A%7B%7D%7D" "" "success"
test_crud "List Tasks" "GET" "http://localhost:3001/api/trpc/tasks.list?input=%7B%22json%22%3A%7B%7D%7D" "" "success"
test_crud "List Prompts" "GET" "http://localhost:3001/api/trpc/prompts.list?input=%7B%22json%22%3A%7B%7D%7D" "" "success"

echo ""
echo "3️⃣  ADVANCED TESTS"
echo "------------------"

# Test: Chat with userId parameter
test_crud "Chat Conversations" "GET" "http://localhost:3001/api/trpc/chat.listConversations?input=%7B%22json%22%3A%7B%22userId%22%3A1%7D%7D" "" "success"

# Test: External Services (now with table)
test_crud "External Services" "GET" "http://localhost:3001/api/trpc/services.listServices?input=%7B%22json%22%3A%7B%7D%7D" "" "success"

# Test: Monitoring with real metrics
test_crud "System Metrics" "GET" "http://localhost:3001/api/trpc/monitoring.getCurrentMetrics?input=%7B%22json%22%3A%7B%7D%7D" "" "cpu"

echo ""
echo "📊 RESULTADO FINAL"
echo "=================="
echo -e "${GREEN}✅ Passed: $PASS${NC}"
echo -e "${RED}❌ Failed: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 100% DOS TESTES PASSARAM!${NC}"
    exit 0
else
    PERCENTAGE=$(awk "BEGIN {print ($PASS/($PASS+$FAIL))*100}")
    echo -e "${YELLOW}⚠️  Taxa de Sucesso: ${PERCENTAGE}%${NC}"
    exit 1
fi
