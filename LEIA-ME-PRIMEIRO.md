# 🚀 LEIA-ME PRIMEIRO - Setup Completo do Orquestrador V3.0

## ⚡ Execução Rápida (Para Quem Tem Pressa)

```bash
# No seu servidor (como root):
cd ~/orquestrador-v3
git pull origin main
sudo ./setup-completo.sh
```

**Tempo**: ~5 minutos  
**Resultado**: Sistema completo com todos os dados iniciais carregados!

---

## 📋 O Que Este Setup Faz?

### ✅ 1. Corrige o Nginx Automaticamente
- Configura nginx para porta 80 (acesso sem :3001)
- Proxy reverso completo (frontend + backend + websocket)
- Backups automáticos da configuração antiga

### ✅ 2. Carrega Dados Iniciais em TODAS as Tabelas

#### 🤖 **10 Provedores de IA Cadastrados**:
| Provedor | Tipo | Status | Custo |
|----------|------|--------|-------|
| **OpenAI** | API | Precisa chave | Pago |
| **Anthropic (Claude)** | API | Precisa chave | Pago |
| **Google Gemini** | API | Precisa chave | ✅ Grátis |
| **Groq** | API | Precisa chave | ✅ Grátis |
| **Mistral AI** | API | Precisa chave | Pago |
| **Cohere** | API | Precisa chave | ✅ Trial grátis |
| **Perplexity** | API | Precisa chave | ✅ 50 req/dia grátis |
| **Together AI** | API | Precisa chave | ✅ $5 crédito grátis |
| **LM Studio (Local)** | Local | ✅ **JÁ ATIVO** | ✅ **100% GRÁTIS** |
| **Ollama** | Local | Inativo | Grátis (se instalar) |

#### 🎯 **15+ Modelos de IA Prontos**:
- GPT-4 Turbo, GPT-4o, GPT-3.5 Turbo (OpenAI)
- Claude 3.5 Sonnet, Opus, Haiku (Anthropic)
- Gemini Pro, Gemini Pro Vision (Google)
- LLaMA 3.1 70B, Mixtral 8x7B (Groq)
- Mistral Large (Mistral AI)
- Modelo Local (LM Studio) ⭐

#### 🔑 **Templates de Credenciais** (11 serviços):
Com instruções de onde obter cada chave:
- OpenAI, Anthropic, Google Gemini
- Groq, Mistral AI, Cohere, Perplexity
- GitHub, Google Drive, Gmail
- Together AI

#### 📖 **5 Instruções Padrão**:
- Assistente Geral
- Desenvolvedor de Software
- Analista de Dados
- Escritor Criativo
- Professor Didático

#### 📚 **Base de Conhecimento Inicial**:
- Sobre o Orquestrador V3.0
- Cross-Validation entre IAs
- Detecção de Alucinações

#### 📋 **3 Templates de Tarefas**:
- Análise de Código
- Pesquisa e Síntese
- Criação de Conteúdo

#### 🔄 **2 Workflows Padrão**:
- Validação Tripla de Respostas
- Desenvolvimento de Software

### ✅ 3. Reinicia o Sistema Completamente
- Para o PM2
- Reconfigura com variáveis corretas
- Inicia novamente
- Valida funcionamento

---

## 🎯 Requisitos

### Antes de Executar:

1. ✅ Sistema já deve estar instalado (rodou `./instalar.sh` antes)
2. ✅ MySQL rodando
3. ✅ PM2 instalado
4. ✅ Node.js 20.x instalado

Se ainda não instalou, execute PRIMEIRO:
```bash
cd ~/orquestrador-v3
./instalar.sh
```

---

## 📝 Passo a Passo Detalhado

### 1️⃣ Baixar Atualizações do GitHub

```bash
cd ~/orquestrador-v3
git pull origin main
```

Você verá:
```
Updating ab26d1a..62c3aa4
Fast-forward
 GUIA-RAPIDO-CADASTRO.md | 400 ++++++++
 MANUAL-CREDENCIAIS.md   | 800 ++++++++++++++++
 setup-completo.sh       | 700 ++++++++++++++
 3 files changed, 1900 insertions(+)
```

### 2️⃣ Dar Permissão de Execução

```bash
chmod +x setup-completo.sh
```

### 3️⃣ Executar como ROOT (IMPORTANTE!)

```bash
sudo ./setup-completo.sh
```

**Por que precisa ser root?**
- Modificar configuração do Nginx (`/etc/nginx/`)
- Recarregar serviço do Nginx

### 4️⃣ Acompanhar a Execução

Você verá output colorido mostrando cada etapa:

```
╔══════════════════════════════════════════════════╗
║                                                  ║
║     SETUP COMPLETO - AUTOMÁTICO                 ║
║     Orquestrador de IAs V3.0                    ║
║                                                  ║
║     ✅ Correção Nginx                           ║
║     ✅ Carga de Dados Iniciais                  ║
║     ✅ Cadastro de Provedores                   ║
║     ✅ Configuração LM Studio                   ║
║     ✅ Templates de Credenciais                 ║
║                                                  ║
╚══════════════════════════════════════════════════╝

═══════════════════════════════════════════════════
1. CONFIGURANDO NGINX
═══════════════════════════════════════════════════
[INFO] Fazendo backup da configuração atual do Nginx...
[✓] Backup criado
[INFO] Criando nova configuração do Nginx...
[✓] Configuração do Nginx criada
[INFO] Testando configuração do Nginx...
[✓] Configuração do Nginx válida
[INFO] Recarregando Nginx...
[✓] Nginx recarregado

═══════════════════════════════════════════════════
2. PREPARANDO CARGA DE DADOS INICIAIS
═══════════════════════════════════════════════════
[✓] Script SQL criado em /tmp/carga-inicial.sql

═══════════════════════════════════════════════════
3. EXECUTANDO CARGA DE DADOS INICIAIS
═══════════════════════════════════════════════════
[INFO] Conectando ao MySQL e executando script...
[✓] Carga de dados concluída

✓ 10 provedores de IA cadastrados
✓ 15 modelos de IA cadastrados
✓ Templates de credenciais atualizados
✓ 5 instruções padrão cadastradas
✓ 3 itens na base de conhecimento
✓ 3 templates de tarefas cadastrados
✓ 2 workflows padrão cadastrados

═══════════════════════════════════════════════════
4. REINICIANDO APLICAÇÃO
═══════════════════════════════════════════════════
[INFO] Reiniciando PM2 como usuário flavio...
[✓] Aplicação reiniciada

═══════════════════════════════════════════════════
5. VALIDANDO INSTALAÇÃO
═══════════════════════════════════════════════════
[INFO] Testando acesso via porta 80 (Nginx)...
[✓] Nginx configurado corretamente (HTTP 200)
[INFO] Testando backend (porta 3001)...
[✓] Backend respondendo corretamente
[INFO] Verificando dados no banco...
[✓] Provedores cadastrados: 10
[✓] Modelos cadastrados: 15

╔══════════════════════════════════════════════════╗
║                                                  ║
║     ✅ SETUP COMPLETO FINALIZADO!               ║
║                                                  ║
╚══════════════════════════════════════════════════╝
```

---

## 🌐 Acesso ao Sistema

### Após o Setup:

**Porta 80 (Recomendado - Nginx)**:
```
http://192.168.1.247
```

**Porta 3001 (Direto no Backend)**:
```
http://192.168.1.247:3001
```

Ambos funcionam! Use o que preferir.

---

## 📚 Próximos Passos

### 1️⃣ Acessar o Sistema
Abra no navegador: `http://192.168.1.247`

### 2️⃣ Explorar os Provedores Cadastrados
- Vá no menu: **"Provedores"**
- Você verá 10 provedores já cadastrados!
- **LM Studio** já está ativo (porta 1234)

### 3️⃣ Cadastrar Suas Credenciais
- Vá no menu: **"Credenciais"**
- Clique em **"Nova Credencial"**
- Selecione o provedor
- Cole sua API key
- Salvar

**📖 Onde obter cada chave?**
Leia o manual completo: **`MANUAL-CREDENCIAIS.md`**

### 4️⃣ Começar com os GRATUITOS
Recomendação de ordem:

1. ✅ **LM Studio** - Já configurado! (porta 1234)
2. ✅ **Google Gemini** - Grátis, 60 req/min
3. ✅ **Groq** - Grátis, super rápido
4. ✅ **Cohere** - Trial de 1.000 req/mês

### 5️⃣ Testar o Sistema
- Vá no menu: **"Tarefas"**
- Clique em **"Nova Tarefa"**
- Preencha e execute!

---

## 📖 Documentação Disponível

No diretório `~/orquestrador-v3`, você tem:

### 📘 **MANUAL-CREDENCIAIS.md** (ESSENCIAL!)
Manual completo de como obter API keys de:
- OpenAI, Anthropic, Google Gemini
- Groq, Mistral AI, Cohere, Perplexity
- GitHub, Google Drive, Gmail
- Instruções passo a passo com links diretos

### 📗 **GUIA-RAPIDO-CADASTRO.md**
Guia visual de como usar o sistema:
- Onde cadastrar credenciais
- Como criar tarefas
- Como usar workflows
- Troubleshooting

### 📙 **CORRECAO-502.md**
Troubleshooting técnico detalhado

### 📕 **INSTRUCOES-RAPIDAS.md**
Comandos rápidos de correção

---

## 🎯 O Que Já Está Pronto

### ✅ Provedores (10):
```
├── OpenAI (GPT-4, GPT-3.5)         [Precisa chave]
├── Anthropic (Claude)              [Precisa chave]
├── Google Gemini                   [Precisa chave - GRÁTIS]
├── Groq (LLaMA, Mixtral)           [Precisa chave - GRÁTIS]
├── Mistral AI                      [Precisa chave]
├── Cohere                          [Precisa chave - Trial grátis]
├── Perplexity                      [Precisa chave - 50/dia grátis]
├── Together AI                     [Precisa chave - $5 grátis]
├── LM Studio (Local) ⭐            [JÁ ATIVO - porta 1234]
└── Ollama (Local)                  [Inativo - opcional]
```

### ✅ Modelos (15+):
```
├── GPT-4 Turbo, GPT-4o, GPT-3.5    [OpenAI]
├── Claude 3.5, Opus, Haiku         [Anthropic]
├── Gemini Pro, Pro Vision          [Google]
├── LLaMA 3.1 70B, Mixtral          [Groq]
├── Mistral Large                   [Mistral AI]
└── Modelo Local ⭐                 [LM Studio]
```

### ✅ Base de Dados:
```
├── 5 Instruções padrão
├── 3 Itens na base de conhecimento
├── 3 Templates de tarefas
├── 2 Workflows prontos
└── 11 Templates de credenciais
```

---

## 🔑 LM Studio - Já Funciona!

### O LM Studio já está configurado na porta 1234!

**Para verificar**:
```bash
curl http://localhost:1234/v1/models
```

Se retornar uma lista, está funcionando!

**Para usar**:
1. Abra o LM Studio no seu computador
2. Baixe um modelo (recomendado: Mistral 7B)
3. Vá na aba "Local Server"
4. Clique em "Start Server"
5. No Orquestrador, crie uma tarefa usando "Modelo Local"

**💡 Vantagem**: 100% grátis, sem limites, sem custos!

---

## ❓ Problemas?

### Setup falhou?
```bash
# Ver logs
cat /tmp/carga-output.log

# Tentar novamente
sudo ./setup-completo.sh
```

### Nginx não funciona?
```bash
# Testar configuração
sudo nginx -t

# Ver logs
sudo tail -f /var/log/nginx/orquestrador-error.log
```

### PM2 não reiniciou?
```bash
# Status
pm2 status

# Reiniciar manualmente
pm2 restart orquestrador-v3

# Ver logs
pm2 logs orquestrador-v3
```

### Banco de dados?
```bash
# Conectar
mysql -u orq_user -p orquestraia

# Verificar tabelas
SHOW TABLES;

# Contar provedores
SELECT COUNT(*) FROM aiProviders;
```

---

## 🎓 Aprendendo a Usar

### 1. Fluxo Básico:
```
Cadastrar Credencial → Criar Tarefa → Executar → Ver Resultado
```

### 2. Fluxo com Template:
```
Escolher Template → Ajustar → Executar → Ver Resultado
```

### 3. Fluxo com Workflow:
```
Escolher Workflow → Definir Etapas → Executar → Acompanhar Cada Etapa
```

---

## 💰 Custos Estimados

### Começando com GRÁTIS (Custo: $0):
- LM Studio (local) - Ilimitado ✅
- Google Gemini - 60 req/min ✅
- Groq - 30 req/min ✅
- Cohere - 1.000 req/mês ✅

**Você pode fazer MUITO sem gastar nada!**

### Se quiser mais poder ($10-20/mês):
- OpenAI GPT-3.5 - $5/mês (uso moderado)
- Anthropic Claude Haiku - $5/mês (uso moderado)
- Google Gemini Pro - $5/mês (uso moderado)

**Total**: ~$15/mês para ter 3 modelos poderosos

---

## 🚀 Começando AGORA

### Comandos Finais:

```bash
# 1. Atualizar repositório
cd ~/orquestrador-v3
git pull origin main

# 2. Executar setup completo
chmod +x setup-completo.sh
sudo ./setup-completo.sh

# 3. Acessar sistema
# Navegador: http://192.168.1.247

# 4. Cadastrar credenciais
# Leia: MANUAL-CREDENCIAIS.md

# 5. Criar primeira tarefa!
```

---

## 📞 Checklist Final

Antes de começar a usar:

- [ ] Executei `sudo ./setup-completo.sh`
- [ ] Vi mensagem "✅ SETUP COMPLETO FINALIZADO!"
- [ ] Consigo acessar `http://192.168.1.247`
- [ ] Vejo 10 provedores no menu "Provedores"
- [ ] Li o `MANUAL-CREDENCIAIS.md`
- [ ] Cadastrei pelo menos 1 credencial grátis (Gemini ou Groq)
- [ ] Testei criar uma tarefa simples

**Se todos marcados**: 🎉 **PRONTO PARA USAR!**

---

## 🎊 Resumo

```
╔════════════════════════════════════════════════════════╗
║                                                        ║
║  🎉 SISTEMA COMPLETO E PRONTO!                        ║
║                                                        ║
║  ✅ Nginx na porta 80                                 ║
║  ✅ 10 provedores cadastrados                         ║
║  ✅ 15+ modelos disponíveis                           ║
║  ✅ LM Studio local funcionando                       ║
║  ✅ Templates e workflows prontos                     ║
║  ✅ Base de conhecimento inicializada                 ║
║                                                        ║
║  🌐 Acesso: http://192.168.1.247                      ║
║                                                        ║
║  📖 Próximo: Ler MANUAL-CREDENCIAIS.md               ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

**Tempo total de setup**: ~5 minutos  
**Complexidade**: ⭐ Fácil (1 comando)  
**Resultado**: Sistema enterprise completo!

---

**Última atualização**: 2025-10-28  
**Versão**: 3.0  
**Autor**: GenSpark AI
