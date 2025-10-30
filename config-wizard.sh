#!/bin/bash

###############################################################################
# Orquestrador de IAs V3.0 - Configuration Wizard
# Interactive configuration setup
###############################################################################

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

clear
echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Orquestrador de IAs V3.0 - Configuration Wizard       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Check if .env exists
if [ -f ".env" ]; then
    echo -e "${YELLOW}Existing .env file found. Backup will be created.${NC}"
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
fi

# Database Configuration
echo -e "${GREEN}=== Database Configuration ===${NC}"
read -p "Database name [orquestraia]: " DB_NAME
DB_NAME=${DB_NAME:-orquestraia}

read -p "Database user [orquestrador]: " DB_USER
DB_USER=${DB_USER:-orquestrador}

read -sp "Database password [orquestrador123]: " DB_PASSWORD
DB_PASSWORD=${DB_PASSWORD:-orquestrador123}
echo ""

read -p "Database host [localhost]: " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Database port [3306]: " DB_PORT
DB_PORT=${DB_PORT:-3306}

# LM Studio Configuration
echo ""
echo -e "${GREEN}=== LM Studio Configuration ===${NC}"
read -p "LM Studio URL [http://localhost:1234/v1]: " LM_STUDIO_URL
LM_STUDIO_URL=${LM_STUDIO_URL:-http://localhost:1234/v1}

# Server Configuration
echo ""
echo -e "${GREEN}=== Server Configuration ===${NC}"
read -p "Server port [3001]: " PORT
PORT=${PORT:-3001}

read -p "Environment (development/production) [production]: " NODE_ENV
NODE_ENV=${NODE_ENV:-production}

# Security Configuration
echo ""
echo -e "${GREEN}=== Security Configuration ===${NC}"
echo "Generating encryption key..."
ENCRYPTION_KEY=$(openssl rand -hex 32)
echo "✓ Encryption key generated"

# Create .env file
echo ""
echo -e "${GREEN}=== Creating .env file ===${NC}"

cat > .env << EOF
# Database Configuration
DATABASE_URL=mysql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME

# LM Studio Configuration
LM_STUDIO_URL=$LM_STUDIO_URL

# Server Configuration
PORT=$PORT
NODE_ENV=$NODE_ENV

# Security
ENCRYPTION_KEY=$ENCRYPTION_KEY

# Optional: External Services
# OPENAI_API_KEY=your_key_here
# ANTHROPIC_API_KEY=your_key_here
# GOOGLE_AI_API_KEY=your_key_here

# Optional: Monitoring
# SENTRY_DSN=your_sentry_dsn
# LOG_LEVEL=info
EOF

echo ""
echo -e "${GREEN}✓ Configuration saved to .env${NC}"
echo ""
echo -e "${BLUE}=== Configuration Summary ===${NC}"
echo "Database: $DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"
echo "LM Studio: $LM_STUDIO_URL"
echo "Server Port: $PORT"
echo "Environment: $NODE_ENV"
echo ""
echo -e "${GREEN}Configuration complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Review the .env file"
echo "2. Run: npm run db:push"
echo "3. Run: npm start"
