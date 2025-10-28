# 🎯 Guia Rápido de Cadastro - Orquestrador V3.0

## 📋 Checklist Pós-Instalação

Após executar `sudo ./setup-completo.sh`, siga esta ordem:

---

## ✅ ETAPA 1: Verificar Instalação

### Acessar o Sistema:
```
http://192.168.1.247
```
(Nginx na porta 80 - sem precisar especificar porta!)

ou

```
http://192.168.1.247:3001
```
(Direto no backend)

---

## ✅ ETAPA 2: Explorar o Sistema

### 🏠 Dashboard Inicial
Você verá:
- 📊 Estatísticas gerais
- 🤖 Provedores disponíveis (10 cadastrados automaticamente!)
- 📈 Gráficos de uso
- 🔔 Notificações

### 🧭 Menu Lateral (Navegação):
```
├── 📊 Dashboard
├── 🤖 Provedores     ← Veja os 10 provedores já cadastrados!
├── 🎯 Modelos        ← 15+ modelos prontos para usar
├── 📝 Tarefas        ← Criar nova tarefa aqui
├── 🔄 Workflows      ← 2 workflows padrão já criados
├── 🔑 Credenciais    ← CADASTRAR SUAS CHAVES AQUI ⭐
├── 📚 Conhecimento   ← Base de dados já inicializada
├── 📖 Instruções     ← 5 instruções padrão criadas
├── 📋 Templates      ← 3 templates prontos
└── ⚙️ Configurações
```

---

## ✅ ETAPA 3: Cadastrar Credenciais (O MAIS IMPORTANTE!)

### 🔑 Onde Cadastrar?

1. **Clique no menu**: 🔑 **Credenciais**
2. **Clique no botão**: ➕ **"Nova Credencial"**

### 📝 Formulário de Cadastro:

Você verá um formulário com:

```
┌─────────────────────────────────────────┐
│  NOVA CREDENCIAL                        │
├─────────────────────────────────────────┤
│                                         │
│  Serviço: [Dropdown ▼]                 │
│           ├─ OpenAI                     │
│           ├─ Anthropic                  │
│           ├─ Google Gemini              │
│           ├─ Groq                       │
│           ├─ Mistral AI                 │
│           ├─ GitHub                     │
│           ├─ Google Drive               │
│           └─ Gmail                      │
│                                         │
│  Campos mudam conforme o serviço!       │
│                                         │
│  [Botão: Salvar] [Botão: Cancelar]     │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎯 Cadastrar Cada Provedor

### 1️⃣ OpenAI (GPT-4)

**Onde obter**: https://platform.openai.com/api-keys

**No Sistema**:
- **Serviço**: Selecione `OpenAI`
- **API Key**: Cole sua chave (começa com `sk-proj-...`)
- **Salvar**

**Validação**: Sistema testa automaticamente ao salvar

---

### 2️⃣ Anthropic (Claude)

**Onde obter**: https://console.anthropic.com/settings/keys

**No Sistema**:
- **Serviço**: Selecione `Anthropic`
- **API Key**: Cole sua chave (começa com `sk-ant-...`)
- **Salvar**

---

### 3️⃣ Google Gemini (GRÁTIS!) ⭐

**Onde obter**: https://makersuite.google.com/app/apikey

**No Sistema**:
- **Serviço**: Selecione `Google Gemini`
- **API Key**: Cole sua chave (começa com `AIza...`)
- **Salvar**

**💡 Dica**: Este é GRÁTIS! Comece por ele!

---

### 4️⃣ Groq (GRÁTIS e RÁPIDO!) ⚡

**Onde obter**: https://console.groq.com/keys

**No Sistema**:
- **Serviço**: Selecione `Groq`
- **API Key**: Cole sua chave (começa com `gsk_...`)
- **Salvar**

**💡 Dica**: Inferência ultra-rápida! Ótimo para produção.

---

### 5️⃣ GitHub (Para Commits Automáticos)

**Onde obter**: https://github.com/settings/tokens

**No Sistema**:
- **Serviço**: Selecione `GitHub`
- **Token**: Cole seu token (começa com `ghp_...`)
- **Username**: Seu username do GitHub
- **Salvar**

**Scopes necessários**:
- ✅ `repo`
- ✅ `workflow`
- ✅ `gist`

---

### 6️⃣ Gmail (Para Envio de Emails)

**Onde obter**: https://myaccount.google.com/apppasswords

**No Sistema**:
- **Serviço**: Selecione `Gmail`
- **Email**: `seu-email@gmail.com`
- **App Password**: Cola senha (16 dígitos com espaços)
- **Salvar**

**Pré-requisito**: Ter 2FA habilitado na conta Google

---

### 7️⃣ Google Drive (Para Arquivos)

**Onde obter**: https://console.cloud.google.com/apis/credentials

**No Sistema**:
- **Serviço**: Selecione `Google Drive`
- **Client ID**: Cola o ID (termina com `.apps.googleusercontent.com`)
- **Client Secret**: Cola o secret (começa com `GOCSPX-...`)
- **Refresh Token**: Cola o token (começa com `1//...`)
- **Salvar**

**💡 Dica**: Processo mais complexo - veja MANUAL-CREDENCIAIS.md seção 10

---

## ✅ ETAPA 4: Verificar Credenciais Cadastradas

### Tela de Credenciais:

Você verá uma tabela:

```
┌────────────┬──────────┬─────────┬────────────┬─────────┐
│ Serviço    │ Status   │ Tipo    │ Cadastrado │ Ações   │
├────────────┼──────────┼─────────┼────────────┼─────────┤
│ OpenAI     │ ✅ Ativo │ API     │ 2024-10-28 │ [Edit]  │
│ Groq       │ ✅ Ativo │ API     │ 2024-10-28 │ [Edit]  │
│ Gemini     │ ✅ Ativo │ API     │ 2024-10-28 │ [Edit]  │
│ GitHub     │ ✅ Ativo │ OAuth   │ 2024-10-28 │ [Edit]  │
└────────────┴──────────┴─────────┴────────────┴─────────┘
```

**Status**:
- ✅ **Verde (Ativo)**: Credencial válida e funcionando
- ⚠️ **Amarelo (Inválida)**: Chave incorreta ou expirada
- ❌ **Vermelho (Erro)**: Falha ao conectar

---

## ✅ ETAPA 5: Verificar Provedores Ativos

### 🤖 Menu: Provedores

Você verá a lista de provedores já cadastrados:

```
┌──────────────────────┬─────────┬──────────┬──────────┐
│ Provedor             │ Status  │ Modelos  │ Tipo     │
├──────────────────────┼─────────┼──────────┼──────────┤
│ OpenAI               │ ⚠️ Sem  │ 3        │ API      │
│ Anthropic            │ ⚠️ Sem  │ 3        │ API      │
│ Google Gemini        │ ⚠️ Sem  │ 2        │ API      │
│ Groq                 │ ⚠️ Sem  │ 2        │ API      │
│ Mistral AI           │ ⚠️ Sem  │ 1        │ API      │
│ Cohere               │ ⚠️ Sem  │ 0        │ API      │
│ Perplexity           │ ⚠️ Sem  │ 0        │ API      │
│ Together AI          │ ⚠️ Sem  │ 0        │ API      │
│ LM Studio (Local)    │ ✅ Ativo│ 1        │ Local    │
│ Ollama (Local)       │ 🔴 Inát.│ 0        │ Local    │
└──────────────────────┴─────────┴──────────┴──────────┘
```

**Status**:
- ✅ **Ativo**: Tem credencial cadastrada OU não precisa (local)
- ⚠️ **Sem Credencial**: Aguardando você cadastrar a API key
- 🔴 **Inativo**: Desabilitado (clique para ativar se quiser)

### Ativar Provedor:
1. Clique no provedor
2. Cadastre a credencial (botão "Adicionar Credencial")
3. Status muda para ✅ **Ativo**

---

## ✅ ETAPA 6: Testar o Sistema

### Criar Sua Primeira Tarefa!

1. **Vá em**: 📝 **Tarefas**
2. **Clique em**: ➕ **"Nova Tarefa"**
3. **Preencha**:
   ```
   Título: Teste do Orquestrador
   Descrição: Explique o que é inteligência artificial em 3 parágrafos
   Prioridade: Média
   Modelo: [Selecione um que tenha credencial]
   ```
4. **Clique em**: 🚀 **"Executar"**

### Você verá:
- 🔄 Status: `Executando...`
- ⏱️ Tempo decorrido
- 🤖 Qual modelo está sendo usado
- ✅ Resultado ao terminar

---

## ✅ ETAPA 7: Explorar Funcionalidades

### 🔄 Workflows (Orquestração Complexa)

Acesse: **Workflows**

Workflows padrão já criados:
1. **Validação Tripla**: 3 modelos validam a resposta
2. **Desenvolvimento de Software**: 4 etapas (planejar → codificar → revisar → testar)

**Como usar**:
- Clique em um workflow
- Clique em "Executar"
- Defina os parâmetros
- Acompanhe cada etapa

---

### 📚 Base de Conhecimento

Acesse: **Conhecimento**

Já tem 3 itens cadastrados:
- Sobre o Orquestrador
- Cross-Validation entre IAs
- Detecção de Alucinações

**Como adicionar**:
- Clique em ➕ "Novo Item"
- Título, conteúdo, categoria, tags
- Salvar

**Uso**: O sistema usa a base de conhecimento para contextualizar as respostas das IAs.

---

### 📖 Instruções (Prompts Reutilizáveis)

Acesse: **Instruções**

5 instruções padrão já criadas:
- Assistente Geral
- Desenvolvedor de Software
- Analista de Dados
- Escritor Criativo
- Professor Didático

**Como usar**:
- Ao criar tarefa, selecione uma instrução
- Ou crie suas próprias instruções personalizadas

---

### 📋 Templates (Tarefas Pré-Configuradas)

Acesse: **Templates**

3 templates prontos:
- Análise de Código
- Pesquisa e Síntese
- Criação de Conteúdo

**Como usar**:
- Clique em um template
- Clique em "Usar Template"
- Ajuste os parâmetros
- Executar

---

## 🎯 Fluxo Completo de Uso

```
1. Cadastrar Credenciais (Etapa 3)
          ↓
2. Verificar Provedores Ativos (Etapa 5)
          ↓
3. Criar Tarefa ou Usar Template (Etapa 6)
          ↓
4. Executar e Ver Resultado
          ↓
5. (Opcional) Usar Workflows para tarefas complexas
```

---

## 💡 Dicas Importantes

### ✅ Comece pelos GRÁTIS:
1. **LM Studio** (já configurado na porta 1234) ⭐
2. **Google Gemini** (60 req/min grátis)
3. **Groq** (30 req/min grátis, ultra-rápido)

### ⚡ Para Velocidade:
- Use **Groq** (LLaMA 3.1 70B em 2 segundos!)

### 🧠 Para Qualidade Máxima:
- Use **GPT-4 Turbo** (OpenAI)
- Ou **Claude 3.5 Sonnet** (Anthropic)

### 💰 Para Economizar:
- Use **LM Studio** local (grátis e ilimitado)
- Ou **GPT-3.5 Turbo** (barato)

### 🔍 Para Pesquisa Online:
- Use **Perplexity** (busca em tempo real)

---

## 📊 Dashboard de Monitoramento

### Métricas Disponíveis:

No **Dashboard**, você vê:
- 📈 **Tarefas Executadas**: Total e por período
- 💰 **Custos**: Gasto por provedor
- ⚡ **Performance**: Tempo médio de resposta
- 🎯 **Taxa de Sucesso**: % de tarefas concluídas
- 🤖 **Uso por Provedor**: Gráfico de pizza

---

## ❓ Troubleshooting

### Credencial não valida?
1. Verifique se copiou a chave completa
2. Veja se tem espaços extras
3. Confirme que não expirou
4. Teste com o comando `curl` do MANUAL-CREDENCIAIS.md

### Provedor não aparece ativo?
1. Vá em **Credenciais**
2. Veja se está cadastrada
3. Status deve estar ✅ Verde

### LM Studio não funciona?
1. Abra o LM Studio
2. Vá na aba "Local Server"
3. Clique em "Start Server"
4. Verifique: `curl http://localhost:1234/v1/models`

### Tarefa fica "Executando" infinitamente?
1. Verifique os logs no PM2: `pm2 logs orquestrador-v3`
2. Pode ser timeout (aumentar timeout do modelo)
3. Ou credencial inválida (verificar)

---

## 📞 Onde Buscar Ajuda

### Documentação:
- 📖 **MANUAL-CREDENCIAIS.md** - Como obter cada chave
- 📖 **CORRECAO-502.md** - Troubleshooting técnico
- 📖 **README.md** - Visão geral do projeto

### Comandos Úteis:
```bash
# Ver logs do sistema
pm2 logs orquestrador-v3

# Reiniciar sistema
pm2 restart orquestrador-v3

# Ver status
pm2 status

# Diagnóstico completo
./diagnosticar.sh
```

---

## 🎉 Pronto para Usar!

Seu sistema está 100% configurado com:
- ✅ 10 provedores de IA cadastrados
- ✅ 15+ modelos disponíveis
- ✅ Templates e workflows prontos
- ✅ Base de conhecimento inicializada
- ✅ LM Studio local rodando

**Agora é só cadastrar suas chaves e começar a orquestrar IAs!** 🚀

---

**Última atualização**: 2025-10-28  
**Versão**: 3.0
