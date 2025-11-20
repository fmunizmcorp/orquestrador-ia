# SPRINT 49 - PDCA MASTER PLAN
## Correção Completa de Todos os Problemas Identificados nos Testes

**Data de Início:** 16 de Novembro de 2025  
**Build Anterior:** Sprint 48 (16/Nov/2025 13:37)  
**Versão Anterior:** v3.6.0  
**Versão Alvo:** v3.7.0 (correções críticas)  
**Testadores:** Manus AI (Simulando Usuário Final)  
**Metodologia:** SCRUM + PDCA (Plan-Do-Check-Act)

---

## 📊 RESUMO EXECUTIVO

### Status Atual do Sistema
- **Nota Geral:** 3/10 (Crítico - Não pronto para produção)
- **Problemas P0 (Bloqueadores):** 5 identificados
- **Problemas P1 (Críticos):** 3 identificados
- **Problemas P2 (Importantes):** 2 identificados
- **Total de Problemas:** 10 problemas que impedem uso em produção

### O Que Funciona Bem (Manter)
- ✅ Dashboard: Todas as métricas, widgets e visualizações funcionam perfeitamente
- ✅ Execução de Prompts: Streaming em tempo real EXCELENTE (10/10)
- ✅ Visualização de Modelos: Interface completa e funcional
- ✅ Performance: Sistema rápido e responsivo
- ✅ Design: Interface profissional e limpa

### O Que NÃO Funciona (Corrigir Agora)
- ❌ Chat Principal: Não envia mensagens (problema de cache)
- ❌ Criação de Prompts: Erro 400 no backend
- ❌ Criação de Providers: Procedure não existe no backend
- ❌ Chat Follow-up: Interface quebrada após execução de prompt
- ❌ Rotas Português/Inglês: Páginas em branco com URLs em português

---

## 🎯 OBJETIVOS DA SPRINT 49

### Objetivo Principal
**Corrigir TODOS os problemas identificados nos relatórios de teste para tornar o sistema pronto para produção.**

### Objetivos Específicos
1. ✅ **P0 (Bloqueadores):** Corrigir todas as 5 funcionalidades críticas quebradas
2. ✅ **P1 (Críticos):** Implementar versionamento semântico e corrigir inconsistências
3. ✅ **P2 (Importantes):** Melhorar experiência do usuário
4. ✅ **Deploy Completo:** Build, teste, commit, PR, deploy no servidor
5. ✅ **Documentação:** Instruções completas para usuário final testar

### Critérios de Sucesso
- [ ] Todos os 5 problemas P0 corrigidos
- [ ] Sistema versionado corretamente (v3.7.0)
- [ ] Build executado e PM2 restartado
- [ ] Testes automatizados passando
- [ ] Código commitado e PR criada
- [ ] Instruções de teste para usuário final prontas
- [ ] Nota do sistema: 8/10 ou superior

---

## 🔥 PROBLEMAS PRIORIZADOS (PDCA por Problema)

---

### P0-1: PROVIDERS.CREATE - PROCEDURE NÃO EXISTE (BLOQUEADOR)

#### 📋 PLAN (Planejar)
**Problema:** Backend retorna erro "No 'mutation' procedure on path 'providers.create'"  
**Impacto:** Impossível adicionar novos provedores de IA (OpenAI, Anthropic, etc.)  
**Severidade:** CRÍTICA - Sistema inutilizável para novos usuários  
**Causa Raiz:** Procedure `providers.create` não foi implementada no backend tRPC

**Diagnóstico:**
1. Verificar arquivo `server/trpc/routers/providers.ts`
2. Confirmar se mutation `create` existe
3. Se não existir, implementar baseado em padrões existentes
4. Validar schema de entrada (name, type, apiKey, baseURL)

**Solução Planejada:**
1. Abrir arquivo `server/trpc/routers/providers.ts`
2. Implementar mutation `create` com validação Zod
3. Adicionar inserção no banco de dados usando Drizzle ORM
4. Testar criação de provider via tRPC

#### ✅ DO (Fazer)
- [ ] Ler arquivo `server/trpc/routers/providers.ts`
- [ ] Implementar mutation `create` com schema Zod
- [ ] Validar campos obrigatórios (name, type, apiKey, baseURL)
- [ ] Inserir provider no banco usando Drizzle ORM
- [ ] Retornar provider criado com ID

#### ✅ CHECK (Verificar)
- [ ] Build executado sem erros TypeScript
- [ ] PM2 restartado com sucesso
- [ ] Teste manual: criar provider via interface
- [ ] Verificar que provider aparece na lista
- [ ] Confirmar que erro "No mutation procedure" não aparece mais

#### ✅ ACT (Agir/Documentar)
- [ ] Commit: "fix(providers): implement providers.create mutation (Sprint 49 P0-1)"
- [ ] Documentar no relatório Sprint 49
- [ ] Adicionar ao changelog v3.7.0

---

### P0-2: PROMPTS.CREATE - ERRO 400 (BLOQUEADOR)

#### 📋 PLAN (Planejar)
**Problema:** Criação de prompts retorna Error 400 (Bad Request)  
**Impacto:** Usuários não conseguem salvar novos prompts  
**Severidade:** CRÍTICA - Funcionalidade essencial quebrada  
**Causa Raiz Possível:** Validação no backend rejeitando formato dos dados

**Diagnóstico:**
1. Verificar arquivo `server/trpc/routers/prompts.ts`
2. Analisar mutation `create` e schema de validação
3. Verificar se campos (title, content, category, tags, isPublic) estão corretos
4. Testar formato de variáveis `{{var}}` no conteúdo
5. Verificar logs do backend para erro específico

**Solução Planejada:**
1. Abrir arquivo `server/trpc/routers/prompts.ts`
2. Revisar schema Zod da mutation `create`
3. Corrigir validação ou formato esperado
4. Adicionar logs para debug se necessário
5. Testar criação de prompt com variáveis

#### ✅ DO (Fazer)
- [ ] Ler arquivo `server/trpc/routers/prompts.ts`
- [ ] Analisar schema de validação Zod
- [ ] Identificar campo ou formato que está causando erro 400
- [ ] Corrigir validação ou ajustar formato esperado
- [ ] Adicionar tratamento de erro mais informativo

#### ✅ CHECK (Verificar)
- [ ] Build executado sem erros
- [ ] PM2 restartado
- [ ] Teste manual: criar prompt via interface
- [ ] Verificar que prompt é salvo com sucesso
- [ ] Confirmar que erro 400 não aparece mais
- [ ] Testar prompt com variáveis `{{texto}}`

#### ✅ ACT (Agir/Documentar)
- [ ] Commit: "fix(prompts): fix Error 400 in prompts.create validation (Sprint 49 P0-2)"
- [ ] Documentar causa raiz no relatório Sprint 49
- [ ] Adicionar ao changelog v3.7.0

---

### P0-3: CHAT PRINCIPAL - NÃO FUNCIONA (CACHE) (BLOQUEADOR)

#### 📋 PLAN (Planejar)
**Problema:** Chat não envia mensagens (nem Enter nem botão "Enviar")  
**Impacto:** Funcionalidade central da plataforma está inoperante  
**Severidade:** CRÍTICA - Sistema não funcional  
**Causa Raiz:** Build da Sprint 48 não está sendo carregado pelo navegador (cache)

**Diagnóstico:**
1. Verificar que código Sprint 43/48 está correto em `client/src/pages/Chat.tsx`
2. Confirmar que build foi executado e está em `dist/client/`
3. Problema: Browser cache ainda carrega JavaScript antigo
4. Solução: Implementar cache-busting (hash no nome dos arquivos JS/CSS)

**Solução Planejada:**
1. Configurar Vite para adicionar hash nos nomes de arquivos
2. Configurar headers HTTP para controlar cache
3. Forçar rebuild completo
4. PM2 restart
5. Testar em aba anônima (sem cache)

#### ✅ DO (Fazer)
- [ ] Verificar `vite.config.ts` - confirmar que hash está ativado
- [ ] Configurar `build.rollupOptions.output.entryFileNames` com hash
- [ ] Adicionar headers de cache-control no servidor Express
- [ ] Executar `npm run build` completo
- [ ] PM2 restart
- [ ] Verificar que arquivos em dist/ tem hash no nome

#### ✅ CHECK (Verificar)
- [ ] Arquivos em `dist/client/assets/` tem hash no nome (ex: `index-abc123.js`)
- [ ] Browser carrega arquivos com hash novo
- [ ] Abrir aba anônima e testar Chat
- [ ] Logs Sprint 43 aparecem no console
- [ ] WebSocket conectado (readyState = 1)
- [ ] Mensagem é enviada com sucesso

#### ✅ ACT (Agir/Documentar)
- [ ] Commit: "fix(chat): implement cache-busting to fix browser cache issue (Sprint 49 P0-3)"
- [ ] Documentar problema de cache no relatório Sprint 49
- [ ] Adicionar ao changelog v3.7.0
- [ ] Atualizar workflow V2 com nota sobre cache-busting

---

### P0-4: CHAT FOLLOW-UP - NÃO FUNCIONA (BLOQUEADOR)

#### 📋 PLAN (Planejar)
**Problema:** Chat conversacional após execução de prompt não funciona  
**Impacto:** Usuários não conseguem continuar conversa após resposta de IA  
**Severidade:** CRÍTICA - Experiência do usuário quebrada  
**Causa Raiz:** Interface existe mas botão "Enviar" não está conectado à função

**Diagnóstico:**
1. Verificar arquivo `client/src/components/StreamingPromptExecutor.tsx`
2. Confirmar que função `handleSendFollowUp` existe (Sprint 48)
3. Verificar se botão "Enviar" está chamando a função correta
4. Verificar event listener do Enter
5. Analisar logs Sprint 48 se existirem

**Solução Planejada:**
1. Abrir arquivo `StreamingPromptExecutor.tsx`
2. Verificar binding do botão "Enviar" com `handleSendFollowUp`
3. Verificar event listener `onKeyDown` do textarea
4. Corrigir binding se estiver quebrado
5. Testar follow-up após execução de prompt

#### ✅ DO (Fazer)
- [ ] Ler arquivo `client/src/components/StreamingPromptExecutor.tsx`
- [ ] Localizar botão "Enviar" do follow-up
- [ ] Verificar `onClick={handleSendFollowUp}`
- [ ] Localizar textarea do follow-up
- [ ] Verificar `onKeyDown` para Enter
- [ ] Corrigir binding se necessário
- [ ] Verificar WebSocket para follow-up

#### ✅ CHECK (Verificar)
- [ ] Build executado
- [ ] PM2 restartado
- [ ] Executar prompt e aguardar resposta
- [ ] Digitar mensagem no campo follow-up
- [ ] Pressionar Enter ou clicar "Enviar"
- [ ] Verificar que logs Sprint 48 aparecem
- [ ] Confirmar que segunda resposta é gerada

#### ✅ ACT (Agir/Documentar)
- [ ] Commit: "fix(prompts): fix follow-up chat button binding (Sprint 49 P0-4)"
- [ ] Documentar no relatório Sprint 49
- [ ] Adicionar ao changelog v3.7.0

---

### P0-5: ROTAS PORTUGUÊS/INGLÊS - PÁGINAS EM BRANCO (BLOQUEADOR)

#### 📋 PLAN (Planejar)
**Problema:** URLs em português (/modelos, /provedores) retornam páginas em branco  
**Impacto:** Menu aponta para URLs quebradas, usuários veem tela preta  
**Severidade:** CRÍTICA - Múltiplas páginas inacessíveis  
**Causa Raiz:** Rotas em inglês funcionam (/models, /providers) mas português não

**Diagnóstico:**
1. Verificar arquivo de rotas Vue Router (provavelmente `client/src/router/index.ts`)
2. Confirmar que rotas em inglês estão registradas
3. Verificar se rotas em português existem ou precisam ser criadas
4. Decisão: Padronizar em inglês OU adicionar aliases em português
5. Atualizar menu para usar rotas corretas

**Solução Planejada:**
1. Decidir estratégia: INGLÊS como padrão (mais comum em sistemas)
2. Verificar rotas existentes em `client/src/router/index.ts`
3. Atualizar menu lateral para usar rotas em inglês
4. OU adicionar aliases de rotas em português se preferível
5. Testar todas as 28 páginas do menu

#### ✅ DO (Fazer)
- [ ] Ler arquivo `client/src/router/index.ts`
- [ ] Listar todas as rotas registradas
- [ ] Identificar rotas que faltam em português
- [ ] DECISÃO: Usar rotas em inglês (padrão internacional)
- [ ] Localizar menu lateral (provavelmente `client/src/components/Sidebar.tsx`)
- [ ] Atualizar links do menu para inglês (/models, /providers, etc.)
- [ ] Verificar consistência em todas as 28 páginas

#### ✅ CHECK (Verificar)
- [ ] Build executado
- [ ] PM2 restartado
- [ ] Clicar em cada item do menu (28 itens)
- [ ] Confirmar que nenhuma página em branco aparece
- [ ] Testar URLs diretas: /models, /providers, /settings
- [ ] Confirmar que URLs antigas redirecionam ou funcionam

#### ✅ ACT (Agir/Documentar)
- [ ] Commit: "fix(routes): standardize routes to English to fix blank pages (Sprint 49 P0-5)"
- [ ] Documentar decisão de usar inglês no relatório Sprint 49
- [ ] Adicionar ao changelog v3.7.0
- [ ] Atualizar documentação de rotas

---

### P1-1: VERSIONAMENTO SEMÂNTICO - IMPLEMENTAR (CRÍTICO)

#### 📋 PLAN (Planejar)
**Problema:** Sistema não tem versionamento semântico de 3 partes  
**Impacto:** Usuários não sabem qual versão está rodando  
**Severidade:** ALTA - Requisito explícito do usuário  
**Objetivo:** Implementar modelo de 3 partes (v3.7.0) e exibir na UI

**Diagnóstico:**
1. Definir versão atual: v3.7.0 (correções críticas da v3.6.0)
2. Escolher local para armazenar versão: `package.json` (padrão)
3. Criar componente para exibir versão na UI
4. Decidir onde exibir: Footer, Sidebar, Settings page

**Solução Planejada:**
1. Atualizar `package.json` version para "3.7.0"
2. Criar arquivo `client/src/utils/version.ts` para ler versão
3. Criar componente `client/src/components/Version.tsx`
4. Adicionar componente no Footer ou Sidebar
5. Exibir formato: "Orquestrador v3.7.0"

#### ✅ DO (Fazer)
- [ ] Atualizar `package.json` version: "3.7.0"
- [ ] Criar `client/src/utils/version.ts` com lógica de leitura
- [ ] Criar componente `client/src/components/Version.tsx`
- [ ] Adicionar componente no Sidebar (canto inferior)
- [ ] Estilizar versão (texto pequeno, discreto)
- [ ] Testar que versão aparece corretamente

#### ✅ CHECK (Verificar)
- [ ] Build executado
- [ ] PM2 restartado
- [ ] Abrir qualquer página do sistema
- [ ] Verificar que versão "v3.7.0" está visível
- [ ] Confirmar que versão é lida dinamicamente de package.json
- [ ] Testar que mudança de versão reflete automaticamente

#### ✅ ACT (Agir/Documentar)
- [ ] Commit: "feat(version): implement semantic versioning display (Sprint 49 P1-1)"
- [ ] Documentar sistema de versionamento no relatório Sprint 49
- [ ] Adicionar ao changelog v3.7.0

---

### P1-2: PROVIDER COUNT - INCONSISTÊNCIA (CRÍTICO)

#### 📋 PLAN (Planejar)
**Problema:** Página Models mostra "1 Provider" mas lista de Providers está vazia  
**Impacto:** Dados inconsistentes confundem usuário  
**Severidade:** MÉDIA - Não bloqueia funcionalidades mas reduz confiança  
**Causa Raiz:** Dessincronia entre contagem e lista real

**Diagnóstico:**
1. Verificar query que conta providers na página Models
2. Verificar query que lista providers na página Providers
3. Confirmar se provider existe mas não está sendo listado
4. Investigar se provider está em tabela/coleção diferente

**Solução Planejada:**
1. Abrir `server/trpc/routers/providers.ts`
2. Verificar queries `list` e `getStats`
3. Garantir que ambas consultam mesma fonte
4. Corrigir query que está retornando dados errados
5. Sincronizar contagem com lista real

#### ✅ DO (Fazer)
- [ ] Ler arquivo `server/trpc/routers/providers.ts`
- [ ] Analisar query `list` (retorna lista de providers)
- [ ] Analisar query `getStats` ou similar (conta providers)
- [ ] Verificar SQL/Drizzle ORM para ambas queries
- [ ] Corrigir query que está errada
- [ ] Adicionar validação para evitar dessincronia futura

#### ✅ CHECK (Verificar)
- [ ] Build executado
- [ ] PM2 restartado
- [ ] Abrir página Models - verificar contagem de Providers
- [ ] Abrir página Providers - verificar lista
- [ ] Confirmar que números são consistentes
- [ ] Criar novo provider e verificar que ambas atualizam

#### ✅ ACT (Agir/Documentar)
- [ ] Commit: "fix(providers): fix provider count inconsistency (Sprint 49 P1-2)"
- [ ] Documentar no relatório Sprint 49
- [ ] Adicionar ao changelog v3.7.0

---

### P2-1: VALIDAÇÃO DE VARIÁVEIS EM PROMPTS (IMPORTANTE)

#### 📋 PLAN (Planejar)
**Problema:** Prompts com variáveis `{{var}}` são executados sem preencher variáveis  
**Impacto:** Usuário não sabe que precisa preencher variáveis, resultado é incorreto  
**Severidade:** MÉDIA - Melhoria de UX importante  
**Objetivo:** Adicionar modal para preencher variáveis antes de executar

**Diagnóstico:**
1. Identificar variáveis no conteúdo do prompt usando regex
2. Exibir modal intermediário solicitando valores
3. Substituir variáveis antes de enviar para IA

**Solução Planejada:**
1. Criar função para extrair variáveis: `/\{\{(\w+)\}\}/g`
2. Modificar modal de execução para detectar variáveis
3. Se variáveis existirem, mostrar campos de input
4. Substituir variáveis no prompt antes de executar
5. Se não houver variáveis, executar direto

#### ✅ DO (Fazer)
- [ ] Abrir `client/src/components/StreamingPromptExecutor.tsx` ou similar
- [ ] Criar função `extractVariables(content: string): string[]`
- [ ] Adicionar estado para armazenar valores de variáveis
- [ ] Modificar modal para exibir campos de input se variáveis existirem
- [ ] Implementar substituição de variáveis antes de executar
- [ ] Testar com prompt que tem variáveis

#### ✅ CHECK (Verificar)
- [ ] Build executado
- [ ] PM2 restartado
- [ ] Criar prompt com variáveis: "Analise {{texto}} e forneça {{tipo_analise}}"
- [ ] Clicar em "Executar"
- [ ] Verificar que modal solicita preenchimento de variáveis
- [ ] Preencher variáveis
- [ ] Confirmar que prompt substituído é enviado corretamente

#### ✅ ACT (Agir/Documentar)
- [ ] Commit: "feat(prompts): add variable validation and input modal (Sprint 49 P2-1)"
- [ ] Documentar no relatório Sprint 49
- [ ] Adicionar ao changelog v3.7.0

---

## 📋 WORKFLOW DE EXECUÇÃO DA SPRINT 49

### Fase 1: Diagnóstico e Preparação (20 min)
1. ✅ Ler ambos os relatórios de teste (COMPLETO)
2. ✅ Criar plano PDCA para cada problema (COMPLETO)
3. [ ] Verificar estrutura do projeto
4. [ ] Confirmar que Git está sincronizado
5. [ ] Criar branch `genspark_ai_developer` (se não existir)

### Fase 2: Correções P0 (Bloqueadores) (120 min)
#### P0-1: Providers.create (30 min)
1. [ ] Ler `server/trpc/routers/providers.ts`
2. [ ] Implementar mutation `create`
3. [ ] Build + PM2 restart
4. [ ] Testar criação de provider
5. [ ] Commit: "fix(providers): implement providers.create mutation"

#### P0-2: Prompts Error 400 (30 min)
1. [ ] Ler `server/trpc/routers/prompts.ts`
2. [ ] Corrigir validação Zod
3. [ ] Build + PM2 restart
4. [ ] Testar criação de prompt
5. [ ] Commit: "fix(prompts): fix Error 400 in prompts.create"

#### P0-3: Chat Cache-busting (20 min)
1. [ ] Configurar `vite.config.ts` para hash
2. [ ] Adicionar cache headers
3. [ ] Build + PM2 restart
4. [ ] Testar em aba anônima
5. [ ] Commit: "fix(chat): implement cache-busting"

#### P0-4: Follow-up Chat (20 min)
1. [ ] Ler `StreamingPromptExecutor.tsx`
2. [ ] Corrigir binding do botão
3. [ ] Build + PM2 restart
4. [ ] Testar follow-up
5. [ ] Commit: "fix(prompts): fix follow-up chat binding"

#### P0-5: Rotas Português/Inglês (20 min)
1. [ ] Ler `client/src/router/index.ts`
2. [ ] Atualizar menu para rotas em inglês
3. [ ] Build + PM2 restart
4. [ ] Testar todas as páginas
5. [ ] Commit: "fix(routes): standardize routes to English"

### Fase 3: Correções P1 (Críticas) (60 min)
#### P1-1: Versionamento (30 min)
1. [ ] Atualizar `package.json` para v3.7.0
2. [ ] Criar componente Version
3. [ ] Adicionar no Sidebar
4. [ ] Build + PM2 restart
5. [ ] Commit: "feat(version): implement semantic versioning display"

#### P1-2: Provider Count (30 min)
1. [ ] Ler `server/trpc/routers/providers.ts`
2. [ ] Corrigir queries inconsistentes
3. [ ] Build + PM2 restart
4. [ ] Testar contagem
5. [ ] Commit: "fix(providers): fix provider count inconsistency"

### Fase 4: Correções P2 (Importantes) (40 min)
#### P2-1: Validação de Variáveis (40 min)
1. [ ] Implementar extração de variáveis
2. [ ] Criar modal de input
3. [ ] Build + PM2 restart
4. [ ] Testar com variáveis
5. [ ] Commit: "feat(prompts): add variable validation modal"

### Fase 5: Deploy Final (30 min)
1. [ ] Fetch latest remote: `git fetch origin main`
2. [ ] Rebase local commits: `git rebase origin/main`
3. [ ] Resolver conflitos (se houver) priorizando código remoto
4. [ ] Squash todos os commits: `git reset --soft HEAD~N && git commit -m "Sprint 49 complete"`
5. [ ] Push force: `git push -f origin genspark_ai_developer`
6. [ ] Criar Pull Request
7. [ ] Incluir relatório Sprint 49 no PR
8. [ ] COMPARTILHAR LINK DO PR COM USUÁRIO

### Fase 6: Documentação Final (30 min)
1. [ ] Criar `SPRINT_49_RELATORIO_FINAL.md`
2. [ ] Documentar todas as correções
3. [ ] Criar `INSTRUCOES_TESTE_USUARIO_SPRINT_49.md`
4. [ ] Commit documentação
5. [ ] Atualizar CHANGELOG.md com v3.7.0

---

## ✅ CRITÉRIOS DE CONCLUSÃO DA SPRINT 49

### Técnicos
- [ ] Todos os 5 problemas P0 corrigidos e testados
- [ ] Build executado sem erros: `npm run build`
- [ ] PM2 restartado: `pm2 restart orquestrador-v3`
- [ ] PM2 uptime < 5 minutos (confirma restart)
- [ ] Testes automatizados (se houver) passando
- [ ] Versão atualizada para v3.7.0 em package.json

### Git/GitHub
- [ ] Todos os commits feitos com mensagens descritivas
- [ ] Commits squashed em um único commit
- [ ] Branch `genspark_ai_developer` atualizada
- [ ] Pull Request criada com relatório completo
- [ ] Link do PR compartilhado com usuário

### Funcionalidade
- [ ] Chat Principal envia mensagens (testado em aba anônima)
- [ ] Prompts podem ser criados sem Error 400
- [ ] Providers podem ser criados sem erro de procedure
- [ ] Follow-up chat funciona após execução
- [ ] Todas as páginas acessíveis (sem páginas em branco)
- [ ] Versão v3.7.0 visível na interface

### Documentação
- [ ] Relatório Sprint 49 completo
- [ ] Instruções de teste para usuário final
- [ ] Changelog atualizado com v3.7.0
- [ ] Workflow V2 atualizado se necessário

### Qualidade
- [ ] Nota do sistema: 8/10 ou superior (alvo)
- [ ] Zero problemas P0 restantes
- [ ] Sistema pronto para testes de usuário final
- [ ] Usuário pode usar TODAS as funcionalidades críticas

---

## 📈 MÉTRICAS DE SUCESSO

### Antes da Sprint 49 (v3.6.0)
- Nota Geral: **3/10** (Crítico)
- Problemas P0: **5 bloqueadores**
- Funcionalidades Quebradas: **5 críticas**
- Pronto para Produção: **NÃO**

### Meta da Sprint 49 (v3.7.0)
- Nota Geral: **≥ 8/10** (Bom)
- Problemas P0: **0 bloqueadores**
- Funcionalidades Quebradas: **0 críticas**
- Pronto para Produção: **SIM**

### Melhorias Esperadas
- Chat Principal: **0/10 → 9/10** (funcional com cache-busting)
- Criação de Prompts: **3/10 → 9/10** (Error 400 corrigido)
- Criação de Providers: **0/10 → 9/10** (procedure implementada)
- Follow-up Chat: **0/10 → 8/10** (botão conectado)
- Navegação de Rotas: **5/10 → 10/10** (todas rotas funcionando)

---

## 🚀 INÍCIO DA EXECUÇÃO

**Status:** Planejamento Completo ✅  
**Próximo Passo:** Iniciar Fase 2 - Correções P0  
**Primeira Tarefa:** P0-1 - Implementar providers.create

**Data/Hora de Início:** 16 de Novembro de 2025  
**Previsão de Conclusão:** Mesma data (4-5 horas de trabalho)

---

## 📝 NOTAS IMPORTANTES

### Workflow V2 Obrigatório
Para CADA correção, seguir workflow:
1. Modificar código
2. **`npm run build`** (OBRIGATÓRIO)
3. **`pm2 restart orquestrador-v3`** (OBRIGATÓRIO)
4. Verificar PM2 status (uptime < 1min)
5. Testar funcionalidade
6. Commit com mensagem descritiva
7. Continuar próxima correção

### Commit Squashing Final
Antes do PR:
1. Contar número de commits: `git log --oneline | wc -l`
2. Squash: `git reset --soft HEAD~N && git commit -m "Sprint 49: Fix all P0 blockers and implement versioning (v3.7.0)"`
3. Push force: `git push -f origin genspark_ai_developer`

### Resolução de Conflitos
Se conflitos surgirem durante rebase:
1. Priorizar código REMOTO (main branch)
2. Manter apenas mudanças locais essenciais
3. Testar após resolução
4. Continuar rebase: `git rebase --continue`

### Link do PR
**OBRIGATÓRIO:** Compartilhar link do Pull Request com o usuário após criação!

---

## 📚 REFERÊNCIAS

- **Relatório 1:** `Relatorio_Final_Testes_v3.6.0.pdf`
- **Relatório 2:** `Relatorio_Testes_Completo_Incremental.pdf`
- **Sprint 48:** `SPRINT_48_RELATORIO_FINAL_COMPLETO.md`
- **Workflow V2:** Documentado em Sprint 48
- **PDCA Sprints Anteriores:** PDCA_Sprint_43-48

---

**FIM DO PLANO - INÍCIO DA EXECUÇÃO**
