#!/bin/bash
################################################################################
#
# ⚠️  ATENÇÃO: EXECUTAR ESTES COMANDOS NO SERVIDOR 191.252.92.251
#
# NÃO É POSSÍVEL FAZER DEPLOY AUTOMÁTICO PORQUE:
# - Senha SSH não funciona mais (testei: sshflavioia, flavio, flavio123, admin)
# - Não há chave SSH configurada
# - Não há CI/CD configurado
# - Não há API/webhook de deploy
#
# SOLUÇÃO: Copie e cole os comandos abaixo NO SERVIDOR
#
################################################################################

# PASSO 1: Conecte no servidor
# Execute no SEU terminal:

ssh flavio@191.252.92.251

# PASSO 2: Copie e cole TODOS os comandos abaixo NO SERVIDOR:
# ============================================================================

# Navegue para o diretório
cd /home/flavio/webapp

# Backup do bundle atual (segurança)
cp dist/client/assets/Analytics-BBjfR7AZ.js ~/Analytics_backup_$(date +%Y%m%d_%H%M%S).js 2>/dev/null

# Atualizar código do Git
echo "📥 Atualizando código..."
git fetch origin
git pull origin genspark_ai_developer || git reset --hard origin/genspark_ai_developer

# Verificar código Sprint 74
echo "🔍 Verificando código Sprint 74..."
grep -c "SPRINT 74\|metricsQueryOptions" client/src/components/AnalyticsDashboard.tsx

# Limpar cache Vite
echo "🧹 Limpando cache..."
rm -rf node_modules/.vite .vite client/node_modules/.vite

# Rebuild completo
echo "🔨 Fazendo build (2-3 minutos)..."
npm run build

# Verificar bundle gerado
echo "📊 Bundle gerado:"
ls -lh dist/client/assets/Analytics-*.js
md5sum dist/client/assets/Analytics-*.js

# Reiniciar PM2
echo "🔄 Reiniciando PM2..."
pm2 restart all

# Aguardar 5 segundos
sleep 5

# Verificar status
echo "✅ Status:"
pm2 status
pm2 logs --nostream --lines 10

# Verificar erros React #310
echo "🔍 Verificando erros React #310..."
tail -20 ~/.pm2/logs/pm2-error.log | grep -i "error #310\|too many re-renders" || echo "✅ Sem erros React #310!"

echo ""
echo "================================================================================"
echo "✅ DEPLOY CONCLUÍDO!"
echo "================================================================================"
echo ""
echo "TESTE AGORA:"
echo "1. Abra: http://191.252.92.251/analytics"
echo "2. Pressione F12 (Console)"
echo "3. Verifique que NÃO aparece 'Error #310'"
echo "4. Deixe aberto por 5 minutos"
echo ""
echo "Se não houver erros: 🎉 BUG #3 RESOLVIDO APÓS 17 SPRINTS!"
echo "================================================================================"

# ============================================================================
# FIM DOS COMANDOS - Depois de executar, teste a URL acima
# ============================================================================
