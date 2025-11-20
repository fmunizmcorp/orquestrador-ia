#!/bin/bash
#
# Deployment Script - Orquestrador de IAs v3.7.0
# Ensures ALL steps are executed in correct order
# NEVER skip the build step!
#

set -e  # Exit on any error

echo "🚀 ====================================="
echo "🚀 Starting Deployment Process"
echo "🚀 ====================================="
echo ""

# Step 1: Pull latest code
echo "📥 Step 1: Pulling latest code from git..."
git pull origin $(git branch --show-current)
echo "✅ Git pull complete"
echo ""

# Step 2: Install dependencies (if needed)
echo "📦 Step 2: Checking dependencies..."
npm install
echo "✅ Dependencies checked"
echo ""

# Step 3: BUILD (CRITICAL - NEVER SKIP!)
echo "🔨 Step 3: Building project..."
echo "⚠️  This step is CRITICAL - compiles TypeScript & React"
npm run build
BUILD_EXIT=$?

if [ $BUILD_EXIT -ne 0 ]; then
    echo "❌ Build FAILED! Deployment aborted."
    exit 1
fi

echo "✅ Build successful"
echo ""

# Step 4: Verify build output
echo "🔍 Step 4: Verifying build output..."
if [ ! -d "dist/client" ] || [ ! -d "dist/server" ]; then
    echo "❌ Build verification FAILED! dist/ directories missing"
    exit 1
fi

echo "✅ Build output verified"
echo ""

# Step 5: Restart PM2
echo "🔄 Step 5: Restarting PM2..."
pm2 restart orquestrador-v3
echo "✅ PM2 restarted"
echo ""

# Step 6: Wait for server to start
echo "⏳ Step 6: Waiting for server to initialize..."
sleep 3

# Step 7: Health check
echo "🏥 Step 7: Performing health check..."
HEALTH=$(curl -s http://localhost:3001/api/health || echo "FAILED")

if [[ $HEALTH == *"ok"* ]]; then
    echo "✅ Health check PASSED"
else
    echo "❌ Health check FAILED!"
    echo "Response: $HEALTH"
    exit 1
fi
echo ""

# Step 8: Show PM2 status
echo "📊 Step 8: PM2 Status..."
pm2 status
echo ""

# Step 9: Show deployment summary
echo "🎉 ====================================="
echo "🎉 DEPLOYMENT SUCCESSFUL!"
echo "🎉 ====================================="
echo ""
echo "📝 Deployment Summary:"
echo "   - Code pulled from git ✅"
echo "   - Dependencies installed ✅"
echo "   - Project built (client + server) ✅"
echo "   - PM2 restarted ✅"
echo "   - Health check passed ✅"
echo ""
echo "🌐 Server URLs:"
echo "   - Local: http://localhost:3001"
echo "   - External: http://192.168.192.164:3001"
echo "   - External (alt): http://31.97.64.43:3001"
echo ""
echo "📋 Next Steps:"
echo "   1. Clear browser cache (Ctrl+Shift+R)"
echo "   2. Test all fixed bugs"
echo "   3. Monitor PM2 logs: pm2 logs orquestrador-v3"
echo ""
echo "✅ Deployment complete at $(date)"
