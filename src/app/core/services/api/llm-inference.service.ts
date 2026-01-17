import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  InferenceRequest,
  InferenceResponse,
  ModelInfo,
  ModelsListResponse,
  ModelLoadRequest,
  ModelLoadResponse,
  ModelDiscoveryRequest,
  ModelDiscoveryResponse,
  ChatCompletionRequest,
  ChatCompletionResponse
} from '../../models/llm/llm.model';

@Injectable({
  providedIn: 'root'
})
export class LlmInferenceService extends BaseApiService {

  /**
   * Run LLM inference
   * POST /inference
   */
  runInference(request: InferenceRequest): Observable<InferenceResponse> {
    return this.post<InferenceResponse>('/inference', request, { timeout: 120000 });
  }

  /**
   * Streaming LLM inference
   * POST /inference/stream
   */
  runStreamingInference(request: InferenceRequest): Observable<any> {
    // Note: For SSE streaming, use EventSource or specialized library
    return this.post<any>('/inference/stream', request);
  }

  /**
   * List available models
   * GET /models
   */
  listModels(): Observable<ModelsListResponse> {
    return this.get<ModelsListResponse>('/models');
  }

  /**
   * Get model information
   * GET /models/{model_name}
   */
  getModelInfo(modelName: string): Observable<ModelInfo> {
    return this.get<ModelInfo>(`/models/${modelName}`);
  }

  /**
   * Load specific model
   * POST /models/{model_name}/load
   */
  loadModel(modelName: string, request?: ModelLoadRequest): Observable<ModelLoadResponse> {
    return this.post<ModelLoadResponse>(`/models/${modelName}/load`, request || {});
  }

  /**
   * Unload model from memory
   * POST /models/{model_name}/unload
   */
  unloadModel(modelName: string): Observable<void> {
    return this.post<void>(`/models/${modelName}/unload`, {});
  }

  /**
   * Discover new models
   * POST /models/discover
   */
  discoverModels(request?: ModelDiscoveryRequest): Observable<ModelDiscoveryResponse> {
    return this.post<ModelDiscoveryResponse>('/models/discover', request || {});
  }

  /**
   * Chat completion
   * POST /chat/completions
   */
  chatCompletion(request: ChatCompletionRequest): Observable<ChatCompletionResponse> {
    return this.post<ChatCompletionResponse>('/chat/completions', request, { timeout: 120000 });
  }
}
