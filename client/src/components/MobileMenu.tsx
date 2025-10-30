/**
 * Mobile Menu Component
 * Responsive mobile navigation with hamburger menu
 */
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MenuItem {
  name: string;
  path: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', path: '/', icon: '📊' },
  { name: 'Tasks', path: '/tasks', icon: '✅' },
  { name: 'Chat', path: '/chat', icon: '💬' },
  { name: 'Analytics', path: '/analytics', icon: '📈' },
  { name: 'Workflows', path: '/workflows', icon: '🔄' },
  { name: 'Models', path: '/models', icon: '🤖' },
  { name: 'Training', path: '/model-training', icon: '🎓' },
  { name: 'Specialized AIs', path: '/specialized-ais', icon: '🎯' },
  { name: 'Knowledge Base', path: '/knowledge-base', icon: '📚' },
  { name: 'Providers', path: '/providers', icon: '🔌' },
  { name: 'Credentials', path: '/credentials', icon: '🔐' },
  { name: 'Logs', path: '/execution-logs', icon: '📝' },
  { name: 'Settings', path: '/settings', icon: '⚙️' },
];

export const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Menu Button - Visible only on mobile */}
      <button
        onClick={toggleMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Orquestrador IA</h2>
          
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};
