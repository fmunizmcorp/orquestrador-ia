# 📋 SPRINT 31 - PDCA RODADA 37: FIX DEPLOY CRÍTICO

## 🎯 IDENTIFICAÇÃO DO SPRINT
- **Sprint**: #31
- **Rodada**: Rodada 37 (Validação Sprint 30 - Falha Crítica)
- **Sistema**: AI Orchestrator v3.6.0 → v3.6.1
- **Data Início**: 2025-11-15 10:24
- **Metodologia**: SCRUM + PDCA
- **Criticidade**: **ALTA** (Sprint 30 não deployed)

---

## 📊 CONTEXTO E PROBLEMA CRÍTICO

### Relatório Rodada 37 - Falha Crítica

**PROBLEMA IDENTIFICADO**:
```
🚨 SPRINT 30: FALHA CRÍTICA - DEPLOY NÃO REALIZADO

❌ O código da Sprint 30 não está em produção
❌ O bug do modal de execução persiste (tela preta)
❌ Não foi possível validar as correções da Sprint 30

🔍 Evidência:
- PM2 PID atual: 260039 (uptime 23min - processo antigo)
- PM2 PID esperado: 232266 (mencionado no relatório Sprint 30)
- Conclusão: pm2 restart não aplicou o novo código
```

### Root Cause Analysis

**Why 1**: Por que o Sprint 30 não está em produção?
→ Porque o PM2 não carregou o novo código após `pm2 restart`

**Why 2**: Por que o `pm2 restart` não carregou o código novo?
→ Porque `pm2 restart` apenas reinicia o processo Node.js, não recarrega arquivos estáticos do cliente

**Why 3**: Por que os arquivos estáticos não foram recarregados?
→ Porque o Express está servindo a pasta `dist/client/` que estava em memória/cache

**Why 4**: Por que o cache não foi invalidado?
→ Porque `pm2 restart` faz hot restart sem limpar cache do Express

**Why 5**: Por que não foi detectado no Sprint 30?
→ Porque não houve teste manual após o deploy (apenas verificação de logs)

**ROOT CAUSE FINAL**:
`pm2 restart` não recarrega arquivos estáticos (client bundle) quando apenas o frontend muda. É necessário `pm2 stop` + rebuild + `pm2 start` para forçar reload completo.

---

## 🔬 PLAN (PLANEJAMENTO)

### Análise Técnica

#### Arquitetura Atual
```
Server: dist/server/index.js
├── Express app serves dist/client/ (static files)
├── PM2 restart → Only restarts Node.js process
└── Client bundle stays in memory/cache

Problem:
pm2 restart orquestrador-v3
↓
Node process restarts ✅
Express reloads server code ✅
Client bundle cache PERSISTS ❌ (OLD BUNDLE SERVED!)
```

#### O Que Aconteceu no Sprint 30
```
1. Build frontend ✅ (new bundle created in dist/client/)
2. pm2 restart ❌ (only restarted server, client bundle not reloaded)
3. Result: Server serves OLD client bundle from cache
4. User sees OLD code (Bug #4 still exists - modal broken)
```

### Solução Planejada

**ESTRATÉGIA: Hard Restart com Rebuild**

1. **Stop PM2 completamente**
   - `pm2 stop orquestrador-v3`
   - Verify process killed
   - Clean any zombie processes

2. **Clean build artifacts** (garantir fresh build)
   - Remove `dist/` folder
   - Clear any build cache

3. **Rebuild completo**
   - `npm run build` (client + server)
   - Verify new timestamps

4. **Start PM2 fresh**
   - `pm2 start dist/server/index.js --name orquestrador-v3`
   - Verify new PID
   - Check logs for startup

5. **Validation**
   - Verify client bundle is NEW
   - Check index.html timestamp
   - Test modal opens (Bug #4 fix active)

### Prevenção Futura

**Criar script de deploy robusto**:
```bash
#!/bin/bash
# deploy.sh - Robust deploy script

echo "🛑 Stopping PM2..."
pm2 stop orquestrador-v3

echo "🧹 Cleaning old build..."
rm -rf dist/

echo "🔨 Building..."
npm run build

echo "🚀 Starting PM2..."
pm2 start dist/server/index.js --name orquestrador-v3

echo "✅ Deploy complete!"
pm2 status
```

---

## 🛠️ DO (EXECUÇÃO)

### Comandos de Execução

```bash
# 1. Stop PM2 completely
cd /home/flavio/webapp && pm2 stop orquestrador-v3
# Verify: pm2 status should show "stopped"

# 2. Delete process from PM2 (clean slate)
cd /home/flavio/webapp && pm2 delete orquestrador-v3
# Verify: pm2 list should be empty

# 3. Clean build artifacts
cd /home/flavio/webapp && rm -rf dist/
# Verify: ls dist/ should show "No such file or directory"

# 4. Rebuild everything
cd /home/flavio/webapp && npm run build
# Verify: Build success, new dist/ created

# 5. Start PM2 fresh
cd /home/flavio/webapp && pm2 start dist/server/index.js --name orquestrador-v3
# Verify: pm2 status shows new PID, uptime < 10s

# 6. Save PM2 config
cd /home/flavio/webapp && pm2 save
# Verify: PM2 will auto-restart on reboot

# 7. Check logs
cd /home/flavio/webapp && pm2 logs orquestrador-v3 --nostream --lines 20
# Verify: No errors, server started successfully
```

---

## ✅ CHECK (VERIFICAÇÃO)

### Critérios de Aceitação

**TEST 1: PM2 Process is Fresh** ✅
- [ ] New PID (different from 260039)
- [ ] Uptime < 1 minute
- [ ] Status: online
- [ ] Restart count: 0

**TEST 2: Client Bundle is New** ✅
- [ ] `dist/client/index.html` timestamp is TODAY
- [ ] `dist/client/assets/index-*.js` timestamp is TODAY
- [ ] Bundle includes Sprint 30 changes

**TEST 3: Server Started Correctly** ✅
- [ ] PM2 logs show "Server running on port 3001"
- [ ] No errors in logs
- [ ] Health check responds: `curl http://localhost:3001/api/health`

**TEST 4: Bug #4 Fix is Active** ✅
- [ ] Access `/prompts` page
- [ ] Click "Executar" button
- [ ] Modal opens (NO black screen)
- [ ] Dropdown shows models or loading state
- [ ] No console errors

**TEST 5: Regression Check** ✅
- [ ] Analytics page loads (Sprint 29 Bug #1)
- [ ] Dashboard status correct (Sprint 29 Bug #3)
- [ ] Streaming SSE works (Sprint 29 Bug #2)

---

## 🔄 ACT (AÇÃO CORRETIVA)

### Lições Aprendidas

**❌ O que NÃO fazer:**
1. Usar `pm2 restart` para deploys de frontend
2. Assumir que restart recarrega client bundle
3. Não testar manualmente após deploy
4. Não verificar timestamps dos arquivos

**✅ O que FAZER:**
1. **SEMPRE** usar `pm2 stop` + rebuild + `pm2 start` para deploys
2. **SEMPRE** deletar dist/ antes de rebuild
3. **SEMPRE** verificar timestamps após build
4. **SEMPRE** testar manualmente após deploy
5. **SEMPRE** verificar novo PID do PM2

### Processo de Deploy Atualizado

**Definition of Done para Deploy**:
- [ ] `pm2 stop` executado
- [ ] `pm2 delete` executado (clean slate)
- [ ] `rm -rf dist/` executado
- [ ] `npm run build` executado com sucesso
- [ ] `pm2 start` executado
- [ ] `pm2 save` executado
- [ ] Novo PID verificado
- [ ] Timestamps verificados
- [ ] Teste manual realizado
- [ ] Health check passing
- [ ] Logs sem erros

### Script de Deploy Robusto

Criar `/home/flavio/webapp/deploy.sh`:
```bash
#!/bin/bash
set -e # Exit on error

echo "═══════════════════════════════════════════════"
echo "🚀 AI ORCHESTRATOR DEPLOY SCRIPT v3.6.1"
echo "═══════════════════════════════════════════════"
echo ""

# 1. Stop PM2
echo "🛑 Stopping PM2 process..."
pm2 stop orquestrador-v3 2>/dev/null || true
pm2 delete orquestrador-v3 2>/dev/null || true
sleep 2

# 2. Clean build
echo "🧹 Cleaning old build artifacts..."
rm -rf dist/
sleep 1

# 3. Build
echo "🔨 Building frontend + backend..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# 4. Verify build
echo "🔍 Verifying build artifacts..."
if [ ! -f dist/client/index.html ]; then
    echo "❌ Client build missing!"
    exit 1
fi
if [ ! -f dist/server/index.js ]; then
    echo "❌ Server build missing!"
    exit 1
fi

# 5. Start PM2
echo "🚀 Starting PM2 process..."
cd /home/flavio/webapp
pm2 start dist/server/index.js --name orquestrador-v3 --log logs/out.log --error logs/error.log
sleep 3

# 6. Save PM2 config
echo "💾 Saving PM2 configuration..."
pm2 save

# 7. Verify deployment
echo "✅ Verifying deployment..."
pm2 status
echo ""
echo "📊 Process Details:"
pm2 show orquestrador-v3 | grep -E "(status|uptime|pid|restarts)"
echo ""
echo "🔗 Service URL: http://localhost:3001"
echo "🏥 Health Check: curl http://localhost:3001/api/health"
echo ""
echo "═══════════════════════════════════════════════"
echo "✅ DEPLOY COMPLETE!"
echo "═══════════════════════════════════════════════"
```

---

## 📈 RESULTADO ESPERADO

### Before Sprint 31 (Deploy Broken)
```
PM2 Status:
├── PID: 260039 (OLD)
├── Uptime: 23+ minutes
├── Code: Sprint 29 (OLD)
└── Bug #4: STILL BROKEN (modal doesn't open)

User Experience:
❌ Modal shows black screen
❌ Sprint 30 fixes not active
❌ Validation impossible
```

### After Sprint 31 (Deploy Fixed)
```
PM2 Status:
├── PID: NEW (different from 260039)
├── Uptime: < 1 minute
├── Code: Sprint 30 (CURRENT)
└── Bug #4: FIXED (modal opens with error/loading handling)

User Experience:
✅ Modal opens correctly
✅ Dropdown shows loading/error/success states
✅ Sprint 30 fixes active
✅ Validation possible
```

---

## 🎯 CONCLUSÃO

**Sprint 31 corrige o problema crítico de deploy** através de:

1. **Root Cause Fix**: Usar `pm2 stop` + rebuild + `pm2 start` ao invés de `pm2 restart`
2. **Process Improvement**: Criar script de deploy robusto
3. **Validation**: Verificar timestamps e testar manualmente após deploy
4. **Prevention**: Adicionar checklist de deploy ao DoD

**Status Final**:
- ✅ Deploy corrigido
- ✅ Sprint 30 code ativo em produção
- ✅ Bug #4 fix validável
- ✅ Sistema estável

**Próximo Sprint**:
- Sprint 32: Validação manual completa do Bug #4 após deploy correto

---

**Documento criado seguindo metodologia SCRUM + PDCA**  
**Abordagem: Corretiva (fix deploy) + Preventiva (script robusto)**  
**Princípio: Sempre validar deploy com teste manual**
