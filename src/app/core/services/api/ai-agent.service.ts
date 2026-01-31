import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  FixRequest,
  FixResponse,
  AnalyzeRequest,
  AnalyzeResponse,
  TestRequest,
  TestResponse,
  OptimizeRequest,
  OptimizeResponse,
  DocumentRequest,
  DocumentResponse,
  ReviewRequest,
  ReviewResponse,
  ExplainRequest,
  ExplainResponse,
  RefactorRequest,
  RefactorResponse,
  ProjectAnalyzeRequest,
  ProjectAnalyzeResponse,
  AddFeatureRequest,
  AddFeatureResponse,
  FigmaAnalyzeRequest,
  FigmaAnalyzeResponse
} from '../../models/ai-agent/ai-agent.model';
import {
  CreateAgentRequest,
  UpdateAgentRequest,
  AgentResponseDTO,
  AgentListResponseDTO,
  AgentInitializationResponseDTO,
  AgentStatistics
} from '../../models/ai-agent/agent-entity.model';
import { BaseResponse } from '../../models';

/**
 * AI Agent Service
 * Handles all AI-powered code operations
 */
@Injectable({
  providedIn: 'root'
})
export class AiAgentService extends BaseApiService {

  /**
   * Fix code issues with auto-correction
   * POST /api/fix
   */
  fixCode(request: FixRequest): Observable<FixResponse> {
    return this.post<FixResponse>('/api/fix', request);
  }

  /**
   * Analyze code quality and patterns
   * POST /api/analyze
   */
  analyzeCode(request: AnalyzeRequest): Observable<AnalyzeResponse> {
    return this.post<AnalyzeResponse>('/api/analyze', request);
  }

  /**
   * Generate test suites
   * POST /api/test
   */
  generateTests(request: TestRequest): Observable<TestResponse> {
    return this.post<TestResponse>('/api/test', request);
  }

  /**
   * Optimize code performance
   * POST /api/optimize
   */
  optimizeCode(request: OptimizeRequest): Observable<OptimizeResponse> {
    return this.post<OptimizeResponse>('/api/optimize', request);
  }

  /**
   * Generate documentation
   * POST /api/document
   */
  generateDocumentation(request: DocumentRequest): Observable<DocumentResponse> {
    return this.post<DocumentResponse>('/api/document', request);
  }

  /**
   * Perform code review
   * POST /api/review
   */
  reviewCode(request: ReviewRequest): Observable<ReviewResponse> {
    return this.post<ReviewResponse>('/api/review', request);
  }

  /**
   * Explain code functionality
   * POST /api/explain
   */
  explainCode(request: ExplainRequest): Observable<ExplainResponse> {
    return this.post<ExplainResponse>('/api/explain', request);
  }

  /**
   * Refactor code with best practices
   * POST /api/refactor
   */
  refactorCode(request: RefactorRequest): Observable<RefactorResponse> {
    return this.post<RefactorResponse>('/api/refactor', request);
  }

  /**
   * Analyze entire project structure
   * POST /api/project/analyze
   */
  analyzeProject(request: ProjectAnalyzeRequest): Observable<ProjectAnalyzeResponse> {
    return this.post<ProjectAnalyzeResponse>('/api/project/analyze', request, {
      timeout: 120000 // 2 minutes
    });
  }

  /**
   * Add feature to existing project
   * POST /api/project/add-feature
   */
  addFeature(request: AddFeatureRequest): Observable<AddFeatureResponse> {
    return this.post<AddFeatureResponse>('/api/project/add-feature', request, {
      timeout: 180000 // 3 minutes
    });
  }

  /**
   * Analyze Figma design
   * POST /api/v1/figma/analyze
   */
  analyzeFigma(request: FigmaAnalyzeRequest): Observable<FigmaAnalyzeResponse> {
    return this.post<FigmaAnalyzeResponse>('figma/analyze', request, {
      timeout: 120000 // 2 minutes
    });
  }

  // ==================== Agent Management Operations ====================

  /**
   * Create a new AI agent
   * POST /api/v1/agents
   */
  createAgent(request: CreateAgentRequest): Observable<AgentInitializationResponseDTO> {
    return this.post<BaseResponse<AgentInitializationResponseDTO>>('agents', request).pipe(
      map(res => res.data)
    );
  }

  /**
   * List all agents with pagination
   * GET /api/v1/agents
   */
  listAgents(page: number = 1, pageSize: number = 20, search?: string): Observable<AgentListResponseDTO> {
    const params: any = { page, page_size: pageSize };
    if (search) params.search = search;

    return this.get<BaseResponse<AgentListResponseDTO>>('agents', { params }).pipe(
      map(res => res.data)
    );
  }

  /**
   * Get agent by ID
   * GET /api/v1/agents/{agent_id}
   */
  getAgent(agentId: string): Observable<AgentResponseDTO> {
    return this.get<BaseResponse<AgentResponseDTO>>(`agents/${agentId}`).pipe(
      map(res => res.data)
    );
  }

  /**
   * Update agent configuration
   * PUT /api/v1/agents/{agent_id}
   */
  updateAgent(agentId: string, request: UpdateAgentRequest): Observable<AgentResponseDTO> {
    return this.put<BaseResponse<AgentResponseDTO>>(`agents/${agentId}`, request).pipe(
      map(res => res.data)
    );
  }

  /**
   * Delete agent
   * DELETE /api/v1/agents/{agent_id}
   */
  deleteAgent(agentId: string): Observable<void> {
    return this.delete<void>(`agents/${agentId}`);
  }

  /**
   * Get agent statistics
   * GET /api/v1/agents/{agent_id}/stats
   */
  getAgentStatistics(agentId: string): Observable<AgentStatistics> {
    return this.get<BaseResponse<AgentStatistics>>(`agents/${agentId}/stats`).pipe(
      map(res => res.data)
    );
  }

  /**
   * Pause agent
   * POST /api/v1/agents/{agent_id}/pause
   */
  pauseAgent(agentId: string): Observable<AgentResponseDTO> {
    return this.post<BaseResponse<AgentResponseDTO>>(`agents/${agentId}/pause`, {}).pipe(
      map(res => res.data)
    );
  }

  /**
   * Resume agent
   * POST /api/v1/agents/{agent_id}/resume
   */
  resumeAgent(agentId: string): Observable<AgentResponseDTO> {
    return this.post<BaseResponse<AgentResponseDTO>>(`agents/${agentId}/resume`, {}).pipe(
      map(res => res.data)
    );
  }

}
