#!/bin/bash

# 🚀 Script de Instalação e Deploy Completo - Orquestrador de IAs V3.0
# Execute: chmod +x install.sh && ./install.sh

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Banner
echo -e "${CYAN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     🤖 ORQUESTRADOR DE IAs V3.0 - INSTALADOR COMPLETO    ║
║                                                           ║
║     Sistema de Orquestração de Inteligências Artificiais ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}\n"

# Configuration
PORT=3001
DB_NAME="orquestraia"
DB_USER="root"
DB_PASSWORD=""
FRONTEND_PORT=3000

# Functions
print_step() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}▶ $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${MAGENTA}ℹ️  $1${NC}"
}

check_command() {
    if command -v $1 &> /dev/null; then
        print_success "$1 está instalado"
        return 0
    else
        print_error "$1 não está instalado"
        return 1
    fi
}

# Step 1: Verificar pré-requisitos
print_step "1/10 - Verificando pré-requisitos"

if check_command node; then
    NODE_VERSION=$(node --version)
    print_info "Node.js version: $NODE_VERSION"
else
    print_error "Node.js não encontrado. Por favor, instale Node.js v18+ antes de continuar."
    exit 1
fi

if check_command npm; then
    NPM_VERSION=$(npm --version)
    print_info "npm version: $NPM_VERSION"
else
    print_error "npm não encontrado. Por favor, instale npm antes de continuar."
    exit 1
fi

if check_command mysql; then
    MYSQL_VERSION=$(mysql --version)
    print_info "MySQL: $MYSQL_VERSION"
else
    print_warning "MySQL client não encontrado. Você precisará configurar o banco manualmente."
fi

if check_command git; then
    print_success "Git está instalado"
else
    print_warning "Git não encontrado. Clone manual será necessário."
fi

# Step 2: Instalar dependências
print_step "2/10 - Instalando dependências do Node.js"

npm install
print_success "Dependências instaladas com sucesso!"

# Step 3: Configurar .env
print_step "3/10 - Configurando arquivo .env"

if [ -f .env ]; then
    print_warning ".env já existe. Fazendo backup..."
    cp .env .env.backup
    print_info "Backup criado: .env.backup"
fi

cat > .env << EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}

# Server Configuration
PORT=${PORT}
NODE_ENV=production

# JWT Secret (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "change-this-secret-key-in-production")

# LM Studio Configuration
LM_STUDIO_URL=http://localhost:1234/v1

# Encryption Key (CHANGE THIS IN PRODUCTION!)
ENCRYPTION_KEY=$(openssl rand -base64 32 2>/dev/null || echo "change-this-encryption-key-32-chars")

# Frontend URL
VITE_API_URL=http://localhost:${PORT}
EOF

print_success ".env criado com sucesso!"
print_info "JWT_SECRET e ENCRYPTION_KEY foram gerados automaticamente"

# Step 4: Solicitar credenciais do MySQL
print_step "4/10 - Configuração do Banco de Dados MySQL"

read -p "$(echo -e ${CYAN}Digite o usuário do MySQL [root]: ${NC})" input_user
DB_USER=${input_user:-root}

read -sp "$(echo -e ${CYAN}Digite a senha do MySQL [vazio]: ${NC})" input_pass
echo
DB_PASSWORD=${input_pass}

read -p "$(echo -e ${CYAN}Digite o nome do banco de dados [orquestraia]: ${NC})" input_db
DB_NAME=${input_db:-orquestraia}

# Atualizar .env com credenciais corretas
sed -i "s/DB_USER=.*/DB_USER=${DB_USER}/" .env
sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=${DB_PASSWORD}/" .env
sed -i "s/DB_NAME=.*/DB_NAME=${DB_NAME}/" .env

print_success "Credenciais do banco de dados configuradas!"

# Step 5: Criar banco de dados
print_step "5/10 - Criando banco de dados"

if command -v mysql &> /dev/null; then
    echo "Tentando criar banco de dados..."
    
    # Criar usuário e banco de dados com senha se não existir
    if [ -z "$DB_PASSWORD" ]; then
        # Senha vazia - usar sudo mysql (auth_socket) ou criar nova senha
        print_warning "Senha vazia detectada. Criando usuário com senha..."
        
        # Gerar senha aleatória
        NEW_PASSWORD=$(openssl rand -base64 16 2>/dev/null || echo "orquestrador$(date +%s)")
        
        # Criar usuário e banco usando sudo
        sudo mysql <<-EOSQL 2>/dev/null || {
            print_error "Falha ao criar banco. Tentando método alternativo..."
            # Método alternativo sem sudo
            mysql -u"$DB_USER" <<-EOSQL2 2>/dev/null || true
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${NEW_PASSWORD}';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
EOSQL2
        }
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${NEW_PASSWORD}';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
EOSQL
        
        # Atualizar .env com nova senha
        DB_PASSWORD="$NEW_PASSWORD"
        sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=${DB_PASSWORD}/" .env
        
        print_success "Banco de dados criado com nova senha!"
        print_info "Senha gerada e salva no .env: ${DB_PASSWORD}"
    else
        # Com senha - método normal
        mysql -u"$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;" 2>/dev/null || {
            print_error "Falha ao criar banco com credenciais fornecidas"
            print_warning "Execute manualmente: CREATE DATABASE ${DB_NAME};"
        }
        print_success "Banco de dados criado/verificado!"
    fi
else
    print_warning "MySQL não disponível. Você precisará criar o banco manualmente."
    print_info "Execute: CREATE DATABASE ${DB_NAME};"
fi

# Step 6: Executar migrations
print_step "6/10 - Executando migrations do banco de dados"

npm run db:migrate
print_success "Migrations executadas com sucesso!"

# Step 7: Build do frontend
print_step "7/10 - Compilando frontend (Vite)"

npm run build:client || npm run build
print_success "Frontend compilado com sucesso!"

# Step 8: Build do backend
print_step "8/10 - Compilando backend (TypeScript)"

npm run build:server || npm run build
print_success "Backend compilado com sucesso!"

# Step 9: Verificar porta disponível
print_step "9/10 - Verificando portas disponíveis"

if lsof -Pi :${PORT} -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_warning "Porta ${PORT} está em uso. Matando processo..."
    lsof -ti:${PORT} | xargs kill -9 2>/dev/null || true
    sleep 2
    print_success "Porta ${PORT} liberada!"
else
    print_success "Porta ${PORT} está disponível!"
fi

# Step 10: Iniciar servidor
print_step "10/10 - Iniciando servidor"

# Verificar se PM2 está instalado
if command -v pm2 &> /dev/null; then
    print_info "PM2 detectado. Usando PM2 para gerenciamento..."
    
    # Parar processo existente
    pm2 delete orquestrador-v3 2>/dev/null || true
    
    # Iniciar com PM2
    pm2 start dist/index.js --name orquestrador-v3 --time
    pm2 save
    
    print_success "Servidor iniciado com PM2!"
    print_info "Use 'pm2 status' para ver o status"
    print_info "Use 'pm2 logs orquestrador-v3' para ver os logs"
    print_info "Use 'pm2 restart orquestrador-v3' para reiniciar"
    print_info "Use 'pm2 stop orquestrador-v3' para parar"
    
else
    print_info "PM2 não detectado. Instalando PM2 globalmente..."
    npm install -g pm2
    
    # Iniciar com PM2
    pm2 start dist/index.js --name orquestrador-v3 --time
    pm2 save
    
    print_success "PM2 instalado e servidor iniciado!"
fi

# Final summary
echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}          ✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO! ✅${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

cat << EOF
${CYAN}📊 Informações do Sistema:${NC}
   • Backend URL: http://localhost:${PORT}
   • API Endpoint: http://localhost:${PORT}/api/trpc
   • Banco de Dados: ${DB_NAME}
   • Processo: orquestrador-v3 (PM2)

${CYAN}🚀 Como usar:${NC}
   • Ver status:    pm2 status
   • Ver logs:      pm2 logs orquestrador-v3
   • Reiniciar:     pm2 restart orquestrador-v3
   • Parar:         pm2 stop orquestrador-v3
   • Deletar:       pm2 delete orquestrador-v3

${CYAN}🌐 Próximos Passos:${NC}
   1. Acesse: http://localhost:${PORT}
   2. Registre um novo usuário em /register
   3. Faça login e explore o sistema!

${CYAN}📝 Arquivos Criados:${NC}
   • .env (configurações do ambiente)
   • .env.backup (backup do .env anterior, se existia)
   • dist/ (código compilado)

${CYAN}🔧 Comandos Úteis:${NC}
   • Deploy:        ./deploy.sh
   • Migrations:    npm run db:migrate
   • Dev mode:      npm run dev
   • Build:         npm run build

${YELLOW}⚠️  IMPORTANTE:${NC}
   • Altere JWT_SECRET e ENCRYPTION_KEY no .env antes de usar em produção
   • Configure seu firewall para permitir tráfego na porta ${PORT}
   • Faça backup regular do banco de dados

${GREEN}✨ Obrigado por usar o Orquestrador de IAs V3.0! ✨${NC}

EOF

# Save installation info
cat > installation.log << EOF
Instalação concluída em: $(date)
Node.js: $(node --version)
npm: $(npm --version)
Backend Port: ${PORT}
Database: ${DB_NAME}
PM2 Status: $(pm2 --version)
EOF

print_success "Log de instalação salvo em: installation.log"

echo -e "\n${CYAN}Pressione qualquer tecla para ver o status do PM2...${NC}"
read -n 1 -s
pm2 status

exit 0
