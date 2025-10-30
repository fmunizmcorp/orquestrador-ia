# 🚀 Guia de Instalação - Orquestrador de IAs V3.0

## 📋 Índice

1. [Requisitos](#requisitos)
2. [Instalação Rápida (Um Comando)](#instalação-rápida)
3. [Instalação Manual](#instalação-manual)
4. [Configuração](#configuração)
5. [Primeiro Uso](#primeiro-uso)
6. [Troubleshooting](#troubleshooting)
7. [Atualização](#atualização)
8. [Desinstalação](#desinstalação)

---

## 📦 Requisitos

### Obrigatórios
- **Node.js** v18.0.0 ou superior
- **npm** v8.0.0 ou superior
- **MySQL** 8.0 ou superior
- **Git** (para clonar o repositório)

### Opcionais
- **PM2** (para gerenciamento de processos - será instalado automaticamente)
- **LM Studio** (para modelos locais de IA)

### Verificar Requisitos

```bash
# Verificar Node.js
node --version  # deve retornar v18.x.x ou superior

# Verificar npm
npm --version   # deve retornar v8.x.x ou superior

# Verificar MySQL
mysql --version # deve retornar MySQL 8.0 ou superior

# Verificar Git
git --version
```

---

## ⚡ Instalação Rápida

### Opção 1: Script Automático (Recomendado)

```bash
# 1. Clone o repositório
git clone https://github.com/fmunizmcorp/orquestrador-ia.git
cd orquestrador-ia

# 2. Checkout da branch correta
git checkout genspark_ai_developer

# 3. Execute o instalador (UM ÚNICO COMANDO!)
chmod +x install.sh && ./install.sh
```

**Pronto!** 🎉 O script irá:
- ✅ Verificar todos os pré-requisitos
- ✅ Instalar todas as dependências
- ✅ Configurar o .env automaticamente
- ✅ Criar o banco de dados
- ✅ Executar todas as migrations
- ✅ Compilar frontend e backend
- ✅ Iniciar o servidor com PM2

---

## 🔧 Instalação Manual

Se preferir instalar manualmente ou o script automático falhar:

### Passo 1: Clonar Repositório

```bash
git clone https://github.com/fmunizmcorp/orquestrador-ia.git
cd orquestrador-ia
git checkout genspark_ai_developer
```

### Passo 2: Instalar Dependências

```bash
npm install
```

### Passo 3: Configurar Variáveis de Ambiente

```bash
# Copiar exemplo
cp .env.example .env

# Editar .env com suas configurações
nano .env  # ou use seu editor preferido
```

Configurações mínimas no `.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=orquestraia

# Server
PORT=3001
NODE_ENV=production

# JWT Secret (GERE UMA CHAVE SEGURA!)
JWT_SECRET=sua-chave-secreta-super-segura-aqui

# Encryption Key (32 caracteres)
ENCRYPTION_KEY=sua-chave-de-encriptacao-32c

# LM Studio (opcional)
LM_STUDIO_URL=http://localhost:1234/v1
```

**IMPORTANTE:** Gere chaves seguras:

```bash
# Gerar JWT_SECRET
openssl rand -base64 32

# Gerar ENCRYPTION_KEY
openssl rand -base64 32
```

### Passo 4: Criar Banco de Dados

```bash
# Entrar no MySQL
mysql -u root -p

# Criar banco
CREATE DATABASE orquestraia;
exit;
```

### Passo 5: Executar Migrations

```bash
npm run db:migrate
```

### Passo 6: Build da Aplicação

```bash
# Build frontend
npm run build:client

# Build backend
npm run build:server
```

### Passo 7: Instalar PM2 (Gerenciador de Processos)

```bash
npm install -g pm2
```

### Passo 8: Iniciar Servidor

```bash
# Iniciar com PM2
pm2 start dist/index.js --name orquestrador-v3

# Salvar configuração do PM2
pm2 save

# Configurar PM2 para iniciar com o sistema
pm2 startup
# Execute o comando que o PM2 sugerir
```

---

## ⚙️ Configuração

### Portas Padrão

- **Backend API**: `3001`
- **Frontend Dev**: `3000` (apenas em modo desenvolvimento)
- **MySQL**: `3306`
- **LM Studio**: `1234` (opcional)

### Alterar Porta do Backend

Edite o arquivo `.env`:

```env
PORT=8080  # ou qualquer porta disponível
```

E reinicie o servidor:

```bash
pm2 restart orquestrador-v3
```

### Configurar LM Studio (Opcional)

Se você quiser usar modelos locais:

1. Instale o [LM Studio](https://lmstudio.ai/)
2. Inicie um servidor local na porta 1234
3. Configure no `.env`:

```env
LM_STUDIO_URL=http://localhost:1234/v1
```

---

## 🎯 Primeiro Uso

### 1. Acessar o Sistema

Abra seu navegador e acesse:
```
http://localhost:3001
```

### 2. Criar Conta

Você será redirecionado para a página de login. Clique em **"Criar conta"**.

Preencha:
- Nome
- Email
- Senha (mínimo 6 caracteres)

### 3. Fazer Login

Use suas credenciais para fazer login.

### 4. Explorar

Você terá acesso a:
- **Dashboard**: Visão geral do sistema
- **Equipes**: Gerenciar equipes
- **Projetos**: Gerenciar projetos
- **Prompts**: Biblioteca de prompts para IAs
- **Modelos**: Gerenciar modelos de IA
- **Monitoramento**: Métricas do sistema
- **Serviços**: Integrações externas
- E muito mais!

---

## 🔍 Troubleshooting

### Problema: "Port 3001 already in use"

**Solução:**

```bash
# Encontrar processo usando a porta
lsof -ti:3001

# Matar o processo
lsof -ti:3001 | xargs kill -9

# Ou usar o script de deploy que faz isso automaticamente
./deploy.sh
```

### Problema: "Cannot connect to MySQL"

**Soluções:**

1. Verificar se MySQL está rodando:
```bash
sudo systemctl status mysql
```

2. Iniciar MySQL se necessário:
```bash
sudo systemctl start mysql
```

3. Verificar credenciais no `.env`

4. Testar conexão manualmente:
```bash
mysql -u seu_usuario -p
```

### Problema: "JWT Token invalid"

**Solução:**

1. Fazer logout
2. Limpar cache do navegador (F12 → Application → Clear storage)
3. Fazer login novamente

### Problema: "Migrations failed"

**Solução:**

1. Verificar se o banco de dados existe:
```bash
mysql -u root -p -e "SHOW DATABASES;"
```

2. Recriar banco se necessário:
```bash
mysql -u root -p -e "DROP DATABASE IF EXISTS orquestraia; CREATE DATABASE orquestraia;"
```

3. Executar migrations novamente:
```bash
npm run db:migrate
```

### Problema: "PM2 not found"

**Solução:**

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Verificar instalação
pm2 --version
```

### Problema: "Build failed"

**Solução:**

1. Limpar node_modules:
```bash
rm -rf node_modules package-lock.json
npm install
```

2. Tentar build novamente:
```bash
npm run build
```

---

## 🔄 Atualização

Para atualizar para a versão mais recente:

```bash
# 1. Parar servidor
pm2 stop orquestrador-v3

# 2. Backup do banco de dados (importante!)
mysqldump -u root -p orquestraia > backup_$(date +%Y%m%d_%H%M%S).sql

# 3. Fazer backup do .env
cp .env .env.backup

# 4. Puxar atualizações
git fetch origin
git pull origin genspark_ai_developer

# 5. Atualizar dependências
npm install

# 6. Executar novas migrations
npm run db:migrate

# 7. Rebuild
npm run build

# 8. Reiniciar servidor
pm2 restart orquestrador-v3

# 9. Verificar status
pm2 status
```

---

## 🗑️ Desinstalação

Se você precisar desinstalar completamente:

```bash
# 1. Parar e remover processo PM2
pm2 delete orquestrador-v3
pm2 save

# 2. Fazer backup do banco (se quiser manter os dados)
mysqldump -u root -p orquestraia > backup_final.sql

# 3. Remover banco de dados
mysql -u root -p -e "DROP DATABASE IF EXISTS orquestraia;"

# 4. Remover diretório do projeto
cd ..
rm -rf orquestrador-ia

# 5. (Opcional) Desinstalar PM2 se não usar para outros projetos
npm uninstall -g pm2
```

---

## 📞 Suporte

### Logs do Sistema

```bash
# Ver logs em tempo real
pm2 logs orquestrador-v3

# Ver logs apenas do último erro
pm2 logs orquestrador-v3 --err

# Ver últimas 100 linhas
pm2 logs orquestrador-v3 --lines 100
```

### Reiniciar Servidor

```bash
# Reiniciar
pm2 restart orquestrador-v3

# Reiniciar com limpeza de memória
pm2 reload orquestrador-v3
```

### Monitorar Performance

```bash
# Dashboard do PM2
pm2 monit

# Status resumido
pm2 status
```

### Verificar Saúde do Sistema

Acesse no navegador:
```
http://localhost:3001/api/health
```

Ou via curl:
```bash
curl http://localhost:3001/api/health
```

---

## 🎓 Próximos Passos

Depois de instalar com sucesso:

1. 📖 Leia a [Documentação Completa](./RELATORIO_FINAL_COMPLETO.md)
2. 🎯 Explore o [Dashboard](http://localhost:3001)
3. 👥 Crie sua primeira [Equipe](http://localhost:3001/teams)
4. 📊 Configure seu primeiro [Projeto](http://localhost:3001/projects)
5. 💬 Experimente a [Biblioteca de Prompts](http://localhost:3001/prompts)

---

## 🤝 Contribuindo

Quer contribuir? Veja nosso [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](./LICENSE) para mais detalhes.

---

## ✨ Créditos

Desenvolvido com ❤️ por [@fmunizmcorp](https://github.com/fmunizmcorp)

---

**Versão:** 3.0.0  
**Última Atualização:** 30 de Outubro de 2025
