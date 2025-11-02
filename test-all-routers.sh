#!/bin/bash

# Script de Validação Automática de TODOS os Routers
# EPIC 2: Validação Sistemática Completa

echo "🚀 INICIANDO VALIDAÇÃO COMPLETA DE TODOS OS ROUTERS"
echo "===================================================="
echo ""

API_URL="http://localhost:3001/api/trpc"
TOTAL_ROUTERS=0
ROUTERS_OK=0
ROUTERS_FAIL=0
ENDPOINTS_OK=0
ENDPOINTS_FAIL=0

# Array de routers para testar
ROUTERS=(
  "providers"
  "models"
  "specializedAIs"
  "credentials"
  "tasks"
  "subtasks"
  "templates"
  "workflows"
  "instructions"
  "knowledgeBase"
  "knowledgeSources"
  "executionLogs"
  "chat"
  "externalAPIAccounts"
  "systemMonitor"
  "puppeteer"
  "github"
  "gmail"
  "drive"
  "slack"
  "notion"
  "sheets"
  "discord"
  "training"
  "projects"
  "teams"
  "prompts"
)

# Função para testar endpoint
test_endpoint() {
  local router=$1
  local endpoint=$2
  local input=$3
  local url="${API_URL}/${router}.${endpoint}?input=${input}"
  
  RESPONSE=$(curl -s "$url")
  
  if echo "$RESPONSE" | grep -q '"error"'; then
    return 1
  else
    return 0
  fi
}

# Testar cada router
for router in "${ROUTERS[@]}"; do
  TOTAL_ROUTERS=$((TOTAL_ROUTERS + 1))
  echo "📦 Testando router: $router"
  
  ROUTER_ENDPOINTS=0
  ROUTER_OK=0
  
  # Testar endpoint .list
  if test_endpoint "$router" "list" "%7B%22json%22%3A%7B%7D%7D"; then
    echo "  ✅ ${router}.list"
    ROUTER_OK=$((ROUTER_OK + 1))
    ENDPOINTS_OK=$((ENDPOINTS_OK + 1))
  else
    echo "  ❌ ${router}.list"
    ENDPOINTS_FAIL=$((ENDPOINTS_FAIL + 1))
  fi
  ROUTER_ENDPOINTS=$((ROUTER_ENDPOINTS + 1))
  
  # Verificar paginação se list funcionar
  if test_endpoint "$router" "list" "%7B%22json%22%3A%7B%22page%22%3A1%2C%22limit%22%3A5%7D%7D"; then
    RESPONSE=$(curl -s "${API_URL}/${router}.list?input=%7B%22json%22%3A%7B%22page%22%3A1%2C%22limit%22%3A5%7D%7D")
    TOTAL=$(echo "$RESPONSE" | grep -o '"total":[0-9]*' | head -1 | cut -d':' -f2)
    if [ -n "$TOTAL" ]; then
      echo "     📊 Total de registros: $TOTAL"
    fi
  fi
  
  # Se router teve sucesso em pelo menos 1 endpoint
  if [ $ROUTER_OK -gt 0 ]; then
    ROUTERS_OK=$((ROUTERS_OK + 1))
  else
    ROUTERS_FAIL=$((ROUTERS_FAIL + 1))
  fi
  
  echo ""
done

# Relatório Final
echo "===================================================="
echo "📊 RELATÓRIO FINAL DE VALIDAÇÃO"
echo "===================================================="
echo ""
echo "ROUTERS:"
echo "  Total testados: $TOTAL_ROUTERS"
echo "  ✅ Funcionando: $ROUTERS_OK ($(( ROUTERS_OK * 100 / TOTAL_ROUTERS ))%)"
echo "  ❌ Com problemas: $ROUTERS_FAIL"
echo ""
echo "ENDPOINTS:"
echo "  Total testados: $((ENDPOINTS_OK + ENDPOINTS_FAIL))"
echo "  ✅ Funcionando: $ENDPOINTS_OK ($(( ENDPOINTS_OK * 100 / (ENDPOINTS_OK + ENDPOINTS_FAIL) ))%)"
echo "  ❌ Falhando: $ENDPOINTS_FAIL"
echo ""

if [ $ROUTERS_FAIL -eq 0 ]; then
  echo "🎉 TODOS OS ROUTERS ESTÃO FUNCIONANDO!"
  exit 0
else
  echo "⚠️  Alguns routers precisam de correção"
  exit 1
fi
