# 🔍 PROMPT DE REVISÃO COMPLETA - ORQUESTRADOR DE IAs V3.0

**Data de Criação**: 2025-10-30  
**Versão**: 3.0 - Revisão Completa  
**Objetivo**: Auditoria detalhada e correção de 100% do código

---

## 🎯 OBJETIVO DA REVISÃO

Você deve fazer uma **REVISÃO COMPLETA E DETALHADA** de TODO o código do sistema Orquestrador de IAs V3.0, validando:

1. ✅ **Sintaxe de Código**: Verificar erros de compilação, imports, tipos
2. ✅ **Estrutura de Banco de Dados**: Validar tabelas, campos, tipos, relacionamentos
3. ✅ **Endpoints tRPC**: Verificar se todos estão funcionais e completos
4. ✅ **Componentes Frontend**: Validar formulários, botões, campos, links
5. ✅ **Integração Frontend-Backend**: Garantir que todas chamadas funcionem
6. ✅ **Experiência do Usuário**: Identificar botões sem função, campos faltantes, links quebrados
7. ✅ **Funcionalidades Completas**: Verificar se TODAS especificações foram implementadas
8. ✅ **Scripts de Deploy**: Criar scripts detalhados de implantação
9. ✅ **Validação Cruzada de Campos**: Garantir que TODOS campos usados no frontend existem no backend e vice-versa
10. ✅ **Mapa do Site Completo**: Revisar TODOS níveis do sitemap e implementar páginas/funcionalidades faltantes
11. ✅ **Boas Práticas de Mercado**: Implementar padrões profissionais da indústria
12. ✅ **Deploy Autônomo**: Script que autocorrige, gera logs detalhados, e envia para GitHub para análise

---

## 🖥️ INFORMAÇÕES DO SERVIDOR DESTINO

### Servidor de Produção
```
IP: 192.168.1.247
Usuário: flavio
Sistema: Ubuntu 22.04
Node.js: v20+
```

### Banco de Dados MySQL
```
Host: localhost
Porta: 3306
Usuário: flavio
Senha: bdflavioia
Banco: orquestraia
Tabelas: 28 tabelas (atualizado de 23)
```

### Aplicação
```
Diretório: /home/flavio/orquestrador-v3
Porta: 3000
Gerenciador: PM2
URL: http://192.168.1.247:3000
```

### LM Studio
```
URL: http://localhost:1234/v1
Status: Rodando localmente no servidor
```

---

## 📊 ESTRUTURA ATUAL DO BANCO DE DADOS (28 TABELAS)

### ✅ Tabelas Core (8)
1. `users` - Usuários do sistema
   - Campos: id, name, email, username, passwordHash, role, avatarUrl, bio, preferences, lastLoginAt, createdAt, updatedAt

2. `teams` - Equipes/Organizações
   - Campos: id, name, description, ownerId, createdAt, updatedAt

3. `teamMembers` - Membros de equipes
   - Campos: id, teamId, userId, role, joinedAt

4. `projects` - Projetos
   - Campos: id, name, description, teamId, status, startDate, endDate, budget, createdAt, updatedAt

5. `tasks` - Tarefas principais
   - Campos: id, projectId, title, description, status, priority, assignedUserId, estimatedHours, actualHours, dueDate, createdAt, updatedAt, completedAt

6. `subtasks` - Subtarefas
   - Campos: id, taskId, assignedModelId, title, description, prompt, result, status, orderIndex, estimatedDifficulty, reviewedBy, reviewNotes, completedAt, createdAt, updatedAt

7. `taskDependencies` - Dependências entre tarefas
   - Campos: id, taskId, dependsOnTaskId, dependencyType, createdAt

8. `aiModels` - Modelos de IA
   - Campos: id, modelName, modelId, provider, modelType, contextWindow, parameters, quantization, capabilities, isActive, createdAt, updatedAt

### ✅ Tabelas de Chat & Conversação (4)
9. `conversations` - Conversas
   - Campos: id, userId, title, modelId, systemPrompt, messageCount, lastMessageAt, isRead, metadata, createdAt, updatedAt

10. `messages` - Mensagens
    - Campos: id, conversationId, role, content, parentMessageId, isEdited, createdAt, updatedAt

11. `messageAttachments` - Anexos de mensagens
    - Campos: id, messageId, fileName, fileType, fileUrl, fileSize, createdAt

12. `messageReactions` - Reações em mensagens
    - Campos: id, messageId, userId, emoji, createdAt

### ✅ Tabelas de Orquestração (5)
13. `specializedAIs` - IAs especializadas
    - Campos: id, name, description, category, systemPrompt, defaultModelId, fallbackModelIds, capabilities, isActive, createdAt, updatedAt

14. `orchestrationLogs` - Logs de orquestração
    - Campos: id, taskId, subtaskId, aiId, action, input, output, executionTime, status, createdAt

15. `crossValidations` - Validações cruzadas
    - Campos: id, subtaskId, validatorAiId, score, approved, feedback, divergence, createdAt

16. `hallucinationDetections` - Detecção de alucinações
    - Campos: id, subtaskId, detectedAt, confidenceScore, indicators, wasRecovered, recoveryMethod, createdAt

17. `executionResults` - Resultados de execução
    - Campos: id, subtaskId, executorAiId, result, score, metrics, createdAt

### ✅ Tabelas de Monitoramento (4)
18. `systemMetrics` - Métricas do sistema
    - Campos: id, cpuUsage, memoryUsage, diskUsage, activeConnections, timestamp

19. `apiUsage` - Uso de APIs
    - Campos: id, userId, endpoint, method, statusCode, responseDuration, timestamp

20. `errorLogs` - Logs de erro
    - Campos: id, userId, level, message, stack, metadata, timestamp

21. `auditLogs` - Logs de auditoria
    - Campos: id, userId, action, resourceType, resourceId, changes, ipAddress, userAgent, timestamp

### ✅ Tabelas de Serviços Externos (3)
22. `externalServices` - Serviços externos
    - Campos: id, userId, serviceName, config, isActive, createdAt, updatedAt

23. `oauthTokens` - Tokens OAuth
    - Campos: id, userId, serviceId, accessToken, refreshToken, expiresAt, scope, createdAt, updatedAt

24. `apiCredentials` - Credenciais de API
    - Campos: id, userId, serviceName, credentialName, encryptedData, createdAt, updatedAt

### ✅ Tabelas de Treinamento (3)
25. `trainingDatasets` - Datasets de treinamento
    - Campos: id, userId, name, description, dataType, format, filePath, recordCount, sizeBytes, metadata, createdAt, updatedAt

26. `trainingJobs` - Jobs de treinamento
    - Campos: id, baseModelId, datasetId, status, trainingType, hyperparameters, currentEpoch, currentStep, metrics, startTime, endTime, errorMessage, finalMetrics

27. `modelVersions` - Versões de modelos
    - Campos: id, modelId, version, trainingJobId, filePath, performanceMetrics, benchmarkScores, isActive, createdAt

### ✅ Tabelas de Automação (3)
28. `puppeteerSessions` - Sessões Puppeteer
    - Campos: id, userId, url, status, startedAt, endedAt, metadata

29. `puppeteerResults` - Resultados Puppeteer
    - Campos: id, sessionId, resultType, data, url, createdAt

30. `prompts` - Templates de prompts
    - Campos: id, userId, title, description, content, category, tags, variables, isPublic, useCount, currentVersion, createdAt, updatedAt

31. `promptVersions` - Versões de prompts
    - Campos: id, promptId, version, content, changeDescription, createdAt By UserId, createdAt

32. `aiQualityMetrics` - Métricas de qualidade de IAs
    - Campos: id, aiId, taskType, successRate, avgScore, totalTasks, lastUpdated

---

## 🔌 API tRPC - 168 ENDPOINTS (12 ROUTERS)

### 1. authRouter (5 endpoints)
- `register` - Registrar novo usuário
- `login` - Fazer login
- `verifyToken` - Verificar token JWT
- `refreshToken` - Renovar token
- `logout` - Fazer logout

### 2. usersRouter (8 endpoints)
- `getById` - Buscar usuário por ID
- `getProfile` - Obter perfil atual
- `updateProfile` - Atualizar perfil
- `changePassword` - Trocar senha
- `list` - Listar usuários
- `search` - Buscar usuários
- `updatePreferences` - Atualizar preferências
- `deleteAccount` - Deletar conta

### 3. teamsRouter (9 endpoints)
- `list` - Listar equipes
- `getById` - Obter equipe por ID
- `create` - Criar equipe
- `update` - Atualizar equipe
- `delete` - Deletar equipe
- `getMembers` - Listar membros
- `addMember` - Adicionar membro
- `updateMemberRole` - Atualizar role
- `removeMember` - Remover membro

### 4. projectsRouter (10 endpoints)
- `list` - Listar projetos
- `getById` - Obter projeto por ID
- `create` - Criar projeto
- `update` - Atualizar projeto
- `delete` - Deletar projeto
- `getStats` - Obter estatísticas
- `search` - Buscar projetos
- `archive` - Arquivar projeto
- `restore` - Restaurar projeto
- `duplicate` - Duplicar projeto

### 5. tasksRouter (16 endpoints)
- `list` - Listar tarefas
- `getById` - Obter tarefa por ID
- `create` - Criar tarefa
- `update` - Atualizar tarefa
- `delete` - Deletar tarefa
- `plan` - Planejar com IA (gera subtarefas)
- `listSubtasks` - Listar subtarefas
- `createSubtask` - Criar subtarefa
- `updateSubtask` - Atualizar subtarefa
- `executeSubtask` - Executar com orquestração
- `deleteSubtask` - Deletar subtarefa
- `addDependency` - Adicionar dependência
- `removeDependency` - Remover dependência
- `search` - Buscar tarefas
- `getStats` - Estatísticas
- `reorderSubtasks` - Reordenar subtarefas

### 6. chatRouter (15 endpoints)
- `listConversations` - Listar conversas
- `createConversation` - Criar conversa
- `getConversation` - Obter conversa
- `updateConversation` - Atualizar conversa
- `deleteConversation` - Deletar conversa
- `listMessages` - Listar mensagens
- `sendMessage` - Enviar mensagem
- `getMessage` - Obter mensagem
- `addAttachment` - Adicionar anexo
- `addReaction` - Adicionar reação
- `deleteMessage` - Deletar mensagem
- `editMessage` - Editar mensagem
- `searchMessages` - Buscar mensagens
- `getConversationStats` - Estatísticas
- `markAsRead` - Marcar como lida

### 7. promptsRouter (12 endpoints)
- `list` - Listar prompts
- `getById` - Obter prompt por ID
- `create` - Criar prompt
- `update` - Atualizar prompt (cria versão)
- `delete` - Deletar prompt
- `search` - Buscar prompts
- `listVersions` - Listar versões
- `getVersion` - Obter versão específica
- `revertToVersion` - Reverter para versão
- `duplicate` - Duplicar prompt
- `listCategories` - Listar categorias
- `getStats` - Estatísticas de uso

### 8. modelsRouter (10 endpoints)
- `list` - Listar modelos
- `getById` - Obter modelo por ID
- `create` - Criar modelo
- `update` - Atualizar modelo
- `delete` - Deletar modelo
- `toggleActive` - Ativar/desativar
- `listSpecialized` - Listar IAs especializadas
- `createSpecialized` - Criar IA especializada
- `updateSpecialized` - Atualizar IA
- `search` - Buscar modelos

### 9. lmstudioRouter (12 endpoints)
- `listModels` - Listar modelos disponíveis
- `checkStatus` - Verificar status LM Studio
- `getModelInfo` - Obter info de modelo
- `generateCompletion` - Gerar resposta
- `loadModel` - Carregar modelo
- `switchModel` - Trocar modelo com fallback
- `benchmarkModel` - Fazer benchmark
- `estimateTokens` - Estimar tokens
- `compareModels` - Comparar modelos
- `recommendModel` - Recomendar modelo
- `clearCache` - Limpar cache
- `processLongText` - Processar texto longo

### 10. trainingRouter (22 endpoints)
- `createDataset` - Criar dataset
- `listDatasets` - Listar datasets
- `getDataset` - Obter dataset
- `deleteDataset` - Deletar dataset
- `validateDataset` - Validar formato
- `startTraining` - Iniciar treinamento
- `listTrainingJobs` - Listar jobs
- `getTrainingStatus` - Status do job
- `cancelTraining` - Cancelar job
- `getTrainingMetrics` - Métricas do job
- `getTrainingLogs` - Logs do job
- `pauseTraining` - Pausar job
- `evaluateModel` - Avaliar modelo
- `benchmarkModel` - Benchmark modelo
- `compareModels` - Comparar modelos
- `getModelMetrics` - Métricas modelo
- `exportModel` - Exportar modelo
- `createFineTuningConfig` - Criar config
- `listFineTuningConfigs` - Listar configs
- `estimateTrainingTime` - Estimar tempo
- `getHyperparameterRecommendations` - Recomendar parâmetros
- `scheduleTraining` - Agendar job

### 11. servicesRouter (35 endpoints)
**Service Management (5)**
- `listServices`, `getService`, `createService`, `updateService`, `deleteService`

**GitHub Integration (5)**
- `githubListRepos`, `githubGetRepo`, `githubListIssues`, `githubCreateIssue`, `githubListPullRequests`

**Gmail Integration (5)**
- `gmailListMessages`, `gmailGetMessage`, `gmailSendMessage`, `gmailSearchMessages`, `gmailDeleteMessage`

**Google Drive Integration (5)**
- `driveListFiles`, `driveGetFile`, `driveUploadFile`, `driveDeleteFile`, `driveShareFile`

**Google Sheets Integration (5)**
- `sheetsGetSpreadsheet`, `sheetsReadRange`, `sheetsWriteRange`, `sheetsAppendRow`, `sheetsCreateSpreadsheet`

**OAuth Management (3)**
- `listOAuthTokens`, `refreshOAuthToken`, `revokeOAuthToken`

**API Credentials (4)**
- `listApiCredentials`, `createApiCredential`, `deleteApiCredential`, `testApiCredential`

### 12. monitoringRouter (14 endpoints)
- `getCurrentMetrics` - Métricas atuais
- `getHealth` - Status de saúde
- `getMetricsHistory` - Histórico
- `getApiUsage` - Uso de API
- `getErrorLogs` - Logs de erro
- `getAuditLogs` - Logs de auditoria
- `getServiceStatus` - Status serviços
- `getResourceSummary` - Resumo recursos
- `getEndpointStats` - Stats por endpoint
- `getErrorRate` - Taxa de erro
- `clearOldMetrics` - Limpar antigos
- `getActiveConnections` - Conexões ativas
- `getPerformanceMetrics` - Métricas performance
- `testAlert` - Testar alertas

---

## 🎨 FRONTEND - 15 PÁGINAS

### Páginas Implementadas
1. `/` - Home/Landing page
2. `/login` - Página de login
3. `/register` - Página de registro
4. `/dashboard` - Dashboard com métricas
5. `/chat` - Interface de chat com IA
6. `/tasks` - Gerenciamento de tarefas
7. `/projects` - Gerenciamento de projetos
8. `/models` - Configuração de modelos
9. `/prompts` - Gerenciamento de prompts
10. `/training` - Treinamento de modelos
11. `/monitoring` - Monitoramento do sistema
12. `/services` - Serviços externos
13. `/terminal` - Terminal web (xterm.js)
14. `/settings` - Configurações
15. `/profile` - Perfil do usuário

---

## ✅ CHECKLIST DE VALIDAÇÃO DETALHADA

### 1. VALIDAÇÃO DE BANCO DE DADOS

#### Para CADA tabela, verificar:
- [ ] Nome da tabela está correto no schema.sql
- [ ] Nome da tabela está correto no schema.ts (Drizzle)
- [ ] TODOS os campos estão declarados
- [ ] Tipos de dados estão corretos (INT, VARCHAR, TEXT, JSON, ENUM, etc)
- [ ] Primary keys definidas
- [ ] Foreign keys definidas corretamente
- [ ] Índices criados onde necessário
- [ ] Constraints (UNIQUE, NOT NULL) estão corretos
- [ ] Initial data está presente (INSERT INTO)
- [ ] Relacionamentos Drizzle estão configurados

**Campos Críticos que DEVEM existir**:
- Toda tabela deve ter `id` (auto increment, primary key)
- Tabelas de usuário devem ter `createdAt` e `updatedAt`
- Campos JSON devem estar como `JSON` type
- Enums devem estar declarados com todos valores possíveis

### 2. VALIDAÇÃO DE ENDPOINTS tRPC

#### Para CADA endpoint, verificar:
- [ ] Função existe no router correspondente
- [ ] Input schema (Zod) está completo e correto
- [ ] Validações de campo estão implementadas
- [ ] Query para o banco está correta
- [ ] Tratamento de erros está implementado
- [ ] Response está estruturado corretamente
- [ ] Type safety está funcionando (TypeScript)
- [ ] Endpoint está exportado no router principal

**Teste para cada endpoint**:
```typescript
// Verificar se aceita inputs válidos
// Verificar se rejeita inputs inválidos
// Verificar se retorna estrutura correta
// Verificar se lida com erros do banco
```

### 3. VALIDAÇÃO DE COMPONENTES FRONTEND

#### Para CADA página, verificar:
- [ ] Componente renderiza sem erros
- [ ] Todos botões têm função (onClick definido)
- [ ] Todos links navegam corretamente
- [ ] Formulários têm validação client-side
- [ ] Formulários chamam endpoint correto
- [ ] Loading states funcionam
- [ ] Error states mostram mensagens
- [ ] Success messages aparecem
- [ ] Dados do backend são exibidos
- [ ] Responsive design funciona

**Botões que DEVEM existir em cada CRUD**:
- "Criar Novo" / "Adicionar"
- "Editar" em cada item
- "Deletar" com confirmação
- "Salvar" em formulários
- "Cancelar" em formulários
- Ações específicas (Ativar/Desativar, etc)

### 4. VALIDAÇÃO DE FORMULÁRIOS

#### Para CADA formulário, verificar:
- [ ] TODOS os campos necessários estão presentes
- [ ] Campos têm labels descritivos
- [ ] Placeholders ajudam o usuário
- [ ] Validações client-side funcionam
- [ ] Mensagens de erro são claras
- [ ] Submit chama endpoint correto
- [ ] Loading durante submit
- [ ] Feedback após sucesso
- [ ] Feedback após erro
- [ ] Campos são limpos após sucesso

**Campos comuns faltantes**:
- Dropdowns de seleção (ex: selecionar modelo, selecionar projeto)
- Campos de data/hora com datepicker
- Campos de texto longo (textarea)
- Campos numéricos com validação de range
- Checkboxes para opções booleanas
- Upload de arquivo (onde aplicável)

### 5. VALIDAÇÃO DE INTEGRAÇÕES

#### LM Studio Integration
- [ ] listModels retorna modelos reais
- [ ] generateCompletion funciona com modelos locais
- [ ] Cache de 5 minutos funciona
- [ ] Fallback para outros modelos funciona
- [ ] Streaming funciona no chat

#### External Services
- [ ] GitHub: OAuth funciona, endpoints retornam dados reais
- [ ] Gmail: OAuth funciona, envio de email funciona
- [ ] Drive: Upload funciona, download funciona
- [ ] Sheets: Leitura/escrita funcionam
- [ ] Notion: Integração funciona
- [ ] Slack: Envio de mensagens funciona
- [ ] Discord: Webhooks funcionam

### 6. VALIDAÇÃO DE ORQUESTRAÇÃO

- [ ] planTask gera subtarefas completas
- [ ] executeSubtask executa com IA
- [ ] Validação cruzada funciona (IA2 valida IA1)
- [ ] Desempate funciona (IA3 decide)
- [ ] Detecção de alucinação funciona
- [ ] Logs são salvos corretamente
- [ ] Métricas de qualidade são atualizadas

### 7. VALIDAÇÃO DE SEGURANÇA

- [ ] Rate limiting está ativo
- [ ] JWT authentication funciona
- [ ] Passwords são hasheados (bcrypt)
- [ ] Request validation funciona (Zod)
- [ ] XSS protection está ativo
- [ ] SQL injection protection funciona
- [ ] CORS está configurado
- [ ] Circuit breaker funciona para serviços externos

### 8. VALIDAÇÃO DE PERFORMANCE

- [ ] Cache está funcionando onde implementado
- [ ] Queries do banco estão otimizadas
- [ ] Índices estão criados
- [ ] WebSocket reconnection funciona
- [ ] Paginação funciona em listas grandes
- [ ] Loading states aparecem imediatamente

### 9. 🔄 VALIDAÇÃO CRUZADA DE CAMPOS (BACKEND ↔ FRONTEND)

**CRÍTICO**: Para CADA campo usado no frontend, verificar se existe no backend e vice-versa.

#### Para CADA formulário no frontend:
```typescript
// Exemplo: Formulário de Tasks
const taskForm = {
  title: string,           // ✅ Existe em schema.ts (tasks.title)?
  description: string,     // ✅ Existe em schema.ts (tasks.description)?
  projectId: number,       // ✅ Existe em schema.ts (tasks.projectId)?
  assignedUserId: number,  // ✅ Existe em schema.ts (tasks.assignedUserId)?
  priority: string,        // ✅ Existe em schema.ts (tasks.priority)?
  status: string,          // ✅ Existe em schema.ts (tasks.status)?
  estimatedHours: number,  // ✅ Existe em schema.ts (tasks.estimatedHours)?
  dueDate: Date,           // ✅ Existe em schema.ts (tasks.dueDate)?
}
```

#### Para CADA endpoint tRPC:
```typescript
// Exemplo: tasks.create
input: z.object({
  title: z.string(),           // ✅ Frontend envia este campo?
  description: z.string(),     // ✅ Frontend envia este campo?
  projectId: z.number(),       // ✅ Frontend envia este campo?
  assignedUserId: z.number(),  // ✅ Frontend envia este campo?
  // ... verificar TODOS campos
})
```

#### Para CADA tabela no banco:
```sql
-- Exemplo: tasks table
CREATE TABLE tasks (
  id INT PRIMARY KEY,
  title VARCHAR(255),          -- ✅ Frontend tem input para este campo?
  description TEXT,            -- ✅ Frontend tem textarea para este campo?
  projectId INT,               -- ✅ Frontend tem dropdown para este campo?
  assignedUserId INT,          -- ✅ Frontend tem select para este campo?
  priority ENUM,               -- ✅ Frontend tem dropdown para este campo?
  -- ... verificar TODOS campos
)
```

**CHECKLIST DE VALIDAÇÃO CRUZADA**:
- [ ] Todos campos do frontend existem no schema.ts (Drizzle)
- [ ] Todos campos do schema.ts existem no schema.sql (MySQL)
- [ ] Todos campos do banco têm input correspondente no formulário
- [ ] Todos campos do formulário são enviados para o endpoint correto
- [ ] Todos campos do endpoint são salvos no banco
- [ ] Tipos de dados são consistentes (string, number, Date, etc)
- [ ] Enums têm os mesmos valores em todos lugares
- [ ] Campos opcionais estão marcados como .optional() no Zod
- [ ] Campos obrigatórios têm validação no frontend e backend

**AUDITORIA AUTOMATIZADA**:
```bash
# Script para validar campos
node scripts/validate-fields.js

# Deve verificar:
# 1. Campos no frontend que não existem no backend
# 2. Campos no backend que não têm input no frontend
# 3. Tipos de dados inconsistentes
# 4. Enums com valores diferentes
```

### 10. 🗺️ VALIDAÇÃO COMPLETA DO MAPA DO SITE

**IMPORTANTE**: Revisar TODOS os níveis do sitemap e implementar páginas/funcionalidades faltantes.

#### Estrutura do Sitemap (5 níveis)

**NÍVEL 1: Navegação Principal**
```
/                    → Home/Landing (Pública)
├── /login           → Página de Login (Pública)
├── /register        → Página de Registro (Pública)
└── /dashboard       → Dashboard Principal (Protegida) ✅
```

**NÍVEL 2: Módulos Principais (Dashboard Sidebar)**
```
/dashboard
├── /projects        → Gerenciamento de Projetos ✅
├── /tasks           → Gerenciamento de Tarefas ✅
├── /chat            → Interface de Chat com IA ✅
├── /prompts         → Biblioteca de Prompts ✅
├── /models          → Configuração de Modelos ✅
├── /training        → Treinamento de Modelos ✅
├── /services        → Serviços Externos ✅
├── /monitoring      → Monitoramento do Sistema ✅
├── /terminal        → Terminal Web ✅
├── /settings        → Configurações ✅
└── /profile         → Perfil do Usuário ✅
```

**NÍVEL 3: Subpáginas de Detalhes**
```
/projects
├── /projects/:id                → Detalhes do Projeto ⚠️ VERIFICAR
├── /projects/:id/edit           → Editar Projeto ⚠️ VERIFICAR
├── /projects/:id/tasks          → Tarefas do Projeto ⚠️ VERIFICAR
├── /projects/:id/team           → Equipe do Projeto ⚠️ VERIFICAR
└── /projects/:id/analytics      → Analytics do Projeto ⚠️ VERIFICAR

/tasks
├── /tasks/:id                   → Detalhes da Tarefa ⚠️ VERIFICAR
├── /tasks/:id/edit              → Editar Tarefa ⚠️ VERIFICAR
├── /tasks/:id/subtasks          → Subtarefas ⚠️ VERIFICAR
├── /tasks/:id/history           → Histórico da Tarefa ⚠️ VERIFICAR
└── /tasks/:id/execution         → Execução com IA ⚠️ VERIFICAR

/chat
├── /chat/:conversationId        → Conversa Específica ⚠️ VERIFICAR
├── /chat/:conversationId/edit   → Editar Conversa ⚠️ VERIFICAR
└── /chat/new                    → Nova Conversa ⚠️ VERIFICAR

/prompts
├── /prompts/:id                 → Detalhes do Prompt ⚠️ VERIFICAR
├── /prompts/:id/edit            → Editar Prompt ⚠️ VERIFICAR
├── /prompts/:id/versions        → Histórico de Versões ⚠️ VERIFICAR
└── /prompts/:id/test            → Testar Prompt ⚠️ VERIFICAR

/models
├── /models/:id                  → Detalhes do Modelo ⚠️ VERIFICAR
├── /models/:id/edit             → Editar Modelo ⚠️ VERIFICAR
├── /models/:id/benchmark        → Benchmark do Modelo ⚠️ VERIFICAR
└── /models/:id/usage            → Estatísticas de Uso ⚠️ VERIFICAR

/training
├── /training/datasets           → Gestão de Datasets ⚠️ VERIFICAR
├── /training/datasets/:id       → Detalhes do Dataset ⚠️ VERIFICAR
├── /training/jobs               → Jobs de Treinamento ⚠️ VERIFICAR
├── /training/jobs/:id           → Detalhes do Job ⚠️ VERIFICAR
├── /training/jobs/:id/logs      → Logs do Treinamento ⚠️ VERIFICAR
└── /training/jobs/:id/metrics   → Métricas do Treinamento ⚠️ VERIFICAR

/services
├── /services/github             → Integração GitHub ⚠️ VERIFICAR
├── /services/gmail              → Integração Gmail ⚠️ VERIFICAR
├── /services/drive              → Integração Google Drive ⚠️ VERIFICAR
├── /services/sheets             → Integração Google Sheets ⚠️ VERIFICAR
├── /services/notion             → Integração Notion ⚠️ VERIFICAR
├── /services/slack              → Integração Slack ⚠️ VERIFICAR
└── /services/discord            → Integração Discord ⚠️ VERIFICAR
```

**NÍVEL 4: Modais e Ações**
```
Modais que DEVEM existir:
├── CreateProjectModal           ⚠️ VERIFICAR
├── EditProjectModal             ⚠️ VERIFICAR
├── DeleteProjectModal           ⚠️ VERIFICAR
├── CreateTaskModal              ⚠️ VERIFICAR
├── EditTaskModal                ⚠️ VERIFICAR
├── PlanTaskModal                ⚠️ VERIFICAR (planejamento com IA)
├── ExecuteSubtaskModal          ⚠️ VERIFICAR (execução com IA)
├── CreatePromptModal            ⚠️ VERIFICAR
├── EditPromptModal              ⚠️ VERIFICAR
├── TestPromptModal              ⚠️ VERIFICAR
├── CreateModelModal             ⚠️ VERIFICAR
├── BenchmarkModelModal          ⚠️ VERIFICAR
├── CreateDatasetModal           ⚠️ VERIFICAR
├── StartTrainingModal           ⚠️ VERIFICAR
├── ConnectServiceModal          ⚠️ VERIFICAR (OAuth flow)
├── AddTeamMemberModal           ⚠️ VERIFICAR
└── ConfirmDeleteModal           ⚠️ VERIFICAR (genérico)
```

**NÍVEL 5: Componentes de UI Reutilizáveis**
```
Componentes que DEVEM existir:
├── DataTable                    ⚠️ VERIFICAR (tabelas com paginação)
├── SearchBar                    ⚠️ VERIFICAR (busca global)
├── FilterPanel                  ⚠️ VERIFICAR (filtros por status, data, etc)
├── StatusBadge                  ⚠️ VERIFICAR (badges coloridas)
├── PriorityIndicator            ⚠️ VERIFICAR (indicador de prioridade)
├── UserAvatar                   ⚠️ VERIFICAR (avatar com nome)
├── LoadingSpinner               ⚠️ VERIFICAR (indicador de carregamento)
├── ErrorBoundary                ⚠️ VERIFICAR (tratamento de erros)
├── EmptyState                   ⚠️ VERIFICAR (quando não há dados)
├── Breadcrumbs                  ⚠️ VERIFICAR (navegação)
├── Sidebar                      ⚠️ VERIFICAR (menu lateral)
├── TopBar                       ⚠️ VERIFICAR (barra superior)
├── NotificationBell             ⚠️ VERIFICAR (notificações)
├── ThemeToggle                  ⚠️ VERIFICAR (dark/light mode)
└── CommandPalette               ⚠️ VERIFICAR (atalhos de teclado)
```

**CHECKLIST COMPLETO DO SITEMAP**:
- [ ] Todas páginas do NÍVEL 2 existem e renderizam
- [ ] Todas subpáginas do NÍVEL 3 existem e funcionam
- [ ] Todos modais do NÍVEL 4 abrem e fecham corretamente
- [ ] Todos componentes do NÍVEL 5 são reutilizáveis
- [ ] Navegação entre páginas funciona sem erros
- [ ] Breadcrumbs refletem a hierarquia correta
- [ ] Botões de "Voltar" funcionam em todas páginas
- [ ] Links externos abrem em nova aba
- [ ] 404 page existe para rotas inválidas
- [ ] Loading states durante navegação
- [ ] Transições suaves entre páginas

**SE FALTAR ALGUMA PÁGINA/FUNCIONALIDADE**: IMPLEMENTAR IMEDIATAMENTE!

### 11. 🏆 BOAS PRÁTICAS DE MERCADO (PRODUCTION-READY)

#### A. Code Quality & Standards
```typescript
// ✅ TypeScript Strict Mode
"compilerOptions": {
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "strictFunctionTypes": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true
}

// ✅ ESLint Rules
"rules": {
  "no-console": "warn",           // Evitar console.log em produção
  "no-debugger": "error",         // Remover debuggers
  "@typescript-eslint/no-explicit-any": "error",  // Evitar any
  "@typescript-eslint/explicit-function-return-type": "warn"
}

// ✅ Prettier Formatting
"prettier": {
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

#### B. Security Best Practices
```typescript
// ✅ Environment Variables
// NUNCA commitar .env com secrets
// Usar .env.example como template

// ✅ Password Hashing
import bcrypt from 'bcrypt';
const SALT_ROUNDS = 12; // Mínimo recomendado
const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

// ✅ JWT Token Security
const JWT_EXPIRY = '15m'; // Access token curto
const JWT_REFRESH_EXPIRY = '7d'; // Refresh token mais longo
// SEMPRE validar e verificar tokens

// ✅ Input Sanitization
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);

// ✅ SQL Injection Protection
// Usar Drizzle ORM (já protegido)
// NUNCA concatenar strings em queries

// ✅ XSS Protection
// Usar React (já protegido por padrão)
// NUNCA usar dangerouslySetInnerHTML sem sanitizar

// ✅ CSRF Protection
// Implementar CSRF tokens em formulários
// Validar origin/referer headers

// ✅ Rate Limiting (já implementado)
// Verificar se está ativo em produção
```

#### C. Error Handling & Logging
```typescript
// ✅ Error Handling Pattern
try {
  const result = await riskyOperation();
  return { success: true, data: result };
} catch (error) {
  logger.error('Operation failed', { error, context: { userId, taskId } });
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Failed to complete operation',
    cause: error
  });
}

// ✅ Structured Logging
import winston from 'winston';
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// ✅ Log Levels
logger.error('Critical error');    // 0 - Erros críticos
logger.warn('Warning message');    // 1 - Avisos importantes
logger.info('Info message');       // 2 - Informações gerais
logger.debug('Debug message');     // 3 - Debugging (dev only)
```

#### D. Performance Optimization
```typescript
// ✅ Database Indexing
// Criar índices para queries frequentes
CREATE INDEX idx_tasks_projectId ON tasks(projectId);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assignedUserId ON tasks(assignedUserId);

// ✅ Query Optimization
// Usar SELECT específico ao invés de SELECT *
// Usar LIMIT para paginação
// Usar JOINs ao invés de múltiplas queries

// ✅ Caching Strategy
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutos

// ✅ React Performance
import { memo, useMemo, useCallback } from 'react';
// Usar memo para componentes que não mudam frequentemente
// Usar useMemo para cálculos pesados
// Usar useCallback para funções passadas como props

// ✅ Code Splitting
// Lazy load páginas pesadas
const TrainingPage = lazy(() => import('./pages/Training'));

// ✅ Image Optimization
// Usar WebP quando possível
// Lazy load imagens fora da viewport
// Usar srcset para responsiveness
```

#### E. Testing Standards
```typescript
// ✅ Unit Tests (Vitest)
describe('TaskService', () => {
  it('should create task with valid data', async () => {
    const task = await taskService.createTask(validData);
    expect(task).toBeDefined();
    expect(task.id).toBeGreaterThan(0);
  });

  it('should throw error with invalid data', async () => {
    await expect(taskService.createTask(invalidData))
      .rejects.toThrow('Invalid task data');
  });
});

// ✅ Integration Tests
// Testar fluxos completos (API → DB → API)

// ✅ E2E Tests (Playwright)
test('user can create and execute task', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name=email]', 'test@test.com');
  await page.fill('[name=password]', 'password');
  await page.click('button[type=submit]');
  await page.goto('/tasks');
  await page.click('button:has-text("Nova Tarefa")');
  // ... testar fluxo completo
});

// ✅ Test Coverage
// Mínimo: 70% coverage
// Ideal: 85%+ coverage
// Crítico: 100% coverage em auth, security, payment
```

#### F. Monitoring & Observability
```typescript
// ✅ Health Checks
app.get('/api/health', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    lmstudio: await checkLMStudio(),
    redis: await checkRedis(),
    disk: await checkDiskSpace()
  };
  
  const healthy = Object.values(checks).every(c => c.status === 'ok');
  res.status(healthy ? 200 : 503).json(checks);
});

// ✅ Metrics Collection
import { Histogram, Counter, Gauge } from 'prom-client';

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});

const taskExecutionCounter = new Counter({
  name: 'tasks_executed_total',
  help: 'Total number of tasks executed',
  labelNames: ['status', 'ai_model']
});

// ✅ APM (Application Performance Monitoring)
// Considerar: New Relic, Datadog, ou Sentry

// ✅ Uptime Monitoring
// Configurar alertas para downtime
// Monitorar endpoints críticos a cada 1 minuto
```

#### G. Documentation Standards
```typescript
// ✅ JSDoc Comments
/**
 * Executes a task with AI orchestration
 * @param {number} taskId - The ID of the task to execute
 * @param {ExecutionOptions} options - Execution configuration
 * @returns {Promise<ExecutionResult>} The execution result with AI validations
 * @throws {TaskNotFoundError} If task doesn't exist
 * @throws {AIUnavailableError} If no AI models are available
 * @example
 * const result = await executeTask(123, { aiModel: 'gpt-4' });
 */
async function executeTask(taskId: number, options: ExecutionOptions): Promise<ExecutionResult> {
  // Implementation
}

// ✅ README.md Structure
- Overview
- Features
- Prerequisites
- Installation
- Configuration
- Usage
- API Reference
- Troubleshooting
- Contributing
- License

// ✅ API Documentation
// Usar Swagger/OpenAPI para documentar endpoints
// Manter documentação sincronizada com código
```

#### H. CI/CD Pipeline
```yaml
# ✅ GitHub Actions (.github/workflows/ci.yml)
name: CI/CD Pipeline

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Run linter
        run: npm run lint
      - name: Run type check
        run: npm run type-check
      - name: Run tests
        run: npm run test
      - name: Build
        run: npm run build
  
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: ./deploy.sh
```

#### I. Accessibility (A11y)
```typescript
// ✅ ARIA Labels
<button aria-label="Close modal" onClick={onClose}>×</button>

// ✅ Keyboard Navigation
// Todos elementos interativos devem ser acessíveis via teclado
// Tab, Enter, Space, Arrow keys

// ✅ Color Contrast
// WCAG AA: 4.5:1 para texto normal
// WCAG AA: 3:1 para texto grande

// ✅ Screen Reader Support
<img src="logo.png" alt="Orquestrador de IAs logo" />
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

#### J. Internationalization (i18n)
```typescript
// ✅ Preparar para múltiplos idiomas
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation();
  return <h1>{t('welcome.title')}</h1>;
}

// ✅ Estrutura de traduções
/locales
  /en
    common.json
    errors.json
  /pt-BR
    common.json
    errors.json
```

**CHECKLIST DE BOAS PRÁTICAS**:
- [ ] TypeScript strict mode ativado
- [ ] ESLint configurado e sem erros
- [ ] Prettier formatando código automaticamente
- [ ] Senhas hasheadas com bcrypt (12+ rounds)
- [ ] JWT com expiry adequado (15m access, 7d refresh)
- [ ] Rate limiting ativo em produção
- [ ] Input sanitization implementado
- [ ] Structured logging com Winston/Pino
- [ ] Error handling consistente em todos endpoints
- [ ] Database indexes criados para queries frequentes
- [ ] Caching implementado onde apropriado
- [ ] React performance otimizado (memo, useMemo, useCallback)
- [ ] Code splitting para páginas pesadas
- [ ] Unit tests com 70%+ coverage
- [ ] Integration tests para fluxos críticos
- [ ] E2E tests para user journeys principais
- [ ] Health check endpoint funcional
- [ ] Metrics collection implementado
- [ ] JSDoc comments em funções complexas
- [ ] README.md completo e atualizado
- [ ] API documentation atualizada
- [ ] CI/CD pipeline configurado
- [ ] Accessibility (A11y) implementado
- [ ] Preparado para i18n (futuro)

---

## 🔧 TAREFAS ESPECÍFICAS DA REVISÃO

### TAREFA 1: Auditoria de Schema
```bash
# Executar no banco MySQL
# Verificar se todas tabelas existem
SHOW TABLES;

# Para cada tabela, verificar estrutura
DESCRIBE users;
DESCRIBE tasks;
# ... (todas 28 tabelas)

# Verificar se foreign keys estão corretas
SELECT * FROM information_schema.KEY_COLUMN_USAGE 
WHERE TABLE_SCHEMA = 'orquestraia';

# Verificar índices
SELECT * FROM information_schema.STATISTICS 
WHERE TABLE_SCHEMA = 'orquestraia';
```

**Corrigir se encontrar**:
- Tabelas faltando
- Campos faltando
- Tipos errados
- Foreign keys quebradas
- Índices faltando

### TAREFA 2: Auditoria de Endpoints

Para cada router (`auth`, `users`, `teams`, `projects`, `tasks`, `chat`, `prompts`, `models`, `lmstudio`, `training`, `services`, `monitoring`):

```typescript
// Verificar que arquivo existe
server/trpc/routers/[router-name].ts

// Verificar que está importado no router principal
server/trpc/router.ts

// Para cada endpoint, verificar:
1. Input schema está completo
2. Query/mutation está implementada
3. Validações funcionam
4. Tratamento de erro existe
5. Response está correto
```

**Corrigir se encontrar**:
- Endpoints faltando
- Validações incompletas
- Queries erradas
- Tipos TypeScript errados

### TAREFA 3: Auditoria de Frontend

Para cada página em `client/src/pages/`:

```typescript
// Verificar que arquivo existe
client/src/pages/[PageName].tsx

// Verificar elementos na página:
1. Todos botões têm onClick
2. Todos formulários têm onSubmit
3. Todos inputs têm onChange
4. Loading states existem
5. Error handling existe
6. Chamadas tRPC estão corretas
```

**Corrigir se encontrar**:
- Botões sem função
- Links quebrados
- Formulários incompletos
- Campos faltando
- Validações faltando
- Chamadas de API erradas

### TAREFA 4: Auditoria de Experiência do Usuário

Simular jornadas do usuário:

**Jornada 1: Criar e executar tarefa**
```
1. Login → Dashboard
2. Ir para Tasks
3. Clicar "Nova Tarefa"
4. Preencher formulário (TODOS campos devem funcionar)
5. Salvar
6. Ver tarefa na lista
7. Clicar "Planejar" (deve gerar subtarefas com IA)
8. Ver subtarefas
9. Executar subtarefa
10. Ver resultado
```

**Verificar em CADA passo**:
- Botões funcionam?
- Feedbacks aparecem?
- Dados são salvos?
- Erros são tratados?

**Jornada 2: Chat com IA**
```
1. Ir para Chat
2. Criar nova conversa
3. Enviar mensagem
4. Receber resposta (streaming deve funcionar)
5. Adicionar anexo
6. Adicionar reação
7. Buscar mensagens antigas
```

**Jornada 3: Configurar serviço externo**
```
1. Ir para Services
2. Clicar "Adicionar Serviço"
3. Escolher GitHub
4. Fazer OAuth (deve funcionar)
5. Ver repos listados
6. Criar issue
7. Ver issue criado
```

### TAREFA 5: Auditoria de Segurança

```bash
# Testar rate limiting
curl -X POST http://localhost:3001/api/trpc/auth.login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}' \
  # Fazer 10x rapidamente
  # Deve bloquear após 5 tentativas

# Testar JWT
# Token inválido deve retornar 401
# Token expirado deve retornar 401

# Testar XSS
# Inputs com <script> devem ser sanitizados

# Testar SQL Injection
# Inputs com ' OR '1'='1 devem ser bloqueados
```

---

## 📝 RELATÓRIO DE REVISÃO

Ao final, você deve entregar um relatório com:

### 1. PROBLEMAS ENCONTRADOS

Para cada problema, documentar:
```markdown
## Problema #N: [Título descritivo]

**Severidade**: Crítico / Alto / Médio / Baixo
**Localização**: [arquivo:linha]
**Descrição**: [O que está errado]
**Impacto**: [O que não funciona por causa disso]
**Solução**: [Como corrigir]
```

### 2. CORREÇÕES REALIZADAS

Para cada correção, documentar:
```markdown
## Correção #N: [Título]

**Arquivo**: [caminho completo]
**Linhas alteradas**: [X-Y]
**O que foi feito**: [Descrição]
**Antes**: [código antigo]
**Depois**: [código novo]
**Teste**: [Como verificar que funciona]
```

### 3. FUNCIONALIDADES ADICIONADAS

Se identificar funcionalidades faltantes:
```markdown
## Nova Funcionalidade: [Nome]

**Motivo**: [Por que é necessária]
**Implementação**: [O que foi feito]
**Arquivos criados/modificados**: [lista]
**Como usar**: [Instruções]
```

### 4. MELHORIAS SUGERIDAS

Sugestões para futuro:
```markdown
## Melhoria: [Nome]

**Descrição**: [O que melhorar]
**Benefício**: [Por que é bom]
**Esforço**: [Pequeno/Médio/Grande]
**Prioridade**: [Baixa/Média/Alta]
```

---

## 🚀 SCRIPT DE IMPLANTAÇÃO AUTÔNOMO COM AUTOCORREÇÃO

### SCRIPT DETALHADO COM LOGGING E AUTOCORREÇÃO

**CARACTERÍSTICAS CRÍTICAS**:
- ✅ **Autocorreção**: Detecta e corrige problemas em tempo de execução
- ✅ **Logs Detalhados**: Gera logs completos de cada etapa
- ✅ **Push para GitHub**: Envia logs automaticamente para análise
- ✅ **Retry Logic**: Tenta novamente em caso de falha
- ✅ **Rollback Automático**: Reverte mudanças em caso de erro crítico
- ✅ **Validação Contínua**: Valida cada etapa antes de prosseguir
- ✅ **Relatório Final**: Gera relatório completo do deploy

```bash
#!/bin/bash
# deploy.sh - Script de Deploy AUTÔNOMO do Orquestrador de IAs V3.0
# Versão: 3.0 - Com Autocorreção e Logging Avançado

set -e  # Para em caso de erro não tratado

# ==========================================
# CONFIGURAÇÃO DE LOGGING
# ==========================================

LOG_DIR="/home/flavio/orquestrador-v3/deployment-logs"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="$LOG_DIR/deploy_$TIMESTAMP.log"
ERROR_LOG="$LOG_DIR/error_$TIMESTAMP.log"
SUCCESS_LOG="$LOG_DIR/success_$TIMESTAMP.log"
GITHUB_REPO="fmunizmcorp/orquestrador-ia"
GITHUB_LOGS_BRANCH="deployment-logs"

# Criar diretório de logs
mkdir -p "$LOG_DIR"

# Função de log
log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
    
    if [ "$level" == "ERROR" ]; then
        echo "[$timestamp] $message" >> "$ERROR_LOG"
    elif [ "$level" == "SUCCESS" ]; then
        echo "[$timestamp] $message" >> "$SUCCESS_LOG"
    fi
}

# Função de erro com tentativa de correção
handle_error() {
    local step=$1
    local error_message=$2
    local retry_command=$3
    
    log "ERROR" "Falha na etapa: $step"
    log "ERROR" "Mensagem: $error_message"
    
    # Tentar autocorreção
    log "INFO" "Tentando autocorrigir..."
    
    case $step in
        "npm_install")
            log "INFO" "Limpando node_modules e package-lock.json..."
            rm -rf node_modules package-lock.json
            log "INFO" "Tentando npm install novamente..."
            npm install --legacy-peer-deps 2>&1 | tee -a "$LOG_FILE" || {
                log "ERROR" "Falha mesmo após limpeza. Tentando com --force..."
                npm install --force 2>&1 | tee -a "$LOG_FILE"
            }
            ;;
            
        "npm_build")
            log "INFO" "Verificando erros de TypeScript..."
            npm run type-check 2>&1 | tee -a "$LOG_FILE" || {
                log "WARN" "Erros de TypeScript detectados. Compilando com --no-check..."
                npm run build -- --no-check 2>&1 | tee -a "$LOG_FILE"
            }
            ;;
            
        "mysql_connection")
            log "INFO" "Verificando status do MySQL..."
            sudo systemctl status mysql || {
                log "INFO" "MySQL não está rodando. Iniciando..."
                sudo systemctl start mysql
                sleep 5
            }
            ;;
            
        "mysql_schema")
            log "INFO" "Verificando schema.sql..."
            if [ ! -f "schema.sql" ]; then
                log "ERROR" "schema.sql não encontrado!"
                log "INFO" "Tentando gerar schema a partir do Drizzle..."
                npm run db:generate 2>&1 | tee -a "$LOG_FILE"
            fi
            
            log "INFO" "Tentando aplicar schema novamente..."
            mysql -u$DB_USER -p$DB_PASS $DB_NAME < schema.sql 2>&1 | tee -a "$LOG_FILE" || {
                log "WARN" "Falha ao aplicar schema. Tentando linha por linha..."
                while IFS= read -r line; do
                    if [ ! -z "$line" ] && [[ ! "$line" =~ ^-- ]]; then
                        mysql -u$DB_USER -p$DB_PASS $DB_NAME -e "$line" 2>&1 | tee -a "$LOG_FILE" || log "WARN" "Ignorando erro: $line"
                    fi
                done < schema.sql
            }
            ;;
            
        "port_in_use")
            log "INFO" "Porta $APP_PORT em uso. Tentando liberar..."
            PID=$(lsof -ti:$APP_PORT)
            if [ ! -z "$PID" ]; then
                log "INFO" "Matando processo $PID..."
                kill -9 $PID
                sleep 2
            fi
            ;;
            
        "pm2_start")
            log "INFO" "Verificando PM2..."
            pm2 delete orquestrador-ia 2>/dev/null || true
            sleep 2
            log "INFO" "Verificando arquivo de build..."
            if [ ! -f "./dist/server/index.js" ]; then
                log "ERROR" "Arquivo de build não encontrado. Recompilando..."
                npm run build 2>&1 | tee -a "$LOG_FILE"
            fi
            log "INFO" "Iniciando aplicação novamente..."
            pm2 start ecosystem.config.cjs 2>&1 | tee -a "$LOG_FILE"
            ;;
            
        *)
            log "WARN" "Correção automática não disponível para: $step"
            if [ ! -z "$retry_command" ]; then
                log "INFO" "Executando comando de retry: $retry_command"
                eval "$retry_command" 2>&1 | tee -a "$LOG_FILE"
            fi
            ;;
    esac
}

# Função para enviar logs para GitHub
send_logs_to_github() {
    log "INFO" "Enviando logs para GitHub..."
    
    # Criar branch de logs se não existir
    git checkout -b $GITHUB_LOGS_BRANCH 2>/dev/null || git checkout $GITHUB_LOGS_BRANCH
    
    # Adicionar logs
    git add "$LOG_DIR/"*.log
    
    # Commit
    git commit -m "Deploy logs - $TIMESTAMP" 2>&1 | tee -a "$LOG_FILE" || log "WARN" "Nada novo para commitar"
    
    # Push
    git push origin $GITHUB_LOGS_BRANCH --force 2>&1 | tee -a "$LOG_FILE" || {
        log "WARN" "Falha ao enviar logs. Tentando configurar upstream..."
        git push -u origin $GITHUB_LOGS_BRANCH 2>&1 | tee -a "$LOG_FILE"
    }
    
    # Voltar para branch main
    git checkout main
    
    log "SUCCESS" "Logs enviados para: https://github.com/$GITHUB_REPO/tree/$GITHUB_LOGS_BRANCH/deployment-logs"
}

# Função de validação
validate_step() {
    local step=$1
    local validation_command=$2
    
    log "INFO" "Validando: $step"
    
    if eval "$validation_command" 2>&1 | tee -a "$LOG_FILE"; then
        log "SUCCESS" "✓ $step validado com sucesso"
        return 0
    else
        log "ERROR" "✗ Falha na validação de $step"
        return 1
    fi
}

# ==========================================
# INÍCIO DO DEPLOY
# ==========================================

log "INFO" "================================================"
log "INFO" "🚀 INICIANDO DEPLOY DO ORQUESTRADOR DE IAs V3.0"
log "INFO" "================================================"
log "INFO" "Timestamp: $TIMESTAMP"
log "INFO" "Log File: $LOG_FILE"

# ==========================================
# ETAPA 1: VERIFICAR PRÉ-REQUISITOS
# ==========================================

log "INFO" "================================================"
log "INFO" "ETAPA 1: Verificando pré-requisitos"
log "INFO" "================================================"

check_prerequisite() {
    local cmd=$1
    local name=$2
    local install_cmd=$3
    
    if command -v $cmd >/dev/null 2>&1; then
        local version=$($cmd --version 2>&1 | head -n1)
        log "SUCCESS" "✓ $name instalado: $version"
        return 0
    else
        log "WARN" "✗ $name não instalado"
        if [ ! -z "$install_cmd" ]; then
            log "INFO" "Tentando instalar $name..."
            eval "$install_cmd" 2>&1 | tee -a "$LOG_FILE" || {
                log "ERROR" "Falha ao instalar $name"
                return 1
            }
            log "SUCCESS" "✓ $name instalado com sucesso"
        else
            log "ERROR" "$name é obrigatório e deve ser instalado manualmente"
            return 1
        fi
    fi
}

check_prerequisite "node" "Node.js" ""
check_prerequisite "npm" "npm" ""
check_prerequisite "mysql" "MySQL" ""
check_prerequisite "git" "Git" ""
check_prerequisite "pm2" "PM2" "npm install -g pm2"
check_prerequisite "nginx" "Nginx" "sudo apt-get install -y nginx"

# ==========================================
# ETAPA 2: CONFIGURAR VARIÁVEIS
# ==========================================

log "INFO" "================================================"
log "INFO" "ETAPA 2: Configurando variáveis"
log "INFO" "================================================"

DEPLOY_USER="flavio"
DEPLOY_DIR="/home/flavio/orquestrador-v3"
DB_USER="flavio"
DB_PASS="bdflavioia"
DB_NAME="orquestraia"
APP_PORT="3000"
GIT_REPO="https://github.com/$GITHUB_REPO.git"

log "INFO" "Deploy User: $DEPLOY_USER"
log "INFO" "Deploy Dir: $DEPLOY_DIR"
log "INFO" "Database: $DB_NAME"
log "INFO" "Port: $APP_PORT"

# ==========================================
# ETAPA 3: CRIAR DIRETÓRIO
# ==========================================

log "INFO" "================================================"
log "INFO" "ETAPA 3: Criando diretório de deploy"
log "INFO" "================================================"

if [ ! -d "$DEPLOY_DIR" ]; then
    log "INFO" "Criando $DEPLOY_DIR..."
    sudo mkdir -p "$DEPLOY_DIR" 2>&1 | tee -a "$LOG_FILE" || handle_error "mkdir" "Falha ao criar diretório"
    sudo chown -R $DEPLOY_USER:$DEPLOY_USER "$DEPLOY_DIR" 2>&1 | tee -a "$LOG_FILE"
    log "SUCCESS" "✓ Diretório criado"
else
    log "INFO" "Diretório já existe"
fi

cd "$DEPLOY_DIR" || {
    log "ERROR" "Não foi possível acessar $DEPLOY_DIR"
    exit 1
}

log "SUCCESS" "✓ Diretório configurado: $(pwd)"

# ==========================================
# ETAPA 4: CLONAR/ATUALIZAR CÓDIGO
# ==========================================

log "INFO" "================================================"
log "INFO" "ETAPA 4: Baixando código do GitHub"
log "INFO" "================================================"

if [ -d ".git" ]; then
    log "INFO" "Repositório já existe. Atualizando..."
    
    # Salvar mudanças locais
    git stash 2>&1 | tee -a "$LOG_FILE" || log "WARN" "Nenhuma mudança para salvar"
    
    # Fetch latest
    git fetch origin 2>&1 | tee -a "$LOG_FILE" || handle_error "git_fetch" "Falha ao fazer fetch"
    
    # Pull latest
    git pull origin main 2>&1 | tee -a "$LOG_FILE" || {
        log "WARN" "Conflitos detectados. Tentando resolver..."
        git reset --hard origin/main 2>&1 | tee -a "$LOG_FILE"
    }
    
    log "SUCCESS" "✓ Código atualizado"
else
    log "INFO" "Clonando repositório..."
    git clone "$GIT_REPO" . 2>&1 | tee -a "$LOG_FILE" || {
        handle_error "git_clone" "Falha ao clonar repositório"
    }
    log "SUCCESS" "✓ Repositório clonado"
fi

# Verificar branch atual
CURRENT_BRANCH=$(git branch --show-current)
log "INFO" "Branch atual: $CURRENT_BRANCH"

# ==========================================
# ETAPA 5: INSTALAR DEPENDÊNCIAS
# ==========================================

log "INFO" "================================================"
log "INFO" "ETAPA 5: Instalando dependências"
log "INFO" "================================================"

log "INFO" "Verificando package.json..."
if [ ! -f "package.json" ]; then
    log "ERROR" "package.json não encontrado!"
    exit 1
fi

log "INFO" "Executando npm install..."
npm install 2>&1 | tee -a "$LOG_FILE" || {
    handle_error "npm_install" "Falha ao instalar dependências"
}

validate_step "node_modules" "[ -d node_modules ] && [ -f node_modules/.bin/vite ]"

log "SUCCESS" "✓ Dependências instaladas"

# ==========================================
# ETAPA 6: CONFIGURAR .ENV
# ==========================================

log "INFO" "================================================"
log "INFO" "ETAPA 6: Configurando variáveis de ambiente"
log "INFO" "================================================"

# Gerar JWT secret seguro
JWT_SECRET=$(openssl rand -base64 32)
log "INFO" "JWT Secret gerado: ${JWT_SECRET:0:10}..."

# Criar .env
cat > .env << EOF
# Database
DATABASE_URL="mysql://$DB_USER:$DB_PASS@localhost:3306/$DB_NAME"

# Application
PORT=$APP_PORT
NODE_ENV=production
HOST=0.0.0.0

# JWT
JWT_SECRET=$JWT_SECRET
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# LM Studio
LM_STUDIO_URL="http://localhost:1234/v1"
LM_STUDIO_TIMEOUT=30000

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# External Services (configurar conforme necessário)
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Session
SESSION_SECRET=$(openssl rand -base64 32)

# CORS
CORS_ORIGIN="http://192.168.1.247:3000"
EOF

log "SUCCESS" "✓ .env configurado"

# Backup do .env
cp .env ".env.backup.$TIMESTAMP"
log "INFO" "Backup do .env criado: .env.backup.$TIMESTAMP"

# ==========================================
# ETAPA 7: CONFIGURAR BANCO DE DADOS
# ==========================================

log "INFO" "================================================"
log "INFO" "ETAPA 7: Configurando banco de dados"
log "INFO" "================================================"

# Verificar conexão MySQL
log "INFO" "Testando conexão com MySQL..."
mysql -u$DB_USER -p$DB_PASS -e "SELECT 1;" 2>&1 | tee -a "$LOG_FILE" || {
    handle_error "mysql_connection" "Falha ao conectar no MySQL"
}

# Fazer backup do banco existente
log "INFO" "Fazendo backup do banco existente (se houver)..."
mysqldump -u$DB_USER -p$DB_PASS $DB_NAME > "$LOG_DIR/backup_$TIMESTAMP.sql" 2>/dev/null || log "INFO" "Banco não existe ainda (normal em primeira instalação)"

# Criar banco
log "INFO" "Criando banco de dados $DB_NAME..."
mysql -u$DB_USER -p$DB_PASS << MYSQL 2>&1 | tee -a "$LOG_FILE"
DROP DATABASE IF EXISTS $DB_NAME;
CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE $DB_NAME;
SELECT 'Database created successfully' AS status;
MYSQL

log "SUCCESS" "✓ Banco de dados criado"

# Aplicar schema
log "INFO" "Aplicando schema.sql..."
if [ ! -f "schema.sql" ]; then
    log "ERROR" "schema.sql não encontrado!"
    handle_error "mysql_schema" "schema.sql ausente"
else
    mysql -u$DB_USER -p$DB_PASS $DB_NAME < schema.sql 2>&1 | tee -a "$LOG_FILE" || {
        handle_error "mysql_schema" "Falha ao aplicar schema"
    }
    
    # Validar tabelas criadas
    TABLE_COUNT=$(mysql -u$DB_USER -p$DB_PASS -D$DB_NAME -e "SHOW TABLES;" | wc -l)
    log "INFO" "Tabelas criadas: $((TABLE_COUNT - 1))"
    
    if [ $TABLE_COUNT -lt 28 ]; then
        log "WARN" "Esperado 28 tabelas, criado apenas $((TABLE_COUNT - 1))"
    else
        log "SUCCESS" "✓ Schema aplicado com sucesso"
    fi
fi

# ==========================================
# ETAPA 8: BUILD DA APLICAÇÃO
# ==========================================

log "INFO" "================================================"
log "INFO" "ETAPA 8: Compilando aplicação"
log "INFO" "================================================"

log "INFO" "Executando type check..."
npm run type-check 2>&1 | tee -a "$LOG_FILE" || log "WARN" "Erros de TypeScript detectados (continuando...)"

log "INFO" "Executando build..."
npm run build 2>&1 | tee -a "$LOG_FILE" || {
    handle_error "npm_build" "Falha no build"
}

# Validar build
validate_step "build_output" "[ -d dist ] && [ -f dist/server/index.js ]"

# Verificar tamanho do build
BUILD_SIZE=$(du -sh dist | cut -f1)
log "INFO" "Tamanho do build: $BUILD_SIZE"

log "SUCCESS" "✓ Build concluído"

# ==========================================
# ETAPA 9: CONFIGURAR PM2
# ==========================================

log "INFO" "================================================"
log "INFO" "ETAPA 9: Configurando PM2"
log "INFO" "================================================"

# Criar diretório de logs
mkdir -p logs

# Criar ecosystem.config.cjs
cat > ecosystem.config.cjs << EOF
module.exports = {
  apps: [{
    name: 'orquestrador-ia',
    script: './dist/server/index.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: $APP_PORT
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_file: './logs/pm2-combined.log',
    time: true,
    max_memory_restart: '500M',
    exp_backoff_restart_delay: 100,
    autorestart: true,
    watch: false,
    ignore_watch: ['node_modules', 'logs', 'deployment-logs'],
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
EOF

log "SUCCESS" "✓ PM2 configurado"

# ==========================================
# ETAPA 10: INICIAR APLICAÇÃO
# ==========================================

log "INFO" "================================================"
log "INFO" "ETAPA 10: Iniciando aplicação"
log "INFO" "================================================"

# Verificar se porta está em uso
if lsof -Pi :$APP_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    log "WARN" "Porta $APP_PORT em uso"
    handle_error "port_in_use" "Porta ocupada"
fi

# Parar aplicação existente
log "INFO" "Parando aplicação existente (se houver)..."
pm2 delete orquestrador-ia 2>&1 | tee -a "$LOG_FILE" || log "INFO" "Nenhuma aplicação rodando"

sleep 2

# Iniciar aplicação
log "INFO" "Iniciando aplicação..."
pm2 start ecosystem.config.cjs 2>&1 | tee -a "$LOG_FILE" || {
    handle_error "pm2_start" "Falha ao iniciar com PM2"
}

# Salvar configuração PM2
pm2 save 2>&1 | tee -a "$LOG_FILE"

# Configurar startup
pm2 startup 2>&1 | tee -a "$LOG_FILE" | grep -E "sudo|detected" | tee -a "$LOG_FILE"

log "SUCCESS" "✓ Aplicação iniciada"

# Aguardar inicialização
log "INFO" "Aguardando aplicação inicializar..."
sleep 5

# ==========================================
# ETAPA 11: CONFIGURAR NGINX
# ==========================================

log "INFO" "================================================"
log "INFO" "ETAPA 11: Configurando Nginx"
log "INFO" "================================================"

sudo tee /etc/nginx/sites-available/orquestrador > /dev/null << EOF
server {
    listen 80;
    server_name 192.168.1.247;

    # Logs
    access_log /var/log/nginx/orquestrador_access.log;
    error_log /var/log/nginx/orquestrador_error.log;

    # Client body size
    client_max_body_size 100M;

    # Timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;

    location / {
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF

# Habilitar site
sudo ln -sf /etc/nginx/sites-available/orquestrador /etc/nginx/sites-enabled/ 2>&1 | tee -a "$LOG_FILE"

# Testar configuração
log "INFO" "Testando configuração do Nginx..."
sudo nginx -t 2>&1 | tee -a "$LOG_FILE" || {
    log "ERROR" "Configuração do Nginx inválida"
    log "WARN" "Aplicação ainda está acessível em http://localhost:$APP_PORT"
}

# Recarregar Nginx
log "INFO" "Recarregando Nginx..."
sudo systemctl reload nginx 2>&1 | tee -a "$LOG_FILE" || {
    log "WARN" "Falha ao recarregar Nginx. Tentando restart..."
    sudo systemctl restart nginx 2>&1 | tee -a "$LOG_FILE"
}

log "SUCCESS" "✓ Nginx configurado"

# ==========================================
# ETAPA 12: VERIFICAR STATUS E VALIDAR
# ==========================================

log "INFO" "================================================"
log "INFO" "ETAPA 12: Verificando status e validando"
log "INFO" "================================================"

# Status do PM2
log "INFO" "Status do PM2:"
pm2 status 2>&1 | tee -a "$LOG_FILE"

# Verificar se está rodando
sleep 3
PM2_STATUS=$(pm2 jlist | jq -r '.[0].pm2_env.status')
log "INFO" "Status da aplicação: $PM2_STATUS"

if [ "$PM2_STATUS" != "online" ]; then
    log "ERROR" "Aplicação não está online!"
    log "INFO" "Logs de erro:"
    pm2 logs orquestrador-ia --lines 50 --nostream 2>&1 | tee -a "$LOG_FILE"
    handle_error "pm2_start" "Aplicação não iniciou corretamente"
fi

# Health check
log "INFO" "Executando health check..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$APP_PORT/api/health)

if [ "$HEALTH_RESPONSE" == "200" ]; then
    log "SUCCESS" "✓ Health check passou (HTTP $HEALTH_RESPONSE)"
else
    log "WARN" "Health check falhou (HTTP $HEALTH_RESPONSE)"
    log "INFO" "Verificando logs..."
    pm2 logs orquestrador-ia --lines 20 --nostream 2>&1 | tee -a "$LOG_FILE"
fi

# Testar endpoints críticos
log "INFO" "Testando endpoints críticos..."

test_endpoint() {
    local path=$1
    local expected_code=$2
    local response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$APP_PORT$path")
    
    if [ "$response" == "$expected_code" ]; then
        log "SUCCESS" "✓ $path → HTTP $response"
    else
        log "WARN" "✗ $path → HTTP $response (esperado: $expected_code)"
    fi
}

test_endpoint "/api/health" "200"
test_endpoint "/api/trpc" "200"
test_endpoint "/" "200"

# Verificar uso de recursos
log "INFO" "Uso de recursos:"
pm2 show orquestrador-ia 2>&1 | grep -E "memory|cpu" | tee -a "$LOG_FILE"

# ==========================================
# ETAPA 13: GERAR RELATÓRIO E ENVIAR LOGS
# ==========================================

log "INFO" "================================================"
log "INFO" "ETAPA 13: Gerando relatório e enviando logs"
log "INFO" "================================================"

# Contar erros
ERROR_COUNT=$(grep -c "\[ERROR\]" "$LOG_FILE" || echo "0")
WARN_COUNT=$(grep -c "\[WARN\]" "$LOG_FILE" || echo "0")
SUCCESS_COUNT=$(grep -c "\[SUCCESS\]" "$LOG_FILE" || echo "0")

# Gerar relatório
REPORT_FILE="$LOG_DIR/report_$TIMESTAMP.md"
cat > "$REPORT_FILE" << EOF
# Relatório de Deploy - Orquestrador de IAs V3.0

**Data**: $(date +"%Y-%m-%d %H:%M:%S")  
**Timestamp**: $TIMESTAMP  
**Servidor**: 192.168.1.247  
**Usuário**: $DEPLOY_USER  

---

## 📊 Resumo

- ✅ **Sucessos**: $SUCCESS_COUNT
- ⚠️  **Avisos**: $WARN_COUNT
- ❌ **Erros**: $ERROR_COUNT

---

## 🎯 Status Final

$(if [ "$PM2_STATUS" == "online" ] && [ "$HEALTH_RESPONSE" == "200" ]; then
    echo "### ✅ DEPLOY BEM-SUCEDIDO"
    echo ""
    echo "A aplicação está rodando e respondendo corretamente."
else
    echo "### ⚠️ DEPLOY COM PROBLEMAS"
    echo ""
    echo "A aplicação pode não estar funcionando corretamente."
fi)

---

## 🔗 URLs

- **Aplicação**: http://192.168.1.247:3000
- **Health Check**: http://192.168.1.247:3000/api/health
- **tRPC**: http://192.168.1.247:3000/api/trpc

---

## 📈 Informações do Sistema

- **Node.js**: $(node --version)
- **npm**: $(npm --version)
- **PM2**: $(pm2 --version)
- **Branch Git**: $CURRENT_BRANCH
- **Build Size**: $BUILD_SIZE
- **Tabelas no Banco**: $((TABLE_COUNT - 1))

---

## 📋 Próximos Passos

1. Verificar aplicação em: http://192.168.1.247:3000
2. Fazer login e testar funcionalidades
3. Verificar logs: \`pm2 logs orquestrador-ia\`
4. Monitorar PM2: \`pm2 monit\`

---

## 📂 Arquivos de Log

- **Log Principal**: $LOG_FILE
- **Log de Erros**: $ERROR_LOG
- **Log de Sucessos**: $SUCCESS_LOG
- **Backup do Banco**: $LOG_DIR/backup_$TIMESTAMP.sql

---

## 🔄 Comandos Úteis

\`\`\`bash
# Ver logs em tempo real
pm2 logs orquestrador-ia

# Reiniciar aplicação
pm2 restart orquestrador-ia

# Ver status
pm2 status

# Monitoramento
pm2 monit

# Rollback (se necessário)
./rollback.sh $TIMESTAMP
\`\`\`

---

**Logs completos disponíveis em**: https://github.com/$GITHUB_REPO/tree/$GITHUB_LOGS_BRANCH/deployment-logs

EOF

log "SUCCESS" "✓ Relatório gerado: $REPORT_FILE"

# Enviar logs para GitHub
send_logs_to_github

# ==========================================
# FINALIZAÇÃO
# ==========================================

log "INFO" "================================================"
log "INFO" "🎉 DEPLOY CONCLUÍDO!"
log "INFO" "================================================"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                  DEPLOY CONCLUÍDO COM SUCESSO!                 ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📍 Aplicação disponível em: http://192.168.1.247:3000"
echo "📊 Status: $PM2_STATUS"
echo "✅ Sucessos: $SUCCESS_COUNT | ⚠️  Avisos: $WARN_COUNT | ❌ Erros: $ERROR_COUNT"
echo ""
echo "📂 Logs completos:"
echo "   - $LOG_FILE"
echo "   - $REPORT_FILE"
echo ""
echo "📚 Logs enviados para:"
echo "   https://github.com/$GITHUB_REPO/tree/$GITHUB_LOGS_BRANCH/deployment-logs"
echo ""
echo "🔧 Comandos úteis:"
echo "   - Ver logs: pm2 logs orquestrador-ia"
echo "   - Reiniciar: pm2 restart orquestrador-ia"
echo "   - Status: pm2 status"
echo "   - Monitorar: pm2 monit"
echo ""
echo "🔄 Para rollback: ./rollback.sh $TIMESTAMP"
echo ""

# Salvar timestamp do deploy bem-sucedido
echo "$TIMESTAMP" > "$LOG_DIR/last_successful_deploy.txt"

exit 0
```

### COMANDO SIMPLIFICADO PARA USUÁRIO LEIGO

Para o usuário executar com **APENAS 1 COMANDO**:

```bash
# ⚡ DEPLOY EM 1 COMANDO ⚡
curl -fsSL https://raw.githubusercontent.com/fmunizmcorp/orquestrador-ia/main/deploy.sh | bash

# OU baixar e executar em 3 passos:

# 1. Baixar script
curl -O https://raw.githubusercontent.com/fmunizmcorp/orquestrador-ia/main/deploy.sh

# 2. Dar permissão
chmod +x deploy.sh

# 3. Executar
./deploy.sh
```

**O QUE O SCRIPT FAZ AUTOMATICAMENTE**:
- ✅ Verifica e instala pré-requisitos (Node, npm, MySQL, PM2, Nginx)
- ✅ Baixa código do GitHub
- ✅ Instala dependências
- ✅ Configura banco de dados (cria schema, aplica migrations, insere dados iniciais)
- ✅ Compila aplicação
- ✅ Inicia com PM2 (2 instâncias em cluster)
- ✅ Configura Nginx como proxy reverso
- ✅ Faz health check
- ✅ **AUTOCORRIGE** problemas encontrados
- ✅ **GERA LOGS DETALHADOS**
- ✅ **ENVIA LOGS PARA GITHUB** para análise
- ✅ Gera relatório completo

**APÓS O DEPLOY**:
- Acesse: http://192.168.1.247:3000
- Logs disponíveis em: https://github.com/fmunizmcorp/orquestrador-ia/tree/deployment-logs/deployment-logs

### SCRIPT DE ROLLBACK AUTOMÁTICO

Caso algo dê errado, o sistema pode reverter para versão anterior:

```bash
#!/bin/bash
# rollback.sh - Rollback Automático com Logs

set -e

TIMESTAMP_TO_RESTORE=$1
DEPLOY_DIR="/home/flavio/orquestrador-v3"
LOG_DIR="$DEPLOY_DIR/deployment-logs"
DB_USER="flavio"
DB_PASS="bdflavioia"
DB_NAME="orquestraia"

# Se timestamp não fornecido, usar o último deploy bem-sucedido
if [ -z "$TIMESTAMP_TO_RESTORE" ]; then
    if [ -f "$LOG_DIR/last_successful_deploy.txt" ]; then
        TIMESTAMP_TO_RESTORE=$(cat "$LOG_DIR/last_successful_deploy.txt")
        echo "🔄 Usando último deploy bem-sucedido: $TIMESTAMP_TO_RESTORE"
    else
        echo "❌ Timestamp não fornecido e nenhum backup encontrado"
        echo "Uso: ./rollback.sh [TIMESTAMP]"
        exit 1
    fi
fi

ROLLBACK_LOG="$LOG_DIR/rollback_$(date +"%Y%m%d_%H%M%S").log"

log() {
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1" | tee -a "$ROLLBACK_LOG"
}

log "================================================"
log "↩️  INICIANDO ROLLBACK"
log "================================================"
log "Timestamp alvo: $TIMESTAMP_TO_RESTORE"

cd "$DEPLOY_DIR" || exit 1

# 1. Parar aplicação
log "Parando aplicação..."
pm2 stop orquestrador-ia 2>&1 | tee -a "$ROLLBACK_LOG" || log "WARN: Falha ao parar (pode não estar rodando)"

# 2. Restaurar código
log "Restaurando código do Git..."

# Verificar se há backup local
if git rev-parse HEAD~1 >/dev/null 2>&1; then
    log "Voltando para commit anterior..."
    git stash 2>&1 | tee -a "$ROLLBACK_LOG"
    git reset --hard HEAD~1 2>&1 | tee -a "$ROLLBACK_LOG"
else
    log "WARN: Não há commit anterior. Mantendo código atual."
fi

# 3. Restaurar banco de dados
BACKUP_FILE="$LOG_DIR/backup_$TIMESTAMP_TO_RESTORE.sql"
if [ -f "$BACKUP_FILE" ]; then
    log "Restaurando banco de dados..."
    mysql -u$DB_USER -p$DB_PASS $DB_NAME < "$BACKUP_FILE" 2>&1 | tee -a "$ROLLBACK_LOG"
    log "✓ Banco restaurado"
else
    log "WARN: Backup do banco não encontrado: $BACKUP_FILE"
fi

# 4. Restaurar .env
ENV_BACKUP=".env.backup.$TIMESTAMP_TO_RESTORE"
if [ -f "$ENV_BACKUP" ]; then
    log "Restaurando .env..."
    cp "$ENV_BACKUP" .env
    log "✓ .env restaurado"
else
    log "WARN: Backup do .env não encontrado: $ENV_BACKUP"
fi

# 5. Reinstalar dependências
log "Reinstalando dependências..."
rm -rf node_modules package-lock.json
npm install 2>&1 | tee -a "$ROLLBACK_LOG"

# 6. Rebuild
log "Recompilando aplicação..."
npm run build 2>&1 | tee -a "$ROLLBACK_LOG"

# 7. Reiniciar aplicação
log "Reiniciando aplicação..."
pm2 restart orquestrador-ia 2>&1 | tee -a "$ROLLBACK_LOG" || {
    log "Falha ao reiniciar. Tentando start..."
    pm2 start ecosystem.config.cjs 2>&1 | tee -a "$ROLLBACK_LOG"
}

# 8. Aguardar e verificar
sleep 5
log "Verificando status..."
pm2 status 2>&1 | tee -a "$ROLLBACK_LOG"

# Health check
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health)
if [ "$HEALTH_RESPONSE" == "200" ]; then
    log "✅ Rollback concluído com sucesso!"
    log "Health check: HTTP $HEALTH_RESPONSE"
else
    log "⚠️  Rollback concluído mas health check falhou: HTTP $HEALTH_RESPONSE"
    log "Verifique os logs: pm2 logs orquestrador-ia"
fi

log "================================================"
log "Log completo: $ROLLBACK_LOG"
log "================================================"

# Enviar log de rollback para GitHub
git checkout deployment-logs 2>/dev/null || git checkout -b deployment-logs
git add "$ROLLBACK_LOG"
git commit -m "Rollback log - $(date +"%Y%m%d_%H%M%S")" 2>&1 | tee -a "$ROLLBACK_LOG"
git push origin deployment-logs --force 2>&1 | tee -a "$ROLLBACK_LOG"
git checkout main

echo ""
echo "🔄 Rollback concluído!"
echo "📂 Log: $ROLLBACK_LOG"
echo "📍 Aplicação: http://192.168.1.247:3000"
```

---

## 📊 MÉTRICAS DE SUCESSO

Ao final da revisão, o sistema deve atingir:

- [ ] ✅ **0 erros de compilação**
- [ ] ✅ **0 warnings críticos**
- [ ] ✅ **100% dos endpoints funcionais**
- [ ] ✅ **100% das páginas renderizam**
- [ ] ✅ **100% dos formulários funcionam**
- [ ] ✅ **100% dos botões têm função**
- [ ] ✅ **0 links quebrados**
- [ ] ✅ **Todas 28 tabelas criadas**
- [ ] ✅ **Todos campos mapeados corretamente**
- [ ] ✅ **Initial data em todas tabelas**
- [ ] ✅ **Segurança implementada**
- [ ] ✅ **Testes básicos passam**
- [ ] ✅ **Deploy script funciona**
- [ ] ✅ **Sistema acessível em produção**

---

## 🎯 ENTREGA FINAL

Você deve entregar:

### 1. Código Corrigido
- Todos arquivos corrigidos
- Commit com mensagem descritiva
- Push para GitHub

### 2. Relatório de Revisão
- Documento Markdown completo
- Lista de problemas encontrados
- Lista de correções realizadas
- Funcionalidades adicionadas
- Melhorias sugeridas

### 3. Scripts de Deploy
- `deploy.sh` - Script completo e testado
- `rollback.sh` - Script de rollback
- `README_DEPLOY.md` - Instruções para leigo

### 4. Validação de Funcionalidades
- Checklist completo preenchido
- Screenshots de cada página funcionando
- Vídeo de demonstração (opcional)

### 5. Documentação Atualizada
- README.md atualizado
- CHANGELOG.md com todas mudanças
- API_REFERENCE.md atualizado
- USER_GUIDE.md para usuários finais

---

## ⚠️ ATENÇÃO ESPECIAL

### Campos Comumente Esquecidos

1. **Formulário de Tasks**:
   - Dropdown para selecionar projeto
   - Dropdown para selecionar usuário responsável
   - Campo de prioridade (dropdown)
   - Campo de data de entrega (datepicker)
   - Campo de horas estimadas (number)

2. **Formulário de Models**:
   - Dropdown para selecionar provider
   - Campo de context window (number)
   - Checkbox para isActive
   - Campo de capabilities (textarea ou multi-select)

3. **Formulário de Chat**:
   - Dropdown para selecionar modelo
   - Campo de system prompt (textarea)
   - Botão para enviar arquivo
   - Botão para enviar mensagem
   - Área de exibição de streaming

4. **Formulário de Training**:
   - Dropdown para selecionar modelo base
   - Dropdown para selecionar dataset
   - Campos de hyperparameters (learning rate, batch size, epochs)
   - Slider para validation split
   - Checkbox para early stopping

### Botões Comumente Sem Função

- ✅ Todos botões "Salvar" devem chamar endpoint
- ✅ Todos botões "Cancelar" devem fechar modal
- ✅ Todos botões "Editar" devem abrir formulário
- ✅ Todos botões "Deletar" devem pedir confirmação
- ✅ Todos botões "Ativar/Desativar" devem chamar toggle endpoint

### Links Comumente Quebrados

- ✅ Links na sidebar devem navegar
- ✅ Breadcrumbs devem navegar
- ✅ Links em cards devem ir para detalhes
- ✅ Logo deve voltar para home

---

## 🔥 PRIORIDADES

### P0 - Crítico (deve funcionar para deploy)
1. Login/Register
2. Dashboard básico
3. Lista de tasks
4. Criar task
5. Chat básico
6. Banco de dados funcional

### P1 - Alto (importante para usabilidade)
1. Todos CRUDs completos
2. Orquestração funcionando
3. LM Studio integrado
4. Formulários validados
5. Error handling

### P2 - Médio (melhora experiência)
1. Terminal web
2. Training de modelos
3. Serviços externos
4. Monitoring avançado

### P3 - Baixo (nice to have)
1. Animações
2. Dark mode
3. Mobile responsive
4. PWA features

---

---

## 🤖 SCRIPTS DE VALIDAÇÃO AUTOMATIZADA

Para garantir a qualidade do código, crie e execute os seguintes scripts:

### 1. validate-fields.js - Validação Cruzada de Campos

```javascript
#!/usr/bin/env node
/**
 * Script para validar consistência de campos entre Backend e Frontend
 * Verifica:
 * - Campos do frontend existem no schema do backend
 * - Campos do backend têm inputs no frontend
 * - Tipos de dados são consistentes
 * - Enums têm os mesmos valores
 */

const fs = require('fs');
const path = require('path');

// Cores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

const log = {
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ  ${msg}${colors.reset}`)
};

// Extrair campos do schema Drizzle
function extractSchemaFields(schemaPath) {
  const content = fs.readFileSync(schemaPath, 'utf-8');
  const tables = {};
  
  // Regex para encontrar tabelas e campos
  const tableRegex = /export const (\w+) = mysqlTable\(['"](\w+)['"]/g;
  const fieldRegex = /(\w+):\s*(\w+)\(['"](\w+)['"]\)/g;
  
  let match;
  while ((match = tableRegex.exec(content)) !== null) {
    const tableName = match[2];
    tables[tableName] = { fields: [], enums: [] };
  }
  
  while ((match = fieldRegex.exec(content)) !== null) {
    const [, fieldName, fieldType, dbName] = match;
    // Adicionar lógica para extrair campos por tabela
  }
  
  return tables;
}

// Extrair campos de formulários React
function extractFormFields(componentsPath) {
  const forms = {};
  
  // Recursivamente buscar arquivos .tsx
  function scanDir(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (file.endsWith('.tsx')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        
        // Buscar inputs com name attribute
        const inputRegex = /<input[^>]*name=['"](\w+)['"]/g;
        const selectRegex = /<select[^>]*name=['"](\w+)['"]/g;
        const textareaRegex = /<textarea[^>]*name=['"](\w+)['"]/g;
        
        let match;
        const fields = new Set();
        
        while ((match = inputRegex.exec(content)) !== null) {
          fields.add(match[1]);
        }
        while ((match = selectRegex.exec(content)) !== null) {
          fields.add(match[1]);
        }
        while ((match = textareaRegex.exec(content)) !== null) {
          fields.add(match[1]);
        }
        
        if (fields.size > 0) {
          forms[file] = Array.from(fields);
        }
      }
    });
  }
  
  scanDir(componentsPath);
  return forms;
}

// Validar consistência
function validateConsistency(schemaFields, formFields) {
  let errors = 0;
  let warnings = 0;
  
  log.info('Iniciando validação de consistência de campos...\n');
  
  // Verificar campos do frontend que não existem no backend
  Object.entries(formFields).forEach(([formFile, fields]) => {
    log.info(`Validando formulário: ${formFile}`);
    
    fields.forEach(field => {
      let found = false;
      
      Object.entries(schemaFields).forEach(([table, data]) => {
        if (data.fields.includes(field)) {
          found = true;
        }
      });
      
      if (!found) {
        log.error(`Campo "${field}" no formulário mas não encontrado no schema`);
        errors++;
      } else {
        log.success(`Campo "${field}" validado`);
      }
    });
    
    console.log('');
  });
  
  // Verificar campos do backend que não têm input no frontend
  Object.entries(schemaFields).forEach(([table, data]) => {
    log.info(`Validando tabela: ${table}`);
    
    data.fields.forEach(field => {
      // Pular campos automáticos
      if (['id', 'createdAt', 'updatedAt'].includes(field)) {
        return;
      }
      
      let found = false;
      
      Object.values(formFields).forEach(fields => {
        if (fields.includes(field)) {
          found = true;
        }
      });
      
      if (!found) {
        log.warn(`Campo "${field}" na tabela "${table}" mas sem input no frontend`);
        warnings++;
      }
    });
    
    console.log('');
  });
  
  return { errors, warnings };
}

// Executar validação
try {
  const schemaPath = path.join(__dirname, '../server/db/schema.ts');
  const componentsPath = path.join(__dirname, '../client/src');
  
  log.info('🔍 Extraindo campos do schema...');
  const schemaFields = extractSchemaFields(schemaPath);
  
  log.info('🔍 Extraindo campos dos formulários...');
  const formFields = extractFormFields(componentsPath);
  
  const { errors, warnings } = validateConsistency(schemaFields, formFields);
  
  console.log('\n' + '='.repeat(60));
  console.log('RESULTADO DA VALIDAÇÃO');
  console.log('='.repeat(60));
  console.log(`Erros: ${errors}`);
  console.log(`Avisos: ${warnings}`);
  
  if (errors > 0) {
    log.error('\nValidação FALHOU! Corrija os erros antes de fazer deploy.');
    process.exit(1);
  } else if (warnings > 0) {
    log.warn('\nValidação passou com avisos. Revise antes do deploy.');
    process.exit(0);
  } else {
    log.success('\nValidação passou! Todos campos consistentes.');
    process.exit(0);
  }
} catch (error) {
  log.error(`Erro ao executar validação: ${error.message}`);
  process.exit(1);
}
```

### 2. validate-endpoints.js - Validação de Endpoints tRPC

```javascript
#!/usr/bin/env node
/**
 * Script para validar todos endpoints tRPC
 * Verifica:
 * - Todos routers estão importados no router principal
 * - Todos endpoints têm input/output schema
 * - Nenhum endpoint está quebrado
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

const log = {
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ  ${msg}${colors.reset}`)
};

function validateRouters() {
  const routersPath = path.join(__dirname, '../server/trpc/routers');
  const mainRouterPath = path.join(__dirname, '../server/trpc/router.ts');
  
  log.info('Validando routers tRPC...\n');
  
  // Listar todos arquivos de router
  const routerFiles = fs.readdirSync(routersPath)
    .filter(f => f.endsWith('.ts') && f !== 'index.ts');
  
  log.info(`Encontrados ${routerFiles.length} routers`);
  
  // Ler router principal
  const mainRouterContent = fs.readFileSync(mainRouterPath, 'utf-8');
  
  let errors = 0;
  
  routerFiles.forEach(file => {
    const routerName = file.replace('.ts', '');
    log.info(`Verificando router: ${routerName}`);
    
    // Verificar se está importado
    const importRegex = new RegExp(`import.*${routerName}Router.*from.*routers/${routerName}`);
    if (!importRegex.test(mainRouterContent)) {
      log.error(`Router ${routerName} não importado no router principal`);
      errors++;
    } else {
      log.success(`Router ${routerName} importado corretamente`);
    }
    
    // Verificar se está registrado no appRouter
    const registerRegex = new RegExp(`${routerName}:\\s*${routerName}Router`);
    if (!registerRegex.test(mainRouterContent)) {
      log.error(`Router ${routerName} não registrado no appRouter`);
      errors++;
    } else {
      log.success(`Router ${routerName} registrado corretamente`);
    }
    
    // Ler conteúdo do router
    const routerContent = fs.readFileSync(path.join(routersPath, file), 'utf-8');
    
    // Contar endpoints (query ou mutation)
    const endpointRegex = /\.(query|mutation)\(/g;
    const endpoints = (routerContent.match(endpointRegex) || []).length;
    log.info(`  → ${endpoints} endpoints encontrados`);
    
    console.log('');
  });
  
  console.log('='.repeat(60));
  console.log(`Total de erros: ${errors}`);
  
  if (errors > 0) {
    log.error('Validação FALHOU!');
    process.exit(1);
  } else {
    log.success('Todos routers válidos!');
    process.exit(0);
  }
}

validateRouters();
```

### 3. validate-sitemap.js - Validação do Sitemap

```javascript
#!/usr/bin/env node
/**
 * Script para validar estrutura do sitemap
 * Verifica:
 * - Todas rotas estão definidas
 * - Todas páginas existem
 * - Nenhum link quebrado
 */

const fs = require('fs');
const path = require('path');

const expectedRoutes = [
  '/',
  '/login',
  '/register',
  '/dashboard',
  '/projects',
  '/projects/:id',
  '/tasks',
  '/tasks/:id',
  '/chat',
  '/chat/:conversationId',
  '/prompts',
  '/prompts/:id',
  '/models',
  '/models/:id',
  '/training',
  '/training/datasets',
  '/training/jobs',
  '/services',
  '/monitoring',
  '/terminal',
  '/settings',
  '/profile'
];

function validateSitemap() {
  const pagesPath = path.join(__dirname, '../client/src/pages');
  
  console.log('🗺️  Validando sitemap...\n');
  
  let errors = 0;
  let missing = [];
  
  expectedRoutes.forEach(route => {
    // Converter rota para nome de arquivo
    let pageName = route.replace('/', '').replace(/\//g, '-');
    if (pageName === '') pageName = 'Home';
    if (pageName.includes(':')) {
      pageName = pageName.split('/')[0];
    }
    pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    
    const pageFile = path.join(pagesPath, `${pageName}.tsx`);
    
    if (fs.existsSync(pageFile)) {
      console.log(`✓ ${route} → ${pageName}.tsx`);
    } else {
      console.log(`❌ ${route} → ${pageName}.tsx (NÃO ENCONTRADO)`);
      errors++;
      missing.push(route);
    }
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`Rotas esperadas: ${expectedRoutes.length}`);
  console.log(`Rotas faltando: ${errors}`);
  
  if (errors > 0) {
    console.log('\nPáginas faltando:');
    missing.forEach(r => console.log(`  - ${r}`));
    process.exit(1);
  } else {
    console.log('\n✅ Todas páginas presentes!');
    process.exit(0);
  }
}

validateSitemap();
```

### 4. package.json - Adicionar Scripts

```json
{
  "scripts": {
    "validate:fields": "node scripts/validate-fields.js",
    "validate:endpoints": "node scripts/validate-endpoints.js",
    "validate:sitemap": "node scripts/validate-sitemap.js",
    "validate:all": "npm run validate:fields && npm run validate:endpoints && npm run validate:sitemap",
    "pre-deploy": "npm run lint && npm run type-check && npm run validate:all && npm run test"
  }
}
```

### 5. CI/CD Integration (.github/workflows/validate.yml)

```yaml
name: Validação Completa

on:
  push:
    branches: [main, development]
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run ESLint
        run: npm run lint
        
      - name: Run TypeScript Check
        run: npm run type-check
        
      - name: Validate Fields
        run: npm run validate:fields
        
      - name: Validate Endpoints
        run: npm run validate:endpoints
        
      - name: Validate Sitemap
        run: npm run validate:sitemap
        
      - name: Run Tests
        run: npm run test
        
      - name: Build
        run: npm run build
        
      - name: Upload Logs
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: validation-logs
          path: logs/
```

---

## 📋 CHECKLIST FINAL DE ENTREGA

Antes de marcar a revisão como completa, TODOS itens devem estar ✅:

### Código
- [ ] Zero erros de compilação TypeScript
- [ ] Zero erros de ESLint
- [ ] Código formatado com Prettier
- [ ] Todos imports corretos
- [ ] Nenhum console.log em produção
- [ ] Nenhum TODO ou FIXME crítico

### Banco de Dados
- [ ] 28 tabelas criadas
- [ ] Todos campos mapeados
- [ ] Foreign keys corretas
- [ ] Índices criados
- [ ] Initial data inserido
- [ ] Backup script funcional

### Backend (tRPC)
- [ ] 168 endpoints implementados
- [ ] Todos endpoints testados
- [ ] Validação Zod completa
- [ ] Error handling em todos endpoints
- [ ] Rate limiting ativo
- [ ] JWT authentication funcional
- [ ] Circuit breaker configurado

### Frontend
- [ ] 15 páginas renderizam sem erro
- [ ] Todos formulários funcionam
- [ ] Todos botões têm função
- [ ] Todos links navegam corretamente
- [ ] Loading states implementados
- [ ] Error states implementados
- [ ] Validações client-side funcionam
- [ ] Responsive design funciona

### Integrações
- [ ] LM Studio conectado e funcional
- [ ] GitHub OAuth funcional
- [ ] Gmail OAuth funcional
- [ ] Google Drive funcional
- [ ] Google Sheets funcional
- [ ] Notion integração funcional
- [ ] Slack integração funcional
- [ ] Discord webhooks funcionais

### Orquestração de IAs
- [ ] Planejamento de tarefas funcional
- [ ] Execução de subtarefas funcional
- [ ] Validação cruzada funcional
- [ ] Detecção de alucinação funcional
- [ ] Logs salvos corretamente
- [ ] Métricas atualizadas

### Segurança
- [ ] Senhas hasheadas (bcrypt 12+ rounds)
- [ ] JWT com expiry adequado
- [ ] Input sanitization implementado
- [ ] XSS protection ativo
- [ ] SQL injection protection ativo
- [ ] CORS configurado
- [ ] Rate limiting testado

### Performance
- [ ] Cache funcionando
- [ ] Queries otimizadas
- [ ] Índices no banco
- [ ] Code splitting implementado
- [ ] Imagens otimizadas
- [ ] Build otimizado (< 2MB)

### Testing
- [ ] Unit tests escritos
- [ ] Integration tests escritos
- [ ] E2E tests para fluxos críticos
- [ ] 70%+ code coverage
- [ ] Todos testes passando

### Documentação
- [ ] README.md completo
- [ ] API docs atualizado
- [ ] User guide criado
- [ ] Deployment guide criado
- [ ] CHANGELOG.md atualizado
- [ ] JSDoc comments em funções críticas

### Deploy
- [ ] deploy.sh testado e funcional
- [ ] rollback.sh testado e funcional
- [ ] PM2 configurado
- [ ] Nginx configurado
- [ ] Health check funcional
- [ ] Logs sendo gerados
- [ ] Logs enviados para GitHub
- [ ] Monitoring ativo

### Validações Automatizadas
- [ ] validate-fields.js passando
- [ ] validate-endpoints.js passando
- [ ] validate-sitemap.js passando
- [ ] CI/CD pipeline configurado
- [ ] Pre-deploy checks funcionando

### Experiência do Usuário
- [ ] Nenhum botão sem função
- [ ] Nenhum link quebrado
- [ ] Nenhum campo faltante em formulários
- [ ] Feedbacks claros em todas ações
- [ ] Erros mostram mensagens úteis
- [ ] Loading states aparecem
- [ ] Navegação intuitiva

---

## 🎯 OBJETIVOS FINAIS

**LEMBRE-SE**: O objetivo é entregar um sistema **100% FUNCIONAL** pronto para uso em produção, sem erros, sem funcionalidades pela metade, sem botões quebrados. 

### Critérios de Sucesso:
1. ✅ Usuário leigo consegue fazer deploy em 1 comando
2. ✅ Sistema funciona sem intervenção após deploy
3. ✅ Todas funcionalidades 100% operacionais
4. ✅ Nenhum erro em produção
5. ✅ Logs detalhados disponíveis para análise
6. ✅ Rollback funcional em caso de problema
7. ✅ Documentação completa e clara
8. ✅ Código profissional e production-ready

### Quando Considerar PRONTO:
- ✅ **TODOS** os itens do checklist estão marcados
- ✅ Script de deploy executa sem erros
- ✅ Aplicação responde em http://192.168.1.247:3000
- ✅ Health check retorna HTTP 200
- ✅ Login funciona
- ✅ Criar tarefa funciona
- ✅ Planejar tarefa com IA funciona
- ✅ Executar subtarefa com IA funciona
- ✅ Chat funciona
- ✅ Todas integrações externas funcionam
- ✅ Logs estão sendo gerados e enviados para GitHub

**IMPORTANTE**: 
- ❌ NÃO abandone dificuldades - corrija todos problemas
- ❌ NÃO deixe funcionalidades pela metade - complete tudo
- ❌ NÃO pule validações - execute todas
- ❌ NÃO ignore warnings críticos - corrija todos
- ❌ NÃO entregue sem testar - valide tudo

**BOA SORTE NA REVISÃO!** 🚀

---

**Após concluir a revisão**, envie:
1. Código completo revisado e corrigido
2. Relatório detalhado de mudanças
3. Script de deploy testado
4. Documentação atualizada
5. Link para logs no GitHub
6. Vídeo de demonstração (opcional mas recomendado)

**O sistema deve estar 100% pronto para uso IMEDIATO pelo usuário final.**
