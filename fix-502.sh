#!/bin/bash

###############################################################################
# SCRIPT DE DIAGNÓSTICO E CORREÇÃO - ORQUESTRADOR V3.0
# Resolve erro 502 Bad Gateway
###############################################################################

echo "🔍 DIAGNÓSTICO DO SISTEMA"
echo "=========================="
echo ""

# 1. Verificar processos PM2
echo "1️⃣  Verificando processos PM2..."
pm2 status
echo ""

# 2. Verificar portas
echo "2️⃣  Verificando portas em uso..."
echo "Porta 3000 (Frontend):"
sudo lsof -i :3000 || echo "❌ Porta 3000 não está em uso"
echo ""
echo "Porta 3001 (Backend):"
sudo lsof -i :3001 || echo "❌ Porta 3001 não está em uso"
echo ""

# 3. Verificar logs do PM2
echo "3️⃣  Últimas 30 linhas dos logs de ERRO:"
pm2 logs orquestrador-v3 --err --lines 30 --nostream
echo ""

# 4. Verificar se dist/index.js existe
echo "4️⃣  Verificando arquivo de build do backend..."
if [ -f "$HOME/orquestrador-v3/dist/index.js" ]; then
    echo "✅ dist/index.js existe"
    ls -lh "$HOME/orquestrador-v3/dist/index.js"
else
    echo "❌ dist/index.js NÃO existe - backend não foi compilado!"
fi
echo ""

# 5. Verificar conexão com MySQL
echo "5️⃣  Verificando conexão com MySQL..."
if mysql -u flavio -pbdflavioia -e "USE orquestraia; SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema='orquestraia';" 2>/dev/null; then
    echo "✅ MySQL conectando corretamente"
else
    echo "❌ Erro ao conectar no MySQL"
fi
echo ""

# 6. Verificar arquivo .env
echo "6️⃣  Verificando arquivo .env..."
if [ -f "$HOME/orquestrador-v3/.env" ]; then
    echo "✅ .env existe"
    echo "Conteúdo (sem senhas):"
    grep -v "PASSWORD\|KEY" "$HOME/orquestrador-v3/.env" || echo "Arquivo vazio"
else
    echo "❌ .env NÃO existe!"
fi
echo ""

echo "================================================"
echo "🔧 APLICANDO CORREÇÕES AUTOMÁTICAS"
echo "================================================"
echo ""

cd "$HOME/orquestrador-v3"

# 7. Parar processos antigos
echo "7️⃣  Parando processos antigos..."
pm2 stop all
pm2 delete all
sudo fuser -k 3000/tcp 2>/dev/null || true
sudo fuser -k 3001/tcp 2>/dev/null || true
sleep 2
echo ""

# 8. Verificar e instalar dependências se necessário
echo "8️⃣  Verificando dependências..."
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules não existe, instalando..."
    pnpm install --legacy-peer-deps || npm install --legacy-peer-deps
fi
echo ""

# 9. Rebuild do projeto
echo "9️⃣  Fazendo rebuild do projeto..."
echo "   - Build do servidor..."
pnpm build:server || npm run build:server
if [ ! -f "dist/index.js" ]; then
    echo "❌ Erro: dist/index.js não foi criado!"
    exit 1
fi
echo "   ✅ Backend compilado com sucesso"
echo ""

echo "   - Build do cliente..."
pnpm build:client || npm run build:client
if [ ! -d "dist/client" ]; then
    echo "❌ Erro: dist/client não foi criado!"
    exit 1
fi
echo "   ✅ Frontend compilado com sucesso"
echo ""

# 10. Verificar/criar arquivo .env
echo "🔟 Verificando configurações..."
if [ ! -f ".env" ]; then
    echo "⚠️  Criando arquivo .env..."
    cat > .env << 'ENVFILE'
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=flavio
DB_PASSWORD=bdflavioia
DB_NAME=orquestraia

# Server Configuration
PORT=3001
NODE_ENV=production

# LM Studio Configuration
LM_STUDIO_URL=http://localhost:1234/v1

# Encryption
ENCRYPTION_KEY=orquestrador_v3_secret_key_2024

# Server Info
SSH_HOST=192.168.1.247
SSH_USER=flavio
SSH_PORT=22
ENVFILE
    echo "✅ .env criado"
fi
echo ""

# 11. Testar conexão com banco ANTES de iniciar
echo "1️⃣1️⃣  Testando conexão com banco de dados..."
if ! mysql -u flavio -pbdflavioia orquestraia -e "SELECT 1;" 2>/dev/null; then
    echo "❌ ERRO: Não consegue conectar no MySQL!"
    echo "Tentando criar banco..."
    mysql -u flavio -pbdflavioia -e "CREATE DATABASE IF NOT EXISTS orquestraia;" 2>/dev/null || {
        echo "❌ Erro ao criar banco. Execute manualmente:"
        echo "   sudo mysql -e \"CREATE DATABASE IF NOT EXISTS orquestraia;\""
        echo "   sudo mysql -e \"GRANT ALL PRIVILEGES ON orquestraia.* TO 'flavio'@'localhost';\""
        exit 1
    }
fi
echo "✅ MySQL OK"
echo ""

# 12. Iniciar aplicação
echo "1️⃣2️⃣  Iniciando aplicação..."
pm2 start ecosystem.config.cjs
pm2 save
echo ""

# 13. Aguardar inicialização
echo "⏳ Aguardando 10 segundos para inicialização..."
sleep 10
echo ""

# 14. Verificar status
echo "================================================"
echo "✅ VERIFICAÇÃO FINAL"
echo "================================================"
echo ""

pm2 status
echo ""

# 15. Testar endpoints
echo "🧪 Testando endpoints..."
echo ""

echo "Backend (porta 3001):"
if curl -f http://localhost:3001/api/health 2>/dev/null; then
    echo "✅ Backend respondendo!"
else
    echo "❌ Backend NÃO está respondendo"
    echo ""
    echo "Logs de erro do backend:"
    pm2 logs orquestrador-v3 --err --lines 50 --nostream
fi
echo ""

echo "Frontend (porta 3000):"
if curl -f -I http://localhost:3000 2>/dev/null | head -1; then
    echo "✅ Frontend respondendo!"
else
    echo "❌ Frontend NÃO está respondendo"
fi
echo ""

SERVER_IP=$(hostname -I | awk '{print $1}')
echo "================================================"
echo "🎉 CORREÇÕES APLICADAS!"
echo "================================================"
echo ""
echo "🌐 Acesse: http://$SERVER_IP:3000"
echo ""
echo "Se ainda tiver erro 502, execute:"
echo "   pm2 logs orquestrador-v3"
echo ""
