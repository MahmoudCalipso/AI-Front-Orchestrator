/**
 * IDE Models
 * All IDE-related DTOs matching backend Python models
 */

// ==================== IDE File ====================
export interface IDEFileResponseDTO {
  path: string;
  content?: string;
  size: number;
  encoding: string;
}

export interface IDEFileWriteRequest {
  content: string;
}

// ==================== IDE Terminal ====================
export interface IDETerminalRequest {
  workspace_id: string;
  shell?: string;
}

export interface IDETerminalResponseDTO {
  session_id: string;
  workspace_id: string;
}

// ==================== IDE Debug ====================
export interface IDEDebugRequest {
  workspace_id: string;
  language: string;
  program: string;
  args?: string[];
}

// ==================== IDE Tree Node ====================
export interface IDETreeNodeDTO {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: IDETreeNodeDTO[];
}

// ==================== IDE Intelligence ====================
export interface AICompletionResponseDTO {
  completions: string[];
  provider: string;
}

export interface AIHoverResponseDTO {
  contents: string;
  range?: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
}

// ==================== IDE Intelligence Request ====================
export interface AICompletionRequest {
  cursor_position?: {
    line: number;
    character: number;
  };
  language?: string;
  context_lines?: string[];
}

export interface AIHoverRequest {
  position: {
    line: number;
    character: number;
  };
  language?: string;
}

export interface AIRefactorRequest {
  refactoring_goal?: string;
  language?: string;
}

export interface AIDiagnosticsRequest {
  language?: string;
}

// ==================== Compatibility Aliases ====================
export type IDEWorkspace = any;
export type IDEWorkspaceRequest = any;
export type IDETerminalRequest = { workspace_id: string; cwd?: string; shell?: string };
export type TerminalSession = { id: string; workspace_id: string; cwd?: string };
export type IDEDebugRequest = any;
export type DebugSession = any;
export type DAPMessage = any;
export type CompletionRequest = any;
export type CompletionItem = any;
export type CompletionContext = any;
export type HoverRequest = any;
export type HoverInfo = any;
export type Diagnostic = any;
export type FileTreeNode = IDETreeNodeDTO;
export type FileInfo = IDEFileResponseDTO;
export type FileContentResponse = IDEFileResponseDTO;

// ==================== Workspace ====================
export interface IDEWorkspaceDTO {
  id: string;
  name: string;
  path: string;
  created_at?: string;
}

export interface IDEWorkspaceListResponse {
  workspaces: IDEWorkspaceDTO[];
  total: number;
}
