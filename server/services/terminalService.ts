/**
 * Terminal Service
 * Manages SSH/PTY terminal sessions with WebSocket
 */
import * as pty from 'node-pty';
import { WebSocket } from 'ws';
import os from 'os';

interface TerminalSession {
  id: string;
  ptyProcess: pty.IPty;
  ws: WebSocket;
  createdAt: Date;
}

class TerminalService {
  private sessions: Map<string, TerminalSession> = new Map();
  private sessionCounter = 0;

  /**
   * Create new terminal session
   */
  createSession(ws: WebSocket): string {
    const sessionId = `term_${Date.now()}_${++this.sessionCounter}`;
    
    // Determine shell based on OS
    const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
    
    // Create PTY process
    const ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 24,
      cwd: process.env.HOME || process.cwd(),
      env: process.env as { [key: string]: string },
    });

    // Handle PTY output -> WebSocket
    ptyProcess.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'terminal:output',
          data: { sessionId, output: data },
        }));
      }
    });

    // Handle PTY exit
    ptyProcess.onExit(({ exitCode, signal }) => {
      console.log(`Terminal ${sessionId} exited with code ${exitCode}, signal ${signal}`);
      
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'terminal:exit',
          data: { sessionId, exitCode, signal },
        }));
      }

      this.closeSession(sessionId);
    });

    // Store session
    this.sessions.set(sessionId, {
      id: sessionId,
      ptyProcess,
      ws,
      createdAt: new Date(),
    });

    console.log(`✅ Terminal session created: ${sessionId}`);
    return sessionId;
  }

  /**
   * Send input to terminal
   */
  sendInput(sessionId: string, input: string): boolean {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      console.error(`Terminal session not found: ${sessionId}`);
      return false;
    }

    try {
      session.ptyProcess.write(input);
      return true;
    } catch (error) {
      console.error(`Error writing to terminal ${sessionId}:`, error);
      return false;
    }
  }

  /**
   * Resize terminal
   */
  resize(sessionId: string, cols: number, rows: number): boolean {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      console.error(`Terminal session not found: ${sessionId}`);
      return false;
    }

    try {
      session.ptyProcess.resize(cols, rows);
      return true;
    } catch (error) {
      console.error(`Error resizing terminal ${sessionId}:`, error);
      return false;
    }
  }

  /**
   * Close terminal session
   */
  closeSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return false;
    }

    try {
      session.ptyProcess.kill();
      this.sessions.delete(sessionId);
      console.log(`❌ Terminal session closed: ${sessionId}`);
      return true;
    } catch (error) {
      console.error(`Error closing terminal ${sessionId}:`, error);
      return false;
    }
  }

  /**
   * Get session info
   */
  getSession(sessionId: string): TerminalSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * List all active sessions
   */
  listSessions(): Array<{ id: string; createdAt: Date }> {
    return Array.from(this.sessions.values()).map(session => ({
      id: session.id,
      createdAt: session.createdAt,
    }));
  }

  /**
   * Close all sessions
   */
  closeAllSessions(): void {
    for (const sessionId of this.sessions.keys()) {
      this.closeSession(sessionId);
    }
  }

  /**
   * Cleanup old sessions (older than 24 hours)
   */
  cleanupOldSessions(maxAgeMs: number = 24 * 60 * 60 * 1000): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      const age = now - session.createdAt.getTime();
      
      if (age > maxAgeMs) {
        this.closeSession(sessionId);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 Cleaned up ${cleaned} old terminal sessions`);
    }

    return cleaned;
  }
}

export const terminalService = new TerminalService();

// Cleanup old sessions every hour
setInterval(() => {
  terminalService.cleanupOldSessions();
}, 60 * 60 * 1000);
