# 📋 SPRINT 27 - ANÁLISE E PLANEJAMENTO

**Título**: Correção de Timeout em Streaming SSE para Prompts Longos  
**Data de Criação**: 15 de novembro de 2025, 00:15 -03:00  
**Metodologia**: SCRUM + PDCA  
**Sprint Origem**: Sprint 26 (Rodada 33)  
**Problema Identificado**: #1 - SSE Timeout em Prompts Longos

---

## 🎯 OBJETIVO DA SPRINT

**Meta Principal**: Eliminar timeout em streaming SSE para prompts que geram respostas longas (> 30 segundos)

**Critérios de Sucesso**:
- ✅ Streaming completa sem timeout para prompts de até 2000 chunks
- ✅ Frontend recebe evento DONE corretamente
- ✅ Usuário vê progresso em tempo real
- ✅ Tempo de resposta configurável por prompt
- ✅ Testes automatizados aprovados (100%)

---

## 📊 ANÁLISE DO PROBLEMA (PLAN - PDCA)

### Situação Atual

**Problema Detectado na Rodada 33**:
```
Teste: Streaming SSE Endpoint
Status: PARCIALMENTE APROVADO (5/7 checks)
Falhas:
  ❌ Received DONE event (timeout após 30s)
  ❌ Response time < 30s (30.3s real)

Logs do Servidor:
  ✅ Stream completed - 1999 chunks, 55628ms, 5154 chars
  ✅ Evento DONE enviado pelo backend
  ❌ Frontend timeout antes de receber DONE
```

### Causa Raiz

**Análise dos 5 Porquês**:
1. **Por que o teste falhou?** → Timeout de 30s foi atingido
2. **Por que o timeout foi atingido?** → Modelo demorou 55s para completar
3. **Por que o modelo demorou tanto?** → Prompt gerou 1999 chunks (5154 caracteres)
4. **Por que gerou tantos chunks?** → Sem limite de tokens configurado
5. **Por que não há limite?** → LM Studio request não especifica `max_tokens`

**Causa Raiz**: Requisições ao LM Studio não limitam tamanho da resposta

### Impacto

**Usuário Final**:
- ⚠️ Experiência ruim com prompts longos
- ⚠️ Interface pode parecer travada (> 30s sem feedback final)
- ⚠️ Sem controle sobre tamanho da resposta

**Sistema**:
- ⚠️ Consumo excessivo de recursos do LM Studio
- ⚠️ Timeout em testes automatizados
- ⚠️ Possível timeout em clientes HTTP padrão (60s)

---

## 🎯 SOLUÇÃO PROPOSTA (PLAN - PDCA)

### Estratégia

**Abordagem Multi-Camadas**:

1. **Camada Backend** (LM Studio Client)
   - Adicionar `max_tokens` parameter em requests
   - Configurar default: 1024 tokens (~750 palavras)
   - Permitir override por prompt

2. **Camada Frontend** (useStreamingPrompt)
   - Implementar timeout configurável
   - Default: 120 segundos (2 minutos)
   - Mensagem clara ao usuário em timeout

3. **Camada UI** (StreamingPromptExecutor)
   - Progress bar com tempo estimado
   - Indicador de "tempo restante"
   - Opção "Continuar aguardando" se timeout

### Arquitetura da Solução

```typescript
// Backend: server/lib/lm-studio.ts
interface LMStudioRequest {
  model: string;
  messages: Message[];
  stream: boolean;
  max_tokens?: number;      // NEW: Limite de tokens
  temperature?: number;
}

// Frontend: client/src/hooks/useStreamingPrompt.ts
interface ExecuteOptions {
  promptId: number;
  variables?: Record<string, any>;
  modelId: number;
  timeout?: number;          // NEW: Timeout configurável (ms)
  maxTokens?: number;        // NEW: Limite de tokens
}

// Backend: server/routes/rest-api.ts
router.post('/prompts/execute/stream', async (req, res) => {
  const { maxTokens = 1024, timeout = 120000 } = req.body;
  
  // Aplicar timeout no streaming
  const timeoutId = setTimeout(() => {
    res.write(`data: ${JSON.stringify({
      type: 'timeout',
      message: 'Streaming timeout',
      duration: timeout
    })}\n\n`);
    res.end();
  }, timeout);
  
  // Limpar timeout ao completar
  clearTimeout(timeoutId);
});
```

---

## 📝 BACKLOG SCRUM - SPRINT 27

### User Stories

**US-27.1**: Como desenvolvedor, quero limitar tokens em LM Studio para evitar respostas excessivamente longas

**Critérios de Aceite**:
- Backend adiciona `max_tokens` em requests ao LM Studio
- Default: 1024 tokens
- Configurável por prompt no banco de dados
- Documentado na API

---

**US-27.2**: Como usuário, quero ver um timeout configurável para que prompts longos não falhem silenciosamente

**Critérios de Aceite**:
- Frontend aceita `timeout` parameter em `execute()`
- Default: 120000ms (2 minutos)
- Mensagem clara ao usuário em caso de timeout
- Opção de retry automático

---

**US-27.3**: Como usuário, quero ver progresso em tempo real para saber quanto falta para completar

**Critérios de Aceite**:
- Progress bar visual com % estimado
- "Tempo estimado restante" baseado em chunks/s
- Indicador de chunks processados (X/Y chunks)

---

### Tarefas Técnicas (30 tarefas)

#### FASE 1: Backend - LM Studio Client (8 tarefas)

**T-27.1** - Adicionar `max_tokens` interface em LMStudioRequest  
**Complexidade**: 1 ponto | **Tempo**: 15 min  
**Arquivo**: `server/lib/lm-studio.ts`

**T-27.2** - Implementar `max_tokens` parameter em `chatCompletionStream()`  
**Complexidade**: 2 pontos | **Tempo**: 30 min  
**Arquivo**: `server/lib/lm-studio.ts`

**T-27.3** - Adicionar `temperature` parameter (bonus)  
**Complexidade**: 1 ponto | **Tempo**: 15 min  
**Arquivo**: `server/lib/lm-studio.ts`

**T-27.4** - Criar testes unitários para LM Studio client  
**Complexidade**: 3 pontos | **Tempo**: 45 min  
**Arquivo**: `server/lib/__tests__/lm-studio.test.ts`

**T-27.5** - Adicionar logging de tokens em resposta  
**Complexidade**: 1 ponto | **Tempo**: 15 min  
**Arquivo**: `server/lib/lm-studio.ts`

**T-27.6** - Adicionar validação de `max_tokens` (min: 50, max: 4096)  
**Complexidade**: 2 pontos | **Tempo**: 30 min  
**Arquivo**: `server/lib/lm-studio.ts`

**T-27.7** - Documentar novos parameters na interface  
**Complexidade**: 1 ponto | **Tempo**: 15 min  
**Arquivo**: `server/lib/lm-studio.ts`

**T-27.8** - Build e validação TypeScript  
**Complexidade**: 1 ponto | **Tempo**: 10 min  

---

#### FASE 2: Backend - REST API Endpoint (7 tarefas)

**T-27.9** - Adicionar `maxTokens` e `timeout` em request body schema  
**Complexidade**: 2 pontos | **Tempo**: 30 min  
**Arquivo**: `server/routes/rest-api.ts`

**T-27.10** - Implementar timeout protection com `setTimeout()`  
**Complexidade**: 3 pontos | **Tempo**: 45 min  
**Arquivo**: `server/routes/rest-api.ts`

**T-27.11** - Enviar evento SSE `timeout` ao atingir limite  
**Complexidade**: 2 pontos | **Tempo**: 30 min  
**Arquivo**: `server/routes/rest-api.ts`

**T-27.12** - Limpar `setTimeout` ao completar stream  
**Complexidade**: 2 pontos | **Tempo**: 20 min  
**Arquivo**: `server/routes/rest-api.ts`

**T-27.13** - Passar `max_tokens` para LM Studio client  
**Complexidade**: 1 ponto | **Tempo**: 15 min  
**Arquivo**: `server/routes/rest-api.ts`

**T-27.14** - Adicionar logs detalhados (tokens, duration, chunks)  
**Complexidade**: 2 pontos | **Tempo**: 30 min  
**Arquivo**: `server/routes/rest-api.ts`

**T-27.15** - Criar testes end-to-end do endpoint  
**Complexidade**: 3 pontos | **Tempo**: 60 min  
**Arquivo**: `server/routes/__tests__/rest-api-streaming.test.ts`

---

#### FASE 3: Frontend - useStreamingPrompt Hook (6 tarefas)

**T-27.16** - Adicionar `timeout` e `maxTokens` em ExecuteOptions  
**Complexidade**: 1 ponto | **Tempo**: 15 min  
**Arquivo**: `client/src/hooks/useStreamingPrompt.ts`

**T-27.17** - Implementar timeout client-side com `setTimeout()`  
**Complexidade**: 3 pontos | **Tempo**: 45 min  
**Arquivo**: `client/src/hooks/useStreamingPrompt.ts`

**T-27.18** - Adicionar handler para evento SSE `timeout`  
**Complexidade**: 2 pontos | **Tempo**: 30 min  
**Arquivo**: `client/src/hooks/useStreamingPrompt.ts`

**T-27.19** - Calcular progresso estimado (chunks/s, ETA)  
**Complexidade**: 3 pontos | **Tempo**: 45 min  
**Arquivo**: `client/src/hooks/useStreamingPrompt.ts`

**T-27.20** - Adicionar state `timeoutOccurred` e `timeoutMessage`  
**Complexidade**: 1 ponto | **Tempo**: 15 min  
**Arquivo**: `client/src/hooks/useStreamingPrompt.ts`

**T-27.21** - Atualizar interface TypeScript e JSDoc  
**Complexidade**: 1 ponto | **Tempo**: 15 min  
**Arquivo**: `client/src/hooks/useStreamingPrompt.ts`

---

#### FASE 4: Frontend - StreamingPromptExecutor UI (5 tarefas)

**T-27.22** - Adicionar progress bar com % estimado  
**Complexidade**: 3 pontos | **Tempo**: 60 min  
**Arquivo**: `client/src/components/StreamingPromptExecutor.tsx`

**T-27.23** - Adicionar indicador "Tempo estimado: Xs restantes"  
**Complexidade**: 2 pontos | **Tempo**: 30 min  
**Arquivo**: `client/src/components/StreamingPromptExecutor.tsx`

**T-27.24** - Adicionar mensagem de timeout com opção retry  
**Complexidade**: 2 pontos | **Tempo**: 30 min  
**Arquivo**: `client/src/components/StreamingPromptExecutor.tsx`

**T-27.25** - Configurar input `maxTokens` e `timeout` (opcional, UI avançada)  
**Complexidade**: 3 pontos | **Tempo**: 45 min  
**Arquivo**: `client/src/components/StreamingPromptExecutor.tsx`

**T-27.26** - Build frontend e validação TypeScript  
**Complexidade**: 1 ponto | **Tempo**: 10 min  

---

#### FASE 5: Testes e Deploy (4 tarefas)

**T-27.27** - Criar suite de testes automatizados completa  
**Complexidade**: 5 pontos | **Tempo**: 90 min  
**Arquivos**: `/tmp/test_sprint_27_*.js`

**T-27.28** - Executar todos os testes (frontend + backend)  
**Complexidade**: 2 pontos | **Tempo**: 20 min  

**T-27.29** - Build produção (client + server)  
**Complexidade**: 2 pontos | **Tempo**: 15 min  

**T-27.30** - Deploy PM2 e validação em produção  
**Complexidade**: 2 pontos | **Tempo**: 15 min  

---

## 📈 ESTIMATIVAS

### Complexidade Total: **60 pontos** (Fibonacci)

### Tempo Estimado: **12-14 horas**

**Distribuição**:
- FASE 1 (Backend LM Studio): 2.5h
- FASE 2 (Backend REST API): 3.5h
- FASE 3 (Frontend Hook): 2.5h
- FASE 4 (Frontend UI): 3h
- FASE 5 (Testes e Deploy): 2h

### Velocity Esperada: **8-10 tarefas/dia**

---

## 🧪 ESTRATÉGIA DE TESTES (CHECK - PDCA)

### Testes Unitários

**Backend**:
```javascript
// server/lib/__tests__/lm-studio.test.ts
describe('LMStudioClient', () => {
  test('should add max_tokens to request', () => {});
  test('should validate max_tokens range (50-4096)', () => {});
  test('should use default max_tokens=1024', () => {});
});
```

**Frontend**:
```typescript
// client/src/hooks/__tests__/useStreamingPrompt.test.ts
describe('useStreamingPrompt', () => {
  test('should timeout after specified duration', () => {});
  test('should handle SSE timeout event', () => {});
  test('should calculate ETA correctly', () => {});
});
```

### Testes End-to-End

**Teste 1**: Streaming com `max_tokens=100` (deve completar rapidamente)
```bash
Expected: < 10 segundos
Expected chunks: < 100
Expected: Evento DONE recebido
```

**Teste 2**: Streaming com `max_tokens=1024` (resposta média)
```bash
Expected: < 30 segundos
Expected chunks: < 1024
Expected: Evento DONE recebido
```

**Teste 3**: Streaming com `timeout=15000` (15s)
```bash
Expected: Timeout se resposta > 15s
Expected: Evento SSE 'timeout' recebido
Expected: Mensagem clara no frontend
```

---

## 📊 MÉTRICAS DE SUCESSO (CHECK - PDCA)

### Quantitativas

| Métrica | Antes (Sprint 26) | Meta (Sprint 27) |
|---------|-------------------|------------------|
| Taxa de sucesso SSE | 71% (5/7 checks) | **100% (7/7 checks)** |
| Tempo médio resposta | 55s (1999 chunks) | **< 15s (< 1024 chunks)** |
| Timeouts em produção | Desconhecido | **0 timeouts** |
| Testes aprovados | 6/9 (67%) | **9/9 (100%)** |

### Qualitativas

- ✅ Usuário recebe feedback claro de progresso
- ✅ Usuário pode configurar timeout (UI avançada)
- ✅ Sistema previne respostas excessivamente longas
- ✅ Código bem documentado e testado

---

## 🚀 RISCOS E MITIGAÇÕES

### Risco #1: `max_tokens` muito baixo trunca respostas importantes
**Probabilidade**: MÉDIA  
**Impacto**: ALTO  
**Mitigação**: Default 1024 tokens (~750 palavras), configurável por prompt

### Risco #2: Timeout muito curto frustra usuário
**Probabilidade**: MÉDIA  
**Impacto**: MÉDIO  
**Mitigação**: Default 120s (2 minutos), mensagem clara com opção retry

### Risco #3: LM Studio não respeita `max_tokens`
**Probabilidade**: BAIXA  
**Impacto**: ALTO  
**Mitigação**: Adicionar timeout client-side como fallback

---

## 📚 DOCUMENTAÇÃO NECESSÁRIA (ACT - PDCA)

1. **README_SPRINT_27.md** - Overview da solução
2. **API_STREAMING_V2.md** - Documentação atualizada da API SSE
3. **FRONTEND_STREAMING_GUIDE.md** - Guia de uso do hook
4. **SPRINT_27_FINAL_REPORT.md** - Relatório PDCA completo

---

## ✅ DEFINIÇÃO DE PRONTO (DoD)

- [ ] Todos os 30 tarefas completadas
- [ ] Build frontend sem erros TypeScript
- [ ] Build backend sem erros TypeScript
- [ ] Testes unitários aprovados (100%)
- [ ] Testes E2E aprovados (3/3 cenários)
- [ ] Deploy PM2 bem-sucedido
- [ ] Documentação completa
- [ ] Code review aprovado
- [ ] Commit e push para GitHub
- [ ] Pull Request criada e aprovada

---

**Planejamento Criado**: 15 de novembro de 2025, 00:15 -03:00  
**Responsável**: AI Developer (Automated Execution)  
**Aprovador**: Product Owner (Usuário Final)  
**Próximo Passo**: Executar Sprint 27 (12-14 horas)
