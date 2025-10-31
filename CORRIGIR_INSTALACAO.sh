#!/bin/bash

#═══════════════════════════════════════════════════════════════════════════════
# SCRIPT PARA CORRIGIR PROBLEMA DE SENHA DO BANCO DE DADOS
# Execute este script no seu servidor após o erro de conexão MySQL
#═══════════════════════════════════════════════════════════════════════════════

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  CORREÇÃO DE INSTALAÇÃO - ORQUESTRADOR IA${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════════${NC}\n"

# Detectar o diretório do projeto
if [ -d "$HOME/orquestrador-ia" ]; then
    PROJECT_DIR="$HOME/orquestrador-ia"
elif [ -d "/home/flavio/orquestrador-ia" ]; then
    PROJECT_DIR="/home/flavio/orquestrador-ia"
else
    echo -e "${RED}❌ Diretório do projeto não encontrado!${NC}"
    echo "Por favor, clone o repositório primeiro:"
    echo "git clone https://github.com/fmunizmcorp/orquestrador-ia.git"
    exit 1
fi

echo -e "${YELLOW}📁 Projeto encontrado em: $PROJECT_DIR${NC}\n"

# Pedir a senha do banco de dados
echo -e "${YELLOW}🔐 Digite a senha do banco de dados MySQL${NC}"
echo "A senha foi exibida durante a instalação, algo como: ZsVAOPp1mZ8swUx2"
echo -n "Senha do banco: "
read -s DB_PASSWORD
echo ""

if [ -z "$DB_PASSWORD" ]; then
    echo -e "${RED}❌ Senha não pode estar vazia!${NC}"
    exit 1
fi

# Testar a conexão
echo -e "\n${YELLOW}🧪 Testando conexão com MySQL...${NC}"
if mysql -u orquestrador -p"$DB_PASSWORD" orquestrador_ia -e "SELECT 1;" &>/dev/null; then
    echo -e "${GREEN}✅ Conexão MySQL OK!${NC}"
else
    echo -e "${RED}❌ Erro ao conectar no MySQL!${NC}"
    echo "Verifique se a senha está correta."
    echo ""
    echo "Para ver as credenciais do banco, execute:"
    echo "  sudo cat /var/log/mysql_setup.log"
    echo ""
    echo "Ou reinicie a configuração do banco:"
    echo "  sudo mysql -u root"
    echo "  DROP DATABASE IF EXISTS orquestrador_ia;"
    echo "  CREATE DATABASE orquestrador_ia;"
    echo "  DROP USER IF EXISTS 'orquestrador'@'localhost';"
    echo "  CREATE USER 'orquestrador'@'localhost' IDENTIFIED BY 'SUA_NOVA_SENHA';"
    echo "  GRANT ALL PRIVILEGES ON orquestrador_ia.* TO 'orquestrador'@'localhost';"
    echo "  FLUSH PRIVILEGES;"
    exit 1
fi

# Criar arquivo .env
echo -e "\n${YELLOW}📝 Criando arquivo .env...${NC}"

cat > "$PROJECT_DIR/.env" << ENV_FILE
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

# JWT Secret
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

chmod 600 "$PROJECT_DIR/.env"
echo -e "${GREEN}✅ Arquivo .env criado!${NC}"

# Executar migrations
echo -e "\n${YELLOW}🗄️  Executando migrations do banco de dados...${NC}"
cd "$PROJECT_DIR"

# Aplicar migrations
if npm run db:push; then
    echo -e "${GREEN}✅ Migrations executadas com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro ao executar migrations!${NC}"
    echo "Tente executar manualmente:"
    echo "  cd $PROJECT_DIR"
    echo "  npm run db:push"
    exit 1
fi

# Build do projeto
echo -e "\n${YELLOW}🔨 Compilando projeto...${NC}"
npm run build

# Build do frontend
echo -e "\n${YELLOW}🎨 Compilando frontend...${NC}"
cd client
npm install
npm run build
cd ..

echo -e "\n${GREEN}✅ Build concluído com sucesso!${NC}"

# Configurar PM2
echo -e "\n${YELLOW}🚀 Configurando PM2...${NC}"

# Parar instâncias antigas
pm2 delete all 2>/dev/null || true

# Iniciar com PM2
pm2 start ecosystem.config.cjs

# Salvar configuração
pm2 save

echo -e "\n${GREEN}╔═══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                                   ║${NC}"
echo -e "${GREEN}║              ✅ INSTALAÇÃO CORRIGIDA COM SUCESSO! ✅              ║${NC}"
echo -e "${GREEN}║                                                                   ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════════╝${NC}\n"

# Obter IP
SERVER_IP=$(hostname -I | awk '{print $1}')

echo -e "${YELLOW}🌐 Acesse a aplicação:${NC}"
echo "  Frontend: http://localhost:3000"
echo "  Frontend: http://$SERVER_IP:3000"
echo "  Backend:  http://localhost:5000"
echo "  Backend:  http://$SERVER_IP:5000"
echo ""
echo -e "${YELLOW}🛠️  Comandos úteis:${NC}"
echo "  pm2 status      # Ver status"
echo "  pm2 logs        # Ver logs"
echo "  pm2 restart all # Reiniciar"
echo ""
echo -e "${GREEN}✅ Tudo pronto!${NC}\n"
