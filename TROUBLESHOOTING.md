# 🔧 Guia de Solução de Problemas

## Índice
1. [Problemas de Instalação](#problemas-de-instalação)
2. [Problemas de Conexão](#problemas-de-conexão)
3. [Problemas de Performance](#problemas-de-performance)
4. [Problemas com Integrações](#problemas-com-integrações)
5. [Problemas com Treinamento](#problemas-com-treinamento)
6. [Logs e Diagnóstico](#logs-e-diagnóstico)

---

## 🚨 Problemas de Instalação

### Erro: "Node.js version too old"

**Sintomas**:
```
Error: Node.js version 16.x is not supported
Required: Node.js 18.x or higher
```

**Solução**:
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar versão
node -v  # Deve mostrar v18.x.x ou superior
```

---

### Erro: "MySQL connection refused"

**Sintomas**:
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Diagnóstico**:
```bash
# 1. Verificar se MySQL está rodando
sudo systemctl status mariadb

# 2. Verificar porta
sudo netstat -tlnp | grep 3306

# 3. Testar conexão
mysql -u root -p
```

**Soluções**:

#### Solução 1: MySQL não está rodando
```bash
sudo systemctl start mariadb
sudo systemctl enable mariadb
```

#### Solução 2: Porta errada
```bash
# Verificar porta no my.cnf
sudo nano /etc/mysql/my.cnf

# Procurar por:
# [mysqld]
# port = 3306
```

#### Solução 3: Credenciais incorretas
```bash
# Resetar senha do usuário
sudo mysql
ALTER USER 'orquestrador'@'localhost' IDENTIFIED BY 'orquestrador123';
FLUSH PRIVILEGES;
```

---

### Erro: "npm install failed"

**Sintomas**:
```
npm ERR! code EACCES
npm ERR! syscall access
npm ERR! path /usr/lib/node_modules
```

**Solução**:
```bash
# Opção 1: Usar sudo (não recomendado)
sudo npm install

# Opção 2: Configurar npm prefix (recomendado)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Instalar novamente
npm install
```

---

## 🌐 Problemas de Conexão

### Erro: "WebSocket connection failed"

**Sintomas**:
- Chat não atualiza em tempo real
- Notificações não aparecem
- Status "Disconnected" no painel

**Diagnóstico**:
```bash
# 1. Verificar se servidor está rodando
curl http://localhost:3001/health

# 2. Verificar logs
sudo journalctl -u orquestrador -n 50

# 3. Testar WebSocket
wscat -c ws://localhost:3001
```

**Soluções**:

#### Solução 1: Reiniciar servidor
```bash
sudo systemctl restart orquestrador
```

#### Solução 2: Verificar firewall
```bash
# Permitir porta 3001
sudo ufw allow 3001/tcp
sudo ufw reload
```

#### Solução 3: Aumentar timeout
```javascript
// client/src/hooks/useWebSocket.ts
const config = {
  reconnectInterval: 5000,  // Aumentar para 5s
  maxReconnectAttempts: 10, // Aumentar para 10
};
```

---

### Erro: "LM Studio connection timeout"

**Sintomas**:
```
Error: Request to LM Studio timed out after 300000ms
```

**Diagnóstico**:
```bash
# 1. Verificar se LM Studio está rodando
curl http://localhost:1234/v1/models

# 2. Verificar logs do LM Studio
# (veja a janela do aplicativo LM Studio)

# 3. Testar geração simples
curl http://localhost:1234/v1/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "local-model",
    "prompt": "Hello",
    "max_tokens": 50
  }'
```

**Soluções**:

#### Solução 1: Reiniciar LM Studio
1. Fechar LM Studio completamente
2. Reabrir
3. Carregar modelo
4. Iniciar servidor (porta 1234)

#### Solução 2: Aumentar timeout
```typescript
// server/services/lmstudioService.ts
const DEFAULT_TIMEOUT = 600000; // 10 minutos
```

#### Solução 3: Usar modelo menor
- Trocar de Llama-13B para Llama-7B
- Reduzir context window de 4096 para 2048
- Reduzir max_tokens

---

## ⚡ Problemas de Performance

### Sistema Lento

**Sintomas**:
- Interface travando
- Tarefas demorando muito
- Alta utilização de CPU/Memory

**Diagnóstico**:
```bash
# 1. Verificar recursos
htop
# ou
top

# 2. Verificar processos
ps aux | grep node

# 3. Verificar banco de dados
mysql -u orquestrador -p
SHOW PROCESSLIST;
SHOW STATUS LIKE 'Threads_connected';
```

**Soluções**:

#### Solução 1: Otimizar banco de dados
```bash
sudo ./optimize-performance.sh
```

#### Solução 2: Limpar logs antigos
```sql
-- Deletar logs com mais de 30 dias
DELETE FROM executionLogs 
WHERE createdAt < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Otimizar tabelas
OPTIMIZE TABLE executionLogs;
OPTIMIZE TABLE tasks;
OPTIMIZE TABLE subtasks;
```

#### Solução 3: Reduzir tarefas simultâneas
```
Dashboard → Settings → System
Max Concurrent Tasks: 3 (padrão: 10)
```

#### Solução 4: Aumentar recursos do servidor
```bash
# Aumentar limite de memória Node.js
export NODE_OPTIONS="--max-old-space-size=4096"

# Reiniciar serviço
sudo systemctl restart orquestrador
```

---

### Alto Consumo de Memória

**Sintomas**:
```
JavaScript heap out of memory
FATAL ERROR: Reached heap limit
```

**Solução**:
```bash
# 1. Aumentar heap size
export NODE_OPTIONS="--max-old-space-size=8192"

# 2. Adicionar no service file
sudo nano /etc/systemd/system/orquestrador.service

# Adicionar:
[Service]
Environment="NODE_OPTIONS=--max-old-space-size=8192"

# 3. Recarregar e reiniciar
sudo systemctl daemon-reload
sudo systemctl restart orquestrador
```

---

## 🔗 Problemas com Integrações

### GitHub: "Authentication failed"

**Solução**:
```
1. Gerar novo token:
   GitHub → Settings → Developer settings → Personal access tokens → New token
   
2. Permissões necessárias:
   ✓ repo
   ✓ read:org
   ✓ workflow
   
3. Atualizar credencial:
   Credentials → GitHub → Editar → Novo token
```

---

### Slack: "invalid_auth"

**Solução**:
```
1. Verificar token:
   - Deve começar com xoxb-
   - Não xoxp-
   
2. Verificar scopes necessários:
   - chat:write
   - channels:read
   - files:write
   - reactions:write
   
3. Reinstalar app no workspace se necessário
```

---

### Notion: "unauthorized"

**Solução**:
```
1. Criar nova integração:
   Notion → Settings → Integrations → New integration
   
2. Capabilities necessárias:
   ✓ Read content
   ✓ Update content
   ✓ Insert content
   
3. Compartilhar páginas com a integração:
   Page → Share → Invite [Your Integration]
```

---

## 🎓 Problemas com Treinamento

### Erro: "Training failed - Out of memory"

**Solução**:
```
1. Reduzir batch size:
   Batch Size: 8 → 4 ou 2
   
2. Reduzir LoRA rank:
   LoRA Rank: 16 → 8
   
3. Usar gradient checkpointing:
   (Implementação futura)
   
4. Treinar em GPU:
   Configurar CUDA se disponível
```

---

### Erro: "Dataset validation failed"

**Solução**:
```json
// Formato correto para cada tipo:

// Tipo: instruction
{
  "instruction": "Pergunta ou comando",
  "response": "Resposta esperada"
}

// Tipo: qa
{
  "question": "Pergunta",
  "answer": "Resposta"
}

// Tipo: conversation
{
  "messages": [
    {"role": "user", "content": "Mensagem"},
    {"role": "assistant", "content": "Resposta"}
  ]
}
```

---

## 📊 Logs e Diagnóstico

### Visualizar Logs do Sistema

```bash
# Logs do serviço
sudo journalctl -u orquestrador -f

# Logs do aplicação
tail -f /home/user/webapp/logs/combined.log

# Logs de erro
tail -f /home/user/webapp/logs/error.log

# Logs do banco de dados
sudo tail -f /var/log/mysql/error.log
```

---

### Modo Debug

```bash
# Ativar debug mode
export DEBUG=*
export LOG_LEVEL=debug

# Reiniciar com logs detalhados
npm run dev
```

---

### Health Check

```bash
# Verificar saúde do sistema
curl http://localhost:3001/health

# Resposta esperada:
{
  "status": "healthy",
  "database": "connected",
  "lmstudio": "available",
  "timestamp": "2025-01-30T12:00:00.000Z"
}
```

---

### Coletar Informações para Suporte

```bash
# Script de diagnóstico
cat > diagnose.sh << 'EOF'
#!/bin/bash
echo "=== System Information ==="
uname -a
echo ""
echo "=== Node.js Version ==="
node -v
npm -v
echo ""
echo "=== MySQL Status ==="
sudo systemctl status mariadb --no-pager
echo ""
echo "=== Service Status ==="
sudo systemctl status orquestrador --no-pager
echo ""
echo "=== Recent Logs ==="
sudo journalctl -u orquestrador -n 50 --no-pager
echo ""
echo "=== Disk Usage ==="
df -h
echo ""
echo "=== Memory Usage ==="
free -h
EOF

chmod +x diagnose.sh
./diagnose.sh > diagnostic_report.txt
```

---

## 🆘 Quando Contactar Suporte

Se após seguir este guia o problema persistir, contacte o suporte com:

1. **Descrição do problema**
2. **Passos para reproduzir**
3. **Logs relevantes** (`diagnostic_report.txt`)
4. **Versão do sistema** (Dashboard → About)
5. **Configuração de ambiente** (.env sem credenciais)

📧 **Email**: suporte@orquestrador-ia.com  
💬 **Discord**: discord.gg/orquestrador-ia
