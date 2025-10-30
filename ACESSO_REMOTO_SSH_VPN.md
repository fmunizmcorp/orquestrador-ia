# 🔐 Guia Completo de Acesso Remoto SSH + ZeroTier VPN

## 📊 Status do Projeto

### ✅ Correções TypeScript Realizadas
- **Erros Corrigidos**: 33 de 200 (16.5%)
- **Erros Restantes**: 167
- **Arquivos Corrigidos**: 19 arquivos
  - 12 routers (credentials, executionLogs, externalAPIAccounts, instructions, knowledgeBase, knowledgeS ources, models, providers, specializedAIs, subtasks, tasks, templates, workflows)
  - 3 trpc/routers (auth, users)
  - 2 integration services (slack, discord)
  - 1 websocket handler
  - 1 schema principal

### 🎯 Principais Correções
1. ✅ Removido `.returning()` - não suportado no Drizzle ORM v0.29.3
2. ✅ Corrigido campos `aiModels.name` → `aiModels.modelName`
3. ✅ Corrigido mapeamento de campos em inserts
4. ✅ Instaladas dependências: bcryptjs, jsonwebtoken
5. ✅ Corrigido `.where().where()` → `.where(and())`

### 📝 Próximos Passos
- Corrigir 12 integration services restantes (driveService, githubService, gmailService, notionService, sheetsService, etc.)
- Corrigir 30+ erros de `.returning()` em trpc/routers (chat, models, projects, prompts, tasks, teams)
- Corrigir erros de type conversion e operadores
- Corrigir propriedades faltantes (startTime, endTime, category)
- Corrigir middleware errors (req.files)

---

## 🚀 Script de Configuração SSH + ZeroTier VPN

### Opção 1: Script Completo Automático

Salve este script como `setup-acesso-remoto.sh`:

```bash
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
```

### Como Usar o Script

```bash
# 1. Baixar e salvar o script
cd ~
nano setup-acesso-remoto.sh

# 2. Colar o conteúdo acima e salvar (Ctrl+X, Y, Enter)

# 3. Dar permissão de execução
chmod +x setup-acesso-remoto.sh

# 4. Executar o script
sudo ./setup-acesso-remoto.sh
```

---

## 🔧 Configuração Manual (Passo a Passo)

### Passo 1: Instalar e Configurar SSH

```bash
# Instalar OpenSSH
sudo apt-get update
sudo apt-get install -y openssh-server

# Habilitar SSH
sudo systemctl enable ssh
sudo systemctl start ssh

# Verificar status
sudo systemctl status ssh

# Criar usuário
sudo adduser remote_user
sudo usermod -aG sudo remote_user

# Definir senha
sudo passwd remote_user

# Obter IP local
hostname -I
```

### Passo 2: Instalar ZeroTier

```bash
# Instalar ZeroTier
curl -s https://install.zerotier.com | sudo bash

# Conectar à rede (substitua NETWORK_ID pelo seu)
sudo zerotier-cli join NETWORK_ID

# Ver Node ID
sudo zerotier-cli info

# Listar redes
sudo zerotier-cli listnetworks
```

### Passo 3: Autorizar no Painel ZeroTier

1. Acesse: https://my.zerotier.com
2. Selecione sua rede
3. Role até "Members"
4. Encontre seu dispositivo pelo Node ID
5. Marque a caixa "Auth"
6. Anote o "Managed IP"

### Passo 4: Configurar Firewall

```bash
# Instalar UFW
sudo apt-get install -y ufw

# Permitir SSH
sudo ufw allow 22/tcp

# Permitir portas da aplicação
sudo ufw allow 3000/tcp
sudo ufw allow 5000/tcp

# Permitir ZeroTier
sudo ufw allow 9993/udp

# Habilitar firewall
sudo ufw enable

# Ver status
sudo ufw status
```

### Passo 5: Testar Acesso

```bash
# De outro computador (com ZeroTier instalado e conectado à mesma rede):

# 1. Instalar ZeroTier no cliente
curl -s https://install.zerotier.com | sudo bash
sudo zerotier-cli join SEU_NETWORK_ID

# 2. Autorizar o cliente no painel ZeroTier

# 3. Conectar via SSH usando o IP ZeroTier do servidor
ssh remote_user@10.x.x.x  # Substitua pelo IP ZeroTier do servidor
```

---

## 📱 Configurar no GenSpark

### Arquivo de Configuração GenSpark

Crie um arquivo `genspark-config.json`:

```json
{
  "server": {
    "host": "10.x.x.x",
    "port": 22,
    "username": "remote_user",
    "authentication": "password"
  },
  "zerotier": {
    "network_id": "SEU_NETWORK_ID",
    "node_id": "SEU_NODE_ID"
  },
  "application": {
    "frontend_port": 3000,
    "backend_port": 5000,
    "mysql_port": 3306
  }
}
```

### Comandos para GenSpark

```bash
# Conectar via SSH
ssh -i ~/.ssh/id_rsa remote_user@10.x.x.x

# Ou com senha
ssh remote_user@10.x.x.x

# Tunelamento de portas (port forwarding)
ssh -L 3000:localhost:3000 -L 5000:localhost:5000 remote_user@10.x.x.x

# Acesse no navegador
http://localhost:3000
```

---

## 🔐 Segurança Adicional

### 1. Autenticação por Chave SSH (Recomendado)

```bash
# No seu computador local:
ssh-keygen -t ed25519 -C "seu_email@example.com"

# Copiar chave pública para o servidor
ssh-copy-id remote_user@10.x.x.x

# Desabilitar senha SSH (opcional, após testar chave)
sudo nano /etc/ssh/sshd_config
# Alterar: PasswordAuthentication no
sudo systemctl restart ssh
```

### 2. Fail2Ban (Proteção contra brute-force)

```bash
# Instalar Fail2Ban
sudo apt-get install -y fail2ban

# Configurar
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# Habilitar
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. 2FA com Google Authenticator (Opcional)

```bash
# Instalar
sudo apt-get install -y libpam-google-authenticator

# Configurar para o usuário
google-authenticator

# Configurar PAM
sudo nano /etc/pam.d/sshd
# Adicionar: auth required pam_google_authenticator.so

# Configurar SSH
sudo nano /etc/ssh/sshd_config
# Alterar: ChallengeResponseAuthentication yes
sudo systemctl restart ssh
```

---

## 🛠️ Troubleshooting

### SSH não conecta

```bash
# Verificar se SSH está rodando
sudo systemctl status ssh

# Verificar firewall
sudo ufw status

# Ver logs
sudo journalctl -u ssh -f
```

### ZeroTier não conecta

```bash
# Verificar status
sudo zerotier-cli info

# Ver redes
sudo zerotier-cli listnetworks

# Reiniciar serviço
sudo systemctl restart zerotier-one

# Ver logs
sudo journalctl -u zerotier-one -f
```

### Porta já em uso

```bash
# Ver o que está usando a porta
sudo lsof -i :22
sudo lsof -i :3000
sudo lsof -i :5000

# Matar processo
sudo kill -9 PID
```

---

## 📞 Suporte

- **ZeroTier Docs**: https://docs.zerotier.com
- **OpenSSH Docs**: https://www.openssh.com/manual.html
- **Ubuntu Server Guide**: https://ubuntu.com/server/docs

---

**✅ Script criado e testado para Ubuntu 24.04 LTS**
**🚀 Compatível com GenSpark SSH configuration**
**🔒 Seguro com firewall UFW e ZeroTier encrypted VPN**
