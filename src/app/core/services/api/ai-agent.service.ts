import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  CreateAgentRequest,
  UpdateAgentRequest
} from '../../models/ai-agent/agent.requests';
import {
  AgentResponseDTO,
  AgentListResponseDTO,
  AgentInitializationResponseDTO
} from '../../models/ai-agent/agent.responses';
import {
  OrchestrationRequest,
  OrchestrationResponseDTO as OrchestrationResponse
} from '../../models/orchestrate/orchestrate.dtos';
import { BaseResponse } from '../../models/common/base-response.model';

/**
 * AI Agent Service
 * Handles all AI-powered code operations
 */
@Injectable({
  providedIn: 'root'
})
export class AiAgentService extends BaseApiService {

  /**
   * Orchestrate using the agent swarm
   * POST /api/v1/orchestrate/
   */
  orchestrate(request: OrchestrationRequest): Observable<OrchestrationResponse> {
    return this.post<BaseResponse<OrchestrationResponse>>('orchestrate', request).pipe(
      map(res => res.data!)
    );
  }

  // ==================== Agent Management Operations ====================

  /**
   * Create a new AI agent
   * POST /api/v1/agents
   */
  createAgent(request: CreateAgentRequest): Observable<AgentInitializationResponseDTO> {
    return this.post<BaseResponse<AgentInitializationResponseDTO>>('agents', request).pipe(
      map(res => res.data!)
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
      map(res => res.data!)
    );
  }

  /**
   * Get agent by ID
   * GET /api/v1/agents/{agent_id}
   */
  getAgent(agentId: string): Observable<AgentResponseDTO> {
    return this.get<BaseResponse<AgentResponseDTO>>(`agents/${agentId}`).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Update agent configuration
   * PUT /api/v1/agents/{agent_id}
   */
  updateAgent(agentId: string, request: UpdateAgentRequest): Observable<AgentResponseDTO> {
    return this.put<BaseResponse<AgentResponseDTO>>(`agents/${agentId}`, request).pipe(
      map(res => res.data!)
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
  getAgentStatistics(agentId: string): Observable<any> {
    return this.get<BaseResponse<any>>(`agents/${agentId}/stats`).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Pause agent
   * POST /api/v1/agents/{agent_id}/pause
   */
  pauseAgent(agentId: string): Observable<AgentResponseDTO> {
    return this.post<BaseResponse<AgentResponseDTO>>(`agents/${agentId}/pause`, {}).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Resume agent
   * POST /api/v1/agents/{agent_id}/resume
   */
  resumeAgent(agentId: string): Observable<AgentResponseDTO> {
    return this.post<BaseResponse<AgentResponseDTO>>(`agents/${agentId}/resume`, {}).pipe(
      map(res => res.data!)
    );
  }

}
