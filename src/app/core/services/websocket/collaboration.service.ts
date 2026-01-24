import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseWebSocketService } from './base-websocket.service';
import { environment } from '@environments/environment';
import {
  CollaborationMessage,
  UserPresence,
  EditOperation,
  CollaborationChatMessage,
  SyncRequest,
  SyncResponse
} from '../../models/websocket/websocket.model';

/**
 * Collaboration WebSocket Service
 * Real-time collaboration
 * Endpoint: ws://localhost:8080/api/collaboration/{session_id}
 */
@Injectable({
  providedIn: 'root'
})
export class CollaborationService extends BaseWebSocketService {
  private userId: string = '';
  private username: string = '';

  /**
   * Connect to collaboration session
   */
  connectToSession(
    sessionId: string,
    userId: string,
    username: string
  ): Observable<CollaborationMessage> {
    this.userId = userId;
    this.username = username;

    const url = `${environment.wsUrl}/api/collaboration/${sessionId}`;

    const messages$ = this.connect({
      url,
      reconnect: true,
      heartbeatInterval: 20000 // 20 seconds
    }).pipe(
      map(message => message.payload as CollaborationMessage)
    );

    // Send join message
    setTimeout(() => {
      this.joinSession();
    }, 100);

    return messages$;
  }

  /**
   * Join collaboration session
   */
  private joinSession(): void {
    this.send({
      type: 'join',
      payload: {
        user_id: this.userId,
        username: this.username
      },
      timestamp: Date.now()
    });
  }

  /**
   * Leave collaboration session
   */
  leaveSession(): void {
    this.send({
      type: 'leave',
      payload: {
        user_id: this.userId,
        username: this.username
      },
      timestamp: Date.now()
    });
    this.disconnect();
  }

  /**
   * Send edit operation
   */
  sendEdit(operation: EditOperation): void {
    this.send({
      type: 'edit',
      payload: {
        user_id: this.userId,
        username: this.username,
        ...operation
      },
      timestamp: Date.now()
    });
  }

  /**
   * Update cursor position
   */
  updateCursor(file: string, line: number, column: number): void {
    this.send({
      type: 'cursor',
      payload: {
        user_id: this.userId,
        username: this.username,
        file,
        line,
        column
      },
      timestamp: Date.now()
    });
  }

  /**
   * Update selection
   */
  updateSelection(file: string, start: any, end: any): void {
    this.send({
      type: 'selection',
      payload: {
        user_id: this.userId,
        username: this.username,
        file,
        start,
        end
      },
      timestamp: Date.now()
    });
  }

  /**
   * Send chat message
   */
  sendChatMessage(content: string, replyTo?: string): void {
    const chatMessage: CollaborationChatMessage = {
      message_id: this.generateId(),
      user_id: this.userId,
      username: this.username,
      content,
      timestamp: Date.now(),
      reply_to: replyTo
    };

    this.send({
      type: 'chat',
      payload: chatMessage,
      timestamp: Date.now()
    });
  }

  /**
   * Request sync for file
   */
  requestSync(file: string, version: number): void {
    const syncRequest: SyncRequest = {
      file,
      version
    };

    this.send({
      type: 'sync',
      payload: {
        user_id: this.userId,
        username: this.username,
        ...syncRequest
      },
      timestamp: Date.now()
    });
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
