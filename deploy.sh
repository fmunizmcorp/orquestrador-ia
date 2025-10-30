#!/bin/bash

###############################################################################
# SCRIPT DE DEPLOY AUTÔNOMO - ORQUESTRADOR V3.0
# Executa build, migrations e deploy com auto-correção
###############################################################################

set -e  # Exit on error

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções auxiliares
log_info() {
    echo -e "${BLUE}ℹ${NC}  $1"
}

log_success() {
    echo -e "${GREEN}✓${NC}  $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC}  $1"
}

log_error() {
    echo -e "${RED}✗${NC}  $1"
}

# Banner
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║         DEPLOY AUTÔNOMO - ORQUESTRADOR V3.0                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# 1. Verificar Node.js
log_info "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    log_error "Node.js não encontrado! Instale o Node.js 18+ primeiro."
    exit 1
fi
NODE_VERSION=$(node -v)
log_success "Node.js $NODE_VERSION encontrado"

# 2. Verificar npm
log_info "Verificando npm..."
if ! command -v npm &> /dev/null; then
    log_error "npm não encontrado!"
    exit 1
fi
NPM_VERSION=$(npm -v)
log_success "npm $NPM_VERSION encontrado"

# 3. Instalar dependências (se necessário)
if [ ! -d "node_modules" ]; then
    log_info "Instalando dependências..."
    npm install
    log_success "Dependências instaladas"
else
    log_info "Verificando dependências..."
    npm install --production=false
    log_success "Dependências verificadas"
fi

# 4. Verificar variáveis de ambiente
log_info "Verificando arquivo .env..."
if [ ! -f ".env" ]; then
    log_warning ".env não encontrado, criando a partir de .env.example..."
    
    if [ -f ".env.example" ]; then
        cp .env.example .env
        log_success ".env criado"
    else
        log_error ".env.example não encontrado!"
        echo "Crie um arquivo .env com as configurações do banco de dados"
        exit 1
    fi
fi

# 5. Executar migrations do banco
log_info "Executando migrations do banco de dados..."
if npm run db:migrate; then
    log_success "Migrations executadas com sucesso"
else
    log_error "Erro ao executar migrations"
    log_warning "Tentando continuar sem migrations..."
fi

# 6. Build do frontend
log_info "Building frontend (Vite)..."
if npm run build:client; then
    log_success "Frontend buildado"
else
    log_error "Erro ao buildar frontend"
    exit 1
fi

# 7. Build do backend
log_info "Building backend (TypeScript)..."
if npm run build:server; then
    log_success "Backend buildado"
else
    log_error "Erro ao buildar backend"
    exit 1
fi

# 8. Verificar builds
log_info "Verificando builds..."
if [ ! -d "dist/client" ]; then
    log_error "Build do frontend não encontrado em dist/client"
    exit 1
fi

if [ ! -f "dist/index.js" ]; then
    log_error "Build do backend não encontrado em dist/index.js"
    exit 1
fi

log_success "Todos os builds verificados"

# 9. Copiar arquivos estáticos necessários
log_info "Copiando arquivos estáticos..."
cp -r dist/client dist/static 2>/dev/null || true
log_success "Arquivos copiados"

# 10. Verificar porta disponível
PORT=${PORT:-3001}
log_info "Verificando porta $PORT..."

if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    log_warning "Porta $PORT em uso, matando processo..."
    lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
    sleep 2
    log_success "Porta $PORT liberada"
else
    log_success "Porta $PORT disponível"
fi

# 11. Executar testes (opcional)
if [ "$RUN_TESTS" = "true" ]; then
    log_info "Executando testes..."
    npm test || log_warning "Alguns testes falharam, mas continuando..."
fi

# 12. Iniciar servidor
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    INICIANDO SERVIDOR                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

log_info "Iniciando servidor em modo produção..."
log_info "URL: http://localhost:$PORT"
log_info "Para parar: Ctrl+C"
echo ""

# Iniciar com PM2 se disponível, senão com Node
if command -v pm2 &> /dev/null; then
    log_info "PM2 detectado, usando PM2..."
    pm2 delete orquestrador-v3 2>/dev/null || true
    pm2 start dist/index.js --name orquestrador-v3 -i 1 --env production
    pm2 logs orquestrador-v3
else
    log_info "PM2 não encontrado, iniciando com Node..."
    NODE_ENV=production node dist/index.js
fi
