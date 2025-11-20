# INSTRUÇÕES DE TESTE - SPRINT 49
## Sistema Orquestrador de IA v3.7.0 (Em Progresso)

**Data:** 16 de Novembro de 2025  
**Build:** Sprint 49 - Correções Críticas  
**Status:** 3 de 5 problemas P0 corrigidos (60%)

---

## ⚠️ AÇÃO OBRIGATÓRIA ANTES DOS TESTES

### HARD REFRESH OBRIGATÓRIO
**CRÍTICO:** Antes de testar, você DEVE fazer um hard refresh no navegador para limpar o cache:

- **Windows/Linux:** Pressione `Ctrl + Shift + R`
- **Mac:** Pressione `Cmd + Shift + R`
- **Alternativa:** Abra uma aba anônima/privada no navegador

**Por quê?** O navegador pode estar usando código JavaScript antigo armazenado em cache. O hard refresh garante que você está testando o código mais recente (Sprint 49).

---

## ✅ O QUE FOI CORRIGIDO (TESTE ESTAS FUNCIONALIDADES)

### 1. CRIAÇÃO DE PROVIDERS ✅ CORRIGIDO (P0-1)

#### Como Testar
1. Acesse a página **Provedores** (Providers)
2. Clique em **"Adicionar"** ou **"+ Novo Provider"**
3. Preencha o formulário:
   - **Nome:** "Teste Sprint 49 - OpenAI"
   - **Tipo:** Selecione "api" (não "local")
   - **API Key:** "sk-test-123456789" (pode ser valor fictício para teste)
   - **URL Base:** "https://api.openai.com/v1"
4. Clique em **"Criar"**

#### Resultado Esperado
- ✅ Provider criado com sucesso
- ✅ Aparece na lista de providers
- ✅ Nenhum erro "No 'mutation' procedure on path 'providers.create'"
- ✅ Toast/notificação de sucesso aparece

#### Se Falhar
- ❌ **Erro ainda aparece?** Reporte: "P0-1 falhou - erro ao criar provider"
- ❌ **Erro 400?** Reporte: "P0-1 falhou - Error 400 ao criar provider"

---

### 2. CRIAÇÃO DE PROMPTS ✅ CORRIGIDO (P0-2)

#### Como Testar
1. Acesse a página **Prompts**
2. Clique em **"Novo Prompt"**
3. Preencha o formulário:
   - **Título:** "Teste Sprint 49 - Análise Completa"
   - **Conteúdo:** "Analise o seguinte texto e forneça um resumo. Texto: {{texto}}"
   - **Categoria:** "Análise, Teste, Validação"
   - **Tags:** "sprint-49, teste-usuario, validacao"
   - **Tornar público:** Marque o checkbox
4. Clique em **"Criar"**

#### Resultado Esperado
- ✅ Prompt criado com sucesso
- ✅ Aparece na lista de prompts
- ✅ Nenhum erro 400 (Bad Request)
- ✅ Toast/notificação de sucesso aparece
- ✅ Categoria e tags salvos corretamente

#### Se Falhar
- ❌ **Error 400?** Reporte: "P0-2 falhou - Error 400 persiste ao criar prompt"
- ❌ **Campos não salvam?** Reporte: "P0-2 falhou - categoria/tags não salvam"

---

### 3. CHAT PRINCIPAL ✅ MELHORADO (P0-3 - Cache-Busting)

#### Como Testar
1. **IMPORTANTE:** Faça hard refresh ANTES deste teste (Ctrl+Shift+R)
2. Acesse a página **Chat**
3. Digite uma mensagem no campo de texto: "Teste Sprint 49 - Chat funcionando!"
4. Pressione **Enter** OU clique no botão **"Enviar"**

#### Resultado Esperado
- ✅ Mensagem é enviada
- ✅ Aparece no histórico de chat
- ✅ Resposta da IA é recebida
- ✅ WebSocket conectado (indicador "Online" verde)
- ✅ Logs no console do navegador:
  ```
  🚀 [SPRINT 43 DEBUG] handleSend called
  ```

#### Se Falhar
- ❌ **Mensagem não envia?**
  1. Abra o **Console do navegador** (F12 → aba Console)
  2. Procure por logs que começam com `🚀 [SPRINT`
  3. Se NÃO aparecerem logs Sprint 43, reporte: "P0-3 falhou - hard refresh não foi suficiente"
  4. Tire screenshot do console e envie
- ❌ **WebSocket não conecta?** Reporte: "P0-3 falhou - WebSocket offline"

---

## ⏳ O QUE AINDA NÃO FOI CORRIGIDO (NÃO ESPERAMOS QUE FUNCIONE)

### 4. CHAT FOLLOW-UP ⏳ PENDENTE (P0-4)

#### Status
**NÃO CORRIGIDO AINDA.** Este problema está identificado mas a correção ainda não foi implementada.

#### Como Testar (para confirmar o problema)
1. Acesse **Prompts**
2. Clique em **"Executar"** em qualquer prompt
3. Aguarde a resposta da IA aparecer
4. No campo **"Continue a conversa..."** que aparece após a resposta
5. Digite: "Resuma em 3 pontos"
6. Pressione **Enter** ou clique em **"Enviar"**

#### Resultado Esperado
- ❌ Mensagem provavelmente **NÃO** será enviada (problema conhecido)

#### O Que Reportar
- Se **FUNCIONAR** (inesperadamente): "P0-4 funcionou sem correção!"
- Se **NÃO FUNCIONAR**: "P0-4 confirmado - follow-up não envia" (esperado)
- Abra o console (F12) e verifique se aparecem logs `🚀 [SPRINT 48 DEBUG]`
- Envie screenshot do console

---

### 5. ROTAS PORTUGUÊS/INGLÊS ⏳ PENDENTE (P0-5)

#### Status
**NÃO CORRIGIDO AINDA.** Este problema está identificado mas a correção ainda não foi implementada.

#### Como Testar (para confirmar o problema)
1. Tente acessar as seguintes URLs diretamente:
   - `/modelos` (português)
   - `/provedores` (português)
   - `/configuracoes` (português)

2. Compare com as URLs em inglês:
   - `/models` (inglês)
   - `/providers` (inglês)
   - `/settings` (inglês)

#### Resultado Esperado
- ❌ URLs em português provavelmente mostrarão **página em branco** (problema conhecido)
- ✅ URLs em inglês devem funcionar

#### O Que Reportar
- Se URLs em português **FUNCIONAREM**: "P0-5 funcionou sem correção!"
- Se URLs em português **NÃO FUNCIONAREM**: "P0-5 confirmado - páginas em branco" (esperado)
- Teste TODOS os itens do menu lateral (28 itens) e reporte quais mostram página em branco

---

## 📊 CHECKLIST DE TESTES

Use este checklist para organizar seus testes:

### Testes Obrigatórios (Correções Implementadas)
- [ ] Hard refresh feito (Ctrl+Shift+R)
- [ ] P0-1: Criar provider (OpenAI fictício)
- [ ] P0-1: Verificar que provider aparece na lista
- [ ] P0-2: Criar prompt com variáveis
- [ ] P0-2: Verificar que prompt aparece na lista
- [ ] P0-3: Enviar mensagem no chat principal
- [ ] P0-3: Verificar que mensagem aparece no histórico
- [ ] P0-3: Verificar logs no console (Sprint 43)

### Testes Opcionais (Problemas Conhecidos)
- [ ] P0-4: Tentar follow-up após execução de prompt (esperado falhar)
- [ ] P0-4: Verificar logs no console (Sprint 48)
- [ ] P0-5: Testar URLs em português (esperado falhar)
- [ ] P0-5: Confirmar que URLs em inglês funcionam

### Outros Testes (Se Tiver Tempo)
- [ ] Executar prompt existente (streaming deve funcionar)
- [ ] Visualizar modelos (/models)
- [ ] Dashboard exibe métricas corretamente
- [ ] Navegação geral do sistema

---

## 📝 COMO REPORTAR PROBLEMAS

### Formato do Reporte
Para cada teste, reporte no seguinte formato:

```
TESTE: [Nome do teste, ex: P0-1 Criar Provider]
RESULTADO: [✅ Sucesso / ❌ Falha]
DETALHES: [Descrição do que aconteceu]
CONSOLE: [Cole logs do console, se houver]
SCREENSHOT: [Anexe screenshot se relevante]
```

### Exemplo de Reporte Bom
```
TESTE: P0-1 Criar Provider
RESULTADO: ✅ Sucesso
DETALHES: Provider "Teste Sprint 49 - OpenAI" criado com sucesso.
         Apareceu na lista imediatamente. Toast verde de sucesso.
CONSOLE: Nenhum erro no console.
```

### Exemplo de Reporte Problema
```
TESTE: P0-3 Chat Principal
RESULTADO: ❌ Falha
DETALHES: Mensagem não foi enviada ao pressionar Enter.
         Campo permaneceu preenchido. Nenhuma mensagem no histórico.
CONSOLE: Não apareceram logs "🚀 [SPRINT 43 DEBUG]"
         Aparece apenas: "Manus helper initialized"
SCREENSHOT: [anexar print do console]
```

---

## 🔧 TROUBLESHOOTING

### Problema: "Código antigo ainda está carregado"
**Solução:**
1. Ctrl+Shift+R (hard refresh)
2. Se não funcionar, abra aba anônima
3. Se ainda não funcionar, limpe todo o cache:
   - Chrome: Configurações → Privacidade → Limpar dados de navegação
   - Firefox: Configurações → Privacidade → Limpar dados
4. Selecione "Imagens e arquivos em cache" e confirme

### Problema: "Console não mostra logs Sprint 43/48"
**Diagnóstico:**
1. Abra DevTools (F12)
2. Vá para aba "Network"
3. Recarregue a página
4. Procure por arquivos `.js` na lista
5. Verifique se os nomes têm hash (ex: `index-BFQlsuuQ.js`)
6. Se os hashes mudaram, o código novo está carregado
7. Se os hashes são os mesmos de antes, hard refresh não funcionou

### Problema: "Tudo está em branco"
**Solução:**
1. Verifique o console (F12)
2. Procure por erros em vermelho
3. Reporte TODOS os erros que aparecerem
4. Tente acessar /models em vez de /modelos

---

## 🎯 FOCO DOS TESTES

### PRIORIDADE ALTA (Teste Obrigatoriamente)
1. **P0-1:** Criar provider (deve funcionar)
2. **P0-2:** Criar prompt (deve funcionar)
3. **P0-3:** Chat principal (deve funcionar após hard refresh)

### PRIORIDADE MÉDIA (Teste se Possível)
1. **P0-4:** Follow-up chat (esperado falhar)
2. **P0-5:** Rotas português/inglês (esperado falhar)

### PRIORIDADE BAIXA (Se Tiver Tempo Extra)
1. Executar prompts (deve funcionar)
2. Navegação geral
3. Dashboard e métricas

---

## ⏰ TEMPO ESTIMADO

- **Testes obrigatórios:** 15-20 minutos
- **Testes opcionais:** 10 minutos
- **Reporte detalhado:** 5-10 minutos
- **TOTAL:** 30-40 minutos

---

## 📧 ONDE ENVIAR RELATÓRIO

Envie o relatório de testes com:
1. Checklist preenchido
2. Reportes detalhados de cada teste
3. Screenshots do console (especialmente para P0-3)
4. Sua experiência geral (melhorou? piorou? igual?)

---

## ✅ RESUMO RÁPIDO (TL;DR)

1. **Faça hard refresh:** Ctrl+Shift+R (OBRIGATÓRIO)
2. **Teste criar provider:** Deve funcionar ✅
3. **Teste criar prompt:** Deve funcionar ✅
4. **Teste chat principal:** Deve funcionar após hard refresh ✅
5. **Follow-up:** Ainda não funciona ⏳ (esperado)
6. **Rotas português:** Ainda não funcionam ⏳ (esperado)
7. **Reporte tudo:** Sucessos E falhas

---

**Obrigado por testar! Seus testes são CRÍTICOS para validar as correções da Sprint 49.**

---

*Instruções geradas em 16 de Novembro de 2025*  
*Sprint 49 - Correção de Problemas Críticos (60% completo)*
