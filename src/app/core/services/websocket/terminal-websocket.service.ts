import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { BaseWebSocketService, WebSocketMessage } from './base-websocket.service';

export interface TerminalOutput {
  sessionId: string;
  data: string;
  timestamp: number;
}

export interface TerminalInput {
  sessionId: string;
  data: string;
}

/**
 * Terminal WebSocket Service
 * Handles real-time terminal communication
 */
@Injectable({
  providedIn: 'root'
})
export class TerminalWebSocketService extends BaseWebSocketService {
  private outputSubject = new Subject<TerminalOutput>();
  private activeSessionsSubject = new BehaviorSubject<Set<string>>(new Set());

  public output$ = this.outputSubject.asObservable();
  public activeSessions$ = this.activeSessionsSubject.asObservable();

  /**
   * Connect to terminal session
   */
  connectToTerminal(sessionId: string): void {
    this.connect(`/ide/terminal/${sessionId}`);

    // Track active session
    const sessions = this.activeSessionsSubject.value;
    sessions.add(sessionId);
    this.activeSessionsSubject.next(sessions);

    // Subscribe to messages for this session
    this.messages$.pipe(
      filter(msg => msg.type === 'output' || typeof msg === 'string')
    ).subscribe(msg => {
      const data = typeof msg === 'string' ? msg : msg.payload;
      this.outputSubject.next({
        sessionId,
        data,
        timestamp: Date.now()
      });
    });
  }

  /**
   * Send input to terminal
   */
  sendInput(sessionId: string, data: string): void {
    this.sendRaw(data);
  }

  /**
   * Send special key (e.g., Ctrl+C)
   */
  sendSpecialKey(sessionId: string, key: string): void {
    const specialKeys: Record<string, string> = {
      'ctrl+c': '\x03',
      'ctrl+d': '\x04',
      'ctrl+z': '\x1a',
      'ctrl+l': '\x0c',
      'tab': '\t',
      'enter': '\r',
      'backspace': '\x7f',
      'escape': '\x1b',
      'up': '\x1b[A',
      'down': '\x1b[B',
      'right': '\x1b[C',
      'left': '\x1b[D'
    };

    const keyCode = specialKeys[key.toLowerCase()];
    if (keyCode) {
      this.sendInput(sessionId, keyCode);
    }
  }

  /**
   * Resize terminal
   */
  resizeTerminal(sessionId: string, cols: number, rows: number): void {
    this.send({
      type: 'resize',
      payload: { cols, rows }
    });
  }

  /**
   * Disconnect from terminal session
   */
  disconnectFromTerminal(sessionId: string): void {
    this.disconnect();

    // Remove from active sessions
    const sessions = this.activeSessionsSubject.value;
    sessions.delete(sessionId);
    this.activeSessionsSubject.next(sessions);
  }

  /**
   * Get output stream for specific session
   */
  getSessionOutput(sessionId: string): Observable<TerminalOutput> {
    return this.output$.pipe(
      filter(output => output.sessionId === sessionId)
    );
  }

  /**
   * Check if session is active
   */
  isSessionActive(sessionId: string): boolean {
    return this.activeSessionsSubject.value.has(sessionId);
  }
}
