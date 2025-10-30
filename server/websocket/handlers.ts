/**
 * WebSocket Handlers - Chat e Monitoramento em Tempo Real
 */

import { WebSocket } from 'ws';
import { db } from '../db/index.js';
import { chatMessages, executionLogs, tasks, subtasks } from '../db/schema.js';
import { lmstudioService } from '../services/lmstudioService.js';
import { eq, desc } from 'drizzle-orm';

// Tipos de mensagens WebSocket
export type WSMessage = 
  | { type: 'chat:send'; data: { message: string; conversationId?: number } }
  | { type: 'chat:history'; data: { conversationId?: number; limit?: number } }
  | { type: 'monitoring:subscribe' }
  | { type: 'monitoring:unsubscribe' }
  | { type: 'task:subscribe'; data: { taskId: number } }
  | { type: 'task:unsubscribe'; data: { taskId: number } }
  | { type: 'ping' };

export type WSResponse =
  | { type: 'chat:message'; data: { id: number; role: string; content: string; timestamp: string } }
  | { type: 'chat:streaming'; data: { chunk: string; done: boolean } }
  | { type: 'chat:history'; data: Array<any> }
  | { type: 'metrics'; data: any }
  | { type: 'task:update'; data: any }
  | { type: 'error'; data: { message: string } }
  | { type: 'pong' };

// Gerenciador de conexões
class ConnectionManager {
  private connections = new Map<WebSocket, {
    monitoringSubscribed: boolean;
    taskSubscriptions: Set<number>;
  }>();

  register(ws: WebSocket) {
    this.connections.set(ws, {
      monitoringSubscribed: false,
      taskSubscriptions: new Set(),
    });
  }

  unregister(ws: WebSocket) {
    this.connections.delete(ws);
  }

  subscribeMonitoring(ws: WebSocket) {
    const conn = this.connections.get(ws);
    if (conn) conn.monitoringSubscribed = true;
  }

  unsubscribeMonitoring(ws: WebSocket) {
    const conn = this.connections.get(ws);
    if (conn) conn.monitoringSubscribed = false;
  }

  subscribeTask(ws: WebSocket, taskId: number) {
    const conn = this.connections.get(ws);
    if (conn) conn.taskSubscriptions.add(taskId);
  }

  unsubscribeTask(ws: WebSocket, taskId: number) {
    const conn = this.connections.get(ws);
    if (conn) conn.taskSubscriptions.delete(taskId);
  }

  getMonitoringSubscribers(): WebSocket[] {
    const subscribers: WebSocket[] = [];
    this.connections.forEach((conn, ws) => {
      if (conn.monitoringSubscribed) subscribers.push(ws);
    });
    return subscribers;
  }

  getTaskSubscribers(taskId: number): WebSocket[] {
    const subscribers: WebSocket[] = [];
    this.connections.forEach((conn, ws) => {
      if (conn.taskSubscriptions.has(taskId)) subscribers.push(ws);
    });
    return subscribers;
  }
}

export const connectionManager = new ConnectionManager();

/**
 * Handler para mensagens de chat
 */
export async function handleChatSend(
  ws: WebSocket,
  data: { message: string; conversationId?: number }
): Promise<void> {
  try {
    // 1. Salvar mensagem do usuário
    const [userMessage] = await db.insert(chatMessages).values({
      conversationId: data.conversationId || 1,
      role: 'user',
      content: data.message,
      timestamp: new Date(),
    }).returning();

    // Enviar confirmação
    ws.send(JSON.stringify({
      type: 'chat:message',
      data: {
        id: userMessage.id,
        role: 'user',
        content: userMessage.content,
        timestamp: userMessage.timestamp.toISOString(),
      },
    }));

    // 2. Buscar contexto (últimas 10 mensagens)
    const history = await db.select()
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, data.conversationId || 1))
      .orderBy(desc(chatMessages.timestamp))
      .limit(10);

    // Inverter para ordem cronológica
    const contextMessages = history.reverse();

    // 3. Construir prompt com contexto
    let prompt = 'Você é um assistente do Orquestrador de IAs V3.0.\n\n';
    prompt += 'Contexto da conversa:\n';
    
    contextMessages.forEach(msg => {
      prompt += `${msg.role}: ${msg.content}\n`;
    });

    prompt += '\nResponda de forma útil e direta. Se o usuário pedir para criar uma tarefa, explique que ele pode usar a página "Nova Tarefa" do sistema.';

    // 4. Gerar resposta com streaming
    let fullResponse = '';
    let streamingStarted = false;

    await lmstudioService.generateCompletionStream(
      'llama-3.2-3b-instruct', // Modelo rápido para chat
      prompt,
      {
        temperature: 0.7,
        maxTokens: 1024,
      },
      (chunk) => {
        fullResponse += chunk;
        
        // Enviar chunk
        ws.send(JSON.stringify({
          type: 'chat:streaming',
          data: { chunk, done: false },
        }));

        streamingStarted = true;
      }
    );

    // 5. Finalizar streaming
    if (streamingStarted) {
      ws.send(JSON.stringify({
        type: 'chat:streaming',
        data: { chunk: '', done: true },
      }));
    }

    // 6. Salvar resposta completa
    const [assistantMessage] = await db.insert(chatMessages).values({
      conversationId: data.conversationId || 1,
      role: 'assistant',
      content: fullResponse || 'Desculpe, não consegui gerar uma resposta.',
      timestamp: new Date(),
    }).returning();

    // Enviar mensagem completa
    ws.send(JSON.stringify({
      type: 'chat:message',
      data: {
        id: assistantMessage.id,
        role: 'assistant',
        content: assistantMessage.content,
        timestamp: assistantMessage.timestamp.toISOString(),
      },
    }));

  } catch (error) {
    console.error('Erro ao processar chat:', error);
    ws.send(JSON.stringify({
      type: 'error',
      data: { message: `Erro ao processar mensagem: ${error}` },
    }));
  }
}

/**
 * Handler para buscar histórico de chat
 */
export async function handleChatHistory(
  ws: WebSocket,
  data: { conversationId?: number; limit?: number }
): Promise<void> {
  try {
    const history = await db.select()
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, data.conversationId || 1))
      .orderBy(desc(chatMessages.timestamp))
      .limit(data.limit || 50);

    // Inverter para ordem cronológica
    const messages = history.reverse().map(msg => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp.toISOString(),
    }));

    ws.send(JSON.stringify({
      type: 'chat:history',
      data: messages,
    }));

  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    ws.send(JSON.stringify({
      type: 'error',
      data: { message: `Erro ao buscar histórico: ${error}` },
    }));
  }
}

/**
 * Broadcast de atualização de tarefa
 */
export async function broadcastTaskUpdate(taskId: number): Promise<void> {
  try {
    // Buscar tarefa atualizada
    const [task] = await db.select()
      .from(tasks)
      .where(eq(tasks.id, taskId))
      .limit(1);

    if (!task) return;

    // Buscar subtarefas
    const taskSubtasks = await db.select()
      .from(subtasks)
      .where(eq(subtasks.taskId, taskId));

    const payload = {
      type: 'task:update',
      data: {
        task,
        subtasks: taskSubtasks,
        timestamp: new Date().toISOString(),
      },
    };

    // Enviar para todos os inscritos
    const subscribers = connectionManager.getTaskSubscribers(taskId);
    subscribers.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload));
      }
    });

  } catch (error) {
    console.error('Erro ao fazer broadcast de tarefa:', error);
  }
}

/**
 * Handler principal de mensagens
 */
export async function handleMessage(ws: WebSocket, message: string): Promise<void> {
  try {
    const parsed: WSMessage = JSON.parse(message);

    switch (parsed.type) {
      case 'chat:send':
        await handleChatSend(ws, parsed.data);
        break;

      case 'chat:history':
        await handleChatHistory(ws, parsed.data);
        break;

      case 'monitoring:subscribe':
        connectionManager.subscribeMonitoring(ws);
        ws.send(JSON.stringify({ type: 'monitoring:subscribed' }));
        break;

      case 'monitoring:unsubscribe':
        connectionManager.unsubscribeMonitoring(ws);
        ws.send(JSON.stringify({ type: 'monitoring:unsubscribed' }));
        break;

      case 'task:subscribe':
        connectionManager.subscribeTask(ws, parsed.data.taskId);
        ws.send(JSON.stringify({ type: 'task:subscribed', data: { taskId: parsed.data.taskId } }));
        break;

      case 'task:unsubscribe':
        connectionManager.unsubscribeTask(ws, parsed.data.taskId);
        ws.send(JSON.stringify({ type: 'task:unsubscribed', data: { taskId: parsed.data.taskId } }));
        break;

      case 'ping':
        ws.send(JSON.stringify({ type: 'pong' }));
        break;

      default:
        ws.send(JSON.stringify({
          type: 'error',
          data: { message: 'Tipo de mensagem desconhecido' },
        }));
    }

  } catch (error) {
    console.error('Erro ao processar mensagem WebSocket:', error);
    ws.send(JSON.stringify({
      type: 'error',
      data: { message: `Erro ao processar mensagem: ${error}` },
    }));
  }
}
