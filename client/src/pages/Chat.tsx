import { useEffect, useState, useRef } from 'react';
import { Send } from 'lucide-react';

interface Message {
  id?: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automático para última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  // Conectar WebSocket
  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.hostname}:3001/ws`);

    ws.onopen = () => {
      console.log('✅ WebSocket conectado');
      setIsConnected(true);
      
      // Buscar histórico
      ws.send(JSON.stringify({
        type: 'chat:history',
        data: { conversationId: 1, limit: 50 },
      }));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        switch (message.type) {
          case 'chat:history':
            setMessages(message.data);
            break;

          case 'chat:message':
            // Mensagem completa (usuário ou assistente)
            if (message.data.role === 'assistant' && isStreaming) {
              // Finalizar streaming
              setIsStreaming(false);
              setStreamingContent('');
            }
            
            setMessages(prev => {
              // Evitar duplicatas
              const exists = prev.find(m => m.id === message.data.id);
              if (exists) return prev;
              return [...prev, message.data];
            });
            break;

          case 'chat:streaming':
            // Chunk de streaming
            if (message.data.done) {
              setIsStreaming(false);
            } else {
              setIsStreaming(true);
              setStreamingContent(prev => prev + message.data.chunk);
            }
            break;

          case 'error':
            console.error('Erro do servidor:', message.data.message);
            alert(`Erro: ${message.data.message}`);
            break;
        }
      } catch (error) {
        console.error('Erro ao processar mensagem:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('❌ Erro no WebSocket:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('❌ WebSocket desconectado');
      setIsConnected(false);
      
      // Tentar reconectar após 3 segundos
      setTimeout(() => {
        console.log('🔄 Tentando reconectar...');
        window.location.reload();
      }, 3000);
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  const handleSend = () => {
    if (!input.trim() || !wsRef.current || !isConnected) return;

    // Enviar mensagem
    wsRef.current.send(JSON.stringify({
      type: 'chat:send',
      data: {
        message: input.trim(),
        conversationId: 1,
      },
    }));

    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 gap-4">
      {/* Header */}
      <div className="card p-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Chat com IA</h1>
          <p className="text-gray-400 text-sm">
            Converse com o assistente do Orquestrador V3.2
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div 
            className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
            title={isConnected ? 'Conectado' : 'Desconectado'}
          />
          <span className="text-sm text-gray-400">
            {isConnected ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 card p-4 overflow-y-auto space-y-4">
        {messages.length === 0 && !isStreaming && (
          <div className="text-center text-gray-400 py-12">
            <p className="text-lg mb-2">👋 Bem-vindo!</p>
            <p>Envie uma mensagem para começar a conversar.</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={msg.id || index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] px-4 py-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              <p className="text-sm font-medium mb-1">
                {msg.role === 'user' ? 'Você' : 'Assistente'}
              </p>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <p className="text-xs opacity-70 mt-2">
                {new Date(msg.timestamp).toLocaleTimeString('pt-BR')}
              </p>
            </div>
          </div>
        ))}

        {/* Streaming message */}
        {isStreaming && streamingContent && (
          <div className="flex justify-start">
            <div className="max-w-[70%] px-4 py-3 rounded-lg bg-gray-700 text-gray-100">
              <p className="text-sm font-medium mb-1">Assistente</p>
              <p className="whitespace-pre-wrap">{streamingContent}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <p className="text-xs opacity-70">Digitando...</p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="card p-4">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isConnected ? "Digite sua mensagem... (Enter para enviar)" : "Aguardando conexão..."}
            disabled={!isConnected || isStreaming}
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            rows={3}
          />
          <button
            onClick={handleSend}
            disabled={!isConnected || !input.trim() || isStreaming}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Send size={20} />
            Enviar
          </button>
        </div>
        
        {!isConnected && (
          <p className="text-amber-500 text-sm mt-2">
            ⚠️ Desconectado do servidor. Tentando reconectar...
          </p>
        )}
      </div>
    </div>
  );
};

export default Chat;
