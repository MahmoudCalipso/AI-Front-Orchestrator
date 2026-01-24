import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  IDEWorkspaceRequest,
  IDEWorkspace,
  IDEFileWriteRequest,
  FileInfo,
  FileContentResponse,
  FileTreeNode,
  IDETerminalRequest,
  TerminalSession,
  IDEDebugRequest,
  DebugSession,
  DAPMessage,
  CompletionRequest,
  CompletionItem,
  HoverRequest,
  HoverInfo,
  Diagnostic,
  RefactorRequest,
  RefactorResponse,
  StandardResponse
} from '../../models/ide/ide.model';

/**
 * IDE Service
 * Handles IDE workspaces, file operations, terminals, debugging, and code intelligence
 */
@Injectable({
  providedIn: 'root'
})
export class IDEService extends BaseApiService {

  // ==================== Workspace ====================

  /**
   * Create IDE workspace
   * POST /ide/workspace
   */
  createWorkspace(request: IDEWorkspaceRequest): Observable<StandardResponse> {
    return this.post<StandardResponse>('/ide/workspace', request);
  }

  // ==================== File Operations ====================

  /**
   * Read file content
   * GET /ide/files/{workspace_id}/{path}
   */
  readFile(workspaceId: string, filePath: string): Observable<FileContentResponse> {
    return this.get<FileContentResponse>(`/ide/files/${workspaceId}/${encodeURIComponent(filePath)}`);
  }

  /**
   * Write file content
   * POST /ide/files/{workspace_id}/{path}
   */
  writeFile(workspaceId: string, filePath: string, content: string): Observable<StandardResponse> {
    const request: IDEFileWriteRequest = { content };
    return this.post<StandardResponse>(`/ide/files/${workspaceId}/${encodeURIComponent(filePath)}`, request);
  }

  /**
   * Delete file
   * DELETE /ide/files/{workspace_id}/{path}
   */
  deleteFile(workspaceId: string, filePath: string): Observable<StandardResponse> {
    return this.delete<StandardResponse>(`/ide/files/${workspaceId}/${encodeURIComponent(filePath)}`);
  }

  /**
   * List files in directory
   * GET /ide/files/{workspace_id}
   */
  listFiles(workspaceId: string, directory: string = '.'): Observable<{ files: FileInfo[] }> {
    return this.get<{ files: FileInfo[] }>(`/ide/files/${workspaceId}`, { directory });
  }

  /**
   * Get complete file tree
   * GET /ide/tree/{workspace_id}
   */
  getFileTree(workspaceId: string): Observable<FileTreeNode> {
    return this.get<FileTreeNode>(`/ide/tree/${workspaceId}`);
  }

  // ==================== Terminal ====================

  /**
   * Create terminal session
   * POST /ide/terminal
   */
  createTerminal(request: IDETerminalRequest): Observable<StandardResponse> {
    return this.post<StandardResponse>('/ide/terminal', request);
  }

  // ==================== Debugging ====================

  /**
   * Create debug session
   * POST /ide/debug
   */
  createDebugSession(request: IDEDebugRequest): Observable<StandardResponse> {
    return this.post<StandardResponse>('/ide/debug', request);
  }

  /**
   * Handle DAP message
   * POST /ide/debug/{session_id}/dap
   */
  handleDAPMessage(sessionId: string, message: DAPMessage): Observable<DAPMessage> {
    return this.post<DAPMessage>(`/ide/debug/${sessionId}/dap`, message);
  }

  // ==================== Code Intelligence ====================

  /**
   * Get code completions
   * POST /ide/intelligence/completions/{workspace_id}/{path}
   */
  getCompletions(
    workspaceId: string,
    filePath: string,
    request: CompletionRequest
  ): Observable<{ completions: CompletionItem[] }> {
    return this.post<{ completions: CompletionItem[] }>(
      `/ide/intelligence/completions/${workspaceId}/${encodeURIComponent(filePath)}`,
      request
    );
  }

  /**
   * Get hover information
   * POST /ide/intelligence/hover/{workspace_id}/{path}
   */
  getHoverInfo(
    workspaceId: string,
    filePath: string,
    request: HoverRequest
  ): Observable<HoverInfo> {
    return this.post<HoverInfo>(
      `/ide/intelligence/hover/${workspaceId}/${encodeURIComponent(filePath)}`,
      request
    );
  }

  /**
   * Get diagnostics
   * GET /ide/intelligence/diagnostics/{workspace_id}/{path}
   */
  getDiagnostics(
    workspaceId: string,
    filePath: string,
    language?: string
  ): Observable<{ diagnostics: Diagnostic[] }> {
    return this.get<{ diagnostics: Diagnostic[] }>(
      `/ide/intelligence/diagnostics/${workspaceId}/${encodeURIComponent(filePath)}`,
      { language }
    );
  }

  /**
   * AI-powered refactoring
   * POST /ide/intelligence/refactor/{workspace_id}/{path}
   */
  aiRefactor(
    workspaceId: string,
    filePath: string,
    request: RefactorRequest
  ): Observable<RefactorResponse> {
    return this.post<RefactorResponse>(
      `/ide/intelligence/refactor/${workspaceId}/${encodeURIComponent(filePath)}`,
      request,
      { timeout: 60000 }
    );
  }
}
