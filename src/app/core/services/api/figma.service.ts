import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { BaseResponse } from '../../models/index';

export interface FigmaAnalyzeRequest {
    file_key: string;
    token?: string; // Optional if using system token
    node_ids?: string[];
    generate_code?: boolean;
}

export interface FigmaAnalysisResponseDTO {
    design_structure: any;
    generated_code?: any;
    assets?: any[];
    colors?: string[];
    typography?: any[];
}

/**
 * Figma Service
 * Handles Figma design analysis and code generation
 */
@Injectable({
    providedIn: 'root'
})
export class FigmaService extends BaseApiService {

    /**
     * Analyze Figma Design
     * POST /api/v1/figma/analyze
     */
    analyzeDesign(request: FigmaAnalyzeRequest): Observable<FigmaAnalysisResponseDTO> {
        return this.post<BaseResponse<FigmaAnalysisResponseDTO>>('figma/analyze', request).pipe(
            map(res => res.data!)
        );
    }
}
