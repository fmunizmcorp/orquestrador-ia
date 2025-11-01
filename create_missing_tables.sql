-- puppeteerSessions
CREATE TABLE IF NOT EXISTS puppeteerSessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  sessionName VARCHAR(255) NOT NULL,
  status ENUM('active', 'idle', 'closed') DEFAULT 'idle',
  browserContext JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_userId (userId),
  INDEX idx_status (status),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- puppeteerResults
CREATE TABLE IF NOT EXISTS puppeteerResults (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sessionId INT NOT NULL,
  taskId INT,
  actionType VARCHAR(100),
  url VARCHAR(500),
  screenshot TEXT,
  htmlContent LONGTEXT,
  extractedData JSON,
  status ENUM('success', 'failed', 'partial') DEFAULT 'success',
  errorMessage TEXT,
  executionTime INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sessionId (sessionId),
  INDEX idx_taskId (taskId),
  FOREIGN KEY (sessionId) REFERENCES puppeteerSessions(id) ON DELETE CASCADE,
  FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE SET NULL
);

-- taskDependencies
CREATE TABLE IF NOT EXISTS taskDependencies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  taskId INT NOT NULL,
  dependsOnTaskId INT NOT NULL,
  dependencyType ENUM('blocking', 'informative', 'optional') DEFAULT 'blocking',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_taskId (taskId),
  INDEX idx_dependsOnTaskId (dependsOnTaskId),
  FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (dependsOnTaskId) REFERENCES tasks(id) ON DELETE CASCADE
);

-- orchestrationLogs
CREATE TABLE IF NOT EXISTS orchestrationLogs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  taskId INT NOT NULL,
  orchestrationStep VARCHAR(255),
  stepStatus ENUM('started', 'in_progress', 'completed', 'failed', 'skipped') DEFAULT 'started',
  modelId INT,
  inputData JSON,
  outputData JSON,
  errorMessage TEXT,
  executionTime INT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_taskId (taskId),
  INDEX idx_modelId (modelId),
  INDEX idx_stepStatus (stepStatus),
  FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (modelId) REFERENCES aiModels(id) ON DELETE SET NULL
);

-- crossValidations
CREATE TABLE IF NOT EXISTS crossValidations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  taskId INT NOT NULL,
  primaryModelId INT NOT NULL,
  validatorModelId INT NOT NULL,
  primaryResult JSON,
  validatorResult JSON,
  agreementScore DECIMAL(5,2),
  discrepancies JSON,
  finalDecision ENUM('primary', 'validator', 'manual_review', 'merged') DEFAULT 'primary',
  reviewedBy INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_taskId (taskId),
  INDEX idx_primaryModelId (primaryModelId),
  FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (primaryModelId) REFERENCES aiModels(id) ON DELETE CASCADE,
  FOREIGN KEY (validatorModelId) REFERENCES aiModels(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewedBy) REFERENCES users(id) ON DELETE SET NULL
);

-- hallucinationDetections
CREATE TABLE IF NOT EXISTS hallucinationDetections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  taskId INT NOT NULL,
  modelId INT NOT NULL,
  detectedContent TEXT,
  detectionMethod VARCHAR(100),
  confidenceScore DECIMAL(5,2),
  context JSON,
  isConfirmed BOOLEAN DEFAULT FALSE,
  reviewedBy INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_taskId (taskId),
  INDEX idx_modelId (modelId),
  FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (modelId) REFERENCES aiModels(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewedBy) REFERENCES users(id) ON DELETE SET NULL
);

-- executionResults
CREATE TABLE IF NOT EXISTS executionResults (
  id INT PRIMARY KEY AUTO_INCREMENT,
  taskId INT NOT NULL,
  subtaskId INT,
  modelId INT NOT NULL,
  inputTokens INT DEFAULT 0,
  outputTokens INT DEFAULT 0,
  totalTokens INT DEFAULT 0,
  executionTime INT,
  cost DECIMAL(10,6),
  status ENUM('success', 'failed', 'partial', 'timeout') DEFAULT 'success',
  resultData JSON,
  errorDetails TEXT,
  qualityScore DECIMAL(5,2),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_taskId (taskId),
  INDEX idx_subtaskId (subtaskId),
  INDEX idx_modelId (modelId),
  FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (subtaskId) REFERENCES subtasks(id) ON DELETE CASCADE,
  FOREIGN KEY (modelId) REFERENCES aiModels(id) ON DELETE CASCADE
);

-- messageAttachments
CREATE TABLE IF NOT EXISTS messageAttachments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  messageId INT NOT NULL,
  fileName VARCHAR(255) NOT NULL,
  fileType VARCHAR(100),
  fileSize BIGINT,
  filePath VARCHAR(500),
  url VARCHAR(500),
  metadata JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_messageId (messageId),
  FOREIGN KEY (messageId) REFERENCES chatMessages(id) ON DELETE CASCADE
);

-- messageReactions
CREATE TABLE IF NOT EXISTS messageReactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  messageId INT NOT NULL,
  userId INT NOT NULL,
  reactionType VARCHAR(50) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_messageId (messageId),
  INDEX idx_userId (userId),
  UNIQUE KEY unique_user_message_reaction (messageId, userId, reactionType),
  FOREIGN KEY (messageId) REFERENCES chatMessages(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- systemMetrics
CREATE TABLE IF NOT EXISTS systemMetrics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  metricType VARCHAR(100) NOT NULL,
  metricValue DECIMAL(15,6),
  unit VARCHAR(50),
  metadata JSON,
  recordedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_metricType (metricType),
  INDEX idx_recordedAt (recordedAt)
);

-- apiUsage
CREATE TABLE IF NOT EXISTS apiUsage (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  providerId INT,
  modelId INT,
  endpoint VARCHAR(255),
  method VARCHAR(10),
  requestTokens INT DEFAULT 0,
  responseTokens INT DEFAULT 0,
  totalTokens INT DEFAULT 0,
  cost DECIMAL(10,6),
  responseTime INT,
  statusCode INT,
  errorMessage TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_userId (userId),
  INDEX idx_providerId (providerId),
  INDEX idx_modelId (modelId),
  INDEX idx_timestamp (timestamp),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (providerId) REFERENCES aiProviders(id) ON DELETE SET NULL,
  FOREIGN KEY (modelId) REFERENCES aiModels(id) ON DELETE SET NULL
);

-- errorLogs
CREATE TABLE IF NOT EXISTS errorLogs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT,
  errorType VARCHAR(100),
  errorMessage TEXT,
  stackTrace TEXT,
  context JSON,
  severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  isResolved BOOLEAN DEFAULT FALSE,
  resolvedBy INT,
  resolvedAt TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_userId (userId),
  INDEX idx_errorType (errorType),
  INDEX idx_severity (severity),
  INDEX idx_createdAt (createdAt),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (resolvedBy) REFERENCES users(id) ON DELETE SET NULL
);

-- auditLogs
CREATE TABLE IF NOT EXISTS auditLogs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  action VARCHAR(255) NOT NULL,
  entityType VARCHAR(100),
  entityId INT,
  changes JSON,
  ipAddress VARCHAR(45),
  userAgent TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_userId (userId),
  INDEX idx_action (action),
  INDEX idx_entityType (entityType),
  INDEX idx_timestamp (timestamp),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- oauthTokens
CREATE TABLE IF NOT EXISTS oauthTokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  provider VARCHAR(100) NOT NULL,
  accessToken TEXT NOT NULL,
  refreshToken TEXT,
  tokenType VARCHAR(50) DEFAULT 'Bearer',
  expiresAt TIMESTAMP,
  scope TEXT,
  metadata JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_userId (userId),
  INDEX idx_provider (provider),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- apiCredentials
CREATE TABLE IF NOT EXISTS apiCredentials (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  credentialName VARCHAR(255) NOT NULL,
  provider VARCHAR(100),
  apiKey TEXT,
  apiSecret TEXT,
  additionalConfig JSON,
  isActive BOOLEAN DEFAULT TRUE,
  lastUsedAt TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_userId (userId),
  INDEX idx_provider (provider),
  INDEX idx_isActive (isActive),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
