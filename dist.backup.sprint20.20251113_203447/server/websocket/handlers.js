/**
 * WebSocket Handlers - Chat, Monitoramento e Terminal em Tempo Real
 */
import { WebSocket } from 'ws';
import { db } from '../db/index.js';
import { chatMessages, tasks, subtasks } from '../db/schema.js';
import { lmstudioService } from '../services/lmstudioService.js';
import { terminalService } from '../services/terminalService.js';
import { eq, desc } from 'drizzle-orm';
// Gerenciador de conexões
class ConnectionManager {
    constructor() {
        Object.defineProperty(this, "connections", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    register(ws) {
        this.connections.set(ws, {
            monitoringSubscribed: false,
            taskSubscriptions: new Set(),
        });
    }
    unregister(ws) {
        this.connections.delete(ws);
    }
    subscribeMonitoring(ws) {
        const conn = this.connections.get(ws);
        if (conn)
            conn.monitoringSubscribed = true;
    }
    unsubscribeMonitoring(ws) {
        const conn = this.connections.get(ws);
        if (conn)
            conn.monitoringSubscribed = false;
    }
    subscribeTask(ws, taskId) {
        const conn = this.connections.get(ws);
        if (conn)
            conn.taskSubscriptions.add(taskId);
    }
    unsubscribeTask(ws, taskId) {
        const conn = this.connections.get(ws);
        if (conn)
            conn.taskSubscriptions.delete(taskId);
    }
    getMonitoringSubscribers() {
        const subscribers = [];
        this.connections.forEach((conn, ws) => {
            if (conn.monitoringSubscribed)
                subscribers.push(ws);
        });
        return subscribers;
    }
    getTaskSubscribers(taskId) {
        const subscribers = [];
        this.connections.forEach((conn, ws) => {
            if (conn.taskSubscriptions.has(taskId))
                subscribers.push(ws);
        });
        return subscribers;
    }
}
export const connectionManager = new ConnectionManager();
/**
 * Handler para mensagens de chat
 */
export async function handleChatSend(ws, data) {
    try {
        // 1. Salvar mensagem do usuário
        const result = await db.insert(chatMessages).values({
            conversationId: data.conversationId || 1,
            role: 'user',
            content: data.message,
        });
        const messageId = result[0]?.insertId || result.insertId;
        const [userMessage] = await db.select()
            .from(chatMessages)
            .where(eq(chatMessages.id, messageId))
            .limit(1);
        // Enviar confirmação
        ws.send(JSON.stringify({
            type: 'chat:message',
            data: {
                id: userMessage.id,
                role: 'user',
                content: userMessage.content,
                timestamp: userMessage.createdAt.toISOString(),
            },
        }));
        // 2. Buscar contexto (últimas 10 mensagens)
        const history = await db.select()
            .from(chatMessages)
            .where(eq(chatMessages.conversationId, data.conversationId || 1))
            .orderBy(desc(chatMessages.createdAt))
            .limit(10);
        // Inverter para ordem cronológica
        const contextMessages = history.reverse();
        // 3. Construir prompt com contexto
        let prompt = 'Você é um assistente do Orquestrador de IAs V3.5.1.\n\n';
        prompt += 'Contexto da conversa:\n';
        contextMessages.forEach(msg => {
            prompt += `${msg.role}: ${msg.content}\n`;
        });
        prompt += '\nResponda de forma útil e direta. Se o usuário pedir para criar uma tarefa, explique que ele pode usar a página "Nova Tarefa" do sistema.';
        // 4. Gerar resposta com streaming
        let fullResponse = '';
        let streamingStarted = false;
        await lmstudioService.generateCompletionStream('llama-3.2-3b-instruct', // Modelo rápido para chat
        prompt, {
            temperature: 0.7,
            maxTokens: 1024,
        }, (chunk) => {
            fullResponse += chunk;
            // Enviar chunk
            ws.send(JSON.stringify({
                type: 'chat:streaming',
                data: { chunk, done: false },
            }));
            streamingStarted = true;
        });
        // 5. Finalizar streaming
        if (streamingStarted) {
            ws.send(JSON.stringify({
                type: 'chat:streaming',
                data: { chunk: '', done: true },
            }));
        }
        // 6. Salvar resposta completa
        const result2 = await db.insert(chatMessages).values({
            conversationId: data.conversationId || 1,
            role: 'assistant',
            content: fullResponse || 'Desculpe, não consegui gerar uma resposta.',
        });
        const assistantMessageId = result2[0]?.insertId || result2.insertId;
        const [assistantMessage] = await db.select()
            .from(chatMessages)
            .where(eq(chatMessages.id, assistantMessageId))
            .limit(1);
        // Enviar mensagem completa
        ws.send(JSON.stringify({
            type: 'chat:message',
            data: {
                id: assistantMessage.id,
                role: 'assistant',
                content: assistantMessage.content,
                timestamp: assistantMessage.createdAt.toISOString(),
            },
        }));
    }
    catch (error) {
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
export async function handleChatHistory(ws, data) {
    try {
        const history = await db.select()
            .from(chatMessages)
            .where(eq(chatMessages.conversationId, data.conversationId || 1))
            .orderBy(desc(chatMessages.createdAt))
            .limit(data.limit || 50);
        // Inverter para ordem cronológica
        const messages = history.reverse().map(msg => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: msg.createdAt.toISOString(),
        }));
        ws.send(JSON.stringify({
            type: 'chat:history',
            data: messages,
        }));
    }
    catch (error) {
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
export async function broadcastTaskUpdate(taskId) {
    try {
        // Buscar tarefa atualizada
        const [task] = await db.select()
            .from(tasks)
            .where(eq(tasks.id, taskId))
            .limit(1);
        if (!task)
            return;
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
    }
    catch (error) {
        console.error('Erro ao fazer broadcast de tarefa:', error);
    }
}
/**
 * Handler principal de mensagens
 */
export async function handleMessage(ws, message) {
    try {
        const parsed = JSON.parse(message);
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
            case 'terminal:create':
                const sessionId = terminalService.createSession(ws);
                ws.send(JSON.stringify({
                    type: 'terminal:created',
                    data: { sessionId },
                }));
                break;
            case 'terminal:input':
                const inputSuccess = terminalService.sendInput(parsed.data.sessionId, parsed.data.input);
                if (!inputSuccess) {
                    ws.send(JSON.stringify({
                        type: 'error',
                        data: { message: 'Terminal session not found' },
                    }));
                }
                break;
            case 'terminal:resize':
                const resizeSuccess = terminalService.resize(parsed.data.sessionId, parsed.data.cols, parsed.data.rows);
                if (!resizeSuccess) {
                    ws.send(JSON.stringify({
                        type: 'error',
                        data: { message: 'Failed to resize terminal' },
                    }));
                }
                break;
            case 'terminal:close':
                terminalService.closeSession(parsed.data.sessionId);
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
    }
    catch (error) {
        console.error('Erro ao processar mensagem WebSocket:', error);
        ws.send(JSON.stringify({
            type: 'error',
            data: { message: `Erro ao processar mensagem: ${error}` },
        }));
    }
}
