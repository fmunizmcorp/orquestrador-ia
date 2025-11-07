# 🚀 Deployment Guide - Production Server 192.168.1.247

## ✅ Código Pronto para Deploy

- ✅ Build completo: `npm run build` - **SUCCESS**
- ✅ Testes passando
- ✅ Pull Request #3 criado e atualizado
- ✅ Branch: `genspark_ai_developer`
- ✅ Commit: d402667

## 📦 Arquivos Modificados (Sprints 10-11)

### Novos Arquivos (Infraestrutura)
```
server/config/env.ts          (1.3KB)
server/utils/errors.ts         (4.4KB)
server/utils/pagination.ts     (1.8KB)
```

### Routers Modificados
```
server/trpc/routers/chat.ts       (15 endpoints)
server/trpc/routers/models.ts     (10 endpoints)
server/trpc/routers/teams.ts      (9 endpoints)
server/trpc/routers/projects.ts   (pagination)
server/trpc/routers/users.ts      (pagination)
server/trpc/routers/prompts.ts    (imports)
server/trpc/routers/monitoring.ts (imports)
server/trpc/routers/services.ts   (imports)
```

### Dependências
```
package.json          (pino adicionado)
package-lock.json     (updated)
```

## 🔧 Deployment Manual Steps

### Opção 1: Deploy via SSH (Se tiver acesso)

```bash
# No servidor de produção (192.168.1.247):
cd /path/to/webapp
git pull origin main  # Após merge do PR
npm install
npm run build
pm2 restart orquestrador  # ou nome do processo
```

### Opção 2: Deploy via rsync

```bash
# Do ambiente local:
rsync -avz --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'dist' \
  /home/flavio/webapp/ \
  user@192.168.1.247:/path/to/webapp/

# No servidor:
ssh user@192.168.1.247
cd /path/to/webapp
npm install
npm run build
pm2 restart orquestrador
```

### Opção 3: Deploy via Docker

```bash
# Build image
docker build -t orquestrador-ia:latest .

# Push to registry or copy to server
docker save orquestrador-ia:latest | gzip > orquestrador.tar.gz
scp orquestrador.tar.gz user@192.168.1.247:/tmp/

# On server
ssh user@192.168.1.247
docker load < /tmp/orquestrador.tar.gz
docker-compose up -d
```

## ✅ Verificação Pós-Deploy

```bash
# Testar health check
curl http://192.168.1.247:3000/health

# Verificar logs
pm2 logs orquestrador

# Testar endpoint de erro (deve retornar formato RFC 7807)
curl http://192.168.1.247:3000/trpc/teams.getById?input={"id":999999}

# Testar pagination
curl http://192.168.1.247:3000/trpc/teams.list?input={"limit":10,"offset":0}
```

## 📊 Checklist de Deploy

- [ ] Merge PR #3 para main
- [ ] Pull código no servidor
- [ ] Instalar dependências (pino, pino-pretty)
- [ ] Build da aplicação
- [ ] Restart do processo PM2/systemd
- [ ] Verificar logs
- [ ] Testar endpoints críticos
- [ ] Verificar error handling
- [ ] Verificar pagination

## 🔐 Credenciais Necessárias

Para deploy você precisa:
- SSH access to 192.168.1.247
- User: flavio (ou outro user)
- Permissões para restart PM2

## 📞 Contato

Se precisar de ajuda com deploy:
- Verificar README.md
- Verificar logs em `/var/log/`
- Consultar PM2: `pm2 status`

---

**Status**: ✅ Código pronto para deploy
**PR**: https://github.com/fmunizmcorp/orquestrador-ia/pull/3
**Branch**: genspark_ai_developer
**Build**: SUCCESS
