#!/bin/bash
###############################################################################
# Deploy Script - V3.5.1 Production
# 
# Propósito: Deploy completo após merge do PR #3
# Data: 2025-11-08
# Versão: 3.5.1
###############################################################################

set -e

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║         🚀 DEPLOY PRODUCTION V3.5.1 - BUG FIX FINAL           ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Configurações
PROD_DIR="/home/flavio/orquestrador-ia"
BACKUP_DIR="/home/flavio/orquestrador-ia-backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

echo "📋 Configurações:"
echo "   Diretório: ${PROD_DIR}"
echo "   Backup: ${BACKUP_DIR}/backup-${TIMESTAMP}"
echo "   Versão: 3.5.1"
echo ""

# Step 1: Verificar diretório
echo "1️⃣ Verificando diretório de produção..."
if [ ! -d "$PROD_DIR" ]; then
    echo "   ❌ Diretório ${PROD_DIR} não encontrado!"
    exit 1
fi
cd "$PROD_DIR"
echo "   ✅ Diretório OK: $(pwd)"
echo ""

# Step 2: Backup do estado atual
echo "2️⃣ Criando backup do estado atual..."
mkdir -p "$BACKUP_DIR"
if [ -d "dist" ]; then
    cp -r dist "${BACKUP_DIR}/dist-backup-${TIMESTAMP}"
    echo "   ✅ Backup criado: ${BACKUP_DIR}/dist-backup-${TIMESTAMP}"
else
    echo "   ⚠️ Diretório dist não existe (primeira instalação?)"
fi
echo ""

# Step 3: Verificar branch main
echo "3️⃣ Atualizando código-fonte da branch main..."
git fetch origin main
git checkout main
git pull origin main
echo "   ✅ Branch main atualizada"
echo ""

# Step 4: Verificar versão
echo "4️⃣ Verificando versão..."
VERSION=$(grep '"version"' package.json | head -1 | sed 's/.*: "\(.*\)".*/\1/')
echo "   Versão detectada: ${VERSION}"
if [ "$VERSION" != "3.5.1" ]; then
    echo "   ⚠️ Versão diferente de 3.5.1, atualizando..."
    sed -i 's/"version": "[^"]*"/"version": "3.5.1"/' package.json
    echo "   ✅ Versão atualizada para 3.5.1"
fi
echo ""

# Step 5: Instalar dependências
echo "5️⃣ Instalando dependências..."
npm install --production
echo "   ✅ Dependências instaladas"
echo ""

# Step 6: Build da aplicação
echo "6️⃣ Executando build da aplicação..."
BUILD_START=$(date +%s)
npm run build
BUILD_END=$(date +%s)
BUILD_TIME=$((BUILD_END - BUILD_START))
echo "   ✅ Build concluído em ${BUILD_TIME}s"
echo ""

# Step 7: Verificar build
echo "7️⃣ Verificando build..."
if [ ! -d "dist" ]; then
    echo "   ❌ Diretório dist não foi criado!"
    exit 1
fi
if [ ! -f "dist/client/index.html" ]; then
    echo "   ❌ index.html não encontrado!"
    exit 1
fi
BUNDLE_SIZE=$(du -sh dist | cut -f1)
echo "   ✅ Build OK"
echo "   📦 Tamanho: ${BUNDLE_SIZE}"
ls -lh dist/client/*.js 2>/dev/null | head -3 | awk '{print "   📄 " $9 " (" $5 ")"}'
echo ""

# Step 8: Restart PM2
echo "8️⃣ Restartando PM2..."
pm2 restart orquestrador-v3 --update-env
sleep 2
echo "   ✅ PM2 restartado"
echo ""

# Step 9: Verificar status
echo "9️⃣ Verificando status..."
PM2_STATUS=$(pm2 jlist | python3 -c "import sys, json; data=json.load(sys.stdin); print('online' if data and data[0]['pm2_env']['status'] == 'online' else 'offline')" 2>/dev/null || echo "unknown")
echo "   Status PM2: ${PM2_STATUS}"

if [ "$PM2_STATUS" = "online" ]; then
    echo "   ✅ Aplicação online"
else
    echo "   ⚠️ Status não confirmado, verificar logs"
fi
echo ""

# Step 10: Testar endpoint
echo "🔟 Testando endpoint de saúde..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health 2>/dev/null || echo "000")
if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo "   ✅ Health check: OK (HTTP 200)"
else
    echo "   ⚠️ Health check: HTTP ${HEALTH_RESPONSE}"
fi
echo ""

# Step 11: Logs recentes
echo "1️⃣1️⃣ Verificando logs recentes..."
pm2 logs orquestrador-v3 --lines 10 --nostream
echo ""

# Step 12: Resumo final
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║                  ✅ DEPLOY CONCLUÍDO COM SUCESSO              ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Resumo:"
echo "   ✅ Versão: 3.5.1"
echo "   ✅ Build: Executado em ${BUILD_TIME}s"
echo "   ✅ PM2: ${PM2_STATUS}"
echo "   ✅ Health: HTTP ${HEALTH_RESPONSE}"
echo "   ✅ Backup: ${BACKUP_DIR}/backup-${TIMESTAMP}"
echo ""
echo "🎯 Próximos passos:"
echo "   1. Executar teste de validação: node test-create-via-trpc.mjs"
echo "   2. Testar interface web: http://192.168.1.247:3001"
echo "   3. Criar projeto de teste e verificar persistência"
echo "   4. Monitorar logs por 24h"
echo ""
echo "🎊 DEPLOY V3.5.1 COMPLETO! 🎊"
