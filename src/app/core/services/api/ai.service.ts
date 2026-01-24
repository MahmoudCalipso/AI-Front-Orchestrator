import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  AIModel,
  AIModelsResponse,
  InferenceRequest,
  InferenceResponse,
  FixCodeRequest,
  AnalyzeCodeRequest,
  TestCodeRequest,
  OptimizeCodeRequest,
  DocumentCodeRequest,
  ReviewCodeRequest,
  ExplainCodeRequest,
  RefactorCodeRequest,
  StandardResponse,
  SwarmResponse,
  GenerateProjectRequest,
  MigrateProjectRequest
} from '../../models/ai/ai.model';
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
   * GET /models
   */
  listModels(params?: { page?: number; page_size?: number }): Observable<AIModelsResponse> {
    return this.get<AIModelsResponse>('/models', params);
  }

  /**
   * Get model information
   * GET /models/{model_name}
   */
  getModelInfo(modelName: string): Observable<AIModel> {
    return this.get<AIModel>(`/models/${modelName}`);
  }

  /**
   * Load a model into memory
   * POST /models/{model_name}/load
   */
  loadModel(modelName: string): Observable<{ status: string; model: string; details: any }> {
    return this.post<{ status: string; model: string; details: any }>(
      `/models/${modelName}/load`,
      {}
    );
  }

  /**
   * Unload a model from memory
   * POST /models/{model_name}/unload
   */
  unloadModel(modelName: string): Observable<{ status: string; model: string; details: any }> {
    return this.post<{ status: string; model: string; details: any }>(
      `/models/${modelName}/unload`,
      {}
    );
  }

  // ==================== Inference ====================

  /**
   * Run AI inference
   * POST /inference
   */
  runInference(request: InferenceRequest): Observable<InferenceResponse> {
    return this.post<InferenceResponse>('/inference', request, {
      timeout: 120000 // 2 minutes for inference
    });
  }

  /**
   * Run streaming AI inference (SSE)
   * POST /inference/stream
   */
  runInferenceStream(request: InferenceRequest): Observable<string> {
    return new Observable(observer => {
      const url = `${environment.apiUrl}/inference/stream`;

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': environment.apiKey
        },
        body: JSON.stringify(request)
      }).then(async response => {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          observer.error(new Error('No response body'));
          return;
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              observer.next(data);
            }
          }
        }

        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  // ==================== Code Operations ====================

  /**
   * Fix code issues
   * POST /api/fix
   */
  fixCode(request: FixCodeRequest): Observable<StandardResponse> {
    return this.post<StandardResponse>('/api/fix', request, {
      timeout: 60000
    });
  }

  /**
   * Analyze code
   * POST /api/analyze
   */
  analyzeCode(request: AnalyzeCodeRequest): Observable<StandardResponse> {
    return this.post<StandardResponse>('/api/analyze', request, {
      timeout: 60000
    });
  }

  /**
   * Generate tests
   * POST /api/test
   */
  generateTests(request: TestCodeRequest): Observable<StandardResponse> {
    return this.post<StandardResponse>('/api/test', request, {
      timeout: 60000
    });
  }

  /**
   * Optimize code
   * POST /api/optimize
   */
  optimizeCode(request: OptimizeCodeRequest): Observable<StandardResponse> {
    return this.post<StandardResponse>('/api/optimize', request, {
      timeout: 60000
    });
  }

  /**
   * Explain code
   * POST /api/explain
   */
  explainCode(request: ExplainCodeRequest): Observable<StandardResponse> {
    return this.post<StandardResponse>('/api/explain', request, {
      timeout: 60000
    });
  }

  /**
   * Refactor code
   * POST /api/refactor
   */
  refactorCode(request: RefactorCodeRequest): Observable<StandardResponse> {
    return this.post<StandardResponse>('/api/refactor', request, {
      timeout: 60000
    });
  }

  // ==================== Project Generation & Migration ====================

  /**
   * Generate a full project
   * POST /api/generate
   */
  generateProject(request: GenerateProjectRequest): Observable<SwarmResponse> {
    return this.post<SwarmResponse>('/api/generate', request, {
      timeout: 600000 // 10 minutes for full project generation
    });
  }

  /**
   * Migrate a project
   * POST /api/migrate
   */
  migrateProject(request: MigrateProjectRequest): Observable<SwarmResponse> {
    return this.post<SwarmResponse>('/api/migrate', request, {
      timeout: 600000 // 10 minutes for migration
    });
  }
}
