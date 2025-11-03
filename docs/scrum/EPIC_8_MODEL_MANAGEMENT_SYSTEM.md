# 🎯 EPIC 8: SISTEMA INTELIGENTE DE GERENCIAMENTO DE MODELOS

**Data de Criação**: 2025-11-03  
**Prioridade**: 🔴 ALTA  
**Status**: 🔄 EM ANDAMENTO  
**Metodologia**: Scrum Rigoroso

---

## 📋 CONTEXTO E HISTÓRICO

### Origem
Este épico continua o trabalho iniciado em conversa anterior que foi interrompida devido a problemas na sandbox. Todo o contexto, arquivos e progresso foram recuperados e serão completados 100%.

### Objetivo
Implementar sistema completo e inteligente de gerenciamento de modelos que suporte:
- ✅ **LM Studio** (modelos locais) com carregamento/descarregamento automático
- ✅ **APIs Externas** (OpenAI, Anthropic, Google, Genspark, Mistral)
- ✅ **Verificação de Status** em tempo real
- ✅ **Fallback Automático** quando modelo falha
- ✅ **Cache Inteligente** de estado dos modelos
- ✅ **UI Responsiva** com indicadores visuais
- ✅ **Integração Completa** com sistema de prompts

---

## 🎯 OBJETIVOS SMART

### Específico
Implementar sistema de gerenciamento de modelos com suporte a LM Studio + 5 provedores externos, com carregamento inteligente, validação de status, cache, fallback automático e UI completa.

### Mensurável
- 1 service: modelLoaderService.ts (200+ linhas)
- 1 service: externalAPIService.ts (300+ linhas)
- 1 router: modelManagementRouter.ts (150+ linhas)
- 7 endpoints tRPC
- Schema atualizado (2 tabelas modificadas)
- 1 página atualizada: PromptChat.tsx
- 1 página nova: APIKeysManagement.tsx
- 12+ testes unitários
- 8+ testes de integração

### Atingível
Todos os arquivos base já foram criados na conversa anterior. Vamos:
1. Reutilizar o que existe
2. Completar o que falta
3. Integrar tudo
4. Testar 100%
5. Deployar

### Relevante
Sistema crítico para:
- Execução de prompts sem falhas
- Suporte a múltiplos provedores
- Economia de custos (fallback para modelos mais baratos)
- Experiência do usuário (carregamento transparente)

### Temporal
- **Sprint 8.1-8.3**: Services (2 horas)
- **Sprint 8.4-8.5**: Router + Schema (1 hora)
- **Sprint 8.6-8.7**: Frontend (2 horas)
- **Sprint 8.8**: Testes (1.5 horas)
- **Sprint 8.9**: Deploy (1 hora)
- **Sprint 8.10**: Validação Final (0.5 hora)
- **TOTAL**: 8 horas

---

## 📦 SPRINTS GRANULARIZADAS

### 🔹 SPRINT 8.1: ModelLoaderService - Estrutura Base
**Duração**: 30min  
**Prioridade**: 🔴 ALTA

#### Objetivos
1. Criar arquivo `server/services/modelLoaderService.ts`
2. Implementar classe ModelLoaderService
3. Definir interfaces TypeScript
4. Implementar gerenciamento de cache

#### Critérios de Aceitação
- ✅ Arquivo criado e estruturado
- ✅ Interfaces ModelStatus, LoadResult definidas
- ✅ Cache Map<number, ModelStatus> implementado
- ✅ Métodos básicos esqueletizados
- ✅ TypeScript sem erros
- ✅ Compilação bem-sucedida

#### Arquivos Afetados
- `server/services/modelLoaderService.ts` (NOVO)

---

### 🔹 SPRINT 8.2: ModelLoaderService - LM Studio Integration
**Duração**: 45min  
**Prioridade**: 🔴 ALTA

#### Objetivos
1. Implementar checkModelStatus() para LM Studio
2. Implementar loadModel() com tentativa de carregamento
3. Implementar waitForModelLoad() com polling
4. Implementar unloadModel()
5. Adicionar timeout e retry logic

#### Critérios de Aceitação
- ✅ checkModelStatus consulta /models endpoint do LM Studio
- ✅ loadModel tenta forçar carregamento via /chat/completions
- ✅ waitForModelLoad faz polling até sucesso ou timeout
- ✅ unloadModel marca modelo como não carregado
- ✅ Tratamento de erros ECONNREFUSED, 404, timeout
- ✅ Logs descritivos em cada etapa
- ✅ Cache atualizado corretamente

#### Arquivos Afetados
- `server/services/modelLoaderService.ts` (MODIFICAR)

---

### 🔹 SPRINT 8.3: ModelLoaderService - Intelligence & Fallback
**Duração**: 45min  
**Prioridade**: 🔴 ALTA

#### Objetivos
1. Implementar listAvailableModels()
2. Implementar suggestAlternativeModel()
3. Implementar resetFailedModels()
4. Adicionar suporte a APIs externas (validação)
5. Sistema de priorização de modelos

#### Critérios de Aceitação
- ✅ listAvailableModels retorna status de todos modelos ativos
- ✅ suggestAlternativeModel escolhe melhor alternativa:
  - Prioriza APIs externas (sempre disponíveis)
  - Depois modelos LM Studio já carregados
  - Depois outros modelos LM Studio
- ✅ resetFailedModels limpa cache de falhas
- ✅ APIs externas sempre marcadas como disponíveis
- ✅ Lógica de priorização testada

#### Arquivos Afetados
- `server/services/modelLoaderService.ts` (MODIFICAR)

---

### 🔹 SPRINT 8.4: ExternalAPIService - Provedores
**Duração**: 60min  
**Prioridade**: 🔴 ALTA

#### Objetivos
1. Criar arquivo `server/services/externalAPIService.ts`
2. Implementar classe ExternalAPIService
3. Implementar método getAPIKey() (busca no DB)
4. Implementar openaiCompletion()
5. Implementar anthropicCompletion()
6. Implementar googleCompletion()
7. Implementar gensparkCompletion()
8. Implementar mistralCompletion()
9. Implementar método unificado generateCompletion()

#### Critérios de Aceitação
- ✅ ExternalAPIService com métodos para 5 provedores
- ✅ Cada método:
  - Busca API key no DB (tabela apiKeys)
  - Faz POST request correto para o provedor
  - Headers específicos de cada API
  - Timeout configurável
  - Tratamento de erros específico
  - Retorna texto da resposta
- ✅ generateCompletion() roteia para provider correto
- ✅ Logs detalhados de cada chamada
- ✅ TypeScript sem erros

#### Arquivos Afetados
- `server/services/externalAPIService.ts` (NOVO)
- `server/db/schema.ts` (VERIFICAR apiKeys table)

---

### 🔹 SPRINT 8.5: ModelManagementRouter + Schema Update
**Duração**: 60min  
**Prioridade**: 🔴 ALTA

#### Objetivos
1. Criar `server/routers/modelManagementRouter.ts`
2. Implementar 7 endpoints tRPC:
   - checkStatus
   - load
   - waitForLoad
   - unload
   - listWithStatus
   - suggestAlternative
   - resetFailedCache
3. Atualizar `server/routers/index.ts`
4. Verificar/criar tabela `apiKeys` no schema
5. Atualizar tabela `aiModels` com campo provider

#### Critérios de Aceitação
- ✅ Router criado com 7 endpoints
- ✅ Todos endpoints com validação Zod
- ✅ Todos endpoints chamam modelLoaderService
- ✅ Router exportado e adicionado ao appRouter
- ✅ Schema atualizado:
  - aiModels.provider (varchar 50)
  - apiKeys table com: id, provider, apiKey, userId, createdAt
- ✅ Migration criada se necessário
- ✅ TypeScript sem erros
- ✅ Compilação bem-sucedida

#### Arquivos Afetados
- `server/routers/modelManagementRouter.ts` (NOVO)
- `server/routers/index.ts` (MODIFICAR)
- `server/db/schema.ts` (MODIFICAR)

---

### 🔹 SPRINT 8.6: PromptChat.tsx - Intelligent Loading
**Duração**: 75min  
**Prioridade**: 🔴 ALTA

#### Objetivos
1. Atualizar `client/src/pages/PromptChat.tsx`
2. Adicionar hook `trpc.modelManagement.listWithStatus.useQuery`
3. Implementar função `checkAndLoadModel()`
4. Atualizar `handleSendMessage()` para usar checkAndLoadModel
5. Adicionar estados de loading
6. Adicionar indicadores visuais de status do modelo
7. Implementar sugestão automática de modelo alternativo

#### Critérios de Aceitação
- ✅ Lista de modelos mostra status em tempo real:
  - 🌐 para APIs externas
  - ✓ para modelos LM Studio carregados
  - 🔄 para modelos carregando
  - ❌ para modelos inativos
- ✅ checkAndLoadModel():
  - Verifica status antes de enviar mensagem
  - Tenta carregar se LM Studio não carregado
  - Mostra progresso visual
  - Sugere alternativa se falhar
  - Atualiza UI com mensagens de sistema
- ✅ handleSendMessage():
  - Bloqueia envio se modelo não pronto
  - Chama checkAndLoadModel
  - Só envia se modelo OK
- ✅ UI responsiva e feedback claro
- ✅ Sem erros no console
- ✅ TypeScript sem erros

#### Arquivos Afetados
- `client/src/pages/PromptChat.tsx` (MODIFICAR)

---

### 🔹 SPRINT 8.7: API Keys Management UI
**Duração**: 45min  
**Prioridade**: 🟡 MÉDIA

#### Objetivos
1. Criar `client/src/pages/APIKeysManagement.tsx`
2. Implementar CRUD de API keys:
   - Lista de keys por provedor
   - Adicionar nova key
   - Editar key existente
   - Deletar key
   - Testar key (validação)
3. Adicionar rota no React Router
4. Adicionar link no menu principal

#### Critérios de Aceitação
- ✅ Página criada e funcional
- ✅ Lista todas API keys cadastradas
- ✅ Formulário de adição com validação
- ✅ Edição inline ou modal
- ✅ Confirmação de deleção
- ✅ Botão "Test" que valida key com provedor
- ✅ Feedback visual (loading, success, error)
- ✅ Rota `/api-keys` adicionada
- ✅ Link no menu Settings
- ✅ TypeScript sem erros
- ✅ UI responsiva

#### Arquivos Afetados
- `client/src/pages/APIKeysManagement.tsx` (NOVO)
- `client/src/App.tsx` ou router config (MODIFICAR)
- Componente de navegação (MODIFICAR)

---

### 🔹 SPRINT 8.8: Testes Completos
**Duração**: 90min  
**Prioridade**: 🔴 ALTA

#### Objetivos
1. Criar `server/services/__tests__/modelLoaderService.test.ts`
2. Criar `server/services/__tests__/externalAPIService.test.ts`
3. Criar `tests/integration/modelManagement.test.ts`
4. Testar todos os cenários:
   - LM Studio online/offline
   - Modelo carregado/não carregado
   - Timeout de carregamento
   - APIs externas disponíveis
   - API key inválida
   - Fallback automático
   - Cache funcionando
5. Executar suite completa
6. Garantir cobertura > 80%

#### Critérios de Aceitação
- ✅ 12+ testes unitários:
  - modelLoaderService: 6 testes
  - externalAPIService: 6 testes
- ✅ 8+ testes de integração:
  - Fluxo completo de carregamento
  - Fluxo de fallback
  - Fluxo de API externa
  - Cenários de erro
- ✅ Todos os testes passando
- ✅ Cobertura > 80% nos arquivos novos
- ✅ Mocks corretos para axios
- ✅ Mocks corretos para DB
- ✅ Testes rápidos (< 10s total)

#### Arquivos Afetados
- `server/services/__tests__/modelLoaderService.test.ts` (NOVO)
- `server/services/__tests__/externalAPIService.test.ts` (NOVO)
- `tests/integration/modelManagement.test.ts` (NOVO)

---

### 🔹 SPRINT 8.9: Deploy para Produção
**Duração**: 60min  
**Prioridade**: 🔴 ALTA

#### Objetivos
1. Commit de todos os arquivos criados/modificados
2. Squash de commits locais em 1 commit abrangente
3. Fetch e merge de origin/main
4. Resolver conflitos (priorizar código remoto)
5. Push para origin/genspark_ai_developer
6. Criar Pull Request para main
7. Build local e validação
8. Deploy via SSH para servidor produção:
   - rsync arquivos
   - npm install
   - npm run build
   - pm2 restart
9. Verificar health check

#### Critérios de Aceitação
- ✅ Todos arquivos commitados com mensagem descritiva
- ✅ Commits squashed em 1 commit
- ✅ Código sincronizado com remote
- ✅ PR criado com descrição completa
- ✅ Build local sem erros
- ✅ Arquivos enviados via rsync
- ✅ Dependências instaladas no servidor
- ✅ Build no servidor bem-sucedido
- ✅ PM2 reiniciado com sucesso
- ✅ Health check retorna 200 OK
- ✅ Logs sem erros críticos

#### Comandos SSH
```bash
# Conectar ao servidor
sshpass -p 'sshflavioia' ssh -p 2224 flavio@31.97.64.43

# No servidor
cd /home/flavio/orquestrador-ia
git fetch origin
git checkout genspark_ai_developer
git pull origin genspark_ai_developer
npm install
npm run build
pm2 restart orquestrador-ia
pm2 logs --lines 50
curl http://localhost:3001/api/health
```

#### Arquivos Afetados
- Todos os arquivos criados/modificados
- Git commits
- Pull Request

---

### 🔹 SPRINT 8.10: Validação Final 100%
**Duração**: 30min  
**Prioridade**: 🔴 ALTA

#### Objetivos
1. Teste manual completo via SSH tunnel:
   - Dashboard carrega
   - Menu funciona
   - Prompt Chat funciona
   - Seleção de modelo funciona
   - Carregamento de modelo LM Studio funciona
   - APIs externas funcionam
   - Fallback automático funciona
   - API Keys management funciona
2. Verificar logs do PM2
3. Verificar métricas de performance
4. Criar documentação final do Epic 8
5. Atualizar PROGRESSO_GLOBAL.md
6. Marcar Epic 8 como ✅ COMPLETO

#### Critérios de Aceitação
- ✅ Todos os cenários testados manualmente
- ✅ Zero erros no console do browser
- ✅ Zero erros nos logs do PM2
- ✅ Response time < 200ms (média)
- ✅ Memória estável (sem leaks)
- ✅ Documentação criada:
  - EPIC_8_COMPLETO.md
  - SPRINT_8.1_a_8.10_RESULTADOS.md
- ✅ PROGRESSO_GLOBAL.md atualizado
- ✅ README.md atualizado com novo Epic
- ✅ Sistema 100% funcional

#### Arquivos Afetados
- `docs/scrum/resultados/EPIC_8_COMPLETO.md` (NOVO)
- `docs/scrum/resultados/SPRINT_8.1_a_8.10_RESULTADOS.md` (NOVO)
- `docs/scrum/PROGRESSO_GLOBAL.md` (MODIFICAR)
- `README.md` (MODIFICAR)

---

## 📊 MÉTRICAS DE SUCESSO

### Técnicas
- ✅ 2 services criados (500+ linhas)
- ✅ 1 router criado (150+ linhas)
- ✅ 7 endpoints tRPC
- ✅ 2 páginas frontend (1 nova, 1 modificada)
- ✅ Schema atualizado (2 tabelas)
- ✅ 20+ testes (12 unit + 8 integration)
- ✅ Cobertura > 80%
- ✅ Zero TypeScript errors
- ✅ Zero console errors
- ✅ Build time < 30s
- ✅ Response time < 200ms

### Funcionais
- ✅ LM Studio integration completa
- ✅ 5 provedores externos funcionando
- ✅ Carregamento inteligente de modelos
- ✅ Status em tempo real
- ✅ Fallback automático
- ✅ Cache funcionando
- ✅ UI responsiva
- ✅ API Keys management completo

### Qualidade
- ✅ Código limpo e documentado
- ✅ TypeScript tipagem completa
- ✅ Error handling robusto
- ✅ Logs descritivos
- ✅ Testes completos
- ✅ Performance otimizada

---

## 🔗 DEPENDÊNCIAS

### Pré-requisitos
- ✅ Epic 1-7 completos
- ✅ Sistema base funcionando
- ✅ LM Studio rodando (ou simulado)
- ✅ Database com schema v3
- ✅ tRPC configurado
- ✅ React Router configurado

### Dependências Externas
- axios (HTTP requests)
- drizzle-orm (DB queries)
- zod (Validation)
- @trpc/server (API)
- @trpc/react-query (Client)

---

## 📁 ARQUIVOS CRIADOS/MODIFICADOS

### Novos (8)
1. `server/services/modelLoaderService.ts`
2. `server/services/externalAPIService.ts`
3. `server/routers/modelManagementRouter.ts`
4. `client/src/pages/APIKeysManagement.tsx`
5. `server/services/__tests__/modelLoaderService.test.ts`
6. `server/services/__tests__/externalAPIService.test.ts`
7. `tests/integration/modelManagement.test.ts`
8. `docs/scrum/resultados/EPIC_8_COMPLETO.md`

### Modificados (6)
1. `server/routers/index.ts`
2. `server/db/schema.ts`
3. `client/src/pages/PromptChat.tsx`
4. `client/src/App.tsx` (router config)
5. `docs/scrum/PROGRESSO_GLOBAL.md`
6. `README.md`

---

## 🚨 RISCOS E MITIGAÇÕES

### Risco 1: LM Studio Offline
**Probabilidade**: Média  
**Impacto**: Alto  
**Mitigação**: Fallback automático para APIs externas

### Risco 2: API Keys Inválidas
**Probabilidade**: Média  
**Impacto**: Médio  
**Mitigação**: Validação de keys + feedback claro + fallback

### Risco 3: Timeout de Carregamento
**Probabilidade**: Baixa  
**Impacto**: Médio  
**Mitigação**: Timeout configurável + retry logic + alternativas

### Risco 4: Conflitos no Git
**Probabilidade**: Baixa  
**Impacto**: Baixo  
**Mitigação**: Fetch antes de push + resolver conflitos priorizando remote

---

## ✅ CHECKLIST DE CONCLUSÃO

### Código
- [ ] Todos os arquivos criados
- [ ] Todos os arquivos modificados
- [ ] TypeScript sem erros
- [ ] Linting sem warnings
- [ ] Build bem-sucedido

### Testes
- [ ] 12+ testes unitários passando
- [ ] 8+ testes de integração passando
- [ ] Cobertura > 80%
- [ ] Zero testes falhando

### Deploy
- [ ] Código no GitHub
- [ ] PR criado e descrito
- [ ] Deploy no servidor produção
- [ ] PM2 rodando estável
- [ ] Health check OK

### Validação
- [ ] Teste manual completo
- [ ] Zero erros no console
- [ ] Zero erros nos logs
- [ ] Performance aceitável
- [ ] Documentação completa

### Documentação
- [ ] EPIC_8_COMPLETO.md criado
- [ ] Resultados das sprints documentados
- [ ] PROGRESSO_GLOBAL.md atualizado
- [ ] README.md atualizado
- [ ] Commits descritivos

---

## 📈 PROGRESSO ESPERADO

### Após Sprint 8.3
- Services modelLoader completo
- 40% do Epic

### Após Sprint 8.5
- Services + Router + Schema completos
- 60% do Epic

### Após Sprint 8.7
- Backend + Frontend completos
- 80% do Epic

### Após Sprint 8.10
- Epic 100% completo
- Testes, deploy e validação finalizados

---

## 🎯 PRÓXIMO EPIC

Após conclusão do Epic 8, o sistema terá:
- ✅ 8 épicos completos (7 anteriores + 8)
- ✅ ~65 sprints completados
- ✅ Sistema de gerenciamento de modelos 100% funcional
- ✅ Suporte a LM Studio + 5 APIs externas
- ✅ UI completa e responsiva

**Próximo**: Epic 9 - Advanced Analytics Dashboard (se necessário)

---

**🔥 VAMOS COMPLETAR 100% DESTE EPIC SEM PARAR! 🔥**
