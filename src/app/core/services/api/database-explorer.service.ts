import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import {
    DatabaseConfig,
    TableSchemaDTO,
    TableDataResponse,
    QueryExecutionRequest,
    QueryExecutionResponse,
    DatabaseConnectionTestRequest,
    DatabaseConnectionTestResponse,
    DatabaseListResponse,
    TableListResponse
} from '../../models/database/database-explorer.model';
import { BaseResponse } from '../../models';

/**
 * Database Explorer Service
 * Handles database introspection, querying, and management
 */
@Injectable({
    providedIn: 'root'
})
export class DatabaseExplorerService extends BaseApiService {

    /**
     * Test database connection
     * POST /api/v1/database/test-connection
     */
    testConnection(request: DatabaseConnectionTestRequest): Observable<DatabaseConnectionTestResponse> {
        return this.post<BaseResponse<DatabaseConnectionTestResponse>>('database/test-connection', request).pipe(
            map(res => res.data)
        );
    }

    /**
     * List all databases
     * POST /api/v1/database/list-databases
     */
    listDatabases(config: DatabaseConfig): Observable<DatabaseListResponse> {
        return this.post<BaseResponse<DatabaseListResponse>>('database/list-databases', { database_config: config }).pipe(
            map(res => res.data)
        );
    }

    /**
     * List all tables in a database
     * POST /api/v1/database/list-tables
     */
    listTables(config: DatabaseConfig, search?: string): Observable<TableListResponse> {
        const request: any = { database_config: config };
        if (search) request.search = search;

        return this.post<BaseResponse<TableListResponse>>('database/list-tables', request).pipe(
            map(res => res.data)
        );
    }

    /**
     * Get table schema
     * POST /api/v1/database/get-schema
     */
    getSchema(tableName: string, config: DatabaseConfig): Observable<TableSchemaDTO> {
        return this.post<BaseResponse<TableSchemaDTO>>('database/get-schema', {
            table_name: tableName,
            database_config: config
        }).pipe(
            map(res => res.data)
        );
    }

    /**
     * Get table data with pagination
     * POST /api/v1/database/get-data
     */
    getData(
        tableName: string,
        config: DatabaseConfig,
        limit: number = 100,
        offset: number = 0
    ): Observable<TableDataResponse> {
        return this.post<BaseResponse<TableDataResponse>>('database/get-data', {
            table_name: tableName,
            database_config: config,
            limit,
            offset
        }).pipe(
            map(res => res.data)
        );
    }

    /**
     * Execute custom SQL query
     * POST /api/v1/database/execute-query
     */
    executeQuery(request: QueryExecutionRequest): Observable<QueryExecutionResponse> {
        return this.post<BaseResponse<QueryExecutionResponse>>('database/execute-query', request, {
            timeout: 30000 // 30 seconds
        }).pipe(
            map(res => res.data)
        );
    }

    /**
     * Export table data as CSV
     * POST /api/v1/database/export-csv
     */
    exportTableAsCSV(tableName: string, config: DatabaseConfig): Observable<Blob> {
        return this.post<Blob>('database/export-csv', {
            table_name: tableName,
            database_config: config
        }, {
            headers: { 'Accept': 'text/csv' }
        });
    }

    /**
     * Get database statistics
     * POST /api/v1/database/statistics
     */
    getDatabaseStatistics(config: DatabaseConfig): Observable<any> {
        return this.post<BaseResponse<any>>('database/statistics', {
            database_config: config
        }).pipe(
            map(res => res.data)
        );
    }
}
