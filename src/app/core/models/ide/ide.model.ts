/**
 * Workspace creation request
 */
export interface WorkspaceCreateRequest {
  name: string;
  description?: string;
  template?: string;
  language?: string;
  framework?: string;
  initialize_git?: boolean;
}

/**
 * Workspace response
 */
export interface WorkspaceResponse {
  workspace_id: string;
  name: string;
  path: string;
  created_at: string;
  status: 'active' | 'suspended' | 'terminated';
  owner: string;
}

/**
 * File tree node
 */
export interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  children?: FileTreeNode[];
  language?: string;
  readonly?: boolean;
}

/**
 * File content request
 */
export interface FileContentRequest {
  workspace_id: string;
  path: string;
  encoding?: string;
}

/**
 * File content response
 */
export interface FileContentResponse {
  content: string;
  path: string;
  language: string;
  size: number;
  last_modified: string;
  readonly: boolean;
}

/**
 * File write request
 */
export interface FileWriteRequest {
  workspace_id: string;
  path: string;
  content: string;
  create_directories?: boolean;
  encoding?: string;
}

/**
 * Terminal session request
 */
export interface TerminalCreateRequest {
  workspace_id: string;
  shell?: 'bash' | 'sh' | 'powershell' | 'cmd';
  cwd?: string;
  env?: { [key: string]: string };
}

/**
 * Terminal session response
 */
export interface TerminalSessionResponse {
  session_id: string;
  workspace_id: string;
  shell: string;
  cwd: string;
  status: 'active' | 'closed';
  pid: number;
}

/**
 * Debug session request
 */
export interface DebugSessionRequest {
  workspace_id: string;
  file: string;
  configuration?: DebugConfiguration;
}

/**
 * Debug configuration
 */
export interface DebugConfiguration {
  type: string;
  request: 'launch' | 'attach';
  name: string;
  program?: string;
  args?: string[];
  cwd?: string;
  env?: { [key: string]: string };
  stopOnEntry?: boolean;
}

/**
 * Debug session response
 */
export interface DebugSessionResponse {
  session_id: string;
  workspace_id: string;
  status: 'running' | 'paused' | 'stopped';
  breakpoints: Breakpoint[];
  variables?: Variable[];
  stack_trace?: StackFrame[];
}

/**
 * Breakpoint
 */
export interface Breakpoint {
  id: string;
  file: string;
  line: number;
  condition?: string;
  hit_count?: number;
  enabled: boolean;
}

/**
 * Variable
 */
export interface Variable {
  name: string;
  value: string;
  type: string;
  scope: 'local' | 'global' | 'closure';
}

/**
 * Stack frame
 */
export interface StackFrame {
  id: number;
  name: string;
  file: string;
  line: number;
  column: number;
}

/**
 * DAP (Debug Adapter Protocol) request
 */
export interface DAPRequest {
  session_id: string;
  command: string;
  arguments?: any;
}

/**
 * Code completion request
 */
export interface CompletionRequest {
  workspace_id: string;
  file: string;
  position: Position;
  context?: string;
  trigger?: string;
}

/**
 * Position in file
 */
export interface Position {
  line: number;
  character: number;
}

/**
 * Code completion response
 */
export interface CompletionResponse {
  completions: CompletionItem[];
  is_incomplete: boolean;
}

/**
 * Completion item
 */
export interface CompletionItem {
  label: string;
  kind: CompletionItemKind;
  detail?: string;
  documentation?: string;
  insert_text: string;
  sort_text?: string;
  filter_text?: string;
}

/**
 * Completion item kind
 */
export enum CompletionItemKind {
  Text = 1,
  Method = 2,
  Function = 3,
  Constructor = 4,
  Field = 5,
  Variable = 6,
  Class = 7,
  Interface = 8,
  Module = 9,
  Property = 10,
  Unit = 11,
  Value = 12,
  Enum = 13,
  Keyword = 14,
  Snippet = 15,
  Color = 16,
  File = 17,
  Reference = 18,
  Folder = 19,
  EnumMember = 20,
  Constant = 21,
  Struct = 22,
  Event = 23,
  Operator = 24,
  TypeParameter = 25
}

/**
 * Hover request
 */
export interface HoverRequest {
  workspace_id: string;
  file: string;
  position: Position;
}

/**
 * Hover response
 */
export interface HoverResponse {
  contents: string;
  range?: Range;
}

/**
 * Range in file
 */
export interface Range {
  start: Position;
  end: Position;
}

/**
 * Diagnostics response
 */
export interface DiagnosticsResponse {
  diagnostics: Diagnostic[];
  file: string;
}

/**
 * Diagnostic
 */
export interface Diagnostic {
  range: Range;
  severity: DiagnosticSeverity;
  code?: string;
  source?: string;
  message: string;
  related_information?: DiagnosticRelatedInformation[];
}

/**
 * Diagnostic severity
 */
export enum DiagnosticSeverity {
  Error = 1,
  Warning = 2,
  Information = 3,
  Hint = 4
}

/**
 * Diagnostic related information
 */
export interface DiagnosticRelatedInformation {
  location: {
    file: string;
    range: Range;
  };
  message: string;
}

/**
 * Refactor request
 */
export interface RefactorRequest {
  workspace_id: string;
  file: string;
  range: Range;
  refactor_type: 'rename' | 'extract' | 'inline' | 'move';
  new_name?: string;
}

/**
 * Refactor response
 */
export interface RefactorResponse {
  success: boolean;
  changes: WorkspaceEdit;
  message?: string;
}

/**
 * Workspace edit
 */
export interface WorkspaceEdit {
  changes: {
    [file: string]: TextEdit[];
  };
}

/**
 * Text edit
 */
export interface TextEdit {
  range: Range;
  new_text: string;
}
