/**
 * Real-time Collaboration Panel
 * Shows active users and enables real-time collaboration features
 */
import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

interface ActiveUser {
  id: number;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy';
  currentPage?: string;
  lastActivity: Date;
}

interface CollaborationEvent {
  type: 'user_joined' | 'user_left' | 'user_activity' | 'task_update' | 'chat_message';
  userId: number;
  userName: string;
  data?: any;
  timestamp: Date;
}

export const CollaborationPanel: React.FC = () => {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [recentEvents, setRecentEvents] = useState<CollaborationEvent[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const { connected, sendMessage } = useWebSocket();

  // Simulate active users (in real implementation, this would come from WebSocket)
  useEffect(() => {
    const demoUsers: ActiveUser[] = [
      {
        id: 1,
        name: 'You',
        status: 'online',
        currentPage: window.location.pathname,
        lastActivity: new Date(),
      },
      {
        id: 2,
        name: 'AI Assistant',
        status: 'online',
        currentPage: '/chat',
        lastActivity: new Date(Date.now() - 5000),
      },
    ];

    setActiveUsers(demoUsers);

    // Simulate real-time events
    const interval = setInterval(() => {
      const eventTypes: CollaborationEvent['type'][] = ['user_activity', 'task_update'];
      const randomEvent: CollaborationEvent = {
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        userId: 2,
        userName: 'AI Assistant',
        timestamp: new Date(),
        data: { message: 'Processing task...' },
      };

      setRecentEvents((prev) => [randomEvent, ...prev.slice(0, 9)]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Update current user's page
  useEffect(() => {
    setActiveUsers((users) =>
      users.map((user) =>
        user.id === 1
          ? { ...user, currentPage: window.location.pathname, lastActivity: new Date() }
          : user
      )
    );
  }, [window.location.pathname]);

  const getStatusColor = (status: ActiveUser['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPageName = (path?: string) => {
    if (!path) return 'Unknown';
    const segments = path.split('/').filter(Boolean);
    return segments[0] || 'Dashboard';
  };

  const getRelativeTime = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-30">
      {/* Collapsed Button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition flex items-center space-x-2"
        >
          <span className="text-2xl">👥</span>
          <span className="bg-green-500 text-xs font-bold px-2 py-1 rounded-full">
            {activeUsers.length}
          </span>
        </button>
      )}

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="bg-white rounded-lg shadow-2xl w-80 max-h-96 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl">👥</span>
              <div>
                <h3 className="font-semibold">Active Users</h3>
                <p className="text-xs opacity-75">
                  {connected ? 'Connected' : 'Disconnected'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="hover:bg-blue-700 rounded p-1 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Users List */}
          <div className="p-4 border-b border-gray-200 max-h-48 overflow-y-auto">
            <div className="space-y-3">
              {activeUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name[0]}
                    </div>
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                        user.status
                      )}`}
                    />
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {getPageName(user.currentPage)} · {getRelativeTime(user.lastActivity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="flex-1 overflow-y-auto p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Activity</h4>
            
            {recentEvents.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">No recent activity</p>
            ) : (
              <div className="space-y-2">
                {recentEvents.map((event, index) => (
                  <div key={index} className="text-xs text-gray-600 bg-gray-50 rounded p-2">
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold">{event.userName}</span>
                      <span>
                        {event.type === 'user_joined' && 'joined'}
                        {event.type === 'user_left' && 'left'}
                        {event.type === 'user_activity' && 'is active'}
                        {event.type === 'task_update' && 'updated a task'}
                        {event.type === 'chat_message' && 'sent a message'}
                      </span>
                    </div>
                    <p className="text-gray-400 mt-1">{getRelativeTime(event.timestamp)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
            <button className="w-full text-xs text-blue-600 hover:text-blue-700 font-medium">
              View All Activity →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
