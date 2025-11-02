#!/bin/bash
BASE_URL="http://localhost:3001/api/trpc"
INPUT='%7B%22json%22%3A%7B%7D%7D'

echo "🧪 Testing New APIs..."
echo "1. Projects..."
curl -s "${BASE_URL}/projects.list?input=${INPUT}" | python3 -c "import sys,json; data=json.load(sys.stdin); print(f'✅ {data[\"result\"][\"data\"][\"pagination\"][\"total\"]} projects')" 2>&1 || echo "❌ Error"

echo "2. Teams..."
curl -s "${BASE_URL}/teams.list?input=${INPUT}" | python3 -c "import sys,json; data=json.load(sys.stdin); print(f'✅ {data[\"result\"][\"data\"][\"pagination\"][\"total\"]} teams')" 2>&1 || echo "❌ Error"

echo "3. Prompts..."
curl -s "${BASE_URL}/prompts.list?input=${INPUT}" | python3 -c "import sys,json; data=json.load(sys.stdin); print(f'✅ {data[\"result\"][\"data\"][\"pagination\"][\"total\"]} prompts')" 2>&1 || echo "❌ Error"
