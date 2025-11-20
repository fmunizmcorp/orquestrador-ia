# 🧪 SPRINT 30 - INSTRUÇÕES DE TESTE

## 🎯 Objetivo do Teste
Validar que o Bug #4 (Modal de Execução) foi completamente corrigido após Sprint 30.

---

## ℹ️ Informações do Sistema

### Status do Serviço
- ✅ Build: **Completo** (2025-11-15 10:00)
- ✅ Deploy: **Ativo** via PM2
- ✅ Porta: **3001**
- ✅ URL Local: `http://localhost:3001`
- ✅ URL Rede: `http://192.168.192.164:3001`

### Arquivos Modificados
- `client/src/components/StreamingPromptExecutor.tsx` (~30 linhas)
  - Linha 57-77: Adicionar error/loading handling ao useQuery
  - Linha 215-245: Refatorar dropdown com estados de loading/error

### Correção Implementada
**PROBLEMA**: Modal de execução não abria (tela preta) devido a `useQuery` sem error handling.

**SOLUÇÃO**: 
1. Adicionar `isLoading` e `isError` ao destructuring do useQuery
2. Configurar retry logic (2 tentativas, 1s delay)
3. Adicionar loading/error states ao dropdown
4. Adicionar mensagens de feedback para usuário

---

## 📝 CASOS DE TESTE

### ✅ TESTE 1: Modal Abre Corretamente

**Objetivo**: Verificar que modal não apresenta mais tela preta ao ser aberto.

**Passos**:
1. Acessar: `http://localhost:3001/prompts` (ou URL externa se disponível)
2. Aguardar página carregar completamente
3. Localizar qualquer prompt na lista
4. Clicar no botão verde **"Executar"** (com ícone de play)

**Resultado Esperado**:
- ✅ Modal abre imediatamente
- ✅ Header do modal visível: "Executar Prompt"
- ✅ Dropdown de modelos visível
- ✅ Botão "Iniciar Execução" visível
- ❌ **NÃO** deve aparecer tela preta
- ❌ **NÃO** deve travar a página

**Evidência de Sucesso**:
- Modal renderiza completamente
- Usuário consegue ver todos os elementos do modal

---

### ⏳ TESTE 2: Dropdown - Estado de Loading

**Objetivo**: Verificar feedback visual enquanto modelos estão carregando.

**Passos**:
1. Limpar cache do navegador (Ctrl+Shift+Del)
2. Acessar `/prompts`
3. Clicar em "Executar" rapidamente (antes de cache carregar)
4. Observar dropdown de modelos

**Resultado Esperado**:
- ✅ Dropdown mostra: **"⏳ Carregando modelos..."**
- ✅ Dropdown está desabilitado (não clicável)
- ✅ Mensagem abaixo: **"⏳ Buscando modelos disponíveis..."**
- ✅ Modal permanece aberto e funcional
- ✅ Após 1-2 segundos, dropdown carrega lista de modelos

**Evidência de Sucesso**:
- Usuário informado sobre estado de loading
- Modal não crashea durante loading

---

### ❌ TESTE 3: Dropdown - Estado de Erro

**Objetivo**: Verificar graceful degradation quando query falha.

**Passos para simular erro**:

**Opção A - Desabilitar Backend (Recomendado para teste)**:
```bash
# Parar serviço temporariamente
cd /home/flavio/webapp && pm2 stop orquestrador-v3

# Acessar página (ela ficará sem backend)
# http://localhost:3001/prompts

# Reativar serviço depois do teste
cd /home/flavio/webapp && pm2 start orquestrador-v3
```

**Opção B - Usar DevTools (Mais fácil)**:
1. Abrir DevTools (F12)
2. Ir para aba "Network"
3. Ativar "Offline" mode
4. Acessar `/prompts` e abrir modal

**Resultado Esperado - Durante Erro**:
- ✅ Modal **abre normalmente** (não trava!)
- ✅ Dropdown mostra: **"❌ Erro ao carregar modelos"**
- ✅ Dropdown está desabilitado
- ✅ Mensagem em vermelho: **"⚠️ Erro ao buscar modelos. Usando modelo padrão (ID: X)."**
- ✅ Botão "Iniciar Execução" continua habilitado
- ✅ Execução usa modelo padrão (ID do props)

**Evidência de Sucesso**:
- Modal abre mesmo com erro no backend
- Usuário informado sobre erro
- Fallback para modelo padrão funciona
- **NENHUM crash de componente**

---

### ✅ TESTE 4: Dropdown - Estado de Sucesso

**Objetivo**: Verificar que lista de modelos carrega corretamente quando backend responde.

**Pré-requisito**:
- Serviço PM2 rodando: `pm2 status orquestrador-v3` deve mostrar "online"
- Backend acessível: `curl http://localhost:3001/api/health` retorna 200

**Passos**:
1. Acessar `/prompts`
2. Clicar em "Executar" em qualquer prompt
3. Aguardar modal abrir
4. Observar dropdown de modelos (seção "Modelo:")

**Resultado Esperado**:
- ✅ Dropdown popula com lista de modelos cadastrados
- ✅ Formato de cada opção: **"Nome (Provider) - ModelID"**
  - Exemplo: `medicine-llm (LM Studio) - qwen3-coder-25b`
- ✅ Dropdown está habilitado (clicável)
- ✅ Modelo pré-selecionado (value inicial do props)
- ✅ Seleção persiste ao mudar opção

**Evidência de Sucesso**:
- Todos os modelos cadastrados aparecem no dropdown
- Formato legível e informativo
- Seleção funciona corretamente

---

### 🚀 TESTE 5: Execução End-to-End

**Objetivo**: Verificar que execução completa funciona após correção do modal.

**Pré-requisitos**:
- LM Studio rodando em `localhost:1234`
- Modelo carregado no LM Studio (verificar com tray icon)
- Serviço PM2 online

**Passos**:
1. Acessar `/prompts`
2. Clicar em "Executar" no prompt "Teste Simples" (ou qualquer prompt)
3. Modal abre
4. Verificar dropdown de modelos carregou
5. Selecionar um modelo disponível (se houver múltiplos)
6. Clicar em **"Iniciar Execução"**
7. Aguardar streaming começar

**Resultado Esperado**:
- ✅ Modal abre sem tela preta
- ✅ Dropdown funciona
- ✅ Ao clicar "Iniciar Execução":
  - Banner azul aparece: **"Streaming em Progresso"**
  - Barra de progresso avança de 0% → 100%
  - Chunks aparecem em tempo real
  - ETA (tempo restante) é calculado
- ✅ Resposta completa aparece na seção "Resposta:"
- ✅ Metadados corretos (promptId, modelId, LM Studio model)
- ✅ Botões "Copiar" e "Novo" funcionam

**Evidência de Sucesso**:
- Fluxo completo funciona sem erros
- Streaming SSE funciona (correção Sprint 29 Bug #2 não regrediu)
- Usuário consegue executar prompts com modelo selecionado

---

### 🔄 TESTE 6: Regressão - Funcionalidades Anteriores

**Objetivo**: Garantir que correção não quebrou funcionalidades existentes.

#### 6A - Analytics Page (Sprint 29 Bug #1)
**Passos**:
1. Acessar `/analytics`

**Resultado Esperado**:
- ✅ Página carrega sem tela preta
- ✅ Widgets aparecem corretamente
- ✅ Dados de métricas visíveis
- ❌ **NÃO** deve haver ErrorBoundary ativo (erro capturado)

#### 6B - Dashboard Status (Sprint 29 Bug #3)
**Passos**:
1. Acessar `/` (dashboard)
2. Observar widgets de "Status dos Serviços"

**Resultado Esperado**:
- ✅ **Database**: Status correto (Online se MySQL rodando)
- ✅ **LM Studio**: Status correto (Online se LM Studio rodando em :1234)
- ❌ **NÃO** deve mostrar status hardcoded (sempre "Offline")

#### 6C - Streaming SSE (Sprint 29 Bug #2)
**Passos**:
1. Executar qualquer prompt (usar TESTE 5)
2. Observar progresso de streaming

**Resultado Esperado**:
- ✅ Progresso inicia imediatamente após primeiro chunk
- ✅ **NÃO** fica travado em "0%" por mais de 3 segundos
- ✅ Chunks aparecem em tempo real (< 1s delay)
- ✅ Barra de progresso avança suavemente

---

## 🐛 DEBUG - Como Investigar Problemas

### Console do Navegador
**Abrir DevTools**: F12 → Aba "Console"

**Logs Esperados** (sem erros):
```javascript
// Ao abrir modal:
[tRPC] QUERY models.list - Started
[tRPC] QUERY models.list - Success (Xms)

// Durante execução:
🌊 Streaming started
✅ First chunk received
```

**Logs de ERRO** (reportar se aparecerem):
```javascript
❌ Error: Cannot read property 'items' of undefined  // Indica bug não corrigido
❌ TRPCClientError: ...  // Indica problema no backend
```

### Logs do Servidor
```bash
# Ver logs em tempo real
cd /home/flavio/webapp && pm2 logs orquestrador-v3

# Ver últimas 50 linhas de erro
cd /home/flavio/webapp && pm2 logs orquestrador-v3 --err --lines 50

# Ver últimas 50 linhas de output
cd /home/flavio/webapp && pm2 logs orquestrador-v3 --out --lines 50
```

**Logs Esperados**:
```
[tRPC] QUERY models.list - Success (10ms)  // Query funcionando
🌊 [PROMPT EXECUTE STREAM] Starting streaming execution  // Execução iniciada
✅ [PROMPT EXECUTE STREAM] Stream completed  // Execução completada
```

### Verificar Serviço Rodando
```bash
# Status do PM2
pm2 status orquestrador-v3
# Deve mostrar: status "online", uptime > 0s

# Porta listening
netstat -tlnp | grep 3001
# Deve mostrar: tcp 0.0.0.0:3001 ... LISTEN

# Health check
curl http://localhost:3001/api/health
# Deve retornar: {"status":"ok",...}
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

Use esta checklist para validar Sprint 30:

- [ ] **TESTE 1**: Modal abre sem tela preta
- [ ] **TESTE 2**: Loading state do dropdown funciona
- [ ] **TESTE 3**: Error state do dropdown funciona (graceful degradation)
- [ ] **TESTE 4**: Success state do dropdown funciona (lista de modelos)
- [ ] **TESTE 5**: Execução end-to-end funciona completamente
- [ ] **TESTE 6A**: Analytics page não regrediu
- [ ] **TESTE 6B**: Dashboard status não regrediu
- [ ] **TESTE 6C**: Streaming SSE não regrediu
- [ ] **Console**: Nenhum erro JavaScript aparece
- [ ] **Logs**: Nenhum erro crítico nos logs do servidor

### Critério de Aprovação
✅ **Sprint 30 APROVADO** se:
- Todos os 9 itens acima passarem (✅)
- Bug #4 considerado **COMPLETAMENTE CORRIGIDO**

❌ **Sprint 30 REPROVADO** se:
- Qualquer teste falhar
- Modal continuar com tela preta
- Regressões detectadas em funcionalidades anteriores

---

## 📊 RELATÓRIO DE TESTE (Template)

Após executar testes, preencher:

### Informações do Teste
- **Data**: _________
- **Testador**: _________
- **Ambiente**: Local / Rede / Produção
- **URL Testada**: _________
- **Versão**: v3.6.0 Sprint 30

### Resultados
| Teste | Status | Observações |
|-------|--------|-------------|
| TESTE 1 - Modal Abre | ✅ / ❌ | |
| TESTE 2 - Loading State | ✅ / ❌ | |
| TESTE 3 - Error State | ✅ / ❌ | |
| TESTE 4 - Success State | ✅ / ❌ | |
| TESTE 5 - End-to-End | ✅ / ❌ | |
| TESTE 6A - Analytics | ✅ / ❌ | |
| TESTE 6B - Dashboard | ✅ / ❌ | |
| TESTE 6C - Streaming | ✅ / ❌ | |
| Console Errors | ✅ Nenhum / ❌ Erros | |
| Server Logs | ✅ Normal / ❌ Erros | |

### Conclusão
- [ ] ✅ **BUG #4 COMPLETAMENTE CORRIGIDO**
- [ ] ❌ **BUG #4 AINDA EXISTE** (detalhar problema abaixo)

**Detalhes** (se reprovado):
_________________________________________

---

## 🔧 COMANDOS ÚTEIS

### Reiniciar Serviço
```bash
cd /home/flavio/webapp && pm2 restart orquestrador-v3
```

### Ver Logs em Tempo Real
```bash
cd /home/flavio/webapp && pm2 logs orquestrador-v3
```

### Rebuild e Deploy
```bash
cd /home/flavio/webapp && npm run build && pm2 restart orquestrador-v3
```

### Verificar Porta
```bash
curl http://localhost:3001/api/health
```

---

**Documento criado para Sprint 30 - Rodada 36**  
**Objetivo**: Validação completa da correção do Bug #4 (Modal de Execução)
