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
  AddFeatureResponse
} from '../../models/ai-agent/ai-agent.model';

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
}
