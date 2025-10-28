#!/bin/bash

################################################################################
# SETUP COMPLETO - ORQUESTRADOR DE IAs V3.0
# 
# Este script faz:
# 1. Corrige configuração do Nginx
# 2. Carrega dados iniciais em todas as tabelas
# 3. Cadastra provedores de IA (OpenAI, Anthropic, Google, etc.)
# 4. Cadastra LM Studio local (porta 1234)
# 5. Cadastra templates de credenciais (GitHub, Google Drive, Gmail, etc.)
# 6. Reinicia sistema completo
################################################################################

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

log_section() {
    echo ""
    echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║                                                  ║"
echo "║     SETUP COMPLETO - AUTOMÁTICO                 ║"
echo "║     Orquestrador de IAs V3.0                    ║"
echo "║                                                  ║"
echo "║     ✅ Correção Nginx                           ║"
echo "║     ✅ Carga de Dados Iniciais                  ║"
echo "║     ✅ Cadastro de Provedores                   ║"
echo "║     ✅ Configuração LM Studio                   ║"
echo "║     ✅ Templates de Credenciais                 ║"
echo "║                                                  ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# Verificar se é root para operações do Nginx
if [ "$EUID" -ne 0 ]; then 
    log_error "Este script precisa ser executado como root (sudo)"
    log_info "Execute: sudo ./setup-completo.sh"
    exit 1
fi

# Diretório da aplicação
APP_DIR="/home/flavio/orquestrador-v3"

# Verificar se diretório existe
if [ ! -d "$APP_DIR" ]; then
    log_error "Diretório $APP_DIR não encontrado!"
    exit 1
fi

cd "$APP_DIR"

# Carregar variáveis do .env
if [ -f ".env" ]; then
    source .env
    log_success "Arquivo .env carregado"
else
    log_error "Arquivo .env não encontrado!"
    exit 1
fi

# ═══════════════════════════════════════════════════
# 1. CORRIGIR NGINX
# ═══════════════════════════════════════════════════
log_section "1. CONFIGURANDO NGINX"

log_info "Fazendo backup da configuração atual do Nginx..."
cp /etc/nginx/sites-enabled/default /etc/nginx/sites-enabled/default.backup-$(date +%Y%m%d-%H%M%S)
log_success "Backup criado"

log_info "Criando nova configuração do Nginx..."

cat > /etc/nginx/sites-enabled/default << 'NGINX_EOF'
##
# Orquestrador de IAs V3.0 - Nginx Configuration
##

server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    # Logs
    access_log /var/log/nginx/orquestrador-access.log;
    error_log /var/log/nginx/orquestrador-error.log;

    # Aumentar tamanho máximo de upload
    client_max_body_size 50M;

    # Frontend e Backend (porta 3001)
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        
        # Headers essenciais
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Cache bypass
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # WebSocket (monitoramento em tempo real)
    location /ws {
        proxy_pass http://localhost:3001/ws;
        proxy_http_version 1.1;
        
        # WebSocket headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # WebSocket timeouts (mais longos)
        proxy_connect_timeout 7d;
        proxy_send_timeout 7d;
        proxy_read_timeout 7d;
    }

    # API tRPC
    location /api {
        proxy_pass http://localhost:3001/api;
        proxy_http_version 1.1;
        
        # Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts para operações longas
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    # Health check endpoint
    location /api/health {
        proxy_pass http://localhost:3001/api/health;
        access_log off;
    }
}
NGINX_EOF

log_success "Configuração do Nginx criada"

log_info "Testando configuração do Nginx..."
if nginx -t 2>&1 | grep -q "successful"; then
    log_success "Configuração do Nginx válida"
else
    log_error "Configuração do Nginx inválida!"
    nginx -t
    exit 1
fi

log_info "Recarregando Nginx..."
systemctl reload nginx
log_success "Nginx recarregado"

# ═══════════════════════════════════════════════════
# 2. CRIAR SCRIPT SQL DE CARGA INICIAL
# ═══════════════════════════════════════════════════
log_section "2. PREPARANDO CARGA DE DADOS INICIAIS"

log_info "Gerando script SQL com dados iniciais..."

cat > /tmp/carga-inicial.sql << 'SQL_EOF'
-- ══════════════════════════════════════════════════════════════
-- CARGA INICIAL DE DADOS - ORQUESTRADOR DE IAs V3.0
-- ══════════════════════════════════════════════════════════════

USE orquestraia;

-- ══════════════════════════════════════════════════════════════
-- 1. PROVEDORES DE IA (AI Providers)
-- ══════════════════════════════════════════════════════════════

-- Limpar dados existentes
DELETE FROM aiProviders WHERE id > 0;

-- OpenAI (GPT-4, GPT-3.5, etc.)
INSERT INTO aiProviders (name, type, baseURL, apiKeyRequired, isActive, status, config, description, supportedModels)
VALUES (
    'OpenAI',
    'api',
    'https://api.openai.com/v1',
    1,
    1,
    'active',
    '{"rateLimit": 10000, "timeout": 60000, "retries": 3}',
    'Provedor oficial da OpenAI - GPT-4, GPT-3.5 Turbo, DALL-E, Whisper',
    '["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo", "gpt-4o", "gpt-4o-mini"]'
);

-- Anthropic (Claude)
INSERT INTO aiProviders (name, type, baseURL, apiKeyRequired, isActive, status, config, description, supportedModels)
VALUES (
    'Anthropic',
    'api',
    'https://api.anthropic.com/v1',
    1,
    1,
    'active',
    '{"rateLimit": 5000, "timeout": 120000, "retries": 3}',
    'Claude 3 Opus, Sonnet e Haiku - Modelos de alta qualidade',
    '["claude-3-opus", "claude-3-sonnet", "claude-3-haiku", "claude-3-5-sonnet"]'
);

-- Google Gemini
INSERT INTO aiProviders (name, type, baseURL, apiKeyRequired, isActive, status, config, description, supportedModels)
VALUES (
    'Google Gemini',
    'api',
    'https://generativelanguage.googleapis.com/v1',
    1,
    1,
    'active',
    '{"rateLimit": 60, "timeout": 60000, "retries": 3}',
    'Google Gemini Pro e Ultra - Multimodal AI',
    '["gemini-pro", "gemini-pro-vision", "gemini-ultra"]'
);

-- Groq (LLaMA, Mixtral)
INSERT INTO aiProviders (name, type, baseURL, apiKeyRequired, isActive, status, config, description, supportedModels)
VALUES (
    'Groq',
    'api',
    'https://api.groq.com/openai/v1',
    1,
    1,
    'active',
    '{"rateLimit": 30, "timeout": 30000, "retries": 3}',
    'Inferência ultra-rápida - LLaMA, Mixtral, Gemma',
    '["llama-3.1-70b", "llama-3.1-8b", "mixtral-8x7b", "gemma-7b"]'
);

-- Mistral AI
INSERT INTO aiProviders (name, type, baseURL, apiKeyRequired, isActive, status, config, description, supportedModels)
VALUES (
    'Mistral AI',
    'api',
    'https://api.mistral.ai/v1',
    1,
    1,
    'active',
    '{"rateLimit": 5000, "timeout": 60000, "retries": 3}',
    'Mistral Large, Medium e Small - Modelos europeus',
    '["mistral-large", "mistral-medium", "mistral-small"]'
);

-- Cohere
INSERT INTO aiProviders (name, type, baseURL, apiKeyRequired, isActive, status, config, description, supportedModels)
VALUES (
    'Cohere',
    'api',
    'https://api.cohere.ai/v1',
    1,
    1,
    'active',
    '{"rateLimit": 10000, "timeout": 60000, "retries": 3}',
    'Command R+, Command e Embed - Especializado em empresas',
    '["command-r-plus", "command-r", "command", "embed-english-v3.0"]'
);

-- Perplexity AI
INSERT INTO aiProviders (name, type, baseURL, apiKeyRequired, isActive, status, config, description, supportedModels)
VALUES (
    'Perplexity',
    'api',
    'https://api.perplexity.ai',
    1,
    1,
    'active',
    '{"rateLimit": 50, "timeout": 60000, "retries": 3}',
    'Perplexity - AI com busca em tempo real',
    '["pplx-7b-online", "pplx-70b-online", "sonar-small", "sonar-medium"]'
);

-- LM Studio (Local)
INSERT INTO aiProviders (name, type, baseURL, apiKeyRequired, isActive, status, config, description, supportedModels)
VALUES (
    'LM Studio (Local)',
    'local',
    'http://localhost:1234/v1',
    0,
    1,
    'active',
    '{"rateLimit": 1000, "timeout": 120000, "retries": 1, "local": true}',
    'LM Studio rodando localmente - Modelos locais sem custo',
    '["local-model", "llama-2-7b", "mistral-7b", "phi-2"]'
);

-- Ollama (Local alternativo)
INSERT INTO aiProviders (name, type, baseURL, apiKeyRequired, isActive, status, config, description, supportedModels)
VALUES (
    'Ollama (Local)',
    'local',
    'http://localhost:11434/v1',
    0,
    0,
    'inactive',
    '{"rateLimit": 1000, "timeout": 120000, "retries": 1, "local": true}',
    'Ollama - Alternativa local para rodar LLMs',
    '["llama2", "mistral", "codellama", "phi"]'
);

-- Together AI
INSERT INTO aiProviders (name, type, baseURL, apiKeyRequired, isActive, status, config, description, supportedModels)
VALUES (
    'Together AI',
    'api',
    'https://api.together.xyz/v1',
    1,
    1,
    'active',
    '{"rateLimit": 600, "timeout": 60000, "retries": 3}',
    'Acesso a múltiplos modelos open-source',
    '["meta-llama/Llama-3-70b", "mistralai/Mixtral-8x7B", "Qwen/Qwen2-72B"]'
);

SELECT CONCAT('✓ ', COUNT(*), ' provedores de IA cadastrados') AS resultado FROM aiProviders;

-- ══════════════════════════════════════════════════════════════
-- 2. MODELOS DE IA (AI Models)
-- ══════════════════════════════════════════════════════════════

DELETE FROM aiModels WHERE id > 0;

-- OpenAI Models
INSERT INTO aiModels (providerId, name, modelId, description, contextWindow, maxTokens, inputCostPer1k, outputCostPer1k, capabilities, isActive, category)
SELECT id, 'GPT-4 Turbo', 'gpt-4-turbo-preview', 'Modelo mais avançado da OpenAI', 128000, 4096, 0.01, 0.03, '["text", "reasoning", "function-calling"]', 1, 'chat'
FROM aiProviders WHERE name = 'OpenAI' LIMIT 1;

INSERT INTO aiModels (providerId, name, modelId, description, contextWindow, maxTokens, inputCostPer1k, outputCostPer1k, capabilities, isActive, category)
SELECT id, 'GPT-4o', 'gpt-4o', 'GPT-4 otimizado - mais rápido e barato', 128000, 4096, 0.005, 0.015, '["text", "vision", "reasoning"]', 1, 'chat'
FROM aiProviders WHERE name = 'OpenAI' LIMIT 1;

INSERT INTO aiModels (providerId, name, modelId, description, contextWindow, maxTokens, inputCostPer1k, outputCostPer1k, capabilities, isActive, category)
SELECT id, 'GPT-3.5 Turbo', 'gpt-3.5-turbo', 'Rápido e eficiente para tarefas gerais', 16384, 4096, 0.0005, 0.0015, '["text", "function-calling"]', 1, 'chat'
FROM aiProviders WHERE name = 'OpenAI' LIMIT 1;

-- Anthropic Models
INSERT INTO aiModels (providerId, name, modelId, description, contextWindow, maxTokens, inputCostPer1k, outputCostPer1k, capabilities, isActive, category)
SELECT id, 'Claude 3.5 Sonnet', 'claude-3-5-sonnet-20241022', 'Modelo mais avançado da Anthropic', 200000, 8192, 0.003, 0.015, '["text", "reasoning", "function-calling", "vision"]', 1, 'chat'
FROM aiProviders WHERE name = 'Anthropic' LIMIT 1;

INSERT INTO aiModels (providerId, name, modelId, description, contextWindow, maxTokens, inputCostPer1k, outputCostPer1k, capabilities, isActive, category)
SELECT id, 'Claude 3 Opus', 'claude-3-opus-20240229', 'Máxima capacidade de raciocínio', 200000, 4096, 0.015, 0.075, '["text", "reasoning", "vision"]', 1, 'chat'
FROM aiProviders WHERE name = 'Anthropic' LIMIT 1;

INSERT INTO aiModels (providerId, name, modelId, description, contextWindow, maxTokens, inputCostPer1k, outputCostPer1k, capabilities, isActive, category)
SELECT id, 'Claude 3 Haiku', 'claude-3-haiku-20240307', 'Rápido e econômico', 200000, 4096, 0.00025, 0.00125, '["text", "vision"]', 1, 'chat'
FROM aiProviders WHERE name = 'Anthropic' LIMIT 1;

-- Google Models
INSERT INTO aiModels (providerId, name, modelId, description, contextWindow, maxTokens, inputCostPer1k, outputCostPer1k, capabilities, isActive, category)
SELECT id, 'Gemini Pro', 'gemini-pro', 'Modelo versátil do Google', 32760, 2048, 0.0005, 0.0015, '["text", "reasoning"]', 1, 'chat'
FROM aiProviders WHERE name = 'Google Gemini' LIMIT 1;

INSERT INTO aiModels (providerId, name, modelId, description, contextWindow, maxTokens, inputCostPer1k, outputCostPer1k, capabilities, isActive, category)
SELECT id, 'Gemini Pro Vision', 'gemini-pro-vision', 'Multimodal - texto e imagem', 16384, 2048, 0.00025, 0.0005, '["text", "vision", "multimodal"]', 1, 'chat'
FROM aiProviders WHERE name = 'Google Gemini' LIMIT 1;

-- Groq Models (super rápidos)
INSERT INTO aiModels (providerId, name, modelId, description, contextWindow, maxTokens, inputCostPer1k, outputCostPer1k, capabilities, isActive, category)
SELECT id, 'LLaMA 3.1 70B', 'llama-3.1-70b-versatile', 'LLaMA 3.1 com inferência ultra-rápida', 131072, 8192, 0.00059, 0.00079, '["text", "reasoning"]', 1, 'chat'
FROM aiProviders WHERE name = 'Groq' LIMIT 1;

INSERT INTO aiModels (providerId, name, modelId, description, contextWindow, maxTokens, inputCostPer1k, outputCostPer1k, capabilities, isActive, category)
SELECT id, 'Mixtral 8x7B', 'mixtral-8x7b-32768', 'Mixtral rápido e eficiente', 32768, 4096, 0.00024, 0.00024, '["text"]', 1, 'chat'
FROM aiProviders WHERE name = 'Groq' LIMIT 1;

-- LM Studio Local
INSERT INTO aiModels (providerId, name, modelId, description, contextWindow, maxTokens, inputCostPer1k, outputCostPer1k, capabilities, isActive, category)
SELECT id, 'Modelo Local', 'local-model', 'Modelo rodando no LM Studio local', 8192, 2048, 0, 0, '["text", "local"]', 1, 'chat'
FROM aiProviders WHERE name = 'LM Studio (Local)' LIMIT 1;

-- Mistral AI Models
INSERT INTO aiModels (providerId, name, modelId, description, contextWindow, maxTokens, inputCostPer1k, outputCostPer1k, capabilities, isActive, category)
SELECT id, 'Mistral Large', 'mistral-large-latest', 'Modelo mais poderoso da Mistral', 32000, 8192, 0.004, 0.012, '["text", "reasoning", "function-calling"]', 1, 'chat'
FROM aiProviders WHERE name = 'Mistral AI' LIMIT 1;

SELECT CONCAT('✓ ', COUNT(*), ' modelos de IA cadastrados') AS resultado FROM aiModels;

-- ══════════════════════════════════════════════════════════════
-- 3. TEMPLATES DE CREDENCIAIS (Credential Templates)
-- ══════════════════════════════════════════════════════════════

-- Já existem no schema.sql, mas vamos garantir que estão atualizados

-- OpenAI
INSERT INTO credentialTemplates (service, fields, instructions, category, isActive)
VALUES (
    'OpenAI',
    '{"apiKey": "sk-proj-..."}',
    'Acesse https://platform.openai.com/api-keys e crie uma nova API Key',
    'AI Provider',
    1
) ON DUPLICATE KEY UPDATE 
    fields = '{"apiKey": "sk-proj-..."}',
    instructions = 'Acesse https://platform.openai.com/api-keys e crie uma nova API Key';

-- Anthropic (Claude)
INSERT INTO credentialTemplates (service, fields, instructions, category, isActive)
VALUES (
    'Anthropic',
    '{"apiKey": "sk-ant-..."}',
    'Acesse https://console.anthropic.com/settings/keys e gere uma API Key',
    'AI Provider',
    1
) ON DUPLICATE KEY UPDATE 
    fields = '{"apiKey": "sk-ant-..."}',
    instructions = 'Acesse https://console.anthropic.com/settings/keys e gere uma API Key';

-- Google Gemini
INSERT INTO credentialTemplates (service, fields, instructions, category, isActive)
VALUES (
    'Google Gemini',
    '{"apiKey": "AIza..."}',
    'Acesse https://makersuite.google.com/app/apikey e crie uma API Key',
    'AI Provider',
    1
) ON DUPLICATE KEY UPDATE 
    fields = '{"apiKey": "AIza..."}',
    instructions = 'Acesse https://makersuite.google.com/app/apikey e crie uma API Key';

-- Groq
INSERT INTO credentialTemplates (service, fields, instructions, category, isActive)
VALUES (
    'Groq',
    '{"apiKey": "gsk_..."}',
    'Acesse https://console.groq.com/keys e gere uma API Key',
    'AI Provider',
    1
) ON DUPLICATE KEY UPDATE 
    fields = '{"apiKey": "gsk_..."}',
    instructions = 'Acesse https://console.groq.com/keys e gere uma API Key';

-- GitHub
INSERT INTO credentialTemplates (service, fields, instructions, category, isActive)
VALUES (
    'GitHub',
    '{"token": "ghp_...", "username": "seu-usuario"}',
    'Acesse https://github.com/settings/tokens e crie um Personal Access Token (classic) com scopes: repo, workflow, gist',
    'Development',
    1
) ON DUPLICATE KEY UPDATE 
    fields = '{"token": "ghp_...", "username": "seu-usuario"}',
    instructions = 'Acesse https://github.com/settings/tokens e crie um Personal Access Token (classic) com scopes: repo, workflow, gist';

-- Google Drive
INSERT INTO credentialTemplates (service, fields, instructions, category, isActive)
VALUES (
    'Google Drive',
    '{"clientId": "xxx.apps.googleusercontent.com", "clientSecret": "GOCSPX-...", "refreshToken": "1//..."}',
    'Acesse https://console.cloud.google.com/apis/credentials e crie credenciais OAuth 2.0',
    'Storage',
    1
) ON DUPLICATE KEY UPDATE 
    fields = '{"clientId": "xxx.apps.googleusercontent.com", "clientSecret": "GOCSPX-...", "refreshToken": "1//..."}',
    instructions = 'Acesse https://console.cloud.google.com/apis/credentials e crie credenciais OAuth 2.0';

-- Gmail
INSERT INTO credentialTemplates (service, fields, instructions, category, isActive)
VALUES (
    'Gmail',
    '{"email": "seu-email@gmail.com", "appPassword": "xxxx xxxx xxxx xxxx"}',
    'Acesse https://myaccount.google.com/apppasswords e gere uma senha de app',
    'Communication',
    1
) ON DUPLICATE KEY UPDATE 
    fields = '{"email": "seu-email@gmail.com", "appPassword": "xxxx xxxx xxxx xxxx"}',
    instructions = 'Acesse https://myaccount.google.com/apppasswords e gere uma senha de app';

-- Mistral AI
INSERT INTO credentialTemplates (service, fields, instructions, category, isActive)
VALUES (
    'Mistral AI',
    '{"apiKey": "..."}',
    'Acesse https://console.mistral.ai/api-keys/ e crie uma API Key',
    'AI Provider',
    1
) ON DUPLICATE KEY UPDATE 
    fields = '{"apiKey": "..."}',
    instructions = 'Acesse https://console.mistral.ai/api-keys/ e crie uma API Key';

-- Perplexity
INSERT INTO credentialTemplates (service, fields, instructions, category, isActive)
VALUES (
    'Perplexity',
    '{"apiKey": "pplx-..."}',
    'Acesse https://www.perplexity.ai/settings/api e gere uma API Key',
    'AI Provider',
    1
) ON DUPLICATE KEY UPDATE 
    fields = '{"apiKey": "pplx-..."}',
    instructions = 'Acesse https://www.perplexity.ai/settings/api e gere uma API Key';

SELECT CONCAT('✓ Templates de credenciais atualizados') AS resultado;

-- ══════════════════════════════════════════════════════════════
-- 4. INSTRUÇÕES PADRÃO (Instructions)
-- ══════════════════════════════════════════════════════════════

DELETE FROM instructions WHERE id > 0;

INSERT INTO instructions (title, content, category, priority, isActive)
VALUES 
(
    'Assistente Geral',
    'Você é um assistente inteligente e prestativo. Responda de forma clara, objetiva e educada. Se não souber algo, admita e sugira alternativas.',
    'general',
    'medium',
    1
),
(
    'Desenvolvedor de Software',
    'Você é um desenvolvedor de software experiente. Escreva código limpo, bem documentado e seguindo as melhores práticas. Explique suas decisões técnicas.',
    'development',
    'high',
    1
),
(
    'Analista de Dados',
    'Você é um analista de dados especializado. Analise dados com rigor, identifique padrões, anomalias e insights relevantes. Apresente suas conclusões de forma clara.',
    'analysis',
    'high',
    1
),
(
    'Escritor Criativo',
    'Você é um escritor criativo talentoso. Crie conteúdo original, envolvente e adequado ao contexto. Mantenha consistência de tom e estilo.',
    'creative',
    'medium',
    1
),
(
    'Professor Didático',
    'Você é um professor experiente e didático. Explique conceitos complexos de forma simples, use exemplos práticos e verifique se o aluno compreendeu.',
    'education',
    'high',
    1
);

SELECT CONCAT('✓ ', COUNT(*), ' instruções padrão cadastradas') AS resultado FROM instructions;

-- ══════════════════════════════════════════════════════════════
-- 5. BASE DE CONHECIMENTO INICIAL (Knowledge Base)
-- ══════════════════════════════════════════════════════════════

DELETE FROM knowledgeBase WHERE id > 0;

INSERT INTO knowledgeBase (title, content, category, tags, source, isActive)
VALUES 
(
    'Sobre o Orquestrador de IAs V3.0',
    'O Orquestrador de IAs V3.0 é um sistema completo para gerenciar múltiplos provedores de IA, orquestrar tarefas complexas com validação cruzada entre modelos, detectar alucinações e manter uma base de conhecimento centralizada.',
    'system',
    '["orquestrador", "sistema", "overview"]',
    'Sistema',
    1
),
(
    'Cross-Validation entre IAs',
    'O sistema utiliza validação cruzada entre diferentes modelos de IA para aumentar a confiabilidade das respostas. Quando uma tarefa é executada, múltiplas IAs analisam o resultado e votam na melhor resposta.',
    'validation',
    '["cross-validation", "qualidade", "confiabilidade"]',
    'Sistema',
    1
),
(
    'Detecção de Alucinações',
    'O detector de alucinações analisa as respostas das IAs buscando inconsistências, informações improváveis ou contraditórias. Utiliza técnicas de fact-checking e comparação entre múltiplos modelos.',
    'quality',
    '["alucinação", "qualidade", "validação"]',
    'Sistema',
    1
);

SELECT CONCAT('✓ ', COUNT(*), ' itens na base de conhecimento') AS resultado FROM knowledgeBase;

-- ══════════════════════════════════════════════════════════════
-- 6. TEMPLATES DE TAREFAS (AI Templates)
-- ══════════════════════════════════════════════════════════════

DELETE FROM aiTemplates WHERE id > 0;

INSERT INTO aiTemplates (name, userId, description, category, templateData, isPublic)
VALUES 
(
    'Análise de Código',
    1,
    'Template para análise de qualidade de código',
    'development',
    '{"steps": ["Analisar estrutura", "Verificar boas práticas", "Identificar bugs", "Sugerir melhorias"], "models": ["gpt-4", "claude-3-opus"]}',
    1
),
(
    'Pesquisa e Síntese',
    1,
    'Template para pesquisa de informações e síntese',
    'research',
    '{"steps": ["Buscar informações", "Validar fontes", "Sintetizar conteúdo", "Organizar resultados"], "models": ["gpt-4", "perplexity"]}',
    1
),
(
    'Criação de Conteúdo',
    1,
    'Template para criação de conteúdo original',
    'creative',
    '{"steps": ["Brainstorming", "Outline", "Desenvolvimento", "Revisão"], "models": ["claude-3-opus", "gpt-4"]}',
    1
);

SELECT CONCAT('✓ ', COUNT(*), ' templates de tarefas cadastrados') AS resultado FROM aiTemplates;

-- ══════════════════════════════════════════════════════════════
-- 7. WORKFLOWS PADRÃO (AI Workflows)
-- ══════════════════════════════════════════════════════════════

DELETE FROM aiWorkflows WHERE id > 0;

INSERT INTO aiWorkflows (name, userId, description, steps, isActive)
VALUES 
(
    'Validação Tripla de Respostas',
    1,
    'Workflow que usa 3 modelos diferentes para validar uma resposta',
    '[{"step": 1, "action": "generate", "model": "gpt-4"}, {"step": 2, "action": "validate", "model": "claude-3-opus"}, {"step": 3, "action": "verify", "model": "gemini-pro"}]',
    1
),
(
    'Desenvolvimento de Software',
    1,
    'Workflow completo para desenvolvimento de código',
    '[{"step": 1, "action": "plan", "model": "gpt-4"}, {"step": 2, "action": "code", "model": "claude-3-opus"}, {"step": 3, "action": "review", "model": "gpt-4"}, {"step": 4, "action": "test", "model": "local-model"}]',
    1
);

SELECT CONCAT('✓ ', COUNT(*), ' workflows padrão cadastrados') AS resultado FROM aiWorkflows;

-- ══════════════════════════════════════════════════════════════
-- 8. CRIAR USUÁRIO ADMIN (se não existir)
-- ══════════════════════════════════════════════════════════════

-- Nota: A tabela users ainda não foi implementada no schema,
-- mas quando for, descomentar abaixo:

/*
INSERT INTO users (username, email, role, isActive)
VALUES ('admin', 'admin@orquestrador.local', 'admin', 1)
ON DUPLICATE KEY UPDATE username = 'admin';
*/

-- ══════════════════════════════════════════════════════════════
-- RESUMO FINAL
-- ══════════════════════════════════════════════════════════════

SELECT '══════════════════════════════════════════════════════════════' AS '';
SELECT 'CARGA INICIAL CONCLUÍDA COM SUCESSO!' AS '';
SELECT '══════════════════════════════════════════════════════════════' AS '';
SELECT CONCAT('✓ ', COUNT(*), ' provedores de IA') AS '' FROM aiProviders;
SELECT CONCAT('✓ ', COUNT(*), ' modelos de IA') AS '' FROM aiModels;
SELECT CONCAT('✓ ', COUNT(*), ' templates de credenciais') AS '' FROM credentialTemplates;
SELECT CONCAT('✓ ', COUNT(*), ' instruções padrão') AS '' FROM instructions;
SELECT CONCAT('✓ ', COUNT(*), ' itens na base de conhecimento') AS '' FROM knowledgeBase;
SELECT CONCAT('✓ ', COUNT(*), ' templates de tarefas') AS '' FROM aiTemplates;
SELECT CONCAT('✓ ', COUNT(*), ' workflows padrão') AS '' FROM aiWorkflows;
SELECT '══════════════════════════════════════════════════════════════' AS '';
SELECT 'Próximo passo: Cadastrar suas credenciais nas APIs!' AS '';
SELECT '══════════════════════════════════════════════════════════════' AS '';
SQL_EOF

log_success "Script SQL criado em /tmp/carga-inicial.sql"

# ═══════════════════════════════════════════════════════════════
# 3. EXECUTAR CARGA DE DADOS
# ═══════════════════════════════════════════════════════════════
log_section "3. EXECUTANDO CARGA DE DADOS INICIAIS"

log_info "Conectando ao MySQL e executando script..."

if mysql -u "$DB_USER" -p"$DB_PASSWORD" < /tmp/carga-inicial.sql 2>&1 | tee /tmp/carga-output.log; then
    log_success "Carga de dados concluída"
    echo ""
    cat /tmp/carga-output.log | grep "✓" | tail -20
else
    log_error "Erro na carga de dados"
    cat /tmp/carga-output.log
    exit 1
fi

# ═══════════════════════════════════════════════════════════════
# 4. REINICIAR PM2
# ═══════════════════════════════════════════════════════════════
log_section "4. REINICIANDO APLICAÇÃO"

log_info "Reiniciando PM2 como usuário flavio..."
su - flavio -c "cd /home/flavio/orquestrador-v3 && pm2 restart orquestrador-v3"
log_success "Aplicação reiniciada"

sleep 3

# ═══════════════════════════════════════════════════════════════
# 5. VALIDAR INSTALAÇÃO
# ═══════════════════════════════════════════════════════════════
log_section "5. VALIDANDO INSTALAÇÃO"

log_info "Testando acesso via porta 80 (Nginx)..."
NGINX_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ 2>/dev/null || echo "000")

if [ "$NGINX_CODE" = "200" ]; then
    log_success "Nginx configurado corretamente (HTTP 200)"
else
    log_warning "Nginx retornando código $NGINX_CODE"
fi

log_info "Testando backend (porta 3001)..."
BACKEND_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health 2>/dev/null || echo "000")

if [ "$BACKEND_CODE" = "200" ]; then
    log_success "Backend respondendo corretamente"
else
    log_error "Backend não está respondendo (código: $BACKEND_CODE)"
fi

log_info "Verificando dados no banco..."
PROVIDER_COUNT=$(mysql -u "$DB_USER" -p"$DB_PASSWORD" -D "$DB_NAME" -se "SELECT COUNT(*) FROM aiProviders;" 2>/dev/null)
MODEL_COUNT=$(mysql -u "$DB_USER" -p"$DB_PASSWORD" -D "$DB_NAME" -se "SELECT COUNT(*) FROM aiModels;" 2>/dev/null)

log_success "Provedores cadastrados: $PROVIDER_COUNT"
log_success "Modelos cadastrados: $MODEL_COUNT"

# ═══════════════════════════════════════════════════════════════
# RESUMO FINAL
# ═══════════════════════════════════════════════════════════════

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║                                                  ║"
echo "║     ✅ SETUP COMPLETO FINALIZADO!               ║"
echo "║                                                  ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 SISTEMA CONFIGURADO COM SUCESSO!${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo ""
echo "📊 RESUMO DA INSTALAÇÃO:"
echo ""
echo "  ✅ Nginx configurado para porta 80"
echo "  ✅ $PROVIDER_COUNT provedores de IA cadastrados"
echo "  ✅ $MODEL_COUNT modelos de IA disponíveis"
echo "  ✅ LM Studio (local) configurado na porta 1234"
echo "  ✅ Templates de credenciais prontos"
echo "  ✅ Base de conhecimento inicializada"
echo "  ✅ Workflows padrão criados"
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🌐 ACESSO AO SISTEMA:${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo ""
echo "  🌐 Porta 80 (Nginx):     http://192.168.1.247"
echo "  🔌 Porta 3001 (Direto):  http://192.168.1.247:3001"
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}📝 PRÓXIMOS PASSOS:${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo ""
echo "  1️⃣  Acesse o sistema pelo navegador"
echo "  2️⃣  Cadastre suas credenciais das APIs"
echo "  3️⃣  Leia o manual: ~/orquestrador-v3/MANUAL-CREDENCIAIS.md"
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo -e "${MAGENTA}🔑 PROVEDORES CONFIGURADOS:${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo ""
echo "  ✅ OpenAI (GPT-4, GPT-3.5)"
echo "  ✅ Anthropic (Claude 3.5, Opus, Haiku)"
echo "  ✅ Google (Gemini Pro)"
echo "  ✅ Groq (LLaMA, Mixtral) - Ultra rápido"
echo "  ✅ Mistral AI (Large, Medium)"
echo "  ✅ Cohere (Command R+)"
echo "  ✅ Perplexity (Online AI)"
echo "  ✅ Together AI (Open-source models)"
echo "  ✅ LM Studio LOCAL (porta 1234) ⭐"
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo ""
log_success "Setup completo finalizado!"
echo ""
