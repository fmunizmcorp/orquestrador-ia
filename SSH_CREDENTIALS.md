# SSH CREDENTIALS - PRODUCTION SERVER

## Access Information
- **External Gateway**: `flavio@31.97.64.43`
- **SSH Port**: `2224`
- **Password**: `sshflavioia`
- **Internal Production Server**: `192.168.1.247` (NOT externally accessible)
- **Application Port**: `3001` (localhost only, internal network access)

## Access Method
```bash
# Connect to gateway (this provides access to internal network)
sshpass -p 'sshflavioia' ssh -p 2224 -o StrictHostKeyChecking=no flavio@31.97.64.43

# Once inside, the application runs on localhost:3001
# It is NOT accessible from 31.97.64.43:3001 (different site runs there)
# Application is only accessible within internal network
```

## Database Credentials
- **Host**: `localhost`
- **Port**: `3306`
- **Database**: `orquestraia`
- **User**: `flavio`
- **Password**: `bdflavioia`

## Important Notes
- Application is deployed to **192.168.1.247** (internal only)
- Access is via SSH tunnel through 31.97.64.43:2224
- Testing is done via `curl http://localhost:3001/` from inside SSH session
- This is a PRIVATE INTERNAL APPLICATION, not publicly accessible

## Last Updated
2025-11-08
