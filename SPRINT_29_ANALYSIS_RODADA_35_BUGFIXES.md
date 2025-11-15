# 🐛 SPRINT 29: RODADA 35 BUG FIXES - ANÁLISE PDCA E BACKLOG

**Data**: 15 de Novembro de 2025  
**Sprint**: 29  
**Rodada**: 35  
**Versão**: v3.6.0 → v3.6.1  
**Metodologia**: SCRUM + PDCA  
**Objetivo**: Corrigir 4 bugs críticos/médios reportados na Rodada 35

---

## 📋 ÍNDICE

1. [Resumo Executivo](#resumo-executivo)
2. [Análise PDCA dos 4 Bugs](#análise-pdca-dos-4-bugs)
3. [Backlog Detalhado (40 Tarefas)](#backlog-detalhado-40-tarefas)
4. [Planejamento de Execução](#planejamento-de-execução)
5. [Critérios de Aceitação](#critérios-de-aceitação)

---

## 🎯 RESUMO EXECUTIVO

### Bugs Reportados na Rodada 35

| ID | Severidade | Título | Status |
|----|-----------|--------|--------|
| 1 | **CRÍTICO** | Página Analytics exibe tela preta | NOVO |
| 2 | **CRÍTICO** | Execução de prompt trava em 0% (HTTP 504) | NOVO |
| 3 | **MÉDIO** | Widgets do Dashboard exibem dados incorretos | NOVO |
| 4 | **CRÍTICO** | Impossibilidade de selecionar LLM por prompt | NOVO |

### Impacto

- **3 bugs críticos** impedem uso em produção
- **1 bug médio** causa confusão ao usuário
- Backend funcionando, problemas no frontend e comunicação SSE
- Sistema não utilizável pelo usuário final

### Estratégia de Correção

1. **Cirúrgico**: Mexer apenas no necessário, não quebrar o que funciona
2. **Completo**: Todas as 4 correções implementadas
3. **Testado**: Validação de cada bug após correção
4. **Documentado**: PDCA e evidências de correção

---

## 📊 ANÁLISE PDCA DOS 4 BUGS

### 🐛 BUG 1: PÁGINA ANALYTICS EXIBE TELA PRETA

#### **PLAN (Planejamento)**

**Problema Identificado**:
- Página `/analytics` carrega mas exibe tela preta completa
- Sem erros no console do navegador
- Componente React quebrado ou dados inválidos

**Root Cause Analysis**:
1. Componente Analytics não tem Error Boundary
2. Possível chamada `map()` em array `undefined`/`null`
3. Dados da API podem estar em formato inesperado
4. Falta validação de props antes de renderização

**Solução Proposta**:
1. **Adicionar Error Boundary** ao componente Analytics
2. **Validar dados** antes de renderizar (null checks)
3. **Adicionar try-catch** em funções de transformação de dados
4. **Loading state** enquanto busca dados
5. **Fallback UI** caso erro ocorra

**Arquivos a Modificar**:
- `client/src/pages/Analytics.tsx` - Adicionar validações
- `client/src/components/ErrorBoundary.tsx` - Criar se não existir
- `client/src/App.tsx` - Envolver rota Analytics com ErrorBoundary

#### **DO (Execução)**

**Tarefas**:
1. Ler código atual do Analytics.tsx
2. Identificar chamadas `map()`, `filter()`, `reduce()` sem validação
3. Criar ErrorBoundary component
4. Adicionar validações null/undefined
5. Adicionar loading state
6. Wrap Analytics com ErrorBoundary no App.tsx

#### **CHECK (Verificação)**

**Critérios de Aceitação**:
- ✅ Página Analytics carrega sem tela preta
- ✅ Erro capturado e exibido de forma amigável
- ✅ Loading state exibido durante fetch
- ✅ Dados válidos renderizados corretamente
- ✅ Console sem erros

#### **ACT (Ação)**

**Documentação**:
- Código modificado commitado
- Screenshots antes/depois
- Teste manual validado

---

### 🐛 BUG 2: EXECUÇÃO DE PROMPT TRAVA EM 0% (HTTP 504)

#### **PLAN (Planejamento)**

**Problema Identificado**:
- Modal de streaming abre e trava em "0%"
- HTTP 504 Gateway Timeout
- Backend envia chunks, frontend não recebe
- Buffering no Nginx ou proxy reverso

**Root Cause Analysis**:
1. ✅ Backend funciona (curl recebe chunks)
2. ❌ Nginx bufferizando eventos SSE
3. ❌ Falta `X-Accel-Buffering: no` no proxy
4. ❌ Falta `res.flush()` após cada chunk no Node.js
5. ❌ Modelo padrão pode estar incorreto (ID 2 falha, ID 1 funciona)

**Solução Proposta**:
1. **Configurar Nginx** para desabilitar buffering de proxy:
   ```nginx
   location /api/prompts/execute/stream {
       proxy_pass http://localhost:3001;
       proxy_buffering off;
       proxy_cache off;
       proxy_set_header Connection "keep-alive";
       proxy_set_header Cache-Control "no-cache";
       proxy_set_header X-Accel-Buffering no; # ESSENCIAL
       proxy_read_timeout 86400;
   }
   ```

2. **Adicionar res.flush()** no backend após cada chunk:
   ```typescript
   for await (const chunk of lmStudio.chatCompletionStream(...)) {
       res.write(`data: ${JSON.stringify(chunk)}\n\n`);
       res.flush(); // ADICIONAR
   }
   ```

3. **Corrigir modelo padrão** no modal de execução:
   - Usar model ID 1 (medicine-llm) como padrão
   - Ou permitir seleção de modelo

**Arquivos a Modificar**:
- `/etc/nginx/sites-available/default` - Configuração SSE
- `server/routes/rest-api.ts` - Adicionar res.flush()
- `client/src/components/StreamingPromptExecutor.tsx` - Model ID padrão

#### **DO (Execução)**

**Tarefas**:
1. Verificar se Nginx está instalado e rodando
2. Ler configuração atual do Nginx
3. Adicionar location block para SSE (ou modificar existente)
4. Adicionar `X-Accel-Buffering: no`
5. Reload Nginx
6. Modificar rest-api.ts para adicionar res.flush()
7. Modificar StreamingPromptExecutor para model ID 1
8. Test streaming via navegador

#### **CHECK (Verificação)**

**Critérios de Aceitação**:
- ✅ Modal de streaming recebe chunks em tempo real
- ✅ Progress bar atualiza de 0% → 100%
- ✅ Sem HTTP 504 timeout
- ✅ ETA calculation funcionando
- ✅ Streaming completa com evento DONE

#### **ACT (Ação)**

**Documentação**:
- Configuração Nginx documentada
- Código Node.js modificado commitado
- Teste de streaming validado com screenshots

---

### 🐛 BUG 3: WIDGETS DO DASHBOARD EXIBEM DADOS INCORRETOS

#### **PLAN (Planejamento)**

**Problema Identificado**:
- Widget "Banco de Dados" mostra "Offline"
- Widget "LM Studio" mostra "Offline"
- Health check retorna "connected" e "ok"
- Frontend interpretando dados incorretamente

**Root Cause Analysis**:
1. Dashboard busca `/api/health`
2. Health check retorna:
   ```json
   {
     "status": "ok",
     "database": "connected",
     "system": "healthy"
   }
   ```
3. Frontend espera formato diferente?
4. Lógica de status incorreta no componente

**Solução Proposta**:
1. **Revisar componente Dashboard**:
   - Verificar como status está sendo lido
   - Corrigir lógica de interpretação
   - Mapear "connected" → "Online"
   - Mapear "ok" → "Online"

2. **Padronizar API** (se necessário):
   - Garantir que health check retorna formato esperado
   - Adicionar campo `lmStudio` se estiver faltando

**Arquivos a Modificar**:
- `client/src/pages/Dashboard.tsx` - Corrigir lógica de status
- `server/routes/rest-api.ts` - Verificar health check (se necessário)

#### **DO (Execução)**

**Tarefas**:
1. Ler código Dashboard.tsx
2. Identificar como status é renderizado
3. Verificar health check API response
4. Corrigir mapeamento de status
5. Testar com dados reais

#### **CHECK (Verificação)**

**Critérios de Aceitação**:
- ✅ Widget "Banco de Dados" mostra "Online" quando connected
- ✅ Widget "LM Studio" mostra "Online" quando ok
- ✅ Status atualiza corretamente
- ✅ Cores dos indicadores corretas (verde para online)

#### **ACT (Ação)**

**Documentação**:
- Lógica de status corrigida commitada
- Screenshot Dashboard com status corretos

---

### 🐛 BUG 4: IMPOSSIBILIDADE DE SELECIONAR LLM POR PROMPT

#### **PLAN (Planejamento)**

**Problema Identificado**:
- Não há dropdown para selecionar modelo de IA
- Sistema usa modelo padrão sempre
- Não é possível usar LLMs especializados
- Se modelo padrão falhar, não há workaround

**Root Cause Analysis**:
1. Funcionalidade não implementada
2. Modal de execução não tem campo de seleção
3. API suporta `modelId` mas frontend não permite escolher

**Solução Proposta**:
1. **Adicionar dropdown no modal** de execução:
   - Buscar lista de modelos disponíveis via API
   - Dropdown com todos os modelos
   - Model ID passado para API de streaming

2. **Implementar hook** para buscar modelos:
   ```typescript
   const { data: models } = api.lmstudio.listModels.useQuery();
   ```

3. **Tratar erro** de modelo não carregado:
   - Mensagem amigável no frontend
   - Fallback para modelo padrão

**Arquivos a Modificar**:
- `client/src/components/StreamingPromptExecutor.tsx` - Adicionar dropdown
- `client/src/hooks/useStreamingPrompt.ts` - Passar modelId para API

#### **DO (Execução)**

**Tarefas**:
1. Ler código StreamingPromptExecutor.tsx
2. Adicionar select/dropdown para modelos
3. Buscar modelos via tRPC query
4. State para modelId selecionado
5. Passar modelId para useStreamingPrompt hook
6. Estilizar dropdown
7. Testar seleção de diferentes modelos

#### **CHECK (Verificação)**

**Critérios de Aceitação**:
- ✅ Dropdown exibe lista de modelos disponíveis
- ✅ Modelo selecionado é usado na execução
- ✅ Execução funciona com diferentes modelos
- ✅ Erro tratado se modelo não disponível
- ✅ UI amigável e intuitiva

#### **ACT (Ação)**

**Documentação**:
- Dropdown implementado commitado
- Screenshot modal com seleção de modelo
- Teste com múltiplos modelos validado

---

## 📦 BACKLOG DETALHADO (40 TAREFAS)

### **FASE 1: Análise e Preparação** (5 tarefas)

1. ✅ Baixar e extrair relatório PDF da Rodada 35
2. ✅ Criar TODO list com todos os 4 bugs
3. ✅ Criar documento SPRINT_29_ANALYSIS com PDCA
4. ⏳ Revisar código atual dos componentes afetados
5. ⏳ Verificar dependências e ferramentas necessárias

### **FASE 2: BUG 1 - Analytics Tela Preta** (8 tarefas)

6. ⏳ Ler código completo de `client/src/pages/Analytics.tsx`
7. ⏳ Identificar chamadas `map()` sem validação
8. ⏳ Criar `client/src/components/ErrorBoundary.tsx`
9. ⏳ Adicionar validações null/undefined em Analytics
10. ⏳ Adicionar loading state
11. ⏳ Wrap Analytics com ErrorBoundary em App.tsx
12. ⏳ Test Analytics page (deve carregar sem tela preta)
13. ⏳ Screenshot antes/depois

### **FASE 3: BUG 2 - Streaming SSE Trava 0%** (10 tarefas)

14. ⏳ Verificar se Nginx está instalado
15. ⏳ Ler configuração atual `/etc/nginx/sites-available/default`
16. ⏳ Adicionar/modificar location block para SSE
17. ⏳ Adicionar `X-Accel-Buffering: no`
18. ⏳ Reload Nginx: `sudo nginx -t && sudo nginx -s reload`
19. ⏳ Ler `server/routes/rest-api.ts` SSE endpoint
20. ⏳ Adicionar `res.flush()` após cada `res.write()`
21. ⏳ Modificar `StreamingPromptExecutor` model ID padrão para 1
22. ⏳ Test streaming via navegador (deve receber chunks)
23. ⏳ Screenshot modal com progress bar funcionando

### **FASE 4: BUG 3 - Dashboard Status Incorretos** (6 tarefas)

24. ⏳ Ler código `client/src/pages/Dashboard.tsx`
25. ⏳ Identificar lógica de status dos widgets
26. ⏳ Corrigir mapeamento: "connected" → "Online"
27. ⏳ Corrigir mapeamento: "ok" → "Online"
28. ⏳ Test Dashboard (widgets devem mostrar status corretos)
29. ⏳ Screenshot Dashboard com status Online

### **FASE 5: BUG 4 - Seleção de LLM** (7 tarefas)

30. ⏳ Ler código `client/src/components/StreamingPromptExecutor.tsx`
31. ⏳ Adicionar query para buscar modelos: `api.lmstudio.listModels.useQuery()`
32. ⏳ Adicionar state: `const [selectedModelId, setSelectedModelId] = useState(1)`
33. ⏳ Adicionar dropdown/select com lista de modelos
34. ⏳ Passar `selectedModelId` para `useStreamingPrompt` hook
35. ⏳ Estilizar dropdown (Tailwind CSS)
36. ⏳ Test seleção de modelo (deve executar com modelo escolhido)

### **FASE 6: Build e Deploy** (4 tarefas)

37. ⏳ Build frontend: `npm run build:client`
38. ⏳ Build server: `npm run build:server`
39. ⏳ PM2 restart: `pm2 restart orquestrador-v3`
40. ⏳ Verificar server online: `curl http://localhost:3001/api/health`

### **FASE 7: Testes de Validação** (4 tarefas)

41. ⏳ TEST 1: Analytics page carrega sem tela preta
42. ⏳ TEST 2: Streaming SSE recebe chunks em tempo real
43. ⏳ TEST 3: Dashboard widgets mostram status corretos
44. ⏳ TEST 4: Dropdown de seleção de modelo funciona

### **FASE 8: Commit e Documentação** (4 tarefas)

45. ⏳ Git add all changes
46. ⏳ Commit com mensagem detalhada (feat(sprint-29): Fix 4 critical bugs from Rodada 35)
47. ⏳ Push to GitHub
48. ⏳ Criar SPRINT_29_FINAL_REPORT com evidências

---

## 📅 PLANEJAMENTO DE EXECUÇÃO

### Ordem de Execução

1. **Prioridade 1 (Críticos Bloqueantes)**:
   - BUG 2: Streaming SSE (bloqueia funcionalidade principal)
   - BUG 4: Seleção de LLM (workaround necessário)

2. **Prioridade 2 (Críticos não-bloqueantes)**:
   - BUG 1: Analytics tela preta (página secundária)

3. **Prioridade 3 (Médio)**:
   - BUG 3: Dashboard status (cosmético)

### Tempo Estimado

- **FASE 1**: 30min (análise)
- **FASE 2**: 1h (Analytics)
- **FASE 3**: 1.5h (Streaming SSE + Nginx)
- **FASE 4**: 30min (Dashboard)
- **FASE 5**: 1h (Seleção LLM)
- **FASE 6**: 15min (Build + Deploy)
- **FASE 7**: 30min (Testes)
- **FASE 8**: 15min (Commit + Doc)

**Total Estimado**: ~5.5 horas

---

## ✅ CRITÉRIOS DE ACEITAÇÃO

### BUG 1: Analytics

- [ ] Página `/analytics` carrega sem tela preta
- [ ] ErrorBoundary captura erros e exibe UI amigável
- [ ] Loading state durante fetch de dados
- [ ] Dados válidos renderizados corretamente
- [ ] Console sem erros JavaScript

### BUG 2: Streaming SSE

- [ ] Modal de streaming recebe chunks em tempo real
- [ ] Progress bar atualiza de 0% → 100%
- [ ] Sem HTTP 504 Gateway Timeout
- [ ] ETA calculation funcionando
- [ ] Streaming completa com evento DONE
- [ ] Nginx configurado com `X-Accel-Buffering: no`
- [ ] Node.js fazendo `res.flush()` após cada chunk

### BUG 3: Dashboard

- [ ] Widget "Banco de Dados" mostra "Online" quando connected
- [ ] Widget "LM Studio" mostra "Online" quando ok
- [ ] Status atualiza corretamente ao fazer refresh
- [ ] Cores dos indicadores corretas (verde = online, vermelho = offline)

### BUG 4: Seleção LLM

- [ ] Dropdown/select exibe lista de modelos disponíveis
- [ ] Modelo selecionado é usado na execução do prompt
- [ ] Execução funciona com diferentes modelos (ID 1, ID 2, etc)
- [ ] Erro tratado se modelo não disponível
- [ ] UI amigável e intuitiva
- [ ] State do modelo selecionado persiste durante sessão

### Geral

- [ ] Build completo sem erros
- [ ] PM2 restart successful
- [ ] Todos os 4 bugs validados como corrigidos
- [ ] Commit com mensagem descritiva
- [ ] Push para GitHub successful
- [ ] Documentação completa com screenshots

---

## 🎯 METODOLOGIA

### SCRUM

**Sprint 29**:
- **Duração**: 1 dia
- **Tarefas**: 48 tarefas (8 fases)
- **Story Points**: 48 points
- **Objetivo**: Corrigir 4 bugs críticos/médios da Rodada 35

### PDCA

**Plan**: Análise detalhada de cada bug com root cause  
**Do**: Implementação cirúrgica das correções  
**Check**: Testes de validação para cada bug  
**Act**: Commit, deploy, documentação

### Git Workflow

- ✅ Commit imediato após correções
- ✅ Mensagem descritiva estruturada
- ✅ Push automático para GitHub
- ✅ Sem intervenção manual

---

## 📝 NOTAS IMPORTANTES

### Princípios de Execução

1. **Cirúrgico**: Mexer apenas nos arquivos relacionados aos bugs
2. **Não quebrar**: Não modificar código que está funcionando
3. **Completo**: Implementar todas as 4 correções
4. **Testado**: Validar cada correção antes de prosseguir
5. **Documentado**: Screenshots e evidências de cada fix

### Arquivos a Modificar (Lista Completa)

**Bug 1 - Analytics**:
- `client/src/pages/Analytics.tsx`
- `client/src/components/ErrorBoundary.tsx` (criar)
- `client/src/App.tsx`

**Bug 2 - Streaming SSE**:
- `/etc/nginx/sites-available/default` (ou similar)
- `server/routes/rest-api.ts`
- `client/src/components/StreamingPromptExecutor.tsx`

**Bug 3 - Dashboard**:
- `client/src/pages/Dashboard.tsx`

**Bug 4 - Seleção LLM**:
- `client/src/components/StreamingPromptExecutor.tsx`
- `client/src/hooks/useStreamingPrompt.ts` (verificar)

### Arquivos a NÃO Modificar

- ✅ `server/lib/lm-studio.ts` (já funciona, Sprint 27)
- ✅ `vite.config.ts` (já otimizado, Sprint 28)
- ✅ `client/src/App.tsx` lazy loading (já funciona)
- ✅ Qualquer outro arquivo não relacionado aos bugs

---

**Documento criado por**: GenSpark AI Agent  
**Data**: 15 de Novembro de 2025  
**Sprint**: 29  
**Status**: ✅ PLANEJAMENTO COMPLETO - PRONTO PARA EXECUÇÃO

🎯 **PRÓXIMO PASSO**: Iniciar FASE 2 - Correção do BUG 1 (Analytics)
