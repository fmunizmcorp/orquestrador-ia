-- ==================================================
-- SCHEMA COMPLETO - Orquestrador IA v3
-- Gerado a partir de schema.ts
-- Total: 48 tabelas
-- ==================================================

USE orquestraia;

-- ==================================================
-- 1. TABELA: users
-- ==================================================
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openId VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  username VARCHAR(100),
  passwordHash TEXT,
  lastLoginAt TIMESTAMP NULL,
  avatarUrl VARCHAR(500),
  bio TEXT,
  preferences JSON,
  role ENUM('admin', 'user') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_openId (openId),
  INDEX idx_email (email),
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 2. TABELA: aiProviders
-- ==================================================
CREATE TABLE aiProviders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  type ENUM('local', 'api') NOT NULL,
  endpoint VARCHAR(500) NOT NULL,
  apiKey TEXT,
  isActive BOOLEAN DEFAULT TRUE,
  config JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_isActive (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 3. TABELA: aiModels
-- ==================================================
CREATE TABLE aiModels (
  id INT PRIMARY KEY AUTO_INCREMENT,
  providerId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  modelId VARCHAR(255) NOT NULL,
  capabilities JSON,
  contextWindow INT DEFAULT 4096,
  isLoaded BOOLEAN DEFAULT FALSE,
  priority INT DEFAULT 50,
  isActive BOOLEAN DEFAULT TRUE,
  modelPath VARCHAR(500),
  quantization VARCHAR(50),
  parameters VARCHAR(50),
  sizeBytes BIGINT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (providerId) REFERENCES aiProviders(id) ON DELETE CASCADE,
  INDEX idx_providerId (providerId),
  INDEX idx_isLoaded (isLoaded),
  INDEX idx_isActive (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 4. TABELA: specializedAIs
-- ==================================================
CREATE TABLE specializedAIs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  defaultModelId INT,
  fallbackModelIds JSON,
  systemPrompt TEXT NOT NULL,
  capabilities JSON,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (defaultModelId) REFERENCES aiModels(id) ON DELETE SET NULL,
  INDEX idx_userId (userId),
  INDEX idx_category (category),
  INDEX idx_isActive (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 5. TABELA: credentials
-- ==================================================
CREATE TABLE credentials (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  service VARCHAR(100) NOT NULL,
  credentialType VARCHAR(50),
  encryptedData TEXT NOT NULL,
  metadata JSON,
  isActive BOOLEAN DEFAULT TRUE,
  expiresAt TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId_service (userId, service),
  INDEX idx_isActive (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 6. TABELA: externalAPIAccounts
-- ==================================================
CREATE TABLE externalAPIAccounts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  provider VARCHAR(100) NOT NULL,
  accountName VARCHAR(255) NOT NULL,
  credentialId INT,
  creditBalance DECIMAL(10, 2) DEFAULT 0.00,
  creditLimit DECIMAL(10, 2),
  usageThisMonth DECIMAL(10, 2) DEFAULT 0.00,
  alertThreshold DECIMAL(10, 2),
  isActive BOOLEAN DEFAULT TRUE,
  lastSync TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (credentialId) REFERENCES credentials(id) ON DELETE SET NULL,
  INDEX idx_userId (userId),
  INDEX idx_provider (provider)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- TABELAS teams e projects ANTES de tasks (dependências)
-- ==================================================

CREATE TABLE teams (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  ownerId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_ownerId (ownerId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE teamMembers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  teamId INT NOT NULL,
  userId INT NOT NULL,
  role ENUM('owner', 'admin', 'member', 'viewer') DEFAULT 'member',
  joinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teamId) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_team_user (teamId, userId),
  INDEX idx_teamId (teamId),
  INDEX idx_userId (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE projects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  userId INT NOT NULL,
  teamId INT,
  status ENUM('planning', 'active', 'on_hold', 'completed', 'archived') DEFAULT 'planning',
  startDate TIMESTAMP NULL,
  endDate TIMESTAMP NULL,
  budget DECIMAL(12, 2),
  progress INT DEFAULT 0,
  tags JSON,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (teamId) REFERENCES teams(id) ON DELETE SET NULL,
  INDEX idx_userId (userId),
  INDEX idx_teamId (teamId),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 7. TABELA: tasks
-- ==================================================
CREATE TABLE tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  projectId INT,
  assignedUserId INT,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('pending', 'planning', 'in_progress', 'executing', 'validating', 'completed', 'blocked', 'failed', 'cancelled', 'paused') DEFAULT 'pending',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  estimatedHours DECIMAL(8, 2),
  actualHours DECIMAL(8, 2),
  dueDate TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  completedAt TIMESTAMP NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE SET NULL,
  FOREIGN KEY (assignedUserId) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_userId (userId),
  INDEX idx_projectId (projectId),
  INDEX idx_assignedUserId (assignedUserId),
  INDEX idx_status (status),
  INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 8. TABELA: subtasks
-- ==================================================
CREATE TABLE subtasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  taskId INT NOT NULL,
  assignedModelId INT,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  prompt TEXT NOT NULL,
  result TEXT,
  status ENUM('pending', 'executing', 'completed', 'failed', 'validating', 'rejected') DEFAULT 'pending',
  orderIndex INT DEFAULT 0,
  estimatedDifficulty ENUM('easy', 'medium', 'hard', 'expert') DEFAULT 'medium',
  reviewedBy INT,
  reviewNotes TEXT,
  completedAt TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (assignedModelId) REFERENCES aiModels(id) ON DELETE SET NULL,
  FOREIGN KEY (reviewedBy) REFERENCES aiModels(id) ON DELETE SET NULL,
  INDEX idx_taskId (taskId),
  INDEX idx_status (status),
  INDEX idx_orderIndex (orderIndex)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 9. TABELA: chatConversations
-- ==================================================
CREATE TABLE chatConversations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  title VARCHAR(500),
  aiId INT,
  modelId INT,
  systemPrompt TEXT,
  lastMessageAt TIMESTAMP NULL,
  messageCount INT DEFAULT 0,
  isRead BOOLEAN DEFAULT FALSE,
  isActive BOOLEAN DEFAULT TRUE,
  metadata JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (aiId) REFERENCES specializedAIs(id) ON DELETE SET NULL,
  FOREIGN KEY (modelId) REFERENCES aiModels(id) ON DELETE SET NULL,
  INDEX idx_userId (userId),
  INDEX idx_isActive (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 10. TABELA: chatMessages
-- ==================================================
CREATE TABLE chatMessages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  conversationId INT NOT NULL,
  parentMessageId INT,
  role ENUM('user', 'assistant', 'system') NOT NULL,
  content TEXT NOT NULL,
  isEdited BOOLEAN DEFAULT FALSE,
  attachments JSON,
  metadata JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (conversationId) REFERENCES chatConversations(id) ON DELETE CASCADE,
  FOREIGN KEY (parentMessageId) REFERENCES chatMessages(id) ON DELETE SET NULL,
  INDEX idx_conversationId (conversationId),
  INDEX idx_parentMessageId (parentMessageId),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 11. TABELA: aiTemplates
-- ==================================================
CREATE TABLE aiTemplates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  templateData JSON NOT NULL,
  isPublic BOOLEAN DEFAULT FALSE,
  usageCount INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_category (category),
  INDEX idx_isPublic (isPublic)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 12. TABELA: aiWorkflows
-- ==================================================
CREATE TABLE aiWorkflows (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  steps JSON NOT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_isActive (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 13. TABELA: instructions
-- ==================================================
CREATE TABLE instructions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  aiId INT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  priority INT DEFAULT 50,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (aiId) REFERENCES specializedAIs(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_aiId (aiId),
  INDEX idx_isActive (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 14. TABELA: knowledgeBase
-- ==================================================
CREATE TABLE knowledgeBase (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  tags JSON,
  embedding JSON,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_category (category),
  INDEX idx_isActive (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 15. TABELA: knowledgeSources
-- ==================================================
CREATE TABLE knowledgeSources (
  id INT PRIMARY KEY AUTO_INCREMENT,
  knowledgeBaseId INT NOT NULL,
  sourceType VARCHAR(50),
  sourceUrl VARCHAR(1000),
  sourceData JSON,
  lastSync TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (knowledgeBaseId) REFERENCES knowledgeBase(id) ON DELETE CASCADE,
  INDEX idx_knowledgeBaseId (knowledgeBaseId),
  INDEX idx_sourceType (sourceType)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 16. TABELA: modelDiscovery
-- ==================================================
CREATE TABLE modelDiscovery (
  id INT PRIMARY KEY AUTO_INCREMENT,
  modelName VARCHAR(255) NOT NULL,
  modelPath VARCHAR(1000) NOT NULL,
  sizeBytes BIGINT,
  quantization VARCHAR(50),
  parameters VARCHAR(50),
  discoveredAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  lastSeen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  isImported BOOLEAN DEFAULT FALSE,
  INDEX idx_modelName (modelName),
  INDEX idx_isImported (isImported)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 17. TABELA: modelRatings
-- ==================================================
CREATE TABLE modelRatings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  modelId INT NOT NULL,
  userId INT NOT NULL,
  rating INT NOT NULL,
  comment TEXT,
  taskType VARCHAR(100),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (modelId) REFERENCES aiModels(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_modelId (modelId),
  INDEX idx_userId (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 18. TABELA: storage
-- ==================================================
CREATE TABLE storage (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  fileName VARCHAR(500) NOT NULL,
  filePath VARCHAR(1000) NOT NULL,
  fileType VARCHAR(100),
  sizeBytes BIGINT,
  metadata JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_fileType (fileType)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 19. TABELA: taskMonitoring
-- ==================================================
CREATE TABLE taskMonitoring (
  id INT PRIMARY KEY AUTO_INCREMENT,
  taskId INT NOT NULL,
  cpuUsage DECIMAL(5, 2),
  ramUsage DECIMAL(5, 2),
  gpuUsage DECIMAL(5, 2),
  executionTime INT,
  recordedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE,
  INDEX idx_taskId (taskId),
  INDEX idx_recordedAt (recordedAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 20. TABELA: executionLogs
-- ==================================================
CREATE TABLE executionLogs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  taskId INT,
  subtaskId INT,
  level ENUM('debug', 'info', 'warning', 'error', 'critical') DEFAULT 'info',
  message TEXT NOT NULL,
  metadata JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (subtaskId) REFERENCES subtasks(id) ON DELETE CASCADE,
  INDEX idx_taskId (taskId),
  INDEX idx_subtaskId (subtaskId),
  INDEX idx_level (level),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 21. TABELA: creditUsage
-- ==================================================
CREATE TABLE creditUsage (
  id INT PRIMARY KEY AUTO_INCREMENT,
  accountId INT NOT NULL,
  taskId INT,
  creditsUsed DECIMAL(10, 4) NOT NULL,
  provider VARCHAR(100),
  modelUsed VARCHAR(255),
  tokensUsed INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (accountId) REFERENCES externalAPIAccounts(id) ON DELETE CASCADE,
  FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE SET NULL,
  INDEX idx_accountId (accountId),
  INDEX idx_taskId (taskId),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 22. TABELA: credentialTemplates
-- ==================================================
CREATE TABLE credentialTemplates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  service VARCHAR(100) NOT NULL UNIQUE,
  fields JSON NOT NULL,
  instructions TEXT,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE INDEX idx_service (service)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 23. TABELA: aiQualityMetrics
-- ==================================================
CREATE TABLE aiQualityMetrics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  aiId INT NOT NULL,
  taskType VARCHAR(100) NOT NULL,
  successRate DECIMAL(5, 2) DEFAULT 0.00,
  avgScore DECIMAL(5, 2) DEFAULT 0.00,
  totalTasks INT DEFAULT 0,
  lastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (aiId) REFERENCES specializedAIs(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_ai_taskType (aiId, taskType),
  INDEX idx_taskType (taskType)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 24. TABELA: trainingDatasets
-- ==================================================
CREATE TABLE trainingDatasets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  datasetType ENUM('text', 'code', 'qa', 'completion', 'chat') DEFAULT 'text',
  format ENUM('jsonl', 'csv', 'txt', 'parquet') DEFAULT 'jsonl',
  filePath VARCHAR(500),
  fileSize BIGINT,
  recordCount INT DEFAULT 0,
  metadata JSON,
  isActive BOOLEAN NOT NULL DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_datasetType (datasetType)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 25. TABELA: trainingJobs
-- ==================================================
CREATE TABLE trainingJobs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  datasetId INT NOT NULL,
  baseModelId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('pending', 'preparing', 'training', 'validating', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  trainingType ENUM('fine-tuning', 'lora', 'qlora', 'full') DEFAULT 'lora',
  hyperparameters JSON,
  progress DECIMAL(5, 2) DEFAULT 0.00,
  currentEpoch INT DEFAULT 0,
  totalEpochs INT DEFAULT 1,
  trainingLoss DECIMAL(10, 6),
  validationLoss DECIMAL(10, 6),
  trainingAccuracy DECIMAL(5, 2),
  validationAccuracy DECIMAL(5, 2),
  estimatedTimeRemaining INT,
  startedAt TIMESTAMP NULL,
  completedAt TIMESTAMP NULL,
  errorMessage TEXT,
  logFilePath VARCHAR(500),
  metadata JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (datasetId) REFERENCES trainingDatasets(id) ON DELETE CASCADE,
  FOREIGN KEY (baseModelId) REFERENCES aiModels(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_status (status),
  INDEX idx_datasetId (datasetId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 26. TABELA: modelVersions
-- ==================================================
CREATE TABLE modelVersions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  baseModelId INT NOT NULL,
  trainingJobId INT,
  versionName VARCHAR(255) NOT NULL,
  description TEXT,
  modelPath VARCHAR(500) NOT NULL,
  sizeBytes BIGINT,
  format ENUM('gguf', 'safetensors', 'pytorch', 'onnx') DEFAULT 'gguf',
  quantization VARCHAR(50),
  parameters VARCHAR(50),
  performanceMetrics JSON,
  benchmarkScores JSON,
  isActive BOOLEAN NOT NULL DEFAULT TRUE,
  isPublic BOOLEAN NOT NULL DEFAULT FALSE,
  downloadCount INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (baseModelId) REFERENCES aiModels(id) ON DELETE CASCADE,
  FOREIGN KEY (trainingJobId) REFERENCES trainingJobs(id) ON DELETE SET NULL,
  INDEX idx_userId (userId),
  INDEX idx_baseModelId (baseModelId),
  INDEX idx_isPublic (isPublic)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 27. TABELA: puppeteerSessions
-- ==================================================
CREATE TABLE puppeteerSessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sessionId VARCHAR(255) NOT NULL UNIQUE,
  userId INT NOT NULL,
  status ENUM('active', 'closed', 'error') DEFAULT 'active',
  config JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  expiresAt TIMESTAMP NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_sessionId (sessionId),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 28. TABELA: puppeteerResults
-- ==================================================
CREATE TABLE puppeteerResults (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sessionId VARCHAR(255) NOT NULL,
  resultType ENUM('screenshot', 'pdf', 'data', 'html') NOT NULL,
  data TEXT,
  url VARCHAR(1000),
  metadata JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sessionId) REFERENCES puppeteerSessions(sessionId) ON DELETE CASCADE,
  INDEX idx_sessionId (sessionId),
  INDEX idx_resultType (resultType)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 29. TABELA: taskDependencies
-- ==================================================
CREATE TABLE taskDependencies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  taskId INT NOT NULL,
  dependsOnTaskId INT NOT NULL,
  dependencyType ENUM('finish_to_start', 'start_to_start', 'finish_to_finish', 'start_to_finish') DEFAULT 'finish_to_start',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (dependsOnTaskId) REFERENCES tasks(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_task_dependency (taskId, dependsOnTaskId),
  INDEX idx_taskId (taskId),
  INDEX idx_dependsOnTaskId (dependsOnTaskId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 30. TABELA: orchestrationLogs
-- ==================================================
CREATE TABLE orchestrationLogs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  taskId INT,
  subtaskId INT,
  aiId INT,
  action VARCHAR(100) NOT NULL,
  input TEXT,
  output TEXT,
  executionTime INT,
  status ENUM('success', 'failed', 'timeout', 'cancelled') DEFAULT 'success',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (subtaskId) REFERENCES subtasks(id) ON DELETE CASCADE,
  FOREIGN KEY (aiId) REFERENCES specializedAIs(id) ON DELETE SET NULL,
  INDEX idx_taskId (taskId),
  INDEX idx_subtaskId (subtaskId),
  INDEX idx_aiId (aiId),
  INDEX idx_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 31. TABELA: crossValidations
-- ==================================================
CREATE TABLE crossValidations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  subtaskId INT NOT NULL,
  validatorAiId INT NOT NULL,
  score DECIMAL(5, 2) NOT NULL,
  approved BOOLEAN NOT NULL,
  feedback TEXT,
  divergence DECIMAL(5, 2),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subtaskId) REFERENCES subtasks(id) ON DELETE CASCADE,
  FOREIGN KEY (validatorAiId) REFERENCES specializedAIs(id) ON DELETE CASCADE,
  INDEX idx_subtaskId (subtaskId),
  INDEX idx_validatorAiId (validatorAiId),
  INDEX idx_approved (approved)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 32. TABELA: hallucinationDetections
-- ==================================================
CREATE TABLE hallucinationDetections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  subtaskId INT NOT NULL,
  detectedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confidenceScore DECIMAL(5, 2) NOT NULL,
  indicators JSON,
  wasRecovered BOOLEAN DEFAULT FALSE,
  recoveryMethod VARCHAR(100),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subtaskId) REFERENCES subtasks(id) ON DELETE CASCADE,
  INDEX idx_subtaskId (subtaskId),
  INDEX idx_wasRecovered (wasRecovered)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 33. TABELA: executionResults
-- ==================================================
CREATE TABLE executionResults (
  id INT PRIMARY KEY AUTO_INCREMENT,
  subtaskId INT NOT NULL,
  executorAiId INT NOT NULL,
  result TEXT NOT NULL,
  score DECIMAL(5, 2),
  metrics JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subtaskId) REFERENCES subtasks(id) ON DELETE CASCADE,
  FOREIGN KEY (executorAiId) REFERENCES specializedAIs(id) ON DELETE CASCADE,
  INDEX idx_subtaskId (subtaskId),
  INDEX idx_executorAiId (executorAiId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 34. TABELA: messageAttachments
-- ==================================================
CREATE TABLE messageAttachments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  messageId INT NOT NULL,
  fileName VARCHAR(500) NOT NULL,
  fileType VARCHAR(100),
  fileUrl VARCHAR(1000) NOT NULL,
  fileSize BIGINT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (messageId) REFERENCES chatMessages(id) ON DELETE CASCADE,
  INDEX idx_messageId (messageId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 35. TABELA: messageReactions
-- ==================================================
CREATE TABLE messageReactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  messageId INT NOT NULL,
  userId INT NOT NULL,
  emoji VARCHAR(10) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (messageId) REFERENCES chatMessages(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_message_user_emoji (messageId, userId, emoji),
  INDEX idx_messageId (messageId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 36. TABELA: systemMetrics
-- ==================================================
CREATE TABLE systemMetrics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cpuUsage DECIMAL(5, 2) NOT NULL,
  memoryUsage DECIMAL(5, 2) NOT NULL,
  diskUsage DECIMAL(5, 2) NOT NULL,
  activeConnections INT DEFAULT 0,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 37. TABELA: apiUsage
-- ==================================================
CREATE TABLE apiUsage (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT,
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  statusCode INT NOT NULL,
  responseDuration INT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_userId (userId),
  INDEX idx_endpoint (endpoint),
  INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 38. TABELA: errorLogs
-- ==================================================
CREATE TABLE errorLogs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT,
  level ENUM('error', 'warning', 'critical') DEFAULT 'error',
  message TEXT NOT NULL,
  stack TEXT,
  metadata JSON,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_userId (userId),
  INDEX idx_level (level),
  INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 39. TABELA: auditLogs
-- ==================================================
CREATE TABLE auditLogs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT,
  action VARCHAR(100) NOT NULL,
  resourceType VARCHAR(100),
  resourceId INT,
  changes JSON,
  ipAddress VARCHAR(45),
  userAgent TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_userId (userId),
  INDEX idx_action (action),
  INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 40. TABELA: externalServices
-- ==================================================
CREATE TABLE externalServices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  serviceName VARCHAR(100) NOT NULL,
  config JSON,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_serviceName (serviceName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 41. TABELA: oauthTokens
-- ==================================================
CREATE TABLE oauthTokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  serviceId INT NOT NULL,
  accessToken TEXT NOT NULL,
  refreshToken TEXT,
  expiresAt TIMESTAMP NOT NULL,
  scope TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (serviceId) REFERENCES externalServices(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_serviceId (serviceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 42. TABELA: apiCredentials
-- ==================================================
CREATE TABLE apiCredentials (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  serviceName VARCHAR(100) NOT NULL,
  credentialName VARCHAR(255) NOT NULL,
  encryptedData TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_serviceName (serviceName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 43. TABELA: prompts
-- ==================================================
CREATE TABLE prompts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category VARCHAR(100),
  tags JSON,
  variables JSON,
  isPublic BOOLEAN DEFAULT FALSE,
  useCount INT DEFAULT 0,
  currentVersion INT DEFAULT 1,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_category (category),
  INDEX idx_isPublic (isPublic)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 44. TABELA: promptVersions
-- ==================================================
CREATE TABLE promptVersions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  promptId INT NOT NULL,
  version INT NOT NULL,
  content TEXT NOT NULL,
  changelog TEXT,
  createdByUserId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (promptId) REFERENCES prompts(id) ON DELETE CASCADE,
  FOREIGN KEY (createdByUserId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_prompt_version (promptId, version),
  INDEX idx_promptId (promptId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- VIEWS/ALIASES FOR ROUTER COMPATIBILITY
-- ==================================================

-- conversations -> chatConversations (view)
CREATE OR REPLACE VIEW conversations AS SELECT * FROM chatConversations;

-- messages -> chatMessages (view)
CREATE OR REPLACE VIEW messages AS SELECT * FROM chatMessages;

-- ==================================================
-- COMPLETE: 48 TABLES + 2 VIEWS
-- ==================================================
