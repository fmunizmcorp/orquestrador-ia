# 🔐 ACESSO SSH AO SERVIDOR DE PRODUÇÃO

## 📍 Arquitetura de Rede

```
Internet → 31.97.64.43:2224 (Gateway) → 192.168.1.247 (Servidor Interno)
```

**Servidor de Produção:**
- IP Interno: `192.168.1.247`
- Não acessível diretamente da internet
- Acesso via SSH Forwarding

**Gateway SSH:**
- Host: `31.97.64.43`
- Porta: `2224` (não padrão)
- Usuário: `flavio`
- Senha: `[Ver arquivo .ssh-credentials local]`

## 🔌 Comandos de Conexão

### 1. Conectar ao Servidor via SSH

```bash
ssh -p 2224 flavio@31.97.64.43
```

### 2. Conectar com Senha (usando sshpass)

```bash
# Carregar credenciais do arquivo local
source .ssh-credentials
sshpass -p "$SSH_GATEWAY_PASSWORD" ssh -p 2224 flavio@31.97.64.43
```

### 3. Túnel SSH para Acessar Aplicação

```bash
# Criar túnel para acessar aplicação local
ssh -p 2224 -L 3001:localhost:3001 flavio@31.97.64.43

# Em outro terminal, acessar:
curl http://localhost:3001
```

### 4. Executar Comando Remoto

```bash
source .ssh-credentials
sshpass -p "$SSH_GATEWAY_PASSWORD" ssh -p 2224 flavio@31.97.64.43 "comando"
```

## 📁 Estrutura do Servidor

```
/root/orquestrador-ia/          # Diretório do projeto
├── server/                      # Backend
├── src/                         # Frontend
├── .env                         # Variáveis de ambiente
└── ecosystem.config.js          # Configuração PM2
```

## 🚀 Aplicação

- **Nome:** orquestrador-ia
- **Porta:** 3001
- **URL Interna:** http://localhost:3001
- **Acesso Externo:** Não exposto (apenas rede interna)
- **Gerenciador:** PM2

## 🔄 Workflow de Deploy

1. Push código para GitHub (branch: genspark_ai_developer)
2. Conectar ao servidor via SSH
3. Pull das mudanças
4. Instalar dependências
5. Build
6. Restart PM2

Ver: `deploy-automatic.sh` para script completo

## 📝 Notas Importantes

- ⚠️ **Senha SSH**: Armazenada localmente em `.ssh-credentials` (não versionado)
- 🔒 **Segurança**: Arquivo de credenciais com permissão 600
- 🌐 **Rede**: Aplicação acessível apenas na rede interna
- 🔑 **Chave SSH**: Pode configurar autenticação por chave para maior segurança

## 🛠️ Configuração de Chave SSH (Opcional)

Para evitar usar senha:

```bash
# 1. Gerar chave (se não tiver)
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa_orquestrador

# 2. Copiar chave para servidor
ssh-copy-id -p 2224 -i ~/.ssh/id_rsa_orquestrador.pub flavio@31.97.64.43

# 3. Conectar sem senha
ssh -p 2224 -i ~/.ssh/id_rsa_orquestrador flavio@31.97.64.43
```

## 📞 Troubleshooting

### Problema: Connection refused
```bash
# Verificar se porta está correta (2224, não 22)
ssh -p 2224 flavio@31.97.64.43 -v
```

### Problema: Permission denied
```bash
# Verificar se senha está correta
# Verificar arquivo .ssh-credentials
```

### Problema: Aplicação não responde
```bash
# Conectar ao servidor e verificar PM2
ssh -p 2224 flavio@31.97.64.43
pm2 status
pm2 logs
```

