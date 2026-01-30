import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { BaseResponse } from '../../models/index';
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
  Diagnostic
} from '../../models/ide/ide.model';
import {
  RefactorRequest,
  RefactorResponse
} from '../../models/ai-agent/ai-agent.model';
import { GitDiffResponse } from '../../models/git/git.model';

/**
 * IDE Service
 * Handles IDE workspaces, file operations, terminals, debugging, and code intelligence
 */
@Injectable({
  providedIn: 'root'
})
export class IDEService extends BaseApiService {

  /**
   * Get project structure
   * GET /api/v1/ide/structure/{workspace_id}
   */
  getProjectStructure(workspaceId: string): Observable<{ files: FileTreeNode[] }> {
    return this.get<BaseResponse<{ files: FileTreeNode[] }>>(`ide/structure/${workspaceId}`).pipe(
      map(res => res.data)
    );
  }

  /**
   * Get file content
   * GET /api/v1/ide/files/{workspace_id}/{path}
   */
  getFileContent(workspaceId: string, filePath: string): Observable<FileContentResponse> {
    return this.get<BaseResponse<FileContentResponse>>(`ide/files/${workspaceId}/${encodeURIComponent(filePath)}`).pipe(
      map(res => res.data)
    );
  }

  /**
   * Update file content
   * PATCH /api/v1/ide/files/{workspace_id}/{path}
   */
  updateFileContent(workspaceId: string, filePath: string, request: IDEFileWriteRequest): Observable<any> {
    return this.patch<BaseResponse<any>>(`ide/files/${workspaceId}/${encodeURIComponent(filePath)}`, request).pipe(
      map(res => res.data)
    );
  }

  /**
   * Create terminal session
   * POST /api/v1/ide/terminal
   */
  createTerminal(request: IDETerminalRequest): Observable<TerminalSession> {
    return this.post<BaseResponse<TerminalSession>>('ide/terminal', request).pipe(
      map(res => res.data)
    );
  }

  // ==================== IDE Workspace ====================

  /**
   * Create IDE workspace
   * POST /api/v1/ide/workspace
   */
  createWorkspace(request: IDEWorkspaceRequest): Observable<any> {
    return this.post<BaseResponse<any>>('ide/workspace', request).pipe(
      map(res => res.data)
    );
  }

  // ==================== File Operations ====================

  /**
   * Read file content
   * GET /api/v1/ide/files/{workspace_id}/{path}
   */
  readFile(workspaceId: string, filePath: string): Observable<FileContentResponse> {
    // Alias to getFileContent
    return this.getFileContent(workspaceId, filePath);
  }

  /**
   * Write file content
   * POST /api/v1/ide/files/{workspace_id}/{path}
   */
  writeFile(workspaceId: string, filePath: string, content: string): Observable<any> {
    const request: IDEFileWriteRequest = { content };
    return this.post<BaseResponse<any>>(`ide/files/${workspaceId}/${encodeURIComponent(filePath)}`, request).pipe(
      map(res => res.data)
    );
  }

  /**
   * Delete file
   * DELETE /api/v1/ide/files/{workspace_id}/{path}
   */
  deleteFile(workspaceId: string, filePath: string): Observable<any> {
    return this.delete<BaseResponse<any>>(`ide/files/${workspaceId}/${encodeURIComponent(filePath)}`).pipe(
      map(res => res.data)
    );
  }

  /**
   * List files in directory
   * GET /api/v1/ide/files/{workspace_id}
   */
  listFiles(workspaceId: string, directory: string = '.'): Observable<{ files: FileInfo[] }> {
    return this.get<BaseResponse<{ files: FileInfo[] }>>(`ide/files/${workspaceId}`, { directory }).pipe(
      map(res => res.data)
    );
  }

  /**
   * Get complete file tree
   * GET /api/v1/ide/tree/{workspace_id}
   */
  getFileTree(workspaceId: string): Observable<FileTreeNode> {
    return this.get<BaseResponse<FileTreeNode>>(`ide/tree/${workspaceId}`).pipe(
      map(res => res.data)
    );
  }

  // ==================== Debugging ====================

  /**
   * Create debug session
   * POST /api/v1/ide/debug
   */
  createDebugSession(request: IDEDebugRequest): Observable<any> {
    return this.post<BaseResponse<any>>('ide/debug', request).pipe(
      map(res => res.data)
    );
  }

  /**
   * Handle DAP message
   * POST /api/v1/ide/debug/{session_id}/dap
   */
  handleDAPMessage(sessionId: string, message: DAPMessage): Observable<DAPMessage> {
    return this.post<BaseResponse<DAPMessage>>(`ide/debug/${sessionId}/dap`, message).pipe(
      map(res => res.data)
    );
  }

  // ==================== Code Intelligence ====================

  /**
   * Get code completions
   * POST /api/v1/ide/intelligence/completions/{workspace_id}/{path}
   */
  getCompletions(
    workspaceId: string,
    filePath: string,
    request: CompletionRequest
  ): Observable<{ completions: CompletionItem[] }> {
    return this.post<BaseResponse<{ completions: CompletionItem[] }>>(
      `ide/intelligence/completions/${workspaceId}/${encodeURIComponent(filePath)}`,
      request
    ).pipe(
      map(res => res.data)
    );
  }

  /**
   * Get hover information
   * POST /api/v1/ide/intelligence/hover/{workspace_id}/{path}
   */
  getHoverInfo(
    workspaceId: string,
    filePath: string,
    request: HoverRequest
  ): Observable<HoverInfo> {
    return this.post<BaseResponse<HoverInfo>>(
      `ide/intelligence/hover/${workspaceId}/${encodeURIComponent(filePath)}`,
      request
    ).pipe(
      map(res => res.data)
    );
  }

  /**
   * Get diagnostics
   * GET /api/v1/ide/intelligence/diagnostics/{workspace_id}/{path}
   */
  getDiagnostics(
    workspaceId: string,
    filePath: string,
    language?: string
  ): Observable<{ diagnostics: Diagnostic[] }> {
    return this.get<BaseResponse<{ diagnostics: Diagnostic[] }>>(
      `ide/intelligence/diagnostics/${workspaceId}/${encodeURIComponent(filePath)}`,
      { language }
    ).pipe(
      map(res => res.data)
    );
  }

  /**
   * AI-powered refactoring
   * POST /api/v1/ide/intelligence/refactor/{workspace_id}/{path}
   */
  aiRefactor(
    workspaceId: string,
    filePath: string,
    request: RefactorRequest
  ): Observable<RefactorResponse> {
    return this.post<BaseResponse<RefactorResponse>>(
      `ide/intelligence/refactor/${workspaceId}/${encodeURIComponent(filePath)}`,
      request,
      { timeout: 60000 }
    ).pipe(
      map(res => res.data)
    );
  }

  /**
   * Search files in workspace
   * GET /api/v1/ide/search/{workspace_id}
   */
  searchFiles(workspaceId: string, query: string): Observable<any> {
    return this.get<BaseResponse<any>>(`ide/search/${workspaceId}`, { query }).pipe(
      map(res => res.data)
    );
  }
}
