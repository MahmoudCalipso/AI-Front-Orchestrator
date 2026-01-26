import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  GenerationRequest,
  GenerationResponse,
  AnalysisRequest,
  AnalysisResponse,
  EntityGenerationRequest
} from '../../models/generation/generation.model';
import { ApiResponse } from '../../models/common/api-response.model';

/**
 * Generation Service
 * Handles project generation and analysis operations
 */
@Injectable({
  providedIn: 'root'
})
export class GenerationService extends BaseApiService {

  /**
    * Analyze project description and get auto-configuration
    * POST /analyze-description
    */
  analyzeDescription(request: AnalysisRequest): Observable<AnalysisResponse> {
    return this.post<AnalysisResponse>('/analyze-description', request, {
      timeout: 60000 // 60 seconds for analysis
    });
  }

  /**
    * Generate complete project from configuration
    * POST /generate
    */
  generateProject(request: GenerationRequest): Observable<GenerationResponse> {
    return this.post<GenerationResponse>('/generate', request, {
      timeout: 300000 // 5 minutes for generation
    });
  }

  /**
    * Generate project from entity definitions
    * POST /entity/generate
    */
  generateFromEntities(request: EntityGenerationRequest): Observable<GenerationResponse> {
    return this.post<GenerationResponse>('/entity/generate', request, {
      timeout: 180000 // 3 minutes
    });
  }

  /**
    * Get generation status
    * GET /generation/{generation_id}/status
    */
  getGenerationStatus(generationId: string): Observable<ApiResponse> {
    return this.get<ApiResponse>(`/generation/${generationId}/status`);
  }

  /**
    * Cancel ongoing generation
    * POST /generation/{generation_id}/cancel
    */
  cancelGeneration(generationId: string): Observable<ApiResponse> {
    return this.post<ApiResponse>(`/generation/${generationId}/cancel`, {});
  }
}
