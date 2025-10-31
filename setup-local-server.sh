#!/bin/bash
################################################################################
# Script: setup-local-server.sh
# Servidor: 192.168.192.164 (servidor pessoal)
# Descrição: Configura SSH corretamente + cria/atualiza usuário flavio
################################################################################

set -e

echo "🚀 Configurando SSH no Servidor Local..."

# Variáveis
SSH_USER="flavio"
SSH_PASS="sshflavioia"
SSH_PORT="22"

# [1] Atualizar sistema
echo "[1/9] Atualizando sistema..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq > /dev/null 2>&1
echo "✓ Sistema atualizado"

# [2] Instalar/Reinstalar OpenSSH Server
echo "[2/9] Instalando OpenSSH Server..."
apt-get install --reinstall -y openssh-server > /dev/null 2>&1
echo "✓ OpenSSH Server instalado"

# [3] Verificar/Criar usuário flavio
echo "[3/9] Configurando usuário $SSH_USER..."
if id "$SSH_USER" &>/dev/null; then
    echo "   Usuário $SSH_USER já existe, atualizando senha..."
    echo "$SSH_USER:$SSH_PASS" | chpasswd
else
    echo "   Criando usuário $SSH_USER..."
    useradd -m -s /bin/bash "$SSH_USER"
    echo "$SSH_USER:$SSH_PASS" | chpasswd
    usermod -aG sudo "$SSH_USER"
fi
echo "✓ Usuário $SSH_USER configurado"

# [4] Configurar SSH daemon
echo "[4/9] Configurando SSH daemon..."
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup.$(date +%Y%m%d_%H%M%S)

# Configurações seguras
cat > /etc/ssh/sshd_config << 'SSHEOF'
# SSH Configuration for 192.168.192.164
Port 22
Protocol 2
HostKey /etc/ssh/ssh_host_rsa_key
HostKey /etc/ssh/ssh_host_ecdsa_key
HostKey /etc/ssh/ssh_host_ed25519_key

# Logging
SyslogFacility AUTH
LogLevel INFO

# Authentication
PermitRootLogin no
PubkeyAuthentication yes
PasswordAuthentication yes
PermitEmptyPasswords no
ChallengeResponseAuthentication no

# Security
X11Forwarding yes
PrintMotd no
AcceptEnv LANG LC_*
Subsystem sftp /usr/lib/openssh/sftp-server

# Allow user flavio
AllowUsers flavio

# Performance
UseDNS no
SSHEOF

echo "✓ SSH daemon configurado"

# [5] Garantir que as chaves do host existem
echo "[5/9] Gerando chaves SSH do host..."
ssh-keygen -A > /dev/null 2>&1
echo "✓ Chaves do host geradas"

# [6] Configurar permissões
echo "[6/9] Configurando permissões..."
mkdir -p /home/$SSH_USER/.ssh
chmod 700 /home/$SSH_USER/.ssh
touch /home/$SSH_USER/.ssh/authorized_keys
chmod 600 /home/$SSH_USER/.ssh/authorized_keys
chown -R $SSH_USER:$SSH_USER /home/$SSH_USER/.ssh
echo "✓ Permissões configuradas"

# [7] Habilitar e iniciar SSH
echo "[7/9] Habilitando SSH..."
systemctl enable ssh > /dev/null 2>&1 || systemctl enable sshd > /dev/null 2>&1
systemctl restart ssh > /dev/null 2>&1 || systemctl restart sshd > /dev/null 2>&1
echo "✓ SSH habilitado e iniciado"

# [8] Configurar firewall (se UFW instalado)
echo "[8/9] Configurando firewall..."
if command -v ufw &> /dev/null; then
    ufw allow $SSH_PORT/tcp > /dev/null 2>&1 || true
    echo "✓ Firewall configurado"
else
    echo "⚠  UFW não instalado"
fi

# [9] Testar configuração
echo "[9/9] Testando SSH..."
systemctl is-active --quiet ssh || systemctl is-active --quiet sshd
if [ $? -eq 0 ]; then
    echo "✓ SSH está rodando corretamente"
else
    echo "❌ ERRO: SSH não está rodando"
    exit 1
fi

echo ""
echo "✅ CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!"
echo ""
echo "📋 CREDENCIAIS SSH:"
echo "   • Usuário: $SSH_USER"
echo "   • Senha: $SSH_PASS"
echo "   • Porta: $SSH_PORT"
echo ""
echo "🔧 TESTE LOCAL (neste servidor):"
echo "   sshpass -p '$SSH_PASS' ssh -p $SSH_PORT $SSH_USER@localhost"
echo ""
echo "🌐 ACESSO REMOTO (via VPS forwarding):"
echo "   ssh -p 2224 $SSH_USER@31.97.64.43"
echo "   ou"
echo "   sshpass -p '$SSH_PASS' ssh -p 2224 $SSH_USER@31.97.64.43"
echo ""
echo "💾 CREDENCIAIS SALVAS EM:"
echo "   /root/ssh_credentials_${SSH_USER}.txt"
echo ""

# Salvar credenciais
cat > /root/ssh_credentials_${SSH_USER}.txt << CREDEOF
# SSH Credentials - Servidor 192.168.192.164
# Gerado em: $(date)

Usuário: $SSH_USER
Senha: $SSH_PASS
Porta: $SSH_PORT
IP Local: 192.168.192.164

# Acesso via VPS forwarding:
ssh -p 2224 $SSH_USER@31.97.64.43

# Com sshpass:
sshpass -p '$SSH_PASS' ssh -p 2224 $SSH_USER@31.97.64.43
CREDEOF

chmod 600 /root/ssh_credentials_${SSH_USER}.txt
echo "✓ Arquivo criado: /root/ssh_credentials_${SSH_USER}.txt"
echo ""
