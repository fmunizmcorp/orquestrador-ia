#!/usr/bin/env python3
"""Gerador de todas as 18 páginas frontend"""
from pathlib import Path

BASE = Path(__file__).parent
PAGES = BASE / "client" / "src" / "pages"

# Template base para páginas CRUD
crud_template = lambda title, entity: f"""import {{ useState }} from 'react';
import {{ trpc }} from '../lib/trpc';
import DataTable from '../components/DataTable';

const {entity} = () => {{
  const [searchQuery, setSearchQuery] = useState('');
  const {{ data, isLoading }} = trpc.{entity.lower()}.list.useQuery({{ query: searchQuery }});

  return (
    <div>
      <DataTable
        title="{title}"
        columns={{[
          {{ key: 'id', label: 'ID' }},
          {{ key: 'name', label: 'Nome' }},
        ]}}
        data={{data?.items || []}}
        loading={{isLoading}}
        searchQuery={{searchQuery}}
        onSearchChange={{setSearchQuery}}
        onAdd={{() => console.log('Add')}}
        onEdit={{() => console.log('Edit')}}
        onDelete={{() => console.log('Delete')}}
      />
    </div>
  );
}};

export default {entity};
"""

pages = {
    "Dashboard.tsx": """import { useEffect, useState } from 'react';
import { trpc } from '../lib/trpc';
import { Activity, Brain, CheckCircle, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { data: stats } = trpc.tasks.stats.useQuery();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total de Tarefas</p>
              <p className="text-3xl font-bold text-white">{stats?.total || 0}</p>
            </div>
            <Activity className="text-blue-500" size={40} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Em Execução</p>
              <p className="text-3xl font-bold text-white">{stats?.executing || 0}</p>
            </div>
            <Brain className="text-yellow-500" size={40} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Concluídas</p>
              <p className="text-3xl font-bold text-white">{stats?.completed || 0}</p>
            </div>
            <CheckCircle className="text-green-500" size={40} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Falhadas</p>
              <p className="text-3xl font-bold text-white">{stats?.failed || 0}</p>
            </div>
            <AlertCircle className="text-red-500" size={40} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
""",
    "Providers.tsx": crud_template("Provedores de IA", "Providers"),
    "Models.tsx": crud_template("Modelos de IA", "Models"),
    "SpecializedAIs.tsx": crud_template("IAs Especializadas", "SpecializedAIs"),
    "Credentials.tsx": crud_template("Credenciais", "Credentials"),
    "Tasks.tsx": crud_template("Tarefas", "Tasks"),
    "Subtasks.tsx": crud_template("Subtarefas", "Subtasks"),
    "Templates.tsx": crud_template("Templates", "Templates"),
    "Workflows.tsx": crud_template("Workflows", "Workflows"),
    "Instructions.tsx": crud_template("Instruções", "Instructions"),
    "KnowledgeBase.tsx": crud_template("Base de Conhecimento", "KnowledgeBase"),
    "KnowledgeSources.tsx": crud_template("Fontes de Conhecimento", "KnowledgeSources"),
    "ExecutionLogs.tsx": crud_template("Logs de Execução", "ExecutionLogs"),
    "Chat.tsx": """const Chat = () => <div className="card"><h1 className="text-2xl text-white">Chat</h1></div>;
export default Chat;""",
    "ExternalAPIAccounts.tsx": crud_template("Contas de API Externa", "ExternalAPIAccounts"),
    "Settings.tsx": """const Settings = () => <div className="card"><h1 className="text-2xl text-white">Configurações</h1></div>;
export default Settings;""",
    "Terminal.tsx": """const Terminal = () => <div className="card"><h1 className="text-2xl text-white">Terminal SSH</h1></div>;
export default Terminal;""",
    "ModelTraining.tsx": """const ModelTraining = () => <div className="card"><h1 className="text-2xl text-white">Treinamento de Modelos</h1></div>;
export default ModelTraining;""",
}

for filename, content in pages.items():
    with open(PAGES / filename, 'w') as f:
        f.write(content)
    print(f"✅ {filename}")

print("\n✅ TODAS AS 18 PÁGINAS CRIADAS!")
