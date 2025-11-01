#!/bin/bash

# Tables defined in schema.ts
SCHEMA_TABLES=(users aiProviders aiModels specializedAIs credentials externalAPIAccounts tasks subtasks chatConversations chatMessages aiTemplates aiWorkflows instructions knowledgeBase knowledgeSources modelDiscovery modelRatings storage taskMonitoring executionLogs creditUsage credentialTemplates aiQualityMetrics trainingDatasets trainingJobs modelVersions puppeteerSessions puppeteerResults teams teamMembers projects taskDependencies orchestrationLogs crossValidations hallucinationDetections executionResults messageAttachments messageReactions systemMetrics apiUsage errorLogs auditLogs externalServices oauthTokens apiCredentials prompts promptVersions systemSettings)

# Tables in MySQL
DB_TABLES=$(mysql -u flavio -pbdflavioia orquestraia -sN -e "SHOW TABLES" 2>/dev/null)

echo "=== MISSING TABLES IN DATABASE ==="
for table in "${SCHEMA_TABLES[@]}"; do
  if ! echo "$DB_TABLES" | grep -q "^${table}$"; then
    echo "❌ $table"
  fi
done

echo ""
echo "=== TABLES IN DB BUT NOT IN SCHEMA ==="
while IFS= read -r dbtable; do
  found=0
  for stable in "${SCHEMA_TABLES[@]}"; do
    if [ "$dbtable" = "$stable" ]; then
      found=1
      break
    fi
  done
  if [ $found -eq 0 ]; then
    echo "⚠️  $dbtable"
  fi
done <<< "$DB_TABLES"
