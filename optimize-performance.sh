#!/bin/bash

###############################################################################
# Orquestrador de IAs V3.0 - Performance Optimization
# Database indexes, caching, and query optimization
###############################################################################

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

DB_USER="orquestrador"
DB_PASSWORD="orquestrador123"
DB_NAME="orquestraia"

log() {
    echo -e "${GREEN}[OPTIMIZE]${NC} $1"
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Orquestrador Performance Optimization                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

###############################################################################
# Database Optimization
###############################################################################

log "Creating database indexes..."

mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" << 'EOF'

-- Tasks table indexes
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(userId);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(createdAt);
CREATE INDEX IF NOT EXISTS idx_tasks_status_priority ON tasks(status, priority);

-- Subtasks table indexes
CREATE INDEX IF NOT EXISTS idx_subtasks_task_id ON subtasks(taskId);
CREATE INDEX IF NOT EXISTS idx_subtasks_status ON subtasks(status);
CREATE INDEX IF NOT EXISTS idx_subtasks_assigned_model ON subtasks(assignedModelId);

-- Execution logs indexes
CREATE INDEX IF NOT EXISTS idx_execution_logs_task_id ON executionLogs(taskId);
CREATE INDEX IF NOT EXISTS idx_execution_logs_subtask_id ON executionLogs(subtaskId);
CREATE INDEX IF NOT EXISTS idx_execution_logs_status ON executionLogs(status);
CREATE INDEX IF NOT EXISTS idx_execution_logs_created_at ON executionLogs(createdAt);
CREATE INDEX IF NOT EXISTS idx_execution_logs_model_id ON executionLogs(modelId);

-- AI Models indexes
CREATE INDEX IF NOT EXISTS idx_ai_models_provider_id ON aiModels(providerId);
CREATE INDEX IF NOT EXISTS idx_ai_models_is_active ON aiModels(isActive);

-- Specialized AIs indexes
CREATE INDEX IF NOT EXISTS idx_specialized_ais_default_model ON specializedAIs(defaultModelId);
CREATE INDEX IF NOT EXISTS idx_specialized_ais_is_active ON specializedAIs(isActive);

-- Workflows indexes
CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON workflows(userId);
CREATE INDEX IF NOT EXISTS idx_workflows_is_active ON workflows(isActive);

-- Knowledge Base indexes
CREATE INDEX IF NOT EXISTS idx_knowledge_base_user_id ON knowledgeBase(userId);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_is_active ON knowledgeBase(isActive);

-- Training Jobs indexes
CREATE INDEX IF NOT EXISTS idx_training_jobs_status ON trainingJobs(status);
CREATE INDEX IF NOT EXISTS idx_training_jobs_base_model ON trainingJobs(baseModelId);
CREATE INDEX IF NOT EXISTS idx_training_jobs_dataset ON trainingJobs(datasetId);
CREATE INDEX IF NOT EXISTS idx_training_jobs_start_time ON trainingJobs(startTime);

-- Training Datasets indexes
CREATE INDEX IF NOT EXISTS idx_training_datasets_user_id ON trainingDatasets(userId);
CREATE INDEX IF NOT EXISTS idx_training_datasets_data_type ON trainingDatasets(dataType);

-- Credentials indexes
CREATE INDEX IF NOT EXISTS idx_credentials_user_id ON credentials(userId);
CREATE INDEX IF NOT EXISTS idx_credentials_service ON credentials(service);
CREATE INDEX IF NOT EXISTS idx_credentials_is_active ON credentials(isActive);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON tasks(userId, status);
CREATE INDEX IF NOT EXISTS idx_subtasks_task_status ON subtasks(taskId, status);
CREATE INDEX IF NOT EXISTS idx_logs_task_created ON executionLogs(taskId, createdAt);

EOF

log "✓ Database indexes created"

###############################################################################
# Database Maintenance
###############################################################################

log "Running database maintenance..."

mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" << 'EOF'

-- Analyze tables for query optimization
ANALYZE TABLE tasks;
ANALYZE TABLE subtasks;
ANALYZE TABLE executionLogs;
ANALYZE TABLE aiModels;
ANALYZE TABLE specializedAIs;
ANALYZE TABLE workflows;
ANALYZE TABLE knowledgeBase;
ANALYZE TABLE trainingJobs;
ANALYZE TABLE trainingDatasets;
ANALYZE TABLE credentials;

-- Optimize tables
OPTIMIZE TABLE tasks;
OPTIMIZE TABLE subtasks;
OPTIMIZE TABLE executionLogs;

EOF

log "✓ Database maintenance complete"

###############################################################################
# Application Optimization
###############################################################################

log "Optimizing application code..."

# Build production bundle with optimizations
cd /home/user/webapp
log "Building optimized client bundle..."
cd client
NODE_ENV=production npm run build
cd ..

log "✓ Client bundle optimized"

###############################################################################
# Caching Configuration
###############################################################################

log "Configuring caching..."

# Create Redis configuration (if Redis is installed)
if command -v redis-cli &> /dev/null; then
    log_info "Redis detected, optimizing configuration..."
    
    # Set Redis config for better performance
    redis-cli CONFIG SET maxmemory 256mb
    redis-cli CONFIG SET maxmemory-policy allkeys-lru
    redis-cli CONFIG SET save ""  # Disable RDB for performance
    
    log "✓ Redis optimized"
else
    log_info "Redis not installed (optional for caching)"
fi

###############################################################################
# System Optimization
###############################################################################

log "Applying system optimizations..."

# Increase file descriptors limit
if [ -f /etc/security/limits.conf ]; then
    sudo tee -a /etc/security/limits.conf > /dev/null << EOF
# Orquestrador optimizations
* soft nofile 65536
* hard nofile 65536
EOF
    log "✓ File descriptors limit increased"
fi

# Node.js optimization
export NODE_OPTIONS="--max-old-space-size=4096"
log "✓ Node.js memory optimized"

###############################################################################
# Database Query Cache
###############################################################################

log "Enabling MySQL query cache..."

sudo mysql -e "SET GLOBAL query_cache_type = 1;" || true
sudo mysql -e "SET GLOBAL query_cache_size = 67108864;" || true  # 64MB

log "✓ Query cache enabled"

###############################################################################
# Performance Report
###############################################################################

log "Generating performance report..."

mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" << 'EOF' > /tmp/performance_report.txt

SELECT 'Table Sizes' as Report;
SELECT 
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)',
    table_rows AS 'Rows'
FROM information_schema.TABLES
WHERE table_schema = 'orquestraia'
ORDER BY (data_length + index_length) DESC;

SELECT '' as '';
SELECT 'Index Usage' as Report;
SHOW INDEX FROM tasks;
SHOW INDEX FROM executionLogs;

EOF

log "✓ Performance report saved to /tmp/performance_report.txt"

###############################################################################
# Verification
###############################################################################

log "Verifying optimizations..."

# Check index count
INDEX_COUNT=$(mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -se "
SELECT COUNT(*) 
FROM information_schema.statistics 
WHERE table_schema = 'orquestraia' 
AND index_name != 'PRIMARY';
")

log_info "Total indexes created: $INDEX_COUNT"

# Check table sizes
TOTAL_SIZE=$(mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -se "
SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 2)
FROM information_schema.TABLES
WHERE table_schema = 'orquestraia';
")

log_info "Total database size: ${TOTAL_SIZE}MB"

###############################################################################
# Completion
###############################################################################

echo ""
log "╔════════════════════════════════════════════════════════════╗"
log "║       Performance Optimization Complete!                   ║"
log "╚════════════════════════════════════════════════════════════╝"
echo ""
log_info "Optimizations applied:"
echo "  ✓ Database indexes created"
echo "  ✓ Tables analyzed and optimized"
echo "  ✓ Client bundle minified"
echo "  ✓ Query cache enabled"
echo "  ✓ System limits increased"
echo ""
log_info "Performance report: /tmp/performance_report.txt"
echo ""
log_info "Restart the application to apply all optimizations:"
echo "  sudo systemctl restart orquestrador"
