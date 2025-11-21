# 🚀 DEPLOY SPRINT 73 - GUIA COMPLETO

**Data:** 21 de Novembro de 2025  
**Sprint:** 73  
**Versão:** 3.7.1  
**Bundle:** Analytics-UhXqgaYy.js (28.35 kB)

---

## 📋 PRÉ-REQUISITOS

### Ferramentas Necessárias

- ✅ SSH access ao servidor (31.97.64.43:2224)
- ✅ Usuário: flavio
- ✅ Senha: sshflavioia
- ✅ Build pronto em `/home/user/webapp/dist/`

### Verificação Local

```bash
# 1. Verificar build existe
ls -lh dist/client/assets/Analytics-*.js

# Esperado:
# Analytics-UhXqgaYy.js  28.35 kB

# 2. Verificar conteúdo
grep -o "useMemo" dist/client/assets/Analytics-UhXqgaYy.js | wc -l
# Esperado: 2

# 3. Verificar logs removidos
grep -o "SPRINT 66\|SPRINT 55" dist/client/assets/Analytics-UhXqgaYy.js | wc -l
# Esperado: 0
```

---

## 🔧 OPÇÃO 1: DEPLOY MANUAL (RECOMENDADO)

### Passo 1: Conectar ao Servidor

```bash
# SSH no servidor de produção
ssh -p 2224 flavio@31.97.64.43
# Senha: sshflavioia
```

### Passo 2: Backup do Build Atual

```bash
# Dentro do servidor
cd /home/flavio/webapp
cp -r dist dist_backup_sprint72_$(date +%Y%m%d_%H%M%S)
```

### Passo 3: Transferir Novos Arquivos

**Na máquina LOCAL (sandbox):**
```bash
# Criar arquivo tar do build
cd /home/user/webapp
tar -czf dist_sprint73.tar.gz dist/

# Transferir via SCP (requer sshpass ou entrada manual de senha)
# Se tiver sshpass:
sshpass -p "sshflavioia" scp -P 2224 dist_sprint73.tar.gz flavio@31.97.64.43:/tmp/

# Ou manualmente:
scp -P 2224 dist_sprint73.tar.gz flavio@31.97.64.43:/tmp/
# Senha: sshflavioia
```

**No SERVIDOR:**
```bash
# Extrair arquivos
cd /home/flavio/webapp
rm -rf dist/
tar -xzf /tmp/dist_sprint73.tar.gz
rm /tmp/dist_sprint73.tar.gz
```

### Passo 4: Restart PM2

```bash
# Dentro do servidor
cd /home/flavio/webapp
pm2 restart orquestrador-v3 --update-env
```

### Passo 5: Validação

```bash
# Verificar PM2 status
pm2 status

# Esperado:
# ┌─────┬──────────────────┬─────────┬────────┐
# │ id  │ name             │ status  │ cpu    │
# ├─────┼──────────────────┼─────────┼────────┤
# │ 0   │ orquestrador-v3  │ online  │ 0%     │
# └─────┴──────────────────┴─────────┴────────┘

# Verificar logs
pm2 logs orquestrador-v3 --nostream --lines 20

# Esperado: Sem erros

# Testar endpoint
curl -s http://localhost:3001/api/health | jq .

# Esperado:
# {
#   "status": "healthy",
#   "timestamp": "...",
#   "version": "3.7.1"
# }
```

---

## 🔧 OPÇÃO 2: DEPLOY VIA RSYNC (SE TIVER SSHPASS)

```bash
# Na máquina LOCAL (sandbox)
cd /home/user/webapp

# Sync arquivos
rsync -avz --delete \
  -e "sshpass -p 'sshflavioia' ssh -o StrictHostKeyChecking=no -p 2224" \
  dist/ flavio@31.97.64.43:/home/flavio/webapp/dist/

# Restart PM2
sshpass -p "sshflavioia" ssh -o StrictHostKeyChecking=no -p 2224 flavio@31.97.64.43 \
  "pm2 restart orquestrador-v3"

# Verificar status
sshpass -p "sshflavioia" ssh -o StrictHostKeyChecking=no -p 2224 flavio@31.97.64.43 \
  "pm2 status && pm2 logs --nostream --lines 10"
```

---

## ✅ VALIDAÇÃO PÓS-DEPLOY

### 1. Testes HTTP

```bash
# No servidor (SSH)
cd /home/flavio/webapp

# Teste 1: Health check
curl -s http://localhost:3001/api/health

# Teste 2: Métricas
curl -s http://localhost:3001/api/trpc/monitoring.getCurrentMetrics

# Teste 3: Analytics endpoint
curl -s http://localhost:3001/ | grep "Analytics-UhXqgaYy.js"
# Deve retornar o novo bundle
```

### 2. Testes Browser Console (CRÍTICO!)

**IMPORTANTE:** Esta é a validação mais importante!

```bash
# 1. Conectar com port forwarding
ssh -p 2224 -L 3001:localhost:3001 flavio@31.97.64.43

# 2. No navegador local, abrir:
http://localhost:3001/analytics

# 3. Abrir DevTools (F12) → Console tab

# 4. Verificar:
✅ Sem "React Error #310"
✅ Sem "Too many re-renders"
✅ Sem "Maximum update depth exceeded"
✅ Métricas carregando corretamente
✅ Gráficos renderizando
```

### 3. Testes de Smoke

```bash
# No servidor
cd /home/flavio/webapp

# Criar script de teste
cat > test_analytics_sprint73.sh << 'EOF'
#!/bin/bash
echo "=== TESTE ANALYTICS SPRINT 73 ==="
echo ""

for i in {1..5}; do
  echo "Test $i/5..."
  response=$(curl -s http://localhost:3001/api/trpc/monitoring.getCurrentMetrics)
  
  if echo "$response" | grep -q "result"; then
    echo "  ✓ PASSED"
  else
    echo "  ✗ FAILED"
  fi
  
  sleep 2
done

echo ""
echo "=== TESTE COMPLETO ==="
EOF

chmod +x test_analytics_sprint73.sh
./test_analytics_sprint73.sh
```

---

## 🚨 ROLLBACK (SE NECESSÁRIO)

### Se algo der errado:

```bash
# No servidor
cd /home/flavio/webapp

# 1. Restaurar backup
LAST_BACKUP=$(ls -t dist_backup_* | head -1)
rm -rf dist/
mv $LAST_BACKUP dist/

# 2. Restart PM2
pm2 restart orquestrador-v3

# 3. Verificar
pm2 status
pm2 logs --nostream --lines 20
```

---

## 📊 CHECKLIST DE DEPLOY

### Pré-Deploy
- [ ] Build local completo (`npm run build`)
- [ ] Verificar bundle `Analytics-UhXqgaYy.js` existe
- [ ] Verificar tamanho: 28.35 kB
- [ ] Verificar useMemo presente (2 ocorrências)
- [ ] Verificar logs removidos (0 Sprint 66/55)

### Durante Deploy
- [ ] Backup do build atual criado
- [ ] Arquivos transferidos com sucesso
- [ ] PM2 restart executado
- [ ] Status PM2: online

### Pós-Deploy
- [ ] Health check: OK
- [ ] Logs PM2: sem erros
- [ ] Endpoint analytics carrega
- [ ] **Browser console: SEM React Error #310** ✅
- [ ] Métricas carregam corretamente
- [ ] Gráficos renderizam

---

## 📝 INFORMAÇÕES TÉCNICAS

### Servidor

- **Host Externo:** 31.97.64.43
- **Porta SSH:** 2224
- **Usuário:** flavio
- **Senha:** sshflavioia
- **Servidor Interno:** 192.168.1.247:3001
- **PM2 Process:** orquestrador-v3
- **Webapp Dir:** /home/flavio/webapp

### Build

- **Bundle:** Analytics-UhXqgaYy.js
- **Tamanho:** 28.35 kB (gzip: 6.10 kB)
- **useMemo:** 2 hooks presentes
- **Console.logs:** 0 (removidos)

### Mudanças Sprint 73

- ✅ Removido console.logs de health useMemo
- ✅ Removido console.logs de stats useMemo
- ✅ useMemo agora é puro (sem side effects)
- ✅ Bundle 530 bytes menor que Sprint 68

---

## 🆘 TROUBLESHOOTING

### Problema: Permission Denied SSH

```bash
# Solução: Verificar senha
ssh -p 2224 flavio@31.97.64.43
# Senha: sshflavioia
```

### Problema: PM2 Não Restart

```bash
# Solução: Stop e Start
pm2 stop orquestrador-v3
pm2 start ecosystem.config.cjs
```

### Problema: Analytics Não Carrega

```bash
# Verificar se bundle correto está servido
curl -s http://localhost:3001/ | grep "Analytics-"

# Deve retornar: Analytics-UhXqgaYy.js

# Se não:
pm2 restart orquestrador-v3 --update-env
pm2 flush orquestrador-v3
```

### Problema: React Error #310 Ainda Aparece

```bash
# 1. Verificar se bundle correto foi deployado
ls -lh /home/flavio/webapp/dist/client/assets/Analytics-*.js

# 2. Limpar cache do browser (Ctrl+Shift+R)

# 3. Se persistir, rollback e investigar
```

---

## ✅ SUCESSO ESPERADO

Após deploy bem-sucedido:

1. ✅ PM2 status: **online**
2. ✅ Logs: **sem erros**
3. ✅ Health check: **OK**
4. ✅ Analytics carrega: **OK**
5. ✅ **Browser console: SEM React Error #310** 🎉
6. ✅ Métricas funcionam: **OK**
7. ✅ Sistema estável: **OK**

---

**Data:** 21 de Novembro de 2025  
**Sprint:** 73  
**Status:** ✅ **PRONTO PARA DEPLOY**  
**Bundle:** Analytics-UhXqgaYy.js (28.35 kB)

---

**🚀 DEPLOY COM CONFIANÇA - CÓDIGO LIMPO E TESTADO! ✅**
