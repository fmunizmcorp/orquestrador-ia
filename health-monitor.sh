#!/bin/bash

################################################################################
# HEALTH MONITOR - Sistema de Monitoramento Avançado
# Orquestrador de IAs V3.4.0
#
# Descrição: Monitora saúde do sistema e realiza recovery automático
# Uso: ./health-monitor.sh [--continuous] [--interval SECONDS]
################################################################################

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
HOST="192.168.192.164"
PORT="3001"
PM2_PROCESS_NAME="orquestrador-v3"
HEALTH_ENDPOINT="http://${HOST}:${PORT}/api/health"
LOG_FILE="/home/flavio/webapp/logs/health-monitor.log"
CONTINUOUS_MODE=false
CHECK_INTERVAL=60  # segundos

# Parse argumentos
while [[ $# -gt 0 ]]; do
  case $1 in
    --continuous)
      CONTINUOUS_MODE=true
      shift
      ;;
    --interval)
      CHECK_INTERVAL="$2"
      shift 2
      ;;
    --help)
      echo "Uso: $0 [--continuous] [--interval SECONDS]"
      echo ""
      echo "Opções:"
      echo "  --continuous    Executa monitoramento contínuo"
      echo "  --interval N    Define intervalo entre checks (padrão: 60 segundos)"
      echo "  --help          Mostra esta mensagem"
      exit 0
      ;;
    *)
      echo "Opção desconhecida: $1"
      echo "Use --help para ver opções disponíveis"
      exit 1
      ;;
  esac
done

# Função para logging
log_message() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "${timestamp} [${level}] ${message}" | tee -a "${LOG_FILE}"
}

# Função para exibir header
show_header() {
    echo ""
    echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║         HEALTH MONITOR - Orquestrador de IAs V3.4.0          ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Função para verificar se porta está aberta
check_port() {
    local host=$1
    local port=$2
    
    if nc -z -w5 "${host}" "${port}" 2>/dev/null; then
        return 0
    else
        return 1
    fi
}

# Função para verificar processo PM2
check_pm2_process() {
    local status=$(pm2 jlist 2>/dev/null | jq -r ".[] | select(.name==\"${PM2_PROCESS_NAME}\") | .pm2_env.status" 2>/dev/null)
    
    if [ "$status" == "online" ]; then
        return 0
    else
        return 1
    fi
}

# Função para obter métricas do PM2
get_pm2_metrics() {
    local metrics=$(pm2 jlist 2>/dev/null | jq -r ".[] | select(.name==\"${PM2_PROCESS_NAME}\") | {
        uptime: .pm2_env.pm_uptime,
        restarts: .pm2_env.restart_time,
        memory: .monit.memory,
        cpu: .monit.cpu
    }" 2>/dev/null)
    
    echo "$metrics"
}

# Função para verificar health endpoint
check_health_endpoint() {
    local response=$(curl -s -w "\n%{http_code}" --connect-timeout 5 --max-time 10 "${HEALTH_ENDPOINT}" 2>/dev/null)
    local body=$(echo "$response" | head -n -1)
    local http_code=$(echo "$response" | tail -n 1)
    
    if [ "$http_code" == "200" ]; then
        local status=$(echo "$body" | jq -r '.status' 2>/dev/null)
        local database=$(echo "$body" | jq -r '.database' 2>/dev/null)
        
        if [ "$status" == "ok" ] && [ "$database" == "connected" ]; then
            echo "$body"
            return 0
        fi
    fi
    
    return 1
}

# Função para verificar uso de recursos
check_resources() {
    local memory_usage=$(free -m | awk 'NR==2{printf "%.2f", $3*100/$2 }')
    local disk_usage=$(df -h /home/flavio/webapp | awk 'NR==2{print $5}' | sed 's/%//')
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')
    
    echo "{\"memory\": $memory_usage, \"disk\": $disk_usage, \"cpu\": $cpu_usage}"
}

# Função para recovery automático
auto_recovery() {
    local reason=$1
    
    log_message "WARNING" "Iniciando recovery automático. Motivo: ${reason}"
    
    # Tentar restart suave primeiro
    echo -e "${YELLOW}[RECOVERY] Tentando restart suave do PM2...${NC}"
    if pm2 restart "${PM2_PROCESS_NAME}" 2>&1 | tee -a "${LOG_FILE}"; then
        log_message "INFO" "Restart suave executado com sucesso"
        sleep 10
        
        # Verificar se resolveu
        if check_health_endpoint >/dev/null 2>&1; then
            echo -e "${GREEN}[RECOVERY] ✅ Sistema recuperado com sucesso!${NC}"
            log_message "INFO" "Recovery bem-sucedido após restart suave"
            return 0
        fi
    fi
    
    # Se restart suave falhou, tentar reload
    echo -e "${YELLOW}[RECOVERY] Tentando reload completo do PM2...${NC}"
    if pm2 reload "${PM2_PROCESS_NAME}" 2>&1 | tee -a "${LOG_FILE}"; then
        log_message "INFO" "Reload completo executado"
        sleep 10
        
        if check_health_endpoint >/dev/null 2>&1; then
            echo -e "${GREEN}[RECOVERY] ✅ Sistema recuperado após reload!${NC}"
            log_message "INFO" "Recovery bem-sucedido após reload"
            return 0
        fi
    fi
    
    # Último recurso: stop e start
    echo -e "${RED}[RECOVERY] Executando stop/start forçado...${NC}"
    pm2 stop "${PM2_PROCESS_NAME}" 2>&1 | tee -a "${LOG_FILE}"
    sleep 5
    pm2 start ecosystem.config.cjs 2>&1 | tee -a "${LOG_FILE}"
    sleep 15
    
    if check_health_endpoint >/dev/null 2>&1; then
        echo -e "${GREEN}[RECOVERY] ✅ Sistema recuperado após stop/start!${NC}"
        log_message "INFO" "Recovery bem-sucedido após stop/start forçado"
        return 0
    else
        echo -e "${RED}[RECOVERY] ❌ Falha no recovery automático!${NC}"
        log_message "ERROR" "Recovery automático falhou. Intervenção manual necessária"
        return 1
    fi
}

# Função principal de health check
perform_health_check() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local overall_status="HEALTHY"
    local issues=()
    
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}Health Check executado em: ${timestamp}${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    
    # 1. Verificar porta
    echo -n "🔌 Verificando porta ${PORT}... "
    if check_port "${HOST}" "${PORT}"; then
        echo -e "${GREEN}✅ OPEN${NC}"
        log_message "INFO" "Porta ${PORT} está aberta"
    else
        echo -e "${RED}❌ CLOSED${NC}"
        log_message "ERROR" "Porta ${PORT} está fechada"
        overall_status="UNHEALTHY"
        issues+=("Porta ${PORT} não está acessível")
    fi
    
    # 2. Verificar processo PM2
    echo -n "⚙️  Verificando processo PM2... "
    if check_pm2_process; then
        echo -e "${GREEN}✅ ONLINE${NC}"
        log_message "INFO" "Processo PM2 está online"
        
        # Obter métricas
        local metrics=$(get_pm2_metrics)
        if [ -n "$metrics" ]; then
            local uptime=$(echo "$metrics" | jq -r '.uptime')
            local restarts=$(echo "$metrics" | jq -r '.restarts')
            local memory=$(echo "$metrics" | jq -r '.memory')
            local cpu=$(echo "$metrics" | jq -r '.cpu')
            
            # Converter uptime para formato legível
            local uptime_seconds=$(($(date +%s) - uptime / 1000))
            local uptime_human=$(printf '%dd %dh %dm' $((uptime_seconds/86400)) $((uptime_seconds%86400/3600)) $((uptime_seconds%3600/60)))
            
            # Converter memória para MB
            local memory_mb=$((memory / 1024 / 1024))
            
            echo "   📊 Uptime: ${uptime_human}"
            echo "   📊 Restarts: ${restarts}"
            echo "   📊 Memória: ${memory_mb} MB"
            echo "   📊 CPU: ${cpu}%"
            
            # Verificar limites críticos
            if [ "$restarts" -gt 10 ]; then
                echo -e "   ${YELLOW}⚠️  AVISO: Número alto de restarts (${restarts})${NC}"
                log_message "WARNING" "Número alto de restarts detectado: ${restarts}"
            fi
            
            if [ "$memory_mb" -gt 500 ]; then
                echo -e "   ${YELLOW}⚠️  AVISO: Uso alto de memória (${memory_mb} MB)${NC}"
                log_message "WARNING" "Uso alto de memória detectado: ${memory_mb} MB"
            fi
        fi
    else
        echo -e "${RED}❌ OFFLINE${NC}"
        log_message "ERROR" "Processo PM2 está offline"
        overall_status="CRITICAL"
        issues+=("Processo PM2 não está rodando")
    fi
    
    # 3. Verificar health endpoint
    echo -n "🏥 Verificando health endpoint... "
    local health_response=$(check_health_endpoint 2>&1)
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ HEALTHY${NC}"
        log_message "INFO" "Health endpoint respondeu com sucesso"
        
        # Extrair informações do health check
        local db_status=$(echo "$health_response" | jq -r '.database' 2>/dev/null)
        local system_status=$(echo "$health_response" | jq -r '.system' 2>/dev/null)
        
        echo "   📊 Database: ${db_status}"
        echo "   📊 System: ${system_status}"
        
        if [ "$db_status" != "connected" ]; then
            echo -e "   ${RED}❌ Database não está conectado!${NC}"
            log_message "ERROR" "Database não está conectado"
            overall_status="UNHEALTHY"
            issues+=("Database não conectado")
        fi
    else
        echo -e "${RED}❌ FAILED${NC}"
        log_message "ERROR" "Health endpoint não respondeu"
        overall_status="CRITICAL"
        issues+=("Health endpoint não responde")
    fi
    
    # 4. Verificar recursos do sistema
    echo -n "💻 Verificando recursos do sistema... "
    local resources=$(check_resources)
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ OK${NC}"
        
        local memory=$(echo "$resources" | jq -r '.memory')
        local disk=$(echo "$resources" | jq -r '.disk')
        local cpu=$(echo "$resources" | jq -r '.cpu')
        
        echo "   📊 Memória: ${memory}%"
        echo "   📊 Disco: ${disk}%"
        echo "   📊 CPU: ${cpu}%"
        
        # Alertas de recursos
        if (( $(echo "$memory > 80" | bc -l) )); then
            echo -e "   ${YELLOW}⚠️  AVISO: Memória acima de 80%${NC}"
            log_message "WARNING" "Memória do sistema em ${memory}%"
        fi
        
        if (( $(echo "$disk > 85" | bc -l) )); then
            echo -e "   ${YELLOW}⚠️  AVISO: Disco acima de 85%${NC}"
            log_message "WARNING" "Disco do sistema em ${disk}%"
        fi
        
        if (( $(echo "$cpu > 90" | bc -l) )); then
            echo -e "   ${YELLOW}⚠️  AVISO: CPU acima de 90%${NC}"
            log_message "WARNING" "CPU do sistema em ${cpu}%"
        fi
    else
        echo -e "${YELLOW}⚠️  PARCIAL${NC}"
        log_message "WARNING" "Não foi possível obter todas as métricas de recursos"
    fi
    
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    
    # Status final
    if [ "$overall_status" == "HEALTHY" ]; then
        echo -e "${GREEN}✅ STATUS GERAL: SAUDÁVEL${NC}"
        echo -e "${GREEN}   Sistema operando normalmente${NC}"
        log_message "INFO" "Health check concluído: Sistema saudável"
        return 0
    elif [ "$overall_status" == "UNHEALTHY" ]; then
        echo -e "${YELLOW}⚠️  STATUS GERAL: DEGRADADO${NC}"
        echo -e "${YELLOW}   Problemas detectados:${NC}"
        for issue in "${issues[@]}"; do
            echo -e "${YELLOW}   - ${issue}${NC}"
        done
        log_message "WARNING" "Health check concluído: Sistema degradado - ${#issues[@]} problema(s)"
        
        # Tentar recovery automático
        if auto_recovery "Sistema degradado"; then
            return 0
        else
            return 2
        fi
    else
        echo -e "${RED}❌ STATUS GERAL: CRÍTICO${NC}"
        echo -e "${RED}   Falhas críticas detectadas:${NC}"
        for issue in "${issues[@]}"; do
            echo -e "${RED}   - ${issue}${NC}"
        done
        log_message "ERROR" "Health check concluído: Sistema crítico - ${#issues[@]} falha(s)"
        
        # Tentar recovery automático
        if auto_recovery "Sistema crítico"; then
            return 0
        else
            return 1
        fi
    fi
    
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
}

# Função principal
main() {
    show_header
    
    # Criar diretório de logs se não existir
    mkdir -p "$(dirname "${LOG_FILE}")"
    
    log_message "INFO" "Health Monitor iniciado"
    
    if [ "$CONTINUOUS_MODE" == "true" ]; then
        echo -e "${BLUE}Modo contínuo ativado. Intervalo: ${CHECK_INTERVAL} segundos${NC}"
        echo -e "${BLUE}Pressione Ctrl+C para parar${NC}"
        echo ""
        
        while true; do
            perform_health_check
            echo ""
            echo -e "${BLUE}Próximo check em ${CHECK_INTERVAL} segundos...${NC}"
            echo ""
            sleep "${CHECK_INTERVAL}"
        done
    else
        perform_health_check
        exit $?
    fi
}

# Executar
main
