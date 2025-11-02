#!/bin/bash
BASE="http://localhost:3001/api/trpc"
INPUT='%7B%22json%22%3A%7B%7D%7D'

echo "📊 Contando items em cada endpoint:"
echo ""
curl -s "${BASE}/projects.list?input=${INPUT}" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Projects: {len(d[\"result\"][\"data\"][\"projects\"])}')"
curl -s "${BASE}/teams.list?input=${INPUT}" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Teams: {len(d[\"result\"][\"data\"][\"teams\"])}')"
curl -s "${BASE}/prompts.list?input=${INPUT}" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Prompts: {len(d[\"result\"][\"data\"][\"prompts\"])}')"
curl -s "${BASE}/models.list?input=${INPUT}" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Models: {len(d[\"result\"][\"data\"][\"models\"])}')"
curl -s "${BASE}/specializedAIs.list?input=${INPUT}" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Specialized AIs: {len(d[\"result\"][\"data\"][\"ais\"])}')"
curl -s "${BASE}/templates.list?input=${INPUT}" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Templates: {len(d[\"result\"][\"data\"][\"templates\"])}')"
curl -s "${BASE}/workflows.list?input=${INPUT}" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Workflows: {len(d[\"result\"][\"data\"][\"workflows\"])}')"
curl -s "${BASE}/instructions.list?input=${INPUT}" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Instructions: {len(d[\"result\"][\"data\"][\"instructions\"])}')"
curl -s "${BASE}/knowledgeBase.list?input=${INPUT}" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Knowledge Base: {len(d[\"result\"][\"data\"][\"items\"])}')"
curl -s "${BASE}/tasks.list?input=${INPUT}" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Tasks: {len(d[\"result\"][\"data\"][\"tasks\"])}')"
