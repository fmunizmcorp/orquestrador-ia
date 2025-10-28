-- Schema completo do Orquestrador de IAs V3.0
-- 23 tabelas com relacionamentos e dados iniciais

-- ==================================================
-- 1. TABELA: users
-- ==================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `openId` VARCHAR(255) NOT NULL UNIQUE COMMENT 'Identificador único obrigatório',
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'user') DEFAULT 'user',
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_openId` (`openId`),
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 2. TABELA: aiProviders
-- ==================================================
CREATE TABLE IF NOT EXISTS `aiProviders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `type` ENUM('local', 'api') NOT NULL,
  `endpoint` VARCHAR(500) NOT NULL,
  `apiKey` TEXT,
  `isActive` BOOLEAN DEFAULT TRUE,
  `config` JSON,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_type` (`type`),
  INDEX `idx_isActive` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 3. TABELA: aiModels
-- ==================================================
CREATE TABLE IF NOT EXISTS `aiModels` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `providerId` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `modelId` VARCHAR(255) NOT NULL,
  `capabilities` JSON COMMENT 'Array de capacidades: ["text", "code", "reasoning"]',
  `contextWindow` INT DEFAULT 4096,
  `isLoaded` BOOLEAN DEFAULT FALSE,
  `priority` INT DEFAULT 50 COMMENT 'Prioridade 0-100',
  `isActive` BOOLEAN DEFAULT TRUE,
  `modelPath` VARCHAR(500),
  `quantization` VARCHAR(50) COMMENT 'Ex: Q4_K_M, Q5_K_S',
  `parameters` VARCHAR(50) COMMENT 'Ex: 7B, 13B, 70B',
  `sizeBytes` BIGINT,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`providerId`) REFERENCES `aiProviders`(`id`) ON DELETE CASCADE,
  INDEX `idx_providerId` (`providerId`),
  INDEX `idx_isLoaded` (`isLoaded`),
  INDEX `idx_isActive` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 4. TABELA: specializedAIs
-- ==================================================
CREATE TABLE IF NOT EXISTS `specializedAIs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `category` VARCHAR(100) COMMENT 'research, writing, code, validation, analysis',
  `defaultModelId` INT,
  `fallbackModelIds` JSON COMMENT 'Array de IDs de modelos fallback',
  `systemPrompt` TEXT NOT NULL,
  `capabilities` JSON,
  `isActive` BOOLEAN DEFAULT TRUE,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`defaultModelId`) REFERENCES `aiModels`(`id`) ON DELETE SET NULL,
  INDEX `idx_userId` (`userId`),
  INDEX `idx_category` (`category`),
  INDEX `idx_isActive` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 5. TABELA: credentials
-- ==================================================
CREATE TABLE IF NOT EXISTS `credentials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `service` VARCHAR(100) NOT NULL COMMENT 'GitHub, Gmail, Drive, OpenAI, etc',
  `credentialType` VARCHAR(50) COMMENT 'oauth2, api_key, password',
  `encryptedData` TEXT NOT NULL COMMENT 'Dados criptografados com AES-256-GCM',
  `metadata` JSON COMMENT 'Informações adicionais não sensíveis',
  `isActive` BOOLEAN DEFAULT TRUE,
  `expiresAt` TIMESTAMP NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_userId_service` (`userId`, `service`),
  INDEX `idx_isActive` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 6. TABELA: externalAPIAccounts
-- ==================================================
CREATE TABLE IF NOT EXISTS `externalAPIAccounts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `provider` VARCHAR(100) NOT NULL COMMENT 'OpenAI, Anthropic, Google, etc',
  `accountName` VARCHAR(255) NOT NULL,
  `credentialId` INT,
  `creditBalance` DECIMAL(10,2) DEFAULT 0.00,
  `creditLimit` DECIMAL(10,2),
  `usageThisMonth` DECIMAL(10,2) DEFAULT 0.00,
  `alertThreshold` DECIMAL(10,2) COMMENT 'Alerta quando atingir este valor',
  `isActive` BOOLEAN DEFAULT TRUE,
  `lastSync` TIMESTAMP,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`credentialId`) REFERENCES `credentials`(`id`) ON DELETE SET NULL,
  INDEX `idx_userId` (`userId`),
  INDEX `idx_provider` (`provider`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 7. TABELA: tasks
-- ==================================================
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `description` TEXT NOT NULL,
  `status` ENUM('pending', 'planning', 'executing', 'validating', 'completed', 'failed', 'paused') DEFAULT 'pending',
  `priority` ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `completedAt` TIMESTAMP NULL,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_userId` (`userId`),
  INDEX `idx_status` (`status`),
  INDEX `idx_priority` (`priority`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 8. TABELA: subtasks
-- ==================================================
CREATE TABLE IF NOT EXISTS `subtasks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `taskId` INT NOT NULL,
  `assignedModelId` INT,
  `title` VARCHAR(500) NOT NULL,
  `description` TEXT,
  `prompt` TEXT NOT NULL,
  `result` LONGTEXT,
  `status` ENUM('pending', 'executing', 'completed', 'failed', 'validating', 'rejected') DEFAULT 'pending',
  `reviewedBy` INT COMMENT 'ID do modelo que fez a validação',
  `reviewNotes` TEXT,
  `completedAt` TIMESTAMP NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`taskId`) REFERENCES `tasks`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`assignedModelId`) REFERENCES `aiModels`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`reviewedBy`) REFERENCES `aiModels`(`id`) ON DELETE SET NULL,
  INDEX `idx_taskId` (`taskId`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 9. TABELA: chatConversations
-- ==================================================
CREATE TABLE IF NOT EXISTS `chatConversations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `title` VARCHAR(500),
  `aiId` INT COMMENT 'IA especializada utilizada',
  `modelId` INT COMMENT 'Modelo específico utilizado',
  `isActive` BOOLEAN DEFAULT TRUE,
  `metadata` JSON,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`aiId`) REFERENCES `specializedAIs`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`modelId`) REFERENCES `aiModels`(`id`) ON DELETE SET NULL,
  INDEX `idx_userId` (`userId`),
  INDEX `idx_isActive` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 10. TABELA: chatMessages
-- ==================================================
CREATE TABLE IF NOT EXISTS `chatMessages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `conversationId` INT NOT NULL,
  `role` ENUM('user', 'assistant', 'system') NOT NULL,
  `content` TEXT NOT NULL,
  `attachments` JSON COMMENT 'Array de anexos',
  `metadata` JSON,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`conversationId`) REFERENCES `chatConversations`(`id`) ON DELETE CASCADE,
  INDEX `idx_conversationId` (`conversationId`),
  INDEX `idx_createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 11. TABELA: aiTemplates
-- ==================================================
CREATE TABLE IF NOT EXISTS `aiTemplates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `category` VARCHAR(100),
  `templateData` JSON NOT NULL COMMENT 'Estrutura do template',
  `isPublic` BOOLEAN DEFAULT FALSE,
  `usageCount` INT DEFAULT 0,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_userId` (`userId`),
  INDEX `idx_category` (`category`),
  INDEX `idx_isPublic` (`isPublic`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 12. TABELA: aiWorkflows
-- ==================================================
CREATE TABLE IF NOT EXISTS `aiWorkflows` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `steps` JSON NOT NULL COMMENT 'Array de steps com ordem e configuração',
  `isActive` BOOLEAN DEFAULT TRUE,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_userId` (`userId`),
  INDEX `idx_isActive` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 13. TABELA: instructions
-- ==================================================
CREATE TABLE IF NOT EXISTS `instructions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `aiId` INT COMMENT 'IA específica ou NULL para global',
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `priority` INT DEFAULT 50 COMMENT 'Prioridade 0-100',
  `isActive` BOOLEAN DEFAULT TRUE,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`aiId`) REFERENCES `specializedAIs`(`id`) ON DELETE CASCADE,
  INDEX `idx_userId` (`userId`),
  INDEX `idx_aiId` (`aiId`),
  INDEX `idx_isActive` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 14. TABELA: knowledgeBase
-- ==================================================
CREATE TABLE IF NOT EXISTS `knowledgeBase` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `content` LONGTEXT NOT NULL,
  `category` VARCHAR(100),
  `tags` JSON COMMENT 'Array de tags',
  `embedding` JSON COMMENT 'Vector embedding para busca semântica',
  `isActive` BOOLEAN DEFAULT TRUE,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_userId` (`userId`),
  INDEX `idx_category` (`category`),
  INDEX `idx_isActive` (`isActive`),
  FULLTEXT `idx_content` (`content`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 15. TABELA: knowledgeSources
-- ==================================================
CREATE TABLE IF NOT EXISTS `knowledgeSources` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `knowledgeBaseId` INT NOT NULL,
  `sourceType` VARCHAR(50) COMMENT 'url, file, api, database',
  `sourceUrl` VARCHAR(1000),
  `sourceData` JSON COMMENT 'Dados adicionais da fonte',
  `lastSync` TIMESTAMP NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`knowledgeBaseId`) REFERENCES `knowledgeBase`(`id`) ON DELETE CASCADE,
  INDEX `idx_knowledgeBaseId` (`knowledgeBaseId`),
  INDEX `idx_sourceType` (`sourceType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 16. TABELA: modelDiscovery
-- ==================================================
CREATE TABLE IF NOT EXISTS `modelDiscovery` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `modelName` VARCHAR(255) NOT NULL,
  `modelPath` VARCHAR(1000) NOT NULL,
  `sizeBytes` BIGINT,
  `quantization` VARCHAR(50),
  `parameters` VARCHAR(50),
  `discoveredAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `lastSeen` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isImported` BOOLEAN DEFAULT FALSE,
  INDEX `idx_modelName` (`modelName`),
  INDEX `idx_isImported` (`isImported`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 17. TABELA: modelRatings
-- ==================================================
CREATE TABLE IF NOT EXISTS `modelRatings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `modelId` INT NOT NULL,
  `userId` INT NOT NULL,
  `rating` INT NOT NULL CHECK (`rating` >= 1 AND `rating` <= 5),
  `comment` TEXT,
  `taskType` VARCHAR(100) COMMENT 'Tipo de tarefa avaliada',
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`modelId`) REFERENCES `aiModels`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_modelId` (`modelId`),
  INDEX `idx_userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 18. TABELA: storage
-- ==================================================
CREATE TABLE IF NOT EXISTS `storage` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `fileName` VARCHAR(500) NOT NULL,
  `filePath` VARCHAR(1000) NOT NULL,
  `fileType` VARCHAR(100),
  `sizeBytes` BIGINT,
  `metadata` JSON,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_userId` (`userId`),
  INDEX `idx_fileType` (`fileType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 19. TABELA: taskMonitoring
-- ==================================================
CREATE TABLE IF NOT EXISTS `taskMonitoring` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `taskId` INT NOT NULL,
  `cpuUsage` DECIMAL(5,2) COMMENT 'Porcentagem de uso da CPU',
  `ramUsage` DECIMAL(5,2) COMMENT 'Porcentagem de uso da RAM',
  `gpuUsage` DECIMAL(5,2) COMMENT 'Porcentagem de uso da GPU',
  `executionTime` INT COMMENT 'Tempo de execução em segundos',
  `recordedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`taskId`) REFERENCES `tasks`(`id`) ON DELETE CASCADE,
  INDEX `idx_taskId` (`taskId`),
  INDEX `idx_recordedAt` (`recordedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 20. TABELA: executionLogs
-- ==================================================
CREATE TABLE IF NOT EXISTS `executionLogs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `taskId` INT,
  `subtaskId` INT,
  `level` ENUM('debug', 'info', 'warning', 'error', 'critical') DEFAULT 'info',
  `message` TEXT NOT NULL,
  `metadata` JSON,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`taskId`) REFERENCES `tasks`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`subtaskId`) REFERENCES `subtasks`(`id`) ON DELETE CASCADE,
  INDEX `idx_taskId` (`taskId`),
  INDEX `idx_subtaskId` (`subtaskId`),
  INDEX `idx_level` (`level`),
  INDEX `idx_createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 21. TABELA: creditUsage
-- ==================================================
CREATE TABLE IF NOT EXISTS `creditUsage` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `accountId` INT NOT NULL,
  `taskId` INT,
  `creditsUsed` DECIMAL(10,4) NOT NULL,
  `provider` VARCHAR(100),
  `modelUsed` VARCHAR(255),
  `tokensUsed` INT,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`accountId`) REFERENCES `externalAPIAccounts`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`taskId`) REFERENCES `tasks`(`id`) ON DELETE SET NULL,
  INDEX `idx_accountId` (`accountId`),
  INDEX `idx_taskId` (`taskId`),
  INDEX `idx_createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 22. TABELA: credentialTemplates
-- ==================================================
CREATE TABLE IF NOT EXISTS `credentialTemplates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `service` VARCHAR(100) NOT NULL UNIQUE,
  `fields` JSON NOT NULL COMMENT 'Schema dos campos necessários',
  `instructions` TEXT COMMENT 'Instruções de como obter as credenciais',
  `isActive` BOOLEAN DEFAULT TRUE,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_service` (`service`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 23. TABELA: aiQualityMetrics
-- ==================================================
CREATE TABLE IF NOT EXISTS `aiQualityMetrics` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `aiId` INT NOT NULL,
  `taskType` VARCHAR(100) NOT NULL,
  `successRate` DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Taxa de sucesso 0-100%',
  `avgScore` DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Score médio 0-100',
  `totalTasks` INT DEFAULT 0,
  `lastUpdated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`aiId`) REFERENCES `specializedAIs`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `idx_ai_taskType` (`aiId`, `taskType`),
  INDEX `idx_taskType` (`taskType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- DADOS INICIAIS
-- ==================================================

-- Usuário padrão
INSERT INTO `users` (`openId`, `name`, `email`, `role`) VALUES
('flavio-default', 'Flavio', 'flavio@local', 'admin')
ON DUPLICATE KEY UPDATE `name` = 'Flavio';

-- Provedor LM Studio
INSERT INTO `aiProviders` (`name`, `type`, `endpoint`, `isActive`, `config`) VALUES
('LM Studio Local', 'local', 'http://localhost:1234/v1', 1, '{"description": "Servidor local LM Studio", "maxConcurrent": 1}')
ON DUPLICATE KEY UPDATE `endpoint` = 'http://localhost:1234/v1', `isActive` = 1;

-- IAs Especializadas
INSERT INTO `specializedAIs` (`userId`, `name`, `description`, `category`, `systemPrompt`, `capabilities`, `isActive`) VALUES
(1, 'IA Pesquisadora', 'Especializada em pesquisa completa e detalhada', 'research', 
 'Você é uma IA de pesquisa especializada. Sua função é buscar informações COMPLETAS e detalhadas sobre qualquer tópico. NUNCA resuma ou omita informações importantes. Sempre forneça fontes e referências quando possível.', 
 '["research", "analysis", "web_search"]', 1),

(1, 'IA Redatora', 'Especializada em redação completa de textos', 'writing', 
 'Você é uma IA de redação especializada. Sua função é escrever textos COMPLETOS e bem estruturados. NUNCA resuma ou omita partes do conteúdo solicitado. Sempre escreva de forma clara, coesa e completa.', 
 '["writing", "content_creation", "editing"]', 1),

(1, 'IA Programadora', 'Especializada em programação completa', 'code', 
 'Você é uma IA de programação especializada. Sua função é escrever código COMPLETO e funcional. NUNCA resuma ou omita partes do código. Sempre implemente TODAS as funcionalidades solicitadas com comentários e tratamento de erros adequados.', 
 '["coding", "debugging", "code_review"]', 1),

(1, 'IA Validadora', 'Especializada em validação criteriosa de resultados', 'validation', 
 'Você é uma IA de validação especializada. Sua função é revisar TUDO de forma criteriosa e honesta. Verifique se o trabalho está COMPLETO, correto e atende a TODOS os requisitos. Seja rigoroso na análise e aponte qualquer falha ou omissão.', 
 '["validation", "review", "quality_assurance"]', 1),

(1, 'IA Analista', 'Especializada em análise de dados e métricas', 'analysis', 
 'Você é uma IA de análise especializada. Sua função é analisar dados de forma completa e fornecer insights detalhados. NUNCA omita dados ou análises importantes. Sempre forneça conclusões baseadas em evidências concretas.', 
 '["analysis", "data_processing", "insights"]', 1)
AS new_values
ON DUPLICATE KEY UPDATE 
  `description` = new_values.description, 
  `systemPrompt` = new_values.systemPrompt;

-- Templates de Credenciais
INSERT INTO `credentialTemplates` (`service`, `fields`, `instructions`, `isActive`) VALUES
('GitHub', '{"token": "string", "username": "string"}', 
 'Para obter um token do GitHub:\n1. Acesse GitHub.com e faça login\n2. Vá em Settings > Developer settings > Personal access tokens\n3. Clique em "Generate new token"\n4. Selecione os escopos necessários (repo, workflow, etc)\n5. Copie o token gerado', 1)
ON DUPLICATE KEY UPDATE 
  `fields` = '{"token": "string", "username": "string"}',
  `instructions` = 'Para obter um token do GitHub:\n1. Acesse GitHub.com e faça login\n2. Vá em Settings > Developer settings > Personal access tokens\n3. Clique em "Generate new token"\n4. Selecione os escopos necessários (repo, workflow, etc)\n5. Copie o token gerado';

INSERT INTO `credentialTemplates` (`service`, `fields`, `instructions`, `isActive`) VALUES
('Google Drive', '{"clientId": "string", "clientSecret": "string", "refreshToken": "string"}', 
 'Para obter credenciais OAuth2 do Google Drive:\n1. Acesse Google Cloud Console\n2. Crie um novo projeto ou selecione um existente\n3. Ative a API do Google Drive\n4. Crie credenciais OAuth 2.0\n5. Baixe o arquivo de credenciais', 1)
ON DUPLICATE KEY UPDATE 
  `fields` = '{"clientId": "string", "clientSecret": "string", "refreshToken": "string"}',
  `instructions` = 'Para obter credenciais OAuth2 do Google Drive:\n1. Acesse Google Cloud Console\n2. Crie um novo projeto ou selecione um existente\n3. Ative a API do Google Drive\n4. Crie credenciais OAuth 2.0\n5. Baixe o arquivo de credenciais';

INSERT INTO `credentialTemplates` (`service`, `fields`, `instructions`, `isActive`) VALUES
('Gmail', '{"email": "string", "appPassword": "string"}', 
 'Para obter senha de aplicativo do Gmail:\n1. Ative a verificação em duas etapas na sua conta Google\n2. Acesse Conta Google > Segurança > Senhas de app\n3. Selecione "E-mail" e seu dispositivo\n4. Copie a senha gerada', 1)
ON DUPLICATE KEY UPDATE 
  `fields` = '{"email": "string", "appPassword": "string"}',
  `instructions` = 'Para obter senha de aplicativo do Gmail:\n1. Ative a verificação em duas etapas na sua conta Google\n2. Acesse Conta Google > Segurança > Senhas de app\n3. Selecione "E-mail" e seu dispositivo\n4. Copie a senha gerada';

INSERT INTO `credentialTemplates` (`service`, `fields`, `instructions`, `isActive`) VALUES
('OpenAI', '{"apiKey": "string", "organization": "string"}', 
 'Para obter chave de API da OpenAI:\n1. Acesse platform.openai.com\n2. Faça login ou crie uma conta\n3. Vá em API keys\n4. Clique em "Create new secret key"\n5. Copie a chave gerada (não será mostrada novamente)', 1)
ON DUPLICATE KEY UPDATE 
  `fields` = '{"apiKey": "string", "organization": "string"}',
  `instructions` = 'Para obter chave de API da OpenAI:\n1. Acesse platform.openai.com\n2. Faça login ou crie uma conta\n3. Vá em API keys\n4. Clique em "Create new secret key"\n5. Copie a chave gerada (não será mostrada novamente)';

INSERT INTO `credentialTemplates` (`service`, `fields`, `instructions`, `isActive`) VALUES
('Anthropic', '{"apiKey": "string"}', 
 'Para obter chave de API da Anthropic (Claude):\n1. Acesse console.anthropic.com\n2. Faça login ou crie uma conta\n3. Vá em API Keys\n4. Clique em "Create Key"\n5. Copie a chave gerada', 1)
ON DUPLICATE KEY UPDATE 
  `fields` = '{"apiKey": "string"}',
  `instructions` = 'Para obter chave de API da Anthropic (Claude):\n1. Acesse console.anthropic.com\n2. Faça login ou crie uma conta\n3. Vá em API Keys\n4. Clique em "Create Key"\n5. Copie a chave gerada';

INSERT INTO `credentialTemplates` (`service`, `fields`, `instructions`, `isActive`) VALUES
('Google Sheets', '{"clientId": "string", "clientSecret": "string", "refreshToken": "string"}', 
 'Para obter credenciais OAuth2 do Google Sheets:\n1. Acesse Google Cloud Console\n2. Crie um novo projeto ou selecione um existente\n3. Ative a API do Google Sheets\n4. Crie credenciais OAuth 2.0\n5. Baixe o arquivo de credenciais', 1)
ON DUPLICATE KEY UPDATE 
  `fields` = '{"clientId": "string", "clientSecret": "string", "refreshToken": "string"}',
  `instructions` = 'Para obter credenciais OAuth2 do Google Sheets:\n1. Acesse Google Cloud Console\n2. Crie um novo projeto ou selecione um existente\n3. Ative a API do Google Sheets\n4. Crie credenciais OAuth 2.0\n5. Baixe o arquivo de credenciais';

INSERT INTO `credentialTemplates` (`service`, `fields`, `instructions`, `isActive`) VALUES
('Notion', '{"integrationToken": "string"}', 
 'Para obter token de integração do Notion:\n1. Acesse www.notion.so/my-integrations\n2. Clique em "New integration"\n3. Configure as permissões necessárias\n4. Copie o Internal Integration Token', 1)
ON DUPLICATE KEY UPDATE 
  `fields` = '{"integrationToken": "string"}',
  `instructions` = 'Para obter token de integração do Notion:\n1. Acesse www.notion.so/my-integrations\n2. Clique em "New integration"\n3. Configure as permissões necessárias\n4. Copie o Internal Integration Token';

INSERT INTO `credentialTemplates` (`service`, `fields`, `instructions`, `isActive`) VALUES
('Slack', '{"botToken": "string", "appToken": "string"}', 
 'Para obter tokens do Slack:\n1. Acesse api.slack.com/apps\n2. Crie um novo app ou selecione um existente\n3. Em "OAuth & Permissions", copie o Bot User OAuth Token\n4. Em "Basic Information", gere e copie o App-Level Token', 1)
ON DUPLICATE KEY UPDATE 
  `fields` = '{"botToken": "string", "appToken": "string"}',
  `instructions` = 'Para obter tokens do Slack:\n1. Acesse api.slack.com/apps\n2. Crie um novo app ou selecione um existente\n3. Em "OAuth & Permissions", copie o Bot User OAuth Token\n4. Em "Basic Information", gere e copie o App-Level Token';

INSERT INTO `credentialTemplates` (`service`, `fields`, `instructions`, `isActive`) VALUES
('Discord', '{"botToken": "string"}', 
 'Para obter token de bot do Discord:\n1. Acesse discord.com/developers/applications\n2. Crie uma nova aplicação\n3. Vá em "Bot" e clique em "Add Bot"\n4. Copie o token do bot\n5. Configure as permissões necessárias', 1)
ON DUPLICATE KEY UPDATE 
  `fields` = '{"botToken": "string"}',
  `instructions` = 'Para obter token de bot do Discord:\n1. Acesse discord.com/developers/applications\n2. Crie uma nova aplicação\n3. Vá em "Bot" e clique em "Add Bot"\n4. Copie o token do bot\n5. Configure as permissões necessárias';

-- ==================================================
-- FIM DO SCHEMA
-- ==================================================
