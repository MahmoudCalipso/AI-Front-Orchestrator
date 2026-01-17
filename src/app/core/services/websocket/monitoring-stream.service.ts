import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseWebSocketService } from './base-websocket.service';
import { environment } from '@environments/environment';
import {
  MonitoringStreamMessage,
  MetricsEvent,
  AlertEvent,
  LogEvent
} from '../../models/websocket/websocket.model';

/**
 * Monitoring Stream WebSocket Service
 * Real-time metrics streaming
 * Endpoint: ws://localhost:8080/api/monitoring/stream
 */
@Injectable({
  providedIn: 'root'
})
export class MonitoringStreamService extends BaseWebSocketService {

  /**
   * Connect to monitoring stream
   */
  connectToMonitoring(filters?: {
    metrics?: boolean;
    alerts?: boolean;
    logs?: boolean;
    health?: boolean;
  }): Observable<MonitoringStreamMessage> {
    const url = `${environment.wsUrl}/api/monitoring/stream`;
    
    return this.connect({
      url,
      reconnect: true,
      heartbeatInterval: 15000 // 15 seconds for monitoring
    }).pipe(
      map(message => {
        const streamMessage = message.payload as MonitoringStreamMessage;
        
        // Filter based on preferences
        if (filters) {
          if (!filters.metrics && streamMessage.type === 'metrics') return null;
          if (!filters.alerts && streamMessage.type === 'alert') return null;
          if (!filters.logs && streamMessage.type === 'log') return null;
          if (!filters.health && streamMessage.type === 'health') return null;
        }
        
        return streamMessage;
      }),
      map(message => message as MonitoringStreamMessage)
    );
  }

  /**
   * Subscribe to specific metric types
   */
  subscribeToMetrics(metricNames: string[]): void {
    this.send({
      type: 'command',
      payload: {
        action: 'subscribe',
        metrics: metricNames
      },
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Unsubscribe from metrics
   */
  unsubscribeFromMetrics(metricNames: string[]): void {
    this.send({
      type: 'command',
      payload: {
        action: 'unsubscribe',
        metrics: metricNames
      },
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Set alert threshold
   */
  setAlertThreshold(metric: string, threshold: number): void {
    this.send({
      type: 'command',
      payload: {
        action: 'set_threshold',
        metric,
        threshold
      },
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Disconnect from monitoring
   */
  disconnectMonitoring(): void {
    this.disconnect();
  }
}
