import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, BehaviorSubject, Subscription, throwError } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { WebSocketMessage, WebSocketConfig } from '../../models/websocket/websocket.model';

/**
 * Base configuration and message types for WebSocket services
 */

export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';

/**
 * Base WebSocket Service
 * Provides common WebSocket functionality with auto-reconnection
 */
@Injectable({
  providedIn: 'root'
})
export class BaseWebSocketService implements OnDestroy {
  protected socket$: WebSocketSubject<any> | null = null;
  protected messagesSubject = new Subject<any>();
  protected connectionStateSubject = new BehaviorSubject<ConnectionState>('disconnected');

  protected reconnectAttempts = 0;
  protected maxReconnectAttempts = 5;
  protected reconnectInterval = 3000;
  protected subscriptions: Subscription[] = [];

  public messages$ = this.messagesSubject.asObservable();
  public connectionState$ = this.connectionStateSubject.asObservable();

  protected get wsUrl(): string {
    return environment.wsUrl;
  }

  /**
   * Connect to WebSocket endpoint
   */
  connect(config: WebSocketConfig | string, params?: Record<string, string>): Observable<any> {
    if (this.socket$) {
      this.disconnect();
    }

    let url: string;

    if (typeof config === 'string') {
      url = `${this.wsUrl}${config}`;
      if (params) {
        const queryString = Object.entries(params)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join('&');
        url += `?${queryString}`;
      }
    } else {
      url = config.url || `${this.wsUrl}${config.endpoint || ''}`;
      if (config.params) {
        const queryString = Object.entries(config.params)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join('&');
        url += `?${queryString}`;
      }
    }

    this.connectionStateSubject.next('connecting');

    this.socket$ = webSocket({
      url,
      openObserver: {
        next: () => {
          this.connectionStateSubject.next('connected');
          this.reconnectAttempts = 0;
          if (environment.enableLogging) {
            console.log(`WebSocket connected to ${url}`);
          }
        }
      },
      closeObserver: {
        next: (event) => {
          this.connectionStateSubject.next('disconnected');
          if (environment.enableLogging) {
            console.log(`WebSocket disconnected from ${url}`, event);
          }
          if (typeof config !== 'string' && config.reconnect) {
            this.handleReconnect(config);
          } else if (typeof config === 'string') {
            this.handleReconnect(config, params);
          }
        }
      }
    });

    const subscription = this.socket$.pipe(
      tap(message => {
        this.messagesSubject.next(message);
      }),
      catchError(error => {
        this.connectionStateSubject.next('error');
        if (environment.enableLogging) {
          console.error('WebSocket error:', error);
        }
        return throwError(() => error);
      })
    ).subscribe();

    this.subscriptions.push(subscription);
    return this.messages$;
  }

  /**
   * Handle reconnection logic
   */
  protected handleReconnect(config: WebSocketConfig | string, params?: Record<string, string>): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.connectionStateSubject.next('reconnecting');

      if (environment.enableLogging) {
        console.log(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      }

      setTimeout(() => {
        this.connect(config, params);
      }, this.reconnectInterval * this.reconnectAttempts);
    } else {
      this.connectionStateSubject.next('error');
      if (environment.enableLogging) {
        console.error('Max reconnection attempts reached');
      }
    }
  }

  /**
   * Send message through WebSocket
   */
  send<T>(message: WebSocketMessage<T>): void {
    if (this.socket$ && this.connectionStateSubject.value === 'connected') {
      this.socket$.next({
        ...message,
        timestamp: Date.now()
      });
    } else {
      if (environment.enableLogging) {
        console.warn('Cannot send message: WebSocket not connected');
      }
    }
  }

  /**
   * Send raw data through WebSocket
   */
  sendRaw(data: any): void {
    if (this.socket$ && this.connectionStateSubject.value === 'connected') {
      this.socket$.next(data);
    }
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
    }
    this.connectionStateSubject.next('disconnected');
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent auto-reconnect
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connectionStateSubject.value === 'connected';
  }

  /**
   * Reset reconnection attempts
   */
  resetReconnection(): void {
    this.reconnectAttempts = 0;
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.messagesSubject.complete();
    this.connectionStateSubject.complete();
  }
}
