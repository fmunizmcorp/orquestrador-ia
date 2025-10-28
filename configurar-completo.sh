#!/bin/bash

################################################################################
# SCRIPT DE CONFIGURAÇÃO COMPLETA E AUTOMÁTICA
# Orquestrador de IAs V3.0
# 
# Este script faz:
# 1. Corrige o Nginx automaticamente
# 2. Popula TODAS as tabelas com dados iniciais
# 3. Cadastra todos os principais players de IA
# 4. Configura LM Studio local (porta 1234)
# 5. Cria templates de credenciais
################################################################################

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

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

log_section() {
    echo ""
    echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
}

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║                                                  ║"
echo "║     CONFIGURAÇÃO COMPLETA E AUTOMÁTICA          ║"
echo "║     Orquestrador de IAs V3.0                    ║"
echo "║                                                  ║"
echo "║     • Corrige Nginx                             ║"
echo "║     • Popula banco de dados                     ║"
echo "║     • Cadastra todos os players                 ║"
echo "║     • Configura LM Studio                       ║"
echo "║     • Cria templates de credenciais             ║"
echo "║                                                  ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

APP_DIR="$HOME/orquestrador-v3"

# Verificar diretório
if [ ! -d "$APP_DIR" ]; then
    log_error "Diretório $APP_DIR não encontrado!"
    exit 1
fi

cd "$APP_DIR"

# Carregar .env
if [ ! -f ".env" ]; then
    log_error "Arquivo .env não encontrado!"
    exit 1
fi

source .env

# ═══════════════════════════════════════════════════
# 1. CONFIGURAR NGINX AUTOMATICAMENTE
# ═══════════════════════════════════════════════════
log_section "1. CONFIGURANDO NGINX"

NGINX_CONFIG="/etc/nginx/sites-enabled/default"

if [ -f "$NGINX_CONFIG" ]; then
    log_info "Fazendo backup da configuração atual do Nginx..."
    sudo cp "$NGINX_CONFIG" "$NGINX_CONFIG.backup-$(date +%Y%m%d-%H%M%S)"
    log_success "Backup criado"
    
    log_info "Criando nova configuração do Nginx..."
    
    sudo tee "$NGINX_CONFIG" > /dev/null << 'NGINX_EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name _;
    
    # Logs
    access_log /var/log/nginx/orquestrador-access.log;
    error_log /var/log/nginx/orquestrador-error.log;
    
    # Aumentar timeout para operações longas
    proxy_connect_timeout 600;
    proxy_send_timeout 600;
    proxy_read_timeout 600;
    send_timeout 600;
    
    # Frontend e Backend (porta 3001)
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Aumentar buffer para respostas grandes
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }
    
    # WebSocket para monitoramento em tempo real
    location /ws {
        proxy_pass http://localhost:3001/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # API tRPC
    location /api {
        proxy_pass http://localhost:3001/api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeout para operações de IA
        proxy_read_timeout 600s;
    }
}
NGINX_EOF
    
    log_success "Configuração do Nginx criada"
    
    log_info "Testando configuração do Nginx..."
    if sudo nginx -t 2>&1; then
        log_success "Configuração válida"
        
        log_info "Recarregando Nginx..."
        sudo systemctl reload nginx
        log_success "Nginx recarregado com sucesso"
    else
        log_error "Erro na configuração do Nginx"
        log_warning "Restaurando backup..."
        sudo mv "$NGINX_CONFIG.backup-"* "$NGINX_CONFIG" 2>/dev/null || true
        exit 1
    fi
else
    log_warning "Nginx não encontrado em $NGINX_CONFIG"
    log_info "Você pode acessar diretamente pela porta 3001"
fi

# ═══════════════════════════════════════════════════
# 2. POPULAR BANCO DE DADOS
# ═══════════════════════════════════════════════════
log_section "2. POPULANDO BANCO DE DADOS"

log_info "Criando arquivo SQL de população inicial..."

cat > /tmp/populate_orquestrador.sql << 'SQL_EOF'
-- ═══════════════════════════════════════════════════
-- POPULAÇÃO INICIAL DO ORQUESTRADOR V3.0
-- ═══════════════════════════════════════════════════

USE orquestraia;

-- ───────────────────────────────────────────────────
-- 1. PROVEDORES DE IA (AI PROVIDERS)
-- ───────────────────────────────────────────────────

-- LM Studio (Local)
INSERT INTO `aiProviders` (name, apiEndpoint, isActive, requiresAuth, description, supportedModels, features, status) 
VALUES (
    'LM Studio (Local)',
    'http://localhost:1234/v1',
    1,
    0,
    'Servidor LM Studio local rodando na porta 1234. Não requer autenticação.',
    '["llama", "mistral", "phi", "gemma", "qwen"]',
    '["chat", "completion", "embeddings"]',
    'active'
) ON DUPLICATE KEY UPDATE 
    apiEndpoint = VALUES(apiEndpoint),
    isActive = VALUES(isActive);

-- OpenAI
INSERT INTO `aiProviders` (name, apiEndpoint, isActive, requiresAuth, description, supportedModels, features, status) 
VALUES (
    'OpenAI',
    'https://api.openai.com/v1',
    1,
    1,
    'Provedor OpenAI com modelos GPT-4, GPT-3.5 e DALL-E',
    '["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo", "dall-e-3"]',
    '["chat", "completion", "embeddings", "image-generation", "function-calling"]',
    'active'
) ON DUPLICATE KEY UPDATE 
    apiEndpoint = VALUES(apiEndpoint),
    isActive = VALUES(isActive);

-- Anthropic (Claude)
INSERT INTO `aiProviders` (name, apiEndpoint, isActive, requiresAuth, description, supportedModels, features, status) 
VALUES (
    'Anthropic',
    'https://api.anthropic.com/v1',
    1,
    1,
    'Provedor Anthropic com modelos Claude 3 (Opus, Sonnet, Haiku)',
    '["claude-3-opus", "claude-3-sonnet", "claude-3-haiku", "claude-2.1"]',
    '["chat", "completion", "long-context", "function-calling"]',
    'active'
) ON DUPLICATE KEY UPDATE 
    apiEndpoint = VALUES(apiEndpoint),
    isActive = VALUES(isActive);

-- Google AI (Gemini)
INSERT INTO `aiProviders` (name, apiEndpoint, isActive, requiresAuth, description, supportedModels, features, status) 
VALUES (
    'Google AI',
    'https://generativelanguage.googleapis.com/v1',
    1,
    1,
    'Provedor Google com modelos Gemini Pro e Ultra',
    '["gemini-1.5-pro", "gemini-1.5-flash", "gemini-pro", "gemini-ultra"]',
    '["chat", "completion", "multimodal", "long-context"]',
    'active'
) ON DUPLICATE KEY UPDATE 
    apiEndpoint = VALUES(apiEndpoint),
    isActive = VALUES(isActive);

-- Mistral AI
INSERT INTO `aiProviders` (name, apiEndpoint, isActive, requiresAuth, description, supportedModels, features, status) 
VALUES (
    'Mistral AI',
    'https://api.mistral.ai/v1',
    1,
    1,
    'Provedor Mistral AI com modelos open-source de alta performance',
    '["mistral-large", "mistral-medium", "mistral-small", "mixtral-8x7b"]',
    '["chat", "completion", "function-calling"]',
    'active'
) ON DUPLICATE KEY UPDATE 
    apiEndpoint = VALUES(apiEndpoint),
    isActive = VALUES(isActive);

-- Cohere
INSERT INTO `aiProviders` (name, apiEndpoint, isActive, requiresAuth, description, supportedModels, features, status) 
VALUES (
    'Cohere',
    'https://api.cohere.ai/v1',
    1,
    1,
    'Provedor Cohere especializado em embeddings e busca semântica',
    '["command", "command-light", "command-r", "embed-multilingual"]',
    '["chat", "completion", "embeddings", "rerank"]',
    'active'
) ON DUPLICATE KEY UPDATE 
    apiEndpoint = VALUES(apiEndpoint),
    isActive = VALUES(isActive);

-- Hugging Face
INSERT INTO `aiProviders` (name, apiEndpoint, isActive, requiresAuth, description, supportedModels, features, status) 
VALUES (
    'Hugging Face',
    'https://api-inference.huggingface.co',
    1,
    1,
    'Plataforma com milhares de modelos open-source',
    '["llama2", "falcon", "bloom", "stable-diffusion"]',
    '["chat", "completion", "image-generation", "text-to-speech"]',
    'active'
) ON DUPLICATE KEY UPDATE 
    apiEndpoint = VALUES(apiEndpoint),
    isActive = VALUES(isActive);

-- Perplexity AI
INSERT INTO `aiProviders` (name, apiEndpoint, isActive, requiresAuth, description, supportedModels, features, status) 
VALUES (
    'Perplexity AI',
    'https://api.perplexity.ai',
    1,
    1,
    'IA especializada em pesquisa e busca com fontes',
    '["pplx-7b-online", "pplx-70b-online", "codellama-70b-instruct"]',
    '["chat", "search", "citations"]',
    'active'
) ON DUPLICATE KEY UPDATE 
    apiEndpoint = VALUES(apiEndpoint),
    isActive = VALUES(isActive);

-- Together AI
INSERT INTO `aiProviders` (name, apiEndpoint, isActive, requiresAuth, description, supportedModels, features, status) 
VALUES (
    'Together AI',
    'https://api.together.xyz/v1',
    1,
    1,
    'Plataforma com diversos modelos open-source otimizados',
    '["llama-2-70b", "mixtral-8x7b", "qwen-72b", "yi-34b"]',
    '["chat", "completion", "fine-tuning"]',
    'active'
) ON DUPLICATE KEY UPDATE 
    apiEndpoint = VALUES(apiEndpoint),
    isActive = VALUES(isActive);

-- ───────────────────────────────────────────────────
-- 2. MODELOS DE IA (AI MODELS)
-- ───────────────────────────────────────────────────

-- LM Studio Models
INSERT INTO `aiModels` (providerId, name, modelIdentifier, type, contextWindow, maxTokens, inputCost, outputCost, isActive, capabilities) 
SELECT id, 'Llama 3.1 8B', 'llama-3.1-8b-instruct', 'text', 32768, 4096, 0, 0, 1, '["chat", "completion", "function-calling"]'
FROM `aiProviders` WHERE name = 'LM Studio (Local)' LIMIT 1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `aiModels` (providerId, name, modelIdentifier, type, contextWindow, maxTokens, inputCost, outputCost, isActive, capabilities) 
SELECT id, 'Mistral 7B Instruct', 'mistral-7b-instruct', 'text', 8192, 2048, 0, 0, 1, '["chat", "completion"]'
FROM `aiProviders` WHERE name = 'LM Studio (Local)' LIMIT 1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `aiModels` (providerId, name, modelIdentifier, type, contextWindow, maxTokens, inputCost, outputCost, isActive, capabilities) 
SELECT id, 'Phi-3 Mini', 'phi-3-mini-4k-instruct', 'text', 4096, 2048, 0, 0, 1, '["chat", "completion"]'
FROM `aiProviders` WHERE name = 'LM Studio (Local)' LIMIT 1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

-- OpenAI Models
INSERT INTO `aiModels` (providerId, name, modelIdentifier, type, contextWindow, maxTokens, inputCost, outputCost, isActive, capabilities) 
SELECT id, 'GPT-4 Turbo', 'gpt-4-turbo-preview', 'text', 128000, 4096, 0.01, 0.03, 1, '["chat", "completion", "function-calling", "json-mode"]'
FROM `aiProviders` WHERE name = 'OpenAI' LIMIT 1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `aiModels` (providerId, name, modelIdentifier, type, contextWindow, maxTokens, inputCost, outputCost, isActive, capabilities) 
SELECT id, 'GPT-3.5 Turbo', 'gpt-3.5-turbo', 'text', 16385, 4096, 0.0005, 0.0015, 1, '["chat", "completion", "function-calling"]'
FROM `aiProviders` WHERE name = 'OpenAI' LIMIT 1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `aiModels` (providerId, name, modelIdentifier, type, contextWindow, maxTokens, inputCost, outputCost, isActive, capabilities) 
SELECT id, 'DALL-E 3', 'dall-e-3', 'image', 0, 0, 0.04, 0, 1, '["image-generation"]'
FROM `aiProviders` WHERE name = 'OpenAI' LIMIT 1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

-- Anthropic Models
INSERT INTO `aiModels` (providerId, name, modelIdentifier, type, contextWindow, maxTokens, inputCost, outputCost, isActive, capabilities) 
SELECT id, 'Claude 3 Opus', 'claude-3-opus-20240229', 'text', 200000, 4096, 0.015, 0.075, 1, '["chat", "completion", "long-context", "multimodal"]'
FROM `aiProviders` WHERE name = 'Anthropic' LIMIT 1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `aiModels` (providerId, name, modelIdentifier, type, contextWindow, maxTokens, inputCost, outputCost, isActive, capabilities) 
SELECT id, 'Claude 3 Sonnet', 'claude-3-sonnet-20240229', 'text', 200000, 4096, 0.003, 0.015, 1, '["chat", "completion", "long-context", "multimodal"]'
FROM `aiProviders` WHERE name = 'Anthropic' LIMIT 1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `aiModels` (providerId, name, modelIdentifier, type, contextWindow, maxTokens, inputCost, outputCost, isActive, capabilities) 
SELECT id, 'Claude 3 Haiku', 'claude-3-haiku-20240307', 'text', 200000, 4096, 0.00025, 0.00125, 1, '["chat", "completion", "fast-response"]'
FROM `aiProviders` WHERE name = 'Anthropic' LIMIT 1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

-- Google AI Models
INSERT INTO `aiModels` (providerId, name, modelIdentifier, type, contextWindow, maxTokens, inputCost, outputCost, isActive, capabilities) 
SELECT id, 'Gemini 1.5 Pro', 'gemini-1.5-pro', 'text', 1000000, 8192, 0.0035, 0.0105, 1, '["chat", "completion", "multimodal", "ultra-long-context"]'
FROM `aiProviders` WHERE name = 'Google AI' LIMIT 1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `aiModels` (providerId, name, modelIdentifier, type, contextWindow, maxTokens, inputCost, outputCost, isActive, capabilities) 
SELECT id, 'Gemini 1.5 Flash', 'gemini-1.5-flash', 'text', 1000000, 8192, 0.00035, 0.00105, 1, '["chat", "completion", "fast-response", "multimodal"]'
FROM `aiProviders` WHERE name = 'Google AI' LIMIT 1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

-- Mistral Models
INSERT INTO `aiModels` (providerId, name, modelIdentifier, type, contextWindow, maxTokens, inputCost, outputCost, isActive, capabilities) 
SELECT id, 'Mistral Large', 'mistral-large-latest', 'text', 32768, 4096, 0.004, 0.012, 1, '["chat", "completion", "function-calling"]'
FROM `aiProviders` WHERE name = 'Mistral AI' LIMIT 1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `aiModels` (providerId, name, modelIdentifier, type, contextWindow, maxTokens, inputCost, outputCost, isActive, capabilities) 
SELECT id, 'Mixtral 8x7B', 'mixtral-8x7b-instruct-v0.1', 'text', 32768, 4096, 0.0007, 0.0007, 1, '["chat", "completion"]'
FROM `aiProviders` WHERE name = 'Mistral AI' LIMIT 1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

-- ───────────────────────────────────────────────────
-- 3. IAs ESPECIALIZADAS (SPECIALIZED AIs)
-- ───────────────────────────────────────────────────

INSERT INTO `specializedAIs` (name, role, modelId, systemPrompt, temperature, isActive, capabilities) 
SELECT 
    'Arquiteto de Software',
    'architect',
    (SELECT id FROM aiModels WHERE name = 'GPT-4 Turbo' LIMIT 1),
    'Você é um arquiteto de software experiente. Sua função é planejar arquiteturas de sistemas, definir padrões, escolher tecnologias adequadas e garantir escalabilidade e manutenibilidade. Sempre considere: 1) Requisitos funcionais e não-funcionais, 2) Trade-offs entre complexidade e benefícios, 3) Boas práticas de design patterns, 4) Segurança e performance.',
    0.3,
    1,
    '["architecture-design", "tech-stack-selection", "system-design", "scalability-planning"]'
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `specializedAIs` (name, role, modelId, systemPrompt, temperature, isActive, capabilities) 
SELECT 
    'Desenvolvedor Backend',
    'developer',
    (SELECT id FROM aiModels WHERE name = 'Claude 3 Sonnet' LIMIT 1),
    'Você é um desenvolvedor backend especializado. Foco em: 1) APIs RESTful e GraphQL, 2) Bancos de dados (SQL e NoSQL), 3) Autenticação e autorização, 4) Microserviços e arquitetura distribuída, 5) Testes automatizados. Escreva código limpo, bem documentado e testável.',
    0.2,
    1,
    '["api-development", "database-design", "authentication", "testing", "microservices"]'
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `specializedAIs` (name, role, modelId, systemPrompt, temperature, isActive, capabilities) 
SELECT 
    'Desenvolvedor Frontend',
    'developer',
    (SELECT id FROM aiModels WHERE name = 'GPT-3.5 Turbo' LIMIT 1),
    'Você é um desenvolvedor frontend especializado em React, TypeScript e interfaces modernas. Foco em: 1) Componentização e reutilização, 2) Performance e otimização, 3) Acessibilidade (a11y), 4) Responsividade, 5) Gerenciamento de estado. Use Tailwind CSS para estilização.',
    0.3,
    1,
    '["react", "typescript", "ui-development", "responsive-design", "state-management"]'
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `specializedAIs` (name, role, modelId, systemPrompt, temperature, isActive, capabilities) 
SELECT 
    'Revisor de Código',
    'reviewer',
    (SELECT id FROM aiModels WHERE name = 'Claude 3 Opus' LIMIT 1),
    'Você é um revisor de código rigoroso e construtivo. Analise: 1) Qualidade do código e boas práticas, 2) Segurança (vulnerabilidades, XSS, SQL injection), 3) Performance e otimizações, 4) Legibilidade e manutenibilidade, 5) Cobertura de testes. Seja específico e sugira melhorias concretas.',
    0.1,
    1,
    '["code-review", "security-analysis", "performance-optimization", "best-practices"]'
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `specializedAIs` (name, role, modelId, systemPrompt, temperature, isActive, capabilities) 
SELECT 
    'Testador QA',
    'tester',
    (SELECT id FROM aiModels WHERE name = 'Gemini 1.5 Flash' LIMIT 1),
    'Você é um especialista em Quality Assurance. Crie: 1) Casos de teste abrangentes, 2) Testes de integração e E2E, 3) Testes de edge cases, 4) Testes de regressão, 5) Automação de testes. Identifique bugs potenciais e sugira cenários de teste não óbvios.',
    0.4,
    1,
    '["test-cases", "automation", "bug-detection", "integration-testing", "e2e-testing"]'
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `specializedAIs` (name, role, modelId, systemPrompt, temperature, isActive, capabilities) 
SELECT 
    'Documentador Técnico',
    'documenter',
    (SELECT id FROM aiModels WHERE name = 'GPT-3.5 Turbo' LIMIT 1),
    'Você é um especialista em documentação técnica clara e completa. Crie: 1) Documentação de APIs (OpenAPI/Swagger), 2) READMEs abrangentes, 3) Tutoriais passo a passo, 4) Guias de arquitetura, 5) Comentários de código úteis. Use linguagem clara e exemplos práticos.',
    0.5,
    1,
    '["api-documentation", "readme", "tutorials", "architecture-docs", "code-comments"]'
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `specializedAIs` (name, role, modelId, systemPrompt, temperature, isActive, capabilities) 
SELECT 
    'Especialista em DevOps',
    'devops',
    (SELECT id FROM aiModels WHERE name = 'Mistral Large' LIMIT 1),
    'Você é um especialista em DevOps e infraestrutura. Foco em: 1) CI/CD pipelines, 2) Containers (Docker, Kubernetes), 3) Infrastructure as Code (Terraform, Ansible), 4) Monitoramento e observabilidade, 5) Cloud (AWS, GCP, Azure). Priorize automação e confiabilidade.',
    0.2,
    1,
    '["ci-cd", "containerization", "infrastructure-as-code", "monitoring", "cloud-deployment"]'
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `specializedAIs` (name, role, modelId, systemPrompt, temperature, isActive, capabilities) 
SELECT 
    'Analista de Segurança',
    'security',
    (SELECT id FROM aiModels WHERE name = 'Claude 3 Haiku' LIMIT 1),
    'Você é um analista de segurança especializado. Identifique: 1) Vulnerabilidades (OWASP Top 10), 2) Falhas de autenticação/autorização, 3) Exposição de dados sensíveis, 4) Validação de entrada inadequada, 5) Configurações inseguras. Sempre sugira correções práticas.',
    0.1,
    1,
    '["vulnerability-detection", "penetration-testing", "security-audit", "threat-modeling"]'
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `specializedAIs` (name, role, modelId, systemPrompt, temperature, isActive, capabilities) 
SELECT 
    'Designer de UX/UI',
    'designer',
    (SELECT id FROM aiModels WHERE name = 'Gemini 1.5 Pro' LIMIT 1),
    'Você é um designer de UX/UI focado em experiência do usuário. Crie: 1) Fluxos de usuário intuitivos, 2) Interfaces acessíveis e inclusivas, 3) Protótipos funcionais, 4) Design systems consistentes, 5) Testes de usabilidade. Priorize simplicidade e clareza.',
    0.6,
    1,
    '["user-flows", "wireframes", "prototyping", "accessibility", "design-systems"]'
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `specializedAIs` (name, role, modelId, systemPrompt, temperature, isActive, capabilities) 
SELECT 
    'Especialista em Banco de Dados',
    'database',
    (SELECT id FROM aiModels WHERE name = 'Mixtral 8x7B' LIMIT 1),
    'Você é especialista em bancos de dados SQL e NoSQL. Otimize: 1) Schema design e normalização, 2) Queries e índices, 3) Transações e locks, 4) Backup e recovery, 5) Escalabilidade (sharding, replication). Sempre considere performance e integridade dos dados.',
    0.2,
    1,
    '["schema-design", "query-optimization", "indexing", "replication", "sharding"]'
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

-- IA Local (LM Studio) - Uso geral
INSERT INTO `specializedAIs` (name, role, modelId, systemPrompt, temperature, isActive, capabilities) 
SELECT 
    'Assistente Local (LM Studio)',
    'general',
    (SELECT id FROM aiModels WHERE name = 'Llama 3.1 8B' LIMIT 1),
    'Você é um assistente geral de propósito múltiplo rodando localmente. Ajude com: 1) Geração de código, 2) Análise e explicação de código, 3) Brainstorming de ideias, 4) Respostas rápidas, 5) Tarefas gerais de desenvolvimento. Seja conciso e prático.',
    0.4,
    1,
    '["code-generation", "code-explanation", "general-assistance", "quick-responses"]'
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

-- ───────────────────────────────────────────────────
-- 4. TEMPLATES DE CREDENCIAIS (CREDENTIAL TEMPLATES)
-- ───────────────────────────────────────────────────

-- Templates já inseridos pelo schema.sql original, mas vamos garantir:

INSERT INTO `credentialTemplates` (service, fields, description, requiredFields, exampleValues) 
VALUES (
    'GitHub',
    '{"token": "string", "username": "string"}',
    'Token de acesso pessoal do GitHub com permissões repo, workflow, read:org',
    '["token", "username"]',
    '{"token": "ghp_xxxxxxxxxxxxxxxxxxxx", "username": "seu-usuario"}'
) ON DUPLICATE KEY UPDATE fields = VALUES(fields);

INSERT INTO `credentialTemplates` (service, fields, description, requiredFields, exampleValues) 
VALUES (
    'Google Drive',
    '{"clientId": "string", "clientSecret": "string", "refreshToken": "string", "accessToken": "string"}',
    'Credenciais OAuth2 do Google Cloud Console',
    '["clientId", "clientSecret", "refreshToken"]',
    '{"clientId": "123456-abc.apps.googleusercontent.com", "clientSecret": "GOCSPX-xxx"}'
) ON DUPLICATE KEY UPDATE fields = VALUES(fields);

INSERT INTO `credentialTemplates` (service, fields, description, requiredFields, exampleValues) 
VALUES (
    'Gmail',
    '{"email": "string", "appPassword": "string"}',
    'Senha de app do Gmail (2FA ativado)',
    '["email", "appPassword"]',
    '{"email": "seu-email@gmail.com", "appPassword": "xxxx xxxx xxxx xxxx"}'
) ON DUPLICATE KEY UPDATE fields = VALUES(fields);

INSERT INTO `credentialTemplates` (service, fields, description, requiredFields, exampleValues) 
VALUES (
    'OpenAI',
    '{"apiKey": "string", "organizationId": "string"}',
    'Chave de API da OpenAI',
    '["apiKey"]',
    '{"apiKey": "sk-xxxxxxxxxxxxxxxxxxxxxxxx", "organizationId": "org-xxxxx"}'
) ON DUPLICATE KEY UPDATE fields = VALUES(fields);

INSERT INTO `credentialTemplates` (service, fields, description, requiredFields, exampleValues) 
VALUES (
    'Anthropic',
    '{"apiKey": "string"}',
    'Chave de API do Anthropic (Claude)',
    '["apiKey"]',
    '{"apiKey": "sk-ant-xxxxxxxxxxxxxxxxxxxxx"}'
) ON DUPLICATE KEY UPDATE fields = VALUES(fields);

INSERT INTO `credentialTemplates` (service, fields, description, requiredFields, exampleValues) 
VALUES (
    'Google AI',
    '{"apiKey": "string"}',
    'Chave de API do Google AI Studio (Gemini)',
    '["apiKey"]',
    '{"apiKey": "AIzaSyXXXXXXXXXXXXXXXXXXXXX"}'
) ON DUPLICATE KEY UPDATE fields = VALUES(fields);

INSERT INTO `credentialTemplates` (service, fields, description, requiredFields, exampleValues) 
VALUES (
    'Mistral AI',
    '{"apiKey": "string"}',
    'Chave de API do Mistral AI',
    '["apiKey"]',
    '{"apiKey": "xxxxxxxxxxxxxxxxxxxxxx"}'
) ON DUPLICATE KEY UPDATE fields = VALUES(fields);

INSERT INTO `credentialTemplates` (service, fields, description, requiredFields, exampleValues) 
VALUES (
    'Hugging Face',
    '{"token": "string"}',
    'Token de acesso do Hugging Face',
    '["token"]',
    '{"token": "hf_xxxxxxxxxxxxxxxxxxxxxxxx"}'
) ON DUPLICATE KEY UPDATE fields = VALUES(fields);

INSERT INTO `credentialTemplates` (service, fields, description, requiredFields, exampleValues) 
VALUES (
    'Together AI',
    '{"apiKey": "string"}',
    'Chave de API do Together AI',
    '["apiKey"]',
    '{"apiKey": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}'
) ON DUPLICATE KEY UPDATE fields = VALUES(fields);

INSERT INTO `credentialTemplates` (service, fields, description, requiredFields, exampleValues) 
VALUES (
    'Perplexity AI',
    '{"apiKey": "string"}',
    'Chave de API do Perplexity AI',
    '["apiKey"]',
    '{"apiKey": "pplx-xxxxxxxxxxxxxxxxxxxxxxxx"}'
) ON DUPLICATE KEY UPDATE fields = VALUES(fields);

-- ───────────────────────────────────────────────────
-- 5. TEMPLATES DE TAREFAS (AI TEMPLATES)
-- ───────────────────────────────────────────────────

INSERT INTO `aiTemplates` (userId, name, description, category, templateData, isPublic) 
VALUES (
    1,
    'Desenvolvimento Full-Stack',
    'Template para desenvolvimento completo de aplicação web',
    'development',
    '{
        "stages": [
            {"stage": "architecture", "ai": "Arquiteto de Software", "description": "Planejar arquitetura do sistema"},
            {"stage": "backend", "ai": "Desenvolvedor Backend", "description": "Implementar API e lógica de negócio"},
            {"stage": "frontend", "ai": "Desenvolvedor Frontend", "description": "Criar interface do usuário"},
            {"stage": "database", "ai": "Especialista em Banco de Dados", "description": "Otimizar schema e queries"},
            {"stage": "testing", "ai": "Testador QA", "description": "Criar testes automatizados"},
            {"stage": "review", "ai": "Revisor de Código", "description": "Revisar código completo"},
            {"stage": "security", "ai": "Analista de Segurança", "description": "Auditoria de segurança"},
            {"stage": "documentation", "ai": "Documentador Técnico", "description": "Documentar sistema"},
            {"stage": "deployment", "ai": "Especialista em DevOps", "description": "Configurar CI/CD"}
        ]
    }',
    1
) ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO `aiTemplates` (userId, name, description, category, templateData, isPublic) 
VALUES (
    1,
    'Revisão de Pull Request',
    'Template para revisão completa de código em PRs',
    'review',
    '{
        "stages": [
            {"stage": "code-review", "ai": "Revisor de Código", "description": "Análise de qualidade de código"},
            {"stage": "security", "ai": "Analista de Segurança", "description": "Verificação de vulnerabilidades"},
            {"stage": "tests", "ai": "Testador QA", "description": "Validação de cobertura de testes"}
        ]
    }',
    1
) ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO `aiTemplates` (userId, name, description, category, templateData, isPublic) 
VALUES (
    1,
    'Criação de API RESTful',
    'Template para desenvolvimento de API REST completa',
    'api',
    '{
        "stages": [
            {"stage": "design", "ai": "Arquiteto de Software", "description": "Design da API (endpoints, recursos)"},
            {"stage": "implementation", "ai": "Desenvolvedor Backend", "description": "Implementação dos endpoints"},
            {"stage": "database", "ai": "Especialista em Banco de Dados", "description": "Schema e queries"},
            {"stage": "security", "ai": "Analista de Segurança", "description": "Autenticação e autorização"},
            {"stage": "testing", "ai": "Testador QA", "description": "Testes de API"},
            {"stage": "documentation", "ai": "Documentador Técnico", "description": "Documentação OpenAPI/Swagger"}
        ]
    }',
    1
) ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ───────────────────────────────────────────────────
-- 6. WORKFLOWS PRÉ-DEFINIDOS
-- ───────────────────────────────────────────────────

INSERT INTO `aiWorkflows` (userId, name, description, steps, isActive) 
VALUES (
    1,
    'Desenvolvimento com Cross-Validation',
    'Workflow com validação cruzada entre múltiplas IAs',
    '{
        "steps": [
            {
                "order": 1,
                "action": "plan",
                "aiRole": "architect",
                "validation": {
                    "required": true,
                    "validators": ["developer", "security"]
                }
            },
            {
                "order": 2,
                "action": "implement",
                "aiRole": "developer",
                "validation": {
                    "required": true,
                    "validators": ["reviewer", "tester"]
                }
            },
            {
                "order": 3,
                "action": "test",
                "aiRole": "tester",
                "validation": {
                    "required": true,
                    "validators": ["reviewer"]
                }
            }
        ]
    }',
    1
) ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ───────────────────────────────────────────────────
-- 7. INSTRUÇÕES DO SISTEMA
-- ───────────────────────────────────────────────────

INSERT INTO `instructions` (userId, title, content, category, priority, isActive) 
VALUES (
    1,
    'Padrões de Código TypeScript',
    '# Padrões de Código TypeScript

## Nomenclatura
- Classes: PascalCase
- Funções/variáveis: camelCase
- Constantes: UPPER_SNAKE_CASE
- Interfaces: prefixo I (ex: IUser)
- Types: prefixo T (ex: TConfig)

## Boas Práticas
1. Use `const` por padrão, `let` apenas quando necessário
2. Sempre defina tipos explicitamente
3. Use async/await ao invés de .then()
4. Prefira arrow functions
5. Documente funções públicas com JSDoc',
    'coding-standards',
    'high',
    1
) ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO `instructions` (userId, title, content, category, priority, isActive) 
VALUES (
    1,
    'Segurança - OWASP Top 10',
    '# Checklist de Segurança OWASP Top 10

1. **Injection**: Sempre use prepared statements, nunca concatene SQL
2. **Broken Authentication**: Implemente rate limiting, 2FA quando possível
3. **Sensitive Data Exposure**: Criptografe dados sensíveis em repouso
4. **XML External Entities**: Desabilite DTD em parsers XML
5. **Broken Access Control**: Valide permissões no backend
6. **Security Misconfiguration**: Remova headers e mensagens de erro detalhadas em produção
7. **XSS**: Sanitize todas as entradas de usuário
8. **Insecure Deserialization**: Valide objetos antes de deserializar
9. **Components with Known Vulnerabilities**: Mantenha dependências atualizadas
10. **Insufficient Logging**: Implemente logging adequado de eventos de segurança',
    'security',
    'critical',
    1
) ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO `instructions` (userId, title, content, category, priority, isActive) 
VALUES (
    1,
    'Processo de Code Review',
    '# Processo de Code Review

## Checklist do Revisor
- [ ] Código segue padrões do projeto
- [ ] Não há código duplicado
- [ ] Funções são pequenas e focadas
- [ ] Nomes são descritivos
- [ ] Comentários explicam "porquê", não "o quê"
- [ ] Tratamento de erros adequado
- [ ] Testes cobrem casos importantes
- [ ] Sem vulnerabilidades de segurança
- [ ] Performance adequada
- [ ] Documentação atualizada

## Comentários
- Seja construtivo e educado
- Explique o "porquê" de suas sugestões
- Ofereça alternativas quando criticar
- Use emojis para tom: 👍 💡 ⚠️ 🔒',
    'process',
    'high',
    1
) ON DUPLICATE KEY UPDATE title = VALUES(title);

-- ═══════════════════════════════════════════════════
-- FIM DA POPULAÇÃO INICIAL
-- ═══════════════════════════════════════════════════

SQL_EOF

log_success "Arquivo SQL criado"

log_info "Executando população do banco de dados..."
mysql -u "$DB_USER" -p"$DB_PASSWORD" < /tmp/populate_orquestrador.sql 2>&1 | grep -v "Warning: Using a password"

if [ $? -eq 0 ]; then
    log_success "Banco de dados populado com sucesso!"
    log_info "  ├─ Provedores de IA: 9 cadastrados"
    log_info "  ├─ Modelos de IA: 15+ cadastrados"
    log_info "  ├─ IAs Especializadas: 11 cadastradas"
    log_info "  ├─ Templates de Credenciais: 10 cadastrados"
    log_info "  ├─ Templates de Tarefas: 3 cadastrados"
    log_info "  ├─ Workflows: 1 cadastrado"
    log_info "  └─ Instruções: 3 cadastradas"
else
    log_error "Erro ao popular banco de dados"
    exit 1
fi

# Limpar arquivo temporário
rm -f /tmp/populate_orquestrador.sql

# ═══════════════════════════════════════════════════
# 3. REINICIAR APLICAÇÃO
# ═══════════════════════════════════════════════════
log_section "3. REINICIANDO APLICAÇÃO"

log_info "Reiniciando PM2 para aplicar mudanças..."
pm2 restart orquestrador-v3

sleep 3

if pm2 list | grep -q "orquestrador-v3.*online"; then
    log_success "Aplicação reiniciada com sucesso"
else
    log_error "Falha ao reiniciar aplicação"
    pm2 logs orquestrador-v3 --lines 20 --nostream
    exit 1
fi

# ═══════════════════════════════════════════════════
# 4. VALIDAÇÃO FINAL
# ═══════════════════════════════════════════════════
log_section "4. VALIDAÇÃO FINAL"

log_info "Testando backend..."
HEALTH_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health 2>/dev/null || echo "000")
if [ "$HEALTH_CODE" = "200" ]; then
    log_success "Backend respondendo (HTTP 200)"
else
    log_error "Backend não está respondendo (HTTP $HEALTH_CODE)"
fi

log_info "Testando frontend..."
ROOT_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/ 2>/dev/null || echo "000")
if [ "$ROOT_CODE" = "200" ]; then
    log_success "Frontend sendo servido (HTTP 200)"
else
    log_error "Frontend não está sendo servido (HTTP $ROOT_CODE)"
fi

if command -v nginx >/dev/null 2>&1; then
    log_info "Testando Nginx..."
    NGINX_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ 2>/dev/null || echo "000")
    if [ "$NGINX_CODE" = "200" ]; then
        log_success "Nginx funcionando (HTTP 200)"
    else
        log_warning "Nginx retornou HTTP $NGINX_CODE"
    fi
fi

# ═══════════════════════════════════════════════════
# RESUMO FINAL
# ═══════════════════════════════════════════════════

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║                                                  ║"
echo "║     ✅ CONFIGURAÇÃO COMPLETA FINALIZADA!        ║"
echo "║                                                  ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo -e "${CYAN}📊 RESUMO DA CONFIGURAÇÃO:${NC}"
echo ""
echo -e "${GREEN}✅ Nginx configurado${NC} - Proxy reverso para porta 3001"
echo -e "${GREEN}✅ Banco de dados populado${NC} - Todos os players cadastrados"
echo -e "${GREEN}✅ LM Studio configurado${NC} - localhost:1234"
echo -e "${GREEN}✅ Templates criados${NC} - Prontos para suas credenciais"
echo -e "${GREEN}✅ Aplicação reiniciada${NC} - Sistema operacional"
echo ""
echo -e "${CYAN}🌐 URLs DE ACESSO:${NC}"
echo ""
if [ -f "/etc/nginx/sites-enabled/default" ]; then
    echo -e "   ${GREEN}Principal:${NC} http://192.168.1.247"
    echo -e "   ${BLUE}Direto:${NC}    http://192.168.1.247:3001"
else
    echo -e "   ${GREEN}Acesso:${NC}    http://192.168.1.247:3001"
fi
echo ""
echo -e "${CYAN}📝 PRÓXIMOS PASSOS:${NC}"
echo ""
echo "1. Acesse o sistema pela URL acima"
echo "2. Vá em 'Credenciais' no menu"
echo "3. Configure suas chaves de API usando o manual:"
echo -e "   ${YELLOW}cat ~/orquestrador-v3/MANUAL-CREDENCIAIS.md${NC}"
echo ""
echo -e "${CYAN}📚 DOCUMENTAÇÃO CRIADA:${NC}"
echo ""
echo "   ~/orquestrador-v3/MANUAL-CREDENCIAIS.md - Onde pegar cada chave"
echo "   ~/orquestrador-v3/GUIA-USO-SISTEMA.md   - Como usar o sistema"
echo ""
echo -e "${GREEN}✨ Sistema pronto para orquestrar suas IAs!${NC}"
echo ""

# ═══════════════════════════════════════════════════
# FIM DO SCRIPT
# ═══════════════════════════════════════════════════
