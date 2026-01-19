/**
 * WebSocket message type
 */
export type WebSocketMessageType =
  | 'connect'
  | 'disconnect'
  | 'error'
  | 'ping'
  | 'pong'
  | 'data'
  | 'command'
  | 'response'
  | 'event';

/**
 * Base WebSocket message
 */
export interface WebSocketMessage<T = any> {
  type: WebSocketMessageType;
  id?: string;
  timestamp: string;
  payload: T;
}

/**
 * WebSocket connection state
 */
export enum WebSocketState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
  RECONNECTING = 4
}

/**
 * WebSocket configuration
 */
export interface WebSocketConfig {
  url: string;
  protocols?: string | string[];
  reconnect?: boolean;
  reconnectInterval?: number;
  reconnectMaxAttempts?: number;
  heartbeatInterval?: number;
  timeout?: number;
}

/**
 * Console workbench message types
 */
export type ConsoleMessageType = 'output' | 'input' | 'error' | 'clear' | 'resize';

/**
 * Console workbench message
 */
export interface ConsoleMessage {
  type: ConsoleMessageType;
  data: string;
  timestamp: string;
}

/**
 * Terminal message types
 */
export type TerminalMessageType = 'data' | 'resize' | 'exit';

/**
 * Terminal message
 */
export interface TerminalMessage {
  type: TerminalMessageType;
  data: string | { cols: number; rows: number };
  timestamp: string;
}

/**
 * Terminal resize
 */
export interface TerminalResize {
  cols: number;
  rows: number;
}

/**
 * Monitoring stream message types
 */
export type MonitoringMessageType =
  | 'metrics'
  | 'alert'
  | 'log'
  | 'event'
  | 'health';

/**
 * Monitoring stream message
 */
export interface MonitoringStreamMessage {
  type: MonitoringMessageType;
  data: any;
  timestamp: string;
}

/**
 * Real-time metrics event
 */
export interface MetricsEvent {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_io: {
    bytes_in: number;
    bytes_out: number;
  };
  active_connections: number;
  requests_per_second: number;
  timestamp: string;
}

/**
 * Alert event
 */
export interface AlertEvent {
  alert_id: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  metric: string;
  current_value: number;
  threshold: number;
  timestamp: string;
}

/**
 * Log event
 */
export interface LogEvent {
  level: 'debug' | 'info' | 'warning' | 'error' | 'fatal';
  message: string;
  service: string;
  timestamp: string;
  metadata?: any;
}

/**
 * Collaboration message types
 */
export type CollaborationMessageType =
  | 'join'
  | 'leave'
  | 'edit'
  | 'cursor'
  | 'selection'
  | 'chat'
  | 'sync';

/**
 * Collaboration message
 */
export interface CollaborationMessage {
  type: CollaborationMessageType;
  user_id: string;
  username: string;
  data: any;
  timestamp: string;
}

/**
 * User presence
 */
export interface UserPresence {
  user_id: string;
  username: string;
  avatar_url?: string;
  color: string;
  cursor_position?: {
    file: string;
    line: number;
    column: number;
  };
  status: 'active' | 'idle' | 'away';
  last_activity: string;
}

/**
 * Edit operation
 */
export interface EditOperation {
  file: string;
  range: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
  text: string;
  operation: 'insert' | 'delete' | 'replace';
}

/**
 * Chat message
 */
export interface CollaborationChatMessage {
  message_id: string;
  user_id: string;
  username: string;
  content: string;
  timestamp: string;
  reply_to?: string;
}

/**
 * Sync request
 */
export interface SyncRequest {
  file: string;
  version: number;
}

/**
 * Sync response
 */
export interface SyncResponse {
  file: string;
  version: number;
  content: string;
  operations: EditOperation[];
}

/**
 * WebSocket error
 */
export interface WebSocketError {
  code: number;
  reason: string;
  wasClean: boolean;
  timestamp: string;
}
