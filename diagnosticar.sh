#!/bin/bash

################################################################################
# SCRIPT DE DIAGNÓSTICO COMPLETO
# Orquestrador de IAs V3.0
# 
# Verifica todos os componentes do sistema
################################################################################

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log_section() {
    echo ""
    echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
}

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
echo "║     DIAGNÓSTICO COMPLETO DO SISTEMA             ║"
echo "║     Orquestrador de IAs V3.0                    ║"
echo "║                                                  ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

APP_DIR="$HOME/orquestrador-v3"

# ═══════════════════════════════════════════════════
# 1. VERIFICAR DIRETÓRIO
# ═══════════════════════════════════════════════════
log_section "1. DIRETÓRIO DA APLICAÇÃO"

if [ -d "$APP_DIR" ]; then
    log_success "Diretório encontrado: $APP_DIR"
    cd "$APP_DIR"
else
    log_error "Diretório não encontrado: $APP_DIR"
    exit 1
fi

# ═══════════════════════════════════════════════════
# 2. VERIFICAR ARQUIVOS COMPILADOS
# ═══════════════════════════════════════════════════
log_section "2. ARQUIVOS COMPILADOS"

# Backend
if [ -f "dist/index.js" ]; then
    SIZE=$(du -h dist/index.js | cut -f1)
    log_success "Backend compilado: dist/index.js ($SIZE)"
else
    log_error "Backend NÃO compilado: dist/index.js não encontrado"
fi

# Frontend
if [ -d "dist/client" ]; then
    COUNT=$(find dist/client -type f | wc -l)
    SIZE=$(du -sh dist/client | cut -f1)
    log_success "Frontend compilado: dist/client ($COUNT arquivos, $SIZE)"
    
    if [ -f "dist/client/index.html" ]; then
        log_success "  ├─ index.html encontrado"
    else
        log_error "  ├─ index.html NÃO encontrado!"
    fi
    
    JS_COUNT=$(find dist/client -name "*.js" | wc -l)
    CSS_COUNT=$(find dist/client -name "*.css" | wc -l)
    log_info "  ├─ Arquivos JS: $JS_COUNT"
    log_info "  └─ Arquivos CSS: $CSS_COUNT"
else
    log_error "Frontend NÃO compilado: dist/client não encontrado"
fi

# ═══════════════════════════════════════════════════
# 3. VERIFICAR CONFIGURAÇÃO
# ═══════════════════════════════════════════════════
log_section "3. CONFIGURAÇÃO (.env)"

if [ -f ".env" ]; then
    log_success "Arquivo .env encontrado"
    
    # Verificar variáveis importantes
    if grep -q "^NODE_ENV=" .env; then
        NODE_ENV_VALUE=$(grep "^NODE_ENV=" .env | cut -d'=' -f2)
        if [ "$NODE_ENV_VALUE" = "production" ]; then
            log_success "  ├─ NODE_ENV=production ✓"
        else
            log_warning "  ├─ NODE_ENV=$NODE_ENV_VALUE (deveria ser 'production')"
        fi
    else
        log_error "  ├─ NODE_ENV não definido!"
    fi
    
    if grep -q "^PORT=" .env; then
        PORT_VALUE=$(grep "^PORT=" .env | cut -d'=' -f2)
        log_info "  ├─ PORT=$PORT_VALUE"
    else
        log_warning "  ├─ PORT não definido (usará padrão 3001)"
    fi
    
    if grep -q "^DB_HOST=" .env; then
        log_success "  ├─ DB_HOST definido"
    else
        log_error "  ├─ DB_HOST não definido!"
    fi
    
    if grep -q "^DB_NAME=" .env; then
        DB_NAME=$(grep "^DB_NAME=" .env | cut -d'=' -f2)
        log_success "  └─ DB_NAME=$DB_NAME"
    else
        log_error "  └─ DB_NAME não definido!"
    fi
else
    log_error "Arquivo .env NÃO encontrado!"
fi

# ═══════════════════════════════════════════════════
# 4. VERIFICAR PM2
# ═══════════════════════════════════════════════════
log_section "4. PROCESSOS PM2"

if command -v pm2 >/dev/null 2>&1; then
    log_success "PM2 instalado"
    
    echo ""
    pm2 list
    echo ""
    
    if pm2 list | grep -q "orquestrador-v3"; then
        if pm2 list | grep -q "orquestrador-v3.*online"; then
            log_success "Aplicação orquestrador-v3 está ONLINE"
            
            # Verificar variáveis de ambiente do processo
            log_info "Variáveis de ambiente do processo PM2:"
            pm2 env 0 2>/dev/null | grep -E "(NODE_ENV|PORT)" || log_warning "Não foi possível verificar env vars"
        else
            log_error "Aplicação orquestrador-v3 está OFFLINE"
        fi
    else
        log_warning "Aplicação orquestrador-v3 não encontrada no PM2"
    fi
else
    log_error "PM2 não instalado!"
fi

# ═══════════════════════════════════════════════════
# 5. VERIFICAR PORTAS
# ═══════════════════════════════════════════════════
log_section "5. PORTAS EM USO"

# Porta 3001 (backend)
if lsof -i :3001 >/dev/null 2>&1; then
    PROCESS=$(lsof -i :3001 -t 2>/dev/null | head -1)
    if [ -n "$PROCESS" ]; then
        PROC_NAME=$(ps -p $PROCESS -o comm= 2>/dev/null || echo "unknown")
        log_success "Porta 3001: OCUPADA (processo: $PROC_NAME, PID: $PROCESS)"
    else
        log_success "Porta 3001: OCUPADA"
    fi
else
    log_error "Porta 3001: LIVRE (nada rodando!)"
fi

# Porta 3000 (frontend standalone se existir)
if lsof -i :3000 >/dev/null 2>&1; then
    PROCESS=$(lsof -i :3000 -t 2>/dev/null | head -1)
    if [ -n "$PROCESS" ]; then
        PROC_NAME=$(ps -p $PROCESS -o comm= 2>/dev/null || echo "unknown")
        log_info "Porta 3000: OCUPADA (processo: $PROC_NAME, PID: $PROCESS)"
    else
        log_info "Porta 3000: OCUPADA"
    fi
else
    log_info "Porta 3000: LIVRE (normal se frontend servido pelo backend)"
fi

# Porta 80 (nginx)
if lsof -i :80 >/dev/null 2>&1; then
    log_success "Porta 80 (HTTP): OCUPADA (nginx)"
else
    log_warning "Porta 80 (HTTP): LIVRE"
fi

# ═══════════════════════════════════════════════════
# 6. TESTAR ENDPOINTS
# ═══════════════════════════════════════════════════
log_section "6. TESTES DE CONECTIVIDADE"

# Testar backend health
log_info "Testando backend health endpoint..."
HEALTH_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health 2>/dev/null || echo "000")
if [ "$HEALTH_CODE" = "200" ]; then
    log_success "Backend health: OK (HTTP 200)"
    
    # Pegar resposta detalhada
    HEALTH_RESPONSE=$(curl -s http://localhost:3001/api/health 2>/dev/null)
    echo "$HEALTH_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$HEALTH_RESPONSE"
elif [ "$HEALTH_CODE" = "000" ]; then
    log_error "Backend health: FALHA (sem conexão)"
else
    log_error "Backend health: FALHA (HTTP $HEALTH_CODE)"
fi

echo ""

# Testar frontend
log_info "Testando frontend (root endpoint)..."
ROOT_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/ 2>/dev/null || echo "000")
if [ "$ROOT_CODE" = "200" ]; then
    log_success "Frontend: OK (HTTP 200)"
    
    # Verificar se retorna HTML
    CONTENT=$(curl -s http://localhost:3001/ 2>/dev/null | head -c 100)
    if echo "$CONTENT" | grep -qi "<!DOCTYPE html"; then
        log_success "  └─ Retornando HTML válido"
    elif echo "$CONTENT" | grep -qi "<html"; then
        log_success "  └─ Retornando HTML"
    else
        log_warning "  └─ Conteúdo não parece ser HTML"
        echo "     Primeiros 100 chars: $CONTENT"
    fi
elif [ "$ROOT_CODE" = "404" ]; then
    log_error "Frontend: FALHA (HTTP 404 - arquivos não encontrados)"
    log_warning "  └─ NODE_ENV pode não estar como 'production'"
elif [ "$ROOT_CODE" = "000" ]; then
    log_error "Frontend: FALHA (sem conexão)"
else
    log_error "Frontend: FALHA (HTTP $ROOT_CODE)"
fi

# ═══════════════════════════════════════════════════
# 7. VERIFICAR BANCO DE DADOS
# ═══════════════════════════════════════════════════
log_section "7. BANCO DE DADOS"

if command -v mysql >/dev/null 2>&1; then
    log_success "MySQL client instalado"
    
    if [ -f ".env" ]; then
        source .env 2>/dev/null || true
        
        if [ -n "$DB_NAME" ] && [ -n "$DB_USER" ]; then
            log_info "Testando conexão com banco '$DB_NAME'..."
            
            if mysql -u "$DB_USER" -p"$DB_PASSWORD" -e "USE $DB_NAME; SELECT COUNT(*) FROM tasks;" 2>/dev/null >/dev/null; then
                log_success "Conexão com banco OK"
                
                # Contar tabelas
                TABLE_COUNT=$(mysql -u "$DB_USER" -p"$DB_PASSWORD" -D "$DB_NAME" -e "SHOW TABLES;" 2>/dev/null | wc -l)
                TABLE_COUNT=$((TABLE_COUNT - 1)) # Remove header
                log_info "  └─ Tabelas no banco: $TABLE_COUNT"
            else
                log_error "Falha ao conectar no banco"
            fi
        fi
    fi
else
    log_warning "MySQL client não instalado"
fi

# ═══════════════════════════════════════════════════
# 8. VERIFICAR NGINX
# ═══════════════════════════════════════════════════
log_section "8. NGINX"

if command -v nginx >/dev/null 2>&1; then
    log_success "Nginx instalado"
    
    if systemctl is-active --quiet nginx 2>/dev/null; then
        log_success "Nginx está ATIVO"
    else
        log_warning "Nginx está INATIVO"
    fi
    
    # Verificar configuração do site
    if [ -f "/etc/nginx/sites-enabled/default" ]; then
        log_info "Configuração nginx encontrada"
        
        if grep -q "proxy_pass.*:3000" /etc/nginx/sites-enabled/default 2>/dev/null; then
            log_warning "  ├─ Nginx fazendo proxy para porta 3000"
            log_warning "  └─ DEVERIA fazer proxy para porta 3001!"
        elif grep -q "proxy_pass.*:3001" /etc/nginx/sites-enabled/default 2>/dev/null; then
            log_success "  └─ Nginx fazendo proxy para porta 3001 ✓"
        fi
    fi
else
    log_info "Nginx não instalado (não é obrigatório)"
fi

# ═══════════════════════════════════════════════════
# 9. LOGS RECENTES
# ═══════════════════════════════════════════════════
log_section "9. LOGS RECENTES (últimas 15 linhas)"

if [ -d "logs" ]; then
    echo ""
    echo "📄 PM2 Output Log:"
    echo "---"
    tail -n 15 logs/pm2-out.log 2>/dev/null || log_warning "Sem logs de output"
    
    echo ""
    echo "📄 PM2 Error Log:"
    echo "---"
    tail -n 15 logs/pm2-error.log 2>/dev/null || log_warning "Sem logs de erro"
else
    pm2 logs orquestrador-v3 --lines 15 --nostream 2>/dev/null || log_warning "Logs não disponíveis"
fi

# ═══════════════════════════════════════════════════
# 10. RESUMO E RECOMENDAÇÕES
# ═══════════════════════════════════════════════════
log_section "10. RESUMO E RECOMENDAÇÕES"

echo ""
echo "📋 CHECKLIST:"
echo ""

ERROR_COUNT=0

# Check 1: Arquivos compilados
if [ -f "dist/index.js" ] && [ -d "dist/client" ]; then
    log_success "✓ Arquivos compilados existem"
else
    log_error "✗ Arquivos compilados faltando"
    ERROR_COUNT=$((ERROR_COUNT + 1))
fi

# Check 2: NODE_ENV
if [ -f ".env" ] && grep -q "^NODE_ENV=production" .env; then
    log_success "✓ NODE_ENV=production configurado"
else
    log_error "✗ NODE_ENV não está como production"
    ERROR_COUNT=$((ERROR_COUNT + 1))
fi

# Check 3: PM2 rodando
if pm2 list | grep -q "orquestrador-v3.*online"; then
    log_success "✓ Aplicação rodando no PM2"
else
    log_error "✗ Aplicação não está no PM2 ou está offline"
    ERROR_COUNT=$((ERROR_COUNT + 1))
fi

# Check 4: Backend respondendo
if [ "$HEALTH_CODE" = "200" ]; then
    log_success "✓ Backend respondendo (porta 3001)"
else
    log_error "✗ Backend não está respondendo"
    ERROR_COUNT=$((ERROR_COUNT + 1))
fi

# Check 5: Frontend servido
if [ "$ROOT_CODE" = "200" ]; then
    log_success "✓ Frontend sendo servido (porta 3001)"
else
    log_error "✗ Frontend não está sendo servido"
    ERROR_COUNT=$((ERROR_COUNT + 1))
fi

echo ""

if [ $ERROR_COUNT -eq 0 ]; then
    echo "╔══════════════════════════════════════════════════╗"
    echo "║                                                  ║"
    echo "║     ✅ SISTEMA ESTÁ OK!                         ║"
    echo "║                                                  ║"
    echo "╚══════════════════════════════════════════════════╝"
    echo ""
    echo "🌐 Acesso: http://192.168.1.247:3001"
    echo ""
else
    echo "╔══════════════════════════════════════════════════╗"
    echo "║                                                  ║"
    echo "║     ⚠️  PROBLEMAS ENCONTRADOS: $ERROR_COUNT                  ║"
    echo "║                                                  ║"
    echo "╚══════════════════════════════════════════════════╝"
    echo ""
    echo "🔧 AÇÕES RECOMENDADAS:"
    echo ""
    
    if ! pm2 list | grep -q "orquestrador-v3.*online"; then
        echo "1. Execute o script de correção:"
        echo "   cd ~/orquestrador-v3"
        echo "   chmod +x corrigir-frontend.sh"
        echo "   ./corrigir-frontend.sh"
        echo ""
    fi
    
    if [ "$ROOT_CODE" = "404" ]; then
        echo "2. Verifique se NODE_ENV=production no .env"
        echo "   grep NODE_ENV .env"
        echo ""
    fi
    
    if [ ! -f "dist/index.js" ]; then
        echo "3. Recompile o backend:"
        echo "   pnpm build:server"
        echo ""
    fi
    
    if [ ! -d "dist/client" ]; then
        echo "4. Recompile o frontend:"
        echo "   pnpm build:client"
        echo ""
    fi
fi

echo ""
log_info "Diagnóstico completo!"
