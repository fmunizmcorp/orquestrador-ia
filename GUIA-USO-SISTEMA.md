# 🎯 Guia de Uso do Sistema - Orquestrador V3.0

Manual completo de como usar o **Orquestrador de IAs V3.0** do zero.

---

## 📑 Índice

1. [Primeiro Acesso](#primeiro-acesso)
2. [Estrutura do Sistema](#estrutura-do-sistema)
3. [Configurando Provedores e Modelos](#configurando-provedores-e-modelos)
4. [Criando IAs Especializadas](#criando-ias-especializadas)
5. [Gerenciando Credenciais](#gerenciando-credenciais)
6. [Criando Tarefas](#criando-tarefas)
7. [Workflows Automáticos](#workflows-automáticos)
8. [Base de Conhecimento](#base-de-conhecimento)
9. [Monitoramento em Tempo Real](#monitoramento-em-tempo-real)
10. [Casos de Uso Práticos](#casos-de-uso-práticos)

---

## Primeiro Acesso

### 🌐 Acessando o Sistema

Depois de executar o script de configuração:

```
http://192.168.1.247
```

ou

```
http://192.168.1.247:3001
```

### 🏠 Tela Inicial

Você verá o **Dashboard** com:
- **Visão geral** do sistema
- **Métricas** de uso
- **Tarefas recentes**
- **Status das IAs**

---

## Estrutura do Sistema

### 📊 Menu Principal

```
🏠 Dashboard
   ├─ Visão geral do sistema
   └─ Métricas de uso

🤖 IAs
   ├─ Provedores (OpenAI, Claude, Gemini, etc.)
   ├─ Modelos (GPT-4, Claude 3, etc.)
   └─ IAs Especializadas (Arquiteto, Desenvolvedor, etc.)

📋 Tarefas
   ├─ Criar Nova Tarefa
   ├─ Tarefas Ativas
   └─ Histórico

🔄 Workflows
   ├─ Workflows Automáticos
   ├─ Templates
   └─ Histórico de Execuções

📚 Base de Conhecimento
   ├─ Documentos
   ├─ Fontes Externas
   └─ Embeddings

🔐 Credenciais
   ├─ Chaves de API
   ├─ Tokens
   └─ Contas Externas

📊 Monitoramento
   ├─ Sistema em Tempo Real
   ├─ Logs de Execução
   └─ Terminal SSH

⚙️ Configurações
   ├─ Instruções Globais
   ├─ Preferências
   └─ Backup
```

---

## Configurando Provedores e Modelos

### ✅ Já Configurado Automaticamente!

O script de instalação já cadastrou:
- ✅ **9 provedores de IA**
- ✅ **15+ modelos**
- ✅ **11 IAs especializadas**

### 📋 Verificar Configuração

**Passo 1**: Vá em **IAs** → **Provedores**

Você verá:
- LM Studio (Local) ← **JÁ FUNCIONANDO!**
- OpenAI
- Anthropic
- Google AI
- Mistral AI
- Hugging Face
- Together AI
- Perplexity AI
- Cohere

**Passo 2**: Clique em cada provedor para ver:
- Status (ativo/inativo)
- Endpoint da API
- Modelos disponíveis

**Passo 3**: Vá em **IAs** → **Modelos**

Você verá todos os modelos cadastrados para cada provedor.

---

## Criando IAs Especializadas

### 🤖 IAs Pré-Configuradas

Já temos **11 IAs prontas**:

1. **Arquiteto de Software** - Planeja arquiteturas
2. **Desenvolvedor Backend** - APIs e lógica de negócio
3. **Desenvolvedor Frontend** - Interfaces com React
4. **Revisor de Código** - Code review rigoroso
5. **Testador QA** - Casos de teste e automação
6. **Documentador Técnico** - Documentação completa
7. **Especialista em DevOps** - CI/CD e infraestrutura
8. **Analista de Segurança** - Auditoria de segurança
9. **Designer de UX/UI** - Experiência do usuário
10. **Especialista em Banco de Dados** - Otimizações SQL
11. **Assistente Local** - IA geral no LM Studio

### ➕ Criar Nova IA Especializada

**Passo 1**: Vá em **IAs** → **IAs Especializadas** → **Nova IA**

**Passo 2**: Preencha:

```
Nome: Especialista em Python
Role: developer
Modelo: GPT-4 Turbo (ou outro)
System Prompt: Você é um especialista em Python com foco em:
1. Código pythonic e clean
2. Type hints e documentação
3. Testes com pytest
4. Performance e otimização
5. Frameworks (Django, FastAPI, Flask)

Temperature: 0.3 (menos criativo, mais preciso)
```

**Passo 3**: Adicione **Capabilities** (tags):
```json
["python", "fastapi", "django", "pytest", "asyncio"]
```

**Passo 4**: Clique em **Salvar**

### 🎯 Configurando System Prompt

**Boas práticas**:
- Seja específico sobre o papel da IA
- Liste responsabilidades claras
- Defina o formato de saída esperado
- Inclua restrições (o que NÃO fazer)

**Exemplo de bom prompt**:
```
Você é um [PAPEL].

RESPONSABILIDADES:
1. [Tarefa principal]
2. [Tarefa secundária]
3. [Validações necessárias]

FORMATO DE SAÍDA:
- Use markdown
- Inclua exemplos de código
- Explique decisões técnicas

RESTRIÇÕES:
- Não sugira tecnologias experimentais
- Sempre considere segurança
- Prefira soluções simples
```

---

## Gerenciando Credenciais

### 🔐 Cadastrar Nova Credencial

**Passo 1**: Vá em **Credenciais** → **Nova Credencial**

**Passo 2**: Escolha o **Serviço**:
- GitHub
- OpenAI
- Anthropic
- Google AI
- Gmail
- Etc.

**Passo 3**: O sistema mostra os **campos necessários**

**Exemplo OpenAI**:
```json
{
  "apiKey": "sk-seu_token_aqui",
  "organizationId": "org-seu_id_aqui"
}
```

**Passo 4**: Clique em **Salvar**

⚠️ **IMPORTANTE**: 
- Credenciais são **criptografadas** no banco
- Use o [Manual de Credenciais](MANUAL-CREDENCIAIS.md) para saber onde pegar cada chave

### ✅ Testar Credencial

Depois de salvar:
1. Clique no ícone **🔍 Testar**
2. Sistema faz uma chamada de teste
3. Mostra ✅ **Sucesso** ou ❌ **Erro**

---

## Criando Tarefas

### 📝 Tipos de Tarefas

1. **Tarefa Simples** - Uma IA executa
2. **Tarefa com Subtarefas** - Dividida em etapas
3. **Tarefa com Cross-Validation** - Múltiplas IAs validam
4. **Tarefa de Workflow** - Segue um fluxo pré-definido

### 🆕 Criar Tarefa Simples

**Passo 1**: Vá em **Tarefas** → **Nova Tarefa**

**Passo 2**: Preencha:

```
Título: Criar API RESTful de Usuários
Descrição: Desenvolver endpoints CRUD para gerenciar usuários:
- GET /users (listar)
- GET /users/:id (detalhes)
- POST /users (criar)
- PUT /users/:id (atualizar)
- DELETE /users/:id (remover)

Stack: Node.js + Express + TypeScript + MySQL

Prioridade: Alta
```

**Passo 3**: Escolha **IA Principal**: "Desenvolvedor Backend"

**Passo 4** (Opcional): Ative **Cross-Validation**:
- Marque "Usar Validação Cruzada"
- Escolha **IAs Validadoras**: "Revisor de Código" + "Analista de Segurança"

**Passo 5**: Clique em **Criar e Executar**

### 📊 Acompanhar Execução

Na tela da tarefa você verá:

```
Status: ⚙️ Executando

┌─────────────────────────────────────┐
│ Etapas:                             │
│ ✅ Planejamento                     │
│ ⚙️ Implementação (45%)              │
│ ⏸️ Validação                        │
│ ⏸️ Documentação                     │
└─────────────────────────────────────┘

Logs em Tempo Real:
[14:30:15] Desenvolvedor Backend: Iniciando implementação...
[14:30:18] Desenvolvedor Backend: Criando estrutura de pastas...
[14:30:25] Desenvolvedor Backend: Implementando GET /users...
```

### 🔄 Subtarefas Automáticas

Quando uma tarefa complexa é criada, o **Orquestrador**:

1. **Analisa** a tarefa
2. **Divide** em subtarefas
3. **Atribui** cada subtarefa para IA adequada
4. **Executa** em paralelo ou sequencial
5. **Valida** resultados entre IAs

**Exemplo**:
```
Tarefa: "Criar sistema de login completo"

Subtarefas Geradas:
├─ 1. Arquitetura de autenticação [Arquiteto]
├─ 2. Implementar backend [Dev Backend]
├─ 3. Criar formulário frontend [Dev Frontend]
├─ 4. Adicionar testes [Testador QA]
├─ 5. Revisar segurança [Analista Segurança]
└─ 6. Documentar API [Documentador]
```

---

## Workflows Automáticos

### 🔄 Templates Pré-Configurados

Já temos **3 templates** prontos:

#### 1. **Desenvolvimento Full-Stack**
```
Etapas:
1. Arquiteto → Planejar arquitetura
2. Dev Backend → Implementar API
3. Dev Frontend → Criar interface
4. DB Expert → Otimizar banco
5. Testador QA → Criar testes
6. Revisor → Code review
7. Seg. Analyst → Auditoria
8. Documentador → Docs
9. DevOps → Deploy
```

#### 2. **Revisão de Pull Request**
```
Etapas:
1. Revisor → Análise de código
2. Seg. Analyst → Vulnerabilidades
3. Testador QA → Cobertura de testes
```

#### 3. **Criação de API RESTful**
```
Etapas:
1. Arquiteto → Design da API
2. Dev Backend → Implementação
3. DB Expert → Schema e queries
4. Seg. Analyst → Auth/Authz
5. Testador QA → Testes de API
6. Documentador → OpenAPI/Swagger
```

### 🆕 Criar Workflow Customizado

**Passo 1**: Vá em **Workflows** → **Novo Workflow**

**Passo 2**: Configure:

```json
{
  "name": "Pipeline de Deploy Seguro",
  "description": "Valida código antes do deploy",
  "steps": [
    {
      "order": 1,
      "action": "review",
      "aiRole": "reviewer",
      "validation": {
        "required": true,
        "validators": ["security"]
      }
    },
    {
      "order": 2,
      "action": "test",
      "aiRole": "tester",
      "validation": {
        "required": true,
        "validators": ["reviewer"]
      }
    },
    {
      "order": 3,
      "action": "deploy",
      "aiRole": "devops",
      "validation": {
        "required": false
      }
    }
  ]
}
```

**Passo 3**: Salve e ative

### ▶️ Executar Workflow

**Passo 1**: Vá em **Workflows** → Selecione um template

**Passo 2**: Clique em **Executar**

**Passo 3**: Informe o contexto:
```
Repositório: https://github.com/user/repo
Branch: main
Commit: abc123
```

**Passo 4**: Acompanhe a execução em tempo real

---

## Base de Conhecimento

### 📚 Para que serve

Armazena documentação e contexto para as IAs:
- Padrões de código da empresa
- Arquitetura do sistema
- Decisões técnicas anteriores
- Snippets reutilizáveis

### ➕ Adicionar Documento

**Passo 1**: Vá em **Base de Conhecimento** → **Novo Documento**

**Passo 2**: Preencha:

```
Título: Padrões de API REST
Categoria: coding-standards
Tags: api, rest, backend, nodejs

Conteúdo:
# Padrões de API REST

## Nomenclatura de Endpoints
- Use substantivos no plural: /users, /products
- Use kebab-case: /user-profiles
- Evite verbos: ❌ /getUsers ✅ /users

## Códigos HTTP
- 200: OK
- 201: Created
- 204: No Content
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Formato de Resposta
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "pageSize": 20
  },
  "links": {
    "self": "/users?page=1",
    "next": "/users?page=2"
  }
}
```
```

**Passo 3**: Clique em **Salvar**

### 🔍 Busca Semântica

O sistema automaticamente:
1. **Indexa** o documento
2. **Cria embeddings** (vetores)
3. **Habilita busca semântica**

Quando uma IA precisa de contexto:
```
Tarefa: "Criar endpoint de usuários"

Sistema busca automaticamente:
✅ "Padrões de API REST"
✅ "Exemplos de CRUD"
✅ "Schema de usuários"

E fornece para a IA como contexto!
```

### 📎 Fontes Externas

**Passo 1**: Vá em **Base de Conhecimento** → **Fontes Externas**

**Passo 2**: Adicione:

```
Tipo: URL
URL: https://docs.empresa.com/api-guidelines
Sincronização: Diária
```

O sistema:
1. Busca a URL periodicamente
2. Extrai o conteúdo
3. Adiciona à base de conhecimento

---

## Monitoramento em Tempo Real

### 📊 Dashboard de Sistema

Vá em **Monitoramento** para ver:

```
┌─────────────────────────────────────┐
│ CPU: ████████░░ 80%                 │
│ RAM: ██████░░░░ 60% (4.8 GB / 8 GB) │
│ Disco: ███░░░░░░░ 30% (150 GB livre)│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ IAs Ativas: 3                       │
│ Tarefas em Execução: 5              │
│ Tarefas Concluídas Hoje: 42         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Custos de API Hoje:                 │
│ OpenAI: $2.43                       │
│ Anthropic: $1.12                    │
│ Google AI: $0.00 (grátis)           │
│ TOTAL: $3.55                        │
└─────────────────────────────────────┘
```

### 📝 Logs de Execução

Veja o histórico detalhado:

```
[14:30:15] 🤖 Desenvolvedor Backend iniciou tarefa #123
[14:30:18] 📝 Criando estrutura de pastas...
[14:30:25] ✅ GET /users implementado
[14:31:02] ✅ POST /users implementado
[14:31:45] 🔍 Revisor de Código validando...
[14:32:10] ⚠️ Revisor encontrou 2 sugestões
[14:32:30] ✅ Sugestões aplicadas
[14:32:45] ✅ Tarefa #123 concluída
```

### 🖥️ Terminal SSH

Acesse um terminal SSH diretamente no navegador:

**Passo 1**: Vá em **Monitoramento** → **Terminal**

**Passo 2**: Faça login:
```
Host: 192.168.1.247
User: flavio
Password: [sua senha]
```

**Passo 3**: Execute comandos:
```bash
cd /home/flavio/orquestrador-v3
pm2 status
pm2 logs orquestrador-v3
```

---

## Casos de Uso Práticos

### 🎯 Caso 1: Desenvolver Feature Completa

**Objetivo**: Criar sistema de comentários em um blog

**Passo 1**: Criar tarefa
```
Título: Sistema de Comentários para Blog
Descrição: 
- Usuários podem comentar em posts
- Comentários aninhados (respostas)
- Moderação de comentários
- Notificações por email

Stack: Node.js + React + MySQL
```

**Passo 2**: Sistema divide automaticamente:
```
Subtarefas:
1. Arquiteto → Design do schema de comentários
2. Dev Backend → API de comentários (CRUD + aninhamento)
3. Dev Frontend → Interface de comentários
4. DB Expert → Índices e queries otimizadas
5. Testador QA → Testes E2E
6. Seg. Analyst → Validar XSS e SQL injection
7. Documentador → Documentar API
```

**Passo 3**: Cross-Validation automática
- Revisor valida código de cada etapa
- Analista de Segurança valida inputs
- Testador valida cobertura de testes

**Passo 4**: Resultado final
- Código completo e revisado
- Testes automatizados
- Documentação
- Aprovado por segurança

---

### 🎯 Caso 2: Code Review Automatizado

**Objetivo**: Revisar PR antes do merge

**Passo 1**: Criar webhook no GitHub
```
URL: http://192.168.1.247/api/webhooks/github
Eventos: Pull Request → opened, synchronize
```

**Passo 2**: Configurar workflow de review
```
Workflow: "Revisão de Pull Request"
Trigger: Webhook do GitHub
```

**Passo 3**: Processo automático:
```
1. GitHub envia webhook
2. Sistema baixa o diff do PR
3. Revisor de Código analisa mudanças
4. Analista de Segurança busca vulnerabilidades
5. Testador QA verifica cobertura de testes
6. Sistema comenta no PR com resultados
```

**Passo 4**: Resultado
```
Comentário no GitHub PR:

## 🤖 Review Automatizado

### ✅ Qualidade de Código
- Código limpo e bem estruturado
- Boas práticas aplicadas
- Nomenclatura consistente

### ⚠️ Segurança
- Encontrado: Validação de input faltando em POST /users
- Recomendação: Adicionar sanitização com express-validator

### ✅ Testes
- Cobertura: 87% (bom!)
- Casos de teste adequados

### 💡 Sugestões
1. Extrair lógica de negócio para service layer
2. Adicionar logs para debugging
```

---

### 🎯 Caso 3: Documentação Automática

**Objetivo**: Gerar docs para código existente

**Passo 1**: Criar tarefa
```
Título: Documentar API de Produtos
Descrição: Gerar documentação OpenAPI/Swagger para a API existente
Repositório: https://github.com/user/ecommerce-api
Arquivos: src/routes/products.ts
```

**Passo 2**: IA Documentador:
1. Analisa o código
2. Identifica endpoints
3. Extrai schemas de request/response
4. Gera documentação OpenAPI

**Passo 3**: Resultado
```yaml
openapi: 3.0.0
info:
  title: Products API
  version: 1.0.0

paths:
  /products:
    get:
      summary: List all products
      parameters:
        - name: page
          in: query
          schema:
            type: integer
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Product'
```

---

## 🎓 Dicas Avançadas

### 💡 Dica 1: Use LM Studio para testes

Durante desenvolvimento:
- Use **Assistente Local (LM Studio)** para testes rápidos
- Sem custo de API
- Resposta rápida
- Reserve APIs pagas para produção

### 💡 Dica 2: Configure Instruções Globais

Vá em **Configurações** → **Instruções**

Adicione padrões que **todas as IAs** devem seguir:
- Padrões de código
- Segurança obrigatória
- Documentação mínima

### 💡 Dica 3: Crie Templates de Tarefas

Para tarefas repetitivas, crie templates:
```
Template: "Criar Novo Endpoint REST"
Descrição: Endpoint: [NOME], Método: [GET/POST/PUT/DELETE], ...
```

Assim você só preenche os campos variáveis.

### 💡 Dica 4: Monitore Custos

Configure alertas de custo:
1. Vá em **Monitoramento** → **Custos de API**
2. Configure limites diários
3. Receba alertas por email quando atingir 80%

---

## 🆘 Problemas Comuns

### Problema: "IA não responde"

**Possíveis causas**:
1. Credencial inválida → Verifique em **Credenciais**
2. Modelo indisponível → Teste outro modelo
3. Timeout → Aumente timeout nas configurações

**Solução**:
```
1. Ir em Credenciais
2. Testar a credencial do provedor
3. Se falhar, revalidar a chave de API
```

### Problema: "Tarefa travou"

**Solução**:
```
1. Vá em Tarefas → Tarefa travada
2. Clique em "Ver Logs"
3. Identifique o erro
4. Clique em "Reiniciar" ou "Cancelar"
```

### Problema: "Custo muito alto"

**Solução**:
1. Use modelos mais baratos (GPT-3.5 ao invés de GPT-4)
2. Ative cache de respostas
3. Use LM Studio para desenvolvimento
4. Configure limites de gastos

---

## 🎉 Conclusão

Agora você sabe usar **todas as funcionalidades** do Orquestrador V3.0!

**Próximos Passos**:
1. ✅ Configure suas credenciais
2. ✅ Teste com uma tarefa simples
3. ✅ Explore os workflows
4. ✅ Adicione documentação à base de conhecimento
5. ✅ Monitore o uso e custos

**Boa orquestração!** 🚀

---

## 📚 Documentação Relacionada

- [Manual de Credenciais](MANUAL-CREDENCIAIS.md) - Como obter chaves de API
- [CORRECAO-502.md](CORRECAO-502.md) - Solução de problemas
- [INSTRUCOES-RAPIDAS.md](INSTRUCOES-RAPIDAS.md) - Guia rápido

---

**Versão**: 3.0  
**Última atualização**: 2025-10-28  
**Autor**: GenSpark AI
