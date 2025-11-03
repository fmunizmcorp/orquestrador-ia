#!/bin/bash

echo "🚀 =================================================="
echo "   DEPLOY MANUAL - Orquestrador IA V3.0"
echo "   Carregamento Inteligente de Modelos"
echo "=================================================="
echo ""

# Configurações SSH
SSH_HOST="31.97.64.43"
SSH_PORT="2224"
SSH_USER="flavio"
SSH_PASS="sshflavioia"
REMOTE_DIR="/home/flavio/webapp"

echo "📋 INSTRUÇÕES DE DEPLOY MANUAL"
echo "================================"
echo ""
echo "Execute os seguintes comandos manualmente:"
echo ""

echo "1️⃣  CONECTAR AO SERVIDOR:"
echo "   ssh -p $SSH_PORT $SSH_USER@$SSH_HOST"
echo "   Senha: $SSH_PASS"
echo ""

echo "2️⃣  NAVEGAR PARA O DIRETÓRIO DO PROJETO:"
echo "   cd $REMOTE_DIR"
echo ""

echo "3️⃣  CRIAR ARQUIVO modelLoaderService.ts:"
echo "   cat > server/services/modelLoaderService.ts << 'EOF'"
cat server/services/modelLoaderService.ts
echo "EOF"
echo ""

echo "4️⃣  CRIAR ARQUIVO externalAPIService.ts:"
echo "   cat > server/services/externalAPIService.ts << 'EOF'"
cat server/services/externalAPIService.ts
echo "EOF"
echo ""

echo "5️⃣  COMPILAR TYPESCRIPT:"
echo "   npm run build"
echo ""

echo "6️⃣  REINICIAR SERVIDOR:"
echo "   pm2 restart ecosystem.config.cjs"
echo ""

echo "7️⃣  VERIFICAR STATUS:"
echo "   pm2 status"
echo "   pm2 logs --lines 50"
echo ""

echo "8️⃣  FAZER COMMIT NO SERVIDOR (OPCIONAL):"
echo "   git add server/services/modelLoaderService.ts server/services/externalAPIService.ts"
echo "   git commit -m 'feat: implementação completa de carregamento inteligente de modelos'"
echo "   git push origin genspark_ai_developer"
echo ""

echo "✅ VERIFICAÇÃO:"
echo "   curl http://localhost:3001/health"
echo ""
echo "=================================================="
