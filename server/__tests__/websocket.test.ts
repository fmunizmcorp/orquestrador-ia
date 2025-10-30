/**
 * WebSocket Handlers Tests
 */
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import WebSocket from 'ws';

describe('WebSocket Handlers', () => {
  let ws: WebSocket;
  const WS_URL = 'ws://localhost:3001/ws';

  beforeEach((done) => {
    ws = new WebSocket(WS_URL);
    ws.on('open', () => done());
  });

  afterEach(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  });

  it('should connect to WebSocket server', (done) => {
    expect(ws.readyState).toBe(WebSocket.OPEN);
    done();
  });

  it('should respond to ping with pong', (done) => {
    ws.send(JSON.stringify({ type: 'ping' }));
    
    ws.on('message', (data) => {
      const message = JSON.parse(data.toString());
      
      if (message.type === 'pong') {
        expect(message.type).toBe('pong');
        done();
      }
    });
  });

  it('should subscribe to monitoring', (done) => {
    ws.send(JSON.stringify({ type: 'monitoring:subscribe' }));
    
    ws.on('message', (data) => {
      const message = JSON.parse(data.toString());
      
      if (message.type === 'monitoring:subscribed') {
        expect(message.type).toBe('monitoring:subscribed');
        done();
      }
    });
  });

  it('should return chat history', (done) => {
    ws.send(JSON.stringify({
      type: 'chat:history',
      data: { conversationId: 1, limit: 10 },
    }));
    
    ws.on('message', (data) => {
      const message = JSON.parse(data.toString());
      
      if (message.type === 'chat:history') {
        expect(message.type).toBe('chat:history');
        expect(Array.isArray(message.data)).toBe(true);
        done();
      }
    });
  });

  it('should handle invalid message type', (done) => {
    ws.send(JSON.stringify({ type: 'invalid:type' }));
    
    ws.on('message', (data) => {
      const message = JSON.parse(data.toString());
      
      if (message.type === 'error') {
        expect(message.type).toBe('error');
        expect(message.data.message).toContain('desconhecido');
        done();
      }
    });
  });
});
