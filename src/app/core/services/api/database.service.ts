import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
    DatabaseAnalyzeRequest,
    DatabaseAnalyzeResponse,
    LanguageRegistry
} from '../../models/database/database.model';
import { DatabaseConfig } from '../../models/database/database-explorer.model';
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
            headers: search ? { 'X-Search': search } : undefined
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
            map(res => res.data!)
        );
    }

    /**
     * Get sample data from a table
     * POST /api/v1/database-explorer/table/{table_name}/data
     */
    getTableData(tableName: string, config: DatabaseConfig, limit: number = 50, offset: number = 0): Observable<any> {
        return this.post<BaseResponse<any>>(`database-explorer/table/${tableName}/data?limit=${limit}&offset=${offset}`, config).pipe(
            map(res => res.data!)
        );
    }

    /**
     * Execute a custom SQL query
     * POST /api/v1/database-explorer/query
     */
    executeQuery(query: string, config: DatabaseConfig): Observable<any> {
        return this.post<BaseResponse<any>>(`database-explorer/query?query=${encodeURIComponent(query)}`, config).pipe(
            map(res => res.data!)
        );
    }

    // ==================== Registry ====================

    /**
     * Get language and framework registry
     * GET /api/v1/registry/languages
     */
    getLanguageRegistry(): Observable<LanguageRegistry> {
        return this.get<BaseResponse<LanguageRegistry>>('registry/languages').pipe(
            map(res => (res as any).data || res)
        );
    }

    /**
     * Analyze database schema
     * POST /api/v1/database/analyze
     */
    analyzeDatabase(request: DatabaseAnalyzeRequest): Observable<DatabaseAnalyzeResponse> {
        return this.post<BaseResponse<DatabaseAnalyzeResponse>>('database/analyze', request).pipe(
            map(res => res.data!)
        );
    }
}
