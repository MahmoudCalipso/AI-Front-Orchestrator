import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';

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
     * GET /api/registry/languages
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
        return this.get('/api/registry/languages');
    }

    /**
     * Get all frameworks grouped by language
     * GET /api/registry/frameworks
     */
    getAllFrameworks(search?: string): Observable<{
        status: string;
        code: string;
        message: string;
        data: { [language: string]: { [framework: string]: any } };
        meta?: { search?: string };
    }> {
        return this.get('/api/registry/frameworks', search ? { search } : undefined);
    }

    /**
     * Get frameworks for a specific language
     * GET /api/registry/frameworks/{language}
     */
    getFrameworksByLanguage(language: string): Observable<{
        status: string;
        code: string;
        message: string;
        data: { [framework: string]: any };
    }> {
        return this.get(`/api/registry/frameworks/${language}`);
    }

    /**
     * Get specific framework details
     * GET /api/registry/frameworks/{framework_name}
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
        return this.get(`/api/registry/frameworks/${frameworkName}`);
    }

    /**
     * Update registry (fetch latest versions)
     * POST /api/registry/update
     */
    updateRegistry(): Observable<{
        message: string;
        updated_count: number;
        languages_updated: string[];
        frameworks_updated: string[];
    }> {
        return this.post('/api/registry/update', {});
    }

    /**
     * Get registry last update time
     */
    getRegistryInfo(): Observable<{
        last_updated: string;
        total_languages: number;
        total_frameworks: number;
        version: string;
    }> {
        return this.get('/api/registry/info');
    }

    /**
     * Search frameworks
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
        return this.get('/api/registry/search', { q: query });
    }
}
