import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/Toast';
import Layout from './components/Layout';

// SPRINT 28: Lazy loading de todas as páginas para reduzir bundle inicial
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Projects = lazy(() => import('./pages/Projects'));
const Teams = lazy(() => import('./pages/Teams'));
const Providers = lazy(() => import('./pages/Providers'));
const Models = lazy(() => import('./pages/Models'));
const SpecializedAIs = lazy(() => import('./pages/SpecializedAIs'));
const Credentials = lazy(() => import('./pages/Credentials'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Subtasks = lazy(() => import('./pages/Subtasks'));
const Prompts = lazy(() => import('./pages/Prompts'));
const Templates = lazy(() => import('./pages/Templates'));
const Workflows = lazy(() => import('./pages/Workflows'));
const Instructions = lazy(() => import('./pages/Instructions'));
const KnowledgeBase = lazy(() => import('./pages/KnowledgeBase'));
const KnowledgeSources = lazy(() => import('./pages/KnowledgeSources'));
const ExecutionLogs = lazy(() => import('./pages/ExecutionLogs'));
const Chat = lazy(() => import('./pages/Chat'));
const ExternalAPIAccounts = lazy(() => import('./pages/ExternalAPIAccounts'));
const Services = lazy(() => import('./pages/Services'));
const Monitoring = lazy(() => import('./pages/Monitoring'));
const Settings = lazy(() => import('./pages/Settings'));
const Terminal = lazy(() => import('./pages/Terminal'));
const ModelTraining = lazy(() => import('./pages/ModelTraining'));
const LMStudio = lazy(() => import('./pages/LMStudio'));
const Analytics = lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })));
const WorkflowBuilder = lazy(() => import('./pages/WorkflowBuilder').then(m => ({ default: m.WorkflowBuilder })));

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
              </div>
            </div>
          }>
            <Routes>
          {/* Redirecionar login e register para dashboard */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          
          {/* Todas as rotas com Layout - SEM autenticação */}
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
            <Route path="/lmstudio" element={<LMStudio />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>
          </Routes>
          </Suspense>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
