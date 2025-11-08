#!/bin/bash
# Auto-generated deployment script for production server
# Execute on: 192.168.1.247

set -e
cd /home/flavio/orquestrador-ia

echo "🚀 Starting deployment V3.5.1..."

# Backup
BACKUP_DIR="/home/flavio/backups/$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
[ -d "dist" ] && cp -r dist "$BACKUP_DIR/"
echo "✅ Backup created: $BACKUP_DIR"

# Update code
echo "📥 Pulling latest code from main..."
git fetch origin main
git checkout main
git pull origin main

# Verify version
VERSION=$(grep '"version"' package.json | head -1 | cut -d'"' -f4)
echo "📌 Version: $VERSION"

# Install & Build
echo "📦 Installing dependencies..."
npm install --production --quiet

echo "🔨 Building application..."
npm run build

# Restart
echo "🔄 Restarting PM2..."
pm2 restart orquestrador-v3 --update-env
sleep 2

# Verify
echo "🏥 Health check..."
curl -f http://localhost:3001/api/health || echo "⚠️ Health check failed"

echo "✅ Deployment complete!"
pm2 status orquestrador-v3
