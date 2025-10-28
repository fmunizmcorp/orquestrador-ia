# 📘 Manual Completo de Credenciais - Orquestrador V3.0

Este manual ensina **passo a passo** onde e como obter cada chave de API, token e credencial necessária para o sistema.

---

## 📑 Índice

1. [GitHub](#1-github)
2. [OpenAI (GPT-4, GPT-3.5, DALL-E)](#2-openai)
3. [Anthropic (Claude)](#3-anthropic-claude)
4. [Google AI (Gemini)](#4-google-ai-gemini)
5. [Google Drive](#5-google-drive)
6. [Gmail](#6-gmail)
7. [Mistral AI](#7-mistral-ai)
8. [Hugging Face](#8-hugging-face)
9. [Together AI](#9-together-ai)
10. [Perplexity AI](#10-perplexity-ai)
11. [Cohere](#11-cohere)
12. [LM Studio (Local)](#12-lm-studio-local)

---

## 1. GitHub

### 🎯 Para que serve
- Integração com repositórios
- Criar/gerenciar issues e pull requests
- Automação de workflows

### 📍 Onde conseguir

**Passo 1**: Acesse https://github.com/settings/tokens

**Passo 2**: Clique em **"Generate new token"** → **"Generate new token (classic)"**

**Passo 3**: Configure o token:
- **Note**: "Orquestrador V3.0"
- **Expiration**: 90 days (ou No expiration se preferir)
- **Scopes** (marque estas opções):
  - ✅ `repo` (Full control of private repositories)
  - ✅ `workflow` (Update GitHub Action workflows)
  - ✅ `read:org` (Read org and team membership)
  - ✅ `read:user` (Read ALL user profile data)

**Passo 4**: Clique em **"Generate token"**

**Passo 5**: Copie o token (começa com `ghp_`)

### 🔐 Como cadastrar no sistema

1. Acesse: **Credenciais** → **Nova Credencial**
2. Serviço: **GitHub**
3. Preencha:
   ```json
   {
     "token": "ghp_seu_token_aqui",
     "username": "seu-usuario-github"
   }
   ```

---

## 2. OpenAI

### 🎯 Para que serve
- GPT-4, GPT-3.5 Turbo (chat e completion)
- DALL-E 3 (geração de imagens)
- Embeddings para busca semântica

### 📍 Onde conseguir

**Passo 1**: Crie uma conta em https://platform.openai.com/

**Passo 2**: Acesse https://platform.openai.com/api-keys

**Passo 3**: Clique em **"+ Create new secret key"**

**Passo 4**: Dê um nome: "Orquestrador V3.0"

**Passo 5**: Copie a chave (começa com `sk-`)

⚠️ **IMPORTANTE**: A chave só é mostrada UMA VEZ!

**Passo 6** (Opcional): Pegue seu Organization ID:
- Vá em https://platform.openai.com/settings/organization
- Copie o ID (começa com `org-`)

### 💰 Configurar Billing

**Passo 1**: Acesse https://platform.openai.com/settings/organization/billing/overview

**Passo 2**: Clique em **"Add payment method"**

**Passo 3**: Adicione cartão de crédito

**Passo 4** (Recomendado): Configure **Usage Limits**:
- Hard limit: $50/mês (ou o que preferir)
- Email alert: 80% do limite

### 🔐 Como cadastrar no sistema

1. Acesse: **Credenciais** → **Nova Credencial**
2. Serviço: **OpenAI**
3. Preencha:
   ```json
   {
     "apiKey": "sk-seu_token_aqui",
     "organizationId": "org-seu_id_aqui"
   }
   ```

---

## 3. Anthropic (Claude)

### 🎯 Para que serve
- Claude 3 Opus, Sonnet, Haiku
- Contexto ultra-longo (200k tokens)
- Análise de documentos

### 📍 Onde conseguir

**Passo 1**: Crie uma conta em https://console.anthropic.com/

**Passo 2**: Complete o cadastro e verificação de email

**Passo 3**: Acesse https://console.anthropic.com/settings/keys

**Passo 4**: Clique em **"Create Key"**

**Passo 5**: Dê um nome: "Orquestrador V3.0"

**Passo 6**: Copie a chave (começa com `sk-ant-`)

### 💰 Configurar Créditos

**Passo 1**: Acesse https://console.anthropic.com/settings/billing

**Passo 2**: Clique em **"Add Credits"**

**Passo 3**: Escolha o valor (mínimo $5)

**Passo 4**: Configure alertas de uso

### 🔐 Como cadastrar no sistema

1. Acesse: **Credenciais** → **Nova Credencial**
2. Serviço: **Anthropic**
3. Preencha:
   ```json
   {
     "apiKey": "sk-ant-seu_token_aqui"
   }
   ```

---

## 4. Google AI (Gemini)

### 🎯 Para que serve
- Gemini 1.5 Pro, Flash
- Contexto ultra-longo (1M tokens)
- Multimodal (texto + imagem)

### 📍 Onde conseguir

**Passo 1**: Acesse https://makersuite.google.com/app/apikey

**Passo 2**: Faça login com sua conta Google

**Passo 3**: Clique em **"Create API Key"**

**Passo 4**: Selecione um projeto Google Cloud (ou crie um novo)

**Passo 5**: Copie a chave (começa com `AIzaSy`)

### 💰 Uso Gratuito

- Gemini tem **tier gratuito generoso**
- 15 requisições por minuto (RPM)
- 1 milhão de tokens por dia

### 🔐 Como cadastrar no sistema

1. Acesse: **Credenciais** → **Nova Credencial**
2. Serviço: **Google AI**
3. Preencha:
   ```json
   {
     "apiKey": "AIzaSy_seu_token_aqui"
   }
   ```

---

## 5. Google Drive

### 🎯 Para que serve
- Salvar/ler arquivos do Drive
- Backup automático
- Compartilhamento de documentos

### 📍 Onde conseguir

**Passo 1**: Acesse https://console.cloud.google.com/

**Passo 2**: Crie um novo projeto ou selecione um existente

**Passo 3**: Ative a API do Google Drive:
- Vá em **"APIs & Services"** → **"Library"**
- Busque "Google Drive API"
- Clique em **"Enable"**

**Passo 4**: Crie credenciais OAuth 2.0:
- Vá em **"APIs & Services"** → **"Credentials"**
- Clique em **"+ Create Credentials"** → **"OAuth client ID"**
- Tipo: **"Desktop app"**
- Nome: "Orquestrador V3.0"

**Passo 5**: Copie:
- **Client ID**: `xxxxx.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-xxxxx`

**Passo 6**: Clique em **"Download JSON"**

**Passo 7**: Gerar Refresh Token (use o script abaixo):

```bash
# Instale o gcloud CLI se não tiver
curl https://sdk.cloud.google.com | bash

# Autentique
gcloud auth application-default login --client-id-file=credentials.json

# O refresh token estará em ~/.config/gcloud/application_default_credentials.json
```

**Alternativa**: Use uma ferramenta OAuth2 Playground:
- Acesse https://developers.google.com/oauthplayground/
- Selecione "Drive API v3"
- Autorize com sua conta
- Clique em "Exchange authorization code for tokens"
- Copie o `refresh_token`

### 🔐 Como cadastrar no sistema

1. Acesse: **Credenciais** → **Nova Credencial**
2. Serviço: **Google Drive**
3. Preencha:
   ```json
   {
     "clientId": "123456-abc.apps.googleusercontent.com",
     "clientSecret": "GOCSPX-seu_secret_aqui",
     "refreshToken": "seu_refresh_token_aqui"
   }
   ```

---

## 6. Gmail

### 🎯 Para que serve
- Enviar emails automaticamente
- Notificações do sistema
- Alertas de tarefas

### 📍 Onde conseguir

**Passo 1**: Ative a verificação em 2 etapas na sua conta Google:
- Acesse https://myaccount.google.com/security
- Clique em **"Verificação em duas etapas"**
- Siga o processo de ativação

**Passo 2**: Gere uma senha de app:
- Acesse https://myaccount.google.com/apppasswords
- Nome: "Orquestrador V3.0"
- Clique em **"Gerar"**

**Passo 3**: Copie a senha de 16 caracteres (formato: `xxxx xxxx xxxx xxxx`)

### 🔐 Como cadastrar no sistema

1. Acesse: **Credenciais** → **Nova Credencial**
2. Serviço: **Gmail**
3. Preencha:
   ```json
   {
     "email": "seu-email@gmail.com",
     "appPassword": "xxxx xxxx xxxx xxxx"
   }
   ```

---

## 7. Mistral AI

### 🎯 Para que serve
- Mistral Large, Medium, Small
- Mixtral 8x7B (MOE)
- Modelos open-source de alta performance

### 📍 Onde conseguir

**Passo 1**: Crie uma conta em https://console.mistral.ai/

**Passo 2**: Acesse https://console.mistral.ai/api-keys/

**Passo 3**: Clique em **"Create new key"**

**Passo 4**: Dê um nome: "Orquestrador V3.0"

**Passo 5**: Copie a chave

### 💰 Configurar Billing

**Passo 1**: Acesse https://console.mistral.ai/billing/

**Passo 2**: Adicione cartão de crédito

**Passo 3**: Comece com $5 de crédito

### 🔐 Como cadastrar no sistema

1. Acesse: **Credenciais** → **Nova Credencial**
2. Serviço: **Mistral AI**
3. Preencha:
   ```json
   {
     "apiKey": "seu_token_aqui"
   }
   ```

---

## 8. Hugging Face

### 🎯 Para que serve
- Acesso a milhares de modelos open-source
- Stable Diffusion (imagens)
- Modelos de texto, fala, etc.

### 📍 Onde conseguir

**Passo 1**: Crie uma conta em https://huggingface.co/

**Passo 2**: Acesse https://huggingface.co/settings/tokens

**Passo 3**: Clique em **"New token"**

**Passo 4**: Configure:
- **Name**: "Orquestrador V3.0"
- **Role**: "Write" (ou "Read" se preferir apenas leitura)

**Passo 5**: Clique em **"Generate a token"**

**Passo 6**: Copie o token (começa com `hf_`)

### 💰 Uso Gratuito

- Hugging Face tem **tier gratuito**
- Limitado a alguns modelos e requisições
- Para uso intenso, considere o Pro ($9/mês)

### 🔐 Como cadastrar no sistema

1. Acesse: **Credenciais** → **Nova Credencial**
2. Serviço: **Hugging Face**
3. Preencha:
   ```json
   {
     "token": "hf_seu_token_aqui"
   }
   ```

---

## 9. Together AI

### 🎯 Para que serve
- Modelos open-source otimizados
- Llama 2, Mixtral, Qwen, Yi
- Boa relação custo-benefício

### 📍 Onde conseguir

**Passo 1**: Crie uma conta em https://api.together.xyz/

**Passo 2**: Complete o cadastro

**Passo 3**: Acesse https://api.together.xyz/settings/api-keys

**Passo 4**: Clique em **"Create API Key"**

**Passo 5**: Dê um nome: "Orquestrador V3.0"

**Passo 6**: Copie a chave

### 💰 Créditos Iniciais

- Together AI dá **$1 de crédito grátis**
- Depois, adicione créditos conforme necessário

### 🔐 Como cadastrar no sistema

1. Acesse: **Credenciais** → **Nova Credencial**
2. Serviço: **Together AI**
3. Preencha:
   ```json
   {
     "apiKey": "seu_token_aqui"
   }
   ```

---

## 10. Perplexity AI

### 🎯 Para que serve
- Pesquisa com IA
- Respostas com citações de fontes
- Busca atualizada em tempo real

### 📍 Onde conseguir

**Passo 1**: Crie uma conta em https://www.perplexity.ai/

**Passo 2**: Acesse https://www.perplexity.ai/settings/api

**Passo 3**: Clique em **"Generate API Key"**

**Passo 4**: Dê um nome: "Orquestrador V3.0"

**Passo 5**: Copie a chave (começa com `pplx-`)

### 💰 Planos

- **Free**: 5 requisições por dia
- **Pro**: $20/mês (600 requisições por dia)
- **Enterprise**: Customizado

### 🔐 Como cadastrar no sistema

1. Acesse: **Credenciais** → **Nova Credencial**
2. Serviço: **Perplexity AI**
3. Preencha:
   ```json
   {
     "apiKey": "pplx-seu_token_aqui"
   }
   ```

---

## 11. Cohere

### 🎯 Para que serve
- Embeddings multilíngues
- Reranking de busca
- Modelos Command para chat

### 📍 Onde conseguir

**Passo 1**: Crie uma conta em https://dashboard.cohere.com/

**Passo 2**: Acesse https://dashboard.cohere.com/api-keys

**Passo 3**: Clique em **"+ Create API Key"**

**Passo 4**: Configure:
- **Name**: "Orquestrador V3.0"
- **Environment**: "Production"

**Passo 5**: Copie a chave

### 💰 Uso Gratuito

- **Trial**: 100 chamadas/mês grátis
- **Production**: Pay-as-you-go

### 🔐 Como cadastrar no sistema

1. Acesse: **Credenciais** → **Nova Credencial**
2. Serviço: **Cohere**
3. Preencha:
   ```json
   {
     "apiKey": "seu_token_aqui"
   }
   ```

---

## 12. LM Studio (Local)

### 🎯 Para que serve
- Rodar modelos de IA localmente
- Sem custos de API
- Total privacidade

### 📍 Como configurar

**Passo 1**: Baixe LM Studio:
- Acesse https://lmstudio.ai/
- Baixe para seu sistema operacional
- Instale

**Passo 2**: Baixe um modelo:
- Abra LM Studio
- Vá na aba **"Discover"**
- Busque: "llama-3.1-8b-instruct" (recomendado)
- Clique em **"Download"**

**Passo 3**: Inicie o servidor:
- Vá na aba **"Local Server"**
- Clique em **"Start Server"**
- Porta padrão: **1234**

**Passo 4**: Teste:
```bash
curl http://localhost:1234/v1/models
```

### ✅ Já está configurado!

O LM Studio já foi cadastrado automaticamente no sistema:
- **Endpoint**: `http://localhost:1234/v1`
- **Porta**: 1234
- **Autenticação**: Não requer

---

## 📋 Checklist de Configuração

Marque conforme for completando:

### Serviços Gratuitos (Comece por aqui!)
- [ ] **LM Studio** - Totalmente local e grátis
- [ ] **Google AI (Gemini)** - Tier gratuito generoso
- [ ] **Hugging Face** - Modelos open-source grátis

### Serviços com Trial/Créditos Iniciais
- [ ] **OpenAI** - $5 de crédito inicial
- [ ] **Anthropic** - $5 de crédito inicial
- [ ] **Together AI** - $1 de crédito grátis
- [ ] **Perplexity** - 5 requisições/dia grátis

### Serviços Pagos (Configure quando precisar)
- [ ] **Mistral AI** - Pay-as-you-go
- [ ] **Cohere** - Pay-as-you-go

### Integrações (Opcionais)
- [ ] **GitHub** - Para automação de repos
- [ ] **Google Drive** - Para backup
- [ ] **Gmail** - Para notificações

---

## 🚀 Ordem Recomendada de Configuração

### **Fase 1: Começar Imediatamente (Grátis)**
1. ✅ LM Studio (local)
2. ✅ Google AI (Gemini)
3. ✅ Hugging Face

Com estes 3, você já pode usar o sistema!

### **Fase 2: Expandir Capacidades ($10-15)**
4. OpenAI ($5 de crédito)
5. Anthropic ($5 de crédito)
6. Together AI ($1 de crédito)

### **Fase 3: Integrações Úteis**
7. GitHub (grátis)
8. Gmail (grátis)

### **Fase 4: Recursos Avançados (Opcional)**
9. Google Drive (se precisar de backup na nuvem)
10. Mistral AI (se quiser modelos europeus)
11. Perplexity (se precisar de busca com IA)

---

## 💡 Dicas de Economia

### **Use modelos mais baratos primeiro**
- GPT-3.5 Turbo ao invés de GPT-4
- Claude Haiku ao invés de Opus
- Gemini Flash ao invés de Pro

### **LM Studio para desenvolvimento**
- Use modelos locais durante desenvolvimento
- Reserve APIs pagas para produção

### **Configure limites de gastos**
- OpenAI: Configure hard limits
- Anthropic: Configure alertas
- Monitore uso regularmente

### **Aproveite tiers gratuitos**
- Google AI Gemini: 15 RPM grátis
- Hugging Face: Muitos modelos grátis
- Together AI: $1 de crédito inicial

---

## 🆘 Problemas Comuns

### **"Invalid API Key"**
- ✅ Verifique se copiou a chave completa
- ✅ Não inclua espaços ou aspas extras
- ✅ Algumas chaves expiram, gere uma nova

### **"Rate limit exceeded"**
- ✅ Você excedeu o limite de requisições
- ✅ Espere alguns minutos
- ✅ Configure timeouts no sistema

### **"Insufficient credits"**
- ✅ Adicione créditos na plataforma
- ✅ Verifique se o billing está configurado

### **LM Studio não conecta**
- ✅ Verifique se o servidor está rodando
- ✅ Porta correta: 1234
- ✅ Tente: `curl http://localhost:1234/v1/models`

---

## 📞 Suporte

Se tiver dúvidas sobre alguma credencial:

1. Consulte a documentação oficial do serviço
2. Verifique os exemplos neste manual
3. Teste a chave antes de cadastrar no sistema

---

## 🎉 Pronto!

Agora você tem todas as informações para configurar **qualquer credencial** do sistema!

**Recomendação**: Comece com LM Studio + Google AI (ambos grátis) e expanda conforme necessário.

Boa orquestração! 🚀
