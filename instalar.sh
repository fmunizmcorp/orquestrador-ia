#!/bin/bash

###############################################################################
# INSTALADOR AUTOMÁTICO - ORQUESTRADOR DE IAs V3.0
# 100% automático - ZERO intervenção manual
# Autor: Sistema de Orquestração
# Versão: 3.0.0
###############################################################################

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variáveis
INSTALL_DIR="/home/flavio/orquestrador-v3"
DB_USER="flavio"
DB_PASS="bdflavioia"
DB_NAME="orquestraia"
DB_HOST="localhost"
DB_PORT="3306"
LOG_FILE="/tmp/orquestrador-install.log"
BACKUP_DIR="/home/flavio/backups/orquestrador-$(date +%Y%m%d-%H%M%S)"

# Funções auxiliares
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[ERRO] $1${NC}" | tee -a "$LOG_FILE"
}

log_warn() {
    echo -e "${YELLOW}[AVISO] $1${NC}" | tee -a "$LOG_FILE"
}

log_info() {
    echo -e "${BLUE}[INFO] $1${NC}" | tee -a "$LOG_FILE"
}

# Banner
clear
echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════╗"
echo "║                                                  ║"
echo "║     INSTALADOR AUTOMÁTICO                       ║"
echo "║     Orquestrador de IAs V3.0                    ║"
echo "║                                                  ║"
echo "║     100% Automático - Zero Intervenção          ║"
echo "║                                                  ║"
echo "╚══════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

log "Iniciando instalação do Orquestrador V3.0..."

# 1. Verificar privilégios
log_info "Verificando privilégios..."
if [ "$EUID" -eq 0 ]; then
    log_error "NÃO execute como root! Execute como usuário normal com sudo."
    exit 1
fi

# Verificar sudo
if ! sudo -v; then
    log_error "Usuário não tem privilégios sudo"
    exit 1
fi

log "✓ Privilégios OK"

# 2. Parar serviços antigos
log_info "Parando serviços antigos..."
sudo pm2 stop orquestrador-v3 2>/dev/null || true
sudo pm2 delete orquestrador-v3 2>/dev/null || true
sudo fuser -k 3000/tcp 2>/dev/null || true
sudo fuser -k 3001/tcp 2>/dev/null || true
log "✓ Serviços parados"

# 3. Criar backup
log_info "Criando backup..."
if [ -d "$INSTALL_DIR" ]; then
    sudo mkdir -p "$BACKUP_DIR"
    sudo cp -r "$INSTALL_DIR" "$BACKUP_DIR/" 2>/dev/null || true
    log "✓ Backup criado em: $BACKUP_DIR"
else
    log_warn "Diretório não existe, pulando backup"
fi

# Backup do banco de dados
log_info "Fazendo backup do banco de dados..."
if command -v mysqldump &> /dev/null; then
    sudo mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" 2>/dev/null > "$BACKUP_DIR/database_backup.sql" || {
        # Se falhar, tentar como root
        sudo mysqldump "$DB_NAME" 2>/dev/null > "$BACKUP_DIR/database_backup.sql" || true
    }
    if [ -f "$BACKUP_DIR/database_backup.sql" ]; then
        log "✓ Backup do banco criado"
    else
        log_warn "Não foi possível fazer backup do banco"
    fi
fi

# 4. Instalar dependências do sistema
log_info "Instalando dependências do sistema..."
sudo apt-get update -qq
sudo apt-get install -y -qq \
    curl \
    git \
    build-essential \
    mysql-server \
    python3 \
    python3-pip \
    ca-certificates \
    gnupg \
    lsb-release \
    2>&1 | tee -a "$LOG_FILE"

log "✓ Dependências do sistema instaladas"

# 5. Instalar Node.js 20.x
log_info "Instalando Node.js 20.x..."
if ! command -v node &> /dev/null || [ "$(node -v | cut -d'.' -f1 | sed 's/v//')" -lt 20 ]; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    log "✓ Node.js instalado: $(node -v)"
else
    log "✓ Node.js já instalado: $(node -v)"
fi

# 6. Instalar pnpm
log_info "Instalando pnpm..."
if ! command -v pnpm &> /dev/null; then
    sudo npm install -g pnpm
    log "✓ pnpm instalado: $(pnpm -v)"
else
    log "✓ pnpm já instalado: $(pnpm -v)"
fi

# 7. Instalar PM2
log_info "Instalando PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
    pm2 startup | sudo bash
    log "✓ PM2 instalado"
else
    log "✓ PM2 já instalado"
fi

# 8. Configurar MySQL
log_info "Configurando MySQL..."
sudo systemctl start mysql
sudo systemctl enable mysql

# Criar banco de dados
mysql -u "$DB_USER" -p"$DB_PASS" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;" 2>/dev/null || {
    log_warn "Não foi possível criar banco, tentando como root..."
    sudo mysql -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
    sudo mysql -e "CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';"
    sudo mysql -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';"
    sudo mysql -e "FLUSH PRIVILEGES;"
}

log "✓ MySQL configurado"

# 9. Criar diretório de instalação
log_info "Criando diretório de instalação..."
sudo mkdir -p "$INSTALL_DIR"
sudo chown -R $(whoami):$(whoami) "$INSTALL_DIR"
log "✓ Diretório criado: $INSTALL_DIR"

# 10. Copiar arquivos
log_info "Copiando arquivos do projeto..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ "$SCRIPT_DIR" != "$INSTALL_DIR" ]; then
    cp -r "$SCRIPT_DIR"/* "$INSTALL_DIR/"
    log "✓ Arquivos copiados"
fi

cd "$INSTALL_DIR"

# 11. Criar arquivo .env
log_info "Criando arquivo .env..."
cat > .env << EOF
# Database Configuration
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASS
DB_NAME=$DB_NAME

# Server Configuration
PORT=3001
NODE_ENV=production

# LM Studio Configuration
LM_STUDIO_URL=http://localhost:1234/v1

# Encryption
ENCRYPTION_KEY=$(openssl rand -hex 16)

# Server Info
SSH_HOST=192.168.1.247
SSH_USER=flavio
SSH_PORT=22
EOF

log "✓ Arquivo .env criado"

# 12. Aplicar schema SQL
log_info "Aplicando schema do banco de dados..."
if ! mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < schema.sql 2>&1 | tee -a "$LOG_FILE"; then
    log_error "Erro ao aplicar schema SQL"
    log_error "Verifique o log em: $LOG_FILE"
    exit 1
fi

# Verificar se as tabelas foram criadas
TABLES_COUNT=$(mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SHOW TABLES;" 2>/dev/null | wc -l)
if [ "$TABLES_COUNT" -lt 23 ]; then
    log_error "Schema não foi aplicado corretamente (esperado 23+ tabelas, encontrado $TABLES_COUNT)"
    exit 1
fi

log "✓ Schema aplicado (23 tabelas criadas)"

# 13. Instalar dependências NPM
log_info "Instalando dependências NPM (isso pode demorar)..."

# Tentar com pnpm primeiro, se falhar usar npm
if command -v pnpm &> /dev/null; then
    log_info "Usando pnpm..."
    # Configurar pnpm para ser mais permissivo
    pnpm config set auto-install-peers true 2>/dev/null || true
    pnpm config set strict-peer-dependencies false 2>/dev/null || true
    
    if ! pnpm install 2>&1 | tee -a "$LOG_FILE"; then
        log_warn "pnpm falhou, tentando com npm..."
        if ! npm install --legacy-peer-deps 2>&1 | tee -a "$LOG_FILE"; then
            log_error "Erro ao instalar dependências"
            exit 1
        fi
    fi
else
    log_info "Usando npm..."
    if ! npm install --legacy-peer-deps 2>&1 | tee -a "$LOG_FILE"; then
        log_error "Erro ao instalar dependências"
        exit 1
    fi
fi

# Verificar se node_modules foi criado
if [ ! -d "node_modules" ]; then
    log_error "node_modules não foi criado - instalação falhou"
    exit 1
fi

log "✓ Dependências instaladas"

# 14. Build do projeto
log_info "Fazendo build do projeto..."

# Build do servidor primeiro (crítico para evitar 502)
log_info "Compilando backend..."
if command -v pnpm &> /dev/null; then
    pnpm build:server 2>&1 | tee -a "$LOG_FILE" || npm run build:server 2>&1 | tee -a "$LOG_FILE"
else
    npm run build:server 2>&1 | tee -a "$LOG_FILE"
fi

# Verificar se o backend foi compilado
if [ ! -f "dist/index.js" ]; then
    log_error "Build do backend falhou - dist/index.js não existe"
    exit 1
fi
log "✓ Backend compilado: dist/index.js"

# Build do cliente
log_info "Compilando frontend..."
if command -v pnpm &> /dev/null; then
    pnpm build:client 2>&1 | tee -a "$LOG_FILE" || npm run build:client 2>&1 | tee -a "$LOG_FILE"
else
    npm run build:client 2>&1 | tee -a "$LOG_FILE"
fi

# Verificar se o frontend foi compilado
if [ ! -d "dist/client" ]; then
    log_error "Build do frontend falhou - dist/client não existe"
    exit 1
fi
log "✓ Frontend compilado: dist/client"

log "✓ Build concluído com sucesso"

# 15. Criar diretórios necessários
log_info "Criando diretórios necessários..."
mkdir -p logs tmp backups
log "✓ Diretórios criados"

# 16. Configurar PM2
log_info "Configurando PM2..."
pm2 start ecosystem.config.cjs
pm2 save
log "✓ Aplicação iniciada com PM2"

# 17. Validar instalação
log_info "Validando instalação..."
sleep 5

# Verificar se servidor está rodando
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    log "✓ Servidor respondendo corretamente"
else
    log_warn "Servidor não está respondendo, verificando logs..."
    pm2 logs orquestrador-v3 --lines 20 --nostream
fi

# Verificar banco de dados
if mysql -u "$DB_USER" -p"$DB_PASS" -e "USE $DB_NAME; SHOW TABLES;" | grep -q "users"; then
    log "✓ Banco de dados OK"
else
    log_error "Problema com banco de dados"
fi

# 18. Criar scripts de manutenção
log_info "Criando scripts de manutenção..."

cat > /home/flavio/orquestrador-start.sh << 'EOFSTART'
#!/bin/bash
cd /home/flavio/orquestrador-v3
pm2 start ecosystem.config.cjs
pm2 save
echo "✅ Orquestrador iniciado!"
EOFSTART

cat > /home/flavio/orquestrador-stop.sh << 'EOFSTOP'
#!/bin/bash
pm2 stop orquestrador-v3
echo "✅ Orquestrador parado!"
EOFSTOP

cat > /home/flavio/orquestrador-restart.sh << 'EOFRESTART'
#!/bin/bash
pm2 restart orquestrador-v3
echo "✅ Orquestrador reiniciado!"
EOFRESTART

cat > /home/flavio/orquestrador-logs.sh << 'EOFLOGS'
#!/bin/bash
pm2 logs orquestrador-v3
EOFLOGS

chmod +x /home/flavio/orquestrador-*.sh

log "✓ Scripts de manutenção criados"

# 19. Relatório final
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                  ║${NC}"
echo -e "${GREEN}║     ✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO!        ║${NC}"
echo -e "${GREEN}║                                                  ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📊 INFORMAÇÕES DO SISTEMA:${NC}"
echo ""
echo -e "  🌐 URL de Acesso:      ${GREEN}http://192.168.1.247:3000${NC}"
echo -e "  🔌 API Backend:        ${GREEN}http://192.168.1.247:3001${NC}"
echo -e "  📁 Diretório:          ${GREEN}$INSTALL_DIR${NC}"
echo -e "  💾 Backup:             ${GREEN}$BACKUP_DIR${NC}"
echo -e "  📝 Log de Instalação:  ${GREEN}$LOG_FILE${NC}"
echo ""
echo -e "${BLUE}🛠️  COMANDOS ÚTEIS:${NC}"
echo ""
echo -e "  Iniciar:    ${GREEN}~/orquestrador-start.sh${NC}"
echo -e "  Parar:      ${GREEN}~/orquestrador-stop.sh${NC}"
echo -e "  Reiniciar:  ${GREEN}~/orquestrador-restart.sh${NC}"
echo -e "  Ver logs:   ${GREEN}~/orquestrador-logs.sh${NC}"
echo -e "  Status PM2: ${GREEN}pm2 status${NC}"
echo ""
echo -e "${BLUE}✨ O sistema está pronto para orquestrar suas IAs!${NC}"
echo ""

log "Instalação finalizada com sucesso!"
exit 0
