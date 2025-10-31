# 🗺️ MAPEAMENTO COMPLETO ROTAS tRPC vs PÁGINAS - V3.1

**Data da Auditoria**: 31 de Outubro de 2025  
**Objetivo**: Mapear todos os routers existentes, seus endpoints, e identificar o que está faltando para cada página funcionar completamente.

---

## ✅ ROUTERS tRPC EXISTENTES (12 Routers, 168+ Endpoints)

### 1. **auth** Router (5 endpoints)
- `register` - Criar nova conta
- `login` - Fazer login
- `verifyToken` - Verificar token JWT
- `refreshToken` - Renovar token
- `logout` - Fazer logout

### 2. **users** Router (8 endpoints)
- `list` - Listar usuários
- `getById` - Obter usuário específico
- `update` - Atualizar usuário
- `updatePreferences` - Atualizar preferências
- `search` - Buscar usuários
- (+ outros endpoints de gerenciamento)

### 3. **teams** Router (9 endpoints)
- `list` - Listar equipes
- `getById` - Obter equipe específica
- `create` - Criar equipe
- `update` - Atualizar equipe
- `delete` - Deletar equipe
- `addMember` - Adicionar membro
- `removeMember` - Remover membro
- `updateMemberRole` - Atualizar papel do membro
- `listMembers` - Listar membros

### 4. **projects** Router (10 endpoints)
- `list` - Listar projetos
- `getById` - Obter projeto específico
- `create` - Criar projeto
- `update` - Atualizar projeto
- `delete` - Deletar projeto
- `archive` - Arquivar projeto
- `duplicate` - Duplicar projeto
- `getStats` - Obter estatísticas
- (+ outros endpoints)

### 5. **tasks** Router (16 endpoints)
- `list` - Listar tarefas
- `getById` - Obter tarefa específica
- `create` - Criar tarefa
- `update` - Atualizar tarefa
- `delete` - Deletar tarefa
- `plan` - Planejar tarefa (gerar subtarefas com IA)
- `listSubtasks` - Listar subtarefas
- `createSubtask` - Criar subtarefa
- `updateSubtask` - Atualizar subtarefa
- `deleteSubtask` - Deletar subtarefa
- `executeSubtask` - Executar subtarefa com orquestração
- `addDependency` - Adicionar dependência entre tarefas
- `removeDependency` - Remover dependência
- `search` - Buscar tarefas
- `getStats` - Obter estatísticas
- `reorderSubtasks` - Reordenar subtarefas

### 6. **chat** Router (15 endpoints)
- `listConversations` - Listar conversas do usuário
- `createConversation` - Criar nova conversa
- `getConversation` - Obter conversa específica
- `updateConversation` - Atualizar conversa
- `deleteConversation` - Deletar conversa
- `listMessages` - Listar mensagens de uma conversa
- `sendMessage` - Enviar mensagem
- `getMessage` - Obter mensagem específica
- `editMessage` - Editar mensagem
- `deleteMessage` - Deletar mensagem
- `addAttachment` - Adicionar anexo a mensagem
- `addReaction` - Adicionar reação a mensagem
- `searchMessages` - Buscar mensagens
- `getConversationStats` - Obter estatísticas de conversa
- `markAsRead` - Marcar conversa como lida

### 7. **prompts** Router (12 endpoints)
- `list` - Listar prompts
- `getById` - Obter prompt específico
- `create` - Criar prompt
- `update` - Atualizar prompt
- `delete` - Deletar prompt
- `listVersions` - Listar versões de prompt
- `createVersion` - Criar nova versão
- `revertToVersion` - Reverter para versão anterior
- `search` - Buscar prompts
- (+ outros endpoints)

### 8. **models** Router (10 endpoints)
- `list` - Listar modelos
- `getById` - Obter modelo específico
- `create` - Criar modelo
- `update` - Atualizar modelo
- `delete` - Deletar modelo
- `listSpecializedAIs` - Listar IAs especializadas
- (+ outros endpoints)

### 9. **lmstudio** Router (12 endpoints)
- `listModels` - Listar modelos disponíveis no LM Studio
- `listLoadedModels` - Listar modelos carregados
- `loadModel` - Carregar modelo
- `unloadModel` - Descarregar modelo
- `generate` - Gerar texto
- `benchmark` - Fazer benchmark de modelo
- `compareModels` - Comparar modelos
- (+ outros endpoints)

### 10. **training** Router (22 endpoints)
- **Dataset Management:**
  - `createDataset` - Criar dataset
  - `listDatasets` - Listar datasets
  - `getDataset` - Obter dataset específico
  - `deleteDataset` - Deletar dataset
  - `validateDataset` - Validar dataset
- **Training Jobs:**
  - `startTraining` - Iniciar treinamento
  - `listTrainingJobs` - Listar jobs de treinamento
  - `getTrainingStatus` - Obter status de treinamento
  - `cancelTraining` - Cancelar treinamento
  - `pauseTraining` - Pausar treinamento
  - `getTrainingMetrics` - Obter métricas de treinamento
  - `getTrainingLogs` - Obter logs de treinamento
- **Model Evaluation:**
  - `evaluateModel` - Avaliar modelo
  - `benchmarkModel` - Fazer benchmark
  - `compareModels` - Comparar modelos
  - `getModelMetrics` - Obter métricas de modelo
  - `exportModel` - Exportar modelo
- **Advanced Features:**
  - `createFineTuningConfig` - Criar configuração de fine-tuning
  - `listFineTuningConfigs` - Listar configurações
  - `estimateTrainingTime` - Estimar tempo de treinamento
  - `getHyperparameterRecommendations` - Obter recomendações de hiperparâmetros
  - `scheduleTraining` - Agendar treinamento

### 11. **services** Router (35+ endpoints)
- **Service Management (5):**
  - `listServices` - Listar serviços externos
  - `getService` - Obter serviço específico
  - `createService` - Criar serviço
  - `updateService` - Atualizar serviço
  - `deleteService` - Deletar serviço
- **GitHub Integration (5):**
  - `githubListRepos` - Listar repositórios
  - `githubGetRepo` - Obter repositório
  - `githubListIssues` - Listar issues
  - `githubCreateIssue` - Criar issue
  - `githubListPullRequests` - Listar PRs
- **Gmail Integration (5):**
  - `gmailListMessages` - Listar mensagens
  - `gmailGetMessage` - Obter mensagem
  - `gmailSendMessage` - Enviar mensagem
  - `gmailSearchMessages` - Buscar mensagens
  - `gmailDeleteMessage` - Deletar mensagem
- **Google Drive Integration (5):**
  - `driveListFiles` - Listar arquivos
  - `driveGetFile` - Obter arquivo
  - `driveUploadFile` - Fazer upload
  - `driveDeleteFile` - Deletar arquivo
  - `driveShareFile` - Compartilhar arquivo
- **Google Sheets Integration (5):**
  - `sheetsGetSpreadsheet` - Obter planilha
  - `sheetsReadRange` - Ler intervalo
  - `sheetsWriteRange` - Escrever intervalo
  - `sheetsAppendRow` - Adicionar linha
  - `sheetsCreateSpreadsheet` - Criar planilha
- **OAuth & Credentials (7):**
  - `listOAuthTokens` - Listar tokens OAuth
  - `refreshOAuthToken` - Renovar token
  - `revokeOAuthToken` - Revogar token
  - `listApiCredentials` - Listar credenciais API
  - `createApiCredential` - Criar credencial
  - `deleteApiCredential` - Deletar credencial
  - `testApiCredential` - Testar credencial

### 12. **monitoring** Router (14 endpoints)
- `getCurrentMetrics` - Obter métricas atuais do sistema
- `getMetricsHistory` - Obter histórico de métricas
- `getServiceStatus` - Obter status de serviços
- `getHealthStatus` - Obter status de saúde do sistema
- `getAlerts` - Obter alertas ativos
- `acknowledgeAlert` - Confirmar alerta
- `getLogs` - Obter logs do sistema
- `getErrorLogs` - Obter logs de erro
- (+ outros endpoints)

---

## 📄 MAPEAMENTO PÁGINAS vs ROUTERS

### ✅ PÁGINAS COM ROUTERS COMPLETOS (7 páginas)

#### 1. Dashboard (`/`)
- **Routers usados**: `monitoring`, `tasks`, `projects`
- **Endpoints necessários**:
  - ✅ `monitoring.getCurrentMetrics` - Métricas do sistema
  - ✅ `monitoring.getServiceStatus` - Status dos serviços
  - ✅ `tasks.getStats` - Estatísticas de tarefas
  - ✅ `projects.list` - Listar projetos
- **Status**: ✅ **COMPLETO**

#### 2. Tasks (`/tasks`)
- **Router usado**: `tasks`
- **Endpoints necessários**:
  - ✅ `tasks.list` - Listar tarefas
  - ✅ `tasks.create` - Criar tarefa
  - ✅ `tasks.update` - Atualizar tarefa
  - ✅ `tasks.delete` - Deletar tarefa
  - ✅ `tasks.plan` - Planejar com IA
  - ✅ `tasks.listSubtasks` - Listar subtarefas
- **Status**: ✅ **COMPLETO** (16 endpoints disponíveis)

#### 3. Chat (`/chat`)
- **Router usado**: `chat`
- **Endpoints necessários**:
  - ✅ `chat.listConversations` - Listar conversas
  - ✅ `chat.createConversation` - Criar conversa
  - ✅ `chat.sendMessage` - Enviar mensagem
  - ✅ `chat.listMessages` - Listar mensagens
  - ✅ `chat.addAttachment` - Adicionar anexo
- **Status**: ✅ **COMPLETO** (15 endpoints disponíveis)

#### 4. Teams (`/teams`)
- **Router usado**: `teams`
- **Endpoints necessários**:
  - ✅ `teams.list` - Listar equipes
  - ✅ `teams.create` - Criar equipe
  - ✅ `teams.update` - Atualizar equipe
  - ✅ `teams.delete` - Deletar equipe
  - ✅ `teams.addMember` - Adicionar membro
- **Status**: ✅ **COMPLETO** (9 endpoints disponíveis)

#### 5. Projects (`/projects`)
- **Router usado**: `projects`
- **Endpoints necessários**:
  - ✅ `projects.list` - Listar projetos
  - ✅ `projects.create` - Criar projeto
  - ✅ `projects.update` - Atualizar projeto
  - ✅ `projects.delete` - Deletar projeto
  - ✅ `projects.archive` - Arquivar projeto
- **Status**: ✅ **COMPLETO** (10 endpoints disponíveis)

#### 6. Models (`/models`)
- **Router usado**: `models`, `lmstudio`
- **Endpoints necessários**:
  - ✅ `models.list` - Listar modelos
  - ✅ `models.create` - Criar modelo
  - ✅ `models.update` - Atualizar modelo
  - ✅ `models.delete` - Deletar modelo
  - ✅ `lmstudio.listModels` - Listar modelos LM Studio
- **Status**: ✅ **COMPLETO** (22 endpoints disponíveis)

#### 7. Profile (`/profile`)
- **Router usado**: `users`
- **Endpoints necessários**:
  - ✅ `users.getById` - Obter usuário
  - ✅ `users.update` - Atualizar usuário
  - ✅ `users.updatePreferences` - Atualizar preferências
- **Status**: ✅ **COMPLETO** (8 endpoints disponíveis)

---

### ⚠️ PÁGINAS COM ROUTERS PARCIAIS (5 páginas - precisam verificação)

#### 8. Analytics (`/analytics`)
- **Router usado**: Possivelmente `monitoring`
- **Endpoints necessários**:
  - ⚠️ `monitoring.getMetricsHistory` - Histórico de métricas
  - ⚠️ `tasks.getStats` - Estatísticas de tarefas
  - ⚠️ `projects.getStats` - Estatísticas de projetos
  - ❌ **FALTA**: Endpoint específico para analytics agregados
- **Status**: ⚠️ **PARCIAL** - Precisa criar endpoint `analytics.getAggregatedStats`

#### 9. Model Training (`/model-training`)
- **Router usado**: `training`
- **Endpoints necessários**:
  - ✅ `training.listDatasets` - Listar datasets
  - ✅ `training.createDataset` - Criar dataset
  - ✅ `training.startTraining` - Iniciar treinamento
  - ✅ `training.listTrainingJobs` - Listar jobs
  - ✅ `training.getTrainingStatus` - Obter status
- **Status**: ⚠️ **VERIFICAR** - Router existe com 22 endpoints, precisa testar interface

#### 10. Services (`/services`)
- **Router usado**: `services`
- **Endpoints necessários**:
  - ✅ `services.listServices` - Listar serviços
  - ✅ `services.createService` - Criar serviço
  - ✅ `services.githubListRepos` - GitHub repos
  - ✅ `services.gmailListMessages` - Gmail messages
- **Status**: ⚠️ **VERIFICAR** - Router existe com 35+ endpoints, precisa testar interface

#### 11. Monitoring (`/monitoring`)
- **Router usado**: `monitoring`
- **Endpoints necessários**:
  - ✅ `monitoring.getCurrentMetrics` - Métricas atuais
  - ✅ `monitoring.getMetricsHistory` - Histórico
  - ✅ `monitoring.getHealthStatus` - Status de saúde
  - ✅ `monitoring.getLogs` - Logs do sistema
- **Status**: ⚠️ **VERIFICAR** - Router existe com 14 endpoints, precisa testar interface

#### 12. Prompts (`/prompts`)
- **Router usado**: `prompts`
- **Endpoints necessários**:
  - ✅ `prompts.list` - Listar prompts
  - ✅ `prompts.create` - Criar prompt
  - ✅ `prompts.update` - Atualizar prompt
  - ✅ `prompts.delete` - Deletar prompt
  - ✅ `prompts.listVersions` - Versões
- **Status**: ⚠️ **VERIFICAR** - Router existe com 12 endpoints, precisa testar interface

---

### ❌ PÁGINAS SEM ROUTERS (14 páginas - ROUTERS FALTANDO)

#### 13. Credentials (`/credentials`)
- **Router necessário**: `credentials` ❌ **FALTANDO**
- **Endpoints necessários**:
  - ❌ `credentials.list` - Listar credenciais
  - ❌ `credentials.create` - Criar credencial
  - ❌ `credentials.update` - Atualizar credencial
  - ❌ `credentials.delete` - Deletar credencial
  - ❌ `credentials.test` - Testar credencial
- **Nota**: `services.listApiCredentials` existe, mas precisa de router dedicado
- **Status**: ❌ **FALTANDO ROUTER COMPLETO**

#### 14. Execution Logs (`/execution-logs`)
- **Router necessário**: `executionLogs` ❌ **FALTANDO**
- **Endpoints necessários**:
  - ❌ `executionLogs.list` - Listar logs de execução
  - ❌ `executionLogs.getById` - Obter log específico
  - ❌ `executionLogs.filter` - Filtrar por tipo/status/data
  - ❌ `executionLogs.delete` - Deletar log
- **Status**: ❌ **FALTANDO ROUTER**

#### 15. External API Accounts (`/external-api-accounts`)
- **Router necessário**: `externalAPIAccounts` ❌ **FALTANDO**
- **Endpoints necessários**:
  - ❌ `externalAPIAccounts.list` - Listar contas
  - ❌ `externalAPIAccounts.create` - Criar conta
  - ❌ `externalAPIAccounts.update` - Atualizar conta
  - ❌ `externalAPIAccounts.delete` - Deletar conta
  - ❌ `externalAPIAccounts.test` - Testar conexão
- **Nota**: `services` router tem funcionalidade similar
- **Status**: ❌ **FALTANDO ROUTER** (ou adaptar `services`)

#### 16. Instructions (`/instructions`)
- **Router necessário**: `instructions` ❌ **FALTANDO**
- **Endpoints necessários**:
  - ❌ `instructions.list` - Listar instruções
  - ❌ `instructions.create` - Criar instrução
  - ❌ `instructions.update` - Atualizar instrução
  - ❌ `instructions.delete` - Deletar instrução
  - ❌ `instructions.search` - Buscar instruções
- **Status**: ❌ **FALTANDO ROUTER**

#### 17. Knowledge Base (`/knowledge-base`)
- **Router necessário**: `knowledgeBase` ❌ **FALTANDO**
- **Endpoints necessários**:
  - ❌ `knowledgeBase.list` - Listar bases de conhecimento
  - ❌ `knowledgeBase.create` - Criar base
  - ❌ `knowledgeBase.update` - Atualizar base
  - ❌ `knowledgeBase.delete` - Deletar base
  - ❌ `knowledgeBase.search` - Buscar na base
- **Status**: ❌ **FALTANDO ROUTER**

#### 18. Knowledge Sources (`/knowledge-base/:id/sources`)
- **Router necessário**: `knowledgeSources` ❌ **FALTANDO**
- **Endpoints necessários**:
  - ❌ `knowledgeSources.list` - Listar fontes
  - ❌ `knowledgeSources.create` - Criar fonte
  - ❌ `knowledgeSources.update` - Atualizar fonte
  - ❌ `knowledgeSources.delete` - Deletar fonte
  - ❌ `knowledgeSources.sync` - Sincronizar fonte
- **Status**: ❌ **FALTANDO ROUTER**

#### 19. Providers (`/providers`)
- **Router necessário**: `providers` ❌ **FALTANDO**
- **Endpoints necessários**:
  - ❌ `providers.list` - Listar provedores
  - ❌ `providers.create` - Criar provedor
  - ❌ `providers.update` - Atualizar provedor
  - ❌ `providers.delete` - Deletar provedor
  - ❌ `providers.test` - Testar conexão
- **Status**: ❌ **FALTANDO ROUTER**

#### 20. Settings (`/settings`)
- **Router necessário**: `settings` ❌ **FALTANDO**
- **Endpoints necessários**:
  - ❌ `settings.getAll` - Obter todas configurações
  - ❌ `settings.update` - Atualizar configurações
  - ❌ `settings.reset` - Resetar para padrão
  - ❌ `settings.exportConfig` - Exportar configuração
  - ❌ `settings.importConfig` - Importar configuração
- **Status**: ❌ **FALTANDO ROUTER**

#### 21. Specialized AIs (`/specialized-ais`)
- **Router necessário**: `specializedAIs` ❌ **FALTANDO**
- **Endpoints necessários**:
  - ❌ `specializedAIs.list` - Listar IAs especializadas
  - ❌ `specializedAIs.create` - Criar IA
  - ❌ `specializedAIs.update` - Atualizar IA
  - ❌ `specializedAIs.delete` - Deletar IA
  - ❌ `specializedAIs.test` - Testar IA
- **Nota**: `models.listSpecializedAIs` existe, mas precisa de router completo
- **Status**: ❌ **FALTANDO ROUTER** (ou usar `models` router)

#### 22. Templates (`/templates`)
- **Router necessário**: `templates` ❌ **FALTANDO**
- **Endpoints necessários**:
  - ❌ `templates.list` - Listar templates
  - ❌ `templates.create` - Criar template
  - ❌ `templates.update` - Atualizar template
  - ❌ `templates.delete` - Deletar template
  - ❌ `templates.duplicate` - Duplicar template
  - ❌ `templates.useTemplate` - Usar template
- **Status**: ❌ **FALTANDO ROUTER**

#### 23. Workflow Builder (`/workflow-builder`)
- **Router necessário**: `workflows` ❌ **FALTANDO**
- **Endpoints necessários**:
  - ❌ `workflows.list` - Listar workflows
  - ❌ `workflows.create` - Criar workflow
  - ❌ `workflows.update` - Atualizar workflow
  - ❌ `workflows.delete` - Deletar workflow
  - ❌ `workflows.execute` - Executar workflow
  - ❌ `workflows.getExecutionHistory` - Histórico de execuções
- **Status**: ❌ **FALTANDO ROUTER**

#### 24. Workflows (`/workflows`)
- **Router necessário**: `workflows` ❌ **FALTANDO**
- **Mesmos endpoints do Workflow Builder**
- **Status**: ❌ **FALTANDO ROUTER**

#### 25. Terminal (`/terminal`)
- **Router necessário**: `terminal` ❌ **FALTANDO**
- **Endpoints necessários**:
  - ❌ `terminal.createSession` - Criar sessão de terminal
  - ❌ `terminal.sendCommand` - Enviar comando
  - ❌ `terminal.getOutput` - Obter output
  - ❌ `terminal.closeSession` - Fechar sessão
- **Status**: ❌ **FALTANDO ROUTER** (requer WebSocket)

#### 26. Register/Login (`/register`, `/login`)
- **Router usado**: `auth`
- **Status**: ✅ **COMPLETO** (mas páginas desativadas - sistema sem autenticação)

---

## 📊 RESUMO EXECUTIVO

### Por Status:

| Status | Quantidade | Páginas |
|--------|-----------|---------|
| ✅ **Completo** | 7 | Dashboard, Tasks, Chat, Teams, Projects, Models, Profile |
| ⚠️ **Parcial/Verificar** | 5 | Analytics, Model Training, Services, Monitoring, Prompts |
| ❌ **Faltando Router** | 14 | Credentials, Execution Logs, External API Accounts, Instructions, Knowledge Base, Knowledge Sources, Providers, Settings, Specialized AIs, Templates, Workflow Builder, Workflows, Terminal |

### Estatísticas de Cobertura:

- **Total de páginas**: 26
- **Páginas funcionais**: 7 (27%)
- **Páginas parciais**: 5 (19%)
- **Páginas sem backend**: 14 (54%)

### Routers Backend:

- **Total de routers**: 12
- **Total de endpoints**: 168+
- **Cobertura média por router**: 14 endpoints

---

## 🎯 PRÓXIMOS PASSOS (PRIORIDADES)

### FASE 1: Verificação (Páginas Parciais) - IMEDIATO
1. ⚠️ **Testar Analytics** - Verificar se `monitoring` router é suficiente
2. ⚠️ **Testar Model Training** - Verificar interface com router `training`
3. ⚠️ **Testar Services** - Verificar interface com router `services`
4. ⚠️ **Testar Monitoring** - Verificar interface com router `monitoring`
5. ⚠️ **Testar Prompts** - Verificar interface com router `prompts`

### FASE 2: Criação de Routers Críticos - ALTA PRIORIDADE
1. ❌ **Criar `workflows` router** - Para Workflow Builder e Workflows pages
2. ❌ **Criar `knowledgeBase` router** - Para Knowledge Base page
3. ❌ **Criar `knowledgeSources` router** - Para Knowledge Sources page
4. ❌ **Criar `templates` router** - Para Templates page
5. ❌ **Criar `settings` router** - Para Settings page

### FASE 3: Routers Secundários - MÉDIA PRIORIDADE
6. ❌ **Criar `providers` router** - Para Providers page
7. ❌ **Criar `credentials` router** - Para Credentials page (ou adaptar `services`)
8. ❌ **Criar `instructions` router** - Para Instructions page
9. ❌ **Criar `executionLogs` router** - Para Execution Logs page
10. ❌ **Criar `specializedAIs` router** - Para Specialized AIs page (ou adaptar `models`)

### FASE 4: Routers Avançados - BAIXA PRIORIDADE
11. ❌ **Criar `externalAPIAccounts` router** - Para External API Accounts (ou adaptar `services`)
12. ❌ **Criar `terminal` router** - Para Terminal page (requer WebSocket)
13. ❌ **Criar `analytics` router** - Para Analytics agregados avançados

---

## 📝 NOTAS TÉCNICAS

### Routers que podem ser consolidados:
- `credentials` + `externalAPIAccounts` → Pode usar `services.listApiCredentials`
- `specializedAIs` → Pode usar `models.listSpecializedAIs`
- `analytics` → Pode usar agregação de `monitoring` + `tasks` + `projects`

### Routers que precisam de recursos especiais:
- `terminal` → Requer implementação WebSocket
- `workflows` → Requer engine de execução de workflows
- `knowledgeBase` → Requer sistema de busca vetorial/embeddings

---

**Documento criado em**: 31/10/2025  
**Última atualização**: 31/10/2025  
**Responsável pela auditoria**: Sistema de Auditoria V3.1
