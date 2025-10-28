#!/bin/bash

################################################################################
# SCRIPT DE CONFIGURAÇÃO COMPLETA - VERSÃO SIMPLES E FUNCIONAL
# Orquestrador de IAs V3.0
################################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[✓]${NC} $1"; }
log_error() { echo -e "${RED}[✗]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[!]${NC} $1"; }

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║   CONFIGURAÇÃO COMPLETA - ORQUESTRADOR V3.0      ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

APP_DIR="$HOME/orquestrador-v3"
cd "$APP_DIR"

if [ ! -f ".env" ]; then
    log_error "Arquivo .env não encontrado!"
    exit 1
fi

source .env

# ═══════════════════════════════════════════════════
# 1. POPULAR BANCO DE DADOS
# ═══════════════════════════════════════════════════
echo ""
echo -e "${CYAN}═════════════════════════════════════${NC}"
echo -e "${CYAN}1. POPULANDO BANCO DE DADOS${NC}"
echo -e "${CYAN}═════════════════════════════════════${NC}"

log_info "Executando script de população..."
if bash popular-dados.sh; then
    log_success "Banco de dados populado"
else
    log_error "Falha ao popular banco de dados"
    exit 1
fi

# ═══════════════════════════════════════════════════
# 2. CONFIGURAR NGINX
# ═══════════════════════════════════════════════════
echo ""
echo -e "${CYAN}═════════════════════════════════════${NC}"
echo -e "${CYAN}2. CONFIGURANDO NGINX${NC}"
echo -e "${CYAN}═════════════════════════════════════${NC}"

NGINX_CONF="/etc/nginx/sites-available/default"

if [ -f "$NGINX_CONF" ]; then
    log_info "Criando backup do Nginx..."
    sudo cp "$NGINX_CONF" "$NGINX_CONF.backup-$(date +%Y%m%d-%H%M%S)"
    
    log_info "Configurando Nginx..."
    sudo tee "$NGINX_CONF" > /dev/null << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name _;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /ws {
        proxy_pass http://localhost:3001/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
    
    location /api {
        proxy_pass http://localhost:3001/api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF
    
    if sudo nginx -t 2>&1; then
        sudo systemctl reload nginx
        log_success "Nginx configurado e recarregado"
    else
        log_error "Erro na configuração do Nginx"
        exit 1
    fi
else
    log_warning "Nginx não encontrado. Acesse diretamente pela porta 3001"
fi

# ═══════════════════════════════════════════════════
# 3. REINICIAR APLICAÇÃO
# ═══════════════════════════════════════════════════
echo ""
echo -e "${CYAN}═════════════════════════════════════${NC}"
echo -e "${CYAN}3. REINICIANDO APLICAÇÃO${NC}"
echo -e "${CYAN}═════════════════════════════════════${NC}"

log_info "Reiniciando PM2..."
pm2 restart orquestrador-v3

sleep 3

if pm2 list | grep -q "orquestrador-v3.*online"; then
    log_success "Aplicação rodando"
else
    log_error "Falha ao reiniciar aplicação"
    pm2 logs orquestrador-v3 --lines 20 --nostream
    exit 1
fi

# ═══════════════════════════════════════════════════
# 4. VALIDAÇÃO
# ═══════════════════════════════════════════════════
echo ""
echo -e "${CYAN}═════════════════════════════════════${NC}"
echo -e "${CYAN}4. VALIDANDO SISTEMA${NC}"
echo -e "${CYAN}═════════════════════════════════════${NC}"

sleep 2

# Testar backend
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health 2>/dev/null || echo "000")
if [ "$HEALTH" = "200" ]; then
    log_success "Backend: HTTP 200"
else
    log_error "Backend: HTTP $HEALTH"
fi

# Testar frontend
ROOT=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/ 2>/dev/null || echo "000")
if [ "$ROOT" = "200" ]; then
    log_success "Frontend: HTTP 200"
else
    log_error "Frontend: HTTP $ROOT"
fi

# Testar Nginx
if [ -f "$NGINX_CONF" ]; then
    NGINX_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ 2>/dev/null || echo "000")
    if [ "$NGINX_TEST" = "200" ]; then
        log_success "Nginx: HTTP 200"
    else
        log_warning "Nginx: HTTP $NGINX_TEST"
    fi
fi

# ═══════════════════════════════════════════════════
# RESUMO FINAL
# ═══════════════════════════════════════════════════
echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║                                                  ║"
echo "║     ✅ CONFIGURAÇÃO CONCLUÍDA!                  ║"
echo "║                                                  ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✅ Banco de dados populado${NC}"
echo -e "${GREEN}✅ Nginx configurado${NC}"
echo -e "${GREEN}✅ Sistema reiniciado${NC}"
echo ""
echo -e "${CYAN}🌐 ACESSE AGORA:${NC}"
echo ""
if [ -f "$NGINX_CONF" ] && [ "$NGINX_TEST" = "200" ]; then
    echo -e "   ${GREEN}http://192.168.1.247${NC} (porta 80)"
fi
echo -e "   ${GREEN}http://192.168.1.247:3001${NC} (direto)"
echo ""
echo -e "${CYAN}📊 DADOS CADASTRADOS:${NC}"
echo ""
mysql -u "$DB_USER" -p"$DB_PASSWORD" -D "$DB_NAME" -e "
SELECT 'Provedores' as Tipo, COUNT(*) as Total FROM aiProviders
UNION ALL
SELECT 'Modelos', COUNT(*) FROM aiModels
UNION ALL
SELECT 'IAs Especializadas', COUNT(*) FROM specializedAIs
UNION ALL
SELECT 'Instruções', COUNT(*) FROM instructions;
" 2>/dev/null | column -t
echo ""
echo -e "${CYAN}📚 PRÓXIMOS PASSOS:${NC}"
echo ""
echo "1. Acesse o sistema pela URL acima"
echo "2. Vá em 'Provedores' para ver os 9 cadastrados"
echo "3. Vá em 'Modelos' para ver os 15+ cadastrados"
echo "4. Vá em 'IAs Especializadas' para ver as 11 IAs"
echo "5. Configure credenciais: Leia MANUAL-CREDENCIAIS.md"
echo ""
echo -e "${GREEN}✨ Sistema pronto!${NC}"
echo ""
