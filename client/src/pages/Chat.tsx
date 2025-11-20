import { useEffect, useState, useRef, useCallback } from 'react';
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

  // SPRINT 53 - CRITICAL FIX: Monitor isStreaming with safety timeout
  // ROOT CAUSE: isStreaming stuck at true causes button to be disabled
  // SOLUTION: Auto-reset after 60 seconds as safety mechanism
  useEffect(() => {
    console.log('🎯 [SPRINT 53] isStreaming changed to:', isStreaming, 'at', new Date().toISOString());
    
    if (isStreaming) {
      console.log('⏱️ [SPRINT 53] Starting 60-second safety timeout for isStreaming');
      const safetyTimer = setTimeout(() => {
        console.warn('⚠️⚠️⚠️ [SPRINT 53] SAFETY TIMEOUT TRIGGERED! isStreaming stuck for 60s, forcing reset to FALSE');
        setIsStreaming(false);
        setStreamingContent('');
        alert('⚠️ O sistema detectou que a resposta da IA demorou muito. O chat foi resetado e você pode tentar novamente.');
      }, 60000); // 60 seconds
      
      return () => {
        console.log('🧹 [SPRINT 53] Cleaning up safety timeout (isStreaming became false before timeout)');
        clearTimeout(safetyTimer);
      };
    }
  }, [isStreaming]);

  // SPRINT 49 ROUND 3: Removed periodic sync - causes unnecessary re-renders
  // State sync now handled by WebSocket events only (onopen, onerror, onclose)

  // Conectar WebSocket
  useEffect(() => {
    // SPRINT 49 - URGENT FIX: Dynamic WebSocket URL with retry logic
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    console.log('[SPRINT 49 URGENT] Connecting to WebSocket:', wsUrl);
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('✅ [SPRINT 49 URGENT] WebSocket OPEN - Setting isConnected to TRUE');
      setIsConnected(true);
      
      // SPRINT 49 - URGENT: Force state update after delay to ensure React has updated
      setTimeout(() => {
        console.log('[SPRINT 49 URGENT] Verifying isConnected state after 100ms');
        setIsConnected(true); // Force again
      }, 100);
      
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
            console.log('📨 [SPRINT 53] chat:message received:', { 
              role: message.data.role, 
              messageId: message.data.id,
              currentIsStreaming: isStreaming,
              willResetStreaming: message.data.role === 'assistant' && isStreaming
            });
            
            if (message.data.role === 'assistant' && isStreaming) {
              // Finalizar streaming
              console.log('✅ [SPRINT 53] Assistant message complete - resetting isStreaming to FALSE');
              setIsStreaming(false);
              setStreamingContent('');
            }
            
            setMessages(prev => {
              // Evitar duplicatas
              const exists = prev.find(m => m.id === message.data.id);
              if (exists) {
                console.log('⚠️ [SPRINT 53] Duplicate message detected, skipping:', message.data.id);
                return prev;
              }
              console.log('✅ [SPRINT 53] Adding new message to state:', message.data.id);
              return [...prev, message.data];
            });
            break;

          case 'chat:streaming':
            // Chunk de streaming
            console.log('🌊 [SPRINT 53] chat:streaming received:', { 
              done: message.data.done, 
              chunkLength: message.data.chunk?.length || 0,
              currentIsStreaming: isStreaming,
              currentContentLength: streamingContent.length
            });
            
            if (message.data.done) {
              console.log('✅ [SPRINT 53] Streaming DONE - resetting isStreaming to FALSE');
              setIsStreaming(false);
              setStreamingContent('');
            } else {
              if (!isStreaming) {
                console.log('🔄 [SPRINT 53] Starting streaming - setting isStreaming to TRUE');
              }
              setIsStreaming(true);
              setStreamingContent(prev => prev + message.data.chunk);
            }
            break;

          case 'error':
            console.error('❌ [SPRINT 53] Server error received:', message.data.message);
            alert(`Erro: ${message.data.message}`);
            // SPRINT 53: Reset isStreaming on server error
            console.log('🔧 [SPRINT 53] Server error - resetting isStreaming to FALSE');
            setIsStreaming(false);
            setStreamingContent('');
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

  // SPRINT 49 ROUND 3 - CRITICAL FIX: Memoize handleSend with useCallback
  // Root cause: Event handlers without useCallback capture stale closures
  const handleSend = useCallback(() => {
    // SPRINT 52 - CRITICAL DEBUG: This should appear IMMEDIATELY when button clicked
    console.log('🔥🔥🔥 [SPRINT 52] handleSend CALLED!', new Date().toISOString());
    console.log('🔥 If you see this, event handler IS working!');
    
    console.log('🚀 [SPRINT 52] handleSend details:', { 
      input: input.trim(),
      inputLength: input.trim().length,
      hasWs: !!wsRef.current, 
      wsReadyState: wsRef.current?.readyState,
      wsReadyStateString: wsRef.current ? ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'][wsRef.current.readyState] : 'NULL',
      isConnected,
      isStreaming
    });
    
    // SPRINT 49 - P0-6: Melhor validação e feedback
    if (!input.trim()) {
      console.warn('⚠️ [SPRINT 49] Input is empty');
      return;
    }
    
    if (!wsRef.current) {
      const errorMsg = 'WebSocket não está inicializado. Por favor, recarregue a página (Ctrl+Shift+R para hard refresh).';
      console.error('❌ [SPRINT 49] WebSocket ref is null');
      alert(errorMsg);
      return;
    }
    
    if (wsRef.current.readyState !== WebSocket.OPEN) {
      const wsState = ['CONNECTING (0)', 'OPEN (1)', 'CLOSING (2)', 'CLOSED (3)'][wsRef.current.readyState];
      const errorMsg = `WebSocket não está conectado. Estado atual: ${wsState}. Por favor, aguarde a reconexão automática ou recarregue a página.`;
      console.error('❌ [SPRINT 49] WebSocket not open. ReadyState:', wsRef.current.readyState, wsState);
      alert(errorMsg);
      return;
    }
    
    // SPRINT 50 CRITICAL FIX: Removed isConnected check - trust only readyState
    // The isConnected state can desync with actual WebSocket state
    // We already checked wsRef.current.readyState === WebSocket.OPEN above
    // That's the source of truth, not the React state
    console.log('✅ [SPRINT 50 CRITICAL] Skipping isConnected check - using readyState as source of truth');

    const messageText = input.trim();
    console.log('✅ [SPRINT 49] All validations passed. Sending message:', messageText);
    
    try {
      // SPRINT 49 - P0-6: UI otimista melhorada
      const userMessage: Message = {
        id: Date.now(),
        role: 'user',
        content: messageText,
        timestamp: new Date().toISOString()
      };
      
      console.log('📤 [SPRINT 49] Adding user message to local state:', userMessage);
      setMessages(prev => [...prev, userMessage]);
      
      // Enviar mensagem via WebSocket
      const payload = {
        type: 'chat:send',
        data: {
          message: messageText,
          conversationId: 1,
        },
      };
      
      console.log('📡 [SPRINT 49] Sending WebSocket message:', JSON.stringify(payload));
      wsRef.current.send(JSON.stringify(payload));
      
      // Limpar input SOMENTE após enviar com sucesso
      setInput('');
      console.log('✅ [SPRINT 49] Message sent successfully, input cleared');
      
      // SPRINT 49 - P0-6: Start streaming indicator
      setIsStreaming(true);
      console.log('🔄 [SPRINT 53] Setting isStreaming to TRUE (waiting for response)');
      
    } catch (error) {
      console.error('❌ [SPRINT 52] Error sending message:', error);
      const errorMsg = `Erro ao enviar mensagem: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
      alert(errorMsg);
      // SPRINT 52 - CRITICAL FIX: Reset isStreaming on error to prevent stuck state
      setIsStreaming(false);
      console.log('🔧 [SPRINT 52] isStreaming reset to FALSE after error');
      // Rollback UI state on error
      setMessages(prev => prev.slice(0, -1));
      setInput(messageText);
    }
  }, [input, isStreaming]); // SPRINT 51: Removed isConnected from dependencies (not used anymore)

  // SPRINT 49 ROUND 3 - CRITICAL FIX: Memoize handleKeyDown with useCallback
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    console.log('⌨️ [SPRINT 49 ROUND 3] handleKeyDown TRIGGERED (via useCallback)', { 
      key: e.key, 
      shiftKey: e.shiftKey,
      currentInput: input.trim(),
      inputLength: input.trim().length,
      wsReady: wsRef.current?.readyState === WebSocket.OPEN
    });
    
    if (e.key === 'Enter' && !e.shiftKey) {
      console.log('✅ [SPRINT 49] Enter without Shift detected - preventing default and calling handleSend');
      e.preventDefault();
      
      // SPRINT 49 CRITICAL FIX: Check actual WebSocket state, not React state
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        console.warn('⚠️ [SPRINT 49] Enter pressed but WebSocket not OPEN - showing alert');
        alert('Aguarde a conexão com o servidor antes de enviar mensagens.');
        return;
      }
      
      if (!input.trim()) {
        console.warn('⚠️ [SPRINT 49] Enter pressed but input is empty');
        return;
      }
      
      handleSend();
    } else if (e.key === 'Enter' && e.shiftKey) {
      console.log('↩️ [SPRINT 49 ROUND 3] Shift+Enter detected - allowing line break');
    }
  }, [input, handleSend]); // SPRINT 51: Removed isConnected from dependencies

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
            onKeyDown={handleKeyDown}
            placeholder={isConnected ? "Digite sua mensagem... (Enter para enviar)" : "Conectando... Aguarde"}
            disabled={isStreaming}
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            rows={3}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            title={isConnected ? "Enviar mensagem" : "Aguarde conexão do WebSocket"}
          >
            <Send size={20} />
            Enviar
          </button>
        </div>
        
        {/* SPRINT 49 - P0-6: Melhor feedback visual de estado */}
        {!isConnected && (
          <div className="bg-amber-900/30 border border-amber-500 rounded-lg p-3 mt-2">
            <p className="text-amber-400 text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              ⚠️ Desconectado do servidor. Tentando reconectar automaticamente...
            </p>
            <p className="text-amber-300/70 text-xs mt-1">
              Se o problema persistir, recarregue a página com Ctrl+Shift+R
            </p>
          </div>
        )}
        
        {isStreaming && isConnected && (
          <p className="text-blue-400 text-sm mt-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            IA está respondendo...
          </p>
        )}
        
        {/* SPRINT 53: Emergency reset button - only show when stuck */}
        {isStreaming && (
          <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-3 mt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <p className="text-blue-400 text-sm font-medium">
                  IA está processando sua mensagem...
                </p>
              </div>
              <button
                onClick={() => {
                  console.log('🚨 [SPRINT 53] Emergency reset button clicked by user');
                  setIsStreaming(false);
                  setStreamingContent('');
                  alert('Chat resetado. Você pode tentar enviar a mensagem novamente.');
                }}
                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                title="Clique se o sistema parecer travado"
              >
                🚨 Resetar Chat
              </button>
            </div>
          </div>
        )}
        
        {/* SPRINT 49: Debug info sempre visível para facilitar troubleshooting */}
        <p className="text-xs text-gray-500 mt-2">
          Debug: WS State = {wsRef.current ? ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'][wsRef.current.readyState] : 'NULL'} | 
          Connected = {isConnected ? '✅' : '❌'} | 
          Streaming = {isStreaming ? '🔄' : '⏸️'} | 
          Input = {input.trim().length > 0 ? '✅' : '❌'} | 
          Button = {(!input.trim() || isStreaming) ? '🔒 DISABLED' : '✅ ENABLED'}
        </p>
      </div>
    </div>
  );
};

export default Chat;
