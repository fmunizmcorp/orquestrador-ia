# Redis Installation Manual

## Current Status
- ✅ Redis configuration file created: `redis.conf`
- ✅ Redis setup script created: `scripts/setup-redis.sh`
- ❌ Redis **NOT INSTALLED** on production server (requires sudo password)

## Manual Installation Required

Redis installation requires **sudo privileges** and must be done manually by the system administrator.

### Installation Steps

1. **SSH into production server:**
   ```bash
   ssh -p 2224 flavio@31.97.64.43
   ```

2. **Navigate to webapp directory:**
   ```bash
   cd /home/flavio/webapp
   ```

3. **Run the setup script with sudo:**
   ```bash
   sudo bash setup-redis.sh
   ```

   This script will:
   - Install Redis server from official repositories
   - Copy the custom `redis.conf` configuration
   - Enable Redis service to start on boot
   - Start Redis service immediately

4. **Verify installation:**
   ```bash
   redis-cli ping
   ```
   
   Expected output: `PONG`

5. **Check Redis status:**
   ```bash
   sudo systemctl status redis
   ```

## Redis Configuration Highlights

The custom `redis.conf` includes:

- **Memory limit:** 256MB with LRU eviction policy
- **Persistence:** RDB snapshots + AOF for data durability
- **Network:** Listens on 127.0.0.1:6379 (localhost only)
- **Security:** Protected mode enabled

## Application Compatibility

**IMPORTANT:** The application is designed to work **with or without Redis**.

- **With Redis:** Performance boost via caching, reduced database queries
- **Without Redis:** Full functionality maintained, slightly slower query times

No code changes needed - the application detects Redis availability automatically.

## Why Redis is Beneficial

1. **Performance:** Caches frequently accessed data
2. **Scalability:** Reduces database load
3. **Reliability:** Persistent storage prevents data loss on restart
4. **Memory efficiency:** LRU eviction prevents memory overflow

## Sprint 71 Note

Redis installation was attempted in Sprint 71 but requires manual sudo password input. All configuration files are ready for deployment.
