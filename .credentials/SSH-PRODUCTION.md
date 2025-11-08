# 🔐 CREDENCIAIS DE PRODUÇÃO - ORQUESTRADOR V3

## 📡 ACESSO SSH AO SERVIDOR DE PRODUÇÃO

### Informações do Servidor
- **IP Externo (Gateway):** 31.97.64.43
- **Porta SSH:** 2224
- **Usuário:** flavio
- **Senha SSH:** sshflavioia
- **IP Interno Real:** 192.168.1.247 (não acessível externamente)

### Comando de Acesso
```bash
ssh -p 2224 flavio@31.97.64.43
# Senha: sshflavioia

# Com sshpass (automático):
sshpass -p 'sshflavioia' ssh -p 2224 -o StrictHostKeyChecking=no flavio@31.97.64.43
```

### Arquitetura de Rede
```
Internet/Externo
    ↓
31.97.64.43 (Gateway/Firewall) - Porta 2224
    ↓ SSH Forwarding
192.168.1.247 (Servidor Real) - Porta 22
    ↓
Orquestrador V3 (Node.js + Nginx)
```

## 🌐 ACESSO À APLICAÇÃO

### ⚠️ IMPORTANTE: Aplicação NÃO é acessível externamente
- **A aplicação roda APENAS na rede interna**
- **Acesso:** Via SSH tunnel para localhost
- **URL de Acesso:** http://localhost:3001 (dentro do servidor via SSH)
- **Nginx Local:** http://localhost (porta 80) ou https://localhost (porta 443)

### ❌ NÃO USAR
- ~~https://31.97.64.43~~ → Este IP roda OUTRO site ("Rabi Talentos")
- ~~https://31.97.64.43:3001~~ → Não há forwarding da porta 3001

### ✅ FORMA CORRETA DE TESTE
```bash
# 1. Conectar via SSH
sshpass -p 'sshflavioia' ssh -p 2224 -o StrictHostKeyChecking=no flavio@31.97.64.43

# 2. Dentro do servidor, testar:
curl -s http://localhost:3001/
curl -s https://localhost/

# 3. Acesso do usuário (rede interna):
# O usuário acessa diretamente: http://192.168.1.247
```

## 🗄️ BANCO DE DADOS

### Credenciais MySQL
- **Host:** localhost (mesmo servidor)
- **Porta:** 3306 (padrão)
- **Database:** orquestraia
- **Usuário:** flavio
- **Senha:** bdflavioia

### Verificação
```bash
mysql -u flavio -p'bdflavioia' orquestraia -e "SELECT COUNT(*) FROM prompts;"
# Deve retornar: 15 prompts
```

## 📂 LOCALIZAÇÕES NO SERVIDOR

### Aplicação Principal
- **Diretório:** `/home/flavio/orquestrador-ia`
- **Dist:** `/home/flavio/orquestrador-ia/dist`
- **Logs PM2:** `/home/flavio/.pm2/logs/`

### Configurações
- **PM2 App Name:** orquestrador-v3
- **Nginx Config:** `/etc/nginx/sites-available/orquestrador-ias`
- **SSL Certs:** `/etc/ssl/orquestrador/`

## 🚀 COMANDOS ÚTEIS

### Gerenciamento PM2
```bash
pm2 list
pm2 restart orquestrador-v3
pm2 logs orquestrador-v3 --lines 50
pm2 describe orquestrador-v3
```

### Nginx
```bash
sudo nginx -t  # Testar config
sudo systemctl reload nginx  # Recarregar
sudo systemctl status nginx  # Status
```

### Deploy
```bash
# 1. Build local (no sandbox)
cd /home/flavio/webapp && npm run build

# 2. Criar tarball
tar -czf dist.tar.gz dist

# 3. Copiar para produção
sshpass -p 'sshflavioia' scp -P 2224 dist.tar.gz flavio@31.97.64.43:/home/flavio/orquestrador-ia/

# 4. Extrair e restart
sshpass -p 'sshflavioia' ssh -p 2224 flavio@31.97.64.43 \
  "cd /home/flavio/orquestrador-ia && tar -xzf dist.tar.gz && pm2 restart orquestrador-v3"
```

---

**ATUALIZADO:** 2025-11-07 23:15  
**VALIDADO:** ✅ Credenciais testadas e funcionando
