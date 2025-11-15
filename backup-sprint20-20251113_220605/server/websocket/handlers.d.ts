/**
 * WebSocket Handlers - Chat, Monitoramento e Terminal em Tempo Real
 */
import { WebSocket } from 'ws';
export type WSMessage = {
    type: 'chat:send';
    data: {
        message: string;
        conversationId?: number;
    };
} | {
    type: 'chat:history';
    data: {
        conversationId?: number;
        limit?: number;
    };
} | {
    type: 'monitoring:subscribe';
} | {
    type: 'monitoring:unsubscribe';
} | {
    type: 'task:subscribe';
    data: {
        taskId: number;
    };
} | {
    type: 'task:unsubscribe';
    data: {
        taskId: number;
    };
} | {
    type: 'terminal:create';
} | {
    type: 'terminal:input';
    data: {
        sessionId: string;
        input: string;
    };
} | {
    type: 'terminal:resize';
    data: {
        sessionId: string;
        cols: number;
        rows: number;
    };
} | {
    type: 'terminal:close';
    data: {
        sessionId: string;
    };
} | {
    type: 'ping';
};
export type WSResponse = {
    type: 'chat:message';
    data: {
        id: number;
        role: string;
        content: string;
        timestamp: string;
    };
} | {
    type: 'chat:streaming';
    data: {
        chunk: string;
        done: boolean;
    };
} | {
    type: 'chat:history';
    data: Array<any>;
} | {
    type: 'metrics';
    data: any;
} | {
    type: 'task:update';
    data: any;
} | {
    type: 'terminal:created';
    data: {
        sessionId: string;
    };
} | {
    type: 'terminal:output';
    data: {
        sessionId: string;
        output: string;
    };
} | {
    type: 'terminal:exit';
    data: {
        sessionId: string;
        exitCode: number;
        signal?: number;
    };
} | {
    type: 'error';
    data: {
        message: string;
    };
} | {
    type: 'pong';
};
declare class ConnectionManager {
    private connections;
    register(ws: WebSocket): void;
    unregister(ws: WebSocket): void;
    subscribeMonitoring(ws: WebSocket): void;
    unsubscribeMonitoring(ws: WebSocket): void;
    subscribeTask(ws: WebSocket, taskId: number): void;
    unsubscribeTask(ws: WebSocket, taskId: number): void;
    getMonitoringSubscribers(): WebSocket[];
    getTaskSubscribers(taskId: number): WebSocket[];
}
export declare const connectionManager: ConnectionManager;
/**
 * Handler para mensagens de chat
 */
export declare function handleChatSend(ws: WebSocket, data: {
    message: string;
    conversationId?: number;
}): Promise<void>;
/**
 * Handler para buscar histórico de chat
 */
export declare function handleChatHistory(ws: WebSocket, data: {
    conversationId?: number;
    limit?: number;
}): Promise<void>;
/**
 * Broadcast de atualização de tarefa
 */
export declare function broadcastTaskUpdate(taskId: number): Promise<void>;
/**
 * Handler principal de mensagens
 */
export declare function handleMessage(ws: WebSocket, message: string): Promise<void>;
export {};
