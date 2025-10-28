#!/bin/bash

################################################################################
# SCRIPT DE CORREÇÃO - FRONTEND 502 BAD GATEWAY
# Orquestrador de IAs V3.0
# 
# Este script corrige o erro 502 reiniciando o PM2 com NODE_ENV=production
################################################################################

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║                                                  ║"
echo "║     CORREÇÃO DE ERRO 502 - FRONTEND             ║"
echo "║     Orquestrador de IAs V3.0                    ║"
echo "║                                                  ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# Diretório da aplicação
APP_DIR="$HOME/orquestrador-v3"

# Verificar se diretório existe
if [ ! -d "$APP_DIR" ]; then
    log_error "Diretório $APP_DIR não encontrado!"
    exit 1
fi

cd "$APP_DIR"

log_info "Verificando arquivos compilados..."

# Verificar se dist/index.js existe
if [ ! -f "dist/index.js" ]; then
    log_error "Backend não compilado! Execute: pnpm build:server"
    exit 1
fi
log_success "Backend compilado: dist/index.js"

# Verificar se dist/client existe
if [ ! -d "dist/client" ]; then
    log_error "Frontend não compilado! Execute: pnpm build:client"
    exit 1
fi
log_success "Frontend compilado: dist/client"

# Verificar se .env existe
if [ ! -f ".env" ]; then
    log_error "Arquivo .env não encontrado!"
    exit 1
fi

# Verificar NODE_ENV no .env
if grep -q "^NODE_ENV=production" .env; then
    log_success "NODE_ENV=production encontrado em .env"
else
    log_warning "NODE_ENV não está como 'production', adicionando..."
    
    # Remover NODE_ENV existente
    sed -i '/^NODE_ENV=/d' .env
    
    # Adicionar NODE_ENV=production após PORT
    sed -i '/^PORT=/a NODE_ENV=production' .env
    
    log_success "NODE_ENV=production adicionado ao .env"
fi

log_info "Parando aplicação PM2..."
pm2 stop orquestrador-v3 2>/dev/null || log_warning "Aplicação não estava rodando"
pm2 delete orquestrador-v3 2>/dev/null || true

log_info "Iniciando aplicação com NODE_ENV=production..."

# Criar ecosystem.config.cjs se não existir
cat > ecosystem.config.cjs << 'EOF'
module.exports = {
  apps: [{
    name: 'orquestrador-v3',
    script: './dist/index.js',
    cwd: process.cwd(),
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
EOF

log_success "Arquivo ecosystem.config.cjs criado"

# Criar diretório de logs
mkdir -p logs

# Iniciar com PM2 usando ecosystem config
pm2 start ecosystem.config.cjs

# Salvar configuração PM2
pm2 save

log_info "Aguardando 5 segundos para o servidor iniciar..."
sleep 5

# Verificar se está rodando
if pm2 list | grep -q "orquestrador-v3.*online"; then
    log_success "Aplicação rodando no PM2"
else
    log_error "Aplicação não iniciou corretamente"
    log_info "Verificando logs..."
    pm2 logs orquestrador-v3 --lines 20 --nostream
    exit 1
fi

log_info "Testando endpoints..."

# Testar backend
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health | grep -q "200"; then
    log_success "Backend respondendo na porta 3001"
else
    log_error "Backend não está respondendo"
    pm2 logs orquestrador-v3 --lines 20 --nostream
    exit 1
fi

# Testar se frontend está sendo servido
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/ 2>/dev/null || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
    log_success "Frontend sendo servido na porta 3001 (mesmo servidor do backend)"
    echo ""
    echo "╔══════════════════════════════════════════════════╗"
    echo "║                                                  ║"
    echo "║     ✅ CORREÇÃO CONCLUÍDA COM SUCESSO!          ║"
    echo "║                                                  ║"
    echo "╚══════════════════════════════════════════════════╝"
    echo ""
    echo "🌐 ACESSO:"
    echo ""
    echo "   Frontend + Backend: http://192.168.1.247:3001"
    echo ""
    echo "📝 NGINX:"
    echo ""
    echo "   Você pode configurar o Nginx para apontar para a porta 3001:"
    echo ""
    echo "   location / {"
    echo "       proxy_pass http://localhost:3001;"
    echo "       proxy_http_version 1.1;"
    echo "       proxy_set_header Upgrade \$http_upgrade;"
    echo "       proxy_set_header Connection 'upgrade';"
    echo "       proxy_set_header Host \$host;"
    echo "       proxy_cache_bypass \$http_upgrade;"
    echo "   }"
    echo ""
    echo "📊 Status:"
    echo ""
    pm2 status
    echo ""
    log_success "Sistema totalmente operacional!"
    
elif [ "$HTTP_CODE" = "404" ]; then
    log_error "Frontend retornando 404 - arquivos não encontrados"
    log_info "Verificando estrutura de diretórios..."
    ls -lh dist/
    echo ""
    log_info "Conteúdo de dist/client:"
    ls -lh dist/client/ | head -10
    exit 1
else
    log_error "Frontend retornando código HTTP: $HTTP_CODE"
    log_info "Logs do PM2:"
    pm2 logs orquestrador-v3 --lines 30 --nostream
    exit 1
fi
