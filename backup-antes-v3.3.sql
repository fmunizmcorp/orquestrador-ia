-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: orquestraia
-- ------------------------------------------------------
-- Server version	8.0.43-0ubuntu0.24.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `aiModels`
--

DROP TABLE IF EXISTS `aiModels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aiModels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `providerId` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `modelId` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `capabilities` json DEFAULT NULL COMMENT 'Array de capacidades: ["text", "code", "reasoning"]',
  `contextWindow` int DEFAULT '4096',
  `isLoaded` tinyint(1) DEFAULT '0',
  `priority` int DEFAULT '50' COMMENT 'Prioridade 0-100',
  `isActive` tinyint(1) DEFAULT '1',
  `modelPath` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantization` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ex: Q4_K_M, Q5_K_S',
  `parameters` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ex: 7B, 13B, 70B',
  `sizeBytes` bigint DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_providerId` (`providerId`),
  KEY `idx_isLoaded` (`isLoaded`),
  KEY `idx_isActive` (`isActive`),
  CONSTRAINT `aiModels_providerId_aiProviders_id_fk` FOREIGN KEY (`providerId`) REFERENCES `aiProviders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aiModels`
--

LOCK TABLES `aiModels` WRITE;
/*!40000 ALTER TABLE `aiModels` DISABLE KEYS */;
INSERT INTO `aiModels` VALUES (1,5,'Llama 3.1 8B','llama-3.1-8b-instruct','[\"text\", \"code\", \"chat\"]',32768,0,50,1,NULL,NULL,'8B',NULL,'2025-10-28 23:21:57','2025-10-28 23:21:57'),(2,5,'Mistral 7B','mistral-7b-instruct','[\"text\", \"code\", \"chat\"]',8192,0,50,1,NULL,NULL,'7B',NULL,'2025-10-28 23:21:57','2025-10-28 23:21:57'),(3,5,'Phi-3 Mini','phi-3-mini-4k-instruct','[\"text\", \"code\", \"chat\"]',4096,0,50,1,NULL,NULL,'3B',NULL,'2025-10-28 23:21:57','2025-10-28 23:21:57'),(4,6,'GPT-4 Turbo','gpt-4-turbo-preview','[\"text\", \"code\", \"chat\", \"reasoning\"]',128000,0,50,1,NULL,NULL,'1T',NULL,'2025-10-28 23:21:57','2025-10-28 23:21:57'),(5,6,'GPT-3.5 Turbo','gpt-3.5-turbo','[\"text\", \"code\", \"chat\"]',16385,0,50,1,NULL,NULL,'Unknown',NULL,'2025-10-28 23:21:57','2025-10-28 23:21:57'),(6,7,'Claude 3 Opus','claude-3-opus-20240229','[\"text\", \"code\", \"chat\", \"reasoning\"]',200000,0,50,1,NULL,NULL,'Unknown',NULL,'2025-10-28 23:21:57','2025-10-28 23:21:57'),(7,7,'Claude 3 Sonnet','claude-3-sonnet-20240229','[\"text\", \"code\", \"chat\", \"reasoning\"]',200000,0,50,1,NULL,NULL,'Unknown',NULL,'2025-10-28 23:21:57','2025-10-28 23:21:57'),(8,7,'Claude 3 Haiku','claude-3-haiku-20240307','[\"text\", \"code\", \"chat\"]',200000,0,50,1,NULL,NULL,'Unknown',NULL,'2025-10-28 23:21:57','2025-10-28 23:21:57'),(9,8,'Gemini 1.5 Pro','gemini-1.5-pro','[\"text\", \"code\", \"chat\", \"multimodal\"]',1000000,0,50,1,NULL,NULL,'Unknown',NULL,'2025-10-28 23:21:57','2025-10-28 23:21:57'),(10,8,'Gemini 1.5 Flash','gemini-1.5-flash','[\"text\", \"code\", \"chat\", \"multimodal\"]',1000000,0,50,1,NULL,NULL,'Unknown',NULL,'2025-10-28 23:21:57','2025-10-28 23:21:57'),(11,9,'Mistral Large','mistral-large-latest','[\"text\", \"code\", \"chat\"]',32768,0,50,1,NULL,NULL,'Unknown',NULL,'2025-10-28 23:21:57','2025-10-28 23:21:57'),(12,9,'Mixtral 8x7B','mixtral-8x7b-instruct-v0.1','[\"text\", \"code\", \"chat\"]',32768,0,50,1,NULL,NULL,'8x7B',NULL,'2025-10-28 23:21:57','2025-10-28 23:21:57');
/*!40000 ALTER TABLE `aiModels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aiProviders`
--

DROP TABLE IF EXISTS `aiProviders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aiProviders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('local','api') COLLATE utf8mb4_unicode_ci NOT NULL,
  `endpoint` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apiKey` text COLLATE utf8mb4_unicode_ci,
  `isActive` tinyint(1) DEFAULT '1',
  `config` json DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_isActive` (`isActive`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aiProviders`
--

LOCK TABLES `aiProviders` WRITE;
/*!40000 ALTER TABLE `aiProviders` DISABLE KEYS */;
INSERT INTO `aiProviders` VALUES (1,'LM Studio Local','local','http://localhost:1234/v1',NULL,1,'{\"description\": \"Servidor local LM Studio\", \"maxConcurrent\": 1}','2025-10-28 22:14:48','2025-10-28 22:14:48'),(2,'LM Studio Local','local','http://localhost:1234/v1',NULL,1,'{\"description\": \"Servidor local LM Studio\", \"maxConcurrent\": 1}','2025-10-28 22:20:29','2025-10-28 22:20:29'),(3,'LM Studio Local','local','http://localhost:1234/v1',NULL,1,'{\"description\": \"Servidor local LM Studio\", \"maxConcurrent\": 1}','2025-10-28 22:25:33','2025-10-28 22:25:33'),(4,'LM Studio Local','local','http://localhost:1234/v1',NULL,1,'{\"description\": \"Servidor local LM Studio\", \"maxConcurrent\": 1}','2025-10-28 22:28:23','2025-10-28 22:28:23'),(5,'LM Studio','local','http://localhost:1234/v1',NULL,1,'{\"description\": \"Servidor LM Studio local na porta 1234\", \"requiresAuth\": false}','2025-10-28 23:21:56','2025-10-28 23:21:56'),(6,'OpenAI','api','https://api.openai.com/v1',NULL,1,'{\"description\": \"OpenAI GPT-4, GPT-3.5, DALL-E\", \"requiresAuth\": true}','2025-10-28 23:21:56','2025-10-28 23:21:56'),(7,'Anthropic','api','https://api.anthropic.com/v1',NULL,1,'{\"description\": \"Claude 3 Opus, Sonnet, Haiku\", \"requiresAuth\": true}','2025-10-28 23:21:56','2025-10-28 23:21:56'),(8,'Google AI','api','https://generativelanguage.googleapis.com/v1',NULL,1,'{\"description\": \"Gemini Pro, Flash, Ultra\", \"requiresAuth\": true}','2025-10-28 23:21:56','2025-10-28 23:21:56'),(9,'Mistral AI','api','https://api.mistral.ai/v1',NULL,1,'{\"description\": \"Mistral Large, Medium, Mixtral\", \"requiresAuth\": true}','2025-10-28 23:21:56','2025-10-28 23:21:56'),(10,'Hugging Face','api','https://api-inference.huggingface.co',NULL,1,'{\"description\": \"Modelos open-source variados\", \"requiresAuth\": true}','2025-10-28 23:21:56','2025-10-28 23:21:56'),(11,'Together AI','api','https://api.together.xyz/v1',NULL,1,'{\"description\": \"Modelos otimizados open-source\", \"requiresAuth\": true}','2025-10-28 23:21:56','2025-10-28 23:21:56'),(12,'Perplexity AI','api','https://api.perplexity.ai',NULL,1,'{\"description\": \"Pesquisa com IA e citações\", \"requiresAuth\": true}','2025-10-28 23:21:57','2025-10-28 23:21:57'),(13,'Cohere','api','https://api.cohere.ai/v1',NULL,1,'{\"description\": \"Embeddings e reranking\", \"requiresAuth\": true}','2025-10-28 23:21:57','2025-10-28 23:21:57'),(14,'LM Studio Local','local','http://localhost:1234/v1',NULL,1,'{\"description\": \"Servidor local LM Studio\", \"maxConcurrent\": 1}','2025-10-29 01:13:56','2025-10-29 01:13:56'),(15,'LM Studio Local','local','http://localhost:1234/v1',NULL,1,'{\"description\": \"Servidor local LM Studio\", \"maxConcurrent\": 1}','2025-10-31 20:42:22','2025-10-31 20:42:22');
/*!40000 ALTER TABLE `aiProviders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aiQualityMetrics`
--

DROP TABLE IF EXISTS `aiQualityMetrics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aiQualityMetrics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `aiId` int NOT NULL,
  `taskType` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `successRate` decimal(5,2) DEFAULT '0.00' COMMENT 'Taxa de sucesso 0-100%',
  `avgScore` decimal(5,2) DEFAULT '0.00' COMMENT 'Score médio 0-100',
  `totalTasks` int DEFAULT '0',
  `lastUpdated` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_ai_taskType` (`aiId`,`taskType`),
  KEY `idx_taskType` (`taskType`),
  CONSTRAINT `aiQualityMetrics_aiId_specializedAIs_id_fk` FOREIGN KEY (`aiId`) REFERENCES `specializedAIs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aiQualityMetrics`
--

LOCK TABLES `aiQualityMetrics` WRITE;
/*!40000 ALTER TABLE `aiQualityMetrics` DISABLE KEYS */;
/*!40000 ALTER TABLE `aiQualityMetrics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aiTemplates`
--

DROP TABLE IF EXISTS `aiTemplates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aiTemplates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `templateData` json NOT NULL COMMENT 'Estrutura do template',
  `isPublic` tinyint(1) DEFAULT '0',
  `usageCount` int DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_category` (`category`),
  KEY `idx_isPublic` (`isPublic`),
  CONSTRAINT `aiTemplates_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aiTemplates`
--

LOCK TABLES `aiTemplates` WRITE;
/*!40000 ALTER TABLE `aiTemplates` DISABLE KEYS */;
INSERT INTO `aiTemplates` VALUES (1,1,'Template de Email Marketing','Template para campanhas de email','marketing','{\"body\": \"...\", \"subject\": \"...\"}',0,0,'2025-10-31 22:04:18','2025-10-31 22:04:18'),(2,1,'Template de AnÃ¡lise SWOT','Template para anÃ¡lise SWOT','business','{\"strengths\": [], \"weaknesses\": []}',0,0,'2025-10-31 22:04:18','2025-10-31 22:04:18'),(3,1,'Template de DocumentaÃ§Ã£o','Template para docs tÃ©cnicas','documentation','{\"title\": \"\", \"sections\": []}',0,0,'2025-10-31 22:04:18','2025-10-31 22:04:18');
/*!40000 ALTER TABLE `aiTemplates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aiWorkflows`
--

DROP TABLE IF EXISTS `aiWorkflows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aiWorkflows` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `steps` json NOT NULL COMMENT 'Array de steps com ordem e configuração',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_isActive` (`isActive`),
  CONSTRAINT `aiWorkflows_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aiWorkflows`
--

LOCK TABLES `aiWorkflows` WRITE;
/*!40000 ALTER TABLE `aiWorkflows` DISABLE KEYS */;
INSERT INTO `aiWorkflows` VALUES (1,1,'Workflow de AnÃ¡lise de Dados','Pipeline para anÃ¡lise automatizada','[]',1,'2025-10-31 22:04:18','2025-10-31 22:04:18'),(2,1,'Workflow de GeraÃ§Ã£o de RelatÃ³rios','Gera relatÃ³rios mensais automaticamente','[]',1,'2025-10-31 22:04:18','2025-10-31 22:04:18'),(3,1,'Workflow de ModeraÃ§Ã£o de ConteÃºdo','Modera conteÃºdo automaticamente','[]',0,'2025-10-31 22:04:18','2025-10-31 22:04:18');
/*!40000 ALTER TABLE `aiWorkflows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chatConversations`
--

DROP TABLE IF EXISTS `chatConversations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chatConversations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `title` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aiId` int DEFAULT NULL COMMENT 'IA especializada utilizada',
  `modelId` int DEFAULT NULL COMMENT 'Modelo específico utilizado',
  `isActive` tinyint(1) DEFAULT '1',
  `metadata` json DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_isActive` (`isActive`),
  KEY `chatConversations_aiId_specializedAIs_id_fk` (`aiId`),
  KEY `chatConversations_modelId_aiModels_id_fk` (`modelId`),
  CONSTRAINT `chatConversations_aiId_specializedAIs_id_fk` FOREIGN KEY (`aiId`) REFERENCES `specializedAIs` (`id`) ON DELETE SET NULL,
  CONSTRAINT `chatConversations_modelId_aiModels_id_fk` FOREIGN KEY (`modelId`) REFERENCES `aiModels` (`id`) ON DELETE SET NULL,
  CONSTRAINT `chatConversations_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chatConversations`
--

LOCK TABLES `chatConversations` WRITE;
/*!40000 ALTER TABLE `chatConversations` DISABLE KEYS */;
/*!40000 ALTER TABLE `chatConversations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chatMessages`
--

DROP TABLE IF EXISTS `chatMessages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chatMessages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `conversationId` int NOT NULL,
  `role` enum('user','assistant','system') COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `attachments` json DEFAULT NULL COMMENT 'Array de anexos',
  `metadata` json DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `idx_conversationId` (`conversationId`),
  KEY `idx_createdAt` (`createdAt`),
  CONSTRAINT `chatMessages_conversationId_chatConversations_id_fk` FOREIGN KEY (`conversationId`) REFERENCES `chatConversations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chatMessages`
--

LOCK TABLES `chatMessages` WRITE;
/*!40000 ALTER TABLE `chatMessages` DISABLE KEYS */;
/*!40000 ALTER TABLE `chatMessages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `credentialTemplates`
--

DROP TABLE IF EXISTS `credentialTemplates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `credentialTemplates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fields` json NOT NULL COMMENT 'Schema dos campos necessários',
  `instructions` text COLLATE utf8mb4_unicode_ci COMMENT 'Instruções de como obter as credenciais',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `credentialTemplates_service_unique` (`service`),
  UNIQUE KEY `idx_service` (`service`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `credentialTemplates`
--

LOCK TABLES `credentialTemplates` WRITE;
/*!40000 ALTER TABLE `credentialTemplates` DISABLE KEYS */;
INSERT INTO `credentialTemplates` VALUES (1,'GitHub','{\"token\": \"string\", \"username\": \"string\"}','Para obter um token do GitHub:\n1. Acesse GitHub.com e faÃ§a login\n2. VÃ¡ em Settings > Developer settings > Personal access tokens\n3. Clique em \"Generate new token\"\n4. Selecione os escopos necessÃ¡rios (repo, workflow, etc)\n5. Copie o token gerado',1,'2025-10-28 22:14:48','2025-10-31 20:42:22'),(2,'Google Drive','{\"clientId\": \"string\", \"clientSecret\": \"string\", \"refreshToken\": \"string\"}','Para obter credenciais OAuth2 do Google Drive:\n1. Acesse Google Cloud Console\n2. Crie um novo projeto ou selecione um existente\n3. Ative a API do Google Drive\n4. Crie credenciais OAuth 2.0\n5. Baixe o arquivo de credenciais',1,'2025-10-28 22:14:48','2025-10-28 22:14:48'),(3,'Gmail','{\"email\": \"string\", \"appPassword\": \"string\"}','Para obter senha de aplicativo do Gmail:\n1. Ative a verificaÃ§Ã£o em duas etapas na sua conta Google\n2. Acesse Conta Google > SeguranÃ§a > Senhas de app\n3. Selecione \"E-mail\" e seu dispositivo\n4. Copie a senha gerada',1,'2025-10-28 22:14:48','2025-10-31 20:42:22'),(4,'OpenAI','{\"apiKey\": \"string\", \"organization\": \"string\"}','Para obter chave de API da OpenAI:\n1. Acesse platform.openai.com\n2. FaÃ§a login ou crie uma conta\n3. VÃ¡ em API keys\n4. Clique em \"Create new secret key\"\n5. Copie a chave gerada (nÃ£o serÃ¡ mostrada novamente)',1,'2025-10-28 22:14:48','2025-10-31 20:42:22'),(5,'Anthropic','{\"apiKey\": \"string\"}','Para obter chave de API da Anthropic (Claude):\n1. Acesse console.anthropic.com\n2. FaÃ§a login ou crie uma conta\n3. VÃ¡ em API Keys\n4. Clique em \"Create Key\"\n5. Copie a chave gerada',1,'2025-10-28 22:14:48','2025-10-31 20:42:22'),(6,'Google Sheets','{\"clientId\": \"string\", \"clientSecret\": \"string\", \"refreshToken\": \"string\"}','Para obter credenciais OAuth2 do Google Sheets:\n1. Acesse Google Cloud Console\n2. Crie um novo projeto ou selecione um existente\n3. Ative a API do Google Sheets\n4. Crie credenciais OAuth 2.0\n5. Baixe o arquivo de credenciais',1,'2025-10-28 22:14:48','2025-10-28 22:14:48'),(7,'Notion','{\"integrationToken\": \"string\"}','Para obter token de integraÃ§Ã£o do Notion:\n1. Acesse www.notion.so/my-integrations\n2. Clique em \"New integration\"\n3. Configure as permissÃµes necessÃ¡rias\n4. Copie o Internal Integration Token',1,'2025-10-28 22:14:48','2025-10-31 20:42:22'),(8,'Slack','{\"appToken\": \"string\", \"botToken\": \"string\"}','Para obter tokens do Slack:\n1. Acesse api.slack.com/apps\n2. Crie um novo app ou selecione um existente\n3. Em \"OAuth & Permissions\", copie o Bot User OAuth Token\n4. Em \"Basic Information\", gere e copie o App-Level Token',1,'2025-10-28 22:14:48','2025-10-28 22:14:48'),(9,'Discord','{\"botToken\": \"string\"}','Para obter token de bot do Discord:\n1. Acesse discord.com/developers/applications\n2. Crie uma nova aplicaÃ§Ã£o\n3. VÃ¡ em \"Bot\" e clique em \"Add Bot\"\n4. Copie o token do bot\n5. Configure as permissÃµes necessÃ¡rias',1,'2025-10-28 22:14:48','2025-10-31 20:42:22');
/*!40000 ALTER TABLE `credentialTemplates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `credentials`
--

DROP TABLE IF EXISTS `credentials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `credentials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `service` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'GitHub, Gmail, Drive, OpenAI, etc',
  `credentialType` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'oauth2, api_key, password',
  `encryptedData` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Dados criptografados com AES-256-GCM',
  `metadata` json DEFAULT NULL COMMENT 'Informações adicionais não sensíveis',
  `isActive` tinyint(1) DEFAULT '1',
  `expiresAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId_service` (`userId`,`service`),
  KEY `idx_isActive` (`isActive`),
  CONSTRAINT `credentials_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `credentials`
--

LOCK TABLES `credentials` WRITE;
/*!40000 ALTER TABLE `credentials` DISABLE KEYS */;
/*!40000 ALTER TABLE `credentials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `creditUsage`
--

DROP TABLE IF EXISTS `creditUsage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `creditUsage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `accountId` int NOT NULL,
  `taskId` int DEFAULT NULL,
  `creditsUsed` decimal(10,4) NOT NULL,
  `provider` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modelUsed` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tokensUsed` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `idx_accountId` (`accountId`),
  KEY `idx_taskId` (`taskId`),
  KEY `idx_createdAt` (`createdAt`),
  CONSTRAINT `creditUsage_accountId_externalAPIAccounts_id_fk` FOREIGN KEY (`accountId`) REFERENCES `externalAPIAccounts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `creditUsage_taskId_tasks_id_fk` FOREIGN KEY (`taskId`) REFERENCES `tasks` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `creditUsage`
--

LOCK TABLES `creditUsage` WRITE;
/*!40000 ALTER TABLE `creditUsage` DISABLE KEYS */;
/*!40000 ALTER TABLE `creditUsage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `executionLogs`
--

DROP TABLE IF EXISTS `executionLogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `executionLogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `taskId` int DEFAULT NULL,
  `subtaskId` int DEFAULT NULL,
  `level` enum('debug','info','warning','error','critical') COLLATE utf8mb4_unicode_ci DEFAULT 'info',
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `metadata` json DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `idx_taskId` (`taskId`),
  KEY `idx_subtaskId` (`subtaskId`),
  KEY `idx_level` (`level`),
  KEY `idx_createdAt` (`createdAt`),
  CONSTRAINT `executionLogs_subtaskId_subtasks_id_fk` FOREIGN KEY (`subtaskId`) REFERENCES `subtasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `executionLogs_taskId_tasks_id_fk` FOREIGN KEY (`taskId`) REFERENCES `tasks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `executionLogs`
--

LOCK TABLES `executionLogs` WRITE;
/*!40000 ALTER TABLE `executionLogs` DISABLE KEYS */;
INSERT INTO `executionLogs` VALUES (1,1,NULL,'info','Task execution started','{\"action\": \"start\", \"timestamp\": \"2025-10-31T20:00:00Z\"}','2025-10-31 22:39:34'),(2,1,NULL,'info','Task execution completed successfully','{\"action\": \"complete\", \"success\": true, \"duration\": \"10m\"}','2025-10-31 22:39:34'),(3,2,NULL,'info','Task execution started','{\"action\": \"start\", \"timestamp\": \"2025-10-31T19:00:00Z\"}','2025-10-31 22:39:34'),(4,2,NULL,'warning','Task execution slow','{\"action\": \"warning\", \"duration\": \"25m\"}','2025-10-31 22:39:34'),(5,2,NULL,'info','Task execution completed','{\"action\": \"complete\", \"success\": true, \"duration\": \"30m\"}','2025-10-31 22:39:34'),(6,3,NULL,'info','Task execution started','{\"action\": \"start\", \"timestamp\": \"2025-10-31T18:00:00Z\"}','2025-10-31 22:39:34'),(7,3,NULL,'error','Task execution failed','{\"error\": \"timeout\", \"action\": \"fail\", \"duration\": \"60m\"}','2025-10-31 22:39:34'),(8,1,NULL,'info','Task re-executed','{\"action\": \"retry\", \"timestamp\": \"2025-10-31T21:30:00Z\"}','2025-10-31 22:39:34'),(9,1,NULL,'info','Task completed on retry','{\"action\": \"complete\", \"success\": true}','2025-10-31 22:39:34');
/*!40000 ALTER TABLE `executionLogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `externalAPIAccounts`
--

DROP TABLE IF EXISTS `externalAPIAccounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `externalAPIAccounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `provider` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'OpenAI, Anthropic, Google, etc',
  `accountName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `credentialId` int DEFAULT NULL,
  `creditBalance` decimal(10,2) DEFAULT '0.00',
  `creditLimit` decimal(10,2) DEFAULT NULL,
  `usageThisMonth` decimal(10,2) DEFAULT '0.00',
  `alertThreshold` decimal(10,2) DEFAULT NULL COMMENT 'Alerta quando atingir este valor',
  `isActive` tinyint(1) DEFAULT '1',
  `lastSync` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_provider` (`provider`),
  KEY `externalAPIAccounts_credentialId_credentials_id_fk` (`credentialId`),
  CONSTRAINT `externalAPIAccounts_credentialId_credentials_id_fk` FOREIGN KEY (`credentialId`) REFERENCES `credentials` (`id`) ON DELETE SET NULL,
  CONSTRAINT `externalAPIAccounts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `externalAPIAccounts`
--

LOCK TABLES `externalAPIAccounts` WRITE;
/*!40000 ALTER TABLE `externalAPIAccounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `externalAPIAccounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instructions`
--

DROP TABLE IF EXISTS `instructions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instructions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `aiId` int DEFAULT NULL COMMENT 'IA específica ou NULL para global',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `priority` int DEFAULT '50' COMMENT 'Prioridade 0-100',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_aiId` (`aiId`),
  KEY `idx_isActive` (`isActive`),
  CONSTRAINT `instructions_aiId_specializedAIs_id_fk` FOREIGN KEY (`aiId`) REFERENCES `specializedAIs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `instructions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instructions`
--

LOCK TABLES `instructions` WRITE;
/*!40000 ALTER TABLE `instructions` DISABLE KEYS */;
/*!40000 ALTER TABLE `instructions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `knowledgeBase`
--

DROP TABLE IF EXISTS `knowledgeBase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `knowledgeBase` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `title` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tags` json DEFAULT NULL COMMENT 'Array de tags',
  `embedding` json DEFAULT NULL COMMENT 'Vector embedding para busca semântica',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_category` (`category`),
  KEY `idx_isActive` (`isActive`),
  CONSTRAINT `knowledgeBase_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `knowledgeBase`
--

LOCK TABLES `knowledgeBase` WRITE;
/*!40000 ALTER TABLE `knowledgeBase` DISABLE KEYS */;
INSERT INTO `knowledgeBase` VALUES (1,1,'Como usar o sistema','Guia completo do sistema de orquestraÃ§Ã£o','tutorial','[\"guia\", \"tutorial\"]',NULL,1,'2025-10-31 22:04:18','2025-10-31 22:04:18'),(2,1,'Troubleshooting comum','SoluÃ§Ãµes para problemas frequentes','support','[\"help\", \"faq\"]',NULL,1,'2025-10-31 22:04:18','2025-10-31 22:04:18'),(3,1,'Melhores prÃ¡ticas','RecomendaÃ§Ãµes de uso do sistema','best-practices','[\"dicas\", \"prÃ¡ticas\"]',NULL,1,'2025-10-31 22:04:18','2025-10-31 22:04:18');
/*!40000 ALTER TABLE `knowledgeBase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `knowledgeSources`
--

DROP TABLE IF EXISTS `knowledgeSources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `knowledgeSources` (
  `id` int NOT NULL AUTO_INCREMENT,
  `knowledgeBaseId` int NOT NULL,
  `sourceType` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'url, file, api, database',
  `sourceUrl` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sourceData` json DEFAULT NULL COMMENT 'Dados adicionais da fonte',
  `lastSync` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_knowledgeBaseId` (`knowledgeBaseId`),
  KEY `idx_sourceType` (`sourceType`),
  CONSTRAINT `knowledgeSources_knowledgeBaseId_knowledgeBase_id_fk` FOREIGN KEY (`knowledgeBaseId`) REFERENCES `knowledgeBase` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `knowledgeSources`
--

LOCK TABLES `knowledgeSources` WRITE;
/*!40000 ALTER TABLE `knowledgeSources` DISABLE KEYS */;
/*!40000 ALTER TABLE `knowledgeSources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modelDiscovery`
--

DROP TABLE IF EXISTS `modelDiscovery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modelDiscovery` (
  `id` int NOT NULL AUTO_INCREMENT,
  `modelName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `modelPath` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sizeBytes` bigint DEFAULT NULL,
  `quantization` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parameters` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discoveredAt` timestamp NULL DEFAULT (now()),
  `lastSeen` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  `isImported` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_modelName` (`modelName`),
  KEY `idx_isImported` (`isImported`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modelDiscovery`
--

LOCK TABLES `modelDiscovery` WRITE;
/*!40000 ALTER TABLE `modelDiscovery` DISABLE KEYS */;
/*!40000 ALTER TABLE `modelDiscovery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modelRatings`
--

DROP TABLE IF EXISTS `modelRatings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modelRatings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `modelId` int NOT NULL,
  `userId` int NOT NULL,
  `rating` int NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `taskType` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Tipo de tarefa avaliada',
  `createdAt` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `idx_modelId` (`modelId`),
  KEY `idx_userId` (`userId`),
  CONSTRAINT `modelRatings_modelId_aiModels_id_fk` FOREIGN KEY (`modelId`) REFERENCES `aiModels` (`id`) ON DELETE CASCADE,
  CONSTRAINT `modelRatings_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `modelRatings_chk_1` CHECK (((`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modelRatings`
--

LOCK TABLES `modelRatings` WRITE;
/*!40000 ALTER TABLE `modelRatings` DISABLE KEYS */;
/*!40000 ALTER TABLE `modelRatings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modelVersions`
--

DROP TABLE IF EXISTS `modelVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modelVersions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `baseModelId` int NOT NULL,
  `trainingJobId` int DEFAULT NULL,
  `versionName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `modelPath` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sizeBytes` bigint DEFAULT NULL,
  `format` enum('gguf','safetensors','pytorch','onnx') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'gguf',
  `quantization` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Q4_K_M, Q5_K_S, FP16, etc',
  `parameters` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '3B, 7B, 13B, etc',
  `performanceMetrics` json DEFAULT NULL COMMENT 'accuracy, perplexity, bleu, rouge, etc',
  `benchmarkScores` json DEFAULT NULL COMMENT 'mmlu, hellaswag, truthfulqa, etc',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isPublic` tinyint(1) NOT NULL DEFAULT '0',
  `downloadCount` int DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `trainingJobId` (`trainingJobId`),
  KEY `idx_userId` (`userId`),
  KEY `idx_baseModelId` (`baseModelId`),
  KEY `idx_isPublic` (`isPublic`),
  CONSTRAINT `modelVersions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `modelVersions_ibfk_2` FOREIGN KEY (`baseModelId`) REFERENCES `aiModels` (`id`) ON DELETE CASCADE,
  CONSTRAINT `modelVersions_ibfk_3` FOREIGN KEY (`trainingJobId`) REFERENCES `trainingJobs` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modelVersions`
--

LOCK TABLES `modelVersions` WRITE;
/*!40000 ALTER TABLE `modelVersions` DISABLE KEYS */;
/*!40000 ALTER TABLE `modelVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `userId` int NOT NULL,
  `teamId` int DEFAULT NULL,
  `status` enum('planning','active','paused','completed','archived') DEFAULT 'planning',
  `budget` decimal(10,2) DEFAULT NULL,
  `progress` int DEFAULT '0',
  `tags` json DEFAULT NULL,
  `startDate` timestamp NULL DEFAULT NULL,
  `endDate` timestamp NULL DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `teamId` (`teamId`),
  CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`teamId`) REFERENCES `teams` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,'Sistema de OrquestraÃ§Ã£o V3.1','Desenvolvimento da versÃ£o 3.1 do sistema',1,1,'active',NULL,0,NULL,NULL,NULL,1,'2025-10-31 22:48:59','2025-10-31 22:48:59'),(2,'IntegraÃ§Ã£o com APIs Externas','IntegraÃ§Ã£o com serviÃ§os de terceiros',1,1,'planning',NULL,0,NULL,NULL,NULL,1,'2025-10-31 22:48:59','2025-10-31 22:48:59'),(3,'Testes Automatizados','Suite completa de testes',1,2,'active',NULL,0,NULL,NULL,NULL,1,'2025-10-31 22:48:59','2025-10-31 22:48:59'),(4,'Infraestrutura Cloud','MigraÃ§Ã£o para cloud',1,3,'planning',NULL,0,NULL,NULL,NULL,1,'2025-10-31 22:48:59','2025-10-31 22:48:59');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promptVersions`
--

DROP TABLE IF EXISTS `promptVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promptVersions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `promptId` int NOT NULL,
  `version` int NOT NULL,
  `content` text NOT NULL,
  `changelog` text,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_prompt_version` (`promptId`,`version`),
  KEY `idx_promptId` (`promptId`),
  KEY `createdBy` (`createdBy`),
  CONSTRAINT `promptVersions_ibfk_1` FOREIGN KEY (`promptId`) REFERENCES `prompts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `promptVersions_ibfk_2` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promptVersions`
--

LOCK TABLES `promptVersions` WRITE;
/*!40000 ALTER TABLE `promptVersions` DISABLE KEYS */;
/*!40000 ALTER TABLE `promptVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prompts`
--

DROP TABLE IF EXISTS `prompts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prompts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `content` text NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `variables` json DEFAULT NULL,
  `isPublic` tinyint(1) DEFAULT '0',
  `useCount` int DEFAULT '0',
  `currentVersion` int DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_category` (`category`),
  KEY `idx_isPublic` (`isPublic`),
  CONSTRAINT `prompts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prompts`
--

LOCK TABLES `prompts` WRITE;
/*!40000 ALTER TABLE `prompts` DISABLE KEYS */;
INSERT INTO `prompts` VALUES (1,1,'Prompt de AnÃ¡lise de CÃ³digo','Analisa cÃ³digo e sugere melhorias','Analise o seguinte cÃ³digo e sugira melhorias de performance e legibilidade:\n\n{codigo}','ProgramaÃ§Ã£o',NULL,NULL,1,15,1,'2025-10-31 23:13:55','2025-10-31 23:13:55'),(2,1,'Gerador de DescriÃ§Ãµes de Produto','Cria descriÃ§Ãµes persuasivas','Crie uma descriÃ§Ã£o de produto persuasiva para:\nProduto: {produto}\nCaracterÃ­sticas: {caracteristicas}\nPÃºblico-alvo: {publico}','Marketing',NULL,NULL,1,32,1,'2025-10-31 23:13:55','2025-10-31 23:13:55'),(3,1,'Revisor de Texto','Revisa gramÃ¡tica e estilo','Revise o seguinte texto corrigindo erros gramaticais e melhorando o estilo:\n\n{texto}','Escrita',NULL,NULL,1,48,1,'2025-10-31 23:13:55','2025-10-31 23:13:55'),(4,1,'Tradutor TÃ©cnico','Traduz documentaÃ§Ã£o tÃ©cnica','Traduza o seguinte texto tÃ©cnico de {idioma_origem} para {idioma_destino}:\n\n{texto}','TraduÃ§Ã£o',NULL,NULL,0,8,1,'2025-10-31 23:13:55','2025-10-31 23:13:55'),(5,1,'Gerador de Resumos','Resume textos longos','Crie um resumo executivo do seguinte texto:\n\n{texto}\n\nLimite: {limite_palavras} palavras','Produtividade',NULL,NULL,1,21,1,'2025-10-31 23:13:55','2025-10-31 23:13:55');
/*!40000 ALTER TABLE `prompts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `specializedAIs`
--

DROP TABLE IF EXISTS `specializedAIs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `specializedAIs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'research, writing, code, validation, analysis',
  `defaultModelId` int DEFAULT NULL,
  `fallbackModelIds` json DEFAULT NULL COMMENT 'Array de IDs de modelos fallback',
  `systemPrompt` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `capabilities` json DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_category` (`category`),
  KEY `idx_isActive` (`isActive`),
  KEY `specializedAIs_defaultModelId_aiModels_id_fk` (`defaultModelId`),
  CONSTRAINT `specializedAIs_defaultModelId_aiModels_id_fk` FOREIGN KEY (`defaultModelId`) REFERENCES `aiModels` (`id`) ON DELETE SET NULL,
  CONSTRAINT `specializedAIs_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `specializedAIs`
--

LOCK TABLES `specializedAIs` WRITE;
/*!40000 ALTER TABLE `specializedAIs` DISABLE KEYS */;
INSERT INTO `specializedAIs` VALUES (1,1,'IA Pesquisadora','Especializada em pesquisa completa e detalhada','research',NULL,NULL,'Você é uma IA de pesquisa especializada. Sua função é buscar informações COMPLETAS e detalhadas sobre qualquer tópico. NUNCA resuma ou omita informações importantes. Sempre forneça fontes e referências quando possível.','[\"research\", \"analysis\", \"web_search\"]',1,'2025-10-28 22:14:48','2025-10-28 22:14:48'),(2,1,'IA Redatora','Especializada em redação completa de textos','writing',NULL,NULL,'Você é uma IA de redação especializada. Sua função é escrever textos COMPLETOS e bem estruturados. NUNCA resuma ou omita partes do conteúdo solicitado. Sempre escreva de forma clara, coesa e completa.','[\"writing\", \"content_creation\", \"editing\"]',1,'2025-10-28 22:14:48','2025-10-28 22:14:48'),(3,1,'IA Programadora','Especializada em programação completa','code',NULL,NULL,'Você é uma IA de programação especializada. Sua função é escrever código COMPLETO e funcional. NUNCA resuma ou omita partes do código. Sempre implemente TODAS as funcionalidades solicitadas com comentários e tratamento de erros adequados.','[\"coding\", \"debugging\", \"code_review\"]',1,'2025-10-28 22:14:48','2025-10-28 22:14:48'),(4,1,'IA Validadora','Especializada em validação criteriosa de resultados','validation',NULL,NULL,'Você é uma IA de validação especializada. Sua função é revisar TUDO de forma criteriosa e honesta. Verifique se o trabalho está COMPLETO, correto e atende a TODOS os requisitos. Seja rigoroso na análise e aponte qualquer falha ou omissão.','[\"validation\", \"review\", \"quality_assurance\"]',1,'2025-10-28 22:14:48','2025-10-28 22:14:48'),(5,1,'IA Analista','Especializada em análise de dados e métricas','analysis',NULL,NULL,'Você é uma IA de análise especializada. Sua função é analisar dados de forma completa e fornecer insights detalhados. NUNCA omita dados ou análises importantes. Sempre forneça conclusões baseadas em evidências concretas.','[\"analysis\", \"data_processing\", \"insights\"]',1,'2025-10-28 22:14:48','2025-10-28 22:14:48'),(6,1,'IA Pesquisadora','Especializada em pesquisa completa e detalhada','research',NULL,NULL,'Você é uma IA de pesquisa especializada. Sua função é buscar informações COMPLETAS e detalhadas sobre qualquer tópico. NUNCA resuma ou omita informações importantes. Sempre forneça fontes e referências quando possível.','[\"research\", \"analysis\", \"web_search\"]',1,'2025-10-28 22:20:29','2025-10-28 22:20:29'),(7,1,'IA Redatora','Especializada em redação completa de textos','writing',NULL,NULL,'Você é uma IA de redação especializada. Sua função é escrever textos COMPLETOS e bem estruturados. NUNCA resuma ou omita partes do conteúdo solicitado. Sempre escreva de forma clara, coesa e completa.','[\"writing\", \"content_creation\", \"editing\"]',1,'2025-10-28 22:20:29','2025-10-28 22:20:29'),(8,1,'IA Programadora','Especializada em programação completa','code',NULL,NULL,'Você é uma IA de programação especializada. Sua função é escrever código COMPLETO e funcional. NUNCA resuma ou omita partes do código. Sempre implemente TODAS as funcionalidades solicitadas com comentários e tratamento de erros adequados.','[\"coding\", \"debugging\", \"code_review\"]',1,'2025-10-28 22:20:29','2025-10-28 22:20:29'),(9,1,'IA Validadora','Especializada em validação criteriosa de resultados','validation',NULL,NULL,'Você é uma IA de validação especializada. Sua função é revisar TUDO de forma criteriosa e honesta. Verifique se o trabalho está COMPLETO, correto e atende a TODOS os requisitos. Seja rigoroso na análise e aponte qualquer falha ou omissão.','[\"validation\", \"review\", \"quality_assurance\"]',1,'2025-10-28 22:20:29','2025-10-28 22:20:29'),(10,1,'IA Analista','Especializada em análise de dados e métricas','analysis',NULL,NULL,'Você é uma IA de análise especializada. Sua função é analisar dados de forma completa e fornecer insights detalhados. NUNCA omita dados ou análises importantes. Sempre forneça conclusões baseadas em evidências concretas.','[\"analysis\", \"data_processing\", \"insights\"]',1,'2025-10-28 22:20:29','2025-10-28 22:20:29'),(11,1,'IA Pesquisadora','Especializada em pesquisa completa e detalhada','research',NULL,NULL,'Você é uma IA de pesquisa especializada. Sua função é buscar informações COMPLETAS e detalhadas sobre qualquer tópico. NUNCA resuma ou omita informações importantes. Sempre forneça fontes e referências quando possível.','[\"research\", \"analysis\", \"web_search\"]',1,'2025-10-28 22:25:33','2025-10-28 22:25:33'),(12,1,'IA Redatora','Especializada em redação completa de textos','writing',NULL,NULL,'Você é uma IA de redação especializada. Sua função é escrever textos COMPLETOS e bem estruturados. NUNCA resuma ou omita partes do conteúdo solicitado. Sempre escreva de forma clara, coesa e completa.','[\"writing\", \"content_creation\", \"editing\"]',1,'2025-10-28 22:25:33','2025-10-28 22:25:33'),(13,1,'IA Programadora','Especializada em programação completa','code',NULL,NULL,'Você é uma IA de programação especializada. Sua função é escrever código COMPLETO e funcional. NUNCA resuma ou omita partes do código. Sempre implemente TODAS as funcionalidades solicitadas com comentários e tratamento de erros adequados.','[\"coding\", \"debugging\", \"code_review\"]',1,'2025-10-28 22:25:33','2025-10-28 22:25:33'),(14,1,'IA Validadora','Especializada em validação criteriosa de resultados','validation',NULL,NULL,'Você é uma IA de validação especializada. Sua função é revisar TUDO de forma criteriosa e honesta. Verifique se o trabalho está COMPLETO, correto e atende a TODOS os requisitos. Seja rigoroso na análise e aponte qualquer falha ou omissão.','[\"validation\", \"review\", \"quality_assurance\"]',1,'2025-10-28 22:25:33','2025-10-28 22:25:33'),(15,1,'IA Analista','Especializada em análise de dados e métricas','analysis',NULL,NULL,'Você é uma IA de análise especializada. Sua função é analisar dados de forma completa e fornecer insights detalhados. NUNCA omita dados ou análises importantes. Sempre forneça conclusões baseadas em evidências concretas.','[\"analysis\", \"data_processing\", \"insights\"]',1,'2025-10-28 22:25:33','2025-10-28 22:25:33'),(16,1,'IA Pesquisadora','Especializada em pesquisa completa e detalhada','research',NULL,NULL,'Você é uma IA de pesquisa especializada. Sua função é buscar informações COMPLETAS e detalhadas sobre qualquer tópico. NUNCA resuma ou omita informações importantes. Sempre forneça fontes e referências quando possível.','[\"research\", \"analysis\", \"web_search\"]',1,'2025-10-28 22:28:23','2025-10-28 22:28:23'),(17,1,'IA Redatora','Especializada em redação completa de textos','writing',NULL,NULL,'Você é uma IA de redação especializada. Sua função é escrever textos COMPLETOS e bem estruturados. NUNCA resuma ou omita partes do conteúdo solicitado. Sempre escreva de forma clara, coesa e completa.','[\"writing\", \"content_creation\", \"editing\"]',1,'2025-10-28 22:28:23','2025-10-28 22:28:23'),(18,1,'IA Programadora','Especializada em programação completa','code',NULL,NULL,'Você é uma IA de programação especializada. Sua função é escrever código COMPLETO e funcional. NUNCA resuma ou omita partes do código. Sempre implemente TODAS as funcionalidades solicitadas com comentários e tratamento de erros adequados.','[\"coding\", \"debugging\", \"code_review\"]',1,'2025-10-28 22:28:23','2025-10-28 22:28:23'),(19,1,'IA Validadora','Especializada em validação criteriosa de resultados','validation',NULL,NULL,'Você é uma IA de validação especializada. Sua função é revisar TUDO de forma criteriosa e honesta. Verifique se o trabalho está COMPLETO, correto e atende a TODOS os requisitos. Seja rigoroso na análise e aponte qualquer falha ou omissão.','[\"validation\", \"review\", \"quality_assurance\"]',1,'2025-10-28 22:28:23','2025-10-28 22:28:23'),(20,1,'IA Analista','Especializada em análise de dados e métricas','analysis',NULL,NULL,'Você é uma IA de análise especializada. Sua função é analisar dados de forma completa e fornecer insights detalhados. NUNCA omita dados ou análises importantes. Sempre forneça conclusões baseadas em evidências concretas.','[\"analysis\", \"data_processing\", \"insights\"]',1,'2025-10-28 22:28:23','2025-10-28 22:28:23'),(21,1,'Arquiteto de Software','Especialista em planejamento de arquiteturas de sistemas','code',4,NULL,'Você é um arquiteto de software experiente. Sua função é planejar arquiteturas de sistemas, definir padrões, escolher tecnologias adequadas e garantir escalabilidade e manutenibilidade.','[\"architecture\", \"system-design\", \"tech-stack\"]',1,'2025-10-28 23:21:57','2025-10-28 23:21:57'),(22,1,'Desenvolvedor Backend','Especialista em desenvolvimento de APIs e lógica de negócio','code',7,NULL,'Você é um desenvolvedor backend especializado. Foco em APIs RESTful, bancos de dados, autenticação, microserviços e testes automatizados. Escreva código limpo e bem documentado.','[\"api\", \"database\", \"backend\", \"testing\"]',1,'2025-10-28 23:21:57','2025-10-28 23:21:57'),(23,1,'Desenvolvedor Frontend','Especialista em React, TypeScript e interfaces modernas','code',5,NULL,'Você é um desenvolvedor frontend especializado em React, TypeScript e interfaces modernas. Foco em componentização, performance, acessibilidade e responsividade.','[\"react\", \"typescript\", \"ui\", \"frontend\"]',1,'2025-10-28 23:21:57','2025-10-28 23:21:57'),(24,1,'Revisor de Código','Especialista em code review rigoroso e construtivo','validation',6,NULL,'Você é um revisor de código rigoroso e construtivo. Analise qualidade, segurança, performance e manutenibilidade. Seja específico e sugira melhorias concretas.','[\"code-review\", \"security\", \"best-practices\"]',1,'2025-10-28 23:21:57','2025-10-28 23:21:57'),(25,1,'Testador QA','Especialista em testes e quality assurance','validation',10,NULL,'Você é um especialista em Quality Assurance. Crie casos de teste abrangentes, testes de integração e E2E, identifique bugs potenciais e sugira automação.','[\"testing\", \"qa\", \"automation\"]',1,'2025-10-28 23:21:57','2025-10-28 23:21:57'),(26,1,'Documentador Técnico','Especialista em documentação técnica clara','writing',5,NULL,'Você é um especialista em documentação técnica. Crie documentação de APIs, READMEs, tutoriais, guias de arquitetura e comentários de código úteis. Use linguagem clara e exemplos práticos.','[\"documentation\", \"technical-writing\"]',1,'2025-10-28 23:21:57','2025-10-28 23:21:57'),(27,1,'Especialista em DevOps','Especialista em CI/CD e infraestrutura','code',11,NULL,'Você é um especialista em DevOps e infraestrutura. Foco em CI/CD pipelines, containers, Infrastructure as Code, monitoramento e cloud. Priorize automação e confiabilidade.','[\"devops\", \"ci-cd\", \"infrastructure\", \"cloud\"]',1,'2025-10-28 23:21:57','2025-10-28 23:21:57'),(28,1,'Analista de Segurança','Especialista em segurança e auditoria','validation',8,NULL,'Você é um analista de segurança. Identifique vulnerabilidades (OWASP Top 10), falhas de autenticação, exposição de dados sensíveis e configurações inseguras. Sugira correções práticas.','[\"security\", \"vulnerability\", \"audit\"]',1,'2025-10-28 23:21:57','2025-10-28 23:21:57'),(29,1,'Designer UX/UI','Especialista em experiência do usuário','writing',9,NULL,'Você é um designer de UX/UI focado em experiência do usuário. Crie fluxos intuitivos, interfaces acessíveis, protótipos funcionais e design systems consistentes. Priorize simplicidade.','[\"ux\", \"ui\", \"design\", \"accessibility\"]',1,'2025-10-28 23:21:57','2025-10-28 23:21:57'),(30,1,'Especialista em Banco de Dados','Especialista em SQL e NoSQL','code',12,NULL,'Você é especialista em bancos de dados SQL e NoSQL. Otimize schema design, queries, índices, transações e escalabilidade. Sempre considere performance e integridade dos dados.','[\"database\", \"sql\", \"nosql\", \"optimization\"]',1,'2025-10-28 23:21:57','2025-10-28 23:21:57'),(31,1,'Assistente Local','IA de propósito geral no LM Studio','research',1,NULL,'Você é um assistente geral de propósito múltiplo rodando localmente. Ajude com geração de código, análise, brainstorming e tarefas gerais. Seja conciso e prático.','[\"general\", \"code\", \"analysis\"]',1,'2025-10-28 23:21:57','2025-10-28 23:21:57'),(32,1,'IA Pesquisadora','Especializada em pesquisa completa e detalhada','research',NULL,NULL,'Você é uma IA de pesquisa especializada. Sua função é buscar informações COMPLETAS e detalhadas sobre qualquer tópico. NUNCA resuma ou omita informações importantes. Sempre forneça fontes e referências quando possível.','[\"research\", \"analysis\", \"web_search\"]',1,'2025-10-29 01:13:56','2025-10-29 01:13:56'),(33,1,'IA Redatora','Especializada em redação completa de textos','writing',NULL,NULL,'Você é uma IA de redação especializada. Sua função é escrever textos COMPLETOS e bem estruturados. NUNCA resuma ou omita partes do conteúdo solicitado. Sempre escreva de forma clara, coesa e completa.','[\"writing\", \"content_creation\", \"editing\"]',1,'2025-10-29 01:13:56','2025-10-29 01:13:56'),(34,1,'IA Programadora','Especializada em programação completa','code',NULL,NULL,'Você é uma IA de programação especializada. Sua função é escrever código COMPLETO e funcional. NUNCA resuma ou omita partes do código. Sempre implemente TODAS as funcionalidades solicitadas com comentários e tratamento de erros adequados.','[\"coding\", \"debugging\", \"code_review\"]',1,'2025-10-29 01:13:56','2025-10-29 01:13:56'),(35,1,'IA Validadora','Especializada em validação criteriosa de resultados','validation',NULL,NULL,'Você é uma IA de validação especializada. Sua função é revisar TUDO de forma criteriosa e honesta. Verifique se o trabalho está COMPLETO, correto e atende a TODOS os requisitos. Seja rigoroso na análise e aponte qualquer falha ou omissão.','[\"validation\", \"review\", \"quality_assurance\"]',1,'2025-10-29 01:13:56','2025-10-29 01:13:56'),(36,1,'IA Analista','Especializada em análise de dados e métricas','analysis',NULL,NULL,'Você é uma IA de análise especializada. Sua função é analisar dados de forma completa e fornecer insights detalhados. NUNCA omita dados ou análises importantes. Sempre forneça conclusões baseadas em evidências concretas.','[\"analysis\", \"data_processing\", \"insights\"]',1,'2025-10-29 01:13:56','2025-10-29 01:13:56'),(37,1,'IA Pesquisadora','Especializada em pesquisa completa e detalhada','research',NULL,NULL,'VocÃª Ã© uma IA de pesquisa especializada. Sua funÃ§Ã£o Ã© buscar informaÃ§Ãµes COMPLETAS e detalhadas sobre qualquer tÃ³pico. NUNCA resuma ou omita informaÃ§Ãµes importantes. Sempre forneÃ§a fontes e referÃªncias quando possÃ­vel.','[\"research\", \"analysis\", \"web_search\"]',1,'2025-10-31 20:42:22','2025-10-31 20:42:22'),(38,1,'IA Redatora','Especializada em redaÃ§Ã£o completa de textos','writing',NULL,NULL,'VocÃª Ã© uma IA de redaÃ§Ã£o especializada. Sua funÃ§Ã£o Ã© escrever textos COMPLETOS e bem estruturados. NUNCA resuma ou omita partes do conteÃºdo solicitado. Sempre escreva de forma clara, coesa e completa.','[\"writing\", \"content_creation\", \"editing\"]',1,'2025-10-31 20:42:22','2025-10-31 20:42:22'),(39,1,'IA Programadora','Especializada em programaÃ§Ã£o completa','code',NULL,NULL,'VocÃª Ã© uma IA de programaÃ§Ã£o especializada. Sua funÃ§Ã£o Ã© escrever cÃ³digo COMPLETO e funcional. NUNCA resuma ou omita partes do cÃ³digo. Sempre implemente TODAS as funcionalidades solicitadas com comentÃ¡rios e tratamento de erros adequados.','[\"coding\", \"debugging\", \"code_review\"]',1,'2025-10-31 20:42:22','2025-10-31 20:42:22'),(40,1,'IA Validadora','Especializada em validaÃ§Ã£o criteriosa de resultados','validation',NULL,NULL,'VocÃª Ã© uma IA de validaÃ§Ã£o especializada. Sua funÃ§Ã£o Ã© revisar TUDO de forma criteriosa e honesta. Verifique se o trabalho estÃ¡ COMPLETO, correto e atende a TODOS os requisitos. Seja rigoroso na anÃ¡lise e aponte qualquer falha ou omissÃ£o.','[\"validation\", \"review\", \"quality_assurance\"]',1,'2025-10-31 20:42:22','2025-10-31 20:42:22'),(41,1,'IA Analista','Especializada em anÃ¡lise de dados e mÃ©tricas','analysis',NULL,NULL,'VocÃª Ã© uma IA de anÃ¡lise especializada. Sua funÃ§Ã£o Ã© analisar dados de forma completa e fornecer insights detalhados. NUNCA omita dados ou anÃ¡lises importantes. Sempre forneÃ§a conclusÃµes baseadas em evidÃªncias concretas.','[\"analysis\", \"data_processing\", \"insights\"]',1,'2025-10-31 20:42:22','2025-10-31 20:42:22');
/*!40000 ALTER TABLE `specializedAIs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `storage`
--

DROP TABLE IF EXISTS `storage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `storage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `fileName` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `filePath` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileType` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sizeBytes` bigint DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_fileType` (`fileType`),
  CONSTRAINT `storage_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storage`
--

LOCK TABLES `storage` WRITE;
/*!40000 ALTER TABLE `storage` DISABLE KEYS */;
/*!40000 ALTER TABLE `storage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subtasks`
--

DROP TABLE IF EXISTS `subtasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subtasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `taskId` int NOT NULL,
  `assignedModelId` int DEFAULT NULL,
  `title` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `prompt` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `result` text COLLATE utf8mb4_unicode_ci,
  `status` enum('pending','executing','completed','failed','validating','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `reviewedBy` int DEFAULT NULL COMMENT 'ID do modelo que fez a validação',
  `reviewNotes` text COLLATE utf8mb4_unicode_ci,
  `completedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_taskId` (`taskId`),
  KEY `idx_status` (`status`),
  KEY `subtasks_assignedModelId_aiModels_id_fk` (`assignedModelId`),
  KEY `subtasks_reviewedBy_aiModels_id_fk` (`reviewedBy`),
  CONSTRAINT `subtasks_assignedModelId_aiModels_id_fk` FOREIGN KEY (`assignedModelId`) REFERENCES `aiModels` (`id`) ON DELETE SET NULL,
  CONSTRAINT `subtasks_reviewedBy_aiModels_id_fk` FOREIGN KEY (`reviewedBy`) REFERENCES `aiModels` (`id`) ON DELETE SET NULL,
  CONSTRAINT `subtasks_taskId_tasks_id_fk` FOREIGN KEY (`taskId`) REFERENCES `tasks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subtasks`
--

LOCK TABLES `subtasks` WRITE;
/*!40000 ALTER TABLE `subtasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `subtasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `systemSettings`
--

DROP TABLE IF EXISTS `systemSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `systemSettings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `settingKey` varchar(100) NOT NULL,
  `settingValue` text,
  `settingType` enum('string','number','boolean','json') DEFAULT 'string',
  `category` varchar(100) DEFAULT 'general',
  `description` text,
  `isEditable` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `systemSettings_settingKey_unique` (`settingKey`),
  UNIQUE KEY `idx_settingKey` (`settingKey`),
  KEY `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `systemSettings`
--

LOCK TABLES `systemSettings` WRITE;
/*!40000 ALTER TABLE `systemSettings` DISABLE KEYS */;
/*!40000 ALTER TABLE `systemSettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `taskMonitoring`
--

DROP TABLE IF EXISTS `taskMonitoring`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `taskMonitoring` (
  `id` int NOT NULL AUTO_INCREMENT,
  `taskId` int NOT NULL,
  `cpuUsage` decimal(5,2) DEFAULT NULL COMMENT 'Porcentagem de uso da CPU',
  `ramUsage` decimal(5,2) DEFAULT NULL COMMENT 'Porcentagem de uso da RAM',
  `gpuUsage` decimal(5,2) DEFAULT NULL COMMENT 'Porcentagem de uso da GPU',
  `executionTime` int DEFAULT NULL COMMENT 'Tempo de execução em segundos',
  `recordedAt` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `idx_taskId` (`taskId`),
  KEY `idx_recordedAt` (`recordedAt`),
  CONSTRAINT `taskMonitoring_taskId_tasks_id_fk` FOREIGN KEY (`taskId`) REFERENCES `tasks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taskMonitoring`
--

LOCK TABLES `taskMonitoring` WRITE;
/*!40000 ALTER TABLE `taskMonitoring` DISABLE KEYS */;
/*!40000 ALTER TABLE `taskMonitoring` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `projectId` int DEFAULT NULL,
  `assignedUserId` int DEFAULT NULL,
  `title` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','planning','in_progress','executing','validating','completed','blocked','failed','cancelled','paused') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `priority` enum('low','medium','high','urgent') COLLATE utf8mb4_unicode_ci DEFAULT 'medium',
  `estimatedHours` decimal(8,2) DEFAULT NULL,
  `actualHours` decimal(8,2) DEFAULT NULL,
  `dueDate` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  `completedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_status` (`status`),
  KEY `idx_priority` (`priority`),
  KEY `idx_projectId` (`projectId`),
  KEY `idx_assignedUserId` (`assignedUserId`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE SET NULL,
  CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`assignedUserId`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `tasks_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (1,1,NULL,NULL,'Implementar feature de busca','Adicionar busca full-text no sistema','pending','high',NULL,NULL,NULL,'2025-10-31 22:04:18','2025-10-31 22:04:18',NULL),(2,1,NULL,NULL,'Corrigir bug no login','UsuÃ¡rios reportando erro ao fazer login','executing','urgent',NULL,NULL,NULL,'2025-10-31 22:04:18','2025-10-31 22:04:18',NULL),(3,1,NULL,NULL,'Melhorar performance do dashboard','Dashboard estÃ¡ carregando devagar','pending','medium',NULL,NULL,NULL,'2025-10-31 22:04:18','2025-10-31 22:04:18',NULL),(4,1,NULL,NULL,'Adicionar testes unitÃ¡rios','Criar testes para mÃ³dulos principais','planning','medium',NULL,NULL,NULL,'2025-10-31 22:04:18','2025-10-31 22:04:18',NULL),(5,1,NULL,NULL,'Documentar API REST','Criar documentaÃ§Ã£o Swagger','completed','low',NULL,NULL,NULL,'2025-10-31 22:04:18','2025-10-31 22:04:18',NULL),(6,1,NULL,NULL,'Implementar autenticaÃ§Ã£o OAuth','Adicionar suporte para login via Google e GitHub','executing','high',NULL,NULL,NULL,'2025-10-31 23:14:52','2025-10-31 23:14:52',NULL),(7,1,NULL,NULL,'Revisar documentaÃ§Ã£o API','Atualizar documentaÃ§Ã£o com novos endpoints','pending','medium',NULL,NULL,NULL,'2025-10-31 23:14:52','2025-10-31 23:14:52',NULL),(8,1,NULL,NULL,'Corrigir bug de performance','Otimizar consultas SQL lentas','executing','urgent',NULL,NULL,NULL,'2025-10-31 23:14:52','2025-10-31 23:14:52',NULL),(9,1,NULL,NULL,'Criar testes unitÃ¡rios','Aumentar cobertura de testes para 80%','planning','medium',NULL,NULL,NULL,'2025-10-31 23:14:52','2025-10-31 23:14:52',NULL),(10,1,NULL,NULL,'Deploy em produÃ§Ã£o V3.2','Fazer deploy da versÃ£o 3.2','pending','high',NULL,NULL,NULL,'2025-10-31 23:14:52','2025-10-31 23:14:52',NULL),(11,1,NULL,NULL,'Integrar com LM Studio','Configurar integraÃ§Ã£o completa','executing','high',NULL,NULL,NULL,'2025-10-31 23:14:52','2025-10-31 23:14:52',NULL),(12,1,NULL,NULL,'Revisar prompts do sistema','Melhorar biblioteca de prompts','completed','low',NULL,NULL,NULL,'2025-10-31 23:14:52','2025-10-31 23:14:52',NULL);
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teamMembers`
--

DROP TABLE IF EXISTS `teamMembers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teamMembers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teamId` int NOT NULL,
  `userId` int NOT NULL,
  `role` enum('owner','admin','member','viewer') DEFAULT 'member',
  `joinedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `teamId` (`teamId`),
  KEY `userId` (`userId`),
  CONSTRAINT `teamMembers_ibfk_1` FOREIGN KEY (`teamId`) REFERENCES `teams` (`id`) ON DELETE CASCADE,
  CONSTRAINT `teamMembers_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teamMembers`
--

LOCK TABLES `teamMembers` WRITE;
/*!40000 ALTER TABLE `teamMembers` DISABLE KEYS */;
/*!40000 ALTER TABLE `teamMembers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `ownerId` int NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ownerId` (`ownerId`),
  CONSTRAINT `teams_ibfk_1` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
INSERT INTO `teams` VALUES (1,'Equipe de Desenvolvimento','Equipe principal de desenvolvimento de IAs',1,1,'2025-10-31 22:48:45','2025-10-31 22:48:45'),(2,'Equipe de QA','Equipe de qualidade e testes',1,1,'2025-10-31 22:48:45','2025-10-31 22:48:45'),(3,'Equipe de DevOps','Equipe de infraestrutura e deployment',1,1,'2025-10-31 22:48:45','2025-10-31 22:48:45');
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trainingDatasets`
--

DROP TABLE IF EXISTS `trainingDatasets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trainingDatasets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `datasetType` enum('text','code','qa','completion','chat') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'text',
  `format` enum('jsonl','csv','txt','parquet') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'jsonl',
  `filePath` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileSize` bigint DEFAULT NULL,
  `recordCount` int DEFAULT '0',
  `metadata` json DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_datasetType` (`datasetType`),
  CONSTRAINT `trainingDatasets_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainingDatasets`
--

LOCK TABLES `trainingDatasets` WRITE;
/*!40000 ALTER TABLE `trainingDatasets` DISABLE KEYS */;
/*!40000 ALTER TABLE `trainingDatasets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trainingJobs`
--

DROP TABLE IF EXISTS `trainingJobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trainingJobs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `datasetId` int NOT NULL,
  `baseModelId` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('pending','preparing','training','validating','completed','failed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `trainingType` enum('fine-tuning','lora','qlora','full') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'lora',
  `hyperparameters` json DEFAULT NULL COMMENT 'learning_rate, epochs, batch_size, etc',
  `progress` decimal(5,2) DEFAULT '0.00' COMMENT 'Progresso em %',
  `currentEpoch` int DEFAULT '0',
  `totalEpochs` int DEFAULT '1',
  `trainingLoss` decimal(10,6) DEFAULT NULL,
  `validationLoss` decimal(10,6) DEFAULT NULL,
  `trainingAccuracy` decimal(5,2) DEFAULT NULL,
  `validationAccuracy` decimal(5,2) DEFAULT NULL,
  `estimatedTimeRemaining` int DEFAULT NULL COMMENT 'Tempo estimado em segundos',
  `startedAt` timestamp NULL DEFAULT NULL,
  `completedAt` timestamp NULL DEFAULT NULL,
  `errorMessage` text COLLATE utf8mb4_unicode_ci,
  `logFilePath` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `baseModelId` (`baseModelId`),
  KEY `idx_userId` (`userId`),
  KEY `idx_status` (`status`),
  KEY `idx_datasetId` (`datasetId`),
  CONSTRAINT `trainingJobs_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `trainingJobs_ibfk_2` FOREIGN KEY (`datasetId`) REFERENCES `trainingDatasets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `trainingJobs_ibfk_3` FOREIGN KEY (`baseModelId`) REFERENCES `aiModels` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainingJobs`
--

LOCK TABLES `trainingJobs` WRITE;
/*!40000 ALTER TABLE `trainingJobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `trainingJobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `openId` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Identificador único obrigatório',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `passwordHash` text COLLATE utf8mb4_unicode_ci,
  `lastLoginAt` timestamp NULL DEFAULT NULL,
  `avatarUrl` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `preferences` json DEFAULT NULL,
  `role` enum('admin','user') COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `createdAt` timestamp NULL DEFAULT (now()),
  `updatedAt` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_openId_unique` (`openId`),
  UNIQUE KEY `idx_openId` (`openId`),
  KEY `idx_email` (`email`),
  KEY `idx_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'flavio-default','Flavio','flavio@local',NULL,NULL,NULL,NULL,NULL,NULL,'admin','2025-10-28 22:14:48','2025-10-28 22:14:48'),(5,'admin','Administrador','admin@localhost',NULL,NULL,NULL,NULL,NULL,NULL,'admin','2025-10-28 23:21:56','2025-10-28 23:21:56');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-31 23:12:54
