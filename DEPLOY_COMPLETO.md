# 🚀 DEPLOY COMPLETO - UM COMANDO ÚNICO

## ⚡ COMANDO ÚNICO PARA DEPLOY COMPLETO

**Copie e cole este comando no seu servidor:**

```bash
cd ~ && rm -rf orquestrador-ia 2>/dev/null; git clone https://github.com/fmunizmcorp/orquestrador-ia.git && cd orquestrador-ia && chmod +x install.sh && ./install.sh
```

---

## 📋 O QUE ESTE COMANDO FAZ AUTOMATICAMENTE

### 1. **Limpeza** (se já existir instalação anterior)
```bash
cd ~ && rm -rf orquestrador-ia 2>/dev/null
```
- Remove instalação anterior se existir
- Garante instalação limpa

### 2. **Clone do Repositório**
```bash
git clone https://github.com/fmunizmcorp/orquestrador-ia.git
```
- Baixa TODOS os arquivos do GitHub
- Branch: `main` (com todas as features merged)

### 3. **Navegação para a Pasta Correta**
```bash
cd orquestrador-ia
```
- Entra no diretório do projeto

### 4. **Permissão de Execução**
```bash
chmod +x install.sh
```
- Torna o script executável

### 5. **Execução do Instalador Automatizado**
```bash
./install.sh
```
Este script faz **10 etapas automaticamente**:

#### ✅ Etapa 1: Verificação de Requisitos
- Node.js (v18+)
- npm
- MySQL (8.0+)
- Git

#### ✅ Etapa 2: Instalação de Dependências
```bash
npm install
```

#### ✅ Etapa 3: Criação do .env
```bash
# Gera automaticamente:
JWT_SECRET=<64 caracteres aleatórios>
ENCRYPTION_KEY=<32 caracteres aleatórios>
DATABASE_URL=<será preenchido na próxima etapa>
NODE_ENV=production
```

#### ✅ Etapa 4: Configuração do MySQL
- Solicita credenciais MySQL interativamente
- Host (padrão: localhost)
- Port (padrão: 3306)
- Username
- Password
- Database name (padrão: orquestrador_ia)

#### ✅ Etapa 5: Criação do Database
```sql
CREATE DATABASE IF NOT EXISTS orquestrador_ia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### ✅ Etapa 6: Migrations do Banco de Dados
```bash
npm run db:migrate
```
Cria todas as tabelas:
- users
- teams
- team_members
- projects
- prompts
- services
- logs
- activities

#### ✅ Etapa 7: Build do Frontend
```bash
npm run build:client
```
Compila React + TypeScript + Vite

#### ✅ Etapa 8: Build do Backend
```bash
npm run build:server
```
Compila Node.js + TypeScript + tRPC

#### ✅ Etapa 9: Liberação da Porta 3001
```bash
lsof -ti:3001 | xargs kill -9 2>/dev/null
```
Mata qualquer processo usando a porta

#### ✅ Etapa 10: Inicialização com PM2
```bash
pm2 start dist/server/index.js --name orquestrador-ia
pm2 save
pm2 startup
```

---

## 🎯 RESULTADO FINAL

Após executar o comando, você terá:

### ✅ Sistema Rodando
- **URL**: `http://localhost:3001`
- **Status**: Processo gerenciado pelo PM2
- **Auto-restart**: Sim (em caso de falha)

### ✅ Funcionalidades Disponíveis
1. **Dashboard** com gráficos e métricas em tempo real
2. **CRUD completo**: Teams, Projects, Prompts
3. **Dark Mode** com persistência
4. **Autenticação JWT**
5. **Perfil de usuário** editável
6. **Monitoramento** de sistema
7. **Gerenciamento de serviços**

### ✅ Gerenciamento com PM2
```bash
# Ver status
pm2 status

# Ver logs
pm2 logs orquestrador-ia

# Parar
pm2 stop orquestrador-ia

# Reiniciar
pm2 restart orquestrador-ia

# Remover
pm2 delete orquestrador-ia
```

---

## 📝 NOTAS IMPORTANTES

### 1. **Requisitos do Servidor**
- Ubuntu/Debian/CentOS
- Node.js 18+ instalado
- MySQL 8.0+ instalado e rodando
- Git instalado
- Mínimo 1GB RAM
- Mínimo 2GB espaço em disco

### 2. **Credenciais MySQL**
O script vai solicitar:
- **Host**: Geralmente `localhost`
- **Port**: Geralmente `3306`
- **Username**: Usuário com permissões CREATE DATABASE
- **Password**: Senha do usuário
- **Database**: Nome do banco (padrão: `orquestrador_ia`)

### 3. **Primeira Conta de Usuário**
Após instalação, acesse `http://localhost:3001` e clique em "Criar Conta"

### 4. **Logs de Instalação**
Salvo automaticamente em: `~/orquestrador-ia/installation.log`

---

## 🔧 TROUBLESHOOTING

### ❌ Problema: "command not found: git"
**Solução:**
```bash
# Ubuntu/Debian
sudo apt-get update && sudo apt-get install -y git

# CentOS/RHEL
sudo yum install -y git
```

### ❌ Problema: "command not found: node"
**Solução:**
```bash
# Instalar Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### ❌ Problema: "MySQL connection refused"
**Soluções:**
```bash
# Verificar se MySQL está rodando
sudo systemctl status mysql

# Iniciar MySQL
sudo systemctl start mysql

# Testar conexão
mysql -u root -p
```

### ❌ Problema: "Port 3001 already in use"
**Solução:**
```bash
# O script já faz isso, mas se precisar manualmente:
sudo lsof -ti:3001 | xargs kill -9
```

### ❌ Problema: "Permission denied: ./install.sh"
**Solução:**
```bash
chmod +x install.sh
./install.sh
```

---

## 🔄 ATUALIZAÇÃO DO SISTEMA

Para atualizar para versões futuras:

```bash
cd ~/orquestrador-ia && git pull origin main && npm install && npm run build:client && npm run build:server && pm2 restart orquestrador-ia
```

---

## 🗑️ DESINSTALAÇÃO COMPLETA

Para remover completamente o sistema:

```bash
cd ~ && pm2 delete orquestrador-ia 2>/dev/null; pm2 save; rm -rf orquestrador-ia; mysql -u root -p -e "DROP DATABASE IF EXISTS orquestrador_ia;"
```

---

## 📞 SUPORTE

- **GitHub Issues**: https://github.com/fmunizmcorp/orquestrador-ia/issues
- **Documentação Completa**: Ver `INSTALL.md` no repositório
- **Relatório Técnico**: Ver `RELATORIO_IMPLEMENTACAO_COMPLETA.md`

---

## ✅ CHECKLIST FINAL

Após executar o comando único, verifique:

- [ ] Script terminou sem erros
- [ ] Mensagem "✅ Sistema iniciado com sucesso!" apareceu
- [ ] `pm2 status` mostra "orquestrador-ia" com status "online"
- [ ] `curl http://localhost:3001` retorna HTML
- [ ] Navegador abre `http://localhost:3001` e mostra a página de login
- [ ] Consegue criar uma conta e fazer login
- [ ] Dashboard carrega com dados

---

# 🎉 PRONTO!

**Seu sistema está 100% funcional com UM ÚNICO COMANDO!**

```bash
cd ~ && rm -rf orquestrador-ia 2>/dev/null; git clone https://github.com/fmunizmcorp/orquestrador-ia.git && cd orquestrador-ia && chmod +x install.sh && ./install.sh
```

**Acesse:** http://localhost:3001
