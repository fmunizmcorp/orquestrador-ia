#!/bin/bash

################################################################################
# SCRIPT DE POPULAÇÃO DO BANCO DE DADOS
# Orquestrador de IAs V3.0
# 
# Popula o banco com dados iniciais usando o schema CORRETO
################################################################################

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[✓]${NC} $1"; }
log_error() { echo -e "${RED}[✗]${NC} $1"; }

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║     POPULAÇÃO DO BANCO DE DADOS                  ║"
echo "║     Orquestrador de IAs V3.0                    ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

APP_DIR="$HOME/orquestrador-v3"
cd "$APP_DIR"

# Carregar .env
if [ ! -f ".env" ]; then
    log_error "Arquivo .env não encontrado!"
    exit 1
fi

source .env

log_info "Criando arquivo SQL de população..."

cat > /tmp/populate_db.sql << 'SQL_EOF'
USE orquestraia;

-- ==================================================
-- USUÁRIO PADRÃO
-- ==================================================
INSERT INTO `users` (openId, name, email, role) 
VALUES ('admin', 'Administrador', 'admin@localhost', 'admin')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ==================================================
-- PROVEDORES DE IA
-- ==================================================

-- LM Studio (Local)
INSERT INTO `aiProviders` (name, type, endpoint, isActive, config) 
VALUES (
    'LM Studio',
    'local',
    'http://localhost:1234/v1',
    1,
    '{"description": "Servidor LM Studio local na porta 1234", "requiresAuth": false}'
) ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

-- OpenAI
INSERT INTO `aiProviders` (name, type, endpoint, isActive, config) 
VALUES (
    'OpenAI',
    'api',
    'https://api.openai.com/v1',
    1,
    '{"description": "OpenAI GPT-4, GPT-3.5, DALL-E", "requiresAuth": true}'
) ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

-- Anthropic
INSERT INTO `aiProviders` (name, type, endpoint, isActive, config) 
VALUES (
    'Anthropic',
    'api',
    'https://api.anthropic.com/v1',
    1,
    '{"description": "Claude 3 Opus, Sonnet, Haiku", "requiresAuth": true}'
) ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

-- Google AI
INSERT INTO `aiProviders` (name, type, endpoint, isActive, config) 
VALUES (
    'Google AI',
    'api',
    'https://generativelanguage.googleapis.com/v1',
    1,
    '{"description": "Gemini Pro, Flash, Ultra", "requiresAuth": true}'
) ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

-- Mistral AI
INSERT INTO `aiProviders` (name, type, endpoint, isActive, config) 
VALUES (
    'Mistral AI',
    'api',
    'https://api.mistral.ai/v1',
    1,
    '{"description": "Mistral Large, Medium, Mixtral", "requiresAuth": true}'
) ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

-- Hugging Face
INSERT INTO `aiProviders` (name, type, endpoint, isActive, config) 
VALUES (
    'Hugging Face',
    'api',
    'https://api-inference.huggingface.co',
    1,
    '{"description": "Modelos open-source variados", "requiresAuth": true}'
) ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

-- Together AI
INSERT INTO `aiProviders` (name, type, endpoint, isActive, config) 
VALUES (
    'Together AI',
    'api',
    'https://api.together.xyz/v1',
    1,
    '{"description": "Modelos otimizados open-source", "requiresAuth": true}'
) ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

-- Perplexity AI
INSERT INTO `aiProviders` (name, type, endpoint, isActive, config) 
VALUES (
    'Perplexity AI',
    'api',
    'https://api.perplexity.ai',
    1,
    '{"description": "Pesquisa com IA e citações", "requiresAuth": true}'
) ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

-- Cohere
INSERT INTO `aiProviders` (name, type, endpoint, isActive, config) 
VALUES (
    'Cohere',
    'api',
    'https://api.cohere.ai/v1',
    1,
    '{"description": "Embeddings e reranking", "requiresAuth": true}'
) ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

-- ==================================================
-- MODELOS DE IA
-- ==================================================

-- LM Studio Models
INSERT INTO `aiModels` (providerId, name, modelId, capabilities, contextWindow, isActive, parameters) 
SELECT 
    id,
    'Llama 3.1 8B',
    'llama-3.1-8b-instruct',
    '["text", "code", "chat"]',
    32768,
    1,
    '8B'
FROM `aiProviders` WHERE name = 'LM Studio' LIMIT 1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `aiModels` (providerId, name, modelId, capabilities, contextWindow, isActive, parameters) 
SELECT 
    id,
    'Mistral 7B',
    'mistral-7b-instruct',
    '["text", "code", "chat"]',
    8192,
    1,
    '7B'
FROM `aiProviders` WHERE name = 'LM Studio' LIMIT 1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `aiModels` (providerId, name, modelId, capabilities, contextWindow, isActive, parameters) 
SELECT 
    id,
    'Phi-3 Mini',
    'phi-3-mini-4k-instruct',
    '["text", "code", "chat"]',
    4096,
    1,
    '3B'
FROM `aiProviders` WHERE name = 'LM Studio' LIMIT 1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

-- OpenAI Models
INSERT INTO `aiModels` (providerId, name, modelId, capabilities, contextWindow, isActive, parameters) 
SELECT 
    id,
    'GPT-4 Turbo',
    'gpt-4-turbo-preview',
    '["text", "code", "chat", "reasoning"]',
    128000,
    1,
    '1T'
FROM `aiProviders` WHERE name = 'OpenAI' LIMIT 1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `aiModels` (providerId, name, modelId, capabilities, contextWindow, isActive, parameters) 
SELECT 
    id,
    'GPT-3.5 Turbo',
    'gpt-3.5-turbo',
    '["text", "code", "chat"]',
    16385,
    1,
    'Unknown'
FROM `aiProviders` WHERE name = 'OpenAI' LIMIT 1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

-- Anthropic Models
INSERT INTO `aiModels` (providerId, name, modelId, capabilities, contextWindow, isActive, parameters) 
SELECT 
    id,
    'Claude 3 Opus',
    'claude-3-opus-20240229',
    '["text", "code", "chat", "reasoning"]',
    200000,
    1,
    'Unknown'
FROM `aiProviders` WHERE name = 'Anthropic' LIMIT 1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `aiModels` (providerId, name, modelId, capabilities, contextWindow, isActive, parameters) 
SELECT 
    id,
    'Claude 3 Sonnet',
    'claude-3-sonnet-20240229',
    '["text", "code", "chat", "reasoning"]',
    200000,
    1,
    'Unknown'
FROM `aiProviders` WHERE name = 'Anthropic' LIMIT 1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `aiModels` (providerId, name, modelId, capabilities, contextWindow, isActive, parameters) 
SELECT 
    id,
    'Claude 3 Haiku',
    'claude-3-haiku-20240307',
    '["text", "code", "chat"]',
    200000,
    1,
    'Unknown'
FROM `aiProviders` WHERE name = 'Anthropic' LIMIT 1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

-- Google AI Models
INSERT INTO `aiModels` (providerId, name, modelId, capabilities, contextWindow, isActive, parameters) 
SELECT 
    id,
    'Gemini 1.5 Pro',
    'gemini-1.5-pro',
    '["text", "code", "chat", "multimodal"]',
    1000000,
    1,
    'Unknown'
FROM `aiProviders` WHERE name = 'Google AI' LIMIT 1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `aiModels` (providerId, name, modelId, capabilities, contextWindow, isActive, parameters) 
SELECT 
    id,
    'Gemini 1.5 Flash',
    'gemini-1.5-flash',
    '["text", "code", "chat", "multimodal"]',
    1000000,
    1,
    'Unknown'
FROM `aiProviders` WHERE name = 'Google AI' LIMIT 1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

-- Mistral Models
INSERT INTO `aiModels` (providerId, name, modelId, capabilities, contextWindow, isActive, parameters) 
SELECT 
    id,
    'Mistral Large',
    'mistral-large-latest',
    '["text", "code", "chat"]',
    32768,
    1,
    'Unknown'
FROM `aiProviders` WHERE name = 'Mistral AI' LIMIT 1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `aiModels` (providerId, name, modelId, capabilities, contextWindow, isActive, parameters) 
SELECT 
    id,
    'Mixtral 8x7B',
    'mixtral-8x7b-instruct-v0.1',
    '["text", "code", "chat"]',
    32768,
    1,
    '8x7B'
FROM `aiProviders` WHERE name = 'Mistral AI' LIMIT 1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

-- ==================================================
-- IAs ESPECIALIZADAS
-- ==================================================

INSERT INTO `specializedAIs` (userId, name, description, category, defaultModelId, systemPrompt, capabilities, isActive) 
SELECT 
    1,
    'Arquiteto de Software',
    'Especialista em planejamento de arquiteturas de sistemas',
    'code',
    (SELECT id FROM aiModels WHERE name = 'GPT-4 Turbo' LIMIT 1),
    'Você é um arquiteto de software experiente. Sua função é planejar arquiteturas de sistemas, definir padrões, escolher tecnologias adequadas e garantir escalabilidade e manutenibilidade.',
    '["architecture", "system-design", "tech-stack"]',
    1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `specializedAIs` (userId, name, description, category, defaultModelId, systemPrompt, capabilities, isActive) 
SELECT 
    1,
    'Desenvolvedor Backend',
    'Especialista em desenvolvimento de APIs e lógica de negócio',
    'code',
    (SELECT id FROM aiModels WHERE name = 'Claude 3 Sonnet' LIMIT 1),
    'Você é um desenvolvedor backend especializado. Foco em APIs RESTful, bancos de dados, autenticação, microserviços e testes automatizados. Escreva código limpo e bem documentado.',
    '["api", "database", "backend", "testing"]',
    1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `specializedAIs` (userId, name, description, category, defaultModelId, systemPrompt, capabilities, isActive) 
SELECT 
    1,
    'Desenvolvedor Frontend',
    'Especialista em React, TypeScript e interfaces modernas',
    'code',
    (SELECT id FROM aiModels WHERE name = 'GPT-3.5 Turbo' LIMIT 1),
    'Você é um desenvolvedor frontend especializado em React, TypeScript e interfaces modernas. Foco em componentização, performance, acessibilidade e responsividade.',
    '["react", "typescript", "ui", "frontend"]',
    1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `specializedAIs` (userId, name, description, category, defaultModelId, systemPrompt, capabilities, isActive) 
SELECT 
    1,
    'Revisor de Código',
    'Especialista em code review rigoroso e construtivo',
    'validation',
    (SELECT id FROM aiModels WHERE name = 'Claude 3 Opus' LIMIT 1),
    'Você é um revisor de código rigoroso e construtivo. Analise qualidade, segurança, performance e manutenibilidade. Seja específico e sugira melhorias concretas.',
    '["code-review", "security", "best-practices"]',
    1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `specializedAIs` (userId, name, description, category, defaultModelId, systemPrompt, capabilities, isActive) 
SELECT 
    1,
    'Testador QA',
    'Especialista em testes e quality assurance',
    'validation',
    (SELECT id FROM aiModels WHERE name = 'Gemini 1.5 Flash' LIMIT 1),
    'Você é um especialista em Quality Assurance. Crie casos de teste abrangentes, testes de integração e E2E, identifique bugs potenciais e sugira automação.',
    '["testing", "qa", "automation"]',
    1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `specializedAIs` (userId, name, description, category, defaultModelId, systemPrompt, capabilities, isActive) 
SELECT 
    1,
    'Documentador Técnico',
    'Especialista em documentação técnica clara',
    'writing',
    (SELECT id FROM aiModels WHERE name = 'GPT-3.5 Turbo' LIMIT 1),
    'Você é um especialista em documentação técnica. Crie documentação de APIs, READMEs, tutoriais, guias de arquitetura e comentários de código úteis. Use linguagem clara e exemplos práticos.',
    '["documentation", "technical-writing"]',
    1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `specializedAIs` (userId, name, description, category, defaultModelId, systemPrompt, capabilities, isActive) 
SELECT 
    1,
    'Especialista em DevOps',
    'Especialista em CI/CD e infraestrutura',
    'code',
    (SELECT id FROM aiModels WHERE name = 'Mistral Large' LIMIT 1),
    'Você é um especialista em DevOps e infraestrutura. Foco em CI/CD pipelines, containers, Infrastructure as Code, monitoramento e cloud. Priorize automação e confiabilidade.',
    '["devops", "ci-cd", "infrastructure", "cloud"]',
    1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `specializedAIs` (userId, name, description, category, defaultModelId, systemPrompt, capabilities, isActive) 
SELECT 
    1,
    'Analista de Segurança',
    'Especialista em segurança e auditoria',
    'validation',
    (SELECT id FROM aiModels WHERE name = 'Claude 3 Haiku' LIMIT 1),
    'Você é um analista de segurança. Identifique vulnerabilidades (OWASP Top 10), falhas de autenticação, exposição de dados sensíveis e configurações inseguras. Sugira correções práticas.',
    '["security", "vulnerability", "audit"]',
    1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `specializedAIs` (userId, name, description, category, defaultModelId, systemPrompt, capabilities, isActive) 
SELECT 
    1,
    'Designer UX/UI',
    'Especialista em experiência do usuário',
    'writing',
    (SELECT id FROM aiModels WHERE name = 'Gemini 1.5 Pro' LIMIT 1),
    'Você é um designer de UX/UI focado em experiência do usuário. Crie fluxos intuitivos, interfaces acessíveis, protótipos funcionais e design systems consistentes. Priorize simplicidade.',
    '["ux", "ui", "design", "accessibility"]',
    1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `specializedAIs` (userId, name, description, category, defaultModelId, systemPrompt, capabilities, isActive) 
SELECT 
    1,
    'Especialista em Banco de Dados',
    'Especialista em SQL e NoSQL',
    'code',
    (SELECT id FROM aiModels WHERE name = 'Mixtral 8x7B' LIMIT 1),
    'Você é especialista em bancos de dados SQL e NoSQL. Otimize schema design, queries, índices, transações e escalabilidade. Sempre considere performance e integridade dos dados.',
    '["database", "sql", "nosql", "optimization"]',
    1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

INSERT INTO `specializedAIs` (userId, name, description, category, defaultModelId, systemPrompt, capabilities, isActive) 
SELECT 
    1,
    'Assistente Local',
    'IA de propósito geral no LM Studio',
    'research',
    (SELECT id FROM aiModels WHERE name = 'Llama 3.1 8B' LIMIT 1),
    'Você é um assistente geral de propósito múltiplo rodando localmente. Ajude com geração de código, análise, brainstorming e tarefas gerais. Seja conciso e prático.',
    '["general", "code", "analysis"]',
    1
ON DUPLICATE KEY UPDATE isActive = VALUES(isActive);

-- ==================================================
-- TEMPLATES DE CREDENCIAIS (mantidos do schema.sql)
-- ==================================================

-- Templates já estão no schema.sql original, não precisa duplicar

-- ==================================================
-- INSTRUÇÕES DO SISTEMA
-- ==================================================

INSERT INTO `instructions` (userId, title, content, category, priority, isActive) 
VALUES (
    1,
    'Padrões de Código TypeScript',
    '# Padrões de Código TypeScript

## Nomenclatura
- Classes: PascalCase
- Funções/variáveis: camelCase
- Constantes: UPPER_SNAKE_CASE

## Boas Práticas
1. Use const por padrão
2. Sempre defina tipos explicitamente
3. Use async/await
4. Prefira arrow functions
5. Documente funções públicas',
    'coding-standards',
    'high',
    1
) ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO `instructions` (userId, title, content, category, priority, isActive) 
VALUES (
    1,
    'Segurança - OWASP Top 10',
    '# Checklist de Segurança OWASP Top 10

1. Injection: Use prepared statements
2. Broken Authentication: Rate limiting e 2FA
3. Sensitive Data: Criptografe dados em repouso
4. XSS: Sanitize entradas
5. Security Misconfiguration: Remova headers detalhados
6. Logging: Implemente logging adequado',
    'security',
    'critical',
    1
) ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO `instructions` (userId, title, content, category, priority, isActive) 
VALUES (
    1,
    'Processo de Code Review',
    '# Processo de Code Review

## Checklist
- Código segue padrões
- Sem código duplicado
- Funções pequenas e focadas
- Nomes descritivos
- Tratamento de erros
- Testes adequados
- Sem vulnerabilidades',
    'process',
    'high',
    1
) ON DUPLICATE KEY UPDATE title = VALUES(title);

SQL_EOF

log_success "Arquivo SQL criado"

log_info "Executando população do banco de dados..."
if mysql -u "$DB_USER" -p"$DB_PASSWORD" < /tmp/populate_db.sql 2>&1 | grep -v "Warning: Using a password"; then
    log_success "Banco de dados populado com sucesso!"
    
    # Contar registros
    PROVIDERS=$(mysql -u "$DB_USER" -p"$DB_PASSWORD" -D "$DB_NAME" -se "SELECT COUNT(*) FROM aiProviders;" 2>/dev/null)
    MODELS=$(mysql -u "$DB_USER" -p"$DB_PASSWORD" -D "$DB_NAME" -se "SELECT COUNT(*) FROM aiModels;" 2>/dev/null)
    SPECIALIZED=$(mysql -u "$DB_USER" -p"$DB_PASSWORD" -D "$DB_NAME" -se "SELECT COUNT(*) FROM specializedAIs;" 2>/dev/null)
    INSTRUCTIONS=$(mysql -u "$DB_USER" -p"$DB_PASSWORD" -D "$DB_NAME" -se "SELECT COUNT(*) FROM instructions;" 2>/dev/null)
    
    log_info "  ├─ Provedores de IA: $PROVIDERS cadastrados"
    log_info "  ├─ Modelos de IA: $MODELS cadastrados"
    log_info "  ├─ IAs Especializadas: $SPECIALIZED cadastradas"
    log_info "  └─ Instruções: $INSTRUCTIONS cadastradas"
else
    log_error "Erro ao popular banco de dados"
    cat /tmp/populate_db.sql
    exit 1
fi

rm -f /tmp/populate_db.sql

log_success "População concluída!"
