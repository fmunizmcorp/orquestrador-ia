#!/bin/bash

# corrigir-sistema.sh
# Script para corrigir problemas do Orquestrador V3
# Executa LOCALMENTE no servidor (192.168.1.247)

set -e

DIR="/home/flavio/orquestrador-ia"

echo "═══════════════════════════════════════════════════════════"
echo "  Correção Automática - Orquestrador V3"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Verificar se estamos no diretório correto
if [ ! -d "$DIR" ]; then
    echo "❌ Erro: Diretório $DIR não encontrado"
    echo "Este script deve ser executado no servidor 192.168.1.247"
    exit 1
fi

cd "$DIR"
echo "✅ Diretório: $DIR"
echo ""

# 1. Parar PM2
echo "1️⃣  Parando PM2..."
pm2 stop orquestrador-v3 2>/dev/null || true
pm2 delete orquestrador-v3 2>/dev/null || true
echo "✅ PM2 parado"
echo ""

# 2. Verificar e criar tabelas se necessário
echo "2️⃣  Verificando banco de dados..."
TABELAS=$(mysql -u flavio -pbdflavioia orquestrador_v3 -e "SHOW TABLES;" 2>/dev/null | wc -l)
if [ "$TABELAS" -lt 24 ]; then
    echo "⚠️  Tabelas faltando, recriando..."
    npm run db:push
    echo "✅ Tabelas recriadas"
else
    echo "✅ Banco de dados OK ($TABELAS tabelas)"
fi
echo ""

# 3. Verificar dados básicos
echo "3️⃣  Verificando dados básicos..."
MODELOS=$(mysql -u flavio -pbdflavioia orquestrador_v3 -se "SELECT COUNT(*) FROM aiModels;" 2>/dev/null || echo "0")
if [ "$MODELOS" -eq 0 ]; then
    echo "⚠️  Populando dados básicos..."
    mysql -u flavio -pbdflavioia orquestrador_v3 << 'SQLEOF'
INSERT IGNORE INTO aiModels (id, name, provider, category, inputCost, outputCost, isActive) VALUES
(1, 'GPT-4', 'openai', 'language', 0.03, 0.06, 1),
(2, 'Claude-3', 'anthropic', 'language', 0.015, 0.075, 1),
(3, 'Gemini Pro', 'google', 'language', 0.001, 0.002, 1);

INSERT IGNORE INTO promptTemplates (id, name, content, category, isActive, version, createdBy) VALUES
(1, 'Análise de Dados', 'Analise os seguintes dados: {dados}', 'analise', 1, 1, 1),
(2, 'Geração de Código', 'Gere código em {linguagem} para: {descricao}', 'codigo', 1, 1, 1);

INSERT IGNORE INTO settings (id, category, keyName, value, dataType, isPublic) VALUES
(1, 'system', 'app_name', 'Orquestrador de IAs V3', 'string', 1),
(2, 'system', 'version', '3.0.0', 'string', 1),
(3, 'api', 'max_requests_per_minute', '60', 'number', 0);
SQLEOF
    echo "✅ Dados populados"
else
    echo "✅ Dados OK ($MODELOS modelos de IA)"
fi
echo ""

# 4. Recompilar frontend
echo "4️⃣  Recompilando frontend..."
npm run build
echo "✅ Frontend compilado"
echo ""

# 5. Reiniciar PM2
echo "5️⃣  Reiniciando PM2..."
pm2 start ecosystem.config.cjs
pm2 save
sleep 3
echo "✅ PM2 reiniciado"
echo ""

# 6. Verificar resultado
echo "═══════════════════════════════════════════════════════════"
echo "  Verificação Final"
echo "═══════════════════════════════════════════════════════════"
echo ""

echo "📊 Status PM2:"
pm2 status
echo ""

echo "🌐 Testando API..."
sleep 2
if curl -s http://localhost:3001/api/health >/dev/null 2>&1; then
    echo "✅ API respondendo em http://localhost:3001"
else
    echo "⚠️  API não responde - verificar logs: pm2 logs orquestrador-v3"
fi
echo ""

echo "═══════════════════════════════════════════════════════════"
echo "  ✅ Correções Concluídas!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "🔍 Para ver logs: pm2 logs orquestrador-v3"
echo "🔄 Para reiniciar: pm2 restart orquestrador-v3"
echo "📊 Para status: pm2 status"
echo ""
