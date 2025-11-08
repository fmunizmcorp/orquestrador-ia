# 🚀 INSTRUÇÕES DE DEPLOY FINAL - V3.5.1

**Data**: 2025-11-08  
**Status**: ✅ PR #3 MERGED para main  
**Versão**: 3.5.1  
**Commit SHA**: bb1acbddab70c42de07d8bc3460c3e37d1869155

---

## ✅ STATUS ATUAL

### Git & GitHub
- ✅ PR #3 criado e MERGED com sucesso
- ✅ Código merged para branch `main`
- ✅ Todos os commits squashados
- ✅ SHA do merge: `bb1acbd`

### Código no Servidor
- ⚠️ Servidor ainda tem versão anterior (antes do merge)
- 🔄 Precisa fazer pull da branch main
- 🔄 Precisa rebuild e restart

---

## 🎯 DEPLOY AUTOMATIZADO

### Opção 1: Script Automatizado (RECOMENDADO)

```bash
# Conectar ao servidor
ssh -p 2224 flavio@31.97.64.43

# Navegar para diretório
cd /home/flavio/orquestrador-ia

# Fazer pull do main (com código merged)
git fetch origin main
git checkout main
git pull origin main

# Executar script de deploy
bash deploy-production-v3.5.1.sh
```

O script fará automaticamente:
1. ✅ Backup do estado atual
2. ✅ Atualização do código-fonte
3. ✅ Instalação de dependências
4. ✅ Build da aplicação
5. ✅ Restart do PM2
6. ✅ Verificação de saúde
7. ✅ Exibição de logs

---

## 📋 DEPLOY MANUAL (Passo a Passo)

Se preferir executar manualmente:

### 1. Conectar ao Servidor
```bash
ssh -p 2224 flavio@31.97.64.43
```

### 2. Navegar para Diretório
```bash
cd /home/flavio/orquestrador-ia
pwd
# Deve mostrar: /home/flavio/orquestrador-ia
```

### 3. Backup do Estado Atual
```bash
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
mkdir -p /home/flavio/orquestrador-ia-backups
cp -r dist /home/flavio/orquestrador-ia-backups/dist-backup-${TIMESTAMP}
echo "✅ Backup criado"
```

### 4. Atualizar Código-fonte (PULL DO MAIN)
```bash
git fetch origin main
git checkout main
git pull origin main
```

**Verificar versão**:
```bash
grep '"version"' package.json
# Deve mostrar: "version": "3.5.1"
```

### 5. Instalar Dependências
```bash
npm install --production
```

### 6. Build da Aplicação
```bash
npm run build
```

**Aguardar**: ~3-5 segundos

**Verificar build**:
```bash
ls -lh dist/client/
# Deve mostrar arquivos JS e CSS novos
```

### 7. Restart do PM2
```bash
pm2 restart orquestrador-v3 --update-env
```

**Aguardar**: 2 segundos

### 8. Verificar Status
```bash
pm2 status
# orquestrador-v3 deve estar "online"

pm2 logs orquestrador-v3 --lines 20 --nostream
# Verificar se não há erros
```

### 9. Testar Endpoint
```bash
curl -I http://localhost:3001/api/health
# Deve retornar: HTTP/1.1 200 OK
```

---

## 🧪 VALIDAÇÃO FINAL

### Teste Automatizado

```bash
# No servidor de produção
cd /home/flavio/orquestrador-ia
node test-create-via-trpc.mjs
```

**Resultado esperado**:
```
🎊 BUG FIX CONFIRMED! 🎊
```

### Teste Manual via Interface

1. **Abrir navegador**: http://192.168.1.247:3001
2. **Login**: Fazer login com suas credenciais
3. **Navegar**: Menu lateral → "Projetos"
4. **Criar**: Clicar em "Novo Projeto"
5. **Preencher**:
   - Nome: "Teste Deploy V3.5.1"
   - Descrição: "Validação final do bug fix"
6. **Salvar**: Clicar no botão "Salvar" ou "Criar"
7. **Verificar**:
   - ✅ Alert: "✅ Projeto criado com sucesso!"
   - ✅ Projeto aparece na lista imediatamente
   - ✅ Recarregar página (F5)
   - ✅ Projeto ainda está na lista (PERSISTIU!)

### Teste de Times

Mesmo procedimento:
1. Menu → "Times"
2. "Novo Time"
3. Preencher e salvar
4. Verificar persistência

---

## 📊 CHECKLIST DE VALIDAÇÃO

### Antes do Deploy
- [x] PR #3 merged ✅
- [x] Código em main atualizado ✅
- [x] Versão 3.5.1 no package.json ✅

### Durante o Deploy
- [ ] Backup criado
- [ ] Pull do main executado
- [ ] Dependências instaladas
- [ ] Build executado sem erros
- [ ] PM2 restartado
- [ ] Status PM2 = online
- [ ] Health check = HTTP 200

### Depois do Deploy
- [ ] Teste automatizado passou
- [ ] Projeto criado via interface
- [ ] Alert de sucesso apareceu
- [ ] Projeto apareceu na lista
- [ ] Página recarregada - projeto persistiu
- [ ] Time criado e persistido
- [ ] Logs sem erros

---

## 🔍 TROUBLESHOOTING

### Problema: Build falha

**Solução**:
```bash
# Limpar cache e tentar novamente
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Problema: PM2 não inicia

**Solução**:
```bash
# Verificar logs
pm2 logs orquestrador-v3 --lines 50

# Tentar restart completo
pm2 delete orquestrador-v3
pm2 start ecosystem.config.js
```

### Problema: Health check falha

**Solução**:
```bash
# Verificar se porta 3001 está em uso
netstat -tlnp | grep 3001

# Verificar logs do servidor
pm2 logs orquestrador-v3
```

### Problema: Teste falha

**Solução**:
```bash
# Verificar se tRPC está respondendo
curl http://localhost:3001/api/trpc/projects.list

# Verificar logs do backend
pm2 logs orquestrador-v3 | grep -E "tRPC|ERROR"
```

### Problema: Interface não carrega

**Solução**:
```bash
# Verificar se dist/ foi criado corretamente
ls -lah dist/client/

# Verificar nginx/reverse proxy
systemctl status nginx

# Testar direto na porta 3001
curl -I http://localhost:3001
```

---

## 📞 SUPORTE

### Logs Importantes

```bash
# Logs do PM2
pm2 logs orquestrador-v3 --lines 100

# Logs do sistema
journalctl -u nginx -n 50

# Logs de erro específico
pm2 logs orquestrador-v3 --err --lines 50
```

### Informações do Sistema

```bash
# Versão em execução
pm2 info orquestrador-v3 | grep exec_mode

# Uso de recursos
pm2 monit

# Processos MySQL
ps aux | grep mysql
```

---

## ✅ CONCLUSÃO

### Após Validação Bem-Sucedida

1. ✅ Confirmar oficialmente: **BUG 100% RESOLVIDO**
2. ✅ Comunicar ao time de QA
3. ✅ Atualizar documentação de produção
4. ✅ Monitorar logs por 24-48 horas
5. ✅ Considerar tarefas complementares (health check, nomenclatura)

### Métricas de Sucesso

- **Taxa de criação**: 100% (antes: 0%)
- **Persistência**: 100% (antes: 0%)
- **Tempo de resposta**: < 500ms
- **Uptime**: 99.9%
- **Erros**: 0

---

## 🎊 RESULTADO ESPERADO

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║             ✅ DEPLOY V3.5.1 CONCLUÍDO COM SUCESSO        ║
║                                                           ║
║  ✅ Código merged e deployado                             ║
║  ✅ Build executado sem erros                             ║
║  ✅ PM2 online e estável                                  ║
║  ✅ Health check OK                                       ║
║  ✅ Testes automatizados: SUCESSO                         ║
║  ✅ Testes manuais: SUCESSO                               ║
║  ✅ Persistência: FUNCIONANDO                             ║
║                                                           ║
║  🎊 BUG FIX 100% CONFIRMADO! 🎊                           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

**Desenvolvedor**: Claude (GenSpark AI Developer)  
**Data**: 2025-11-08  
**Metodologia**: SCRUM + PDCA  
**PR**: #3 (merged)  
**Commit**: bb1acbd  
**Versão**: 3.5.1

🚀 **READY FOR PRODUCTION DEPLOYMENT!** 🚀
