import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  Cpu,
  Brain,
  Key,
  ListTodo,
  FileText,
  GitBranch,
  BookOpen,
  Library,
  MessageSquare,
  Cloud,
  Terminal as TerminalIcon,
  Settings,
  Menu,
  X,
  FileCode,
  TrendingUp,
  Users,
  FolderKanban,
  Edit3,
  Activity,
  Plug,
  User,
  LogOut,
} from 'lucide-react';
import { MobileMenu } from './MobileMenu';
import { CollaborationPanel } from './CollaborationPanel';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/analytics', label: 'Analytics', icon: TrendingUp },
    { path: '/teams', label: 'Equipes', icon: Users },
    { path: '/projects', label: 'Projetos', icon: FolderKanban },
    { path: '/tasks', label: 'Tarefas', icon: ListTodo },
    { path: '/prompts', label: 'Prompts', icon: Edit3 },
    { path: '/providers', label: 'Provedores', icon: Database },
    { path: '/models', label: 'Modelos', icon: Cpu },
    { path: '/specialized-ais', label: 'IAs Especializadas', icon: Brain },
    { path: '/credentials', label: 'Credenciais', icon: Key },
    { path: '/templates', label: 'Templates', icon: FileText },
    { path: '/workflows', label: 'Workflows', icon: GitBranch },
    { path: '/instructions', label: 'Instruções', icon: BookOpen },
    { path: '/knowledge-base', label: 'Base de Conhecimento', icon: Library },
    { path: '/chat', label: 'Chat', icon: MessageSquare },
    { path: '/services', label: 'Serviços Externos', icon: Plug },
    { path: '/external-api-accounts', label: 'Contas API', icon: Cloud },
    { path: '/monitoring', label: 'Monitoramento', icon: Activity },
    { path: '/execution-logs', label: 'Logs', icon: FileCode },
    { path: '/terminal', label: 'Terminal', icon: TerminalIcon },
    { path: '/model-training', label: 'Treinamento', icon: Cpu },
    { path: '/settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Mobile Menu */}
      <MobileMenu />
      
      {/* Sidebar - Hidden on mobile */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-800 border-r border-slate-700 transition-all duration-300 flex-col hidden lg:flex`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-white">Orquestrador V3</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-700 text-gray-400"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                }`}
                title={!sidebarOpen ? item.label : ''}
              >
                <Icon size={20} className="flex-shrink-0" />
                {sidebarOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer - User Info */}
        <div className="p-4 border-t border-slate-700">
          {sidebarOpen ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.name || 'Usuário'}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link
                  to="/profile"
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-gray-300 transition-colors"
                >
                  <User size={16} className="mr-2" />
                  Perfil
                </Link>
                <button
                  onClick={logout}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm text-white transition-colors"
                >
                  <LogOut size={16} className="mr-2" />
                  Sair
                </button>
              </div>
              <div className="text-xs text-gray-500 text-center">
                v3.0.0 - Sistema de Orquestração
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <Link
                to="/profile"
                className="p-2 rounded-lg hover:bg-slate-700 text-gray-400"
                title="Perfil"
              >
                <User size={20} />
              </Link>
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-red-600 text-gray-400"
                title="Sair"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-4 lg:p-6">
          <Outlet />
        </div>
      </main>

      {/* Collaboration Panel */}
      <CollaborationPanel />
    </div>
  );
};

export default Layout;
