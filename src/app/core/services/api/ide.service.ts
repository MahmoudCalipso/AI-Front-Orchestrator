import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  WorkspaceCreateRequest,
  WorkspaceResponse,
  FileTreeNode,
  FileContentResponse,
  TerminalCreateRequest,
  TerminalSessionResponse,
  DebugSessionRequest,
  DebugSessionResponse,
  DAPRequest,
  CompletionRequest,
  CompletionResponse,
  HoverRequest,
  HoverResponse,
  WorkspaceRefactorRequest as IdeRefactorRequest,
  WorkspaceRefactorResponse as IdeRefactorResponse,
  FileWriteRequest,
  DiagnosticsResponse
} from '../../models/ide/ide.model';

@Injectable({
  providedIn: 'root'
})
export class IdeService extends BaseApiService {

  // Workspace Management
  createWorkspace(request: WorkspaceCreateRequest): Observable<WorkspaceResponse> {
    return this.post<WorkspaceResponse>('/api/ide/workspace', request);
  }

  getWorkspace(workspaceId: string): Observable<WorkspaceResponse> {
    return this.get<WorkspaceResponse>(`/api/ide/workspace/${workspaceId}`);
  }

  listWorkspaceFiles(workspaceId: string): Observable<string[]> {
    return this.get<string[]>(`/api/ide/files/${workspaceId}`);
  }

  getFileContent(workspaceId: string, path: string): Observable<FileContentResponse> {
    return this.get<FileContentResponse>(`/api/ide/files/${workspaceId}/${path}`);
  }

  writeFile(workspaceId: string, path: string, content: string): Observable<void> {
    return this.post<void>(`/api/ide/files/${workspaceId}/${path}`, { content });
  }

  getFileTree(workspaceId: string): Observable<FileTreeNode> {
    return this.get<FileTreeNode>(`/api/ide/tree/${workspaceId}`);
  }

  // Terminal
  createTerminal(request: TerminalCreateRequest): Observable<TerminalSessionResponse> {
    return this.post<TerminalSessionResponse>('/api/ide/terminal', request);
  }

  // Debug
  createDebugSession(request: DebugSessionRequest): Observable<DebugSessionResponse> {
    return this.post<DebugSessionResponse>('/api/ide/debug', request);
  }

  sendDAPRequest(sessionId: string, request: DAPRequest): Observable<any> {
    return this.post<any>(`/api/ide/debug/${sessionId}/dap`, request);
  }

  // Intelligence
  getCompletions(workspaceId: string, path: string, request: CompletionRequest): Observable<CompletionResponse> {
    return this.post<CompletionResponse>(`/api/ide/intelligence/completions/${workspaceId}/${path}`, request);
  }

  getHover(workspaceId: string, path: string, request: HoverRequest): Observable<HoverResponse> {
    return this.post<HoverResponse>(`/api/ide/intelligence/hover/${workspaceId}/${path}`, request);
  }

  getDiagnostics(workspaceId: string, path: string): Observable<DiagnosticsResponse> {
    return this.get<DiagnosticsResponse>(`/api/ide/intelligence/diagnostics/${workspaceId}/${path}`);
  }

  refactor(workspaceId: string, path: string, request: IdeRefactorRequest): Observable<IdeRefactorResponse> {
    return this.post<IdeRefactorResponse>(`/api/ide/intelligence/refactor/${workspaceId}/${path}`, request);
  }

  // Compatibility methods for IdeLayoutComponent
  getProjectStructure(workspaceId: string): Observable<any> {
    return this.get<any>(`/api/ide/tree/${workspaceId}`);
  }

  updateFileContent(workspaceId: string, path: string, data: { content: string }): Observable<void> {
    return this.writeFile(workspaceId, path, data.content);
  }
}
