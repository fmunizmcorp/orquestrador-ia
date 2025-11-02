-- ==================================================
-- POPULAR DADOS COMPLETOS - Orquestrador IA v3
-- ==================================================

USE orquestraia;

-- ==================================================
-- 1. USUÁRIO ADMIN
-- ==================================================
INSERT INTO users (openId, name, email, username, passwordHash, role, bio, preferences) VALUES
('admin-001', 'Administrador', 'admin@orquestraia.local', 'admin', '$2a$10$vVZKjQKwQ9YWQwGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQ', 'admin', 'Administrador do Sistema Orquestrador IA', '{"theme": "dark", "language": "pt-BR"}'),
('user-001', 'Flavio', 'flavio@orquestraia.local', 'flavio', '$2a$10$vVZKjQKwQ9YWQwGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQ', 'admin', 'Desenvolvedor Principal', '{"theme": "dark", "language": "pt-BR"}');

-- ==================================================
-- 2. AI PROVIDERS
-- ==================================================
INSERT INTO aiProviders (name, type, endpoint, apiKey, isActive, config) VALUES
('LM Studio', 'local', 'http://localhost:1234/v1', NULL, TRUE, '{"timeout": 300000, "cache_duration": 300}'),
('OpenAI', 'api', 'https://api.openai.com/v1', NULL, FALSE, '{"timeout": 60000, "max_retries": 3}'),
('Anthropic', 'api', 'https://api.anthropic.com/v1', NULL, FALSE, '{"timeout": 60000, "max_retries": 3}'),
('Google Gemini', 'api', 'https://generativelanguage.googleapis.com/v1', NULL, FALSE, '{"timeout": 60000, "max_retries": 3}');

-- ==================================================
-- 3. TEAMS & PROJECTS
-- ==================================================
INSERT INTO teams (name, description, ownerId) VALUES
('Equipe Principal', 'Equipe de desenvolvimento principal do Orquestrador IA', 1),
('Equipe de Pesquisa', 'Equipe focada em R&D de novos modelos e técnicas', 1),
('Equipe de QA', 'Equipe de qualidade e testes', 1);

INSERT INTO teamMembers (teamId, userId, role) VALUES
(1, 1, 'owner'),
(1, 2, 'admin'),
(2, 1, 'owner'),
(2, 2, 'member'),
(3, 1, 'owner'),
(3, 2, 'member');

INSERT INTO projects (name, description, userId, teamId, status, progress, tags) VALUES
('Orquestrador IA v3', 'Sistema de orquestração multi-modelo com validação cruzada', 1, 1, 'active', 75, '["ai", "orquestração", "validação"]'),
('Sistema de Monitoramento', 'Monitoramento em tempo real de performance de modelos', 1, 1, 'planning', 20, '["monitoramento", "metrics", "performance"]'),
('Base de Conhecimento', 'Sistema de RAG para documentação e conhecimento organizacional', 1, 2, 'active', 50, '["rag", "conhecimento", "embeddings"]');

-- ==================================================
-- 4. PROMPTS BASE
-- ==================================================
INSERT INTO prompts (userId, title, description, content, category, tags, variables, isPublic, useCount, currentVersion) VALUES
(1, 'Análise de Código', 'Analisa código e sugere melhorias', 
'Você é um especialista em análise de código. Analise o seguinte código e forneça:\n1. Avaliação de qualidade (0-10)\n2. Problemas identificados\n3. Sugestões de melhoria\n4. Boas práticas não aplicadas\n\nCódigo:\n{{code}}\n\nLinguagem: {{language}}',
'coding', '["code-review", "analysis", "quality"]', '{"code": "string", "language": "string"}', TRUE, 0, 1),

(1, 'Geração de Testes', 'Gera testes unitários para código',
'Você é um especialista em testes de software. Gere testes unitários completos para o seguinte código:\n\n{{code}}\n\nFramework: {{test_framework}}\nLinguagem: {{language}}\n\nIncluir:\n- Testes de casos normais\n- Testes de casos extremos\n- Testes de erros\n- Mocks quando necessário',
'coding', '["testing", "unit-tests", "quality"]', '{"code": "string", "language": "string", "test_framework": "string"}', TRUE, 0, 1),

(1, 'Documentação Automática', 'Gera documentação para código',
'Gere documentação completa e profissional para o seguinte código:\n\n{{code}}\n\nIncluir:\n- Descrição geral\n- Parâmetros e tipos\n- Valores de retorno\n- Exemplos de uso\n- Possíveis exceções\n\nFormato: {{format}}',
'documentation', '["docs", "documentation", "comments"]', '{"code": "string", "format": "markdown"}', TRUE, 0, 1),

(1, 'Refatoração de Código', 'Sugere refatorações para melhorar código',
'Você é um especialista em refatoração. Analise o código abaixo e sugira refatorações para:\n1. Melhorar legibilidade\n2. Reduzir complexidade\n3. Aplicar design patterns apropriados\n4. Melhorar performance\n5. Seguir princípios SOLID\n\nCódigo:\n{{code}}\n\nLinguagem: {{language}}\nObjetivo: {{goal}}',
'coding', '["refactoring", "clean-code", "solid"]', '{"code": "string", "language": "string", "goal": "string"}', TRUE, 0, 1),

(1, 'Análise de Segurança', 'Identifica vulnerabilidades de segurança',
'Você é um especialista em segurança de software. Analise o código abaixo e identifique:\n1. Vulnerabilidades de segurança (OWASP Top 10)\n2. Práticas inseguras\n3. Exposição de dados sensíveis\n4. Falhas de validação\n5. Recomendações de correção\n\nCódigo:\n{{code}}\n\nTipo de aplicação: {{app_type}}',
'security', '["security", "vulnerabilities", "owasp"]', '{"code": "string", "app_type": "string"}', TRUE, 0, 1),

(1, 'Tradução de Código', 'Traduz código entre linguagens',
'Traduza o seguinte código de {{source_language}} para {{target_language}}, mantendo:\n1. Mesma funcionalidade\n2. Idiomas da linguagem alvo\n3. Boas práticas da linguagem alvo\n4. Comentários explicativos sobre diferenças\n\nCódigo fonte:\n{{code}}',
'coding', '["translation", "migration", "conversion"]', '{"code": "string", "source_language": "string", "target_language": "string"}', TRUE, 0, 1),

(1, 'Otimização de Performance', 'Otimiza código para melhor performance',
'Você é um especialista em otimização. Analise o código e sugira otimizações para:\n1. Tempo de execução\n2. Uso de memória\n3. Complexidade algorítmica\n4. I/O eficiente\n5. Paralelização quando aplicável\n\nCódigo:\n{{code}}\n\nRestrições: {{constraints}}\nObjetivo de performance: {{target}}',
'performance', '["optimization", "performance", "efficiency"]', '{"code": "string", "constraints": "string", "target": "string"}', TRUE, 0, 1),

(1, 'Explicação de Código', 'Explica código de forma didática',
'Explique o seguinte código de forma clara e didática, adequado para: {{audience}}\n\nIncluir:\n1. O que o código faz (visão geral)\n2. Como funciona (passo a passo)\n3. Por que foi implementado dessa forma\n4. Conceitos importantes envolvidos\n5. Exemplos práticos\n\nCódigo:\n{{code}}',
'education', '["explanation", "learning", "teaching"]', '{"code": "string", "audience": "iniciantes"}', TRUE, 0, 1);

-- ==================================================
-- 5. PROMPT VERSIONS (histórico)
-- ==================================================
INSERT INTO promptVersions (promptId, version, content, changelog, createdByUserId) VALUES
(1, 1, 'Você é um especialista em análise de código...', 'Versão inicial', 1),
(2, 1, 'Você é um especialista em testes de software...', 'Versão inicial', 1),
(3, 1, 'Gere documentação completa e profissional...', 'Versão inicial', 1),
(4, 1, 'Você é um especialista em refatoração...', 'Versão inicial', 1),
(5, 1, 'Você é um especialista em segurança de software...', 'Versão inicial', 1),
(6, 1, 'Traduza o seguinte código...', 'Versão inicial', 1),
(7, 1, 'Você é um especialista em otimização...', 'Versão inicial', 1),
(8, 1, 'Explique o seguinte código de forma clara...', 'Versão inicial', 1);

-- ==================================================
-- 6. AI TEMPLATES
-- ==================================================
INSERT INTO aiTemplates (userId, name, description, category, templateData, isPublic, usageCount) VALUES
(1, 'Template - Análise Técnica', 'Template para análise técnica detalhada', 'analysis',
'{"sections": ["overview", "technical_details", "recommendations", "risks"], "format": "markdown", "depth": "detailed"}',
TRUE, 0),

(1, 'Template - Relatório de Bug', 'Template para relatórios de bug estruturados', 'reporting',
'{"fields": ["title", "description", "steps_to_reproduce", "expected", "actual", "environment"], "format": "structured"}',
TRUE, 0),

(1, 'Template - Code Review', 'Template para code reviews padronizados', 'review',
'{"sections": ["summary", "strengths", "issues", "suggestions", "verdict"], "scoring": true}',
TRUE, 0),

(1, 'Template - Documentação de API', 'Template para documentação de APIs', 'documentation',
'{"sections": ["endpoint", "method", "parameters", "response", "examples", "errors"], "format": "openapi"}',
TRUE, 0);

-- ==================================================
-- 7. AI WORKFLOWS
-- ==================================================
INSERT INTO aiWorkflows (userId, name, description, steps, isActive) VALUES
(1, 'Workflow - Análise Completa de Código', 'Workflow completo: análise → testes → documentação', 
'[
  {"step": 1, "action": "analyze_code", "ai": "code_analyzer", "prompt_id": 1},
  {"step": 2, "action": "generate_tests", "ai": "test_generator", "prompt_id": 2, "depends_on": 1},
  {"step": 3, "action": "generate_docs", "ai": "documentor", "prompt_id": 3, "depends_on": 1},
  {"step": 4, "action": "validate_all", "ai": "validator", "depends_on": [2, 3]}
]',
TRUE),

(1, 'Workflow - Deploy Seguro', 'Workflow de deploy com validações de segurança',
'[
  {"step": 1, "action": "security_scan", "ai": "security_expert", "prompt_id": 5},
  {"step": 2, "action": "run_tests", "ai": "test_runner", "depends_on": 1},
  {"step": 3, "action": "performance_check", "ai": "performance_analyzer", "depends_on": 2},
  {"step": 4, "action": "deploy", "ai": "deployer", "depends_on": [1, 2, 3]}
]',
TRUE),

(1, 'Workflow - Refatoração Assistida', 'Workflow de refatoração com validação',
'[
  {"step": 1, "action": "analyze_refactoring_opportunities", "ai": "code_analyzer", "prompt_id": 4},
  {"step": 2, "action": "apply_refactoring", "ai": "refactorer", "depends_on": 1},
  {"step": 3, "action": "generate_tests", "ai": "test_generator", "prompt_id": 2, "depends_on": 2},
  {"step": 4, "action": "validate_behavior", "ai": "validator", "depends_on": [2, 3]}
]',
TRUE);

-- ==================================================
-- 8. INSTRUCTIONS (base)
-- ==================================================
INSERT INTO instructions (userId, aiId, title, content, priority, isActive) VALUES
(1, NULL, 'Sempre use formato JSON quando apropriado', 'Ao retornar dados estruturados, prefira formato JSON válido com campos claramente identificados.', 90, TRUE),
(1, NULL, 'Priorize legibilidade sobre brevidade', 'Código deve ser claro e autoexplicativo. Comentários devem explicar "por quê", não "o quê".', 80, TRUE),
(1, NULL, 'Siga princípios SOLID', 'Sempre aplique princípios SOLID: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.', 85, TRUE),
(1, NULL, 'Segurança primeiro', 'Nunca comprometa segurança por conveniência. Valide inputs, sanitize outputs, use autenticação e autorização adequadas.', 100, TRUE),
(1, NULL, 'Testes são obrigatórios', 'Todo código deve ter testes unitários adequados. Cobertura mínima de 80%.', 90, TRUE),
(1, NULL, 'Performance importa', 'Considere sempre complexidade algorítmica. Use estruturas de dados apropriadas. Profile quando necessário.', 70, TRUE),
(1, NULL, 'Documente decisões importantes', 'Documente decisões de arquitetura, trade-offs escolhidos e razões para abordagens não-óbvias.', 75, TRUE);

-- ==================================================
-- 9. KNOWLEDGE BASE (base)
-- ==================================================
INSERT INTO knowledgeBase (userId, title, content, category, tags, isActive) VALUES
(1, 'Arquitetura do Orquestrador IA', 
'# Arquitetura do Sistema\n\n## Componentes Principais\n\n1. **Frontend (React + TypeScript)**\n   - Interface do usuário\n   - Comunicação via tRPC\n   - Estado gerenciado com Context API\n\n2. **Backend (Express + tRPC)**\n   - API REST/tRPC\n   - Autenticação OpenID\n   - Orquestração de modelos\n\n3. **Banco de Dados (MySQL)**\n   - 48 tabelas\n   - Drizzle ORM\n   - Migrations automáticas\n\n4. **LM Studio Integration**\n   - Modelos locais\n   - Cache de 5 minutos\n   - Sincronização automática',
'architecture', '["arquitetura", "sistema", "documentação"]', TRUE),

(1, 'Guia de Orquestração',
'# Sistema de Orquestração\n\n## Como Funciona\n\nO orquestrador gerencia a execução de tarefas distribuídas entre múltiplos modelos AI:\n\n1. **Decomposição**: Tarefa complexa → subtarefas simples\n2. **Atribuição**: Cada subtarefa → modelo especializado\n3. **Execução**: Modelos executam em paralelo quando possível\n4. **Validação Cruzada**: Resultados validados por modelos diferentes\n5. **Consolidação**: Resultados combinados → resposta final\n\n## Validação Cruzada Obrigatória\n\nTodo resultado DEVE passar por validação:\n- Score mínimo: 75/100\n- Divergência máxima: 20%\n- Se reprovado: reexecutar com modelo diferente',
'orchestration', '["orquestração", "validação", "workflow"]', TRUE),

(1, 'Detecção de Alucinações',
'# Sistema de Detecção de Alucinações\n\n## Indicadores Monitorados\n\n1. **Inconsistência Temporal**: Datas, sequências de eventos\n2. **Contradições Lógicas**: Afirmações conflitantes\n3. **Fatos Verificáveis**: Checagem contra knowledge base\n4. **Padrões Suspeitos**: Excesso de certeza sem evidências\n5. **Contexto Perdido**: Respostas fora do contexto\n\n## Níveis de Confiança\n\n- 90-100%: Alta confiança\n- 70-89%: Média confiança\n- 50-69%: Baixa confiança (revisar)\n- 0-49%: Muito baixa (rejeitar)\n\n## Recuperação Automática\n\nQuando alucinação detectada:\n1. Marcar resultado como suspeito\n2. Re-executar com modelo diferente\n3. Comparar resultados\n4. Usar ensemble se necessário',
'quality', '["qualidade", "alucinação", "validação"]', TRUE),

(1, 'Integração LM Studio',
'# Integração com LM Studio\n\n## Configuração\n\n- Endpoint: `http://localhost:1234/v1`\n- Cache: 5 minutos\n- Timeout: 300 segundos\n\n## Sincronização de Modelos\n\nModelos são sincronizados automaticamente:\n1. API `/v1/models` consultada periodicamente\n2. Novos modelos adicionados ao banco\n3. Modelos removidos marcados como inativos\n4. Status de carregamento atualizado\n\n## Capacidades Detectadas\n\nSistema detecta capacidades por nome:\n- `code`, `coder`, `coding` → Coding\n- `medicine`, `medical`, `health` → Medical\n- `instruct`, `chat` → General\n- `math` → Mathematics',
'integration', '["lm-studio", "modelos", "sincronização"]', TRUE),

(1, 'Guia de Uso de Prompts',
'# Sistema de Prompts\n\n## Anatomia de um Prompt\n\n```\n1. Role/Contexto: "Você é um especialista em..."\n2. Tarefa: O que fazer\n3. Input: Dados/código a processar\n4. Formato: Como retornar resultado\n5. Critérios: O que considerar\n```\n\n## Variáveis\n\nUse `{{variable_name}}` para placeholders:\n- `{{code}}`: Código a analisar\n- `{{language}}`: Linguagem de programação\n- `{{context}}`: Contexto adicional\n\n## Versionamento\n\nPrompts são versionados:\n- Versão inicial: 1\n- Alterações: incrementa versão\n- Histórico mantido\n- Pode reverter para versões anteriores',
'prompts', '["prompts", "templates", "guia"]', TRUE);

-- ==================================================
-- 10. CREDENTIAL TEMPLATES
-- ==================================================
INSERT INTO credentialTemplates (service, fields, instructions, isActive) VALUES
('github', 
'{"token": {"type": "password", "label": "Personal Access Token", "required": true}, "username": {"type": "text", "label": "Username", "required": false}}',
'1. Acesse GitHub Settings > Developer Settings > Personal Access Tokens\n2. Gere novo token com permissões necessárias\n3. Cole o token no campo acima',
TRUE),

('openai',
'{"api_key": {"type": "password", "label": "API Key", "required": true}, "organization": {"type": "text", "label": "Organization ID", "required": false}}',
'1. Acesse OpenAI Platform\n2. Navegue até API Keys\n3. Crie nova API key\n4. Copie e cole no campo acima',
TRUE),

('anthropic',
'{"api_key": {"type": "password", "label": "API Key", "required": true}}',
'1. Acesse Anthropic Console\n2. Navegue até API Keys\n3. Gere nova key\n4. Cole no campo acima',
TRUE),

('aws',
'{"access_key_id": {"type": "text", "label": "Access Key ID", "required": true}, "secret_access_key": {"type": "password", "label": "Secret Access Key", "required": true}, "region": {"type": "text", "label": "Region", "required": false, "default": "us-east-1"}}',
'1. Acesse AWS Console > IAM\n2. Crie novo usuário ou use existente\n3. Gere novas credenciais de acesso\n4. Preencha os campos acima',
TRUE);

-- ==================================================
-- DADOS POPULADOS COM SUCESSO
-- ==================================================
-- Users: 2
-- AI Providers: 4 (LM Studio ativo)
-- Teams: 3
-- Team Members: 6
-- Projects: 3
-- Prompts: 8 (públicos)
-- Prompt Versions: 8
-- AI Templates: 4
-- AI Workflows: 3
-- Instructions: 7
-- Knowledge Base: 5 artigos
-- Credential Templates: 4
-- ==================================================
