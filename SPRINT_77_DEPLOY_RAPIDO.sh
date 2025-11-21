#!/bin/bash
#
# SPRINT 77 - DEPLOY RÁPIDO EM PRODUÇÃO
# Execute este script DENTRO do servidor de produção via SSH
#

set -e

echo "════════════════════════════════════════════════════════════════"
echo "  🚀 SPRINT 77 - DEPLOY RÁPIDO"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Diretório da aplicação
WEBAPP_DIR="/home/flavio/orquestrador-ia"

# 1. Ir para diretório
echo "📂 Navegando para $WEBAPP_DIR..."
cd "$WEBAPP_DIR" || exit 1

# 2. Atualizar código
echo "📥 Atualizando código..."
git fetch origin genspark_ai_developer
git reset --hard origin/genspark_ai_developer

# 3. Verificar Sprint 77
echo "🔍 Verificando Sprint 77..."
if grep -q "SPRINT 77" client/src/components/AnalyticsDashboard.tsx; then
    echo "✅ Sprint 77 encontrado!"
    grep -c "SPRINT 77" client/src/components/AnalyticsDashboard.tsx
else
    echo "❌ Sprint 77 NÃO encontrado!"
    exit 1
fi

# 4. Limpar cache
echo "🧹 Limpando cache..."
rm -rf node_modules/.vite .vite dist/client

# 5. Instalar dependências
echo "📦 Instalando dependências..."
npm install --silent

# 6. Build de produção
echo "🔨 Executando build..."
NODE_ENV=production npm run build

# 7. Verificar bundle
echo "📦 Verificando bundle..."
ls -lh dist/client/assets/Analytics-*.js

USEMEMO_COUNT=$(grep -o "useMemo" dist/client/assets/Analytics-*.js | wc -l)
echo "useMemo no bundle: $USEMEMO_COUNT"

if [ "$USEMEMO_COUNT" -ge 9 ]; then
    echo "✅ Fix Sprint 77 presente no bundle!"
else
    echo "⚠️  Esperado >= 9 useMemo, encontrado $USEMEMO_COUNT"
fi

# 8. Reiniciar PM2
echo "🔄 Reiniciando PM2..."
pm2 restart orquestrador-v3

# 9. Aguardar serviço iniciar
echo "⏳ Aguardando 5 segundos..."
sleep 5

# 10. Verificar serviço
echo "✅ Testando serviço..."
HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3001)
echo "HTTP Status: $HTTP_CODE"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Serviço respondendo!"
else
    echo "⚠️  Serviço retornou $HTTP_CODE"
fi

# 11. Verificar logs
echo "📋 Últimas linhas dos logs:"
pm2 logs orquestrador-v3 --nostream --lines 20 | tail -10

# 12. Verificar Error #310
echo "🔍 Verificando Error #310..."
if pm2 logs orquestrador-v3 --nostream --lines 50 | grep -q "Error #310"; then
    echo "❌ Error #310 ainda presente!"
    exit 1
else
    echo "✅ Nenhum Error #310 detectado!"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  🎉 DEPLOY SPRINT 77 CONCLUÍDO COM SUCESSO!"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Para validar:"
echo "1. Acesse: http://localhost:3001/analytics"
echo "2. Abra DevTools (F12) → Console"
echo "3. Verifique ausência de 'Error #310'"
echo "4. Monitore por 5 minutos"
echo ""
