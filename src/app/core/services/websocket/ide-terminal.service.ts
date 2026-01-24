import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseWebSocketService } from './base-websocket.service';
import { environment } from '@environments/environment';
import { TerminalMessage, TerminalResize } from '../../models/websocket/websocket.model';

/**
 * IDE Terminal WebSocket Service
 * IDE terminal session
 * Endpoint: ws://localhost:8080/api/ide/terminal/{session_id}
 */
@Injectable({
  providedIn: 'root'
})
export class IdeTerminalService extends BaseWebSocketService {

  /**
   * Connect to IDE terminal session
   */
  connectToTerminal(sessionId: string): Observable<TerminalMessage> {
    const url = `${environment.wsUrl}/api/ide/terminal/${sessionId}`;

    return this.connect({
      url,
      reconnect: true,
      heartbeatInterval: 30000
    }).pipe(
      map(message => message.payload as TerminalMessage)
    );
  }

  /**
   * Send data to terminal
   */
  sendData(data: string): void {
    this.send({
      type: 'data',
      payload: { data },
      timestamp: Date.now()
    });
  }

  /**
   * Resize terminal
   */
  resizeTerminal(resize: TerminalResize): void {
    this.send({
      type: 'resize',
      payload: { data: resize },
      timestamp: Date.now()
    });
  }

  /**
   * Close terminal
   */
  closeTerminal(): void {
    this.send({
      type: 'exit',
      payload: {},
      timestamp: Date.now()
    });
    this.disconnect();
  }
}
