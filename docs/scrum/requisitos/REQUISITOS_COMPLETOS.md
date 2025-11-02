# 📋 ORQUESTRADOR IA V3 - REQUISITOS COMPLETOS E DETALHADOS

**Versão:** 3.0.0  
**Data:** 2025-11-02  
**Status:** Documento Mestre de Requisitos

---

## 🎯 VISÃO GERAL DO SISTEMA

Sistema completo de orquestração de múltiplas IAs com validação cruzada obrigatória, detecção de alucinação, recuperação automática e integração com LM Studio e serviços externos.

---

## 📊 ARQUITETURA DO SISTEMA

### Backend
- **Framework:** Node.js 18+ com TypeScript 5.3
- **API:** tRPC (Type-safe RPC)
- **ORM:** Drizzle ORM
- **Database:** MySQL 8.0
- **Process Manager:** PM2
- **Server:** Express 4.18

### Frontend
- **Framework:** React 18.2 com TypeScript 5.3
- **Build:** Vite 5
- **Router:** React Router v6
- **State:** Context API
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

### Serviços Integrados
- **LM Studio:** Servidor local de modelos (porta 1234)
- **Puppeteer:** Automação web
- **Serviços Externos:** GitHub, Gmail, Drive, Sheets, Notion, Slack, Discord

---

## 🗄️ DATABASE - 48 TABELAS

### GRUPO 1: AUTENTICAÇÃO E USUÁRIOS
1. **users**
   - id, openId, name, email, username, passwordHash
   - lastLoginAt, avatarUrl, bio, preferences (JSON)
   - role (admin/user), createdAt, updatedAt
   - **Índices:** openId (unique), email, username

### GRUPO 2: PROVEDORES E MODELOS DE IA
2. **aiProviders**
   - id, name, type (local/api), endpoint, apiKey
   - isActive, config (JSON), createdAt, updatedAt
   - **Índices:** type, isActive

3. **aiModels**
   - id, providerId (FK), name, modelId, capabilities (JSON)
   - contextWindow, isLoaded, priority, isActive
   - modelPath, quantization, parameters, sizeBytes
   - createdAt, updatedAt
   - **Índices:** providerId, isLoaded, isActive

4. **modelDiscovery**
   - id, modelName, modelPath, sizeBytes
   - quantization, parameters, discoveredAt, lastSeen
   - isImported
   - **Índices:** modelName, isImported

5. **modelRatings**
   - id, modelId (FK), userId (FK), rating, comment
   - taskType, createdAt
   - **Índices:** modelId, userId

### GRUPO 3: IAS ESPECIALIZADAS
6. **specializedAIs**
   - id, userId (FK), name, description, category
   - defaultModelId (FK), fallbackModelIds (JSON)
   - systemPrompt, capabilities (JSON), isActive
   - createdAt, updatedAt
   - **Índices:** userId, category, isActive

7. **aiQualityMetrics**
   - id, aiId (FK), taskType, successRate
   - avgScore, totalTasks, lastUpdated
   - **Índices:** aiId + taskType (unique), taskType

### GRUPO 4: CREDENCIAIS E CONTAS EXTERNAS
8. **credentials**
   - id, userId (FK), service, credentialType
   - encryptedData (AES-256-GCM), metadata (JSON)
   - isActive, expiresAt, createdAt, updatedAt
   - **Índices:** userId + service, isActive

9. **credentialTemplates**
   - id, service (unique), fields (JSON)
   - instructions, isActive, createdAt, updatedAt
   - **Índices:** service (unique)

10. **externalAPIAccounts**
    - id, userId (FK), provider, accountName
    - credentialId (FK), creditBalance, creditLimit
    - usageThisMonth, alertThreshold, isActive
    - lastSync, createdAt, updatedAt
    - **Índices:** userId, provider

11. **creditUsage**
    - id, accountId (FK), taskId (FK), creditsUsed
    - provider, modelUsed, tokensUsed, createdAt
    - **Índices:** accountId, taskId, createdAt

### GRUPO 5: EQUIPES E PROJETOS
12. **teams**
    - id, name, description, ownerId (FK)
    - createdAt, updatedAt
    - **Índices:** ownerId

13. **teamMembers**
    - id, teamId (FK), userId (FK)
    - role (owner/admin/member/viewer), joinedAt
    - **Índices:** teamId + userId (unique), teamId, userId

14. **projects**
    - id, name, description, userId (FK), teamId (FK)
    - status (planning/active/on_hold/completed/archived)
    - startDate, endDate, budget, progress
    - tags (JSON), isActive, createdAt, updatedAt
    - **Índices:** userId, teamId, status

### GRUPO 6: TAREFAS E EXECUÇÃO
15. **tasks**
    - id, userId (FK), projectId (FK), assignedUserId (FK)
    - title, description
    - status (pending/planning/in_progress/executing/validating/completed/blocked/failed/cancelled/paused)
    - priority (low/medium/high/urgent)
    - estimatedHours, actualHours, dueDate
    - createdAt, updatedAt, completedAt
    - **Índices:** userId, projectId, assignedUserId, status, priority

16. **subtasks**
    - id, taskId (FK), assignedModelId (FK)
    - title, description, prompt, result
    - status (pending/executing/completed/failed/validating/rejected)
    - orderIndex, estimatedDifficulty (easy/medium/hard/expert)
    - reviewedBy (FK), reviewNotes, completedAt
    - createdAt, updatedAt
    - **Índices:** taskId, status, orderIndex

17. **taskDependencies**
    - id, taskId (FK), dependsOnTaskId (FK)
    - dependencyType (finish_to_start/start_to_start/finish_to_finish/start_to_finish)
    - createdAt
    - **Índices:** taskId + dependsOnTaskId (unique), taskId, dependsOnTaskId

18. **taskMonitoring**
    - id, taskId (FK), cpuUsage, ramUsage, gpuUsage
    - executionTime, recordedAt
    - **Índices:** taskId, recordedAt

19. **executionLogs**
    - id, taskId (FK), subtaskId (FK)
    - level (debug/info/warning/error/critical)
    - message, metadata (JSON), createdAt
    - **Índices:** taskId, subtaskId, level, createdAt

### GRUPO 7: ORQUESTRAÇÃO E VALIDAÇÃO
20. **orchestrationLogs**
    - id, taskId (FK), subtaskId (FK), aiId (FK)
    - action, input, output, executionTime
    - status (success/failed/timeout/cancelled)
    - createdAt
    - **Índices:** taskId, subtaskId, aiId, action

21. **crossValidations**
    - id, subtaskId (FK), validatorAiId (FK)
    - score, approved, feedback, divergence
    - createdAt
    - **Índices:** subtaskId, validatorAiId, approved

22. **hallucinationDetections**
    - id, subtaskId (FK), detectedAt
    - confidenceScore, indicators (JSON)
    - wasRecovered, recoveryMethod, createdAt
    - **Índices:** subtaskId, wasRecovered

23. **executionResults**
    - id, subtaskId (FK), executorAiId (FK)
    - result, score, metrics (JSON), createdAt
    - **Índices:** subtaskId, executorAiId

### GRUPO 8: CHAT
24. **chatConversations**
    - id, userId (FK), title, aiId (FK), modelId (FK)
    - systemPrompt, lastMessageAt, messageCount
    - isRead, isActive, metadata (JSON)
    - createdAt, updatedAt
    - **Índices:** userId, isActive

25. **chatMessages**
    - id, conversationId (FK), parentMessageId (FK)
    - role (user/assistant/system), content
    - isEdited, attachments (JSON), metadata (JSON)
    - createdAt, updatedAt
    - **Índices:** conversationId, parentMessageId, createdAt

26. **messageAttachments**
    - id, messageId (FK), fileName, fileType
    - fileUrl, fileSize, createdAt
    - **Índices:** messageId

27. **messageReactions**
    - id, messageId (FK), userId (FK), emoji
    - createdAt
    - **Índices:** messageId + userId + emoji (unique), messageId

### GRUPO 9: TEMPLATES, WORKFLOWS E PROMPTS
28. **prompts**
    - id, userId (FK), title, description, content
    - category, tags (JSON), variables (JSON)
    - isPublic, useCount, currentVersion
    - createdAt, updatedAt
    - **Índices:** userId, category, isPublic

29. **promptVersions**
    - id, promptId (FK), version, content
    - changelog, createdByUserId (FK), createdAt
    - **Índices:** promptId + version (unique), promptId

30. **aiTemplates**
    - id, userId (FK), name, description, category
    - templateData (JSON), isPublic, usageCount
    - createdAt, updatedAt
    - **Índices:** userId, category, isPublic

31. **aiWorkflows**
    - id, userId (FK), name, description
    - steps (JSON), isActive, createdAt, updatedAt
    - **Índices:** userId, isActive

### GRUPO 10: INSTRUÇÕES E CONHECIMENTO
32. **instructions**
    - id, userId (FK), aiId (FK), title, content
    - priority, isActive, createdAt, updatedAt
    - **Índices:** userId, aiId, isActive

33. **knowledgeBase**
    - id, userId (FK), title, content, category
    - tags (JSON), embedding (JSON), isActive
    - createdAt, updatedAt
    - **Índices:** userId, category, isActive

34. **knowledgeSources**
    - id, knowledgeBaseId (FK), sourceType, sourceUrl
    - sourceData (JSON), lastSync, createdAt, updatedAt
    - **Índices:** knowledgeBaseId, sourceType

### GRUPO 11: ARMAZENAMENTO
35. **storage**
    - id, userId (FK), fileName, filePath
    - fileType, sizeBytes, metadata (JSON), createdAt
    - **Índices:** userId, fileType

### GRUPO 12: TREINAMENTO DE MODELOS
36. **trainingDatasets**
    - id, userId (FK), name, description
    - datasetType (text/code/qa/completion/chat)
    - format (jsonl/csv/txt/parquet)
    - filePath, fileSize, recordCount
    - metadata (JSON), isActive, createdAt, updatedAt
    - **Índices:** userId, datasetType

37. **trainingJobs**
    - id, userId (FK), datasetId (FK), baseModelId (FK)
    - name, description
    - status (pending/preparing/training/validating/completed/failed/cancelled)
    - trainingType (fine-tuning/lora/qlora/full)
    - hyperparameters (JSON), progress
    - currentEpoch, totalEpochs
    - trainingLoss, validationLoss
    - trainingAccuracy, validationAccuracy
    - estimatedTimeRemaining, startedAt, completedAt
    - errorMessage, logFilePath, metadata (JSON)
    - createdAt, updatedAt
    - **Índices:** userId, status, datasetId

38. **modelVersions**
    - id, userId (FK), baseModelId (FK), trainingJobId (FK)
    - versionName, description, modelPath, sizeBytes
    - format (gguf/safetensors/pytorch/onnx)
    - quantization, parameters
    - performanceMetrics (JSON), benchmarkScores (JSON)
    - isActive, isPublic, downloadCount
    - createdAt, updatedAt
    - **Índices:** userId, baseModelId, isPublic

### GRUPO 13: PUPPETEER (AUTOMAÇÃO WEB)
39. **puppeteerSessions**
    - id, sessionId (unique), userId (FK)
    - status (active/closed/error)
    - config (JSON), createdAt, updatedAt, expiresAt
    - **Índices:** userId, sessionId, status

40. **puppeteerResults**
    - id, sessionId (FK), resultType (screenshot/pdf/data/html)
    - data, url, metadata (JSON), createdAt
    - **Índices:** sessionId, resultType

### GRUPO 14: SERVIÇOS EXTERNOS
41. **externalServices**
    - id, userId (FK), serviceName, config (JSON)
    - isActive, createdAt, updatedAt
    - **Índices:** userId, serviceName

42. **oauthTokens**
    - id, userId (FK), serviceId (FK)
    - accessToken, refreshToken, expiresAt, scope
    - createdAt, updatedAt
    - **Índices:** userId, serviceId

43. **apiCredentials**
    - id, userId (FK), serviceName, credentialName
    - encryptedData, createdAt, updatedAt
    - **Índices:** userId, serviceName

### GRUPO 15: MONITORAMENTO DO SISTEMA
44. **systemMetrics**
    - id, cpuUsage, memoryUsage, diskUsage
    - activeConnections, timestamp
    - **Índices:** timestamp

45. **apiUsage**
    - id, userId (FK), endpoint, method
    - statusCode, responseDuration, timestamp
    - **Índices:** userId, endpoint, timestamp

46. **errorLogs**
    - id, userId (FK), level (error/warning/critical)
    - message, stack, metadata (JSON), timestamp
    - **Índices:** userId, level, timestamp

47. **auditLogs**
    - id, userId (FK), action, resourceType, resourceId
    - changes (JSON), ipAddress, userAgent, timestamp
    - **Índices:** userId, action, timestamp

### GRUPO 16: VIEWS/ALIASES
48. **conversations** (VIEW) → chatConversations
49. **messages** (VIEW) → chatMessages

---

## 🎨 FRONTEND - 26 PÁGINAS

### PÁGINAS PRINCIPAIS (18)
1. **Dashboard** (`/`)
   - Visão geral do sistema
   - Estatísticas: tarefas, modelos, especializadas
   - Gráficos de uso
   - Atividades recentes

2. **Profile** (`/profile`)
   - Dados do usuário
   - Avatar, bio, preferências
   - Configurações pessoais

3. **Projects** (`/projects`)
   - Lista de projetos
   - CRUD completo
   - Filtros: status, equipe
   - Progresso visual

4. **Teams** (`/teams`)
   - Lista de equipes
   - CRUD completo
   - Membros da equipe
   - Permissões

5. **Providers** (`/providers`)
   - Lista de provedores de IA
   - CRUD completo
   - Status de conexão
   - Configuração

6. **Models** (`/models`)
   - Lista de modelos
   - CRUD completo
   - Sincronização com LM Studio
   - Status de carregamento
   - Capacidades

7. **SpecializedAIs** (`/specialized-ais`)
   - Lista de IAs especializadas
   - CRUD completo
   - Categorias
   - System prompts
   - Modelo padrão e fallbacks

8. **Credentials** (`/credentials`)
   - Lista de credenciais
   - CRUD completo
   - Criptografia AES-256-GCM
   - Templates de serviços

9. **Tasks** (`/tasks`)
   - Lista de tarefas
   - CRUD completo
   - Filtros: status, prioridade, projeto
   - Acompanhamento de progresso
   - Orquestração

10. **Subtasks** (`/tasks/:id/subtasks`)
    - Lista de subtarefas da tarefa
    - CRUD completo
    - Validação cruzada
    - Resultados
    - Logs de execução

11. **Prompts** (`/prompts`)
    - Lista de prompts
    - CRUD completo
    - Categorias
    - Variáveis
    - Versionamento
    - Público/Privado

12. **Templates** (`/templates`)
    - Lista de templates
    - CRUD completo
    - Categorias
    - Reutilização

13. **Workflows** (`/workflows`)
    - Lista de workflows
    - CRUD completo
    - Steps em JSON
    - Ativo/Inativo

14. **WorkflowBuilder** (`/workflows/builder`)
    - Editor visual de workflows
    - Drag & drop
    - Conexões entre steps
    - Preview

15. **Instructions** (`/instructions`)
    - Lista de instruções
    - CRUD completo
    - Prioridade
    - Vinculação a IAs específicas

16. **KnowledgeBase** (`/knowledge-base`)
    - Lista de itens da base de conhecimento
    - CRUD completo
    - Categorias
    - Tags
    - Embeddings

17. **KnowledgeSources** (`/knowledge-base/:id/sources`)
    - Fontes do item da base
    - CRUD completo
    - Tipos de fonte
    - Sincronização

18. **ExecutionLogs** (`/execution-logs`)
    - Logs de execução
    - Filtros: nível, tarefa, subtask
    - Busca
    - Exportação

### PÁGINAS ADICIONAIS (8)
19. **Chat** (`/chat`)
    - Interface de chat
    - WebSocket em tempo real
    - Conversas
    - Mensagens
    - Anexos
    - Reações

20. **ExternalAPIAccounts** (`/external-api-accounts`)
    - Contas de APIs externas
    - CRUD completo
    - Saldo de créditos
    - Uso mensal
    - Alertas

21. **Services** (`/services`)
    - Serviços externos integrados
    - GitHub, Gmail, Drive, Sheets
    - Notion, Slack, Discord
    - Configuração OAuth
    - Status de conexão

22. **Monitoring** (`/monitoring`)
    - Monitoramento de recursos
    - CPU, RAM, GPU/VRAM, Disco, Rede
    - Gráficos em tempo real
    - Alertas de limites
    - Histórico

23. **Settings** (`/settings`)
    - Configurações gerais
    - LM Studio URL
    - Limites de recursos
    - Preferências do sistema
    - Dark mode

24. **Terminal** (`/terminal`)
    - Terminal SSH integrado
    - Acesso ao servidor
    - Comandos em tempo real

25. **ModelTraining** (`/model-training`)
    - Interface de treinamento
    - Datasets
    - Training jobs
    - Model versions
    - Progress tracking
    - Hyperparameters

26. **Analytics** (`/analytics`)
    - Dashboard analytics avançado
    - Métricas de uso
    - Performance de modelos
    - Estatísticas de tarefas
    - Gráficos interativos

---

## 🔌 BACKEND - 25 ROUTERS tRPC

### ROUTERS IMPLEMENTADOS
1. **providersRouter** - CRUD provedores
2. **modelsRouter** - CRUD modelos + sync LM Studio
3. **specializedAIsRouter** - CRUD IAs especializadas
4. **credentialsRouter** - CRUD credenciais (criptografadas)
5. **tasksRouter** - CRUD tarefas + orquestração
6. **subtasksRouter** - CRUD subtarefas + validação
7. **templatesRouter** - CRUD templates
8. **workflowsRouter** - CRUD workflows
9. **instructionsRouter** - CRUD instruções
10. **knowledgeBaseRouter** - CRUD knowledge base
11. **knowledgeSourcesRouter** - CRUD fontes
12. **executionLogsRouter** - Query logs
13. **chatRouter** - Chat em tempo real
14. **externalAPIAccountsRouter** - CRUD contas APIs
15. **systemMonitorRouter** - Monitoramento recursos
16. **puppeteerRouter** - Automação web
17. **githubRouter** - Integração GitHub
18. **gmailRouter** - Integração Gmail
19. **driveRouter** - Integração Drive
20. **slackRouter** - Integração Slack
21. **notionRouter** - Integração Notion
22. **sheetsRouter** - Integração Sheets
23. **discordRouter** - Integração Discord
24. **trainingRouter** - Treinamento de modelos
25. **projectsRouter** - CRUD projetos (RECÉM CRIADO)
26. **teamsRouter** - CRUD equipes (RECÉM CRIADO)
27. **promptsRouter** - CRUD prompts (RECÉM CRIADO)

---

## 🎯 FUNCIONALIDADES CORE

### 1. ORQUESTRAÇÃO INTELIGENTE
- **Decomposição Automática:** Tarefa → Subtarefas atômicas
- **Atribuição Inteligente:** Modelo ideal por capacidade
- **Execução Paralela:** Subtarefas independentes
- **Validação Cruzada OBRIGATÓRIA:** IA diferente valida resultado
- **Desempate:** Se divergência > 20%, terceira IA desempata
- **ZERO Perda:** Progresso sempre salvo antes de recovery

### 2. DETECÇÃO DE ALUCINAÇÃO
- **Checagem Cruzada:** Múltiplos modelos validam
- **Detecção de Loops:** Repetições infinitas
- **Contradições:** Informações conflitantes
- **Score de Confiança:** 0-100%
- **Recuperação Automática:** Modelo diferente reexecuta
- **Indicadores Salvos:** JSON com detalhes

### 3. INTEGRAÇÃO LM STUDIO
- **Leitura sob Demanda:** Não usa banco para modelos
- **Cache 5 Minutos:** Performance otimizada
- **Sincronização Automática:** Detecta novos modelos
- **Status de Carregamento:** isLoaded em tempo real
- **Capacidades Automáticas:** Detecta por nome do modelo

### 4. PUPPETEER (AUTOMAÇÃO WEB)
- **Sessões Persistentes:** Mantém estado do browser
- **Screenshots:** Captura de tela
- **PDFs:** Geração de documentos
- **Scraping:** Extração de dados
- **Formulários:** Preenchimento automático
- **Timeout Configurável:** Por sessão

### 5. MONITORAMENTO DE RECURSOS
- **CPU:** Uso, cores, temperatura
- **RAM:** Total, usado, livre, %
- **GPU/VRAM:** NVIDIA, AMD, Intel, Apple Silicon
- **Disco:** Total, usado, livre, %
- **Rede:** RX/TX em tempo real
- **Limites Automáticos:** Pausa tarefas se > limites

### 6. SERVIÇOS EXTERNOS
- **GitHub:** Repos, issues, PRs, commits
- **Gmail:** Envio, leitura, filtros
- **Drive:** Upload, download, busca
- **Sheets:** Leitura, escrita, fórmulas
- **Notion:** Páginas, databases
- **Slack:** Mensagens, canais
- **Discord:** Bots, webhooks

### 7. TREINAMENTO DE MODELOS
- **Datasets:** Upload, parse, validação
- **Training Jobs:** Fine-tuning, LoRA, QLoRA, Full
- **Hyperparameters:** Configuráveis
- **Progress Tracking:** Epochs, loss, accuracy
- **Model Versions:** Versionamento de modelos treinados
- **Benchmarks:** Testes de performance

### 8. CHAT EM TEMPO REAL
- **WebSocket:** Comunicação bidirecional
- **Conversas:** Múltiplas conversas simultâneas
- **Mensagens:** User, assistant, system
- **Anexos:** Upload de arquivos
- **Reações:** Emojis em mensagens
- **Histórico:** Persistência completa

---

## 🔒 SEGURANÇA

### CRIPTOGRAFIA
- **Algoritmo:** AES-256-GCM
- **Chave:** 32 caracteres em .env
- **IV:** Aleatório por credencial
- **Auth Tag:** Verificação de integridade

### OAUTH2
- **Auto-refresh:** Tokens renovados automaticamente
- **Scopes:** Configuráveis por serviço
- **Revogação:** Remoção segura de acesso

### AUDITORIA
- **Audit Logs:** Todas as ações críticas
- **IP Address:** Registro de origem
- **User Agent:** Identificação de cliente
- **Changes:** Diff completo (JSON)

---

## ⚡ PERFORMANCE

### CACHE
- **LM Studio:** 5 minutos
- **Queries:** Memoização em tRPC
- **Imagens:** Cache no browser

### OTIMIZAÇÕES
- **Lazy Loading:** Componentes sob demanda
- **Code Splitting:** Chunks otimizados
- **Tree Shaking:** Remoção de código não usado
- **Compression:** Gzip/Brotli

### LIMITES
- **CPU Máx:** 80%
- **RAM Máx:** 90%
- **VRAM Máx:** 95%
- **Disco Máx:** 85%
- **Request Timeout:** 300s (LM Studio), 60s (APIs)

---

## 🧪 REQUISITOS DE TESTES

### TESTES UNITÁRIOS
- Cada router deve ter testes
- Cada serviço deve ter testes
- Cobertura mínima: 80%

### TESTES DE INTEGRAÇÃO
- APIs tRPC end-to-end
- Database queries
- Serviços externos (mocked)

### TESTES E2E
- Fluxo completo de tarefas
- Orquestração + validação
- Chat em tempo real
- CRUD de todas as entidades

### TESTES DE PERFORMANCE
- Carga: 100 requisições simultâneas
- Memória: Sem memory leaks
- Response time: < 200ms (médio)

---

## 📦 DEPLOYMENT

### REQUISITOS DO SERVIDOR
- **OS:** Ubuntu 22.04+ / Debian 11+ / CentOS 8+
- **Node.js:** v18+
- **MySQL:** 8.0+
- **RAM:** 2GB mínimo (4GB recomendado)
- **Disco:** 5GB livres
- **Portas:** 3001 (app), 1234 (LM Studio)

### PROCESSO DE DEPLOY
1. Clone do repositório
2. Instalação de dependências
3. Configuração .env
4. Criação de database
5. Execução de migrations
6. Build (client + server)
7. Liberação de portas
8. Inicialização PM2
9. Verificação de saúde

### MONITORAMENTO
- PM2 para process management
- Logs em `logs/out.log` e `logs/error.log`
- Health check em `/api/health`
- Status endpoint em `/api/status`

---

## 🎯 CRITÉRIOS DE ACEITAÇÃO

### FUNCIONALIDADE
✅ Todas as 48 tabelas criadas
✅ Todos os 27 routers funcionando
✅ Todas as 26 páginas renderizando
✅ CRUD completo em cada entidade
✅ LM Studio sincronizando modelos
✅ Orquestração com validação cruzada
✅ Detecção de alucinação ativa
✅ Chat em tempo real
✅ Monitoramento de recursos
✅ Puppeteer funcionando
✅ Serviços externos conectados

### QUALIDADE
✅ Zero erros no console
✅ Zero warnings críticos
✅ Tipos TypeScript 100% corretos
✅ Linting sem erros
✅ Testes passando (80%+ cobertura)

### PERFORMANCE
✅ Página inicial < 3s
✅ Navegação < 500ms
✅ API response < 200ms (média)
✅ Build < 30s

### SEGURANÇA
✅ Credenciais criptografadas
✅ Tokens protegidos
✅ Inputs validados
✅ SQL injection prevenido
✅ XSS prevenido

---

## 📝 DOCUMENTAÇÃO OBRIGATÓRIA

### CÓDIGO
- JSDoc em funções públicas
- Comentários em lógica complexa
- README atualizado
- CHANGELOG mantido

### API
- Endpoints documentados
- Schemas de input/output
- Exemplos de uso
- Erros possíveis

### USUÁRIO
- Guia de instalação
- Guia de uso
- FAQ
- Troubleshooting

---

## 🔄 PROCESSO DE ATUALIZAÇÃO

### PRÉ-DEPLOY
1. Testes locais completos
2. Code review aprovado
3. Changelog atualizado
4. Backup de database

### DEPLOY
1. Stop PM2
2. Git pull
3. npm install
4. Migrations (se houver)
5. npm run build
6. PM2 restart
7. Verificação de saúde

### PÓS-DEPLOY
1. Smoke tests
2. Monitoramento de erros
3. Verificação de performance
4. Rollback se necessário

---

**FIM DO DOCUMENTO DE REQUISITOS COMPLETOS**
