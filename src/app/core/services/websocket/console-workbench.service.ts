import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseWebSocketService } from './base-websocket.service';
import { environment } from '@environments/environment';
import { ConsoleMessage } from '../../models/websocket/websocket.model';

/**
 * Console Workbench WebSocket Service
 * Real-time terminal access to workbench
 * Endpoint: ws://localhost:8080/console/{workbench_id}
 */
@Injectable({
  providedIn: 'root'
})
export class ConsoleWorkbenchService extends BaseWebSocketService {

  /**
   * Connect to workbench console
   */
  connectToWorkbench(workbenchId: string): Observable<ConsoleMessage> {
    const url = `${environment.wsUrl}/console/${workbenchId}`;

    return this.connect({
      url,
      reconnect: true,
      heartbeatInterval: 30000 // 30 seconds
    }).pipe(
      map(message => message.payload as ConsoleMessage)
    );
  }

  /**
   * Send command to workbench
   */
  sendCommand(command: string): void {
    this.send({
      type: 'input',
      payload: { data: command },
      timestamp: Date.now()
    });
  }

  /**
   * Clear console
   */
  clearConsole(): void {
    this.send({
      type: 'clear',
      payload: {},
      timestamp: Date.now()
    });
  }

  /**
   * Resize terminal
   */
  resizeTerminal(cols: number, rows: number): void {
    this.send({
      type: 'resize',
      payload: { data: { cols, rows } },
      timestamp: Date.now()
    });
  }

  /**
   * Disconnect from workbench
   */
  disconnectWorkbench(): void {
    this.disconnect();
  }
}
