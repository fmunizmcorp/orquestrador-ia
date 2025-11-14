# 📋 SPRINT 24 - PLANNING & ARCHITECTURE
## Server-Sent Events (SSE) Streaming Implementation

**Data**: November 14, 2025, 08:45 -03:00  
**Sprint**: 24 - Streaming SSE  
**Status**: 🔄 PLANEJAMENTO COMPLETO

---

## 🎯 SPRINT GOAL

**Implementar streaming de respostas via Server-Sent Events (SSE)** para eliminar dependência de timeout único e alcançar taxa de sucesso de **90%+** (vs 25% atual).

---

## 📊 CONTEXTO & JUSTIFICATIVA

### Problema Identificado (Sprint 23)
- ✅ Timeout aumentado: 30s → 120s → 300s
- ❌ Taxa de sucesso: Mantida em ~25%
- 🔍 **Descoberta**: Prompts complexos precisam >300s
- 💡 **Conclusão**: Timeout não resolve, streaming sim!

### Por que Streaming?
1. **Elimina timeout único**: Não há limite de tempo total
2. **UX superior**: Usuário vê progresso em tempo real
3. **Padrão indústria**: ChatGPT, Claude, Copilot usam
4. **Taxa de sucesso esperada**: 90%+ (vs 25% atual)

---

## 🏗️ ARQUITETURA DA SOLUÇÃO

### Fluxo de Dados Atual (Problemático)
```
Frontend → Backend → LM Studio
   ↓          ↓          ↓
 WAIT      WAIT      Process (>300s)
   ↓          ↓          ↓
 WAIT      WAIT      Response
   ↓          ↓          ↓
Response ← Response ← Complete
   ↓
Timeout ❌ (se >300s)
```

### Fluxo de Dados Novo (Streaming)
```
Frontend → Backend → LM Studio
   ↓          ↓          ↓
EventSource SSE     stream: true
   ↓          ↓          ↓
Chunk 1  ← Chunk 1 ← Token batch
Chunk 2  ← Chunk 2 ← Token batch
Chunk 3  ← Chunk 3 ← Token batch
   ...        ...        ...
Complete ← Complete ← Done
   ↓
NEVER timeout! ✅
```

---

## 🛠️ COMPONENTES A IMPLEMENTAR

### 1. Backend - LM Studio Client (server/lib/lm-studio.ts)

#### Novo Método: `chatCompletionStream()`
```typescript
async *chatCompletionStream(
  request: LMStudioRequest
): AsyncGenerator<string, void, unknown> {
  const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...request,
      stream: true,  // KEY: Enable streaming
    }),
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(line => line.trim());

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;
        
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices[0]?.delta?.content;
          if (content) yield content;
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
  }
}
```

### 2. Backend - REST API Endpoint (server/routes/rest-api.ts)

#### Novo Endpoint: `POST /api/prompts/execute/stream`
```typescript
// SSE streaming endpoint
app.post('/api/prompts/execute/stream', async (req, res) => {
  try {
    const { promptId, variables } = req.body;

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Fetch prompt and model
    const [prompt] = await db.select()
      .from(prompts)
      .where(eq(prompts.id, promptId));

    const [model] = await db.select()
      .from(aiModels)
      .where(eq(aiModels.id, prompt.modelId));

    // Process content
    let content = prompt.content;
    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        content = content.replace(
          new RegExp(`{{${key}}}`, 'g'),
          String(value)
        );
      });
    }

    // Send initial metadata
    res.write(`data: ${JSON.stringify({
      type: 'start',
      promptId,
      modelId: model.id,
      modelName: model.name
    })}\n\n`);

    // Stream from LM Studio
    for await (const chunk of lmStudio.chatCompletionStream({
      model: model.modelId,
      messages: [{ role: 'user', content }],
      temperature: prompt.temperature,
      max_tokens: prompt.maxTokens,
    })) {
      res.write(`data: ${JSON.stringify({
        type: 'chunk',
        content: chunk
      })}\n\n`);
    }

    // Send completion
    res.write(`data: ${JSON.stringify({
      type: 'done'
    })}\n\n`);

    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({
      type: 'error',
      message: error.message
    })}\n\n`);
    res.end();
  }
});
```

### 3. Frontend - Hook React (client/src/hooks/useStreamingPrompt.ts)

#### Novo Hook: `useStreamingPrompt()`
```typescript
import { useState, useCallback } from 'react';

interface StreamingState {
  content: string;
  isStreaming: boolean;
  error: string | null;
  metadata: any;
}

export function useStreamingPrompt() {
  const [state, setState] = useState<StreamingState>({
    content: '',
    isStreaming: false,
    error: null,
    metadata: null,
  });

  const execute = useCallback(async (promptId: number, variables?: any) => {
    setState({
      content: '',
      isStreaming: true,
      error: null,
      metadata: null,
    });

    try {
      const eventSource = new EventSource(
        `/api/prompts/execute/stream?${new URLSearchParams({
          promptId: String(promptId),
          variables: JSON.stringify(variables || {}),
        })}`
      );

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'start':
            setState(prev => ({
              ...prev,
              metadata: data,
            }));
            break;

          case 'chunk':
            setState(prev => ({
              ...prev,
              content: prev.content + data.content,
            }));
            break;

          case 'done':
            setState(prev => ({
              ...prev,
              isStreaming: false,
            }));
            eventSource.close();
            break;

          case 'error':
            setState(prev => ({
              ...prev,
              error: data.message,
              isStreaming: false,
            }));
            eventSource.close();
            break;
        }
      };

      eventSource.onerror = () => {
        setState(prev => ({
          ...prev,
          error: 'Connection error',
          isStreaming: false,
        }));
        eventSource.close();
      };
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.message,
        isStreaming: false,
      }));
    }
  }, []);

  return { ...state, execute };
}
```

### 4. Frontend - UI Component (client/src/components/StreamingPromptExecutor.tsx)

#### Novo Component: `<StreamingPromptExecutor />`
```typescript
import React, { useState } from 'react';
import { useStreamingPrompt } from '../hooks/useStreamingPrompt';

export function StreamingPromptExecutor({ promptId }: { promptId: number }) {
  const { content, isStreaming, error, metadata, execute } = useStreamingPrompt();
  const [variables, setVariables] = useState({});

  return (
    <div className="streaming-executor">
      {/* Input for variables */}
      <div className="variables-input">
        <textarea
          placeholder="Variables (JSON)"
          onChange={(e) => setVariables(JSON.parse(e.target.value || '{}'))}
        />
      </div>

      {/* Execute button */}
      <button
        onClick={() => execute(promptId, variables)}
        disabled={isStreaming}
      >
        {isStreaming ? 'Streaming...' : 'Execute Prompt'}
      </button>

      {/* Progress indicator */}
      {isStreaming && (
        <div className="streaming-indicator">
          <div className="spinner" />
          <span>Receiving response...</span>
        </div>
      )}

      {/* Metadata */}
      {metadata && (
        <div className="metadata">
          <span>Model: {metadata.modelName}</span>
        </div>
      )}

      {/* Streaming content */}
      <div className="content-area">
        <pre>{content}</pre>
        {isStreaming && <span className="cursor">▊</span>}
      </div>

      {/* Error display */}
      {error && (
        <div className="error">
          Error: {error}
        </div>
      )}
    </div>
  );
}
```

---

## 📋 SPRINT BACKLOG (15 TASKS)

### Fase 1: Planejamento & Análise (Tasks 24.1-24.3)
- [x] **24.1** - Planejamento: Criar Sprint 24 backlog
- [ ] **24.2** - Análise: Estudar SSE no LM Studio
- [ ] **24.3** - Design: Arquitetar solução completa

### Fase 2: Backend Implementation (Tasks 24.4-24.6)
- [ ] **24.4** - Backend: Modificar LMStudioClient
  - Adicionar método `chatCompletionStream()`
  - Implementar AsyncGenerator
  - Parsear SSE do LM Studio
- [ ] **24.5** - Backend: Atualizar REST API
  - Criar endpoint `/api/prompts/execute/stream`
  - Configurar headers SSE
  - Implementar streaming pipeline
- [ ] **24.6** - Backend: Middleware streaming
  - Error handling para conexões perdidas
  - Cleanup de recursos
  - Logging de eventos

### Fase 3: Frontend Implementation (Tasks 24.7-24.9)
- [ ] **24.7** - Frontend: Hook useStreamingPrompt
  - Estado de streaming
  - EventSource connection
  - Acumulação de chunks
- [ ] **24.8** - Frontend: UI atualizada
  - Componente StreamingPromptExecutor
  - Área de conteúdo progressivo
  - Integração com páginas existentes
- [ ] **24.9** - Frontend: Indicador visual
  - Spinner/loading animation
  - Progress bar
  - Cursor piscante

### Fase 4: Build & Deploy (Tasks 24.10-24.11)
- [ ] **24.10** - Build completo
  - `npm run build` (backend + frontend)
  - Verificar bundle size
  - Testar localmente
- [ ] **24.11** - Deploy produção
  - SCP para servidor
  - Rebuild no servidor
  - PM2 restart
  - Verificar status

### Fase 5: Testing & Validation (Tasks 24.12-24.14)
- [ ] **24.12** - Teste 1: Prompt simples
  - Executar prompt rápido (<30s)
  - Verificar streaming funciona
  - Confirmar chunks recebidos
- [ ] **24.13** - Teste 2: Prompt complexo
  - Executar prompt >300s
  - Verificar NÃO timeout
  - Confirmar resposta completa
- [ ] **24.14** - Teste 3: Múltiplas simultâneas
  - 3 requests paralelas
  - Verificar estabilidade
  - Confirmar não interferem

### Fase 6: Documentation (Task 24.15)
- [ ] **24.15** - Documentação completa
  - Commit com mensagem detalhada
  - Push para GitHub
  - Sprint 24 Final Report
  - Sync servidor

---

## 🎯 DEFINITION OF DONE

### Técnico
- [ ] Código implementado e funcionando
- [ ] LMStudioClient suporta streaming
- [ ] Endpoint SSE funcionando
- [ ] Frontend recebe chunks progressivos
- [ ] Build sem erros
- [ ] Deploy completo

### Funcional
- [ ] Prompt simples completa com streaming
- [ ] Prompt complexo (>300s) completa SEM timeout
- [ ] Múltiplas requisições não interferem
- [ ] Taxa de sucesso >75% (vs 25% atual)
- [ ] UX melhorada (feedback progressivo)

### Qualidade
- [ ] Testes executados (3 baterias)
- [ ] Error handling robusto
- [ ] Logs apropriados
- [ ] Performance adequada
- [ ] Sem memory leaks

### Documentação
- [ ] Código comentado
- [ ] Sprint report completo (SCRUM + PDCA)
- [ ] Commit messages claras
- [ ] PR criado e merged
- [ ] README atualizado se necessário

---

## 📊 MÉTRICAS DE SUCESSO

### Quantitativas
| Métrica | Antes | Meta | Como Medir |
|---------|-------|------|------------|
| Taxa de sucesso | 25% | >75% | Testes 1-3 |
| Timeout errors | 75% | <10% | Logs PM2 |
| Time to first byte | N/A | <2s | Frontend logs |
| Total completion | 300s+ | Any | Sem limite |

### Qualitativas
- ✅ Usuário vê progresso em tempo real
- ✅ Não há "espera cega"
- ✅ Sistema não trava em prompts longos
- ✅ UX comparável a ChatGPT/Claude

---

## 🔄 PDCA CYCLE - SPRINT 24

### PLAN (計画 - Keikaku)
**Problema**: 75% prompts timeoutam em 300s  
**Hipótese**: Streaming elimina dependência de timeout  
**Solução**: Implementar SSE (Server-Sent Events)  
**Meta**: Taxa de sucesso >75%

### DO (実行 - Jikkō)
**Implementar**:
1. Backend streaming (LMStudioClient + REST API)
2. Frontend EventSource (hook + UI)
3. Deploy completo
4. Testes abrangentes

### CHECK (評価 - Hyōka)
**Validar**:
1. Prompts simples funcionam
2. Prompts complexos NÃO timeoutam
3. Múltiplas requests estáveis
4. Taxa de sucesso >75%

### ACT (改善 - Kaizen)
**Aprender**:
1. Se funcionar: Padrão para todas APIs
2. Se problemas: Ajustes e iteração
3. Documentar lições aprendidas

---

## ⚠️ RISCOS & MITIGAÇÕES

### Risco 1: LM Studio não suporta streaming
**Probabilidade**: Baixa  
**Impacto**: Alto  
**Mitigação**: Validar API docs primeiro (Task 24.2)

### Risco 2: EventSource não funciona em produção
**Probabilidade**: Média  
**Impacto**: Alto  
**Mitigação**: Testar localmente antes de deploy

### Risco 3: Performance degradada
**Probabilidade**: Baixa  
**Impacto**: Médio  
**Mitigação**: Monitorar CPU/memory durante testes

### Risco 4: Frontend crashes com chunks grandes
**Probabilidade**: Média  
**Impacto**: Médio  
**Mitigação**: Buffer chunks e update em batch

---

## 🚀 PRÓXIMOS PASSOS IMEDIATOS

1. ✅ **Task 24.1**: Planejamento completo → **CONCLUÍDO**
2. ⏳ **Task 24.2**: Análise SSE no LM Studio
3. ⏳ **Task 24.3**: Design detalhado da arquitetura
4. ⏳ **Task 24.4**: Começar implementação backend

---

## 📚 REFERÊNCIAS TÉCNICAS

### LM Studio API
- Endpoint: `http://localhost:1234/v1/chat/completions`
- Param: `stream: true` para SSE
- Format: `data: {...}\n\n`

### Server-Sent Events (SSE)
- Protocol: HTTP
- Content-Type: `text/event-stream`
- Format: `data: json\n\n`
- Browser API: `EventSource`

### Exemplos Indústria
- **OpenAI**: Usa SSE para streaming
- **Anthropic Claude**: Usa SSE
- **GitHub Copilot**: Usa streaming similar

---

**Preparado Por**: GenSpark AI Developer  
**Data**: November 14, 2025, 08:50 -03:00  
**Sprint**: 24  
**Status**: 🔄 PLANEJAMENTO COMPLETO → INICIANDO IMPLEMENTAÇÃO  
**Progress**: 1/15 tasks (6.7%)

---

## ✅ TASK 24.1 COMPLETA

Planejamento detalhado criado com:
- ✅ 15 tasks definidas
- ✅ Arquitetura desenhada
- ✅ Componentes especificados
- ✅ Métricas estabelecidas
- ✅ Riscos identificados

**Próximo**: Task 24.2 - Análise SSE no LM Studio
