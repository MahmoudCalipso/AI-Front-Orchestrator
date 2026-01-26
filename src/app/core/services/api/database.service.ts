import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
    DatabaseAnalyzeRequest,
    DatabaseAnalyzeResponse,
    LanguageRegistry
} from '../../models/database/database.model';

/**
 * Database Service
 * Handles database analysis and language registry operations
 */
@Injectable({
    providedIn: 'root'
})
export class DatabaseService extends BaseApiService {

    /**
     * Analyze database schema
     * POST /api/database/analyze
     */
    analyzeDatabase(request: DatabaseAnalyzeRequest): Observable<DatabaseAnalyzeResponse> {
        return this.post<DatabaseAnalyzeResponse>('/api/database/analyze', request, {
            timeout: 60000 // 60 seconds
        });
    }

    /**
     * Get language and framework registry
     * GET /registry/languages
     */
    getLanguageRegistry(): Observable<LanguageRegistry> {
        return this.get<LanguageRegistry>('/registry/languages');
    }

    /**
     * Get specific language information
     * GET /registry/languages/{language}
     */
    getLanguageInfo(language: string): Observable<any> {
        return this.get<any>(`/registry/languages/${language}`);
    }

    /**
     * Get framework information
     * GET /registry/languages/{language}/frameworks/{framework}
     */
    getFrameworkInfo(language: string, framework: string): Observable<any> {
        return this.get<any>(`/registry/languages/${language}/frameworks/${framework}`);
    }
}
