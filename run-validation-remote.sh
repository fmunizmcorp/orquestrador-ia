#!/bin/bash
###############################################################################
# Script de Validação Remota - Bug Fix Persistência
# 
# Propósito: Transferir e executar teste no servidor de produção
# Uso: ./run-validation-remote.sh
###############################################################################

set -e

echo "🚀 VALIDAÇÃO REMOTA - BUG FIX PERSISTÊNCIA"
echo "=========================================="
echo ""

# Configurações
REMOTE_HOST="31.97.64.43"
REMOTE_PORT="2224"
REMOTE_USER="flavio"
REMOTE_PATH="/home/flavio/orquestrador-ia"
LOCAL_TEST_SCRIPT="test-create-via-trpc.mjs"

echo "📋 Configurações:"
echo "   Host: ${REMOTE_HOST}:${REMOTE_PORT}"
echo "   User: ${REMOTE_USER}"
echo "   Path: ${REMOTE_PATH}"
echo ""

# Step 1: Verificar se script local existe
echo "1️⃣ Verificando script local..."
if [ ! -f "$LOCAL_TEST_SCRIPT" ]; then
    echo "   ❌ Erro: Script ${LOCAL_TEST_SCRIPT} não encontrado!"
    exit 1
fi
echo "   ✅ Script encontrado"
echo ""

# Step 2: Transferir script para servidor
echo "2️⃣ Transferindo script para servidor..."
echo "   Executando: scp -P ${REMOTE_PORT} ${LOCAL_TEST_SCRIPT} ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/"
scp -P "${REMOTE_PORT}" "${LOCAL_TEST_SCRIPT}" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/" || {
    echo "   ❌ Erro ao transferir script"
    echo "   Verifique:"
    echo "   - Autenticação SSH está configurada"
    echo "   - Servidor está acessível"
    echo "   - Permissões de escrita no diretório remoto"
    exit 1
}
echo "   ✅ Script transferido"
echo ""

# Step 3: Executar teste no servidor
echo "3️⃣ Executando teste no servidor..."
echo "   Conectando via SSH..."
ssh -p "${REMOTE_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" << 'ENDSSH'
    cd /home/flavio/orquestrador-ia
    
    echo "   📍 Diretório atual: $(pwd)"
    echo "   📄 Arquivos disponíveis:"
    ls -lah test-create-via-trpc.mjs 2>/dev/null || echo "      ⚠️ Script não encontrado!"
    echo ""
    
    echo "   🧪 Executando teste..."
    node test-create-via-trpc.mjs
    
    TEST_RESULT=$?
    echo ""
    
    if [ $TEST_RESULT -eq 0 ]; then
        echo "   🎉 TESTE PASSOU!"
        exit 0
    else
        echo "   ❌ TESTE FALHOU!"
        echo ""
        echo "   Verificando logs do servidor..."
        pm2 logs orquestrador-v3 --lines 20 --nostream
        exit 1
    fi
ENDSSH

TEST_RESULT=$?
echo ""

# Step 4: Resultado final
if [ $TEST_RESULT -eq 0 ]; then
    echo "✅ VALIDAÇÃO COMPLETA COM SUCESSO!"
    echo ""
    echo "🎊 BUG FIX CONFIRMADO! 🎊"
    echo ""
    echo "📊 Resultados:"
    echo "   ✅ Script executado sem erros"
    echo "   ✅ Projeto criado com sucesso"
    echo "   ✅ Dados persistidos no banco"
    echo "   ✅ tRPC funcionando corretamente"
    echo ""
    echo "📝 Próximos passos:"
    echo "   1. Atualizar status no GitHub"
    echo "   2. Comunicar ao time de QA"
    echo "   3. Monitorar logs por 24h"
    echo ""
else
    echo "❌ VALIDAÇÃO FALHOU!"
    echo ""
    echo "🔍 Ações recomendadas:"
    echo "   1. Verificar logs: pm2 logs orquestrador-v3"
    echo "   2. Verificar build: ls -lah dist/"
    echo "   3. Verificar versão: cat package.json | grep version"
    echo "   4. Rebuild se necessário: npm run build && pm2 restart orquestrador-v3"
    echo ""
    exit 1
fi
