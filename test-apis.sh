#!/bin/bash

echo "🧪 TESTANDO TODOS OS ENDPOINTS DA API"
echo "======================================"

BASE_URL="http://localhost:3001/api/trpc"
INPUT='%7B%22json%22%3A%7B%7D%7D'

echo ""
echo "1️⃣ MODELS (aiModels)..."
curl -s "${BASE_URL}/models.list?input=${INPUT}" | python3 -c "import sys,json; data=json.load(sys.stdin); print(f'✅ {len(data[\"result\"][\"data\"][\"models\"])} modelos') if 'models' in data.get('result',{}).get('data',{}) else print('❌ Erro')"

echo "2️⃣ PROVIDERS (aiProviders)..."
curl -s "${BASE_URL}/providers.list?input=${INPUT}" | python3 -c "import sys,json; data=json.load(sys.stdin); print(f'✅ {len(data[\"result\"][\"data\"][\"providers\"])} providers') if 'providers' in data.get('result',{}).get('data',{}) else print('❌ Erro')"

echo "3️⃣ SPECIALIZED AIs..."
curl -s "${BASE_URL}/specialized-ais.list?input=${INPUT}" | python3 -c "import sys,json; data=json.load(sys.stdin); print(f'✅ {len(data[\"result\"][\"data\"][\"ais\"])} specialized AIs') if 'ais' in data.get('result',{}).get('data',{}) else print('❌ Erro')"

echo "4️⃣ PROJECTS..."
curl -s "${BASE_URL}/projects.list?input=${INPUT}" | python3 -c "import sys,json; data=json.load(sys.stdin); print(f'✅ {data[\"result\"][\"data\"][\"pagination\"][\"total\"]} projects') if 'pagination' in data.get('result',{}).get('data',{}) else print('❌ Erro')"

echo "5️⃣ TASKS..."
curl -s "${BASE_URL}/tasks.list?input=${INPUT}" | python3 -c "import sys,json; data=json.load(sys.stdin); print(f'✅ {data[\"result\"][\"data\"][\"pagination\"][\"total\"]} tasks') if 'pagination' in data.get('result',{}).get('data',{}) else print('❌ Erro')"

echo "6️⃣ TEAMS..."
curl -s "${BASE_URL}/teams.list?input=${INPUT}" | python3 -c "import sys,json; data=json.load(sys.stdin); print(f'✅ {data[\"result\"][\"data\"][\"pagination\"][\"total\"]} teams') if 'pagination' in data.get('result',{}).get('data',{}) else print('❌ Erro')"

echo "7️⃣ PROMPTS..."
curl -s "${BASE_URL}/prompts.list?input=${INPUT}" | python3 -c "import sys,json; data=json.load(sys.stdin); print(f'✅ {data[\"result\"][\"data\"][\"pagination\"][\"total\"]} prompts') if 'pagination' in data.get('result',{}).get('data',{}) else print('❌ Erro')"

echo "8️⃣ TEMPLATES..."
curl -s "${BASE_URL}/templates.list?input=${INPUT}" | python3 -c "import sys,json; data=json.load(sys.stdin); print(f'✅ {data[\"result\"][\"data\"][\"pagination\"][\"total\"]} templates') if 'pagination' in data.get('result',{}).get('data',{}) else print('❌ Erro')"

echo "9️⃣ WORKFLOWS..."
curl -s "${BASE_URL}/workflows.list?input=${INPUT}" | python3 -c "import sys,json; data=json.load(sys.stdin); print(f'✅ {data[\"result\"][\"data\"][\"pagination\"][\"total\"]} workflows') if 'pagination' in data.get('result',{}).get('data',{}) else print('❌ Erro')"

echo "🔟 INSTRUCTIONS..."
curl -s "${BASE_URL}/instructions.list?input=${INPUT}" | python3 -c "import sys,json; data=json.load(sys.stdin); print(f'✅ {data[\"result\"][\"data\"][\"pagination\"][\"total\"]} instructions') if 'pagination' in data.get('result',{}).get('data',{}) else print('❌ Erro')"

echo "1️⃣1️⃣ KNOWLEDGE BASE..."
curl -s "${BASE_URL}/knowledge.list?input=${INPUT}" | python3 -c "import sys,json; data=json.load(sys.stdin); print(f'✅ {data[\"result\"][\"data\"][\"pagination\"][\"total\"]} knowledge items') if 'pagination' in data.get('result',{}).get('data',{}) else print('❌ Erro')"

echo ""
echo "======================================"
echo "✅ TESTE DE APIS COMPLETO"
