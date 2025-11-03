#!/bin/bash

echo "🚀 =========================================="
echo "🚀 DEPLOY PARA PRODUÇÃO - Orquestrador IA"
echo "🚀 Epic 8: Model Management System"
echo "🚀 =========================================="
echo ""

# Configurações SSH (do arquivo .ssh-credentials)
SSH_HOST="31.97.64.43"
SSH_PORT="2224"
SSH_USER="flavio"
SSH_PASS="sshflavioia"
REMOTE_DIR="/home/flavio/orquestrador-ia"
PROJECT_DIR="/home/flavio/webapp"

echo "📦 1. Verificando build local..."
cd "$PROJECT_DIR"

if [ ! -d "dist" ]; then
    echo "⚠️  Build não encontrado. Compilando..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Erro na compilação!"
        exit 1
    fi
fi

echo "✅ Build local OK!"
echo ""

echo "📤 2. Enviando arquivos via rsync/SSH..."
sshpass -p "$SSH_PASS" rsync -avz --delete \
    -e "ssh -p $SSH_PORT -o StrictHostKeyChecking=no" \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.env.local' \
    --exclude '.ssh-credentials' \
    --exclude 'logs' \
    ./ ${SSH_USER}@${SSH_HOST}:${REMOTE_DIR}/

if [ $? -ne 0 ]; then
    echo "❌ Erro ao enviar arquivos!"
    exit 1
fi

echo "✅ Arquivos enviados!"
echo ""

echo "🔄 3. Instalando dependências e reiniciando servidor..."
sshpass -p "$SSH_PASS" ssh -p $SSH_PORT ${SSH_USER}@${SSH_HOST} << 'ENDSSH'
    cd /home/flavio/orquestrador-ia
    
    echo "📥 Atualizando código do GitHub..."
    git fetch origin
    git checkout genspark_ai_developer
    git pull origin genspark_ai_developer
    
    echo "📦 Instalando dependências..."
    npm install --production
    
    echo "🏗️  Compilando TypeScript..."
    npm run build
    
    echo "🔄 Reiniciando PM2..."
    pm2 restart orquestrador-ia || pm2 start ecosystem.config.cjs
    pm2 save
    
    echo ""
    echo "✅ Servidor reiniciado!"
    echo ""
    
    echo "🔍 Status do PM2:"
    pm2 status orquestrador-ia
    
    echo ""
    echo "📋 Últimas 20 linhas do log:"
    pm2 logs orquestrador-ia --lines 20 --nostream
ENDSSH

if [ $? -ne 0 ]; then
    echo "❌ Erro ao executar comandos no servidor!"
    exit 1
fi

echo ""
echo "🎉 =========================================="
echo "🎉 DEPLOY CONCLUÍDO COM SUCESSO!"
echo "🎉 =========================================="
echo ""
echo "🌐 Acesso via túnel SSH:"
echo "   ssh -p 2224 -L 3001:localhost:3001 flavio@31.97.64.43"
echo "   Depois acesse: http://localhost:3001"
echo ""
echo "🧪 Teste rápido:"
echo "   sshpass -p 'sshflavioia' ssh -p 2224 flavio@31.97.64.43 'curl -s http://localhost:3001/api/health'"
echo ""
