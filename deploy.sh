#!/bin/bash

###############################################################################
# SCRIPT DE DEPLOY ÚNICO - ORQUESTRADOR DE IAs V3.0
# Versão Corrigida - Deploy Completo e Automático
# Autor: GenSpark AI Developer
# Data: 28/10/2025
###############################################################################

# Detectar usuário automaticamente
CURRENT_USER=$(whoami)
HOME_DIR=$(eval echo ~$CURRENT_USER)
INSTALL_DIR="$HOME_DIR/orquestrador-v3"

# Detectar IP do servidor
SERVER_IP=$(hostname -I | awk '{print $1}')

echo "╔══════════════════════════════════════════════════╗"
echo "║                                                  ║"
echo "║     DEPLOY AUTOMÁTICO                           ║"
echo "║     Orquestrador de IAs V3.0                    ║"
echo "║     Versão Corrigida                            ║"
echo "║                                                  ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo "👤 Usuário: $CURRENT_USER"
echo "📁 Instalando em: $INSTALL_DIR"
echo "🌐 IP do servidor: $SERVER_IP"
echo ""

# 1. Parar serviços antigos
echo "⏸️  Parando serviços antigos..."
pm2 stop orquestrador-v3 2>/dev/null || true
pm2 delete orquestrador-v3 2>/dev/null || true

# 2. Fazer backup da instalação antiga
if [ -d "$INSTALL_DIR" ]; then
    BACKUP_DIR="${INSTALL_DIR}-backup-$(date +%Y%m%d-%H%M%S)"
    echo "💾 Fazendo backup para: $BACKUP_DIR"
    mv "$INSTALL_DIR" "$BACKUP_DIR" 2>/dev/null || true
fi

# 3. Clonar repositório atualizado
echo "📦 Clonando repositório do GitHub..."
cd "$HOME_DIR"
git clone https://github.com/fmunizmcorp/orquestrador-ia.git orquestrador-v3
cd "$INSTALL_DIR"

# 4. Executar instalador automático
echo "🚀 Executando instalador automático..."
chmod +x instalar.sh
./instalar.sh

echo ""
echo "✅ DEPLOY CONCLUÍDO COM SUCESSO!"
echo ""
echo "🌐 Frontend: http://$SERVER_IP:3000"
echo "🔌 Backend:  http://$SERVER_IP:3001"
echo ""
echo "📚 Comandos úteis:"
echo "   ~/orquestrador-start.sh    - Iniciar"
echo "   ~/orquestrador-stop.sh     - Parar"
echo "   ~/orquestrador-restart.sh  - Reiniciar"
echo "   ~/orquestrador-logs.sh     - Ver logs"
echo ""
