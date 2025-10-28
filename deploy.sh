#!/bin/bash

###############################################################################
# SCRIPT DE DEPLOY ÚNICO - ORQUESTRADOR DE IAs V3.0
# Versão Corrigida - Deploy Completo e Automático
# Autor: GenSpark AI Developer
# Data: 28/10/2025
###############################################################################

set -e

echo "╔══════════════════════════════════════════════════╗"
echo "║                                                  ║"
echo "║     DEPLOY AUTOMÁTICO                           ║"
echo "║     Orquestrador de IAs V3.0                    ║"
echo "║     Versão Corrigida                            ║"
echo "║                                                  ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# 1. Remover instalação antiga se existir
if [ -d "/home/flavio/orquestrador-v3" ]; then
    echo "⚠️  Removendo instalação antiga..."
    sudo pm2 stop orquestrador-v3 2>/dev/null || true
    sudo pm2 delete orquestrador-v3 2>/dev/null || true
    sudo rm -rf /home/flavio/orquestrador-v3-old-$(date +%s) 2>/dev/null || true
    mv /home/flavio/orquestrador-v3 /home/flavio/orquestrador-v3-old-$(date +%s) 2>/dev/null || true
fi

# 2. Clonar repositório atualizado
echo "📦 Clonando repositório do GitHub..."
cd /home/flavio
git clone https://github.com/fmunizmcorp/orquestrador-ia.git orquestrador-v3
cd orquestrador-v3

# 3. Executar instalador automático
echo "🚀 Executando instalador automático..."
chmod +x instalar.sh
./instalar.sh

echo ""
echo "✅ DEPLOY CONCLUÍDO!"
echo ""
echo "🌐 Acesse: http://192.168.1.247:3000"
echo ""
