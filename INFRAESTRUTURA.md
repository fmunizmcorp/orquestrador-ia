# 🏗️ INFRAESTRUTURA - Orquestrador IA V3

## 📋 Visão Geral

Este documento descreve a arquitetura de infraestrutura do Orquestrador IA V3, incluindo configuração de servidores, rede, acesso SSH e deployment.

## 🌐 Arquitetura de Rede

### Topologia

```
Internet
    │
    ├─────────────────────────────────────┐
    │                                     │
    ▼                                     ▼
31.97.64.43:2224                 31.97.64.43:* (outros serviços)
(SSH Gateway)                     
    │                                     
    │ SSH Tunnel                          
    │                                     
    ▼                                     
192.168.1.247:3001                       
(Servidor Produção - Rede Interna)       
    │                                     
    ├─── Frontend (React + Vite)         
    ├─── Backend (Express + tRPC)        
    ├─── WebSocket                       
    └─── MySQL Database                  
```

### Componentes

#### 1. Servidor de Produção (INTERNO)
- **Tipo**: Servidor físico/VM na rede interna
- **IP**: `192.168.1.247`
- **Rede**: Interna (não roteável externamente)
- **Porta**: `3001`
- **Serviços**:
  - Node.js + Express
  - tRPC API
  - WebSocket Server
  - MySQL Database
  - PM2 Process Manager

#### 2. Servidor Gateway (EXTERNO)
- **Tipo**: Servidor público de acesso
- **IP**: `31.97.64.43`
- **Porta SSH**: `2224`
- **Função**: Gateway SSH para acesso ao servidor interno
- **⚠️ IMPORTANTE**: A porta 3001 deste servidor **NÃO** é o Orquestrador IA

## 🔐 Credenciais de Acesso SSH

### Conexão SSH ao Gateway

```bash
ssh -p 2224 flavio@31.97.64.43
```

**Credenciais**:
- Host: `31.97.64.43`
- Porta: `2224`
- Usuário: `flavio`
- Senha: `sshflavioia`

### Túnel SSH (Port Forwarding)

Para acessar o servidor interno do seu computador local:

```bash
# Forward porta 3001 do servidor interno para sua máquina local
ssh -p 2224 -L 3001:192.168.1.247:3001 flavio@31.97.64.43

# Depois acesse: http://localhost:3001
```

## 🚀 URLs de Acesso

### ✅ Correto - Para Testes Automatizados (dentro do servidor SSH)

```bash
Frontend:      http://localhost:3001
API:          http://localhost:3001/api/trpc
Health:       http://localhost:3001/api/health
WebSocket:    ws://localhost:3001/ws
```

### ✅ Correto - Para Acesso Manual (rede interna)

```bash
Frontend:      http://192.168.1.247:3001
API:          http://192.168.1.247:3001/api/trpc
```

### ❌ Incorreto - NÃO Usar

```bash
# NUNCA usar - este IP:porta roda outro serviço
http://31.97.64.43:3001  ❌
```

## 📦 Deployment com PM2

### Comandos Essenciais

```bash
# Ver status
pm2 status

# Ver logs
pm2 logs orquestrador-v3
pm2 logs orquestrador-v3 --nostream --lines 50

# Restart após mudanças
pm2 restart orquestrador-v3 --update-env

# Stop/Start
pm2 stop orquestrador-v3
pm2 start orquestrador-v3
```

### Build e Deploy Completo

```bash
# 1. Conectar via SSH
ssh -p 2224 flavio@31.97.64.43

# 2. Navegar para o projeto
cd /home/flavio/webapp

# 3. Atualizar código (se necessário)
git pull origin main

# 4. Instalar dependências (se necessário)
npm install

# 5. Build frontend
npm run build

# 6. Restart aplicação
pm2 restart orquestrador-v3 --update-env

# 7. Verificar status
pm2 status
pm2 logs orquestrador-v3 --nostream --lines 20
```

## 🧪 Testes Automatizados

### Considerações Importantes

1. **Testes rodam DENTRO do servidor SSH**
   - Playwright e outros testes devem usar `localhost:3001`
   - Não tentar acessar IPs externos

2. **Verificação de Build**
   ```bash
   # Verificar arquivo Analytics correto
   curl -s http://localhost:3001 | grep -o "Analytics-[^.]*\.js"
   ```

3. **Teste de API**
   ```bash
   # Testar endpoint tRPC
   curl -s "http://localhost:3001/api/trpc/monitoring.getCurrentMetrics"
   ```

4. **Health Check**
   ```bash
   # Verificar saúde do sistema
   curl http://localhost:3001/api/health
   ```

## 🔧 Troubleshooting

### Connection Refused ao Testar

**Sintoma**: `ERR_CONNECTION_REFUSED` ao acessar `31.97.64.43:3001`

**Causa**: Tentando acessar porta 3001 no servidor gateway (que roda outro serviço)

**Solução**: 
- Testes automatizados: usar `localhost:3001`
- Acesso manual: usar túnel SSH ou estar na rede interna

### Playwright Não Captura Console

**Sintoma**: Playwright retorna erro ao acessar via IP público

**Causa**: Aplicação não está exposta publicamente na porta 3001

**Solução**: 
- Usar `curl` e APIs REST para testes
- Verificar logs do servidor com `pm2 logs`
- Console logs do frontend estão nos logs do navegador do usuário

### PM2 Restart Não Aplica Mudanças

**Sintoma**: Código atualizado mas aplicação serve versão antiga

**Causa**: Cache do Vite ou build não executado

**Solução**:
```bash
# Limpar cache e rebuild
rm -rf dist/ node_modules/.vite/ .vite/
npm run build
pm2 restart orquestrador-v3 --update-env
```

### MySQL Connection Refused

**Sintoma**: `ECONNREFUSED 127.0.0.1:3306`

**Causa**: MySQL não está rodando

**Solução**:
```bash
# Verificar status MySQL
sudo systemctl status mysql

# Iniciar MySQL
sudo systemctl start mysql
```

## 📊 Monitoramento

### Logs do Servidor

```bash
# Logs em tempo real
pm2 logs orquestrador-v3

# Últimas 100 linhas
pm2 logs orquestrador-v3 --nostream --lines 100

# Filtrar por Sprint
pm2 logs orquestrador-v3 --nostream | grep "SPRINT"
```

### Métricas do Sistema

```bash
# PM2 Monit
pm2 monit

# Status JSON
pm2 jlist
```

### Health Check Endpoint

```bash
# Verificar saúde da aplicação
curl http://localhost:3001/api/health

# Resposta esperada:
# {"status": "ok", "timestamp": "...", "uptime": ...}
```

## 🔒 Segurança

### Boas Práticas

1. **Credenciais SSH**:
   - Documentadas em `.ssh-config` (versionado)
   - Usar apenas para acesso autorizado
   - Considerar chaves SSH no futuro

2. **Rede Interna**:
   - Aplicação não exposta publicamente
   - Acesso apenas via rede interna ou túnel SSH
   - Firewall no servidor gateway

3. **Environment Variables**:
   - `.env` nunca versionado (no `.gitignore`)
   - Variáveis sensíveis apenas no servidor

4. **Build Assets**:
   - `/dist` não versionado
   - Build sempre em produção no servidor

## 📝 Changelog

### Sprint 67 (2025-11-20)
- ✅ Documentação completa de infraestrutura
- ✅ Configuração SSH documentada
- ✅ Arquitetura de rede clarificada
- ✅ Processo de deployment documentado
- ✅ Troubleshooting guide criado

---

**Última Atualização**: 2025-11-20  
**Sprint**: 67  
**Responsável**: GenSpark AI Developer  
**Versão Aplicação**: 3.7.0
