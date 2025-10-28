import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Providers from './pages/Providers';
import Models from './pages/Models';
import SpecializedAIs from './pages/SpecializedAIs';
import Credentials from './pages/Credentials';
import Tasks from './pages/Tasks';
import Subtasks from './pages/Subtasks';
import Templates from './pages/Templates';
import Workflows from './pages/Workflows';
import Instructions from './pages/Instructions';
import KnowledgeBase from './pages/KnowledgeBase';
import KnowledgeSources from './pages/KnowledgeSources';
import ExecutionLogs from './pages/ExecutionLogs';
import Chat from './pages/Chat';
import ExternalAPIAccounts from './pages/ExternalAPIAccounts';
import Settings from './pages/Settings';
import Terminal from './pages/Terminal';
import ModelTraining from './pages/ModelTraining';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/models" element={<Models />} />
        <Route path="/specialized-ais" element={<SpecializedAIs />} />
        <Route path="/credentials" element={<Credentials />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/:id/subtasks" element={<Subtasks />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/workflows" element={<Workflows />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/knowledge-base" element={<KnowledgeBase />} />
        <Route path="/knowledge-base/:id/sources" element={<KnowledgeSources />} />
        <Route path="/execution-logs" element={<ExecutionLogs />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/external-api-accounts" element={<ExternalAPIAccounts />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/terminal" element={<Terminal />} />
        <Route path="/model-training" element={<ModelTraining />} />
      </Routes>
    </Layout>
  );
}

export default App;
