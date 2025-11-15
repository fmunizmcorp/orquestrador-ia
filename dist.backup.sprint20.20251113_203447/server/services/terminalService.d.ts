/**
 * Terminal Service
 * Manages SSH/PTY terminal sessions with WebSocket
 */
import * as pty from 'node-pty';
import { WebSocket } from 'ws';
interface TerminalSession {
    id: string;
    ptyProcess: pty.IPty;
    ws: WebSocket;
    createdAt: Date;
}
declare class TerminalService {
    private sessions;
    private sessionCounter;
    /**
     * Create new terminal session
     */
    createSession(ws: WebSocket): string;
    /**
     * Send input to terminal
     */
    sendInput(sessionId: string, input: string): boolean;
    /**
     * Resize terminal
     */
    resize(sessionId: string, cols: number, rows: number): boolean;
    /**
     * Close terminal session
     */
    closeSession(sessionId: string): boolean;
    /**
     * Get session info
     */
    getSession(sessionId: string): TerminalSession | undefined;
    /**
     * List all active sessions
     */
    listSessions(): Array<{
        id: string;
        createdAt: Date;
    }>;
    /**
     * Close all sessions
     */
    closeAllSessions(): void;
    /**
     * Cleanup old sessions (older than 24 hours)
     */
    cleanupOldSessions(maxAgeMs?: number): number;
}
export declare const terminalService: TerminalService;
export {};
