# 🔑 Manual Completo de Credenciais - Orquestrador de IAs V3.0

## 📖 Índice

1. [OpenAI (GPT-4, GPT-3.5)](#1-openai)
2. [Anthropic (Claude)](#2-anthropic-claude)
3. [Google Gemini](#3-google-gemini)
4. [Groq (LLaMA, Mixtral)](#4-groq)
5. [Mistral AI](#5-mistral-ai)
6. [Cohere](#6-cohere)
7. [Perplexity AI](#7-perplexity-ai)
8. [Together AI](#8-together-ai)
9. [GitHub](#9-github)
10. [Google Drive](#10-google-drive)
11. [Gmail](#11-gmail)
12. [LM Studio (Local)](#12-lm-studio-local)

---

## 1. OpenAI

### 🎯 O que é?
OpenAI é o provedor dos modelos GPT (GPT-4, GPT-4 Turbo, GPT-3.5 Turbo), além de DALL-E e Whisper.

### 💰 Custo
- **Modelo Gratuito**: Não tem versão gratuita
- **Pago**: Pay-as-you-go (pague pelo uso)
  - GPT-4 Turbo: $0.01/1K tokens (input), $0.03/1K tokens (output)
  - GPT-3.5 Turbo: $0.0005/1K tokens (input), $0.0015/1K tokens (output)

### 📝 Como Obter a API Key

#### Passo 1: Criar Conta
1. Acesse: https://platform.openai.com/signup
2. Crie sua conta com email ou Google/Microsoft
3. Confirme seu email

#### Passo 2: Adicionar Método de Pagamento
1. Acesse: https://platform.openai.com/account/billing/overview
2. Clique em **"Add payment details"**
3. Adicione seu cartão de crédito
4. Configure um limite de gastos (recomendado: $10/mês inicialmente)

#### Passo 3: Gerar API Key
1. Acesse: https://platform.openai.com/api-keys
2. Clique em **"+ Create new secret key"**
3. Dê um nome: `Orquestrador-V3`
4. **COPIE A CHAVE AGORA** (ela começa com `sk-proj-...`)
5. Guarde em local seguro (não será mostrada novamente)

### ✅ Como Cadastrar no Sistema

1. Acesse o Orquestrador: `http://192.168.1.247`
2. Vá em **"Configurações" → "Credenciais"**
3. Clique em **"Nova Credencial"**
4. Selecione: **OpenAI**
5. Cole sua API Key no campo
6. Clique em **"Salvar"**

### 🧪 Como Testar
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer SUA_API_KEY_AQUI"
```

Se retornar uma lista de modelos, está funcionando!

---

## 2. Anthropic (Claude)

### 🎯 O que é?
Anthropic é o provedor do Claude (Claude 3.5 Sonnet, Opus, Haiku) - modelos focados em raciocínio e segurança.

### 💰 Custo
- **Modelo Gratuito**: Não tem versão gratuita
- **Pago**: Pay-as-you-go
  - Claude 3.5 Sonnet: $3/1M tokens (input), $15/1M tokens (output)
  - Claude 3 Opus: $15/1M tokens (input), $75/1M tokens (output)
  - Claude 3 Haiku: $0.25/1M tokens (input), $1.25/1M tokens (output)

### 📝 Como Obter a API Key

#### Passo 1: Criar Conta
1. Acesse: https://console.anthropic.com/
2. Clique em **"Sign Up"**
3. Crie sua conta com email
4. Confirme seu email

#### Passo 2: Adicionar Créditos
1. Acesse: https://console.anthropic.com/settings/billing
2. Clique em **"Add credits"**
3. Adicione método de pagamento
4. Compre créditos (mínimo $5)

#### Passo 3: Gerar API Key
1. Acesse: https://console.anthropic.com/settings/keys
2. Clique em **"Create Key"**
3. Dê um nome: `Orquestrador-V3`
4. **COPIE A CHAVE** (começa com `sk-ant-...`)
5. Guarde em local seguro

### ✅ Como Cadastrar no Sistema

1. No Orquestrador: **"Configurações" → "Credenciais"**
2. **"Nova Credencial"** → Selecione **Anthropic**
3. Cole sua API Key
4. **Salvar**

### 🧪 Como Testar
```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: SUA_API_KEY_AQUI" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-3-haiku-20240307","max_tokens":1024,"messages":[{"role":"user","content":"Olá!"}]}'
```

---

## 3. Google Gemini

### 🎯 O que é?
Google Gemini é o modelo multimodal do Google (texto, imagem, vídeo).

### 💰 Custo
- **Modelo Gratuito**: ✅ Sim! (com limites)
  - 60 requisições por minuto
  - Ideal para testes
- **Pago**: Pay-as-you-go
  - Gemini Pro: $0.0005/1K tokens

### 📝 Como Obter a API Key

#### Passo 1: Acessar Google AI Studio
1. Acesse: https://makersuite.google.com/app/apikey
2. Faça login com sua conta Google
3. Aceite os termos de uso

#### Passo 2: Criar API Key
1. Clique em **"Get API Key"** ou **"Create API Key"**
2. Selecione um projeto do Google Cloud (ou crie um novo)
3. **COPIE A CHAVE** (começa com `AIza...`)

### ✅ Como Cadastrar no Sistema

1. No Orquestrador: **"Configurações" → "Credenciais"**
2. **"Nova Credencial"** → Selecione **Google Gemini**
3. Cole sua API Key
4. **Salvar**

### 🧪 Como Testar
```bash
curl "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=SUA_API_KEY_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Olá!"}]}]}'
```

---

## 4. Groq

### 🎯 O que é?
Groq oferece inferência **ultra-rápida** de modelos open-source (LLaMA, Mixtral, Gemma).

### 💰 Custo
- **Modelo Gratuito**: ✅ Sim! (com limites generosos)
  - 30 requisições por minuto
  - 14.400 tokens por minuto
- **Pago**: Planos empresariais

### 📝 Como Obter a API Key

#### Passo 1: Criar Conta
1. Acesse: https://console.groq.com/
2. Clique em **"Sign Up"**
3. Entre com Google ou GitHub

#### Passo 2: Gerar API Key
1. Acesse: https://console.groq.com/keys
2. Clique em **"Create API Key"**
3. Dê um nome: `Orquestrador-V3`
4. **COPIE A CHAVE** (começa com `gsk_...`)

### ✅ Como Cadastrar no Sistema

1. No Orquestrador: **"Configurações" → "Credenciais"**
2. **"Nova Credencial"** → Selecione **Groq**
3. Cole sua API Key
4. **Salvar**

### 🧪 Como Testar
```bash
curl https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer SUA_API_KEY_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"model":"llama-3.1-8b-instant","messages":[{"role":"user","content":"Olá!"}]}'
```

---

## 5. Mistral AI

### 🎯 O que é?
Mistral AI é uma empresa europeia com modelos poderosos (Mistral Large, Medium).

### 💰 Custo
- **Modelo Gratuito**: Não tem versão gratuita
- **Pago**: Pay-as-you-go
  - Mistral Large: $4/1M tokens (input), $12/1M tokens (output)
  - Mistral Small: $1/1M tokens (input), $3/1M tokens (output)

### 📝 Como Obter a API Key

#### Passo 1: Criar Conta
1. Acesse: https://console.mistral.ai/
2. Clique em **"Sign Up"**
3. Crie sua conta

#### Passo 2: Adicionar Pagamento
1. Vá em **"Billing"**
2. Adicione método de pagamento

#### Passo 3: Gerar API Key
1. Acesse: https://console.mistral.ai/api-keys/
2. Clique em **"Create new key"**
3. **COPIE A CHAVE**

### ✅ Como Cadastrar no Sistema

1. No Orquestrador: **"Configurações" → "Credenciais"**
2. **"Nova Credencial"** → Selecione **Mistral AI**
3. Cole sua API Key
4. **Salvar**

---

## 6. Cohere

### 🎯 O que é?
Cohere oferece modelos especializados em empresas (Command R+, Embed).

### 💰 Custo
- **Modelo Gratuito**: ✅ Sim! (Trial)
  - 1.000 chamadas/mês grátis
- **Pago**: $0.40 - $15 por 1M tokens

### 📝 Como Obter a API Key

#### Passo 1: Criar Conta
1. Acesse: https://dashboard.cohere.com/
2. **"Sign Up"**
3. Entre com Google ou email

#### Passo 2: Gerar API Key
1. No dashboard, clique em **"API Keys"**
2. Copie a chave de **"Trial Key"** (ou crie uma Production Key)

### ✅ Como Cadastrar no Sistema

1. No Orquestrador: **"Configurações" → "Credenciais"**
2. **"Nova Credencial"** → Selecione **Cohere**
3. Cole sua API Key
4. **Salvar**

---

## 7. Perplexity AI

### 🎯 O que é?
Perplexity oferece modelos com **busca em tempo real** na internet.

### 💰 Custo
- **Modelo Gratuito**: ✅ Sim! (com limites)
  - 50 requisições/dia
- **Pago**: $20/mês (ilimitado)

### 📝 Como Obter a API Key

#### Passo 1: Criar Conta
1. Acesse: https://www.perplexity.ai/
2. Crie conta e faça login

#### Passo 2: Assinar Plano (se quiser)
1. Vá em **"Settings" → "API"**
2. Se necessário, assine o plano Pro

#### Passo 3: Gerar API Key
1. Em **Settings → API**: https://www.perplexity.ai/settings/api
2. Clique em **"Generate"**
3. **COPIE A CHAVE** (começa com `pplx-...`)

### ✅ Como Cadastrar no Sistema

1. No Orquestrador: **"Configurações" → "Credenciais"**
2. **"Nova Credencial"** → Selecione **Perplexity**
3. Cole sua API Key
4. **Salvar**

---

## 8. Together AI

### 🎯 O que é?
Together AI dá acesso a **dezenas de modelos open-source** (LLaMA, Mixtral, Qwen, etc.).

### 💰 Custo
- **Modelo Gratuito**: ✅ Sim! ($5 de crédito grátis)
- **Pago**: A partir de $0.10 por 1M tokens

### 📝 Como Obter a API Key

#### Passo 1: Criar Conta
1. Acesse: https://api.together.xyz/
2. **"Sign Up"**

#### Passo 2: Gerar API Key
1. No dashboard: https://api.together.xyz/settings/api-keys
2. Clique em **"Create API Key"**
3. **COPIE A CHAVE**

### ✅ Como Cadastrar no Sistema

1. No Orquestrador: **"Configurações" → "Credenciais"**
2. **"Nova Credencial"** → Selecione **Together AI**
3. Cole sua API Key
4. **Salvar**

---

## 9. GitHub

### 🎯 Para que serve?
Integração com GitHub para commits automáticos, pull requests, gestão de issues.

### 📝 Como Obter o Token

#### Passo 1: Acessar Configurações
1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**

#### Passo 2: Configurar Permissões
Marque os seguintes **scopes**:
- ✅ `repo` (Full control of private repositories)
- ✅ `workflow` (Update GitHub Action workflows)
- ✅ `gist` (Create gists)
- ✅ `read:org` (Read org and team membership)

#### Passo 3: Gerar Token
1. Dê um nome: `Orquestrador-V3`
2. Defina expiração (recomendado: 90 dias ou sem expiração)
3. Clique em **"Generate token"**
4. **COPIE O TOKEN** (começa com `ghp_...`)

### ✅ Como Cadastrar no Sistema

1. No Orquestrador: **"Configurações" → "Credenciais"**
2. **"Nova Credencial"** → Selecione **GitHub**
3. Cole:
   - **Token**: `ghp_...`
   - **Username**: seu username do GitHub
4. **Salvar**

---

## 10. Google Drive

### 🎯 Para que serve?
Upload/download de arquivos, backup automático, compartilhamento.

### 📝 Como Obter Credenciais OAuth

#### Passo 1: Criar Projeto no Google Cloud
1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto: **"Orquestrador-V3"**

#### Passo 2: Habilitar API do Google Drive
1. Vá em **"APIs & Services" → "Library"**
2. Busque por **"Google Drive API"**
3. Clique em **"Enable"**

#### Passo 3: Criar Credenciais OAuth
1. Vá em **"APIs & Services" → "Credentials"**
2. Clique em **"+ Create Credentials" → "OAuth client ID"**
3. Tipo: **"Desktop app"**
4. Nome: `Orquestrador-V3`
5. **COPIE**:
   - **Client ID** (termina com `.apps.googleusercontent.com`)
   - **Client Secret** (começa com `GOCSPX-...`)

#### Passo 4: Obter Refresh Token (Avançado)
Você precisará de um código para gerar o refresh token. Use a ferramenta OAuth Playground:

1. Acesse: https://developers.google.com/oauthplayground/
2. No canto direito, clique na **engrenagem** (⚙️)
3. Marque: **"Use your own OAuth credentials"**
4. Cole seu **Client ID** e **Client Secret**
5. Na esquerda, busque: **"Drive API v3"**
6. Marque: `https://www.googleapis.com/auth/drive`
7. Clique em **"Authorize APIs"**
8. Autorize com sua conta Google
9. Clique em **"Exchange authorization code for tokens"**
10. **COPIE o "Refresh token"** (começa com `1//...`)

### ✅ Como Cadastrar no Sistema

1. No Orquestrador: **"Configurações" → "Credenciais"**
2. **"Nova Credencial"** → Selecione **Google Drive**
3. Cole:
   - **Client ID**: `xxx.apps.googleusercontent.com`
   - **Client Secret**: `GOCSPX-...`
   - **Refresh Token**: `1//...`
4. **Salvar**

---

## 11. Gmail

### 🎯 Para que serve?
Envio de emails automáticos, notificações, alertas.

### 📝 Como Obter App Password

#### Passo 1: Habilitar 2-Step Verification
1. Acesse: https://myaccount.google.com/security
2. Em **"Signing in to Google"**, ative **"2-Step Verification"**
3. Configure (SMS, app autenticador, etc.)

#### Passo 2: Gerar App Password
1. Acesse: https://myaccount.google.com/apppasswords
2. Se pedir, faça login novamente
3. Em **"Select app"**: escolha **"Mail"**
4. Em **"Select device"**: escolha **"Other"** e digite `Orquestrador`
5. Clique em **"Generate"**
6. **COPIE A SENHA** (16 caracteres com espaços, exemplo: `xxxx xxxx xxxx xxxx`)

### ✅ Como Cadastrar no Sistema

1. No Orquestrador: **"Configurações" → "Credenciais"**
2. **"Nova Credencial"** → Selecione **Gmail**
3. Cole:
   - **Email**: `seu-email@gmail.com`
   - **App Password**: `xxxx xxxx xxxx xxxx`
4. **Salvar**

---

## 12. LM Studio (Local)

### 🎯 O que é?
LM Studio permite rodar modelos de IA **localmente** no seu computador - **GRÁTIS** e **sem limites**!

### 💰 Custo
- ✅ **100% GRATUITO** (roda no seu hardware)

### 📝 Como Configurar

#### Passo 1: Baixar LM Studio
1. Acesse: https://lmstudio.ai/
2. Baixe para seu sistema operacional
3. Instale

#### Passo 2: Baixar um Modelo
1. Abra o LM Studio
2. Vá na aba **"Discover"** (🔍)
3. Baixe um modelo (recomendados):
   - **Mistral 7B** (7GB) - Bom equilíbrio
   - **LLaMA 2 7B** (7GB) - Rápido
   - **Phi-2** (2GB) - Para PCs modestos

#### Passo 3: Iniciar Servidor Local
1. No LM Studio, vá na aba **"Local Server"** (🖥️)
2. Selecione o modelo baixado
3. Clique em **"Start Server"**
4. Verifique que está rodando em: `http://localhost:1234`

### ✅ Como Cadastrar no Sistema

**Já está configurado!** O setup automático já cadastrou o LM Studio na porta 1234.

Para verificar:
1. No Orquestrador: **"Provedores"**
2. Veja se **"LM Studio (Local)"** está ativo
3. Para testar:
```bash
curl http://localhost:1234/v1/models
```

---

## 🎯 Resumo Rápido: Gratuitos vs. Pagos

### ✅ **TOTALMENTE GRATUITOS** (com limites razoáveis):
- **Google Gemini** - 60 req/min (ótimo para testes)
- **Groq** - 30 req/min, ultra-rápido
- **Cohere** - 1.000 req/mês
- **Perplexity** - 50 req/dia
- **Together AI** - $5 de crédito grátis
- **LM Studio** - Ilimitado local ⭐

### 💰 **PAGOS** (mais poderosos):
- **OpenAI** - GPT-4 (melhor qualidade)
- **Anthropic** - Claude 3.5 (melhor raciocínio)
- **Mistral AI** - Modelos europeus

---

## 🚀 Ordem Recomendada de Cadastro

### Para Iniciantes (Grátis):
1. ✅ **LM Studio** (já configurado!)
2. ✅ **Google Gemini** (mais fácil)
3. ✅ **Groq** (super rápido)
4. ✅ **Cohere** (trial generoso)

### Para Produção (Pago):
1. 💰 **OpenAI** (GPT-4 Turbo)
2. 💰 **Anthropic** (Claude 3.5 Sonnet)
3. 💰 **Mistral AI** (alternativa europeia)

---

## ❓ Dúvidas Frequentes

### Como sei se minha chave está funcionando?
Use os comandos de teste (`curl`) em cada seção deste manual.

### Posso usar múltiplos provedores ao mesmo tempo?
✅ Sim! O Orquestrador foi feito para isso. Use vários provedores e compare resultados.

### O que acontece se eu atingir o limite gratuito?
O provedor retornará erro 429 (rate limit). Use outro provedor ou aguarde o reset.

### LM Studio é realmente grátis?
✅ Sim! Roda 100% no seu computador. Único "custo" é a eletricidade.

### Qual provedor recomenda para começar?
1. **LM Studio** (local, grátis)
2. **Groq** (API grátis, super rápido)
3. **Google Gemini** (API grátis, boa qualidade)

---

## 📞 Suporte

Se tiver dúvidas:
- 📧 Verifique a documentação de cada provedor
- 🔍 Google: "como obter API key [nome do provedor]"
- 📖 Leia o README.md do projeto

---

**Última atualização**: 2025-10-28  
**Versão**: 3.0  
**Autor**: GenSpark AI
