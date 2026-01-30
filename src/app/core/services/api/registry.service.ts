import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { BaseResponse } from '../../models/index';

/**
 * Registry Service
 * Handles framework and language registry operations
 */
@Injectable({
    providedIn: 'root'
})
export class RegistryService extends BaseApiService {

    /**
     * Get all supported languages
     * GET /api/v1/registry/languages
     */
    getLanguages(): Observable<{
        languages: Array<{
            name: string;
            version: string;
            frameworks: string[];
            package_manager: string;
            build_tool?: string;
        }>;
    }> {
        return this.get<BaseResponse<any>>('registry/languages').pipe(
            map(res => res.data)
        );
    }

    /**
     * Get frameworks for a specific language
     * GET /api/v1/registry/frameworks
     */
    getFrameworks(language?: string): Observable<{
        frameworks: Array<{
            name: string;
            language: string;
            version: string;
            latest_version: string;
            description: string;
            architectures?: string[];
            dependencies?: string[];
        }>;
    }> {
        return this.get<BaseResponse<any>>('registry/frameworks', language ? { language } : undefined).pipe(
            map(res => res.data)
        );
    }

    /**
     * Get specific framework details
     * GET /api/v1/registry/frameworks/{framework_name}
     */
    getFrameworkDetails(frameworkName: string): Observable<{
        name: string;
        language: string;
        version: string;
        latest_version: string;
        description: string;
        architectures: string[];
        dependencies: string[];
        templates: string[];
        best_practices: string[];
    }> {
        return this.get<BaseResponse<any>>(`registry/frameworks/${frameworkName}`).pipe(
            map(res => res.data)
        );
    }

    /**
     * Update registry (fetch latest versions)
     * POST /api/v1/registry/update
     */
    updateRegistry(): Observable<{
        message: string;
        updated_count: number;
        languages_updated: string[];
        frameworks_updated: string[];
    }> {
        return this.post<BaseResponse<any>>('registry/update', {}).pipe(
            map(res => res.data)
        );
    }

    /**
     * Get registry last update time
     * GET /api/v1/registry/info
     */
    getRegistryInfo(): Observable<{
        last_updated: string;
        total_languages: number;
        total_frameworks: number;
        version: string;
    }> {
        return this.get<BaseResponse<any>>('registry/info').pipe(
            map(res => res.data)
        );
    }

    /**
     * Search frameworks
     * GET /api/v1/registry/search
     */
    searchFrameworks(query: string): Observable<{
        results: Array<{
            name: string;
            language: string;
            version: string;
            description: string;
            relevance_score: number;
        }>;
    }> {
        return this.get<BaseResponse<any>>('registry/search', { q: query }).pipe(
            map(res => res.data)
        );
    }
}
