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
    import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
    DatabaseAnalyzeRequest,
    DatabaseAnalyzeResponse,
    LanguageRegistry,
    DatabaseConfig // Assuming this exists or using any
} from '../../models/database/database.model';
import { BaseResponse } from '../../models/index';

/**
 * Database Service
 * Handles database explorer and registry operations
 * Refactored to match OpenAPI v1 endpoints
 */
@Injectable({
    providedIn: 'root'
})
export class DatabaseService extends BaseApiService {

    // ==================== Database Explorer ====================

    /**
     * List all tables in the project database
     * POST /api/v1/database-explorer/tables
     */
    listTables(config: DatabaseConfig, search?: string): Observable<string[]> {
        return this.post<BaseResponse<string[]>>('database-explorer/tables', config, {
            headers: search ? { 'X-Search': search } : undefined // Or query param if supported by BaseApi helper differently
        }).pipe(
            map(res => res.data || [])
        );
    }

    /**
     * Get schema for a specific table
     * POST /api/v1/database-explorer/table/{table_name}/schema
     */
    getTableSchema(tableName: string, config: DatabaseConfig): Observable<any> {
        return this.post<BaseResponse<any>>(`database-explorer/table/${tableName}/schema`, config).pipe(
            map(res => res.data)
        );
    }

    /**
     * Get sample data from a table
     * POST /api/v1/database-explorer/table/{table_name}/data
     */
    getTableData(tableName: string, config: DatabaseConfig, limit: number = 50, offset: number = 0): Observable<any> {
        // Query params for limit/offset
        const params = { limit, offset };
        // We need to pass params to POST? BaseApiService post doesn't take params arg easily in standard signature 
        // usually POST params are in body or query. OpenAPI says 'limit' in query, body is DatabaseConfig.
        // I need to construct the URL with query params manually if BaseApiService post doesn't support query params arg.
        // BaseApiService `post` signature: (path, body, options). 
        // I will append query string to path.
        return this.post<BaseResponse<any>>(`database-explorer/table/${tableName}/data?limit=${limit}&offset=${offset}`, config).pipe(
            map(res => res.data)
        );
    }

    /**
     * Execute a custom SQL query
     * POST /api/v1/database-explorer/query
     */
    executeQuery(query: string, config: DatabaseConfig): Observable<any> {
        // Query is a query param in OpenAPI! "query" in query, body is DatabaseConfig.
        return this.post<BaseResponse<any>>(`database-explorer/query?query=${encodeURIComponent(query)}`, config).pipe(
            map(res => res.data)
        );
    }

    // ==================== Registry ====================

    /**
     * Get language and framework registry
     * GET /api/v1/registry/languages
     */
    getLanguageRegistry(): Observable<LanguageRegistry> {
        // Checking openapi: /api/v1/registry/languages exists
        return this.get<BaseResponse<LanguageRegistry>>('registry/languages').pipe(
            map(res => (res as any).data || res) // handle if LanguageRegistry is direct or wrapped
        );
    }

    /**
     * Get specific language information
     * GET /api/v1/registry/languages/{language}
     */
    getLanguageInfo(language: string): Observable<any> {
        return this.get<BaseResponse<any>>(`registry/languages/${language}`).pipe(
            map(res => res.data)
        );
    }

    /**
     * Get framework information
     * GET /api/v1/registry/frameworks/{category}/{language}/{framework} 
     * Note: OpenAPI has /registry/frameworks/{category}/{language}. Also /registry/frameworks/{category}/{language}/{framework} (POST - Add/Update).
     * There is GET /registry/frameworks/{category}/{language}.
     * The old code had `registry/languages/{language}/frameworks/{framework}` which seems WRONG according to list.
     * I'll fix it to use `registry/frameworks/...` if I can determine category, or generic get?
     * OpenAPI: `get_categorized_frameworks` -> `registry/frameworks/{category}/{language}`.
     * I'll stick to what seems safe or generic.
     */
    getFrameworkInfo(category: string, language: string): Observable<any> {
        return this.get<BaseResponse<any>>(`registry/frameworks/${category}/${language}`).pipe(
            map(res => res.data)
        );
    }
}
