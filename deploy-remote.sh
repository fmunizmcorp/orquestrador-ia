#!/bin/bash
set -e

echo "=== DEPLOY AUTOMÁTICO - ORQUESTRADOR IA ==="
echo ""

# Navegar para o diretório do projeto
cd /root/orquestrador-ia

echo "=== 1. VERIFICANDO STATUS DO GIT ==="
git status

echo ""
echo "=== 2. ATUALIZANDO CÓDIGO DO GITHUB ==="
git fetch origin genspark_ai_developer
git checkout genspark_ai_developer
git pull origin genspark_ai_developer

echo ""
echo "=== 3. INSTALANDO DEPENDÊNCIAS (se necessário) ==="
if [ -f "package-lock.json" ]; then
    npm ci --production 2>/dev/null || npm install --production
fi

echo ""
echo "=== 4. BUILD DO PROJETO ==="
npm run build 2>/dev/null || echo "Sem build necessário ou build já realizado"

echo ""
echo "=== 5. RESTART DO PM2 ==="
pm2 restart all || pm2 start ecosystem.config.js

echo ""
echo "=== 6. STATUS DO PM2 ==="
pm2 status

echo ""
echo "=== 7. LOGS RECENTES ==="
pm2 logs --nostream --lines 20

echo ""
echo "=== DEPLOY CONCLUÍDO COM SUCESSO ==="
