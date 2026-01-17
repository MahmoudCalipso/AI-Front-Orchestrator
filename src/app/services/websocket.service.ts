import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket | null = null;
  private messageSubject = new Subject<any>();

  constructor() {}

  connect(url: string): Observable<any> {
    this.socket = new WebSocket(url);

    this.socket.onmessage = (event) => {
      this.messageSubject.next(JSON.parse(event.data));
    };

    this.socket.onclose = (event) => {
      this.messageSubject.complete();
    };

    this.socket.onerror = (error) => {
      this.messageSubject.error(error);
    };

    return this.messageSubject.asObservable();
  }

  sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  // Specific WebSocket helpers
  connectToConsole(workbenchId: string): Observable<any> {
    return this.connect(`ws://localhost:8080/console/${workbenchId}`);
  }

  connectToTerminal(sessionId: string): Observable<any> {
    return this.connect(`ws://localhost:8080/api/ide/terminal/${sessionId}`);
  }

  connectToMonitoring(): Observable<any> {
    return this.connect(`ws://localhost:8080/api/monitoring/stream`);
  }
}
