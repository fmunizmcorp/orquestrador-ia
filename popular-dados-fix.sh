#!/bin/bash

echo "╔══════════════════════════════════════════════════╗"
echo "║ POPULAÇÃO DO BANCO - ORQUESTRADOR V3.4.0         ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

DB_USER="flavio"
DB_PASS="bdflavioia"
DB_NAME="orquestraia"

echo "📊 Verificando conexão com banco..."
mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SELECT 1" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "❌ Erro ao conectar no banco"
    exit 1
fi
echo "✅ Conexão OK"
echo ""

echo "🔄 Populando dados..."

# 1. USUÁRIOS (mínimo)
echo "1️⃣  Inserindo usuário admin..."
mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" << 'EOF'
INSERT IGNORE INTO users (id, email, name, role, createdAt, updatedAt) VALUES
(1, 'admin@orquestrador.local', 'Administrador', 'admin', NOW(), NOW());
EOF

# 2. PROVEDORES DE IA
echo "2️⃣  Inserindo provedores de IA..."
mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" << 'EOF'
INSERT IGNORE INTO aiProviders (name, url, status, createdAt, updatedAt) VALUES
('LM Studio', 'http://localhost:1234/v1', 'online', NOW(), NOW()),
('OpenAI', 'https://api.openai.com/v1', 'offline', NOW(), NOW()),
('Anthropic', 'https://api.anthropic.com/v1', 'offline', NOW(), NOW()),
('Google AI', 'https://generativelanguage.googleapis.com/v1', 'offline', NOW(), NOW()),
('Ollama', 'http://localhost:11434', 'offline', NOW(), NOW());
EOF

# 3. MODELOS DE IA
echo "3️⃣  Inserindo modelos de IA..."
mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" << 'EOF'
INSERT IGNORE INTO aiModels (providerId, name, displayName, category, capabilities, active, createdAt, updatedAt) VALUES
(1, 'medicine-llm', 'Medicine LLM', 'Medicina', '["text", "analysis", "medical"]', 1, NOW(), NOW()),
(1, 'qwen3-coder-reap-25b-a3b', 'Qwen3 Coder', 'Código', '["text", "code", "programming"]', 1, NOW(), NOW()),
(1, 'local-model', 'Modelo Local', 'Geral', '["text", "chat"]', 1, NOW(), NOW());
EOF

# 4. IAs ESPECIALIZADAS
echo "4️⃣  Inserindo IAs especializadas..."
mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" << 'EOF'
INSERT IGNORE INTO specializedAIs (name, category, systemPrompt, defaultModelId, active, createdAt, updatedAt) VALUES
('Orquestrador Principal', 'Coordenação', 'Você é o orquestrador principal responsável por coordenar múltiplas IAs', 1, 1, NOW(), NOW()),
('Validador', 'Validação', 'Você é responsável por validar resultados de outras IAs', 2, 1, NOW(), NOW()),
('Detector de Alucinação', 'Qualidade', 'Você detecta e corrige alucinações em respostas de IAs', 1, 1, NOW(), NOW()),
('Programador', 'Código', 'Você é especialista em programação e desenvolvimento de software', 2, 1, NOW(), NOW()),
('Analista', 'Análise', 'Você analisa dados e gera insights', 1, 1, NOW(), NOW());
EOF

# 5. PROJETOS
echo "5️⃣  Inserindo projetos..."
mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" << 'EOF'
INSERT IGNORE INTO projects (userId, name, description, status, createdAt, updatedAt) VALUES
(1, 'Projeto Exemplo 1', 'Projeto de demonstração', 'active', NOW(), NOW()),
(1, 'Projeto Exemplo 2', 'Outro projeto de exemplo', 'active', NOW(), NOW());
EOF

# 6. EQUIPES
echo "6️⃣  Inserindo equipes..."
mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" << 'EOF'
INSERT IGNORE INTO teams (name, description, createdAt, updatedAt) VALUES
('Equipe Alpha', 'Equipe principal de desenvolvimento', NOW(), NOW()),
('Equipe Beta', 'Equipe de testes e validação', NOW(), NOW()),
('Equipe Gamma', 'Equipe de análise de dados', NOW(), NOW());
EOF

# 7. TAREFAS
echo "7️⃣  Inserindo tarefas..."
mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" << 'EOF'
INSERT IGNORE INTO tasks (userId, title, description, status, priority, createdAt, updatedAt) VALUES
(1, 'Tarefa de Teste 1', 'Primeira tarefa de teste', 'pending', 'high', NOW(), NOW()),
(1, 'Tarefa de Teste 2', 'Segunda tarefa de teste', 'in_progress', 'medium', NOW(), NOW()),
(1, 'Tarefa de Teste 3', 'Terceira tarefa de teste', 'completed', 'low', NOW(), NOW());
EOF

# 8. PROMPTS
echo "8️⃣  Inserindo prompts...  "
mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" << 'EOF'
INSERT IGNORE INTO prompts (userId, name, content, category, isPublic, createdAt, updatedAt) VALUES
(1, 'Prompt de Código', 'Você é um assistente de programação expert', 'code', 1, NOW(), NOW()),
(1, 'Prompt de Análise', 'Você é um analista de dados especializado', 'analysis', 1, NOW(), NOW()),
(1, 'Prompt de Chat', 'Você é um assistente conversacional amigável', 'chat', 1, NOW(), NOW());
EOF

# 9. TEMPLATES
echo "9️⃣  Inserindo templates..."
mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" << 'EOF'
INSERT IGNORE INTO aiTemplates (name, description, systemPrompt, category, isPublic, createdAt, updatedAt) VALUES
('Template Genérico', 'Template para tarefas gerais', 'Você é um assistente geral', 'general', 1, NOW(), NOW()),
('Template de Código', 'Template para programação', 'Você é um programador expert', 'code', 1, NOW(), NOW());
EOF

# 10. INSTRUÇÕES
echo "🔟 Inserindo instruções..."
mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" << 'EOF'
INSERT IGNORE INTO instructions (name, content, category, isActive, createdAt, updatedAt) VALUES
('Instrução Padrão', 'Siga sempre as melhores práticas', 'general', 1, NOW(), NOW()),
('Instrução de Segurança', 'Nunca exponha informações sensíveis', 'security', 1, NOW(), NOW());
EOF

# 11. SERVIÇOS EXTERNOS
echo "1️⃣1️⃣ Inserindo serviços externos..."
mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" << 'EOF'
INSERT IGNORE INTO externalAPIAccounts (serviceName, status, createdAt, updatedAt) VALUES
('GitHub', 'inactive', NOW(), NOW()),
('Google Drive', 'inactive', NOW(), NOW()),
('Gmail', 'inactive', NOW(), NOW()),
('Google Sheets', 'inactive', NOW(), NOW()),
('Notion', 'inactive', NOW(), NOW()),
('Slack', 'inactive', NOW(), NOW()),
('Discord', 'inactive', NOW(), NOW());
EOF

echo ""
echo "✅ População concluída com sucesso!"
echo ""
echo "📊 Verificando dados inseridos..."
mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" << 'EOF'
SELECT 'Usuários' as Tabela, COUNT(*) as Total FROM users
UNION ALL SELECT 'Provedores', COUNT(*) FROM aiProviders
UNION ALL SELECT 'Modelos', COUNT(*) FROM aiModels
UNION ALL SELECT 'IAs Especializadas', COUNT(*) FROM specializedAIs
UNION ALL SELECT 'Projetos', COUNT(*) FROM projects
UNION ALL SELECT 'Equipes', COUNT(*) FROM teams
UNION ALL SELECT 'Tarefas', COUNT(*) FROM tasks
UNION ALL SELECT 'Prompts', COUNT(*) FROM prompts
UNION ALL SELECT 'Templates', COUNT(*) FROM aiTemplates
UNION ALL SELECT 'Instruções', COUNT(*) FROM instructions
UNION ALL SELECT 'Serviços Externos', COUNT(*) FROM externalAPIAccounts;
EOF

echo ""
echo "🎉 Banco de dados populado e pronto para uso!"
