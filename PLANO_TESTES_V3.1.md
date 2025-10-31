# 🧪 PLANO DE TESTES COMPLETO - V3.1

**Data**: 31 de Outubro de 2025  
**Objetivo**: Testar TUDO - cada link, cada botão, cada campo, cada página  
**Metodologia**: Testes manuais sistemáticos com checklist detalhado

---

## 📋 ESTRUTURA DOS TESTES

Cada página será testada com os seguintes critérios:

### ✅ Critérios de Teste:
1. **Carregamento** - Página carrega sem erros
2. **Visibilidade** - Todo texto é legível (dark/light mode)
3. **Navegação** - Todos os links funcionam
4. **Formulários** - Todos os campos aceitam input
5. **Botões CRUD** - Create, Read, Update, Delete funcionam
6. **Dados Real** - Dados vêm do banco MySQL (não mockados)
7. **Validações** - Validações de formulário funcionam
8. **Feedback** - Mensagens de sucesso/erro aparecem
9. **Performance** - Resposta em tempo aceitável

---

## 🎯 FASE 1: PÁGINAS COM ROUTERS COMPLETOS (7 páginas)

### 1. Dashboard (`/`) ✅

#### Elementos a testar:
- [ ] **Cards de estatísticas**
  - [ ] Card "Total de Tarefas" mostra número correto do DB
  - [ ] Card "Tarefas Ativas" mostra número correto
  - [ ] Card "Taxa de Conclusão" calcula corretamente
  - [ ] Card "Projetos Ativos" mostra número correto
  - [ ] Texto dos cards é visível em dark/light mode
  
- [ ] **Métricas do sistema**
  - [ ] CPU Usage carrega do backend
  - [ ] Memory Usage carrega do backend
  - [ ] Gráficos são visíveis
  - [ ] Valores são atualizados

- [ ] **Status dos serviços**
  - [ ] Lista de serviços carrega
  - [ ] Status (online/offline) está correto
  - [ ] Cores dos badges estão visíveis

- [ ] **Navegação**
  - [ ] Link "Ver Todas as Tarefas" funciona
  - [ ] Link "Ver Todos os Projetos" funciona
  - [ ] Botão "Atualizar Métricas" funciona

#### Endpoints tRPC a verificar:
```typescript
monitoring.getCurrentMetrics()
monitoring.getServiceStatus()
tasks.getStats()
projects.list()
```

#### Testes de dados:
```sql
-- Verificar no MySQL se os dados batem
SELECT COUNT(*) FROM tasks;
SELECT COUNT(*) FROM tasks WHERE status = 'in_progress';
SELECT COUNT(*) FROM projects WHERE status = 'active';
```

---

### 2. Tasks (`/tasks`) ✅

#### Elementos a testar:
- [ ] **Listagem de tarefas**
  - [ ] Tabela carrega tarefas do DB
  - [ ] Colunas são visíveis (Título, Status, Prioridade, Data)
  - [ ] Paginação funciona (se houver)
  - [ ] Filtros funcionam (por status, prioridade)
  - [ ] Busca funciona

- [ ] **Botão "Nova Tarefa"**
  - [ ] Modal abre
  - [ ] Campos do formulário:
    - [ ] Título (obrigatório)
    - [ ] Descrição
    - [ ] Projeto (dropdown carrega projetos do DB)
    - [ ] Prioridade (low/medium/high/urgent)
    - [ ] Usuário assignado (dropdown)
    - [ ] Data de vencimento (date picker)
  - [ ] Validação: Título obrigatório
  - [ ] Botão "Salvar" salva no DB
  - [ ] Mensagem de sucesso aparece
  - [ ] Modal fecha
  - [ ] Tabela atualiza com nova tarefa

- [ ] **Botão "Editar" (cada linha)**
  - [ ] Modal abre com dados da tarefa
  - [ ] Todos os campos estão preenchidos
  - [ ] Alterações são salvas no DB
  - [ ] Mensagem de sucesso aparece

- [ ] **Botão "Deletar" (cada linha)**
  - [ ] Modal de confirmação aparece
  - [ ] Botão "Confirmar" deleta do DB
  - [ ] Mensagem de sucesso aparece
  - [ ] Tarefa some da tabela

- [ ] **Botão "Planejar com IA"**
  - [ ] Chama orquestrador
  - [ ] Gera subtarefas
  - [ ] Subtarefas são salvas no DB
  - [ ] Lista de subtarefas aparece

- [ ] **Subtarefas**
  - [ ] Expandir tarefa mostra subtarefas
  - [ ] Botão "Executar Subtarefa" funciona
  - [ ] Status de subtarefa atualiza
  - [ ] Drag & drop para reordenar funciona

#### Endpoints tRPC a verificar:
```typescript
tasks.list({ projectId?, status?, limit, offset })
tasks.create({ title, description, projectId, ... })
tasks.update({ id, title?, status?, ... })
tasks.delete({ id })
tasks.plan({ id }) // Gera subtarefas com IA
tasks.listSubtasks({ taskId })
tasks.executeSubtask({ id })
```

#### Testes SQL:
```sql
-- Criar tarefa de teste
INSERT INTO tasks (userId, title, description, projectId, status, priority) 
VALUES (1, 'Teste Task', 'Descrição teste', 1, 'pending', 'medium');

-- Verificar subtarefas
SELECT * FROM subtasks WHERE taskId = ?;

-- Deletar tarefa de teste
DELETE FROM tasks WHERE id = ?;
```

---

### 3. Chat (`/chat`) ✅

#### Elementos a testar:
- [ ] **Lista de conversas**
  - [ ] Sidebar carrega conversas do DB
  - [ ] Últimas mensagens aparecem
  - [ ] Data da última mensagem é visível
  - [ ] Click em conversa seleciona

- [ ] **Botão "Nova Conversa"**
  - [ ] Modal abre
  - [ ] Campos:
    - [ ] Título (opcional)
    - [ ] Modelo (dropdown de modelos)
    - [ ] System Prompt (textarea)
  - [ ] Botão "Criar" salva no DB
  - [ ] Nova conversa aparece na lista

- [ ] **Área de mensagens**
  - [ ] Mensagens carregam do DB
  - [ ] Mensagens do usuário (alinhadas à direita)
  - [ ] Mensagens do assistente (alinhadas à esquerda)
  - [ ] Scroll para mensagens antigas funciona
  - [ ] Timestamps são visíveis

- [ ] **Campo de input de mensagem**
  - [ ] Textarea aceita texto
  - [ ] Botão "Enviar" funciona
  - [ ] Mensagem é salva no DB
  - [ ] Mensagem aparece na área de chat
  - [ ] Resposta da IA é gerada (se modelo disponível)

- [ ] **Botão "Anexar arquivo"**
  - [ ] File picker abre
  - [ ] Arquivo é enviado
  - [ ] Anexo é salvo no DB
  - [ ] Anexo aparece na mensagem

- [ ] **Reações**
  - [ ] Botões de emoji aparecem ao hover
  - [ ] Click adiciona reação
  - [ ] Reação é salva no DB
  - [ ] Contador de reações atualiza

- [ ] **Editar mensagem**
  - [ ] Botão "Editar" aparece ao hover
  - [ ] Campo de edição abre
  - [ ] Alteração é salva no DB
  - [ ] Badge "editado" aparece

- [ ] **Deletar mensagem**
  - [ ] Botão "Deletar" aparece ao hover
  - [ ] Confirmação aparece
  - [ ] Mensagem é deletada do DB

#### Endpoints tRPC:
```typescript
chat.listConversations({ userId, limit, offset })
chat.createConversation({ userId, title?, modelId, systemPrompt? })
chat.listMessages({ conversationId, limit, offset })
chat.sendMessage({ conversationId, content, role })
chat.editMessage({ id, content })
chat.deleteMessage({ id })
chat.addAttachment({ messageId, fileName, fileType, fileUrl })
chat.addReaction({ messageId, userId, emoji })
```

---

### 4. Teams (`/teams`) ✅

#### Elementos a testar:
- [ ] **Listagem de equipes**
  - [ ] Grid/cards carregam do DB
  - [ ] Nome da equipe visível
  - [ ] Descrição visível
  - [ ] Número de membros correto
  - [ ] Avatar/ícone da equipe visível

- [ ] **Botão "Nova Equipe"**
  - [ ] Modal abre
  - [ ] Campos:
    - [ ] Nome (obrigatório)
    - [ ] Descrição
    - [ ] Cor/ícone
  - [ ] Validação: Nome obrigatório
  - [ ] Salva no DB
  - [ ] Nova equipe aparece na lista

- [ ] **Click em equipe**
  - [ ] Abre detalhes da equipe
  - [ ] Lista de membros carrega
  - [ ] Papéis dos membros visíveis (admin/member)

- [ ] **Botão "Adicionar Membro"**
  - [ ] Modal abre
  - [ ] Dropdown de usuários carrega do DB
  - [ ] Campo de papel (admin/member)
  - [ ] Salva no DB
  - [ ] Membro aparece na lista

- [ ] **Botão "Remover Membro"**
  - [ ] Confirmação aparece
  - [ ] Remove do DB
  - [ ] Membro some da lista

- [ ] **Botão "Editar Equipe"**
  - [ ] Modal abre com dados atuais
  - [ ] Alterações salvam no DB
  - [ ] Lista atualiza

- [ ] **Botão "Deletar Equipe"**
  - [ ] Confirmação aparece
  - [ ] Deleta do DB
  - [ ] Equipe some da lista

#### Endpoints tRPC:
```typescript
teams.list()
teams.create({ name, description })
teams.update({ id, name?, description? })
teams.delete({ id })
teams.listMembers({ teamId })
teams.addMember({ teamId, userId, role })
teams.removeMember({ teamId, userId })
teams.updateMemberRole({ teamId, userId, role })
```

---

### 5. Projects (`/projects`) ✅

#### Elementos a testar:
- [ ] **Listagem de projetos**
  - [ ] Cards/grid carregam do DB
  - [ ] Nome do projeto visível
  - [ ] Descrição visível
  - [ ] Status (active/completed/archived) visível
  - [ ] Equipe associada visível
  - [ ] Progresso (%) visível

- [ ] **Botão "Novo Projeto"**
  - [ ] Modal abre
  - [ ] Campos:
    - [ ] Nome (obrigatório)
    - [ ] Descrição
    - [ ] Equipe (dropdown)
    - [ ] Data de início
    - [ ] Data de término
  - [ ] Salva no DB
  - [ ] Novo projeto aparece

- [ ] **Botão "Editar Projeto"**
  - [ ] Modal abre preenchido
  - [ ] Alterações salvam no DB

- [ ] **Botão "Arquivar Projeto"**
  - [ ] Confirmação aparece
  - [ ] Status muda para 'archived'
  - [ ] Projeto some da lista ativa

- [ ] **Botão "Duplicar Projeto"**
  - [ ] Modal confirma duplicação
  - [ ] Novo projeto criado no DB
  - [ ] Cópia aparece na lista

- [ ] **Botão "Deletar Projeto"**
  - [ ] Confirmação aparece
  - [ ] Deleta do DB

- [ ] **Filtros**
  - [ ] Filtro por status funciona
  - [ ] Filtro por equipe funciona
  - [ ] Busca por nome funciona

#### Endpoints tRPC:
```typescript
projects.list({ status?, teamId? })
projects.create({ name, description, teamId, startDate, endDate })
projects.update({ id, name?, description?, status? })
projects.delete({ id })
projects.archive({ id })
projects.duplicate({ id })
projects.getStats({ id })
```

---

### 6. Models (`/models`) ✅

#### Elementos a testar:
- [ ] **Listagem de modelos**
  - [ ] Tabela carrega modelos do DB
  - [ ] Nome do modelo visível
  - [ ] Provedor (OpenAI/Anthropic/Local) visível
  - [ ] Status (disponível/carregado) visível

- [ ] **Botão "Novo Modelo"**
  - [ ] Modal abre
  - [ ] Campos:
    - [ ] Nome (obrigatório)
    - [ ] Provedor (dropdown)
    - [ ] Model ID
    - [ ] API Key (se necessário)
    - [ ] Configurações avançadas
  - [ ] Salva no DB

- [ ] **Botão "Testar Modelo"**
  - [ ] Modal abre
  - [ ] Campo de prompt de teste
  - [ ] Botão "Gerar" chama o modelo
  - [ ] Resposta aparece

- [ ] **Botão "Editar Modelo"**
  - [ ] Modal abre preenchido
  - [ ] Alterações salvam

- [ ] **Botão "Deletar Modelo"**
  - [ ] Confirmação aparece
  - [ ] Deleta do DB

- [ ] **Integração LM Studio**
  - [ ] Botão "Conectar LM Studio" funciona
  - [ ] Lista modelos disponíveis no LM Studio
  - [ ] Botão "Carregar" carrega modelo
  - [ ] Botão "Descarregar" descarrega modelo

#### Endpoints tRPC:
```typescript
models.list()
models.create({ name, providerId, modelId, config })
models.update({ id, name?, config? })
models.delete({ id })
lmstudio.listModels()
lmstudio.listLoadedModels()
lmstudio.loadModel({ modelId })
lmstudio.unloadModel({ modelId })
lmstudio.generate({ modelId, prompt })
```

---

### 7. Profile (`/profile`) ✅

#### Elementos a testar:
- [ ] **Informações do usuário**
  - [ ] Nome carrega do DB
  - [ ] Email carrega do DB
  - [ ] Username carrega do DB
  - [ ] Papel (admin/user) carrega do DB
  - [ ] Avatar/foto aparece

- [ ] **Formulário de edição**
  - [ ] Campo Nome editável
  - [ ] Campo Email editável
  - [ ] Campo Username editável
  - [ ] Botão "Salvar" atualiza DB
  - [ ] Mensagem de sucesso aparece

- [ ] **Preferências**
  - [ ] Toggle Dark/Light mode funciona
  - [ ] Seletor de idioma funciona (se houver)
  - [ ] Notificações toggle funciona
  - [ ] Preferências salvam no DB

- [ ] **Segurança**
  - [ ] Campo "Nova Senha" funciona
  - [ ] Campo "Confirmar Senha" valida
  - [ ] Botão "Alterar Senha" funciona

#### Endpoints tRPC:
```typescript
users.getById({ id })
users.update({ id, name?, email?, username? })
users.updatePreferences({ id, preferences })
```

---

## ⚠️ FASE 2: PÁGINAS COM ROUTERS PARCIAIS (5 páginas)

### 8. Analytics (`/analytics`) ⚠️

#### Elementos a testar:
- [ ] **Página carrega sem erros**
- [ ] **Gráficos**
  - [ ] Gráfico de tarefas por status
  - [ ] Gráfico de projetos por equipe
  - [ ] Gráfico de progresso ao longo do tempo
  - [ ] Dados vêm do DB (não mockados)
- [ ] **Cards de métricas agregadas**
- [ ] **Filtros por data funcionam**

#### Endpoints a criar (se necessário):
```typescript
// Possivelmente usar monitoring + tasks + projects
analytics.getAggregatedStats({ startDate, endDate })
```

---

### 9. Model Training (`/model-training`) ⚠️

#### Elementos a testar:
- [ ] **Aba "Datasets"**
  - [ ] Lista datasets do DB
  - [ ] Botão "Novo Dataset" funciona
  - [ ] Botão "Upload Dataset" funciona
  - [ ] Botão "Validar Dataset" funciona
  - [ ] Botão "Deletar Dataset" funciona

- [ ] **Aba "Training Jobs"**
  - [ ] Lista jobs do DB
  - [ ] Botão "Novo Treinamento" funciona
  - [ ] Campos de hiperparâmetros funcionam
  - [ ] Botão "Iniciar Treinamento" funciona
  - [ ] Progresso do treinamento atualiza em tempo real
  - [ ] Botão "Cancelar" funciona
  - [ ] Botão "Pausar" funciona

- [ ] **Aba "Evaluation"**
  - [ ] Lista avaliações do DB
  - [ ] Botão "Avaliar Modelo" funciona
  - [ ] Métricas aparecem (accuracy, loss, etc)
  - [ ] Botão "Comparar Modelos" funciona

#### Endpoints tRPC (22 disponíveis):
```typescript
training.listDatasets()
training.createDataset({ userId, name, description, dataType, data })
training.validateDataset({ dataType, data })
training.startTraining({ modelId, datasetId, hyperparameters })
training.listTrainingJobs({ userId?, status? })
training.getTrainingStatus({ jobId })
training.cancelTraining({ jobId })
training.evaluateModel({ modelVersionId, testDatasetId })
```

---

### 10. Services (`/services`) ⚠️

#### Elementos a testar:
- [ ] **Lista de serviços conectados**
  - [ ] GitHub
  - [ ] Gmail
  - [ ] Google Drive
  - [ ] Google Sheets
  - [ ] Notion
  - [ ] Slack
  - [ ] Discord

- [ ] **Botão "Conectar Serviço"**
  - [ ] Modal com opções aparece
  - [ ] OAuth flow funciona
  - [ ] Credenciais são salvas no DB

- [ ] **Cards de serviços**
  - [ ] Status (conectado/desconectado) visível
  - [ ] Botão "Testar Conexão" funciona
  - [ ] Botão "Desconectar" funciona

- [ ] **GitHub**
  - [ ] Lista repositórios
  - [ ] Lista issues
  - [ ] Criar issue funciona

- [ ] **Gmail**
  - [ ] Lista emails
  - [ ] Enviar email funciona

- [ ] **Drive**
  - [ ] Lista arquivos
  - [ ] Upload funciona
  - [ ] Download funciona

#### Endpoints tRPC (35+ disponíveis):
```typescript
services.listServices({ userId?, isActive? })
services.createService({ userId, serviceName, config })
services.githubListRepos({ serviceId })
services.gmailListMessages({ serviceId })
services.driveListFiles({ serviceId })
```

---

### 11. Monitoring (`/monitoring`) ⚠️

#### Elementos a testar:
- [ ] **Métricas em tempo real**
  - [ ] CPU Usage
  - [ ] Memory Usage
  - [ ] Disk Usage
  - [ ] Network I/O
  - [ ] Gráficos atualizam em tempo real

- [ ] **Status de serviços**
  - [ ] Lista de serviços
  - [ ] Status (healthy/degraded/down)
  - [ ] Uptime %
  - [ ] Response time

- [ ] **Alertas**
  - [ ] Lista de alertas ativos
  - [ ] Severidade (critical/warning/info)
  - [ ] Botão "Acknowledge" funciona

- [ ] **Logs**
  - [ ] Lista de logs do sistema
  - [ ] Filtro por nível (error/warn/info)
  - [ ] Filtro por data
  - [ ] Busca funciona

#### Endpoints tRPC (14 disponíveis):
```typescript
monitoring.getCurrentMetrics()
monitoring.getMetricsHistory({ startDate, endDate })
monitoring.getServiceStatus()
monitoring.getHealthStatus()
monitoring.getAlerts()
monitoring.acknowledgeAlert({ alertId })
monitoring.getLogs({ level?, startDate?, endDate? })
monitoring.getErrorLogs()
```

---

### 12. Prompts (`/prompts`) ⚠️

#### Elementos a testar:
- [ ] **Listagem de prompts**
  - [ ] Lista carrega do DB
  - [ ] Nome do prompt visível
  - [ ] Categoria visível
  - [ ] Versão visível

- [ ] **Botão "Novo Prompt"**
  - [ ] Modal abre
  - [ ] Campos:
    - [ ] Nome
    - [ ] Categoria
    - [ ] Template
    - [ ] Variáveis
  - [ ] Salva no DB

- [ ] **Botão "Editar Prompt"**
  - [ ] Modal abre preenchido
  - [ ] Alterações salvam no DB
  - [ ] Nova versão é criada

- [ ] **Versões**
  - [ ] Lista versões do prompt
  - [ ] Botão "Reverter" funciona
  - [ ] Diff entre versões aparece

- [ ] **Botão "Testar Prompt"**
  - [ ] Modal abre
  - [ ] Campos de variáveis aparecem
  - [ ] Botão "Gerar" funciona
  - [ ] Resultado aparece

#### Endpoints tRPC (12 disponíveis):
```typescript
prompts.list()
prompts.create({ name, category, template, variables })
prompts.update({ id, name?, template? })
prompts.delete({ id })
prompts.listVersions({ promptId })
prompts.createVersion({ promptId, template })
prompts.revertToVersion({ promptId, versionId })
```

---

## ❌ FASE 3: PÁGINAS SEM ROUTERS (14 páginas)

### 13. Credentials (`/credentials`) ❌

**Status**: Router não existe  
**Ação necessária**: Criar `credentials` router ou usar `services.listApiCredentials`

#### Testes após criação do router:
- [ ] Lista credenciais do DB
- [ ] Botão "Nova Credencial" salva no DB
- [ ] Botão "Testar" testa conexão
- [ ] Botão "Deletar" remove do DB

---

### 14-26. Outras 13 páginas sem routers

**Páginas**: Execution Logs, External API Accounts, Instructions, Knowledge Base, Knowledge Sources, Providers, Settings, Specialized AIs, Templates, Workflow Builder, Workflows, Terminal

**Status**: Routers não existem  
**Ação necessária**: Criar routers correspondentes

**Testes serão criados após implementação dos routers**

---

## 🎨 TESTES DE TEMA (TODAS AS PÁGINAS)

### Checklist de visibilidade:

Para CADA página, verificar:

- [ ] **Light Mode**
  - [ ] Texto principal é legível
  - [ ] Texto secundário é legível
  - [ ] Cards têm bom contraste
  - [ ] Botões são visíveis
  - [ ] Inputs são visíveis
  - [ ] Tabelas são legíveis
  - [ ] Modals são legíveis

- [ ] **Dark Mode**
  - [ ] Texto principal é branco/claro
  - [ ] Texto secundário é cinza claro
  - [ ] Cards têm fundo escuro (gray-800)
  - [ ] Botões são visíveis
  - [ ] Inputs têm fundo escuro
  - [ ] Tabelas são legíveis
  - [ ] Modals são legíveis
  - [ ] Sem texto branco em fundo branco

---

## 🗄️ TESTES DE BANCO DE DADOS

### Verificar conexão real com MySQL:

#### Para cada operação CRUD:

1. **CREATE** - Inserir dados
```bash
# No frontend: Criar novo item
# No MySQL: Verificar se foi inserido
mysql -u flavio -p -D orquestraia
SELECT * FROM [table_name] ORDER BY id DESC LIMIT 1;
```

2. **READ** - Listar dados
```bash
# No frontend: Abrir lista
# No MySQL: Verificar se dados mostrados existem no DB
SELECT * FROM [table_name];
```

3. **UPDATE** - Atualizar dados
```bash
# No frontend: Editar item
# No MySQL: Verificar se foi atualizado
SELECT * FROM [table_name] WHERE id = ?;
```

4. **DELETE** - Deletar dados
```bash
# No frontend: Deletar item
# No MySQL: Verificar se foi removido
SELECT * FROM [table_name] WHERE id = ?; -- Should return empty
```

---

## 📊 RELATÓRIO DE TESTES

### Template de relatório para cada página:

```markdown
## [Nome da Página] - Relatório de Testes

**Data**: DD/MM/AAAA  
**Testador**: Nome  
**Versão**: V3.1

### Resumo:
- ✅ Testes Passados: X
- ❌ Testes Falhados: Y
- ⚠️ Testes Parciais: Z

### Detalhes:

#### Carregamento:
- [ ] ✅ Página carrega
- [ ] ❌ Erro: [descrição do erro]

#### Visibilidade:
- [ ] ✅ Texto legível em light mode
- [ ] ✅ Texto legível em dark mode

#### CRUD:
- [ ] ✅ Create funciona
- [ ] ❌ Read falha: [descrição]
- [ ] ✅ Update funciona
- [ ] ✅ Delete funciona

#### Banco de Dados:
- [ ] ✅ Dados vêm do MySQL
- [ ] ❌ Dados são mockados

### Bugs encontrados:
1. [Descrição do bug]
2. [Descrição do bug]

### Recomendações:
- [Sugestão de melhoria]
```

---

## 🚀 EXECUÇÃO DOS TESTES

### Ordem recomendada:

1. **FASE 1** (Páginas Completas) - 1-2 dias
   - Dashboard
   - Tasks
   - Chat
   - Teams
   - Projects
   - Models
   - Profile

2. **FASE 2** (Páginas Parciais) - 1 dia
   - Analytics
   - Model Training
   - Services
   - Monitoring
   - Prompts

3. **FASE 3** (Criar Routers) - 3-4 dias
   - Implementar 14 routers faltantes

4. **FASE 4** (Testar Routers Novos) - 2-3 dias
   - Testar as 14 páginas após criação dos routers

5. **FASE 5** (Testes de Integração) - 1 dia
   - Fluxos completos end-to-end
   - Testes de stress
   - Testes de performance

---

## 📝 CHECKLIST FINAL

Antes de considerar V3.1 completo:

- [ ] **Todas as 26 páginas carregam sem erros**
- [ ] **Todos os botões de todas as páginas funcionam**
- [ ] **Todos os formulários salvam no banco de dados**
- [ ] **Nenhum dado é mockado - tudo vem do MySQL**
- [ ] **Dark mode funciona em todas as páginas**
- [ ] **Light mode funciona em todas as páginas**
- [ ] **Todos os 14 routers faltantes foram criados**
- [ ] **Todos os testes SQL passaram**
- [ ] **Build produção funciona sem erros**
- [ ] **Deploy no servidor funciona**
- [ ] **Sistema roda sem erros no console**

---

**Documento criado em**: 31/10/2025  
**Responsável**: Sistema de Auditoria V3.1  
**Próxima revisão**: Após implementação dos routers faltantes
