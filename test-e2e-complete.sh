#!/bin/bash
# ========================================
# TESTE E2E COMPLETO - 16 ROUTERS tRPC
# Sistema Orquestrador de IAs v3.5.2
# SCRUM + PDCA Methodology
# ========================================

API_URL="http://localhost:3001/api"
TRPC_URL="$API_URL/trpc"
PASSED=0
FAILED=0
TOTAL=0

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "=================================================="
echo "  TESTE E2E COMPLETO - 16 ROUTERS tRPC"
echo "  Sistema Orquestrador de IAs v3.5.2"
echo "=================================================="
echo ""

test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_field="$3"
    
    TOTAL=$((TOTAL + 1))
    echo -n "[$TOTAL] Testing $name... "
    
    response=$(curl -s "$url")
    
    if echo "$response" | jq -e "$expected_field" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "   Response: $(echo "$response" | jq -c '.' 2>/dev/null || echo "$response")"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

test_mutation() {
    local name="$1"
    local url="$2"
    local data="$3"
    local expected_field="$4"
    
    TOTAL=$((TOTAL + 1))
    echo -n "[$TOTAL] Testing $name... "
    
    response=$(curl -s -X POST -H "Content-Type: application/json" -d "$data" "$url")
    
    if echo "$response" | jq -e "$expected_field" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "   Response: $(echo "$response" | jq -c '.' 2>/dev/null || echo "$response")"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

echo "=== 1. HEALTH CHECK ==="
test_endpoint "Health Check" "$API_URL/health" ".status"
echo ""

echo "=== 2. REST API (6 endpoints) ==="
test_endpoint "GET /api/projects" "$API_URL/projects" ".data"
test_endpoint "GET /api/teams" "$API_URL/teams" ".data"
test_endpoint "GET /api/prompts" "$API_URL/prompts" ".data"
test_endpoint "GET /api/tasks" "$API_URL/tasks" ".data"
test_endpoint "GET /api/models" "$API_URL/models" ".data"
test_endpoint "GET /api/templates" "$API_URL/templates" ".data"
echo ""

echo "=== 3. AUTH ROUTER ==="
test_mutation "auth.login" "$TRPC_URL/auth.login" '{"json":{"email":"admin@orquestrador.com","password":"admin123"}}' ".result.data.json.success"
echo ""

echo "=== 4. CHAT ROUTER ==="
test_endpoint "chat.listConversations" "$TRPC_URL/chat.listConversations?input=%7B%22json%22%3A%7B%22userId%22%3A1%7D%7D" ".result.data.json"
echo ""

echo "=== 5. KNOWLEDGEBASE ROUTER ==="
test_endpoint "knowledgebase.list" "$TRPC_URL/knowledgebase.list?input=%7B%22json%22%3A%7B%22limit%22%3A10%7D%7D" ".result.data.json"
echo ""

echo "=== 6. LM STUDIO ROUTER ==="
test_endpoint "lmstudio.checkStatus" "$TRPC_URL/lmstudio.checkStatus" ".result.data.json.isRunning"
test_endpoint "lmstudio.listModels" "$TRPC_URL/lmstudio.listModels?input=%7B%22json%22%3A%7B%22forceRefresh%22%3Afalse%7D%7D" ".result.data.json.models"
echo ""

echo "=== 7. MODELS ROUTER ==="
test_endpoint "models.list" "$TRPC_URL/models.list?input=%7B%22json%22%3A%7B%22limit%22%3A10%7D%7D" ".result.data.json.models"
echo ""

echo "=== 8. MONITORING ROUTER ==="
test_endpoint "monitoring.getSystemStatus" "$TRPC_URL/monitoring.getSystemStatus" ".result.data.json"
test_endpoint "monitoring.getMetrics" "$TRPC_URL/monitoring.getMetrics?input=%7B%22json%22%3A%7B%22period%22%3A%22hour%22%7D%7D" ".result.data.json"
echo ""

echo "=== 9. PROJECTS ROUTER ==="
test_endpoint "projects.list" "$TRPC_URL/projects.list?input=%7B%22json%22%3A%7B%22limit%22%3A10%7D%7D" ".result.data.json"
echo ""

echo "=== 10. PROMPTS ROUTER ==="
test_endpoint "prompts.list" "$TRPC_URL/prompts.list?input=%7B%22json%22%3A%7B%22limit%22%3A10%7D%7D" ".result.data.json"
echo ""

echo "=== 11. SERVICES ROUTER ==="
test_endpoint "services.list" "$TRPC_URL/services.list" ".result.data.json"
echo ""

echo "=== 12. SETTINGS ROUTER ==="
test_endpoint "settings.list" "$TRPC_URL/settings.list" ".result.data.json"
echo ""

echo "=== 13. TASKS ROUTER ==="
test_endpoint "tasks.list" "$TRPC_URL/tasks.list?input=%7B%22json%22%3A%7B%22limit%22%3A10%7D%7D" ".result.data.json"
echo ""

echo "=== 14. TEAMS ROUTER ==="
test_endpoint "teams.list" "$TRPC_URL/teams.list?input=%7B%22json%22%3A%7B%22limit%22%3A10%7D%7D" ".result.data.json"
echo ""

echo "=== 15. TEMPLATES ROUTER ==="
test_endpoint "templates.list" "$TRPC_URL/templates.list?input=%7B%22json%22%3A%7B%22limit%22%3A10%7D%7D" ".result.data.json"
echo ""

echo "=== 16. TRAINING ROUTER ==="
test_endpoint "training.listJobs" "$TRPC_URL/training.listJobs?input=%7B%22json%22%3A%7B%22limit%22%3A10%7D%7D" ".result.data.json"
echo ""

echo "=== 17. USERS ROUTER ==="
test_endpoint "users.list" "$TRPC_URL/users.list?input=%7B%22json%22%3A%7B%22limit%22%3A10%7D%7D" ".result.data.json"
echo ""

echo "=== 18. WORKFLOWS ROUTER ==="
test_endpoint "workflows.list" "$TRPC_URL/workflows.list?input=%7B%22json%22%3A%7B%22limit%22%3A10%7D%7D" ".result.data.json"
test_mutation "workflows.create" "$TRPC_URL/workflows.create" '{"json":{"name":"E2E Test Workflow","description":"Automated test","steps":[{"id":"step1","name":"Test","type":"task"}]}}' ".result.data.json.success"
echo ""

echo "=================================================="
echo "  RESULTADOS FINAIS"
echo "=================================================="
echo -e "Total de testes: ${BLUE}$TOTAL${NC}"
echo -e "Testes passados: ${GREEN}$PASSED${NC}"
echo -e "Testes falhados: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 TODOS OS TESTES PASSARAM! Sistema 100% operacional!${NC}"
    exit 0
else
    PASS_RATE=$((PASSED * 100 / TOTAL))
    echo -e "${RED}⚠️  Alguns testes falharam. Taxa de sucesso: $PASS_RATE%${NC}"
    exit 1
fi
