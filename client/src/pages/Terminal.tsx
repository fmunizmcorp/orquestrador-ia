import { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Plus, X, RefreshCw } from 'lucide-react';
import 'xterm/css/xterm.css';

interface TerminalSession {
  id: string;
  sessionId: string;
  terminal: XTerm;
  fitAddon: FitAddon;
}

const Terminal = () => {
  const [sessions, setSessions] = useState<TerminalSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const containerRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Connect WebSocket
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001/ws');

    ws.onopen = () => {
      console.log('✅ WebSocket Terminal conectado');
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        switch (message.type) {
          case 'terminal:created':
            console.log(`Terminal criado: ${message.data.sessionId}`);
            break;

          case 'terminal:output':
            // Find session and write output
            setSessions(prev => {
              const session = prev.find(s => s.sessionId === message.data.sessionId);
              if (session) {
                session.terminal.write(message.data.output);
              }
              return prev;
            });
            break;

          case 'terminal:exit':
            console.log(`Terminal encerrado: ${message.data.sessionId}`);
            break;

          case 'error':
            console.error('Erro no terminal:', message.data.message);
            break;
        }
      } catch (error) {
        console.error('Erro ao processar mensagem:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('❌ Erro no WebSocket Terminal:', error);
      setWsConnected(false);
    };

    ws.onclose = () => {
      console.log('❌ WebSocket Terminal desconectado');
      setWsConnected(false);
    };

    wsRef.current = ws;

    return () => {
      // Close all terminal sessions
      sessions.forEach(session => {
        ws.send(JSON.stringify({
          type: 'terminal:close',
          data: { sessionId: session.sessionId },
        }));
        session.terminal.dispose();
      });
      
      ws.close();
    };
  }, []);

  // Create new terminal session
  const createTerminal = () => {
    if (!wsRef.current || !wsConnected) {
      alert('WebSocket não conectado');
      return;
    }

    const id = `term_${Date.now()}`;
    
    // Create XTerm instance
    const terminal = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#ffffff',
        selection: '#264f78',
      },
      rows: 24,
      cols: 80,
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);

    // Request server to create terminal session
    wsRef.current.send(JSON.stringify({
      type: 'terminal:create',
    }));

    // Handle terminal input
    terminal.onData((data) => {
      if (wsRef.current && wsConnected) {
        // Find session to get sessionId
        const session = sessions.find(s => s.terminal === terminal);
        if (session) {
          wsRef.current.send(JSON.stringify({
            type: 'terminal:input',
            data: { sessionId: session.sessionId, input: data },
          }));
        }
      }
    });

    // Handle terminal resize
    terminal.onResize(({ cols, rows }) => {
      const session = sessions.find(s => s.terminal === terminal);
      if (session && wsRef.current && wsConnected) {
        wsRef.current.send(JSON.stringify({
          type: 'terminal:resize',
          data: { sessionId: session.sessionId, cols, rows },
        }));
      }
    });

    const newSession: TerminalSession = {
      id,
      sessionId: id, // Will be updated when server responds
      terminal,
      fitAddon,
    };

    setSessions(prev => [...prev, newSession]);
    setActiveSessionId(id);

    // Wait for sessionId from server
    const listener = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'terminal:created') {
          setSessions(prev => prev.map(s => 
            s.id === id ? { ...s, sessionId: message.data.sessionId } : s
          ));
          wsRef.current?.removeEventListener('message', listener);
        }
      } catch (error) {
        // Ignore
      }
    };

    wsRef.current?.addEventListener('message', listener);
  };

  // Close terminal session
  const closeTerminal = (id: string) => {
    const session = sessions.find(s => s.id === id);
    
    if (session && wsRef.current && wsConnected) {
      wsRef.current.send(JSON.stringify({
        type: 'terminal:close',
        data: { sessionId: session.sessionId },
      }));
    }

    if (session) {
      session.terminal.dispose();
      containerRefs.current.delete(id);
    }

    setSessions(prev => prev.filter(s => s.id !== id));
    
    if (activeSessionId === id) {
      const remaining = sessions.filter(s => s.id !== id);
      setActiveSessionId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  // Mount terminal when container is ready
  useEffect(() => {
    sessions.forEach(session => {
      const container = containerRefs.current.get(session.id);
      
      if (container && !container.hasChildNodes()) {
        session.terminal.open(container);
        session.fitAddon.fit();
        
        // Resize on window resize
        const handleResize = () => {
          session.fitAddon.fit();
        };
        window.addEventListener('resize', handleResize);
        
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }
    });
  }, [sessions, activeSessionId]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 gap-4">
      {/* Header */}
      <div className="card p-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Terminal SSH</h1>
          <p className="text-gray-400 text-sm">
            Múltiplos terminais com acesso shell completo
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div 
              className={`w-3 h-3 rounded-full ${wsConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
              title={wsConnected ? 'Conectado' : 'Desconectado'}
            />
            <span className="text-sm text-gray-400">
              {wsConnected ? 'Online' : 'Offline'}
            </span>
          </div>
          <button
            onClick={createTerminal}
            disabled={!wsConnected}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Novo Terminal
          </button>
        </div>
      </div>

      {/* Tabs */}
      {sessions.length > 0 && (
        <div className="card p-2 flex items-center gap-2 overflow-x-auto">
          {sessions.map(session => (
            <button
              key={session.id}
              onClick={() => setActiveSessionId(session.id)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeSessionId === session.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span>Terminal {sessions.indexOf(session) + 1}</span>
              <X
                size={14}
                onClick={(e) => {
                  e.stopPropagation();
                  closeTerminal(session.id);
                }}
                className="hover:text-red-400 transition-colors"
              />
            </button>
          ))}
        </div>
      )}

      {/* Terminal Container */}
      <div className="flex-1 card p-4 overflow-hidden">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">💻</div>
            <p className="text-gray-400 text-lg mb-2">Nenhum terminal ativo</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Crie um novo terminal para começar a executar comandos
            </p>
            <button
              onClick={createTerminal}
              disabled={!wsConnected}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Criar Primeiro Terminal
            </button>
          </div>
        ) : (
          <>
            {sessions.map(session => (
              <div
                key={session.id}
                ref={(el) => {
                  if (el) containerRefs.current.set(session.id, el);
                }}
                className={`w-full h-full ${activeSessionId === session.id ? 'block' : 'hidden'}`}
                style={{ backgroundColor: '#1e1e1e' }}
              />
            ))}
          </>
        )}
      </div>

      {!wsConnected && (
        <div className="card p-4 bg-red-600/20 border-red-600">
          <p className="text-red-400 text-sm flex items-center gap-2">
            <RefreshCw size={16} />
            Desconectado do servidor. Tentando reconectar...
          </p>
        </div>
      )}
    </div>
  );
};

export default Terminal;
