import { Injectable } from '@angular/core';
import { Observable, Subject, timer, NEVER } from 'rxjs';
import { retryWhen, tap, delayWhen, takeWhile } from 'rxjs/operators';
import { environment } from '@environments/environment';
import {
  WebSocketMessage,
  WebSocketState,
  WebSocketConfig,
  WebSocketError
} from '../../models/websocket/websocket.model';

/**
 * Base WebSocket Service
 * Provides WebSocket connection management with reconnection logic
 */
@Injectable({
  providedIn: 'root'
})
export class BaseWebSocketService {
  protected ws: WebSocket | null = null;
  protected messageSubject = new Subject<WebSocketMessage>();
  protected stateSubject = new Subject<WebSocketState>();
  protected errorSubject = new Subject<WebSocketError>();
  
  protected reconnectAttempts = 0;
  protected maxReconnectAttempts = environment.retryAttempts;
  protected reconnectInterval = environment.retryDelay;
  protected heartbeatTimer: any;

  /**
   * Connect to WebSocket
   */
  protected connect(config: WebSocketConfig): Observable<WebSocketMessage> {
    this.disconnect();
    
    const url = config.url.replace('http://', 'ws://').replace('https://', 'wss://');
    
    this.ws = new WebSocket(url, config.protocols);
    this.stateSubject.next(WebSocketState.CONNECTING);

    this.ws.onopen = () => {
      console.log('[WebSocket] Connected:', url);
      this.stateSubject.next(WebSocketState.OPEN);
      this.reconnectAttempts = 0;
      
      if (config.heartbeatInterval) {
        this.startHeartbeat(config.heartbeatInterval);
      }
    };

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.messageSubject.next(message);
      } catch (error) {
        console.error('[WebSocket] Failed to parse message:', error);
      }
    };

    this.ws.onerror = (event: Event) => {
      console.error('[WebSocket] Error:', event);
      const error: WebSocketError = {
        code: 0,
        reason: 'WebSocket error',
        wasClean: false,
        timestamp: new Date().toISOString()
      };
      this.errorSubject.next(error);
    };

    this.ws.onclose = (event: CloseEvent) => {
      console.log('[WebSocket] Closed:', event.code, event.reason);
      this.stateSubject.next(WebSocketState.CLOSED);
      this.stopHeartbeat();
      
      const error: WebSocketError = {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
        timestamp: new Date().toISOString()
      };
      this.errorSubject.next(error);

      // Attempt reconnection
      if (config.reconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        this.stateSubject.next(WebSocketState.RECONNECTING);
        
        const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);
        console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        
        setTimeout(() => {
          this.connect(config).subscribe();
        }, delay);
      }
    };

    return this.messageSubject.asObservable();
  }

  /**
   * Send message through WebSocket
   */
  protected send(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
      this.ws.send(messageStr);
    } else {
      console.error('[WebSocket] Cannot send message: WebSocket is not open');
    }
  }

  /**
   * Disconnect WebSocket
   */
  protected disconnect(): void {
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
  }

  /**
   * Start heartbeat ping
   */
  private startHeartbeat(interval: number): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping', timestamp: new Date().toISOString() });
      }
    }, interval);
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Get connection state
   */
  public getState(): Observable<WebSocketState> {
    return this.stateSubject.asObservable();
  }

  /**
   * Get errors
   */
  public getErrors(): Observable<WebSocketError> {
    return this.errorSubject.asObservable();
  }

  /**
   * Check if connected
   */
  public isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}
