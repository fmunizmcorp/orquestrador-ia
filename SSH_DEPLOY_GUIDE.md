# 🔐 SSH DEPLOYMENT GUIDE - ORQUESTRADOR V3

## 📡 ARQUITETURA DE REDE

```
Internet → Gateway (31.97.64.43:2224) → Production Server (192.168.1.247:3001)
           └─ flavio@31.97.64.43      └─ root@192.168.1.247
           └─ Porta SSH: 2224          └─ Rede Interna
           └─ Senha: sshflavioia       └─ Orquestrador V3
```

### Importante:
- **31.97.64.43:3001**: Outro site (NÃO é o orquestrador)
- **192.168.1.247:3001**: Orquestrador V3 (rede interna)
- **Acesso externo**: NÃO disponível (apenas rede interna)

---

## 🚀 DEPLOYMENT COMPLETO - PASSO A PASSO

### Passo 1: Conectar ao Gateway SSH
```bash
ssh -p 2224 flavio@31.97.64.43
# Senha: sshflavioia
```

### Passo 2: Do Gateway, Conectar ao Servidor de Produção
```bash
# Já dentro do gateway (31.97.64.43)
ssh root@192.168.1.247
```

### Passo 3: Transferir Arquivos de Deploy
```bash
# Opção A: Via SCP através do gateway (2 hops)
# 1. Upload para gateway
scp -P 2224 deploy-sprint82-complete-all-bugs-fixed.tar.gz flavio@31.97.64.43:/home/flavio/

# 2. SSH para gateway e depois transferir para produção
ssh -p 2224 flavio@31.97.64.43
scp /home/flavio/deploy-sprint82-complete-all-bugs-fixed.tar.gz root@192.168.1.247:/root/

# Opção B: Via SSH ProxyJump (1 comando)
scp -o ProxyJump=flavio@31.97.64.43:2224 deploy-sprint82-complete-all-bugs-fixed.tar.gz root@192.168.1.247:/root/
```

### Passo 4: Extrair e Fazer Deploy
```bash
# No servidor de produção (192.168.1.247)
cd /root
tar -xzf deploy-sprint82-complete-all-bugs-fixed.tar.gz

# Backup do dist atual (segurança)
cp -r /var/www/orquestrador-v3/dist /var/www/orquestrador-v3/dist.backup.$(date +%Y%m%d_%H%M%S)

# Remover dist antigo e substituir
rm -rf /var/www/orquestrador-v3/dist
mv dist /var/www/orquestrador-v3/

# Verificar hash do novo Analytics
ls -lah /var/www/orquestrador-v3/dist/client/assets/Analytics-*.js
# Deve mostrar: Analytics-MIqehc_O.js
```

### Passo 5: Reiniciar PM2
```bash
# No servidor de produção
pm2 restart orquestrador-v3

# Verificar status
pm2 status
pm2 logs orquestrador-v3 --lines 50
```

### Passo 6: Testar Deployment
```bash
# No servidor de produção (via SSH)
curl http://localhost:3001/api/health

# Verificar se retorna JSON com status: ok
```

---

## 🧪 TESTES PÓS-DEPLOYMENT

### Teste 1: Health Check
```bash
ssh -p 2224 flavio@31.97.64.43 "ssh root@192.168.1.247 'curl -s http://localhost:3001/api/health'"
```

### Teste 2: Verificar Hash do Analytics
```bash
ssh -p 2224 flavio@31.97.64.43 "ssh root@192.168.1.247 'ls -lah /var/www/orquestrador-v3/dist/client/assets/Analytics-*.js'"
```

### Teste 3: PM2 Status
```bash
ssh -p 2224 flavio@31.97.64.43 "ssh root@192.168.1.247 'pm2 status'"
```

### Teste 4: Analytics Page (via curl)
```bash
ssh -p 2224 flavio@31.97.64.43 "ssh root@192.168.1.247 'curl -s http://localhost:3001/ | grep Analytics-MIqehc_O'"
```

---

## 🔧 TROUBLESHOOTING

### Problema: Conexão SSH Timeout
```bash
# Verificar conectividade com gateway
ping 31.97.64.43

# Testar porta SSH
nc -zv 31.97.64.43 2224
```

### Problema: PM2 Não Responde
```bash
# Restart completo do PM2
ssh -p 2224 flavio@31.97.64.43 "ssh root@192.168.1.247 'pm2 restart all'"
```

### Problema: Arquivos Não Atualizados
```bash
# Verificar permissões
ssh -p 2224 flavio@31.97.64.43 "ssh root@192.168.1.247 'ls -la /var/www/orquestrador-v3/dist/'"

# Force clear PM2 cache
ssh -p 2224 flavio@31.97.64.43 "ssh root@192.168.1.247 'pm2 delete orquestrador-v3 && pm2 start ecosystem.config.js'"
```

---

## 📝 CREDENCIAIS (Referência Rápida)

```
Gateway SSH:
  Host: 31.97.64.43
  Port: 2224
  User: flavio
  Pass: sshflavioia

Production Server:
  Host: 192.168.1.247 (via gateway)
  Port: 3001 (aplicação)
  User: root
  Service: orquestrador-v3
  Path: /var/www/orquestrador-v3
```

---

## ⚠️ IMPORTANTES AVISOS

1. **NÃO testar em 31.97.64.43:3001** - É outro site
2. **Sempre usar localhost:3001** dentro do SSH para testes
3. **Rede interna apenas** - Não há acesso externo direto
4. **Backup antes de deploy** - Sempre fazer backup do dist/
5. **Verificar hash após deploy** - Confirmar Analytics-MIqehc_O.js

---

**Documento criado em**: 2025-11-23  
**Sprint**: 82  
**Última atualização**: 2025-11-23  
