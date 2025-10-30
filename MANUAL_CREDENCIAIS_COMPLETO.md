# 🔐 MANUAL COMPLETO DE CREDENCIAIS - Orquestrador de IAs

**Data:** 30 de Outubro de 2025  
**Para:** Usuários do Sistema  
**Objetivo:** Guia passo-a-passo para obter TODAS as credenciais necessárias

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [GitHub](#1-github)
3. [Google Drive](#2-google-drive)
4. [Gmail](#3-gmail)
5. [Google Sheets](#4-google-sheets)
6. [OpenAI](#5-openai)
7. [Anthropic (Claude)](#6-anthropic-claude)
8. [Notion](#7-notion)
9. [Slack](#8-slack)
10. [Discord](#9-discord)
11. [Como Cadastrar no Sistema](#como-cadastrar-no-sistema)

---

## 🎯 VISÃO GERAL

### Tipos de Autenticação

O sistema suporta 3 tipos principais:

1. **OAuth2** - Mais seguro, usa fluxo de autorização
   - Google (Drive, Gmail, Sheets)
   
2. **API Key** - Chave de acesso direta
   - OpenAI, Anthropic
   
3. **Token** - Token de acesso pessoal
   - GitHub, Notion, Slack, Discord

### Informações Necessárias por Tipo

#### OAuth2 (Google)
```json
{
  "clientId": "xxx.apps.googleusercontent.com",
  "clientSecret": "GOCSPX-xxxxx",
  "refreshToken": "1//xxxxx"
}
```

#### API Key (OpenAI, Anthropic)
```json
{
  "apiKey": "sk-xxxxx" // ou "sk-ant-xxxxx"
}
```

#### Token (GitHub, Notion, Slack, Discord)
```json
{
  "token": "ghp_xxxxx" // ou outros formatos
}
```

---

## 1. GITHUB

### Tipo: Token de Acesso Pessoal (PAT)

### Passo 1: Acessar GitHub

1. Vá para: https://github.com
2. Faça login na sua conta
3. Clique na sua foto de perfil (canto superior direito)
4. Selecione **Settings** (Configurações)

### Passo 2: Criar Token

1. No menu lateral esquerdo, role até o fim
2. Clique em **Developer settings**
3. Clique em **Personal access tokens**
4. Clique em **Tokens (classic)**
5. Clique no botão **Generate new token (classic)**

### Passo 3: Configurar Permissões

**Nome do Token:** `Orquestrador-IA`

**Expiration:** Escolha período (recomendado: 90 days)

**Selecione os Scopes:**

```
☑ repo (todos os sub-itens)
  ☑ repo:status
  ☑ repo_deployment
  ☑ public_repo
  ☑ repo:invite
  ☑ security_events

☑ workflow

☑ write:packages
  ☑ read:packages

☑ admin:org (se vai usar em organizações)
  ☑ write:org
  ☑ read:org

☑ admin:public_key
  ☑ write:public_key
  ☑ read:public_key

☑ admin:repo_hook
  ☑ write:repo_hook
  ☑ read:repo_hook

☑ user (todos)
  ☑ read:user
  ☑ user:email
  ☑ user:follow

☑ project
  ☑ read:project
```

### Passo 4: Gerar e Copiar

1. Role até o fim e clique em **Generate token**
2. **⚠️ IMPORTANTE:** Copie o token IMEDIATAMENTE
3. O token começa com `ghp_`
4. **Você NÃO VERÁ O TOKEN NOVAMENTE!**

### Exemplo de Token:
```
ghp_abc123def456ghi789jkl012mno345pqr678
```

### Informações para Cadastrar no Sistema:

```json
{
  "service": "GitHub",
  "credentialType": "token",
  "fields": {
    "token": "ghp_SEU_TOKEN_AQUI",
    "username": "seu_usuario_github"
  }
}
```

---

## 2. GOOGLE DRIVE

### Tipo: OAuth2

### Passo 1: Criar Projeto no Google Cloud

1. Acesse: https://console.cloud.google.com
2. Faça login com sua conta Google
3. Clique em **Select a project** (canto superior)
4. Clique em **NEW PROJECT**
5. Nome: `Orquestrador-IA`
6. Clique em **CREATE**

### Passo 2: Ativar API do Google Drive

1. No menu lateral, vá em **APIs & Services** > **Library**
2. Pesquise por `Google Drive API`
3. Clique no resultado
4. Clique em **ENABLE**

### Passo 3: Criar Credenciais OAuth2

1. Vá em **APIs & Services** > **Credentials**
2. Clique em **+ CREATE CREDENTIALS**
3. Selecione **OAuth client ID**
4. Se pedir para configurar tela de consentimento:
   - Clique em **CONFIGURE CONSENT SCREEN**
   - Escolha **External**
   - Clique **CREATE**
   - Preencha:
     - **App name:** Orquestrador-IA
     - **User support email:** seu email
     - **Developer contact:** seu email
   - Clique **SAVE AND CONTINUE**
   - Em Scopes, clique **ADD OR REMOVE SCOPES**
   - Adicione: `https://www.googleapis.com/auth/drive`
   - Clique **SAVE AND CONTINUE**
   - Em Test users, adicione seu email
   - Clique **SAVE AND CONTINUE**
5. Volte para **Credentials**
6. Clique novamente em **+ CREATE CREDENTIALS** > **OAuth client ID**
7. Application type: **Desktop app**
8. Name: `Orquestrador-IA-Desktop`
9. Clique **CREATE**

### Passo 4: Baixar Credenciais

1. Vai aparecer um popup com **Client ID** e **Client secret**
2. Clique em **DOWNLOAD JSON**
3. Salve o arquivo (vai se chamar algo como `client_secret_123.json`)

### Passo 5: Obter Refresh Token

**Você precisa usar um script para obter o Refresh Token.**

**Criar arquivo get-google-token.js:**

```javascript
// get-google-token.js
const { google } = require('googleapis');
const readline = require('readline');
const fs = require('fs');

// Ler credenciais do arquivo baixado
const credentials = JSON.parse(fs.readFileSync('client_secret_SEU_ARQUIVO.json', 'utf8'));
const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;

const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0] || 'urn:ietf:wg:oauth:2.0:oob'
);

const SCOPES = ['https://www.googleapis.com/auth/drive'];

// Gerar URL de autorização
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});

console.log('Autorize este app visitando esta URL:', authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Cole o código de autorização aqui: ', (code) => {
  rl.close();
  oauth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Erro ao obter token:', err);
    
    console.log('\n✅ Token obtido com sucesso!\n');
    console.log('Client ID:', client_id);
    console.log('Client Secret:', client_secret);
    console.log('Refresh Token:', token.refresh_token);
    
    // Salvar tokens
    fs.writeFileSync('google-tokens.json', JSON.stringify({
      clientId: client_id,
      clientSecret: client_secret,
      refreshToken: token.refresh_token,
      accessToken: token.access_token
    }, null, 2));
    
    console.log('\n✅ Tokens salvos em google-tokens.json');
  });
});
```

**Executar:**

```bash
# Instalar dependência:
npm install googleapis

# Executar:
node get-google-token.js
```

**Siga as instruções:**
1. Copie a URL que aparece
2. Abra no navegador
3. Faça login no Google
4. Autorize o app
5. Copie o código que aparece
6. Cole no terminal

**Resultado:** Arquivo `google-tokens.json` será criado

### Informações para Cadastrar no Sistema:

```json
{
  "service": "Google Drive",
  "credentialType": "oauth2",
  "fields": {
    "clientId": "xxx.apps.googleusercontent.com",
    "clientSecret": "GOCSPX-xxxxx",
    "refreshToken": "1//xxxxx"
  }
}
```

---

## 3. GMAIL

### Tipo: App Password (Senha de Aplicativo)

### Passo 1: Ativar Verificação em Duas Etapas

1. Acesse: https://myaccount.google.com/security
2. Faça login na sua conta Google
3. Procure por **Verificação em duas etapas**
4. Clique em **Começar** ou **Ativar**
5. Siga os passos (pode ser SMS, app, etc)
6. **Você PRECISA ter 2FA ativo!**

### Passo 2: Gerar Senha de Aplicativo

1. Volte para: https://myaccount.google.com/security
2. Procure por **Senhas de app** ou **App passwords**
3. Clique
4. Se pedir senha, digite sua senha do Google
5. Em **Select app**, escolha: **Mail**
6. Em **Select device**, escolha: **Other (custom name)**
7. Digite: `Orquestrador-IA`
8. Clique em **Generate**

### Passo 3: Copiar Senha

1. Vai aparecer uma senha de 16 caracteres
2. **Copie imediatamente**
3. Formato: `abcd efgh ijkl mnop` (com espaços)
4. **Você NÃO VERÁ A SENHA NOVAMENTE!**

### Informações para Cadastrar no Sistema:

```json
{
  "service": "Gmail",
  "credentialType": "password",
  "fields": {
    "email": "seu_email@gmail.com",
    "appPassword": "abcd efgh ijkl mnop"
  }
}
```

**⚠️ NOTA:** Remova os espaços da senha ao cadastrar, ou deixe com espaços (sistema aceita ambos)

---

## 4. GOOGLE SHEETS

### Tipo: OAuth2 (mesmo processo do Drive)

**Use as MESMAS credenciais do Google Drive!**

Mas ative também a API do Google Sheets:

1. No Google Cloud Console: https://console.cloud.google.com
2. Selecione o projeto `Orquestrador-IA`
3. Vá em **APIs & Services** > **Library**
4. Pesquise por `Google Sheets API`
5. Clique e ative **ENABLE**

**Use o mesmo `google-tokens.json` obtido no passo do Drive.**

### Informações para Cadastrar no Sistema:

```json
{
  "service": "Google Sheets",
  "credentialType": "oauth2",
  "fields": {
    "clientId": "xxx.apps.googleusercontent.com",
    "clientSecret": "GOCSPX-xxxxx",
    "refreshToken": "1//xxxxx"
  }
}
```

---

## 5. OPENAI

### Tipo: API Key

### Passo 1: Criar Conta

1. Acesse: https://platform.openai.com
2. Faça login ou crie uma conta
3. Você precisará de um número de telefone válido

### Passo 2: Adicionar Créditos

1. Vá em **Billing** (Faturamento)
2. Adicione um método de pagamento
3. Adicione créditos (mínimo $5)
4. **⚠️ Sem créditos, a API não funciona!**

### Passo 3: Criar API Key

1. Vá em **API keys** no menu lateral
2. Clique em **+ Create new secret key**
3. Nome: `Orquestrador-IA`
4. Permissions: **All** (ou selecione conforme necessidade)
5. Clique em **Create secret key**

### Passo 4: Copiar Key

1. Vai aparecer uma chave começando com `sk-`
2. **Copie imediatamente**
3. **Você NÃO VERÁ A KEY NOVAMENTE!**

### Exemplo de Key:
```
sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

### Passo 5: Obter Organization ID (Opcional)

1. Vá em **Settings** > **Organization**
2. Copie o **Organization ID** (começa com `org-`)

### Informações para Cadastrar no Sistema:

```json
{
  "service": "OpenAI",
  "credentialType": "api_key",
  "fields": {
    "apiKey": "sk-proj-SEU_KEY_AQUI",
    "organization": "org-SEU_ORG_ID" // opcional
  }
}
```

---

## 6. ANTHROPIC (CLAUDE)

### Tipo: API Key

### Passo 1: Criar Conta

1. Acesse: https://console.anthropic.com
2. Faça login ou crie uma conta
3. Você pode usar Google, GitHub ou email

### Passo 2: Adicionar Créditos

1. Vá em **Billing**
2. Adicione método de pagamento
3. Adicione créditos (mínimo $10)
4. **⚠️ Sem créditos, a API não funciona!**

### Passo 3: Criar API Key

1. Vá em **API Keys** no menu lateral
2. Clique em **Create Key**
3. Nome: `Orquestrador-IA`
4. Clique em **Create**

### Passo 4: Copiar Key

1. Vai aparecer uma chave começando com `sk-ant-`
2. **Copie imediatamente**
3. **Você NÃO VERÁ A KEY NOVAMENTE!**

### Exemplo de Key:
```
sk-ant-api03-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

### Informações para Cadastrar no Sistema:

```json
{
  "service": "Anthropic",
  "credentialType": "api_key",
  "fields": {
    "apiKey": "sk-ant-SEU_KEY_AQUI"
  }
}
```

---

## 7. NOTION

### Tipo: Integration Token

### Passo 1: Criar Integração

1. Acesse: https://www.notion.so/my-integrations
2. Clique em **+ New integration**
3. Preencha:
   - **Name:** Orquestrador-IA
   - **Associated workspace:** Selecione seu workspace
4. Clique em **Submit**

### Passo 2: Configurar Capabilities

**Em Capabilities, marque:**
```
☑ Read content
☑ Update content
☑ Insert content
☑ Read comments
☑ Create comments
```

**Em Content Capabilities:**
```
☑ Read user information without email addresses
```

### Passo 3: Copiar Token

1. Na página da integração
2. Procure por **Internal Integration Token**
3. Clique em **Show** e depois **Copy**
4. Token começa com `secret_`

### Exemplo de Token:
```
secret_abc123def456ghi789jkl012mno345pqr
```

### Passo 4: Conectar Integração a Páginas

**⚠️ IMPORTANTE:** Você precisa dar acesso à integração nas páginas que quer usar!

1. Abra uma página do Notion
2. Clique nos **...** (canto superior direito)
3. Vá em **Connections** > **Add connections**
4. Selecione **Orquestrador-IA**
5. Repita para cada página/database que quiser acessar

### Informações para Cadastrar no Sistema:

```json
{
  "service": "Notion",
  "credentialType": "token",
  "fields": {
    "integrationToken": "secret_SEU_TOKEN_AQUI"
  }
}
```

---

## 8. SLACK

### Tipo: Bot Token + App Token

### Passo 1: Criar App

1. Acesse: https://api.slack.com/apps
2. Clique em **Create New App**
3. Escolha **From scratch**
4. App Name: `Orquestrador-IA`
5. Workspace: Selecione seu workspace
6. Clique em **Create App**

### Passo 2: Configurar Bot

1. No menu lateral, clique em **OAuth & Permissions**
2. Em **Scopes** > **Bot Token Scopes**, adicione:
   ```
   channels:history
   channels:read
   channels:write
   chat:write
   files:read
   files:write
   groups:history
   groups:read
   groups:write
   im:history
   im:read
   im:write
   mpim:history
   mpim:read
   mpim:write
   users:read
   ```

### Passo 3: Instalar App no Workspace

1. Role até o topo da página **OAuth & Permissions**
2. Clique em **Install to Workspace**
3. Autorize as permissões
4. Copie o **Bot User OAuth Token**
   - Começa com `xoxb-`

### Passo 4: Obter App Token

1. No menu lateral, vá em **Basic Information**
2. Em **App-Level Tokens**, clique em **Generate Token and Scopes**
3. Nome: `websocket`
4. Adicione scopes:
   ```
   connections:write
   ```
5. Clique em **Generate**
6. Copie o **App Token**
   - Começa com `xapp-`

### Informações para Cadastrar no Sistema:

```json
{
  "service": "Slack",
  "credentialType": "token",
  "fields": {
    "botToken": "xoxb-SEU_BOT_TOKEN",
    "appToken": "xapp-SEU_APP_TOKEN"
  }
}
```

---

## 9. DISCORD

### Tipo: Bot Token

### Passo 1: Criar Aplicação

1. Acesse: https://discord.com/developers/applications
2. Clique em **New Application**
3. Nome: `Orquestrador-IA`
4. Aceite os termos
5. Clique em **Create**

### Passo 2: Criar Bot

1. No menu lateral, clique em **Bot**
2. Clique em **Add Bot**
3. Confirme **Yes, do it!**

### Passo 3: Configurar Permissões

**Em Privileged Gateway Intents, ative:**
```
☑ PRESENCE INTENT
☑ SERVER MEMBERS INTENT
☑ MESSAGE CONTENT INTENT
```

### Passo 4: Copiar Token

1. Em **TOKEN**, clique em **Reset Token**
2. Confirme
3. **Copie o token imediatamente**
4. Token começa com `MT` ou `ND`

### Passo 5: Adicionar Bot ao Servidor

1. Vá em **OAuth2** > **URL Generator**
2. Em **Scopes**, marque:
   ```
   ☑ bot
   ☑ applications.commands
   ```
3. Em **Bot Permissions**, marque:
   ```
   ☑ Administrator
   ```
   (ou selecione permissões específicas)
4. Copie a **Generated URL**
5. Abra a URL no navegador
6. Selecione o servidor
7. Autorize

### Informações para Cadastrar no Sistema:

```json
{
  "service": "Discord",
  "credentialType": "token",
  "fields": {
    "botToken": "SEU_BOT_TOKEN_AQUI"
  }
}
```

---

## 📝 COMO CADASTRAR NO SISTEMA

### Via Interface Web

1. **Abra o sistema:** http://192.168.1.247:3000
2. **Faça login**
3. **Vá em "Credentials" (Credenciais)**
4. **Clique em "Add Credential" ou "Nova Credencial"**

### Preencher Formulário

**Campos obrigatórios:**
- **Service:** Selecione o serviço (GitHub, Gmail, etc)
- **Credential Type:** Tipo de autenticação (oauth2, api_key, token)

**Campos dinâmicos (mudam conforme o serviço):**

Para **GitHub, Notion, Discord**:
- Token

Para **OpenAI, Anthropic**:
- API Key

Para **Google (Drive, Sheets)**:
- Client ID
- Client Secret
- Refresh Token

Para **Gmail**:
- Email
- App Password

Para **Slack**:
- Bot Token
- App Token

### Salvar

1. Preencha todos os campos
2. Clique em **Save** ou **Salvar**
3. Sistema vai criptografar os dados automaticamente
4. Credencial aparecerá na lista

### Testar Credencial

**No banco de dados:**

```bash
mysql -u flavio -p orquestraia

SELECT id, service, credentialType, isActive 
FROM credentials 
ORDER BY id DESC 
LIMIT 10;
```

---

## 🔒 SEGURANÇA

### Como os Dados São Protegidos

1. **Criptografia AES-256-GCM**
   - Todas as credenciais são criptografadas antes de salvar
   - Chave de criptografia no servidor

2. **Nunca Exposto no Frontend**
   - API retorna credenciais apenas criptografadas
   - Descriptografia acontece apenas no backend quando necessário

3. **Logs Não Mostram Credenciais**
   - Logs apenas mostram que credencial foi usada
   - Nunca mostram valores reais

### Boas Práticas

1. **Rotacionar Tokens Regularmente**
   - GitHub: A cada 90 dias
   - OpenAI/Anthropic: A cada 180 dias
   - Google: Refresh token é permanente, mas revogue se comprometido

2. **Permissões Mínimas**
   - Só dê permissões necessárias
   - Não use tokens com permissão de admin se não precisar

3. **Monitorar Uso**
   - Verifique logs de uso das APIs
   - Configure alertas de uso excessivo

4. **Backup Seguro**
   - Se precisar fazer backup, criptografe
   - Nunca salve credenciais em texto simples

---

## ❓ TROUBLESHOOTING

### Erro: "Invalid token"

- Token expirou ou foi revogado
- Copie um novo token
- Atualize no sistema

### Erro: "Permission denied"

- Token não tem permissões necessárias
- Crie novo token com permissões corretas

### Erro: "Quota exceeded" (OpenAI/Anthropic)

- Créditos esgotados
- Adicione mais créditos na plataforma

### Erro: "OAuth error" (Google)

- Refresh token pode ter expirado (raro)
- Refaça processo de OAuth

---

## 📞 SUPORTE

Se tiver problemas:

1. Verifique se copiou o token correto
2. Verifique se tem permissões necessárias
3. Teste a credencial direto na plataforma (curl, Postman)
4. Verifique logs do sistema: `pm2 logs orquestrador-v3`

---

**Data:** 30/10/2025  
**Autor:** Claude Code  
**Versão:** 1.0
