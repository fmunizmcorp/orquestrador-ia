#!/bin/bash
#############################################
# Script de Deploy Automático
# Servidor: 192.168.1.247
# Sprints 10-11: Error Standardization + Pagination
#############################################

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

print_info() { echo -e "${CYAN}ℹ️  $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

# Configurações
PROD_SERVER="192.168.1.247"
PROD_USER="${PROD_USER:-flavio}"
PROD_PATH="${PROD_PATH:-/home/flavio/webapp}"
APP_NAME="${APP_NAME:-orquestrador}"

print_info "========================================="
print_info "🚀 Deploy to Production"
print_info "Server: $PROD_SERVER"
print_info "User: $PROD_USER"
print_info "Path: $PROD_PATH"
print_info "========================================="

# Verificar se o código está committed
if [[ -n $(git status -s) ]]; then
    print_error "Há mudanças não commitadas!"
    print_info "Por favor, commit ou stash as mudanças antes do deploy"
    exit 1
fi

# Verificar build local
print_info "Verificando build local..."
if [[ ! -d "dist" ]]; then
    print_error "Pasta dist/ não encontrada. Execute 'npm run build' primeiro"
    exit 1
fi

print_success "Build local OK"

# Verificar conexão SSH
print_info "Testando conexão SSH com $PROD_SERVER..."
if ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no "$PROD_USER@$PROD_SERVER" "echo 'SSH OK'" > /dev/null 2>&1; then
    print_success "Conexão SSH estabelecida"
    
    # Deploy via SSH
    print_info "Iniciando deploy..."
    
    # 1. Sync código (excluindo node_modules e .git)
    print_info "Sincronizando código..."
    rsync -avz --delete \
        --exclude 'node_modules' \
        --exclude '.git' \
        --exclude '.env' \
        --exclude 'dist' \
        ./ "$PROD_USER@$PROD_SERVER:$PROD_PATH/"
    
    print_success "Código sincronizado"
    
    # 2. Instalar dependências e build no servidor
    print_info "Instalando dependências no servidor..."
    ssh "$PROD_USER@$PROD_SERVER" << 'ENDSSH'
cd $PROD_PATH
npm install
npm run build
ENDSSH
    
    print_success "Build completo no servidor"
    
    # 3. Restart da aplicação
    print_info "Reiniciando aplicação..."
    ssh "$PROD_USER@$PROD_SERVER" << 'ENDSSH'
# Tentar PM2 primeiro
if command -v pm2 &> /dev/null; then
    pm2 restart $APP_NAME || pm2 start dist/index.js --name $APP_NAME
elif command -v systemctl &> /dev/null; then
    sudo systemctl restart $APP_NAME
else
    echo "⚠️  PM2 ou systemd não encontrados. Restart manual necessário"
fi
ENDSSH
    
    print_success "Aplicação reiniciada"
    
    # 4. Verificar saúde
    print_info "Verificando saúde da aplicação..."
    sleep 3
    
    if curl -f -s -m 5 "http://$PROD_SERVER:3000/health" > /dev/null 2>&1; then
        print_success "Aplicação está respondendo!"
    else
        print_error "Aplicação não está respondendo no health check"
        print_info "Verifique logs com: ssh $PROD_USER@$PROD_SERVER 'pm2 logs $APP_NAME'"
    fi
    
else
    print_error "Não foi possível conectar via SSH"
    print_info "Deploy manual necessário. Consulte DEPLOY.md"
    print_info ""
    print_info "Você pode fazer deploy manual:"
    print_info "1. Merge PR #3: https://github.com/fmunizmcorp/orquestrador-ia/pull/3"
    print_info "2. No servidor: git pull origin main"
    print_info "3. No servidor: npm install && npm run build"
    print_info "4. No servidor: pm2 restart $APP_NAME"
    exit 1
fi

print_success "========================================="
print_success "✅ Deploy completo!"
print_success "========================================="
print_info "URL: http://$PROD_SERVER:3000"
print_info "Health: http://$PROD_SERVER:3000/health"
print_info "PR: https://github.com/fmunizmcorp/orquestrador-ia/pull/3"
