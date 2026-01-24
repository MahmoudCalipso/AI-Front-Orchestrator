/**
 * IDE Workspace request
 */
export interface IDEWorkspaceRequest {
  workspace_id: string;
  project_path?: string;
}

/**
 * IDE Workspace response
 */
export interface IDEWorkspace {
  id: string;
  name: string;
  path: string;
  created_at: string;
  last_accessed?: string;
}

/**
 * File write request
 */
export interface IDEFileWriteRequest {
  content: string;
}

/**
 * File info
 */
export interface FileInfo {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modified?: string;
  extension?: string;
}

/**
 * File content response
 */
export interface FileContentResponse {
  path: string;
  content: string;
  language?: string;
  encoding?: string;
  size: number;
}

/**
 * File tree node
 */
export interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileTreeNode[];
  extension?: string;
  size?: number;
}

/**
 * Terminal request
 */
export interface IDETerminalRequest {
  workspace_id: string;
  shell?: string;
}

/**
 * Terminal session
 */
export interface TerminalSession {
  session_id: string;
  workspace_id: string;
  shell: string;
  created_at: string;
}

/**
 * Debug request
 */
export interface IDEDebugRequest {
  workspace_id: string;
  language: string;
  program: string;
  args?: string[];
}

/**
 * Debug session
 */
export interface DebugSession {
  session_id: string;
  workspace_id: string;
  language: string;
  status: 'running' | 'paused' | 'stopped';
  breakpoints?: Breakpoint[];
}

/**
 * Breakpoint
 */
export interface Breakpoint {
  id: string;
  file: string;
  line: number;
  condition?: string;
  enabled: boolean;
}

/**
 * DAP (Debug Adapter Protocol) message
 */
export interface DAPMessage {
  type: 'request' | 'response' | 'event';
  command?: string;
  seq: number;
  request_seq?: number;
  success?: boolean;
  body?: any;
}

/**
 * Code completion request
 */
export interface CompletionRequest {
  offset: number;
  language?: string;
}

/**
 * Code completion item
 */
export interface CompletionItem {
  label: string;
  kind: CompletionKind;
  detail?: string;
  documentation?: string;
  insertText: string;
  sortText?: string;
}

export type CompletionKind =
  | 'text'
  | 'method'
  | 'function'
  | 'constructor'
  | 'field'
  | 'variable'
  | 'class'
  | 'interface'
  | 'module'
  | 'property'
  | 'unit'
  | 'value'
  | 'enum'
  | 'keyword'
  | 'snippet'
  | 'color'
  | 'file'
  | 'reference'
  | 'folder'
  | 'constant'
  | 'struct'
  | 'event'
  | 'operator'
  | 'type_parameter';

/**
 * Hover info request
 */
export interface HoverRequest {
  symbol: string;
  language?: string;
}

/**
 * Hover info response
 */
export interface HoverInfo {
  contents: string;
  range?: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
}

/**
 * Diagnostic
 */
export interface Diagnostic {
  range: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
  severity: DiagnosticSeverity;
  code?: string | number;
  source?: string;
  message: string;
  relatedInformation?: DiagnosticRelatedInfo[];
}

export type DiagnosticSeverity = 'error' | 'warning' | 'information' | 'hint';

/**
 * Diagnostic related info
 */
export interface DiagnosticRelatedInfo {
  location: {
    uri: string;
    range: {
      start: { line: number; character: number };
      end: { line: number; character: number };
    };
  };
  message: string;
}

/**
 * Refactor request
 */
export interface RefactorRequest {
  instruction: string;
  language?: string;
}

/**
 * Refactor response
 */
export interface RefactorResponse {
  original: string;
  refactored: string;
  changes: RefactorChange[];
}

/**
 * Refactor change
 */
export interface RefactorChange {
  type: 'insert' | 'delete' | 'replace';
  range: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
  text?: string;
}

/**
 * Standard response
 */
export interface StandardResponse {
  status: string;
  result?: any;
  message?: string;
}
