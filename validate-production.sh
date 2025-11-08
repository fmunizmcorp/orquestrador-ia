
# Validation commands to run on production server after deployment

# 1. Check version
grep version /home/flavio/orquestrador-ia/package.json

# 2. Check PM2 status
pm2 status orquestrador-v3

# 3. Check health
curl http://localhost:3001/api/health

# 4. Run automated test
cd /home/flavio/orquestrador-ia
node test-create-via-trpc.mjs

# 5. Check logs
pm2 logs orquestrador-v3 --lines 20 --nostream
