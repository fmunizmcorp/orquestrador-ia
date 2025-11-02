# 🚀 INSTRUÇÕES DE DEPLOY AUTOMÁTICO

## ✅ Status Atual
- **12 commits** sincronizados no GitHub
- **PR #3** criado: https://github.com/fmunizmcorp/orquestrador-ia/pull/3
- **Branch**: `genspark_ai_developer`
- **Servidor**: 31.97.64.43:3001

## 📦 Arquivos de Deploy Criados

### 1. `deploy-automatic.sh`
Script completo de deploy que deve ser executado NO SERVIDOR.

**Execução no servidor:**
```bash
cd /root/orquestrador-ia
git fetch origin genspark_ai_developer
git checkout genspark_ai_developer
git pull origin genspark_ai_developer
npm install
npm run build
pm2 restart all
pm2 save
```

## 🔧 Deploy Manual Rápido (via SSH)

Se você tem acesso SSH configurado:
```bash
ssh root@31.97.64.43 "cd /root/orquestrador-ia && git pull origin genspark_ai_developer && npm install && npm run build && pm2 restart all"
```

## 🤖 Deploy Automático (GitHub Actions)

Para configurar deploy automático via GitHub Actions, adicione este workflow:

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ genspark_ai_developer ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: 31.97.64.43
          username: root
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /root/orquestrador-ia
            git pull origin genspark_ai_developer
            npm install
            npm run build
            pm2 restart all
            pm2 save
```

## ✅ Validação Pós-Deploy

Após o deploy, execute:
```bash
# Testar endpoints
curl http://31.97.64.43:3001/

# Verificar PM2
pm2 status

# Ver logs
pm2 logs --lines 50
```

## 📊 Checklist de Deploy

- [ ] Código commitado e pushed para GitHub
- [ ] PR criado e revisado
- [ ] Deploy executado no servidor
- [ ] Testes validados
- [ ] PM2 reiniciado
- [ ] Endpoints funcionando
- [ ] Logs sem erros

## 🔗 Links Úteis

- **GitHub Repo**: https://github.com/fmunizmcorp/orquestrador-ia
- **PR #3**: https://github.com/fmunizmcorp/orquestrador-ia/pull/3
- **Servidor**: http://31.97.64.43:3001
- **Documentação**: `docs/scrum/`

