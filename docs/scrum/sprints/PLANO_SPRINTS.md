# 🏃 PLANO DE SPRINTS MICRO-DETALHADAS

**Metodologia:** Scrum Rigoroso  
**Duração por Sprint:** Até concluir 100% dos critérios de aceitação  
**Critério de Passagem:** Testes completos, deploy em produção, validação funcional

---

## 📋 ESTRUTURA DE CADA SPRINT

### Cada Sprint DEVE conter:
1. **Objetivo Único e Claro**
2. **Critérios de Aceitação Detalhados**
3. **Tarefas Técnicas Específicas**
4. **Testes Obrigatórios**
5. **Deploy em Produção**
6. **Validação Funcional**
7. **Documentação de Resultado**

### Regras Rígidas:
- ❌ **NÃO passar para próxima sprint** sem completar 100% da atual
- ❌ **NÃO escolher "itens mais simples"** - fazer tudo em ordem
- ❌ **NÃO deixar testes para depois** - testar durante a sprint
- ❌ **NÃO mexer no que já funciona** - consultar inventário sempre
- ✅ **SIM commit e push** ao final de cada sprint
- ✅ **SIM deploy em produção** a cada sprint
- ✅ **SIM testes completos** antes de marcar como done

---

## 🎯 ÉPICO 1: VALIDAR E CORRIGIR APIS BACKEND

### SPRINT 1.1: Providers Router - Adicionar Endpoint List
**Objetivo:** Criar endpoint `providers.list` que estava faltando

**Critérios de Aceitação:**
- [ ] Endpoint `providers.list` implementado
- [ ] Retorna lista de providers com paginação
- [ ] Formato de resposta compatível com frontend
- [ ] Filtro por query funciona
- [ ] Testes API passam (curl)
- [ ] Deploy realizado
- [ ] Página /providers carrega dados

**Tarefas:**
1. Abrir `/home/flavio/webapp/server/routers/providersRouter.ts`
2. Adicionar procedure `list` seguindo padrão do modelsRouter
3. Implementar query com joins se necessário
4. Implementar paginação (page, limit, offset)
5. Implementar filtro por query (nome do provider)
6. Testar com curl
7. Build server (`npm run build:server`)
8. Restart PM2
9. Testar novamente
10. Commit + push

**Testes Obrigatórios:**
```bash
# 1. Listar todos
curl -s 'http://localhost:3001/api/trpc/providers.list?input=%7B%22json%22%3A%7B%7D%7D' | python3 -m json.tool

# 2. Buscar por nome
curl -s 'http://localhost:3001/api/trpc/providers.list?input=%7B%22json%22%3A%7B%22query%22%3A%22LM%22%7D%7D' | python3 -m json.tool

# 3. Verificar paginação
curl -s 'http://localhost:3001/api/trpc/providers.list?input=%7B%22json%22%3A%7B%22page%22%3A1%2C%22limit%22%3A2%7D%7D' | python3 -m json.tool
```

**Deploy:**
```bash
cd /home/flavio/webapp
npm run build:server
pm2 restart orquestrador-v3
pm2 logs orquestrador-v3 --nostream --lines 10
```

**Validação:**
- Abrir http://[IP]:3001/providers
- Verificar se tabela carrega com 4 providers
- Verificar se busca funciona
- Verificar se paginação funciona

---

### SPRINT 1.2: Specialized AIs Router - Corrigir Formato de Resposta
**Objetivo:** Padronizar formato de resposta do endpoint specializedAIs.list

**Critérios de Aceitação:**
- [ ] Resposta no formato padrão (items, pagination)
- [ ] Frontend consome corretamente
- [ ] Filtros funcionam
- [ ] Ordenação funciona
- [ ] Deploy realizado
- [ ] Página /specialized-ais carrega 8 AIs

**Tarefas:**
1. Abrir `/home/flavio/webapp/server/routers/specializedAIsRouter.ts`
2. Verificar formato atual de resposta
3. Ajustar para retornar {items, pagination} se necessário
4. Verificar se frontend espera formato diferente
5. Ajustar frontend se necessário
6. Testar com curl
7. Build
8. Deploy
9. Validar

**Testes Obrigatórios:**
```bash
curl -s 'http://localhost:3001/api/trpc/specializedAIs.list?input=%7B%22json%22%3A%7B%7D%7D' | python3 -m json.tool
```

---

### SPRINT 1.3: Templates Router - Testar e Corrigir
**Objetivo:** Validar que templates.list funciona corretamente

**Critérios de Aceitação:**
- [ ] API retorna 4 templates
- [ ] Formato de resposta correto
- [ ] Frontend consome corretamente
- [ ] Filtros por categoria funcionam
- [ ] CRUD completo funciona
- [ ] Deploy realizado

**Tarefas:**
1. Testar API com curl
2. Verificar resposta
3. Corrigir se necessário
4. Testar frontend
5. Deploy
6. Validar

---

### SPRINT 1.4: Workflows Router - Testar e Corrigir
**Objetivo:** Validar que workflows.list funciona corretamente

**Critérios de Aceitação:**
- [ ] API retorna 3 workflows
- [ ] Formato correto
- [ ] Frontend consome
- [ ] CRUD funciona
- [ ] Deploy realizado

---

### SPRINT 1.5: Instructions Router - Testar e Corrigir
**Objetivo:** Validar instructions.list

**Critérios de Aceitação:**
- [ ] API retorna 7 instructions
- [ ] Formato correto
- [ ] Frontend consome
- [ ] Filtros funcionam
- [ ] Deploy realizado

---

### SPRINT 1.6: Knowledge Base Router - Testar e Corrigir
**Objetivo:** Validar knowledgeBase.list

**Critérios de Aceitação:**
- [ ] API retorna 5 items
- [ ] Formato correto
- [ ] Frontend consome
- [ ] Busca funciona
- [ ] Deploy realizado

---

## 🎯 ÉPICO 2: VALIDAR FRONTEND - TODAS AS PÁGINAS

### SPRINT 2.1: Dashboard - Validar Carregamento e Dados
**Objetivo:** Garantir que Dashboard carrega e exibe dados corretos

**Critérios de Aceitação:**
- [ ] Página carrega sem erros
- [ ] Estatísticas corretas (22 models, 8 AIs, 3 projects, 3 teams)
- [ ] Gráficos renderizam
- [ ] Cards de atividades recentes aparecem
- [ ] Responsivo funciona
- [ ] Dark mode funciona

**Tarefas:**
1. Abrir http://[IP]:3001/
2. Verificar console do browser (F12)
3. Anotar todos os erros
4. Verificar se dados aparecem
5. Verificar se números estão corretos
6. Testar dark mode toggle
7. Testar responsividade (resize browser)
8. Documentar issues encontrados
9. Corrigir issues
10. Re-testar

**Testes:**
- [ ] Console sem erros críticos
- [ ] 22 models exibidos
- [ ] 8 specialized AIs exibidos
- [ ] 3 projects exibidos
- [ ] 3 teams exibidos
- [ ] Gráficos aparecem
- [ ] Dark mode alterna

---

### SPRINT 2.2: Models Page - CRUD Completo
**Objetivo:** Validar CRUD completo de Models

**Critérios de Aceitação:**
- [ ] Página carrega 22 models
- [ ] Tabela renderiza corretamente
- [ ] Botão "Add Model" funciona
- [ ] Modal de criação abre
- [ ] Formulário de criação valida
- [ ] Criar model funciona
- [ ] Editar model funciona
- [ ] Deletar model funciona
- [ ] Busca funciona
- [ ] Filtros funcionam
- [ ] Paginação funciona
- [ ] Ordenação funciona
- [ ] Sync com LM Studio funciona

**Tarefas:**
1. Abrir /models
2. Verificar carregamento
3. Clicar em "Add Model"
4. Verificar se modal abre
5. Preencher form
6. Submeter
7. Verificar se criou
8. Testar edição
9. Testar deleção
10. Testar sync LM Studio

**Testes:**
- [ ] GET /models retorna 22
- [ ] POST /models cria novo
- [ ] PUT /models/:id atualiza
- [ ] DELETE /models/:id remove
- [ ] Sync adiciona novos models do LM Studio

---

### SPRINT 2.3: Projects Page - CRUD Completo
**Objetivo:** Validar CRUD completo de Projects

**Critérios de Aceitação:**
- [ ] Página carrega 3 projects
- [ ] Tabela renderiza
- [ ] Add Project funciona
- [ ] Edit funciona
- [ ] Delete funciona
- [ ] Filtros funcionam
- [ ] Vinculação com Teams funciona

**Tarefas:**
1. Abrir /projects
2. Testar CRUD completo
3. Verificar vinculação com teams
4. Testar filtros por status
5. Documentar issues
6. Corrigir
7. Re-testar

---

### SPRINT 2.4: Teams Page - CRUD Completo
**Objetivo:** Validar CRUD completo de Teams

**Critérios de Aceitação:**
- [ ] Página carrega 3 teams
- [ ] Add Team funciona
- [ ] Edit funciona
- [ ] Delete funciona
- [ ] Membros aparecem
- [ ] Add membro funciona

---

### SPRINT 2.5: Providers Page - CRUD Completo
**Objetivo:** Validar CRUD completo de Providers

**Critérios de Aceitação:**
- [ ] Página carrega 4 providers
- [ ] Add Provider funciona
- [ ] Edit funciona
- [ ] Delete funciona
- [ ] Teste de conexão funciona
- [ ] Toggle active/inactive funciona

---

### SPRINT 2.6: Specialized AIs Page - CRUD Completo
**Objetivo:** Validar CRUD completo de Specialized AIs

**Critérios de Aceitação:**
- [ ] Página carrega 8 AIs
- [ ] Add AI funciona
- [ ] Edit funciona
- [ ] Delete funciona
- [ ] Seleção de modelo padrão funciona
- [ ] Seleção de fallbacks funciona
- [ ] Categorias aparecem
- [ ] System prompt editável

---

### SPRINT 2.7: Credentials Page - CRUD Completo
**Objetivo:** Validar CRUD completo de Credentials

**Critérios de Aceitação:**
- [ ] Página carrega
- [ ] Add Credential funciona
- [ ] Templates aparecem
- [ ] Criptografia funciona
- [ ] Edit funciona (recriptografa)
- [ ] Delete funciona

---

### SPRINT 2.8: Tasks Page - CRUD Completo
**Objetivo:** Validar CRUD completo de Tasks

**Critérios de Aceitação:**
- [ ] Página carrega (0 tasks inicial)
- [ ] Add Task funciona
- [ ] Task é criada
- [ ] Editar task funciona
- [ ] Deletar funciona
- [ ] Filtros por status funcionam
- [ ] Filtros por prioridade funcionam
- [ ] Vinculação com projeto funciona

---

### SPRINT 2.9: Subtasks Page - CRUD e Validação
**Objetivo:** Validar subtasks de uma task

**Critérios de Aceitação:**
- [ ] Criar task primeiro
- [ ] Abrir /tasks/:id/subtasks
- [ ] Subtasks aparecem (se houver)
- [ ] Add subtask funciona
- [ ] Atribuir modelo funciona
- [ ] Executar subtask funciona
- [ ] Validação cruzada triggera
- [ ] Resultado aparece

---

### SPRINT 2.10: Prompts Page - CRUD Completo
**Objetivo:** Validar CRUD de Prompts

**Critérios de Aceitação:**
- [ ] Página carrega 8 prompts
- [ ] Add prompt funciona
- [ ] Variáveis {{}} funcionam
- [ ] Categorias funcionam
- [ ] Tags funcionam
- [ ] Público/Privado funciona
- [ ] Versionamento funciona
- [ ] Use count incrementa

---

### SPRINT 2.11: Templates Page - CRUD Completo
**Objetivo:** Validar CRUD de Templates

**Critérios de Aceitação:**
- [ ] Página carrega 4 templates
- [ ] Add template funciona
- [ ] JSON editor funciona
- [ ] Categorias funcionam
- [ ] Usage count incrementa

---

### SPRINT 2.12: Workflows Page - CRUD Completo
**Objetivo:** Validar CRUD de Workflows

**Critérios de Aceitação:**
- [ ] Página carrega 3 workflows
- [ ] Add workflow funciona
- [ ] Steps em JSON funcionam
- [ ] Ativo/Inativo toggle funciona
- [ ] Link para builder funciona

---

### SPRINT 2.13: Workflow Builder - Editor Visual
**Objetivo:** Validar Workflow Builder visual

**Critérios de Aceitação:**
- [ ] Página carrega
- [ ] Canvas renderiza
- [ ] Drag & drop funciona
- [ ] Conectar steps funciona
- [ ] Salvar workflow funciona
- [ ] Preview funciona

---

### SPRINT 2.14: Instructions Page - CRUD Completo
**Objetivo:** Validar CRUD de Instructions

**Critérios de Aceitação:**
- [ ] Página carrega 7 instructions
- [ ] Add instruction funciona
- [ ] Prioridade funciona
- [ ] Vinculação com AI específica funciona
- [ ] Global instructions funcionam

---

### SPRINT 2.15: Knowledge Base Page - CRUD Completo
**Objetivo:** Validar CRUD de Knowledge Base

**Critérios de Aceitação:**
- [ ] Página carrega 5 items
- [ ] Add item funciona
- [ ] Editor markdown funciona
- [ ] Categorias funcionam
- [ ] Tags funcionam
- [ ] Embeddings são gerados (se configurado)

---

### SPRINT 2.16: Knowledge Sources Page - CRUD Completo
**Objetivo:** Validar CRUD de Knowledge Sources

**Critérios de Aceitação:**
- [ ] Selecionar item da KB
- [ ] Abrir /knowledge-base/:id/sources
- [ ] Sources aparecem
- [ ] Add source funciona
- [ ] Tipos de source funcionam
- [ ] Sync funciona

---

### SPRINT 2.17: Execution Logs Page - Visualização
**Objetivo:** Validar visualização de logs

**Critérios de Aceitação:**
- [ ] Página carrega
- [ ] Filtros por nível funcionam
- [ ] Filtros por task funcionam
- [ ] Busca funciona
- [ ] Paginação funciona
- [ ] Exportar funciona

---

### SPRINT 2.18: Chat Page - Chat em Tempo Real
**Objetivo:** Validar chat funcional

**Critérios de Aceitação:**
- [ ] Página carrega
- [ ] Criar conversação funciona
- [ ] Enviar mensagem funciona
- [ ] Receber resposta funciona (WebSocket)
- [ ] Histórico persiste
- [ ] Anexos funcionam
- [ ] Reações funcionam

---

### SPRINT 2.19: External API Accounts Page - CRUD Completo
**Objetivo:** Validar CRUD de contas externas

**Critérios de Aceitação:**
- [ ] Página carrega
- [ ] Add account funciona
- [ ] Vincular credential funciona
- [ ] Saldo de créditos aparece
- [ ] Alertas funcionam
- [ ] Uso mensal aparece

---

### SPRINT 2.20: Services Page - Integrações Externas
**Objetivo:** Validar configuração de serviços

**Critérios de Aceitação:**
- [ ] Página carrega
- [ ] GitHub configuração aparece
- [ ] Gmail configuração aparece
- [ ] Drive configuração aparece
- [ ] OAuth flow funciona (cada serviço)
- [ ] Testar conexão funciona

---

### SPRINT 2.21: Monitoring Page - Recursos em Tempo Real
**Objetivo:** Validar monitoramento de recursos

**Critérios de Aceitação:**
- [ ] Página carrega
- [ ] CPU usage aparece
- [ ] RAM usage aparece
- [ ] Disco usage aparece
- [ ] GPU/VRAM aparece (se disponível)
- [ ] Gráficos atualizam em tempo real
- [ ] Alertas aparecem se limite excedido

---

### SPRINT 2.22: Settings Page - Configurações
**Objetivo:** Validar configurações gerais

**Critérios de Aceitação:**
- [ ] Página carrega
- [ ] LM Studio URL editável
- [ ] Salvar configurações funciona
- [ ] Limites de recursos editáveis
- [ ] Dark mode toggle funciona
- [ ] Preferências persistem

---

### SPRINT 2.23: Terminal Page - SSH Terminal
**Objetivo:** Validar terminal integrado

**Critérios de Aceitação:**
- [ ] Página carrega
- [ ] Terminal renderiza
- [ ] Comandos executam
- [ ] Output aparece
- [ ] Scroll funciona
- [ ] Copy/paste funcionam

---

### SPRINT 2.24: Model Training Page - Interface de Treinamento
**Objetivo:** Validar interface de treinamento

**Critérios de Aceitação:**
- [ ] Página carrega
- [ ] Aba Datasets funciona
- [ ] Upload dataset funciona
- [ ] Aba Training Jobs funciona
- [ ] Criar job funciona
- [ ] Acompanhar progress funciona
- [ ] Ver model versions funciona

---

### SPRINT 2.25: Analytics Page - Dashboard Analytics
**Objetivo:** Validar analytics avançado

**Critérios de Aceitação:**
- [ ] Página carrega
- [ ] Métricas aparecem
- [ ] Gráficos renderizam
- [ ] Filtros por período funcionam
- [ ] Performance de modelos aparece
- [ ] Estatísticas de tarefas aparecem

---

### SPRINT 2.26: Profile Page - Perfil do Usuário
**Objetivo:** Validar perfil do usuário

**Critérios de Aceitação:**
- [ ] Página carrega
- [ ] Dados do user aparecem
- [ ] Avatar editável
- [ ] Bio editável
- [ ] Preferências editáveis
- [ ] Salvar funciona

---

## 🎯 ÉPICO 3: FUNCIONALIDADES CORE END-TO-END

### SPRINT 3.1: Orquestração - Criar e Executar Tarefa Simples
**Objetivo:** Validar orquestração básica funcionando

**Critérios de Aceitação:**
- [ ] Criar tarefa manual
- [ ] Tarefa é decomposta em subtarefas
- [ ] Subtarefas são atribuídas a modelos
- [ ] Subtarefas são executadas
- [ ] Resultados aparecem
- [ ] Status de tarefa atualiza

**Tarefas:**
1. Criar task: "Escreva um hello world em Python"
2. Verificar se orquestrador decompõe
3. Verificar se cria subtasks
4. Verificar se atribui modelo (coding)
5. Executar manualmente ou automaticamente
6. Verificar resultado
7. Validar logs

---

### SPRINT 3.2: Validação Cruzada - Testar Cross-Validation
**Objetivo:** Validar que validação cruzada funciona

**Critérios de Aceitação:**
- [ ] Subtask executada por IA1
- [ ] Resultado validado por IA2 (diferente)
- [ ] Score de validação aparece
- [ ] Se divergência > 20%, IA3 desempata
- [ ] Approved/Rejected correto
- [ ] Feedback aparece

---

### SPRINT 3.3: Detecção de Alucinação - Trigger e Recovery
**Objetivo:** Forçar alucinação e testar recovery

**Critérios de Aceitação:**
- [ ] Criar tarefa que pode causar alucinação
- [ ] Detector identifica alucinação
- [ ] Score de confiança < 50%
- [ ] Recovery é triggerado
- [ ] Modelo diferente reexecuta
- [ ] Resultado correto salvo
- [ ] Indicadores salvos em JSON

---

### SPRINT 3.4: LM Studio Integration - Sync e Uso
**Objetivo:** Validar integração completa LM Studio

**Critérios de Aceitação:**
- [ ] Sync models funciona
- [ ] Novos models detectados
- [ ] isLoaded atualiza corretamente
- [ ] Executar tarefa usa modelo do LM Studio
- [ ] Cache de 5min funciona
- [ ] Erro de conexão é tratado

---

### SPRINT 3.5: Chat WebSocket - Mensagens em Tempo Real
**Objetivo:** Validar chat funciona fim a fim

**Critérios de Aceitação:**
- [ ] WebSocket conecta
- [ ] Enviar mensagem
- [ ] Mensagem persiste no DB
- [ ] IA responde
- [ ] Resposta aparece em tempo real
- [ ] Histórico carrega
- [ ] Anexos funcionam

---

### SPRINT 3.6: Puppeteer - Automação Web Básica
**Objetivo:** Validar Puppeteer funcionando

**Critérios de Aceitação:**
- [ ] Criar sessão Puppeteer
- [ ] Navegar para URL
- [ ] Screenshot funciona
- [ ] Resultado salvo no DB
- [ ] Fechar sessão

---

### SPRINT 3.7: Monitoramento - Captura de Métricas
**Objetivo:** Validar monitoramento de recursos

**Critérios de Aceitação:**
- [ ] systemMetrics são capturados
- [ ] CPU, RAM, Disco aparecem
- [ ] Gráficos atualizam
- [ ] Se limite excedido, alerta aparece
- [ ] Histórico salvo no DB

---

## 🎯 ÉPICO 4: INTEGRAÇÕES EXTERNAS

### SPRINT 4.1: GitHub Integration - OAuth e Básico
**Objetivo:** Configurar e testar GitHub

**Critérios de Aceitação:**
- [ ] OAuth configurado
- [ ] Conectar funciona
- [ ] Listar repos funciona
- [ ] Criar issue funciona
- [ ] Ver commits funciona

---

### SPRINT 4.2: Gmail Integration - Envio e Leitura
**Objetivo:** Configurar e testar Gmail

**Critérios de Aceitação:**
- [ ] OAuth configurado
- [ ] Conectar funciona
- [ ] Enviar email funciona
- [ ] Listar emails funciona
- [ ] Filtros funcionam

---

### SPRINT 4.3: Drive Integration - Upload e Download
**Objetivo:** Configurar e testar Drive

**Critérios de Aceitação:**
- [ ] OAuth configurado
- [ ] Upload funciona
- [ ] Download funciona
- [ ] Listar files funciona
- [ ] Busca funciona

---

### SPRINT 4.4: Sheets Integration - Ler e Escrever
**Objetivo:** Configurar e testar Sheets

**Critérios de Aceitação:**
- [ ] OAuth configurado
- [ ] Ler dados funciona
- [ ] Escrever dados funciona
- [ ] Fórmulas funcionam
- [ ] Criar nova sheet funciona

---

### SPRINT 4.5: Notion Integration - Páginas e Databases
**Objetivo:** Configurar e testar Notion

**Critérios de Aceitação:**
- [ ] API key configurada
- [ ] Conectar funciona
- [ ] Listar páginas funciona
- [ ] Criar página funciona
- [ ] Query database funciona

---

### SPRINT 4.6: Slack Integration - Mensagens e Canais
**Objetivo:** Configurar e testar Slack

**Critérios de Aceitação:**
- [ ] Webhook configurado
- [ ] Enviar mensagem funciona
- [ ] Listar canais funciona
- [ ] Responder em thread funciona

---

### SPRINT 4.7: Discord Integration - Bot Básico
**Objetivo:** Configurar e testar Discord

**Critérios de Aceitação:**
- [ ] Bot token configurado
- [ ] Bot conecta
- [ ] Enviar mensagem funciona
- [ ] Responder a comandos funciona
- [ ] Webhook funciona

---

## 🎯 ÉPICO 5: TREINAMENTO DE MODELOS

### SPRINT 5.1: Upload e Parse Dataset
**Objetivo:** Upload de dataset funciona

**Critérios de Aceitação:**
- [ ] Upload JSONL funciona
- [ ] Upload CSV funciona
- [ ] Parse automático funciona
- [ ] Validação funciona
- [ ] Record count correto
- [ ] Preview aparece

---

### SPRINT 5.2: Criar Training Job
**Objetivo:** Criar job de treinamento

**Critérios de Aceitação:**
- [ ] Selecionar dataset funciona
- [ ] Selecionar base model funciona
- [ ] Configurar hyperparameters funciona
- [ ] Iniciar job funciona
- [ ] Status muda para "training"

---

### SPRINT 5.3: Acompanhar Progress
**Objetivo:** Acompanhar treinamento em tempo real

**Critérios de Aceitação:**
- [ ] Progress bar atualiza
- [ ] Epochs aparecem
- [ ] Loss atualiza
- [ ] Accuracy atualiza
- [ ] Tempo estimado aparece

---

### SPRINT 5.4: Gerar Model Version
**Objetivo:** Ao completar, gerar versão

**Critérios de Aceitação:**
- [ ] Ao completar training
- [ ] Model version é criada
- [ ] Path correto
- [ ] Benchmarks aparecem
- [ ] Download funciona

---

## 🎯 ÉPICO 6: TESTES AUTOMATIZADOS

### SPRINT 6.1: Setup de Testes
**Objetivo:** Configurar ambiente de testes

**Critérios de Aceitação:**
- [ ] Vitest configurado
- [ ] Jest configurado (se necessário)
- [ ] Playwright configurado (E2E)
- [ ] Scripts de teste em package.json

---

### SPRINT 6.2: Testes Unitários - Routers
**Objetivo:** Testes de routers

**Critérios de Aceitação:**
- [ ] Todos os routers têm testes
- [ ] CRUD testado
- [ ] Validações testadas
- [ ] Erros testados
- [ ] Cobertura > 80%

---

### SPRINT 6.3: Testes Unitários - Serviços
**Objetivo:** Testes de serviços

**Critérios de Aceitação:**
- [ ] lmstudioService testado
- [ ] orchestratorService testado
- [ ] hallucinationDetector testado
- [ ] Mocks corretos
- [ ] Cobertura > 80%

---

### SPRINT 6.4: Testes E2E - Fluxo Completo
**Objetivo:** Testes end-to-end

**Critérios de Aceitação:**
- [ ] Criar tarefa E2E testado
- [ ] Executar tarefa E2E testado
- [ ] Chat E2E testado
- [ ] Login (se houver) testado
- [ ] CRUD páginas testado

---

## 🎯 ÉPICO 7: DOCUMENTAÇÃO E FINALIZAÇÃO

### SPRINT 7.1: Documentação de APIs
**Objetivo:** Documentar todas as APIs

**Critérios de Aceitação:**
- [ ] OpenAPI/Swagger gerado
- [ ] Endpoints documentados
- [ ] Exemplos de uso
- [ ] Erros documentados

---

### SPRINT 7.2: Documentação de Usuário
**Objetivo:** Manual do usuário completo

**Critérios de Aceitação:**
- [ ] Como instalar
- [ ] Como usar cada feature
- [ ] FAQ
- [ ] Troubleshooting
- [ ] Screenshots

---

### SPRINT 7.3: Performance Optimization
**Objetivo:** Otimizar performance

**Critérios de Aceitação:**
- [ ] Bundle size < 500KB
- [ ] First load < 3s
- [ ] API response < 200ms
- [ ] Lighthouse score > 90

---

### SPRINT 7.4: Security Audit
**Objetivo:** Auditoria de segurança

**Critérios de Aceitação:**
- [ ] Dependências atualizadas
- [ ] Vulnerabilidades corrigidas
- [ ] Inputs validados
- [ ] Credenciais protegidas
- [ ] Rate limiting configurado

---

## 📊 RESUMO DE SPRINTS

- **Épico 1 (APIs):** 6 sprints
- **Épico 2 (Frontend):** 26 sprints
- **Épico 3 (Core Features):** 7 sprints
- **Épico 4 (Integrações):** 7 sprints
- **Épico 5 (Training):** 4 sprints
- **Épico 6 (Testes):** 4 sprints
- **Épico 7 (Docs/Final):** 4 sprints

**TOTAL:** 58 sprints micro-detalhadas

---

## 🚀 PROCESSO DE EXECUÇÃO

### Antes de Cada Sprint:
1. Ler documento de requisitos
2. Ler inventário do que já funciona
3. Consultar resultado da sprint anterior
4. Planejar tarefas técnicas

### Durante a Sprint:
1. Executar tarefas uma a uma
2. Testar após cada mudança
3. Documentar issues encontrados
4. Corrigir issues imediatamente
5. Re-testar até passar 100%

### Ao Final da Sprint:
1. Todos os critérios devem estar ✅
2. Build deve passar
3. Deploy deve ser realizado
4. Testes devem passar
5. Validação funcional completa
6. Commit + push no GitHub
7. Documentar resultado em docs/scrum/resultados/

### Passagem para Próxima Sprint:
- ❌ **NÃO PASSAR** se algum critério falhar
- ✅ **SIM PASSAR** quando 100% completo

---

**PRÓXIMA AÇÃO:** Executar SPRINT 1.1 agora!
