#!/bin/bash

#═══════════════════════════════════════════════════════════════════════════════
# SCRIPT DE INSTALAÇÃO AUTOMÁTICA - ORQUESTRADOR IA
# Versão: 1.0.0
# Autor: GenSpark AI
# Data: 2025-10-31
# Requisitos: Ubuntu 24.04 LTS (ou 20.04+), sudo, internet
#═══════════════════════════════════════════════════════════════════════════════

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir com cor
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_step() { echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"; echo -e "${BLUE}🚀 $1${NC}"; echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"; }

# Banner
clear
echo -e "${GREEN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║     ██████╗ ██████╗  ██████╗ ██╗   ██╗███████╗███████╗████████╗ ║
║    ██╔═══██╗██╔══██╗██╔═══██╗██║   ██║██╔════╝██╔════╝╚══██╔══╝ ║
║    ██║   ██║██████╔╝██║   ██║██║   ██║█████╗  ███████╗   ██║    ║
║    ██║   ██║██╔══██╗██║▄▄ ██║██║   ██║██╔══╝  ╚════██║   ██║    ║
║    ╚██████╔╝██║  ██║╚██████╔╝╚██████╔╝███████╗███████║   ██║    ║
║     ╚═════╝ ╚═╝  ╚═╝ ╚══▀▀═╝  ╚═════╝ ╚══════╝╚══════╝   ╚═╝    ║
║                                                                   ║
║              INSTALADOR AUTOMÁTICO - ORQUESTRADOR IA              ║
║                      Versão 1.0.0 - 2025                          ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}\n"

# Verificar se está rodando como sudo
if [ "$EUID" -ne 0 ]; then 
   print_error "Este script precisa ser executado com sudo"
   echo "Execute: sudo ./install.sh"
   exit 1
fi

# Obter usuário real (não root)
REAL_USER=${SUDO_USER:-$USER}
REAL_HOME=$(eval echo ~$REAL_USER)
PROJECT_DIR="$REAL_HOME/orquestrador-ia"

print_info "Usuário: $REAL_USER"
print_info "Home: $REAL_HOME"
print_info "Diretório do projeto: $PROJECT_DIR"
sleep 2

#═══════════════════════════════════════════════════════════════════════════════
# PASSO 1: Atualizar sistema
#═══════════════════════════════════════════════════════════════════════════════
print_step "PASSO 1/12: Atualizando sistema"
apt update -y
print_success "Sistema atualizado"

#═══════════════════════════════════════════════════════════════════════════════
# PASSO 2: Instalar Node.js 20.x
#═══════════════════════════════════════════════════════════════════════════════
print_step "PASSO 2/12: Instalando Node.js 20.x LTS"

if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_warning "Node.js já instalado: $NODE_VERSION"
    if [[ $NODE_VERSION == v20* ]]; then
        print_success "Versão correta (20.x)"
    else
        print_warning "Atualizando para Node.js 20.x..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt install -y nodejs
    fi
else
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi

print_info "Node.js $(node -v)"
print_info "npm $(npm -v)"
print_success "Node.js 20.x instalado"

#═══════════════════════════════════════════════════════════════════════════════
# PASSO 3: Instalar MySQL 8.0
#═══════════════════════════════════════════════════════════════════════════════
print_step "PASSO 3/12: Instalando MySQL 8.0"

if command -v mysql &> /dev/null; then
    print_warning "MySQL já instalado"
    mysql --version
else
    print_info "Instalando MySQL Server..."
    DEBIAN_FRONTEND=noninteractive apt install -y mysql-server
    systemctl start mysql
    systemctl enable mysql
fi

print_success "MySQL instalado e rodando"

#═══════════════════════════════════════════════════════════════════════════════
# PASSO 4: Configurar MySQL
#═══════════════════════════════════════════════════════════════════════════════
print_step "PASSO 4/12: Configurando banco de dados"

# Gerar senha aleatória
DB_PASSWORD=$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-16)

print_info "Criando banco de dados 'orquestrador_ia'..."
mysql -u root <<MYSQL_SCRIPT
-- Criar banco de dados
DROP DATABASE IF EXISTS orquestrador_ia;
CREATE DATABASE orquestrador_ia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar usuário
DROP USER IF EXISTS 'orquestrador'@'localhost';
CREATE USER 'orquestrador'@'localhost' IDENTIFIED BY '$DB_PASSWORD';

-- Conceder privilégios
GRANT ALL PRIVILEGES ON orquestrador_ia.* TO 'orquestrador'@'localhost';
FLUSH PRIVILEGES;

SELECT 'Database setup complete!' AS Status;
MYSQL_SCRIPT

print_success "Banco de dados configurado"
print_info "Usuário: orquestrador"
print_info "Senha: $DB_PASSWORD"
print_info "Banco: orquestrador_ia"

#═══════════════════════════════════════════════════════════════════════════════
# PASSO 5: Verificar/Clonar repositório
#═══════════════════════════════════════════════════════════════════════════════
print_step "PASSO 5/12: Verificando código do projeto"

if [ ! -d "$PROJECT_DIR" ]; then
    print_error "Diretório do projeto não encontrado: $PROJECT_DIR"
    print_info "Clone o repositório primeiro:"
    print_info "git clone https://github.com/fmunizmcorp/orquestrador-ia.git $PROJECT_DIR"
    exit 1
fi

cd "$PROJECT_DIR"
print_success "Projeto encontrado em: $PROJECT_DIR"

#═══════════════════════════════════════════════════════════════════════════════
# PASSO 6: Criar arquivo .env
#═══════════════════════════════════════════════════════════════════════════════
print_step "PASSO 6/12: Criando arquivo de configuração .env"

cat > "$PROJECT_DIR/.env" <<ENV_FILE
# Database Configuration
DATABASE_URL="mysql://orquestrador:${DB_PASSWORD}@localhost:3306/orquestrador_ia"
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="orquestrador"
DB_PASSWORD="${DB_PASSWORD}"
DB_NAME="orquestrador_ia"

# Server Configuration
NODE_ENV="production"
PORT="5000"
FRONTEND_URL="http://localhost:3000"

# JWT Secret (change in production!)
JWT_SECRET="$(openssl rand -base64 32)"

# LM Studio Configuration (optional)
LMSTUDIO_URL="http://localhost:1234"
LMSTUDIO_API_KEY=""

# API Keys (configure as needed)
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""
GOOGLE_API_KEY=""

# Session Secret
SESSION_SECRET="$(openssl rand -base64 32)"

# CORS
CORS_ORIGIN="http://localhost:3000"
ENV_FILE

chown $REAL_USER:$REAL_USER "$PROJECT_DIR/.env"
chmod 600 "$PROJECT_DIR/.env"

print_success "Arquivo .env criado"
print_warning "⚠️  IMPORTANTE: Revise o arquivo .env e configure as API keys necessárias"

#═══════════════════════════════════════════════════════════════════════════════
# PASSO 7: Instalar dependências
#═══════════════════════════════════════════════════════════════════════════════
print_step "PASSO 7/12: Instalando dependências npm"

sudo -u $REAL_USER npm install
print_success "Dependências instaladas"

#═══════════════════════════════════════════════════════════════════════════════
# PASSO 8: Executar migrations
#═══════════════════════════════════════════════════════════════════════════════
print_step "PASSO 8/12: Executando migrations do banco de dados"

print_info "Gerando migrations..."
sudo -u $REAL_USER npm run db:generate

print_info "Aplicando migrations..."
sudo -u $REAL_USER npm run db:push

print_success "Migrations executadas com sucesso"

#═══════════════════════════════════════════════════════════════════════════════
# PASSO 9: Build do projeto
#═══════════════════════════════════════════════════════════════════════════════
print_step "PASSO 9/12: Build do projeto (frontend + backend)"

print_info "Compilando backend TypeScript..."
sudo -u $REAL_USER npm run build

print_info "Compilando frontend React..."
cd client
sudo -u $REAL_USER npm install
sudo -u $REAL_USER npm run build
cd ..

print_success "Build concluído"

#═══════════════════════════════════════════════════════════════════════════════
# PASSO 10: Instalar PM2
#═══════════════════════════════════════════════════════════════════════════════
print_step "PASSO 10/12: Instalando PM2 (gerenciador de processos)"

if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    print_success "PM2 instalado"
else
    print_warning "PM2 já instalado"
fi

#═══════════════════════════════════════════════════════════════════════════════
# PASSO 11: Configurar e iniciar aplicação com PM2
#═══════════════════════════════════════════════════════════════════════════════
print_step "PASSO 11/12: Iniciando aplicação com PM2"

# Parar instâncias antigas se existirem
sudo -u $REAL_USER pm2 delete all 2>/dev/null || true

# Iniciar com PM2
print_info "Iniciando backend e frontend..."
sudo -u $REAL_USER pm2 start ecosystem.config.cjs

# Salvar configuração PM2
sudo -u $REAL_USER pm2 save

# Configurar PM2 para iniciar no boot
env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $REAL_USER --hp $REAL_HOME

print_success "Aplicação iniciada com PM2"

#═══════════════════════════════════════════════════════════════════════════════
# PASSO 12: Configurar firewall (opcional)
#═══════════════════════════════════════════════════════════════════════════════
print_step "PASSO 12/12: Configurando firewall (UFW)"

if command -v ufw &> /dev/null; then
    print_info "Configurando UFW..."
    ufw --force enable
    ufw allow 22/tcp comment 'SSH'
    ufw allow 3000/tcp comment 'Frontend Orquestrador'
    ufw allow 5000/tcp comment 'Backend Orquestrador'
    ufw reload
    print_success "Firewall configurado"
else
    print_warning "UFW não instalado, pulando configuração de firewall"
fi

#═══════════════════════════════════════════════════════════════════════════════
# FINALIZAÇÃO
#═══════════════════════════════════════════════════════════════════════════════
clear
echo -e "${GREEN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║                  ✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO! ✅           ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}\n"

# Obter IP do servidor
SERVER_IP=$(hostname -I | awk '{print $1}')

print_success "Orquestrador IA instalado e rodando!"
echo ""
print_info "═══════════════════════════════════════════════════════"
print_info "📊 INFORMAÇÕES DE ACESSO:"
print_info "═══════════════════════════════════════════════════════"
echo ""
print_info "🌐 URLs de Acesso:"
echo "   Frontend: http://localhost:3000"
echo "   Frontend: http://$SERVER_IP:3000"
echo "   Backend:  http://localhost:5000"
echo "   Backend:  http://$SERVER_IP:5000"
echo ""
print_info "🗄️  Banco de Dados:"
echo "   Host:     localhost"
echo "   Porta:    3306"
echo "   Banco:    orquestrador_ia"
echo "   Usuário:  orquestrador"
echo "   Senha:    $DB_PASSWORD"
echo ""
print_info "🛠️  Gerenciamento (PM2):"
echo "   Ver status:    pm2 status"
echo "   Ver logs:      pm2 logs"
echo "   Reiniciar:     pm2 restart all"
echo "   Parar:         pm2 stop all"
echo ""
print_info "📁 Localização:"
echo "   Projeto: $PROJECT_DIR"
echo "   Config:  $PROJECT_DIR/.env"
echo ""
print_warning "⚠️  PRÓXIMOS PASSOS:"
echo "   1. Configure as API keys no arquivo .env"
echo "   2. Reinicie: pm2 restart all"
echo "   3. Acesse: http://$SERVER_IP:3000"
echo ""
print_info "🔐 Configurar acesso remoto SSH+VPN (opcional):"
echo "   cd $PROJECT_DIR"
echo "   sudo ./setup-acesso-remoto.sh"
echo ""
print_success "✅ Instalação completa!"
print_info "═══════════════════════════════════════════════════════"

# Salvar informações em arquivo
cat > "$PROJECT_DIR/INSTALACAO_INFO.txt" <<INFO_FILE
═══════════════════════════════════════════════════════════════════
INFORMAÇÕES DA INSTALAÇÃO - ORQUESTRADOR IA
Data: $(date)
═══════════════════════════════════════════════════════════════════

ACESSO À APLICAÇÃO:
  Frontend: http://$SERVER_IP:3000
  Backend:  http://$SERVER_IP:5000

BANCO DE DADOS:
  Host:     localhost
  Porta:    3306
  Banco:    orquestrador_ia
  Usuário:  orquestrador
  Senha:    $DB_PASSWORD

PM2 COMMANDS:
  pm2 status
  pm2 logs
  pm2 restart all
  pm2 stop all

LOCALIZAÇÃO:
  Projeto: $PROJECT_DIR
  Config:  $PROJECT_DIR/.env

═══════════════════════════════════════════════════════════════════
INFO_FILE

chown $REAL_USER:$REAL_USER "$PROJECT_DIR/INSTALACAO_INFO.txt"
print_success "Informações salvas em: $PROJECT_DIR/INSTALACAO_INFO.txt"
