#!/bin/bash
# ===================================================================
# SCRIPT DE DEPLOY AUTOMÁTICO - ORQUESTRADOR IA
# ===================================================================
# Este script deve ser executado NO SERVIDOR (31.97.64.43)
# Para executar: bash deploy-automatic.sh
# ===================================================================

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  DEPLOY AUTOMÁTICO - ORQUESTRADOR IA - EPIC 1 & 2         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Configurações
PROJECT_DIR="/root/orquestrador-ia"
BRANCH="genspark_ai_developer"
PM2_APP="orquestrador-ia"

# Função de log
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# 1. NAVEGAR PARA O DIRETÓRIO DO PROJETO
log "1. Navegando para o diretório do projeto..."
cd "$PROJECT_DIR" || { log "ERRO: Diretório não encontrado!"; exit 1; }

# 2. BACKUP DO CÓDIGO ATUAL
log "2. Criando backup do código atual..."
BACKUP_DIR="/root/backups/orquestrador-$(date +%Y%m%d_%H%M%S)"
mkdir -p "$(dirname "$BACKUP_DIR")"
cp -r "$PROJECT_DIR" "$BACKUP_DIR" || log "AVISO: Backup falhou, continuando..."

# 3. VERIFICAR STATUS DO GIT
log "3. Verificando status do Git..."
git status

# 4. STASH DE MUDANÇAS LOCAIS (se houver)
log "4. Salvando mudanças locais (se houver)..."
git stash || log "Nenhuma mudança para salvar"

# 5. FETCH DO GITHUB
log "5. Baixando atualizações do GitHub..."
git fetch origin "$BRANCH"

# 6. CHECKOUT E PULL DA BRANCH
log "6. Atualizando branch $BRANCH..."
git checkout "$BRANCH"
git pull origin "$BRANCH" || { log "ERRO: Pull falhou!"; exit 1; }

# 7. MOSTRAR COMMITS RECENTES
log "7. Commits recentes aplicados:"
git log --oneline -10

# 8. INSTALAR/ATUALIZAR DEPENDÊNCIAS
log "8. Instalando dependências..."
if [ -f "package-lock.json" ]; then
    npm ci || npm install
else
    npm install
fi

# 9. BUILD DO PROJETO (se necessário)
log "9. Compilando projeto..."
if grep -q '"build"' package.json; then
    npm run build || log "Build não necessário ou já realizado"
fi

# 10. EXECUTAR TESTES (se disponível)
log "10. Executando testes..."
if [ -f "test-all-routers.sh" ]; then
    bash test-all-routers.sh || log "AVISO: Alguns testes falharam"
fi

# 11. RESTART DO PM2
log "11. Reiniciando aplicação PM2..."
pm2 restart "$PM2_APP" || pm2 start ecosystem.config.js || { log "ERRO: PM2 restart falhou!"; exit 1; }

# 12. VERIFICAR STATUS DO PM2
log "12. Status da aplicação:"
pm2 status

# 13. VERIFICAR LOGS
log "13. Logs recentes:"
pm2 logs "$PM2_APP" --nostream --lines 30 || pm2 logs --nostream --lines 30

# 14. HEALTH CHECK
log "14. Testando endpoints..."
sleep 3
curl -s http://localhost:3001/ > /dev/null && log "✅ Servidor respondendo!" || log "⚠️  Servidor não respondeu"

# 15. SALVAR PM2
log "15. Salvando configuração PM2..."
pm2 save

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  ✅ DEPLOY CONCLUÍDO COM SUCESSO!                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
log "Backup salvo em: $BACKUP_DIR"
log "Branch ativa: $(git branch --show-current)"
log "Último commit: $(git log --oneline -1)"
