#!/bin/bash

SERVER_URL="http://192.168.192.164:3001"

echo "🧪 SPRINT 63 - VALIDAÇÃO COMPLETA DE TODAS AS 10 QUERIES"
echo "=========================================================="
echo ""

# Função para testar query tRPC
test_query() {
    local query_name=$1
    local query_path=$2
    
    echo "📊 Testando: $query_name"
    
    response=$(curl -s -w "\n%{http_code}" "${SERVER_URL}/api/trpc/${query_path}" \
        -H "Content-Type: application/json" \
        2>&1)
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" = "200" ]; then
        echo "   ✅ HTTP 200 - Query funcionando"
        # Verificar se não é erro de conexão no body
        if echo "$body" | grep -q "ECONNREFUSED\|error"; then
            echo "   ⚠️  WARNING: Possível erro no response body"
            echo "   Body: $body" | head -c 200
        else
            echo "   ✅ Response OK (sem erros de conexão)"
        fi
    else
        echo "   ❌ HTTP $http_code - FALHOU"
        echo "   Body: $body" | head -c 200
    fi
    echo ""
}

echo "1️⃣  Queries de Monitoramento:"
test_query "getCurrentMetrics" "monitoring.getCurrentMetrics"

echo ""
echo "2️⃣  Queries de Tasks:"
test_query "tasks.list" "tasks.list"
test_query "tasks.getStats" "tasks.getStats"

echo ""
echo "3️⃣  Queries de Projects:"
test_query "projects.list" "projects.list"

echo ""
echo "4️⃣  Queries de Workflows:"
test_query "workflows.list" "workflows.list"
test_query "workflows.getStats" "workflows.getStats"

echo ""
echo "5️⃣  Queries de Templates:"
test_query "templates.list" "templates.list"
test_query "templates.getStats" "templates.getStats"

echo ""
echo "6️⃣  Queries de Prompts:"
test_query "prompts.list" "prompts.list"

echo ""
echo "7️⃣  Queries de Teams:"
test_query "teams.list" "teams.list"

echo ""
echo "=========================================================="
echo "✅ VALIDAÇÃO COMPLETA FINALIZADA"
echo "=========================================================="
