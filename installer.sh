#!/bin/bash

###############################################################################
# Orquestrador de IAs V3.0 - Robust Installer
# Complete automated installation with dependency checking and rollback
###############################################################################

set -e  # Exit on error

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Installation log
LOG_FILE="/tmp/orquestrador_install_$(date +%Y%m%d_%H%M%S).log"
BACKUP_DIR="/tmp/orquestrador_backup_$(date +%Y%m%d_%H%M%S)"

# Configuration
DB_NAME="orquestraia"
DB_USER="orquestrador"
DB_PASSWORD="orquestrador123"
NODE_VERSION="18"
LM_STUDIO_PORT="1234"
SERVER_PORT="3001"

###############################################################################
# Utility Functions
###############################################################################

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$LOG_FILE"
}

check_command() {
    if command -v "$1" &> /dev/null; then
        return 0
    else
        return 1
    fi
}

create_backup() {
    log "Creating backup directory: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
    
    # Backup existing installation if present
    if [ -d "/home/user/webapp" ]; then
        log "Backing up existing installation..."
        cp -r /home/user/webapp "$BACKUP_DIR/" || true
    fi
    
    # Backup database if exists
    if check_command mysql; then
        log "Backing up database..."
        mysqldump -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" > "$BACKUP_DIR/database_backup.sql" 2>/dev/null || true
    fi
}

rollback() {
    log_error "Installation failed. Initiating rollback..."
    
    if [ -d "$BACKUP_DIR/webapp" ]; then
        log "Restoring previous installation..."
        rm -rf /home/user/webapp
        cp -r "$BACKUP_DIR/webapp" /home/user/webapp
    fi
    
    if [ -f "$BACKUP_DIR/database_backup.sql" ]; then
        log "Restoring database..."
        mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$BACKUP_DIR/database_backup.sql" 2>/dev/null || true
    fi
    
    log_error "Rollback complete. Check log file: $LOG_FILE"
    exit 1
}

trap rollback ERR

###############################################################################
# Dependency Checks
###############################################################################

check_dependencies() {
    log "Checking system dependencies..."
    
    local missing_deps=()
    
    # Check Node.js
    if check_command node; then
        NODE_VERSION_INSTALLED=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_VERSION_INSTALLED" -lt "$NODE_VERSION" ]; then
            log_warning "Node.js version $NODE_VERSION_INSTALLED is older than required version $NODE_VERSION"
            missing_deps+=("node")
        else
            log "✓ Node.js v$NODE_VERSION_INSTALLED installed"
        fi
    else
        log_warning "Node.js not found"
        missing_deps+=("node")
    fi
    
    # Check npm
    if check_command npm; then
        log "✓ npm $(npm -v) installed"
    else
        log_warning "npm not found"
        missing_deps+=("npm")
    fi
    
    # Check MySQL/MariaDB
    if check_command mysql; then
        log "✓ MySQL/MariaDB installed"
    else
        log_warning "MySQL/MariaDB not found"
        missing_deps+=("mysql")
    fi
    
    # Check Git
    if check_command git; then
        log "✓ Git $(git --version | cut -d' ' -f3) installed"
    else
        log_warning "Git not found"
        missing_deps+=("git")
    fi
    
    # Check Python (for LM Studio alternative)
    if check_command python3; then
        log "✓ Python $(python3 --version | cut -d' ' -f2) installed"
    else
        log_warning "Python3 not found (optional)"
    fi
    
    if [ ${#missing_deps[@]} -gt 0 ]; then
        log_error "Missing dependencies: ${missing_deps[*]}"
        log_info "Attempting to install missing dependencies..."
        install_dependencies "${missing_deps[@]}"
    fi
}

install_dependencies() {
    log "Installing dependencies: $*"
    
    # Detect package manager
    if check_command apt-get; then
        sudo apt-get update
        for dep in "$@"; do
            case $dep in
                node|npm)
                    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
                    sudo apt-get install -y nodejs
                    ;;
                mysql)
                    sudo apt-get install -y mariadb-server mariadb-client
                    sudo systemctl start mariadb
                    sudo systemctl enable mariadb
                    ;;
                git)
                    sudo apt-get install -y git
                    ;;
            esac
        done
    elif check_command yum; then
        sudo yum update -y
        for dep in "$@"; do
            case $dep in
                node|npm)
                    curl -fsSL https://rpm.nodesource.com/setup_${NODE_VERSION}.x | sudo bash -
                    sudo yum install -y nodejs
                    ;;
                mysql)
                    sudo yum install -y mariadb-server
                    sudo systemctl start mariadb
                    sudo systemctl enable mariadb
                    ;;
                git)
                    sudo yum install -y git
                    ;;
            esac
        done
    else
        log_error "Unsupported package manager. Please install dependencies manually."
        exit 1
    fi
}

###############################################################################
# Database Setup
###############################################################################

setup_database() {
    log "Setting up database..."
    
    # Check if MariaDB is running
    if ! sudo systemctl is-active --quiet mariadb; then
        log "Starting MariaDB..."
        sudo systemctl start mariadb
    fi
    
    # Create database and user
    log "Creating database and user..."
    sudo mysql -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" || true
    sudo mysql -e "CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';" || true
    sudo mysql -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';" || true
    sudo mysql -e "FLUSH PRIVILEGES;" || true
    
    log "✓ Database setup complete"
}

###############################################################################
# Application Installation
###############################################################################

install_application() {
    log "Installing application..."
    
    cd /home/user/webapp
    
    # Install server dependencies
    log "Installing server dependencies..."
    npm install
    
    # Install client dependencies
    log "Installing client dependencies..."
    cd client
    npm install
    cd ..
    
    # Create .env file if not exists
    if [ ! -f ".env" ]; then
        log "Creating .env file..."
        cat > .env << EOF
DATABASE_URL=mysql://$DB_USER:$DB_PASSWORD@localhost:3306/$DB_NAME
LM_STUDIO_URL=http://localhost:$LM_STUDIO_PORT/v1
PORT=$SERVER_PORT
NODE_ENV=production
ENCRYPTION_KEY=$(openssl rand -hex 32)
EOF
        log "✓ .env file created"
    fi
    
    # Run database migrations
    log "Running database migrations..."
    npm run db:push || log_warning "Database push failed (may be expected)"
    
    # Build client
    log "Building client application..."
    cd client
    npm run build
    cd ..
    
    log "✓ Application installation complete"
}

###############################################################################
# Health Checks
###############################################################################

run_health_checks() {
    log "Running health checks..."
    
    # Check database connection
    if mysql -u "$DB_USER" -p"$DB_PASSWORD" -e "USE $DB_NAME;" 2>/dev/null; then
        log "✓ Database connection successful"
    else
        log_error "Database connection failed"
        return 1
    fi
    
    # Check if required files exist
    local required_files=(
        "/home/user/webapp/package.json"
        "/home/user/webapp/server/index.ts"
        "/home/user/webapp/client/package.json"
        "/home/user/webapp/.env"
    )
    
    for file in "${required_files[@]}"; do
        if [ -f "$file" ]; then
            log "✓ Found: $file"
        else
            log_error "Missing: $file"
            return 1
        fi
    done
    
    # Check ports availability
    if ! lsof -Pi :$SERVER_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        log "✓ Port $SERVER_PORT is available"
    else
        log_warning "Port $SERVER_PORT is already in use"
    fi
    
    log "✓ Health checks passed"
}

###############################################################################
# Service Setup
###############################################################################

setup_systemd_service() {
    log "Setting up systemd service..."
    
    sudo tee /etc/systemd/system/orquestrador.service > /dev/null << EOF
[Unit]
Description=Orquestrador de IAs V3.0
After=network.target mariadb.service

[Service]
Type=simple
User=$USER
WorkingDirectory=/home/user/webapp
Environment="NODE_ENV=production"
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
    
    sudo systemctl daemon-reload
    sudo systemctl enable orquestrador
    
    log "✓ Systemd service configured"
}

###############################################################################
# Post-Installation
###############################################################################

post_installation() {
    log "Running post-installation tasks..."
    
    # Create data directories
    mkdir -p /home/user/webapp/training_data
    mkdir -p /home/user/webapp/model_checkpoints
    mkdir -p /home/user/webapp/uploads
    
    # Set permissions
    chmod -R 755 /home/user/webapp
    
    # Create success marker
    touch /home/user/webapp/.installation_complete
    
    log "✓ Post-installation complete"
}

###############################################################################
# Main Installation Flow
###############################################################################

main() {
    clear
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║     Orquestrador de IAs V3.0 - Robust Installer           ║"
    echo "║                                                            ║"
    echo "║     Sistema completo de orquestração de IAs               ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    log_info "Starting installation..."
    log_info "Log file: $LOG_FILE"
    
    # Step 1: Create backup
    create_backup
    
    # Step 2: Check dependencies
    check_dependencies
    
    # Step 3: Setup database
    setup_database
    
    # Step 4: Install application
    install_application
    
    # Step 5: Run health checks
    run_health_checks
    
    # Step 6: Setup service
    setup_systemd_service
    
    # Step 7: Post-installation
    post_installation
    
    # Success
    echo ""
    log "╔════════════════════════════════════════════════════════════╗"
    log "║              Installation Completed Successfully!          ║"
    log "╚════════════════════════════════════════════════════════════╝"
    echo ""
    log_info "To start the application:"
    echo "  sudo systemctl start orquestrador"
    echo ""
    log_info "To view logs:"
    echo "  sudo journalctl -u orquestrador -f"
    echo ""
    log_info "Access the application at:"
    echo "  http://localhost:$SERVER_PORT"
    echo ""
    log_info "Installation log saved to: $LOG_FILE"
    log_info "Backup created at: $BACKUP_DIR"
}

# Run main installation
main "$@"
