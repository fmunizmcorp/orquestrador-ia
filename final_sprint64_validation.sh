#!/bin/bash

echo "🎯 =============================================="
echo "   SPRINT 64 - VALIDAÇÃO FINAL COMPLETA"
echo "   =============================================="
echo ""

SERVER="http://192.168.192.164:3001"
SUCCESS=0
TOTAL=10

test_query() {
    local name=$1
    local url=$2
    
    response=$(curl -s -w "\n%{http_code}" "$url" --max-time 5 2>&1)
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" = "200" ]; then
        echo "✅ $name (HTTP 200)"
        ((SUCCESS++))
        return 0
    else
        echo "❌ $name (HTTP $http_code)"
        return 1
    fi
}

echo "📊 TESTANDO 10 QUERIES:"
echo "─────────────────────────────────────────"

test_query "1. monitoring.getCurrentMetrics" "$SERVER/api/trpc/monitoring.getCurrentMetrics"
test_query "2. tasks.list" "$SERVER/api/trpc/tasks.list?input=%7B%22json%22%3A%7B%22limit%22%3A100%2C%22offset%22%3A0%7D%7D"
test_query "3. tasks.getStats" "$SERVER/api/trpc/tasks.getStats?input=%7B%22json%22%3A%7B%7D%7D"
test_query "4. projects.list" "$SERVER/api/trpc/projects.list?input=%7B%22json%22%3A%7B%22limit%22%3A100%2C%22offset%22%3A0%7D%7D"
test_query "5. workflows.list" "$SERVER/api/trpc/workflows.list?input=%7B%22json%22%3A%7B%22limit%22%3A100%2C%22offset%22%3A0%7D%7D"
test_query "6. workflows.getStats" "$SERVER/api/trpc/workflows.getStats"
test_query "7. templates.list" "$SERVER/api/trpc/templates.list?input=%7B%22json%22%3A%7B%22limit%22%3A100%2C%22offset%22%3A0%7D%7D"
test_query "8. templates.getStats" "$SERVER/api/trpc/templates.getStats"
test_query "9. prompts.list" "$SERVER/api/trpc/prompts.list?input=%7B%22json%22%3A%7B%22userId%22%3A1%2C%22limit%22%3A100%2C%22offset%22%3A0%7D%7D"
test_query "10. teams.list" "$SERVER/api/trpc/teams.list?input=%7B%22json%22%3A%7B%22limit%22%3A100%2C%22offset%22%3A0%7D%7D"

echo "─────────────────────────────────────────"
echo ""
echo "📈 RESULTADO: $SUCCESS/$TOTAL queries OK"
echo ""

if [ $SUCCESS -eq $TOTAL ]; then
    echo "🎉 ✅ TODAS AS QUERIES FUNCIONANDO!"
else
    echo "⚠️  Algumas queries falharam"
fi

echo ""
echo "🔍 ESTADO DO SISTEMA:"
echo "─────────────────────────────────────────"
echo -n "MySQL: "
systemctl is-active mysql >/dev/null 2>&1 && echo "✅ ONLINE" || echo "❌ OFFLINE"
echo -n "PM2: "
pm2 status | grep -q "orquestrador-v3.*online" && echo "✅ ONLINE" || echo "❌ OFFLINE"
echo -n "Build: "
[ -f "dist/client/assets/Analytics-CwqmYoum.js" ] && echo "✅ Analytics-CwqmYoum.js (NOVO)" || echo "❌ Build antigo"

echo ""
echo "=============================================="
