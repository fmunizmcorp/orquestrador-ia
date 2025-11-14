#!/bin/bash

echo "🧪 SPRINT 22 - TEST PROMPT EXECUTION (TIMEOUT FIX VALIDATION)"
echo "=============================================================="
echo ""
echo "📋 Testing the 120s timeout fix for LM Studio integration"
echo "Expected: Response in 3-10 seconds (NOT 30s timeout)"
echo ""

BASE_URL="http://localhost:3001"

echo "🔍 Test 1: Simple prompt execution (should respond quickly)"
echo "-----------------------------------------------------------"
START=$(date +%s)

RESPONSE=$(curl -X POST "${BASE_URL}/api/prompts/execute" \
  -H "Content-Type: application/json" \
  -d '{"promptId": 1, "variables": {"code": "function hello() { return \"world\"; }"}}' \
  --max-time 15 \
  -s 2>&1)

END=$(date +%s)
DURATION=$((END - START))

echo ""
echo "⏱️  Response time: ${DURATION} seconds"
echo ""

# Parse response
if echo "$RESPONSE" | grep -q '"simulated":false'; then
  echo "✅ Integration: REAL (simulated: false confirmed)"
else
  echo "❌ Integration status unclear"
fi

if echo "$RESPONSE" | grep -q '"status":"completed"'; then
  echo "✅ Status: COMPLETED"
else
  echo "❌ Status: $(echo "$RESPONSE" | grep -o '"status":"[^"]*"' | head -1)"
fi

if echo "$RESPONSE" | grep -q 'timeout'; then
  echo "❌ TIMEOUT ERROR DETECTED - Fix did not work!"
else
  echo "✅ No timeout error"
fi

if [ $DURATION -lt 15 ]; then
  echo "✅ Response time acceptable (< 15s)"
else
  echo "❌ Response took too long (>= 15s)"
fi

echo ""
echo "📄 Full Response (first 500 chars):"
echo "$RESPONSE" | head -c 500
echo ""
echo ""

echo "🔍 Test 2: Check PM2 process status"
echo "-----------------------------------"
pm2 list | grep orquestrador

echo ""
echo "🔍 Test 3: Check recent logs for timeout patterns"
echo "------------------------------------------------"
pm2 logs orquestrador-v3 --lines 20 --nostream 2>&1 | grep -E "(timeout|Execution completed|🚀|✅)" | tail -10

echo ""
echo "=============================================================="
echo "✅ TEST COMPLETED"
echo ""
