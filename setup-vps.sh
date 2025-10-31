#!/bin/bash
################################################################################
# Script: setup-ssh-forwarding-vps.sh
# Servidor: VPS 31.97.64.43 (root)
# Descrição: Configura forwarding SSH da porta 2224 para 192.168.192.164:22
################################################################################

set -e

echo "🚀 Configurando SSH Forwarding no VPS..."

# Variáveis
TARGET_SERVER="192.168.192.164"
TARGET_PORT="22"
FORWARD_PORT="2224"
ZT_INTERFACE="zt6jys7y4o"

# [1] Verificar ZeroTier
echo "[1/7] Verificando ZeroTier..."
TIMEOUT=60
ELAPSED=0
while ! ip addr show "$ZT_INTERFACE" 2>/dev/null | grep -q 'inet '; do
    if [ $ELAPSED -ge $TIMEOUT ]; then
        echo "❌ ERRO: ZeroTier não conectado"
        exit 1
    fi
    sleep 5
    ELAPSED=$((ELAPSED + 5))
done
echo "✓ ZeroTier conectado"

# [2] Habilitar IP forwarding
echo "[2/7] Habilitando IP forwarding..."
sysctl -w net.ipv4.ip_forward=1 > /dev/null
if ! grep -q "^net.ipv4.ip_forward=1" /etc/sysctl.conf; then
    echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
fi
sysctl -p > /dev/null 2>&1
echo "✓ IP forwarding habilitado"

# [3] Instalar iptables-persistent
echo "[3/7] Instalando iptables-persistent..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq > /dev/null 2>&1
echo iptables-persistent iptables-persistent/autosave_v4 boolean true | debconf-set-selections
echo iptables-persistent iptables-persistent/autosave_v6 boolean true | debconf-set-selections
apt-get install -y iptables-persistent > /dev/null 2>&1
echo "✓ iptables-persistent instalado"

# [4] Limpar regras antigas
echo "[4/7] Limpando regras antigas..."
iptables -t nat -D PREROUTING -p tcp --dport $FORWARD_PORT -j DNAT --to-destination ${TARGET_SERVER}:${TARGET_PORT} 2>/dev/null || true
iptables -D FORWARD -p tcp -d $TARGET_SERVER --dport $TARGET_PORT -j ACCEPT 2>/dev/null || true
echo "✓ Regras antigas removidas"

# [5] Configurar iptables
echo "[5/7] Configurando iptables..."
iptables -t nat -A PREROUTING -p tcp --dport $FORWARD_PORT -j DNAT --to-destination ${TARGET_SERVER}:${TARGET_PORT}
iptables -t nat -A POSTROUTING -j MASQUERADE
iptables -A FORWARD -p tcp -d $TARGET_SERVER --dport $TARGET_PORT -j ACCEPT
iptables -A FORWARD -p tcp -s $TARGET_SERVER --sport $TARGET_PORT -j ACCEPT
iptables -A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT
echo "✓ Regras iptables configuradas"

# [6] Salvar regras
echo "[6/7] Salvando regras..."
netfilter-persistent save > /dev/null 2>&1
echo "✓ Regras salvas"

# [7] Configurar SSH daemon
echo "[7/7] Configurando SSH daemon..."
if ! grep -q "^Port 22$" /etc/ssh/sshd_config; then
    echo "Port 22" >> /etc/ssh/sshd_config
fi
sed -i '/^Port 2224$/d' /etc/ssh/sshd_config
systemctl restart sshd
echo "✓ SSH configurado"

echo ""
echo "✅ CONFIGURAÇÃO CONCLUÍDA!"
echo ""
echo "📋 COMO USAR:"
echo "   • Porta 22: ssh root@31.97.64.43 (acesso normal ao VPS)"
echo "   • Porta 2224: ssh -p 2224 flavio@31.97.64.43 (forwarding para 192.168.192.164)"
echo ""
echo "🔧 TESTE:"
echo "   sshpass -p 'sshflavioia' ssh -p 2224 flavio@31.97.64.43"
echo ""
