import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { BaseWebSocketService, WebSocketMessage } from './base-websocket.service';

export interface CollaborationUser {
  user_id: string;
  username: string;
  avatar_url?: string;
  cursor_position?: CursorPosition;
  selection?: TextSelection;
  color: string;
  online: boolean;
}

export interface CursorPosition {
  file: string;
  line: number;
  column: number;
}

export interface TextSelection {
  file: string;
  start: { line: number; column: number };
  end: { line: number; column: number };
}

export interface CollaborationEdit {
  user_id: string;
  file: string;
  operation: 'insert' | 'delete' | 'replace';
  position: { line: number; column: number };
  text?: string;
  length?: number;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  username: string;
  message: string;
  timestamp: number;
  type: 'text' | 'code' | 'system';
}

export interface CollaborationSession {
  session_id: string;
  project_id: string;
  users: CollaborationUser[];
  created_at: string;
}

/**
 * Collaboration WebSocket Service
 * Handles real-time collaboration features
 */
@Injectable({
  providedIn: 'root'
})
export class CollaborationWebSocketService extends BaseWebSocketService {
  private usersSubject = new BehaviorSubject<CollaborationUser[]>([]);
  private editsSubject = new Subject<CollaborationEdit>();
  private chatSubject = new Subject<ChatMessage>();
  private cursorUpdatesSubject = new Subject<{ user_id: string; position: CursorPosition }>();
  private selectionUpdatesSubject = new Subject<{ user_id: string; selection: TextSelection }>();

  public users$ = this.usersSubject.asObservable();
  public edits$ = this.editsSubject.asObservable();
  public chat$ = this.chatSubject.asObservable();
  public cursorUpdates$ = this.cursorUpdatesSubject.asObservable();
  public selectionUpdates$ = this.selectionUpdatesSubject.asObservable();

  private currentSessionId: string | null = null;
  private currentUserId: string | null = null;
  private userColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
  ];

  /**
   * Join collaboration session
   */
  joinSession(sessionId: string, userId: string, username: string): void {
    this.currentSessionId = sessionId;
    this.currentUserId = userId;

    this.connect(`/collaboration/${sessionId}`, {
      user_id: userId,
      username: username
    });

    // Subscribe to messages
    this.messages$.subscribe(msg => {
      this.handleMessage(msg);
    });
  }

  /**
   * Handle incoming messages
   */
  private handleMessage(msg: WebSocketMessage): void {
    switch (msg.type) {
      case 'user_joined':
        this.handleUserJoined(msg.payload);
        break;
      case 'user_left':
        this.handleUserLeft(msg.payload);
        break;
      case 'users_list':
        this.handleUsersList(msg.payload);
        break;
      case 'edit':
        this.editsSubject.next(msg.payload);
        break;
      case 'cursor':
        this.cursorUpdatesSubject.next(msg.payload);
        break;
      case 'selection':
        this.selectionUpdatesSubject.next(msg.payload);
        break;
      case 'chat':
        this.chatSubject.next(msg.payload);
        break;
    }
  }

  /**
   * Handle user joined
   */
  private handleUserJoined(user: CollaborationUser): void {
    const users = this.usersSubject.value;
    const existingIndex = users.findIndex(u => u.user_id === user.user_id);

    if (existingIndex === -1) {
      user.color = this.userColors[users.length % this.userColors.length];
      user.online = true;
      this.usersSubject.next([...users, user]);
    } else {
      users[existingIndex].online = true;
      this.usersSubject.next([...users]);
    }
  }

  /**
   * Handle user left
   */
  private handleUserLeft(payload: { user_id: string }): void {
    const users = this.usersSubject.value;
    const userIndex = users.findIndex(u => u.user_id === payload.user_id);

    if (userIndex !== -1) {
      users[userIndex].online = false;
      this.usersSubject.next([...users]);
    }
  }

  /**
   * Handle users list
   */
  private handleUsersList(users: CollaborationUser[]): void {
    const coloredUsers = users.map((user, index) => ({
      ...user,
      color: this.userColors[index % this.userColors.length],
      online: true
    }));
    this.usersSubject.next(coloredUsers);
  }

  /**
   * Send edit operation
   */
  sendEdit(edit: Omit<CollaborationEdit, 'user_id' | 'timestamp'>): void {
    if (!this.currentUserId) return;

    this.send({
      type: 'edit',
      payload: {
        ...edit,
        user_id: this.currentUserId,
        timestamp: Date.now()
      }
    });
  }

  /**
   * Send cursor position update
   */
  sendCursorPosition(position: CursorPosition): void {
    if (!this.currentUserId) return;

    this.send({
      type: 'cursor',
      payload: {
        user_id: this.currentUserId,
        position
      }
    });
  }

  /**
   * Send selection update
   */
  sendSelection(selection: TextSelection): void {
    if (!this.currentUserId) return;

    this.send({
      type: 'selection',
      payload: {
        user_id: this.currentUserId,
        selection
      }
    });
  }

  /**
   * Send chat message
   */
  sendChatMessage(message: string, type: 'text' | 'code' = 'text'): void {
    if (!this.currentUserId) return;

    this.send({
      type: 'chat',
      payload: {
        message,
        type
      }
    });
  }

  /**
   * Leave session
   */
  leaveSession(): void {
    this.disconnect();
    this.currentSessionId = null;
    this.currentUserId = null;
    this.usersSubject.next([]);
  }

  /**
   * Get online users
   */
  getOnlineUsers(): CollaborationUser[] {
    return this.usersSubject.value.filter(u => u.online);
  }

  /**
   * Get user by ID
   */
  getUser(userId: string): CollaborationUser | undefined {
    return this.usersSubject.value.find(u => u.user_id === userId);
  }

  /**
   * Get edits for specific file
   */
  getFileEdits(file: string): Observable<CollaborationEdit> {
    return this.edits$.pipe(
      filter(edit => edit.file === file)
    );
  }

  /**
   * Get cursor updates for specific file
   */
  getFileCursors(file: string): Observable<{ user_id: string; position: CursorPosition }> {
    return this.cursorUpdates$.pipe(
      filter(update => update.position.file === file)
    );
  }
}
