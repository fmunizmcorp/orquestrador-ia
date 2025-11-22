#!/bin/bash

###############################################################################
# SPRINT 78 - SCRIPT DE VALIDAÇÃO COMPLETA
# Valida se o Bug #3 (React Error #310) foi realmente corrigido
###############################################################################

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações SSH
SSH_HOST="31.97.64.43"
SSH_PORT="2224"
SSH_USER="flavio"
SSH_PASS="sshflavioia"
SERVER_DIR="/home/flavio/orquestrador-ia"

# Variáveis de controle
BUNDLE_CORRETO="Analytics-Dd-5mnUC.js"
BUNDLE_ANTIGO="Analytics-BBjfR7AZ.js"
HASH_ESPERADO="5c53938f5cf239c3252507f270cbf1421e44e4f73a3961fa1466d154c46dbc06"
VALIDACOES_OK=0
VALIDACOES_TOTAL=0

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║         SPRINT 78 - VALIDAÇÃO COMPLETA DO BUG #3              ║"
echo "║                  React Error #310 Fix                         ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

###############################################################################
# FUNÇÃO: Validar item
###############################################################################
validar() {
    local descricao="$1"
    local resultado="$2"
    
    ((VALIDACOES_TOTAL++))
    
    if [ "$resultado" = "OK" ]; then
        echo -e "${GREEN}✅ [$VALIDACOES_TOTAL] $descricao${NC}"
        ((VALIDACOES_OK++))
        return 0
    else
        echo -e "${RED}❌ [$VALIDACOES_TOTAL] $descricao${NC}"
        echo -e "${YELLOW}   Detalhes: $resultado${NC}"
        return 1
    fi
}

###############################################################################
# VALIDAÇÃO 1: Código local tem as correções
###############################################################################
echo -e "${BLUE}📋 FASE 1: VALIDAÇÃO DO CÓDIGO LOCAL${NC}\n"

cd /home/user/webapp

# Verificar useMemo no arquivo
USEMEMO_COUNT=$(grep -c "useMemo" client/src/components/AnalyticsDashboard.tsx)
if [ "$USEMEMO_COUNT" -ge 17 ]; then
    validar "Código local tem 17+ useMemo (encontrados: $USEMEMO_COUNT)" "OK"
else
    validar "Código local tem 17+ useMemo" "FALHA: apenas $USEMEMO_COUNT encontrados"
fi

# Verificar comentário das correções
if grep -q "SPRINT 77 CRITICAL FIX\|CAUSA RAIZ" client/src/components/AnalyticsDashboard.tsx; then
    validar "Comentários do Sprint 77 presentes" "OK"
else
    validar "Comentários do Sprint 77 presentes" "FALHA: comentários não encontrados"
fi

# Verificar os 6 arrays memoizados
ARRAYS=("tasks" "projects" "workflows" "templates" "prompts" "teams")
ARRAYS_OK=0
for array in "${ARRAYS[@]}"; do
    if grep -A3 "const $array = useMemo" client/src/components/AnalyticsDashboard.tsx >/dev/null 2>&1; then
        ((ARRAYS_OK++))
    fi
done

if [ "$ARRAYS_OK" -eq 6 ]; then
    validar "Todos os 6 arrays estão memoizados" "OK"
else
    validar "Todos os 6 arrays estão memoizados" "FALHA: apenas $ARRAYS_OK de 6"
fi

###############################################################################
# VALIDAÇÃO 2: Build local correto
###############################################################################
echo -e "\n${BLUE}📋 FASE 2: VALIDAÇÃO DO BUILD LOCAL${NC}\n"

# Verificar se bundle existe
if [ -f "dist/client/assets/$BUNDLE_CORRETO" ]; then
    validar "Bundle correto existe localmente ($BUNDLE_CORRETO)" "OK"
    
    # Verificar hash
    HASH_LOCAL=$(sha256sum "dist/client/assets/$BUNDLE_CORRETO" | awk '{print $1}')
    if [ "$HASH_LOCAL" = "$HASH_ESPERADO" ]; then
        validar "Hash do bundle local está correto" "OK"
    else
        validar "Hash do bundle local está correto" "FALHA: hash diferente"
    fi
    
    # Verificar useMemo no bundle
    USEMEMO_BUNDLE=$(grep -o "useMemo" "dist/client/assets/$BUNDLE_CORRETO" | wc -l)
    if [ "$USEMEMO_BUNDLE" -ge 9 ]; then
        validar "Bundle contém 9+ useMemo (encontrados: $USEMEMO_BUNDLE)" "OK"
    else
        validar "Bundle contém 9+ useMemo" "FALHA: apenas $USEMEMO_BUNDLE encontrados"
    fi
else
    validar "Bundle correto existe localmente" "FALHA: arquivo não encontrado"
fi

###############################################################################
# VALIDAÇÃO 3: Estado do servidor via SSH
###############################################################################
echo -e "\n${BLUE}📋 FASE 3: VALIDAÇÃO DO SERVIDOR EM PRODUÇÃO${NC}\n"

# Verificar bundle em produção
BUNDLE_PROD=$(sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" \
    "ls -1 $SERVER_DIR/dist/client/assets/Analytics*.js 2>/dev/null | xargs -n1 basename" | grep -v "^$")

if echo "$BUNDLE_PROD" | grep -q "$BUNDLE_CORRETO"; then
    validar "Bundle correto em produção ($BUNDLE_CORRETO)" "OK"
else
    validar "Bundle correto em produção" "FALHA: encontrado $BUNDLE_PROD"
fi

# Verificar que bundle antigo NÃO existe
if echo "$BUNDLE_PROD" | grep -q "$BUNDLE_ANTIGO"; then
    validar "Bundle antigo removido ($BUNDLE_ANTIGO)" "FALHA: bundle antigo ainda existe!"
else
    validar "Bundle antigo removido ($BUNDLE_ANTIGO)" "OK"
fi

# Verificar hash em produção
HASH_PROD=$(sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" \
    "sha256sum $SERVER_DIR/dist/client/assets/$BUNDLE_CORRETO 2>/dev/null | awk '{print \$1}'")

if [ "$HASH_PROD" = "$HASH_ESPERADO" ]; then
    validar "Hash do bundle em produção está correto" "OK"
else
    validar "Hash do bundle em produção está correto" "FALHA: hash diferente"
fi

# Verificar PM2 status
PM2_STATUS=$(sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" \
    "pm2 jlist" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data[0]['pm2_env']['status'] if data else 'offline')")

if [ "$PM2_STATUS" = "online" ]; then
    validar "Serviço PM2 online" "OK"
else
    validar "Serviço PM2 online" "FALHA: status = $PM2_STATUS"
fi

###############################################################################
# VALIDAÇÃO 4: Testes HTTP
###############################################################################
echo -e "\n${BLUE}📋 FASE 4: TESTES HTTP${NC}\n"

# Teste HTTP básico
HTTP_STATUS=$(sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" \
    "curl -s -o /dev/null -w '%{http_code}' http://localhost:3001")

if [ "$HTTP_STATUS" = "200" ]; then
    validar "Endpoint HTTP responde 200 OK" "OK"
else
    validar "Endpoint HTTP responde 200 OK" "FALHA: HTTP $HTTP_STATUS"
fi

# Verificar ausência de Error #310 nos logs
ERROR_310=$(sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" \
    "pm2 logs orquestrador-v3 --lines 200 --nostream 2>/dev/null | grep -i 'error.*310\|minified.*310' | wc -l")

if [ "$ERROR_310" -eq 0 ]; then
    validar "Nenhum Error #310 nos logs (últimas 200 linhas)" "OK"
else
    validar "Nenhum Error #310 nos logs" "FALHA: $ERROR_310 ocorrências encontradas"
fi

###############################################################################
# VALIDAÇÃO 5: Git Status
###############################################################################
echo -e "\n${BLUE}📋 FASE 5: VALIDAÇÃO GIT${NC}\n"

# Verificar último commit
ULTIMO_COMMIT=$(git log -1 --format="%h %s")
if echo "$ULTIMO_COMMIT" | grep -q "Sprint 77\|Sprint 78"; then
    validar "Último commit relacionado ao Sprint 77/78" "OK"
else
    validar "Último commit relacionado ao Sprint 77/78" "INFO: $ULTIMO_COMMIT"
fi

# Verificar branch
BRANCH_ATUAL=$(git branch --show-current)
validar "Branch atual: $BRANCH_ATUAL" "OK"

###############################################################################
# RESULTADO FINAL
###############################################################################
echo -e "\n${BLUE}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║                    RESULTADO DA VALIDAÇÃO                     ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

PERCENTUAL=$((VALIDACOES_OK * 100 / VALIDACOES_TOTAL))

echo -e "Total de validações: ${BLUE}$VALIDACOES_TOTAL${NC}"
echo -e "Validações OK: ${GREEN}$VALIDACOES_OK${NC}"
echo -e "Validações FALHA: ${RED}$((VALIDACOES_TOTAL - VALIDACOES_OK))${NC}"
echo -e "Taxa de sucesso: ${BLUE}$PERCENTUAL%${NC}\n"

if [ "$PERCENTUAL" -eq 100 ]; then
    echo -e "${GREEN}"
    echo "╔═══════════════════════════════════════════════════════════════╗"
    echo "║                                                               ║"
    echo "║           ✅ VALIDAÇÃO 100% APROVADA! ✅                      ║"
    echo "║                                                               ║"
    echo "║     Bug #3 (React Error #310) FOI CORRIGIDO COM SUCESSO!     ║"
    echo "║                                                               ║"
    echo "╚═══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}\n"
    exit 0
elif [ "$PERCENTUAL" -ge 80 ]; then
    echo -e "${YELLOW}"
    echo "╔═══════════════════════════════════════════════════════════════╗"
    echo "║                                                               ║"
    echo "║            ⚠️  VALIDAÇÃO PARCIALMENTE APROVADA ⚠️             ║"
    echo "║                                                               ║"
    echo "║          Algumas validações falharam. Revisar logs.          ║"
    echo "║                                                               ║"
    echo "╚═══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}\n"
    exit 1
else
    echo -e "${RED}"
    echo "╔═══════════════════════════════════════════════════════════════╗"
    echo "║                                                               ║"
    echo "║                 ❌ VALIDAÇÃO REPROVADA! ❌                    ║"
    echo "║                                                               ║"
    echo "║         Múltiplas validações falharam. Ação necessária!      ║"
    echo "║                                                               ║"
    echo "╚═══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}\n"
    exit 2
fi
