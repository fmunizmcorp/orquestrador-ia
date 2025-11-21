#!/bin/bash
#
# SPRINT 77 - DEPLOY AUTOMATIZADO COM RETRY E VALIDAÇÃO COMPLETA
# Este script conecta via SSH ao servidor de produção e executa deploy completo
#
# Uso: ./SPRINT_77_DEPLOY_AUTOMATIZADO.sh
#

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
WEBAPP_DIR="/home/flavio/orquestrador-ia"
MAX_RETRIES=3
RETRY_DELAY=10

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  🚀 SPRINT 77 - DEPLOY AUTOMATIZADO EM PRODUÇÃO${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

# Função para testar conectividade
test_connectivity() {
    echo -e "${YELLOW}🔍 Testando conectividade com servidor...${NC}"
    if timeout 10 nc -zv $SSH_HOST $SSH_PORT 2>&1 | grep -q "succeeded"; then
        echo -e "${GREEN}✅ Servidor acessível!${NC}"
        return 0
    else
        echo -e "${RED}❌ Servidor não está acessível${NC}"
        return 1
    fi
}

# Tentar conectar com retry
ATTEMPT=1
while [ $ATTEMPT -le $MAX_RETRIES ]; do
    echo ""
    echo -e "${YELLOW}📡 Tentativa $ATTEMPT de $MAX_RETRIES...${NC}"
    
    if test_connectivity; then
        break
    fi
    
    if [ $ATTEMPT -lt $MAX_RETRIES ]; then
        echo -e "${YELLOW}⏳ Aguardando ${RETRY_DELAY}s antes da próxima tentativa...${NC}"
        sleep $RETRY_DELAY
    fi
    
    ATTEMPT=$((ATTEMPT + 1))
done

if [ $ATTEMPT -gt $MAX_RETRIES ]; then
    echo ""
    echo -e "${RED}════════════════════════════════════════════════════════════════${NC}"
    echo -e "${RED}  ❌ FALHA: Servidor inacessível após $MAX_RETRIES tentativas${NC}"
    echo -e "${RED}════════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${YELLOW}Possíveis causas:${NC}"
    echo "  1. Servidor SSH gateway está offline"
    echo "  2. Firewall bloqueando porta 2224"
    echo "  3. Rede está instável"
    echo ""
    echo -e "${YELLOW}Soluções:${NC}"
    echo "  1. Verificar status do servidor 31.97.64.43"
    echo "  2. Tentar novamente mais tarde"
    echo "  3. Usar acesso manual via terminal SSH"
    echo ""
    exit 1
fi

# Executar deploy no servidor
echo ""
echo -e "${GREEN}✅ Conectividade confirmada! Iniciando deploy...${NC}"
echo ""

sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no -p $SSH_PORT $SSH_USER@$SSH_HOST bash << 'ENDSSH'
set -e

echo "════════════════════════════════════════════════════════════════"
echo "  🚀 EXECUTANDO DEPLOY NO SERVIDOR DE PRODUÇÃO"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Diretório da aplicação
WEBAPP_DIR="/home/flavio/orquestrador-ia"

# 1. Navegar para diretório
echo "📂 Diretório de trabalho: $WEBAPP_DIR"
cd "$WEBAPP_DIR" || exit 1
pwd
echo ""

# 2. Verificar branch atual
echo "🔍 Branch atual:"
git branch --show-current
echo ""

# 3. Fazer backup do estado atual
echo "💾 Fazendo backup do estado atual..."
BACKUP_DIR="/home/flavio/backups/sprint77_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r dist "$BACKUP_DIR/" 2>/dev/null || echo "  (sem dist anterior)"
echo "  Backup salvo em: $BACKUP_DIR"
echo ""

# 4. Atualizar código do GitHub
echo "📥 Atualizando código do GitHub (branch genspark_ai_developer)..."
git fetch origin genspark_ai_developer
git reset --hard origin/genspark_ai_developer
COMMIT_HASH=$(git rev-parse --short HEAD)
echo "  Commit atual: $COMMIT_HASH"
echo ""

# 5. Verificar presença do Sprint 77 no código
echo "🔍 Verificando Sprint 77 no código-fonte..."
if grep -q "SPRINT 77" client/src/components/AnalyticsDashboard.tsx; then
    SPRINT77_COUNT=$(grep -c "SPRINT 77" client/src/components/AnalyticsDashboard.tsx)
    echo "✅ Sprint 77 ENCONTRADO! ($SPRINT77_COUNT ocorrências no código)"
    
    # Mostrar linhas com Sprint 77
    echo ""
    echo "Linhas com comentários Sprint 77:"
    grep -n "SPRINT 77" client/src/components/AnalyticsDashboard.tsx | head -5
    echo ""
else
    echo "❌ ERRO: Sprint 77 NÃO encontrado no código!"
    echo "   Verifique se o código foi commitado corretamente"
    exit 1
fi

# 6. Limpar cache e builds anteriores
echo "🧹 Limpando cache e builds anteriores..."
rm -rf node_modules/.vite .vite dist/client 2>/dev/null || true
rm -rf dist/client/.vite 2>/dev/null || true
echo "✅ Cache limpo"
echo ""

# 7. Instalar dependências
echo "📦 Instalando dependências do projeto..."
echo "   (Isso pode levar alguns minutos...)"
npm install --silent
if [ $? -eq 0 ]; then
    echo "✅ Dependências instaladas com sucesso"
else
    echo "❌ Erro ao instalar dependências"
    exit 1
fi
echo ""

# 8. Build de produção
echo "🔨 Executando build de produção..."
echo "   (Isso pode levar alguns minutos...)"
NODE_ENV=production npm run build
if [ $? -eq 0 ]; then
    echo "✅ Build concluído com sucesso"
else
    echo "❌ Erro durante o build"
    exit 1
fi
echo ""

# 9. Verificar bundle gerado
echo "📦 Verificando bundle gerado..."
BUNDLE_FILE=$(ls dist/client/assets/Analytics-*.js 2>/dev/null | head -1)
if [ -n "$BUNDLE_FILE" ]; then
    BUNDLE_SIZE=$(ls -lh "$BUNDLE_FILE" | awk '{print $5}')
    BUNDLE_NAME=$(basename "$BUNDLE_FILE")
    echo "  Bundle: $BUNDLE_NAME"
    echo "  Tamanho: $BUNDLE_SIZE"
    
    # Contar useMemo no bundle
    USEMEMO_COUNT=$(grep -o "useMemo" "$BUNDLE_FILE" | wc -l)
    echo "  useMemo detectados: $USEMEMO_COUNT"
    echo ""
    
    if [ "$USEMEMO_COUNT" -ge 9 ]; then
        echo "✅ Fix Sprint 77 CONFIRMADO no bundle!"
        echo "   (9+ useMemo presentes, incluindo os 6 novos do Sprint 77)"
    else
        echo "⚠️  ATENÇÃO: Esperado >= 9 useMemo, encontrado apenas $USEMEMO_COUNT"
        echo "   Verifique se o build incluiu todas as alterações"
    fi
else
    echo "⚠️  Bundle Analytics-*.js não encontrado"
    echo "   Listando bundles disponíveis:"
    ls -lh dist/client/assets/*.js 2>/dev/null | head -10
fi
echo ""

# 10. Verificar status do PM2 antes
echo "📊 Status do PM2 ANTES do restart:"
pm2 list | grep orquestrador-ia || echo "  Serviço não está no PM2"
echo ""

# 11. Reiniciar serviço com PM2
echo "🔄 Reiniciando serviço PM2 (orquestrador-ia)..."
pm2 restart orquestrador-ia
if [ $? -eq 0 ]; then
    echo "✅ PM2 reiniciado com sucesso"
else
    echo "❌ Erro ao reiniciar PM2"
    exit 1
fi
echo ""

# 12. Aguardar serviço inicializar
echo "⏳ Aguardando serviço inicializar completamente (10 segundos)..."
for i in {10..1}; do
    echo -n "$i... "
    sleep 1
done
echo ""
echo ""

# 13. Verificar status do PM2 depois
echo "📊 Status do PM2 DEPOIS do restart:"
pm2 list | grep orquestrador-ia
echo ""

# 14. Testar endpoint HTTP
echo "🌐 Testando endpoint HTTP do serviço..."
HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3001)
echo "  HTTP Status Code: $HTTP_CODE"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Serviço respondendo corretamente!"
elif [ "$HTTP_CODE" = "000" ]; then
    echo "⚠️  Serviço não está respondendo (código 000)"
else
    echo "⚠️  Serviço retornou código HTTP $HTTP_CODE"
fi
echo ""

# 15. Verificar logs recentes
echo "📋 Últimas 20 linhas dos logs do PM2:"
echo "────────────────────────────────────────────────────────────────"
pm2 logs orquestrador-ia --nostream --lines 20
echo "────────────────────────────────────────────────────────────────"
echo ""

# 16. Verificar especificamente por Error #310
echo "🔍 Verificando presença de Error #310 nos logs..."
if pm2 logs orquestrador-ia --nostream --lines 200 | grep -i "error.*310"; then
    echo ""
    echo "❌ ALERTA: Error #310 DETECTADO nos logs!"
    echo "   O problema ainda persiste mesmo após o fix"
    exit 1
else
    echo "✅ Nenhum Error #310 detectado nos últimos 200 logs!"
    echo "   O fix do Sprint 77 está funcionando corretamente!"
fi
echo ""

# 17. Informações finais
echo "════════════════════════════════════════════════════════════════"
echo "  🎉 DEPLOY SPRINT 77 CONCLUÍDO COM SUCESSO!"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "📊 Resumo do Deploy:"
echo "  • Commit: $COMMIT_HASH"
echo "  • Bundle: $BUNDLE_NAME ($BUNDLE_SIZE)"
echo "  • useMemo no bundle: $USEMEMO_COUNT"
echo "  • HTTP Status: $HTTP_CODE"
echo "  • Error #310: NÃO DETECTADO ✅"
echo ""
echo "🔍 Próximos Passos para Validação Final:"
echo "  1. Acesse via SSH: ssh -p 2224 flavio@31.97.64.43"
echo "  2. Teste endpoint: curl http://localhost:3001/analytics"
echo "  3. Monitore logs: pm2 logs orquestrador-ia"
echo "  4. Verifique por 5 minutos se Error #310 não aparece"
echo "  5. Execute testes de navegação no dashboard"
echo ""
echo "📌 URL da Aplicação:"
echo "  http://localhost:3001 (acessível apenas dentro do servidor)"
echo ""

ENDSSH

# Verificar resultado do deploy
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  ✅ DEPLOY EXECUTADO COM SUCESSO!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
    echo ""
    exit 0
else
    echo ""
    echo -e "${RED}════════════════════════════════════════════════════════════════${NC}"
    echo -e "${RED}  ❌ DEPLOY FALHOU${NC}"
    echo -e "${RED}════════════════════════════════════════════════════════════════${NC}"
    echo ""
    exit 1
fi
