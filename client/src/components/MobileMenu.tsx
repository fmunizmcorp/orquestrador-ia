/**
 * Mobile Menu Component - Sprint 41
 * Responsive mobile navigation with hamburger menu
 * Features: Full navigation, dark mode, user info, theme toggle
 */
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Moon,
  Sun,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface NavItem {
  path: string;
  label: string;
  icon: any;
}

const navItems: NavItem[] = [
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

export const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  return (
    <>
      {/* SPRINT 41: Mobile Hamburger Menu Button - Visible only on mobile */}
      <button
        onClick={toggleMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg shadow-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-all"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay - Dark backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* SPRINT 41: Mobile Sidebar - Slide from left */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-80 bg-white dark:bg-slate-800 shadow-xl z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header with logo */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Orquestrador v3.6.0
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Sistema de Orquestração IA
          </p>
        </div>

        {/* User Info Section */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user?.name || 'Usuário'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700 space-y-3 bg-gray-50 dark:bg-slate-700/50">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white dark:bg-slate-600 hover:bg-gray-100 dark:hover:bg-slate-500 rounded-lg text-sm text-gray-700 dark:text-gray-200 transition-all shadow-sm"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            <span>{isDark ? 'Modo Claro' : 'Modo Escuro'}</span>
          </button>

          {/* Profile and Logout */}
          <div className="flex space-x-2">
            <Link
              to="/profile"
              onClick={closeMenu}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-white dark:bg-slate-600 hover:bg-gray-100 dark:hover:bg-slate-500 rounded-lg text-sm text-gray-700 dark:text-gray-200 transition-all shadow-sm"
            >
              <User size={18} />
              <span>Perfil</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-sm text-white transition-all shadow-sm"
            >
              <LogOut size={18} />
              <span>Sair</span>
            </button>
          </div>

          {/* Version Info */}
          <div className="text-xs text-center text-gray-500 dark:text-gray-400 pt-2">
            v3.6.0 - Sprint 41 Mobile Update
          </div>
        </div>
      </div>
    </>
  );
};
