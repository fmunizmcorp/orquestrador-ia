# 🧪 SPRINT 47: INSTRUÇÕES DE TESTE PARA USUÁRIO FINAL

**Data**: 2025-11-16  
**Status**: ✅ PM2 RESTARTADO - Sistema pronto para testes

______________________________________________________________________

## 🎯 O QUE FOI CORRIGIDO

### Problema Identificado:
❌ **PM2 não foi restartado após build**  
- Build estava correto (gerado às 02:22)
- PM2 estava servindo build antigo (5h de uptime)
- Frontend não continha código do Sprint 43

### Solução Aplicada:
✅ **`pm2 restart orquestrador-v3` executado às ~07:33**  
- Novo PID: 849427
- Uptime: < 5 minutos
- Sprint 43 agora está ativo no frontend
- Sprint 45 continua ativo no backend

### Validação Técnica:
✅ **Teste automatizado WebSocket: PASSOU**  
- Mensagem ID 11 salva com sucesso
- Confirmação recebida do servidor
- Sprint 45 logging confirmado ativo

______________________________________________________________________

## 🧪 TESTES PARA O USUÁRIO REALIZAR

### ⚠️ IMPORTANTE ANTES DE TESTAR

1. **Limpar cache do navegador** (CTRL+SHIFT+DEL ou CMD+SHIFT+DEL)
   - Ou abrir em **aba anônima/privada**
   - Motivo: Navegador pode ter cacheado versão antiga do JavaScript

2. **Recarregar página com cache limpo**: CTRL+F5 (ou CMD+SHIFT+R no Mac)

______________________________________________________________________

## 📋 TESTE 1: CHAT DEDICADO (/chat) - **CRÍTICO**

### Objetivo:
Validar que Enter e botão "Enviar" funcionam corretamente

### Passos:

#### 1. Acessar página do Chat
```
URL: http://localhost:3001/chat
```

#### 2. Verificar estado inicial
- ✅ Status deve mostrar: **🟢 Online** (verde)
- ✅ Campo de texto visível: "Digite sua mensagem..."
- ✅ Botão "Enviar" visível (azul com ícone ✈️)
- ✅ Histórico pode conter mensagens anteriores

#### 3. Abrir Console do Navegador
**Como abrir**:
- **Windows/Linux**: F12 ou CTRL+SHIFT+I
- **Mac**: CMD+OPT+I
- Ir para aba **Console**

#### 4. Teste com Enter

**Ação**:
```
1. Digitar: "Teste Sprint 47 - Envio com Enter"
2. Pressionar: ENTER (sem Shift)
```

**Resultado Esperado**:

**No navegador**:
- ✅ Mensagem aparece imediatamente no histórico
- ✅ Campo de input é limpo (volta a ficar vazio)
- ✅ Status permanece: 🟢 Online

**No Console** (deve mostrar logs do Sprint 43):
```
🚀 [SPRINT 43 DEBUG] handleSend called { input: "Teste Sprint 47...", inputLength: 30, ... }
✅ [SPRINT 43] All validations passed. Sending message: Teste Sprint 47...
📤 [SPRINT 43] Adding user message to local state: { id: ..., role: "user", ... }
📡 [SPRINT 43] Sending WebSocket message: { type: "chat:send", ... }
✅ [SPRINT 43] Message sent successfully, input cleared
```

**❌ Se der erro**:
- Capturar screenshot do Console
- Anotar mensagem de erro exata
- Relatar problema

______________________________________________________________________

#### 5. Teste com Botão "Enviar"

**Ação**:
```
1. Digitar: "Teste Sprint 47 - Envio com Botão"
2. Clicar no botão: "Enviar" (azul com ✈️)
```

**Resultado Esperado**:
- ✅ Mensagem aparece no histórico
- ✅ Campo de input é limpo
- ✅ Console mostra mesmos logs do Sprint 43

______________________________________________________________________

#### 6. Teste com Shift+Enter (Quebra de Linha)

**Ação**:
```
1. Digitar: "Linha 1"
2. Pressionar: SHIFT+ENTER
3. Digitar: "Linha 2"
4. Pressionar: ENTER (sem Shift)
```

**Resultado Esperado**:
- ✅ Mensagem com quebra de linha é enviada
- ✅ Aparece no histórico como:
  ```
  Linha 1
  Linha 2
  ```

**No Console**:
```
↩️ [SPRINT 43] Shift+Enter detected - allowing line break
🚀 [SPRINT 43 DEBUG] handleSend called { input: "Linha 1\nLinha 2", ... }
```

______________________________________________________________________

#### 7. Teste de Validação - Input Vazio

**Ação**:
```
1. Deixar campo vazio (sem digitar nada)
2. Pressionar: ENTER
```

**Resultado Esperado**:
- ✅ Nada acontece (mensagem vazia não é enviada)
- ✅ Campo permanece vazio

**No Console**:
```
🚀 [SPRINT 43 DEBUG] handleSend called { input: "", inputLength: 0, ... }
⚠️ [SPRINT 43] Input is empty
```

______________________________________________________________________

### 📊 Critérios de Sucesso - Teste 1:

| Teste | Status | Observação |
|-------|--------|------------|
| Status mostra "Online" | ☐ | |
| Enter envia mensagem | ☐ | |
| Botão envia mensagem | ☐ | |
| Campo limpa após envio | ☐ | |
| Mensagem aparece no histórico | ☐ | |
| Shift+Enter cria quebra de linha | ☐ | |
| Input vazio não envia | ☐ | |
| Console mostra logs Sprint 43 | ☐ | |

**Resultado Final**: ☐ PASSOU / ☐ FALHOU

______________________________________________________________________

## 📋 TESTE 2: PROMPTS - CHAT CONVERSACIONAL - **PARCIAL**

### Objetivo:
Validar que follow-up funciona após execução de prompt

### Passos:

#### 1. Acessar página de Prompts
```
URL: http://localhost:3001/prompts
```

#### 2. Criar Prompt de Teste (se não existir)
```
Título: Teste Sprint 47 - Conversacional
Conteúdo: Olá! Como posso ajudar você hoje?
Categoria: Teste
```

#### 3. Executar Prompt
- Clicar em "Executar"
- Selecionar modelo (qualquer)
- Clicar "Iniciar Execução"
- **Aguardar streaming completar** (importante!)

**⚠️ NOTA**: LM Studio pode não estar rodando. Se der erro de conexão, é **esperado**. O importante é testar a interface.

#### 4. Após execução (ou erro), testar Follow-up

**Ação**:
```
1. Verificar se textarea de continuação aparece
2. Digitar: "Esta é uma mensagem de follow-up do Sprint 47"
3. Clicar "Enviar" ou pressionar Enter
```

**Resultado Esperado**:
- ✅ Mensagem de follow-up é enviada
- ✅ Aparece no histórico da conversa
- ✅ (Se LM Studio estiver rodando) Recebe resposta

**❌ Se não funcionar**:
- Verificar Console do navegador
- Anotar erro
- Capturar screenshot

______________________________________________________________________

### 📊 Critérios de Sucesso - Teste 2:

| Teste | Status | Observação |
|-------|--------|------------|
| Prompt executa (ou tenta) | ☐ | |
| Textarea de follow-up aparece | ☐ | |
| Mensagem de follow-up é enviada | ☐ | |
| Console não mostra erros | ☐ | |

**Resultado Final**: ☐ PASSOU / ☐ FALHOU

______________________________________________________________________

## 📋 TESTE 3: PROMPTS - FUNCIONALIDADES BÁSICAS

### Objetivo:
Validar criar, editar, duplicar, excluir, buscar, filtrar

### 3.1 Criar Prompt

**Ação**:
```
1. Clicar "Novo Prompt"
2. Preencher:
   Título: Teste CRUD Sprint 47
   Conteúdo: Conteúdo de teste
   Categoria: Teste
   Tags: sprint47, crud
3. Clicar "Criar"
```

**Resultado Esperado**:
- ✅ Prompt aparece na lista
- ✅ Modal fecha
- ✅ Sem erros no Console

______________________________________________________________________

### 3.2 Editar Prompt

**Ação**:
```
1. Localizar prompt "Teste CRUD Sprint 47"
2. Clicar botão "✏️ Editar"
3. Modificar título para: "Teste CRUD Sprint 47 - EDITADO"
4. Clicar "Salvar"
```

**Resultado Esperado**:
- ✅ Modal de edição abre
- ✅ Campos preenchidos com dados atuais
- ✅ Alteração é salva
- ✅ Lista atualiza com novo título

______________________________________________________________________

### 3.3 Buscar Prompt

**Ação**:
```
1. No campo de busca (se existir), digitar: "CRUD"
2. Pressionar Enter ou aguardar busca automática
```

**Resultado Esperado**:
- ✅ Apenas prompts com "CRUD" no título/conteúdo aparecem
- ✅ Busca funciona em tempo real

**Se campo de busca não existir**: ⏳ Marcar como "Funcionalidade Pendente"

______________________________________________________________________

### 3.4 Filtrar Prompts

**Ação**:
```
1. Verificar se há filtros: "Todos", "Meus Prompts", "Públicos"
2. Clicar em cada filtro
3. Verificar se lista atualiza
```

**Resultado Esperado**:
- ✅ Filtros funcionam
- ✅ Lista atualiza conforme filtro selecionado

**Se filtros não existirem**: ⏳ Marcar como "Funcionalidade Pendente"

______________________________________________________________________

### 3.5 Duplicar Prompt (se funcionalidade existir)

**Ação**:
```
1. Localizar prompt "Teste CRUD Sprint 47 - EDITADO"
2. Clicar botão de duplicar (se existir)
3. Verificar se cópia é criada
```

**Resultado Esperado**:
- ✅ Prompt duplicado aparece na lista
- ✅ Título contém indicação de cópia (ex: "(cópia)")

**Se funcionalidade não existir**: ⏳ Marcar como "Funcionalidade Pendente"

______________________________________________________________________

### 3.6 Excluir Prompt

**Ação**:
```
1. Localizar prompt de teste
2. Clicar botão "🗑️ Excluir"
3. Confirmar exclusão (se houver confirmação)
```

**Resultado Esperado**:
- ✅ Prompt é removido da lista
- ✅ Confirmação de exclusão (opcional)
- ✅ Sem erros no Console

______________________________________________________________________

### 📊 Critérios de Sucesso - Teste 3:

| Funcionalidade | Status | Observação |
|----------------|--------|------------|
| Criar prompt | ☐ | |
| Editar prompt | ☐ | |
| Excluir prompt | ☐ | |
| Buscar prompts | ☐ ou ⏳ | |
| Filtrar prompts | ☐ ou ⏳ | |
| Duplicar prompt | ☐ ou ⏳ | |

**Legenda**: ☐ = Testado, ⏳ = Funcionalidade não existe (pendente)

**Resultado Final**: ☐ PASSOU / ☐ FALHOU / ⏳ PARCIAL

______________________________________________________________________

## 📋 TESTE 4: MOBILE RESPONSIVO (SPRINT 44)

### Objetivo:
Verificar que layout mobile em Prompts está correto

### Passos:

#### 1. Redimensionar navegador
```
Opção A: Arrastar borda do navegador para < 640px largura
Opção B: Usar DevTools (F12) → Device Toolbar (CTRL+SHIFT+M)
         Selecionar dispositivo mobile (ex: iPhone 12)
```

#### 2. Acessar página de Prompts
```
URL: http://localhost:3001/prompts
```

#### 3. Verificar badges
- ✅ Badge "Público" não está cortado
- ✅ Texto legível
- ✅ Espaçamento adequado

#### 4. Verificar botões
- ✅ Botões "Editar" e "Excluir" estão empilhados verticalmente
- ✅ Cada botão ocupa largura total
- ✅ Botões têm altura mínima de 42px (fácil tocar)
- ✅ Texto centralizado

______________________________________________________________________

### 📊 Critérios de Sucesso - Teste 4:

| Teste | Status | Observação |
|-------|--------|------------|
| Badges visíveis e não cortados | ☐ | |
| Botões empilhados verticalmente | ☐ | |
| Botões largura total em mobile | ☐ | |
| Touch targets ≥ 42px | ☐ | |

**Resultado Final**: ☐ PASSOU / ☐ FALHOU

______________________________________________________________________

## 📊 RESUMO FINAL DOS TESTES

### Teste 1: Chat Dedicado (/chat)
**Prioridade**: 🔴 CRÍTICA  
**Status**: ☐ PASSOU / ☐ FALHOU  
**Observações**: _____________________________________

### Teste 2: Prompts - Chat Conversacional
**Prioridade**: 🟡 MÉDIA  
**Status**: ☐ PASSOU / ☐ FALHOU  
**Observações**: _____________________________________

### Teste 3: Prompts - CRUD
**Prioridade**: 🔵 BAIXA  
**Status**: ☐ PASSOU / ☐ FALHOU / ⏳ PARCIAL  
**Observações**: _____________________________________

### Teste 4: Mobile Responsivo
**Prioridade**: 🟡 MÉDIA  
**Status**: ☐ PASSOU / ☐ FALHOU  
**Observações**: _____________________________________

______________________________________________________________________

## 🐛 REPORTAR PROBLEMAS

### Se encontrar erro, incluir:

1. **Qual teste falhou**: (número e nome)
2. **O que esperava**: (comportamento esperado)
3. **O que aconteceu**: (comportamento atual)
4. **Screenshots**: (especialmente do Console)
5. **Mensagens de erro**: (copiar texto completo do Console)

### Exemplo de Relatório:
```
TESTE FALHOU: Teste 1.4 - Envio com Enter

ESPERADO: Mensagem enviada, campo limpo
ACONTECEU: Nada acontece ao pressionar Enter

CONSOLE:
❌ [SPRINT 43] WebSocket ref is null

SCREENSHOT: [anexar]
```

______________________________________________________________________

## ✅ PRÓXIMOS PASSOS

### Se TODOS os testes passarem:
1. ✅ Marcar Sprint 47 como **COMPLETO**
2. ✅ Informar que sistema está **100% funcional**
3. ✅ Aguardar próximas instruções

### Se algum teste FALHAR:
1. ❌ Reportar problema com detalhes
2. 🔄 Equipe técnica investigará
3. 🔧 Correção será aplicada
4. 🔄 Repetir testes

______________________________________________________________________

**Documento criado**: 2025-11-16 ~07:40  
**Sprint**: 47  
**Status do Sistema**: ✅ PRONTO PARA TESTES  
**PM2**: ✅ Restartado (PID 849427, uptime < 10min)  
**Build**: ✅ Atualizado (Nov 16 02:22)  
**Backend**: ✅ Sprint 45 ativo  
**Frontend**: ✅ Sprint 43 ativo (após PM2 restart)

