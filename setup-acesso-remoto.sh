#!/bin/bash

#############################################
# Script de Configuração de Acesso Remoto
# SSH + ZeroTier VPN
# Ubuntu 24.04 LTS
#############################################

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

#############################################
# 1. CONFIGURAÇÃO SSH
#############################################

print_info "=== Configurando SSH ==="

# Instalar OpenSSH Server
print_info "Instalando OpenSSH Server..."
sudo apt-get update
sudo apt-get install -y openssh-server

# Habilitar serviço SSH
print_info "Habilitando serviço SSH..."
sudo systemctl enable ssh
sudo systemctl start ssh

# Configurar SSH (seguro)
print_info "Configurando SSH..."
sudo tee /etc/ssh/sshd_config.d/custom.conf > /dev/null <<'EOF'
# Configuração Personalizada SSH
Port 22
PermitRootLogin no
PasswordAuthentication yes
PubkeyAuthentication yes
X11Forwarding no
AllowTcpForwarding yes
ClientAliveInterval 120
ClientAliveCountMax 3
MaxAuthTries 3
EOF

# Reiniciar SSH
sudo systemctl restart ssh

# Criar usuário de acesso remoto (se não existir)
print_info "Configurando usuário de acesso remoto..."
read -p "$(echo -e ${CYAN}Digite o nome do usuário para acesso SSH: ${NC})" SSH_USER
echo

if id "$SSH_USER" &>/dev/null; then
    print_warning "Usuário $SSH_USER já existe"
else
    sudo adduser --gecos "" "$SSH_USER"
    sudo usermod -aG sudo "$SSH_USER"
    print_success "Usuário $SSH_USER criado e adicionado ao grupo sudo"
fi

# Configurar senha para o usuário
print_info "Configure a senha para o usuário $SSH_USER:"
sudo passwd "$SSH_USER"

# Obter IP local
IP_LOCAL=$(hostname -I | awk '{print $1}')
print_success "SSH configurado com sucesso!"
print_info "Você pode acessar via: ssh $SSH_USER@$IP_LOCAL"

#############################################
# 2. CONFIGURAÇÃO ZEROTIER VPN
#############################################

print_info "=== Configurando ZeroTier VPN ==="

# Instalar ZeroTier
print_info "Instalando ZeroTier..."
curl -s https://install.zerotier.com | sudo bash

# Solicitar Network ID
print_warning "Você precisa ter um Network ID do ZeroTier"
print_info "Crie uma rede em: https://my.zerotier.com"
echo
read -p "$(echo -e ${CYAN}Digite o Network ID do ZeroTier (16 caracteres): ${NC})" NETWORK_ID
echo

if [ -z "$NETWORK_ID" ]; then
    print_error "Network ID não pode estar vazio!"
    exit 1
fi

# Conectar à rede ZeroTier
print_info "Conectando à rede ZeroTier..."
sudo zerotier-cli join "$NETWORK_ID"

# Aguardar alguns segundos
sleep 5

# Obter status
ZEROTIER_STATUS=$(sudo zerotier-cli info)
ZEROTIER_ID=$(echo "$ZEROTIER_STATUS" | awk '{print $3}')

print_success "ZeroTier instalado e conectado!"
print_info "ZeroTier Node ID: $ZEROTIER_ID"
print_warning "IMPORTANTE: Você precisa autorizar este dispositivo no painel do ZeroTier!"
print_info "1. Acesse: https://my.zerotier.com/network/$NETWORK_ID"
print_info "2. Encontre o dispositivo com ID: $ZEROTIER_ID"
print_info "3. Marque a caixa 'Auth' para autorizar"
print_info "4. Anote o IP atribuído pelo ZeroTier (formato: 10.x.x.x ou 172.x.x.x)"

# Aguardar autorização
print_warning "Aguardando autorização... (Pressione Enter após autorizar no painel)"
read -r

# Obter IP ZeroTier
sleep 3
ZEROTIER_IP=$(sudo zerotier-cli listnetworks | grep "$NETWORK_ID" | awk '{print $9}')

if [ -z "$ZEROTIER_IP" ] || [ "$ZEROTIER_IP" == "-" ]; then
    print_warning "IP ZeroTier ainda não atribuído. Verifique o painel."
    print_info "Execute: sudo zerotier-cli listnetworks"
else
    print_success "IP ZeroTier atribuído: $ZEROTIER_IP"
fi

#############################################
# 3. CONFIGURAÇÃO DE FIREWALL (UFW)
#############################################

print_info "=== Configurando Firewall (UFW) ==="

# Instalar UFW se não estiver instalado
sudo apt-get install -y ufw

# Permitir SSH
sudo ufw allow 22/tcp comment 'SSH'

# Permitir porta da aplicação (3000 e 5000)
sudo ufw allow 3000/tcp comment 'Orquestrador Frontend'
sudo ufw allow 5000/tcp comment 'Orquestrador Backend'

# Permitir ZeroTier
sudo ufw allow 9993/udp comment 'ZeroTier'

# Habilitar UFW
print_warning "Habilitando firewall..."
echo "y" | sudo ufw enable

# Mostrar status
sudo ufw status verbose

print_success "Firewall configurado com sucesso!"

#############################################
# 4. TESTE DE CONECTIVIDADE
#############################################

print_info "=== Teste de Conectividade ==="

# Testar SSH local
print_info "Testando SSH localmente..."
if sudo systemctl is-active --quiet ssh; then
    print_success "SSH está rodando"
else
    print_error "SSH não está rodando!"
fi

# Testar ZeroTier
print_info "Testando ZeroTier..."
if sudo zerotier-cli info | grep -q "ONLINE"; then
    print_success "ZeroTier está online"
else
    print_warning "ZeroTier não está online"
fi

#############################################
# 5. INFORMAÇÕES FINAIS
#############################################

print_info "=== Informações de Acesso ==="
echo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 ACESSO LOCAL (mesma rede)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "IP Local: $IP_LOCAL"
echo "Usuário: $SSH_USER"
echo "Comando: ssh $SSH_USER@$IP_LOCAL"
echo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌍 ACESSO REMOTO (via ZeroTier VPN)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "ZeroTier Node ID: $ZEROTIER_ID"
echo "ZeroTier Network ID: $NETWORK_ID"
if [ ! -z "$ZEROTIER_IP" ] && [ "$ZEROTIER_IP" != "-" ]; then
    echo "ZeroTier IP: $ZEROTIER_IP"
    echo "Comando: ssh $SSH_USER@$ZEROTIER_IP"
else
    echo "ZeroTier IP: (Aguardando autorização)"
fi
echo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔗 LINKS ÚTEIS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Painel ZeroTier: https://my.zerotier.com"
echo "Gerenciar Rede: https://my.zerotier.com/network/$NETWORK_ID"
echo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 COMANDOS ÚTEIS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Ver status ZeroTier: sudo zerotier-cli info"
echo "Listar redes: sudo zerotier-cli listnetworks"
echo "Ver peers: sudo zerotier-cli listpeers"
echo "Sair da rede: sudo zerotier-cli leave $NETWORK_ID"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo

print_success "Configuração concluída com sucesso!"
print_warning "IMPORTANTE: Configure o GenSpark com o IP ZeroTier para acesso remoto!"
