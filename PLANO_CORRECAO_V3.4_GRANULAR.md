# 📋 PLANO DE CORREÇÃO GRANULAR - VERSÃO 3.4.0

**Data:** $(date '+%Y-%m-%d %H:%M:%S')
**Objetivo:** Corrigir TODOS os problemas encontrados nos testes com excelência máxima
**Critério de Sucesso:** 100% das funcionalidades testadas funcionando perfeitamente

---

## 🐛 PROBLEMAS IDENTIFICADOS NOS TESTES

### PROBLEMA 1: Drizzle Schema Desatualizado - Projects
**Gravidade:** ⚠️ CRÍTICA
**Impacto:** Impede criação de projetos via API
**Arquivo:** `server/db/schema.ts`
**Erro:** "Field 'userId' doesn't have a default value"

**Análise:**
- Tabela MySQL `projects` TEM coluna `userId INT NOT NULL`
- Schema Drizzle `projects` NÃO TEM campo `userId`
- Router tenta inserir `userId: 1` mas Drizzle não conhece o campo

**Causa Raiz:**
Schema do Drizzle está desatualizado em relação ao banco MySQL

---

### PROBLEMA 2: Coluna 'changeDescription' não existe
**Gravidade:** ⚠️ ALTA
**Impacto:** Retorna erro 500 ao criar prompts (mas cria parcialmente)
**Arquivo:** `server/trpc/routers/prompts.ts`
**Erro:** "Unknown column 'changeDescription' in 'field list'"

**Análise:**
- Tabela `promptVersions` TEM coluna `changelog TEXT`
- Código tenta inserir `changeDescription`
- Nome da coluna está incorreto no código

**Causa Raiz:**
Mismatch entre nome de coluna no banco vs código

---

### PROBLEMA 3: Monitoring retorna objeto vazio
**Gravidade:** 🟡 MÉDIA
**Impacto:** Dashboard não mostra métricas do sistema
**Arquivo:** `server/trpc/routers/monitoring.ts` ou `server/services/systemMonitorService.ts`
**Resultado:** `{"metrics": {}}`

**Análise:**
- Endpoint `monitoring.getCurrentMetrics` retorna success mas metrics vazio
- Provavelmente systemMonitorService não está coletando dados
- Dashboard ficará sem informações

**Causa Raiz:**
Service de monitoring não implementado ou com erro

---

### PROBLEMA 4: Tabela aiModels possivelmente com problemas
**Gravidade:** 🟡 MÉDIA  
**Impacto:** Query retornou erro
**Teste:** SELECT em aiModels falhou

**Análise:**
- Comando MySQL retornou exit code 1
- Pode ser problema de schema ou dados corrompidos
- Precisa investigação

---

### PROBLEMA 5: LM Studio não está rodando
**Gravidade:** 🔵 INFO
**Impacto:** Não é possível testar geração de texto com IAs
**Status:** LM Studio precisa estar rodando na porta 1234

---

## 📝 PLANO DE CORREÇÃO DETALHADO

### FASE 1: CORREÇÃO DE SCHEMAS (Prioridade CRÍTICA)

#### Etapa 1.1: Adicionar userId ao schema projects
**Tempo Estimado:** 5 minutos
**Arquivo:** `server/db/schema.ts`

**Passos:**
1. Abrir `server/db/schema.ts`
2. Localizar `export const projects = mysqlTable('projects', {`
3. Adicionar APÓS a linha de `description`:
   ```typescript
   userId: int('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
   ```
4. Adicionar índice no final da tabela:
   ```typescript
   userIdIdx: index('idx_userId').on(table.userId),
   ```
5. Salvar arquivo

**Validação:**
- TypeScript deve compilar sem erros
- Criar projeto via API deve funcionar

---

#### Etapa 1.2: Verificar e adicionar outros campos faltantes no projects
**Tempo Estimado:** 10 minutos
**Arquivo:** `server/db/schema.ts`

**Verificação Necessária:**
Comparar schema MySQL vs Drizzle para campos:
- `progress INT DEFAULT 0`
- `tags JSON`
- `isActive BOOLEAN DEFAULT true`

**Se faltarem, adicionar:**
```typescript
progress: int('progress').default(0),
tags: json('tags'),
isActive: boolean('isActive').default(true),
```

---

#### Etapa 1.3: Corrigir nome da coluna em promptVersions
**Tempo Estimado:** 3 minutos
**Arquivo:** `server/trpc/routers/prompts.ts`

**Passos:**
1. Abrir `server/trpc/routers/prompts.ts`
2. Procurar por `changeDescription`
3. Substituir por `changelog`
4. Verificar se Drizzle schema tem a coluna correta

**Validação:**
- Criar prompt deve retornar success sem erro
- PromptVersion deve ser criada corretamente

---

### FASE 2: CORREÇÃO DE MONITORING (Prioridade ALTA)

#### Etapa 2.1: Implementar coleta de métricas real
**Tempo Estimado:** 20 minutos
**Arquivo:** `server/services/systemMonitorService.ts`

**Passos:**
1. Verificar se `systeminformation` está instalado
2. Implementar funções de coleta:
   - `getCPUInfo()` → retornar uso atual
   - `getMemoryInfo()` → retornar RAM usada/total
   - `getDiskInfo()` → retornar disco usado/total
   - `getGPUInfo()` → retornar GPU se disponível
3. Garantir que `getCurrentMetrics()` chama todas as funções
4. Retornar objeto completo:
```typescript
{
  cpu: { usage: number, cores: number },
  memory: { used: number, total: number, percentage: number },
  disk: { used: number, total: number, percentage: number },
  gpu: { usage: number, memory: number } | null
}
```

**Validação:**
- Endpoint deve retornar métricas reais
- Dashboard deve exibir dados

---

#### Etapa 2.2: Verificar router de monitoring
**Tempo Estimado:** 10 minutos
**Arquivo:** `server/trpc/routers/monitoring.ts`

**Verificar:**
- Endpoint `getCurrentMetrics` está chamando o service correto
- Não há erro de importação
- Response está sendo formatado corretamente

---

### FASE 3: VERIFICAÇÃO E CORREÇÃO DE DADOS (Prioridade MÉDIA)

#### Etapa 3.1: Investigar problema na tabela aiModels
**Tempo Estimado:** 15 minutos

**Passos:**
1. Conectar no MySQL
2. `DESCRIBE aiModels;` → verificar estrutura
3. `SELECT COUNT(*) FROM aiModels;` → verificar quantidade
4. `SELECT * FROM aiModels LIMIT 5;` → verificar dados
5. Se houver erro, identificar:
   - Coluna faltando?
   - Dados corrompidos?
   - Foreign key quebrada?

**Correção conforme diagnóstico:**
- Se schema incorreto → ajustar Drizzle
- Se dados corrompidos → limpar e re-popular
- Se FK quebrada → corrigir relacionamentos

---

#### Etapa 3.2: Validar integridade de todas as tabelas
**Tempo Estimado:** 20 minutos

**Tabelas para verificar:**
- [ ] users
- [ ] teams
- [ ] projects
- [ ] tasks
- [ ] prompts
- [ ] promptVersions
- [ ] aiProviders
- [ ] aiModels
- [ ] specializedAIs
- [ ] credentials
- [ ] chatConversations
- [ ] chatMessages

**Para cada tabela:**
```sql
DESCRIBE {tabela};
SELECT COUNT(*) FROM {tabela};
SELECT * FROM {tabela} LIMIT 3;
```

---

### FASE 4: TESTES DE CRUD COMPLETO (Prioridade ALTA)

#### Etapa 4.1: Testar CRUD de Teams
**Tempo Estimado:** 15 minutos

**Testes:**
1. ✅ CREATE: Criar nova team
2. ✅ READ: Listar teams
3. [ ] UPDATE: Atualizar team existente
4. [ ] DELETE: Deletar team de teste
5. [ ] VERIFY: Confirmar mudanças no banco

---

#### Etapa 4.2: Testar CRUD de Projects
**Tempo Estimado:** 15 minutos

**Testes:**
1. [ ] CREATE: Criar novo projeto (após correção schema)
2. [ ] READ: Listar projetos
3. [ ] UPDATE: Atualizar projeto
4. [ ] DELETE: Deletar projeto de teste
5. [ ] VERIFY: Confirmar mudanças no banco

---

#### Etapa 4.3: Testar CRUD de Tasks
**Tempo Estimado:** 20 minutos

**Testes:**
1. [ ] CREATE: Criar nova task
2. [ ] READ: Listar tasks
3. [ ] UPDATE: Mudar status de task
4. [ ] ASSIGN: Atribuir task a usuário
5. [ ] DELETE: Deletar task de teste
6. [ ] VERIFY: Confirmar mudanças no banco

---

#### Etapa 4.4: Testar CRUD de Prompts
**Tempo Estimado:** 20 minutos

**Testes:**
1. [ ] CREATE: Criar novo prompt (após correção)
2. [ ] READ: Listar prompts
3. [ ] UPDATE: Atualizar content do prompt
4. [ ] USE: Usar prompt com variáveis
5. [ ] VERSION: Verificar versionamento
6. [ ] DELETE: Deletar prompt de teste

---

### FASE 5: TESTES DE FUNCIONALIDADES AVANÇADAS (Prioridade MÉDIA)

#### Etapa 5.1: Testar Chat com IAs
**Tempo Estimado:** 30 minutos

**Requisito:** LM Studio rodando

**Testes:**
1. [ ] Criar nova conversa
2. [ ] Enviar mensagem
3. [ ] Receber resposta da IA
4. [ ] Verificar mensagens no banco
5. [ ] Testar múltiplas conversas
6. [ ] Testar histórico

---

#### Etapa 5.2: Testar Orquestração de Tarefas
**Tempo Estimado:** 45 minutos

**Requisito:** LM Studio rodando com modelos

**Testes:**
1. [ ] Criar tarefa complexa
2. [ ] Iniciar execução via orchestrator
3. [ ] Verificar criação de subtasks
4. [ ] Acompanhar execução
5. [ ] Verificar validação cruzada
6. [ ] Verificar detecção de alucinação
7. [ ] Verificar logs de execução
8. [ ] Verificar resultado final

---

#### Etapa 5.3: Testar Specialized AIs
**Tempo Estimado:** 30 minutos

**Testes:**
1. [ ] Listar IAs especializadas
2. [ ] Selecionar IA (ex: Programadora)
3. [ ] Enviar tarefa de código
4. [ ] Verificar resposta
5. [ ] Testar outra IA (ex: Validadora)
6. [ ] Verificar se usa modelos diferentes

---

### FASE 6: TESTES DE INTERFACE (Prioridade MÉDIA)

#### Etapa 6.1: Testar Dashboard
**Tempo Estimado:** 20 minutos

**Testes:**
1. [ ] Acessar http://192.168.192.164:3001/
2. [ ] Verificar métricas sendo exibidas
3. [ ] Verificar gráficos funcionando
4. [ ] Verificar resumo de tasks
5. [ ] Verificar resumo de projetos
6. [ ] Verificar navegação

---

#### Etapa 6.2: Testar todas as páginas
**Tempo Estimado:** 40 minutos

**Páginas para testar:**
- [ ] Dashboard
- [ ] Teams
- [ ] Projects  
- [ ] Tasks
- [ ] Prompts
- [ ] Chat
- [ ] Models
- [ ] Specialized AIs
- [ ] Credentials
- [ ] Monitoring
- [ ] Settings

**Para cada página:**
1. Verificar carregamento
2. Verificar dados sendo exibidos
3. Testar criação/edição
4. Verificar formulários
5. Testar dark mode
6. Verificar responsividade

---

### FASE 7: TESTES DE INTEGRAÇÃO (Prioridade BAIXA)

#### Etapa 7.1: Testar integração LM Studio
**Tempo Estimado:** 20 minutos

**Testes:**
1. [ ] Verificar status do LM Studio
2. [ ] Listar modelos disponíveis
3. [ ] Carregar modelo
4. [ ] Descarregar modelo
5. [ ] Gerar texto
6. [ ] Verificar performance

---

### FASE 8: CORREÇÕES FINAIS E POLIMENTO (Prioridade ALTA)

#### Etapa 8.1: Corrigir encoding UTF-8
**Tempo Estimado:** 10 minutos

**Problema observado:**
Textos com acentos aparecem como "cria��o" no banco

**Correção:**
1. Verificar charset das tabelas: `SHOW CREATE TABLE {tabela};`
2. Se não for utf8mb4, alterar:
```sql
ALTER TABLE {tabela} CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
3. Verificar conexão MySQL no código tem charset=utf8mb4

---

#### Etapa 8.2: Adicionar validações faltantes
**Tempo Estimado:** 30 minutos

**Validações necessárias:**
- Required fields não vazios
- Formato de email
- Tamanhos máximos de strings
- Foreign keys existem antes de inserir
- Status values são válidos
- Priority values são válidos

---

#### Etapa 8.3: Melhorar mensagens de erro
**Tempo Estimado:** 20 minutos

**Substituir:**
- Erros genéricos por erros específicos
- Stack traces por mensagens user-friendly
- Códigos técnicos por explicações claras

---

### FASE 9: DOCUMENTAÇÃO (Prioridade MÉDIA)

#### Etapa 9.1: Atualizar README
**Tempo Estimado:** 15 minutos

**Incluir:**
- Como instalar
- Como rodar
- Como testar
- Troubleshooting comum
- Link para documentação completa

---

#### Etapa 9.2: Criar CHANGELOG v3.4.0
**Tempo Estimado:** 10 minutos

**Incluir:**
- Bugs corrigidos
- Features melhoradas
- Breaking changes (se houver)
- Notas de migração

---

### FASE 10: BUILD E DEPLOY (Prioridade CRÍTICA)

#### Etapa 10.1: Build final
**Tempo Estimado:** 5 minutos

```bash
cd /home/flavio/webapp
npm run build
```

**Verificar:**
- Build completa sem erros
- Sem warnings críticos
- Tamanho dos bundles razoável

---

#### Etapa 10.2: Testar build localmente
**Tempo Estimado:** 10 minutos

```bash
NODE_ENV=production node dist/index.js
```

**Verificar:**
- Servidor inicia
- API responde
- Frontend carrega
- Sem erros no console

---

#### Etapa 10.3: Deploy em produção
**Tempo Estimado:** 5 minutos

```bash
pm2 restart orquestrador-v3
pm2 save
```

**Verificar:**
- PM2 restart sem erros
- Versão 3.4.0 ativa
- Logs sem erros críticos

---

#### Etapa 10.4: Smoke tests em produção
**Tempo Estimado:** 15 minutos

**Testes:**
1. [ ] http://192.168.192.164:3001/ carrega
2. [ ] http://192.168.192.164:3001/api/health retorna OK
3. [ ] Listar teams funciona
4. [ ] Criar team funciona
5. [ ] Dashboard exibe métricas
6. [ ] Chat responde (se LM Studio rodando)

---

## 📊 CRONOGRAMA

| Fase | Tempo Estimado | Prioridade |
|------|----------------|------------|
| Fase 1: Schemas | 20 min | CRÍTICA |
| Fase 2: Monitoring | 30 min | ALTA |
| Fase 3: Dados | 35 min | MÉDIA |
| Fase 4: CRUD Tests | 70 min | ALTA |
| Fase 5: Avançado | 105 min | MÉDIA |
| Fase 6: Interface | 60 min | MÉDIA |
| Fase 7: Integração | 20 min | BAIXA |
| Fase 8: Polimento | 60 min | ALTA |
| Fase 9: Docs | 25 min | MÉDIA |
| Fase 10: Deploy | 35 min | CRÍTICA |

**TOTAL: ~8 horas de trabalho focado**

---

## ✅ CRITÉRIOS DE SUCESSO

### Obrigatórios (Must Have):
- [ ] Todos os CRUDs funcionando 100%
- [ ] Schemas sincronizados (Drizzle = MySQL)
- [ ] Monitoring retornando métricas reais
- [ ] Zero erros 500 em operações básicas
- [ ] Dados sendo salvos e recuperados corretamente
- [ ] Build passando sem erros
- [ ] Deploy funcionando em produção

### Desejáveis (Should Have):
- [ ] Chat funcionando com LM Studio
- [ ] Orquestração testada e funcionando
- [ ] Interface 100% responsiva
- [ ] Dark mode funcionando perfeitamente
- [ ] Todas as páginas testadas

### Extras (Nice to Have):
- [ ] Integrações externas configuradas
- [ ] Puppeteer testado
- [ ] Training service testado
- [ ] Performance otimizada

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ Documento criado com todos os problemas identificados
2. ⏭️ Começar FASE 1: Correção de Schemas
3. ⏭️ Executar cada etapa sequencialmente
4. ⏭️ Validar cada correção antes de avançar
5. ⏭️ Documentar descobertas durante correções
6. ⏭️ Fazer commit após cada fase completa
7. ⏭️ Deploy final da v3.4.0

---

**Criado em:** $(date '+%Y-%m-%d %H:%M:%S')
**Status:** Pronto para execução
**Versão Alvo:** 3.4.0
**Estimativa Total:** ~8 horas

