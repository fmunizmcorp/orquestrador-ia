# 🚀 DEPLOY RÁPIDO - ORQUESTRADOR IA

## ⚡ Instalação em 1 Comando

### Opção 1: Download direto (RECOMENDADO)

```bash
cd ~ && curl -fsSL https://raw.githubusercontent.com/fmunizmcorp/orquestrador-ia/main/install.sh | sudo bash
```

### Opção 2: Clone do repositório

```bash
cd ~ && \
rm -rf orquestrador-ia 2>/dev/null && \
git clone https://github.com/fmunizmcorp/orquestrador-ia.git && \
cd orquestrador-ia && \
chmod +x install.sh && \
sudo ./install.sh
```

---

## 📋 O que o script faz automaticamente

| Passo | Ação | Tempo |
|-------|------|-------|
| 1️⃣ | Atualiza sistema Ubuntu | 30s |
| 2️⃣ | Instala Node.js 20.x LTS | 1min |
| 3️⃣ | Instala MySQL 8.0 Server | 1min |
| 4️⃣ | Cria banco `orquestrador_ia` | 10s |
| 5️⃣ | Verifica código do projeto | 5s |
| 6️⃣ | Cria arquivo `.env` | 5s |
| 7️⃣ | Instala dependências npm | 2min |
| 8️⃣ | Executa migrations Drizzle | 30s |
| 9️⃣ | Build frontend + backend | 3min |
| 🔟 | Instala PM2 | 30s |
| 1️⃣1️⃣ | Inicia aplicação | 10s |
| 1️⃣2️⃣ | Configura firewall UFW | 10s |

**⏱️ TEMPO TOTAL: ~8-10 minutos**

---

## 🌐 Acessando a Aplicação

Após instalação, acesse:

### Frontend
```
http://SEU_IP:3000
```

### Backend API
```
http://SEU_IP:5000
```

Para descobrir o IP do servidor:
```bash
hostname -I | awk '{print $1}'
```

---

## 🛠️ Comandos Úteis PM2

| Comando | Descrição |
|---------|-----------|
| `pm2 status` | Ver status dos serviços |
| `pm2 logs` | Ver logs em tempo real |
| `pm2 logs frontend` | Logs só do frontend |
| `pm2 logs backend` | Logs só do backend |
| `pm2 restart all` | Reiniciar tudo |
| `pm2 stop all` | Parar tudo |
| `pm2 start all` | Iniciar tudo |
| `pm2 delete all` | Remover do PM2 |
| `pm2 monit` | Monitor interativo |

---

## 🔐 Acesso Remoto (SSH + VPN)

Depois da instalação, configure acesso remoto:

```bash
cd ~/orquestrador-ia
sudo ./setup-acesso-remoto.sh
```

Isso configura:
- ✅ OpenSSH Server
- ✅ ZeroTier VPN
- ✅ Firewall UFW
- ✅ Usuário dedicado
- ✅ Testes de conectividade

---

## 🗄️ Banco de Dados

As credenciais são geradas automaticamente durante a instalação.

**Localização das credenciais:**
```bash
cat ~/orquestrador-ia/.env | grep DB_
```

Ou consulte o arquivo:
```bash
cat ~/orquestrador-ia/INSTALACAO_INFO.txt
```

---

## 🐛 Troubleshooting

### 1. Erro "port already in use"

```bash
# Verificar o que está usando a porta
sudo lsof -i :3000
sudo lsof -i :5000

# Parar PM2 e reiniciar
pm2 delete all
pm2 start ~/orquestrador-ia/ecosystem.config.cjs
```

### 2. Frontend não carrega

```bash
# Rebuild do frontend
cd ~/orquestrador-ia/client
npm run build

# Reiniciar frontend
pm2 restart frontend
```

### 3. Backend com erro

```bash
# Ver logs detalhados
pm2 logs backend --lines 100

# Verificar .env
cat ~/orquestrador-ia/.env

# Reiniciar backend
pm2 restart backend
```

### 4. Erro no MySQL

```bash
# Verificar status
sudo systemctl status mysql

# Reiniciar MySQL
sudo systemctl restart mysql

# Testar conexão
mysql -u orquestrador -p orquestrador_ia
```

### 5. Reexecutar migrations

```bash
cd ~/orquestrador-ia
npm run db:push
```

---

## 📦 Estrutura de Arquivos

```
~/orquestrador-ia/
├── install.sh                    # Script de instalação
├── setup-acesso-remoto.sh        # Script SSH/VPN
├── ecosystem.config.cjs          # Configuração PM2
├── .env                          # Variáveis de ambiente
├── INSTALACAO_INFO.txt           # Info da instalação
├── package.json                  # Dependências
├── drizzle.config.ts             # Config Drizzle ORM
├── client/                       # Frontend React
│   ├── dist/                     # Build do frontend
│   └── package.json
├── server/                       # Backend Node.js
│   ├── dist/                     # Build do backend
│   └── db/
│       └── schema.ts             # Schema do banco
└── drizzle/                      # Migrations
```

---

## 🔄 Atualizar Aplicação

Para atualizar para a versão mais recente:

```bash
cd ~/orquestrador-ia

# Parar aplicação
pm2 stop all

# Atualizar código
git pull origin main

# Reinstalar dependências
npm install
cd client && npm install && cd ..

# Rebuild
npm run build
cd client && npm run build && cd ..

# Aplicar migrations
npm run db:push

# Reiniciar
pm2 restart all
```

---

## ✅ Verificação de Instalação

### 1. Verificar serviços rodando

```bash
pm2 status
```

Deve mostrar:
```
┌─────┬────────────┬─────────┬─────────┬─────────┬──────────┐
│ id  │ name       │ mode    │ status  │ restart │ uptime   │
├─────┼────────────┼─────────┼─────────┼─────────┼──────────┤
│ 0   │ frontend   │ fork    │ online  │ 0       │ 5m       │
│ 1   │ backend    │ fork    │ online  │ 0       │ 5m       │
└─────┴────────────┴─────────┴─────────┴─────────┴──────────┘
```

### 2. Testar frontend

```bash
curl -I http://localhost:3000
```

Deve retornar: `HTTP/1.1 200 OK`

### 3. Testar backend

```bash
curl http://localhost:5000/api/health
```

Deve retornar JSON com status ok.

### 4. Verificar MySQL

```bash
mysql -u orquestrador -p orquestrador_ia -e "SHOW TABLES;"
```

Deve listar as tabelas criadas.

---

## 🎯 Status do Projeto

| Item | Status |
|------|--------|
| TypeScript Errors | ✅ **ZERO ERROS** |
| Build Frontend | ✅ Compila limpo |
| Build Backend | ✅ Compila limpo |
| Database Schema | ✅ 25+ tabelas |
| Migrations | ✅ Funcionando |
| PM2 Auto-start | ✅ Configurado |
| Production Ready | ✅ **SIM** |

---

## 📞 Suporte

- **GitHub Issues**: https://github.com/fmunizmcorp/orquestrador-ia/issues
- **Documentação completa**: Veja `ACESSO_REMOTO_SSH_VPN.md`
- **Comando único**: Veja `COMANDO_UNICO.txt`

---

## 📄 Licença

MIT License - Veja arquivo LICENSE

---

**Última atualização:** 2025-10-31  
**Versão:** 1.0.0  
**Status:** ✅ Production Ready
