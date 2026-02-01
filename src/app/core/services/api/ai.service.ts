import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { BaseResponse } from '../../models/index';
import {
  ModelInfo,
  FixCodeRequest,
  AnalyzeCodeRequest,
  TestCodeRequest,
  OptimizeCodeRequest,
  RefactorCodeRequest,
  SwarmResponse,
  UpdateAgentRequest
} from '../../models/ai-agent/agent-entity.model';
import { ProjectCreateRequest, ProjectResponse } from '../../models/project/project.model';
import { OrchestrationRequest, OrchestrationResponseDTO as OrchestrationResponse } from '../../models/orchestrate/orchestrate.dtos';
import { SecurityScanRequest } from '../../models/security/security.model';
import { environment } from '@environments/environment';

/**
 * AI Service
 * Handles AI inference, model management, and code operations
 */
@Injectable({
  providedIn: 'root'
})
export class AIService extends BaseApiService {

  // ==================== Models ====================

  /**
   * List all available AI models
   * GET /api/v1/models
   */
  listModels(): Observable<ModelInfo[]> {
    return this.get<BaseResponse<ModelInfo[]>>('models').pipe(
      map(res => res.data!)
    );
  }

  /**
   * Get model information
   * GET /api/v1/models/{model_name}
   */
  getModelInfo(modelName: string): Observable<ModelInfo> {
    return this.get<BaseResponse<ModelInfo>>(`models/${modelName}`).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Load a model into memory
   * POST /api/v1/models/{model_name}/load
   */
  loadModel(modelName: string): Observable<any> {
    return this.post<BaseResponse<any>>(`models/${modelName}/load`, {}).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Unload a model from memory
   * POST /api/v1/models/{model_name}/unload
   */
  unloadModel(modelName: string): Observable<any> {
    return this.post<BaseResponse<any>>(`models/${modelName}/unload`, {}).pipe(
      map(res => res.data!)
    );
  }

  // ==================== Inference & Orchestration ====================

  /**
   * Run AI orchestration (Agent Swarm)
   * POST /api/v1/orchestrate
   */
  orchestrate(request: OrchestrationRequest): Observable<OrchestrationResponse> {
    return this.post<BaseResponse<OrchestrationResponse>>('orchestrate', request, {
      timeout: 300000 // 5 minutes
    }).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Update Agent Configuration
   * PATCH /api/v1/agents/{agent_id}
   */
  updateAgent(agentId: string, request: UpdateAgentRequest): Observable<any> {
    return this.patch<BaseResponse<any>>(`agents/${agentId}`, request).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Chat with AI (simple inference)
   * POST /api/v1/ai/chat
   */
  chat(request: { prompt: string; model?: string; temperature?: number }): Observable<{ response: string }> {
    return this.post<BaseResponse<{ response: string }>>('ai/chat', request).pipe(
      map(res => res.data!)
    );
  }

  // ==================== Code Operations ====================

  /**
   * Fix code issues
   * POST /api/v1/code/fix
   */
  fixCode(request: FixCodeRequest): Observable<any> {
    return this.post<BaseResponse<any>>('code/fix', request).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Analyze code
   * POST /api/v1/code/analyze
   */
  analyzeCode(request: AnalyzeCodeRequest): Observable<any> {
    return this.post<BaseResponse<any>>('code/analyze', request).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Generate tests
   * POST /api/v1/code/test
   */
  generateTests(request: TestCodeRequest): Observable<any> {
    return this.post<BaseResponse<any>>('code/test', request).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Optimize code
   * POST /api/v1/code/optimize
   */
  optimizeCode(request: OptimizeCodeRequest): Observable<any> {
    return this.post<BaseResponse<any>>('code/optimize', request).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Refactor code
   * POST /api/v1/code/refactor
   */
  refactorCode(request: RefactorCodeRequest): Observable<any> {
    return this.post<BaseResponse<any>>('code/refactor', request).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Security Scan
   * POST /api/v1/security/scan
   */
  securityScan(request: SecurityScanRequest): Observable<any> {
    return this.post<BaseResponse<any>>('security/scan', request).pipe(
      map(res => res.data!)
    );
  }

  // ==================== Project Generation & Migration (Swarm) ====================

  /**
   * Generate a full project
   * POST /api/v1/swarm/generate
   */
  generateProject(request: ProjectCreateRequest): Observable<SwarmResponse> {
    return this.post<BaseResponse<SwarmResponse>>('swarm/generate', request, {
      timeout: 600000 // 10 minutes
    }).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Migrate a project
   * POST /api/v1/swarm/migrate
   */
  migrateProject(request: any): Observable<SwarmResponse> {
    return this.post<BaseResponse<SwarmResponse>>('swarm/migrate', request, {
      timeout: 600000 // 10 minutes
    }).pipe(
      map(res => res.data!)
    );
  }
}
