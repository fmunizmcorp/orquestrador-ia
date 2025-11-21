#!/bin/bash
# Sprint 70: Setup Redis with Disk Persistence
# This script configures and starts Redis with optimized settings

set -e

echo "======================================================"
echo "🔧 SPRINT 70: Redis Setup with Disk Persistence"
echo "======================================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root or with sudo
if [ "$EUID" -eq 0 ]; then
  SUDO=""
else
  SUDO="sudo"
fi

echo "1. Checking Redis installation..."
if ! command -v redis-server &> /dev/null; then
    echo -e "${RED}❌ Redis is not installed${NC}"
    echo "Installing Redis..."
    $SUDO apt-get update
    $SUDO apt-get install -y redis-server
    echo -e "${GREEN}✅ Redis installed${NC}"
else
    echo -e "${GREEN}✅ Redis is already installed${NC}"
fi

echo ""
echo "2. Stopping Redis if running..."
$SUDO systemctl stop redis-server 2>/dev/null || $SUDO service redis-server stop 2>/dev/null || echo "Redis not running"

echo ""
echo "3. Backing up existing Redis config..."
if [ -f /etc/redis/redis.conf ]; then
    $SUDO cp /etc/redis/redis.conf /etc/redis/redis.conf.backup.$(date +%Y%m%d_%H%M%S)
    echo -e "${GREEN}✅ Backup created${NC}"
fi

echo ""
echo "4. Copying optimized Redis config..."
if [ -f "$(dirname "$0")/../redis.conf" ]; then
    $SUDO cp "$(dirname "$0")/../redis.conf" /etc/redis/redis.conf
    echo -e "${GREEN}✅ Config copied${NC}"
else
    echo -e "${RED}❌ redis.conf not found in project root${NC}"
    exit 1
fi

echo ""
echo "5. Creating Redis directories..."
$SUDO mkdir -p /var/lib/redis
$SUDO mkdir -p /var/log/redis
$SUDO mkdir -p /var/run/redis
$SUDO chown -R redis:redis /var/lib/redis /var/log/redis /var/run/redis
echo -e "${GREEN}✅ Directories created${NC}"

echo ""
echo "6. Setting permissions..."
$SUDO chmod 640 /etc/redis/redis.conf
$SUDO chown redis:redis /etc/redis/redis.conf
echo -e "${GREEN}✅ Permissions set${NC}"

echo ""
echo "7. Starting Redis..."
$SUDO systemctl start redis-server || $SUDO service redis-server start
sleep 2

echo ""
echo "8. Checking Redis status..."
if $SUDO systemctl is-active --quiet redis-server 2>/dev/null || pgrep redis-server > /dev/null; then
    echo -e "${GREEN}✅ Redis is running${NC}"
    
    echo ""
    echo "9. Testing Redis connection..."
    if redis-cli ping | grep -q "PONG"; then
        echo -e "${GREEN}✅ Redis connection successful${NC}"
        
        echo ""
        echo "10. Redis Info:"
        redis-cli info | grep -E "redis_version|used_memory_human|maxmemory|aof_enabled|rdb_last_save_time"
    else
        echo -e "${RED}❌ Redis connection failed${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Redis failed to start${NC}"
    echo "Check logs: sudo tail -f /var/log/redis/redis-server.log"
    exit 1
fi

echo ""
echo "======================================================"
echo -e "${GREEN}✅ Redis setup complete!${NC}"
echo "======================================================"
echo ""
echo "Redis Configuration:"
echo "  - Max Memory: 256MB"
echo "  - Eviction Policy: allkeys-lru"
echo "  - RDB Persistence: Enabled (save 900 1, 300 10, 60 10000)"
echo "  - AOF Persistence: Enabled (appendfsync everysec)"
echo "  - Data Directory: /var/lib/redis"
echo "  - Log File: /var/log/redis/redis-server.log"
echo ""
echo "Useful commands:"
echo "  - Check status: sudo systemctl status redis-server"
echo "  - View logs: sudo tail -f /var/log/redis/redis-server.log"
echo "  - Test connection: redis-cli ping"
echo "  - Monitor: redis-cli monitor"
echo ""
