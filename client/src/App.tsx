import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import Teams from './pages/Teams';
import Providers from './pages/Providers';
import Models from './pages/Models';
import SpecializedAIs from './pages/SpecializedAIs';
import Credentials from './pages/Credentials';
import Tasks from './pages/Tasks';
import Subtasks from './pages/Subtasks';
import Prompts from './pages/Prompts';
import Templates from './pages/Templates';
import Workflows from './pages/Workflows';
import Instructions from './pages/Instructions';
import KnowledgeBase from './pages/KnowledgeBase';
import KnowledgeSources from './pages/KnowledgeSources';
import ExecutionLogs from './pages/ExecutionLogs';
import Chat from './pages/Chat';
import ExternalAPIAccounts from './pages/ExternalAPIAccounts';
import Services from './pages/Services';
import Monitoring from './pages/Monitoring';
import Settings from './pages/Settings';
import Terminal from './pages/Terminal';
import ModelTraining from './pages/ModelTraining';
import { Analytics } from './pages/Analytics';
import { WorkflowBuilder } from './pages/WorkflowBuilder';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rotas Públicas (sem Layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rotas Protegidas (com Layout) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/models" element={<Models />} />
        <Route path="/specialized-ais" element={<SpecializedAIs />} />
        <Route path="/credentials" element={<Credentials />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/:id/subtasks" element={<Subtasks />} />
        <Route path="/prompts" element={<Prompts />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/workflows" element={<Workflows />} />
        <Route path="/workflows/builder" element={<WorkflowBuilder />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/knowledge-base" element={<KnowledgeBase />} />
        <Route path="/knowledge-base/:id/sources" element={<KnowledgeSources />} />
        <Route path="/execution-logs" element={<ExecutionLogs />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/external-api-accounts" element={<ExternalAPIAccounts />} />
        <Route path="/services" element={<Services />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/terminal" element={<Terminal />} />
        <Route path="/model-training" element={<ModelTraining />} />
        <Route path="/analytics" element={<Analytics />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
