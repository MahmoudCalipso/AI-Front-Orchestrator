import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { BaseResponse } from '../../models/index';
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
      map(res => res.data!)
    );
  }

  /**
   * List all databases
   * POST /api/v1/database/list-databases
   */
  listDatabases(config: DatabaseConfig): Observable<DatabaseListResponse> {
    return this.post<BaseResponse<DatabaseListResponse>>('database/list-databases', { database_config: config }).pipe(
      map(res => res.data!)
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
      map(res => res.data!)
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
      map(res => res.data!)
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
      map(res => res.data!)
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
      map(res => res.data!)
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
      map(res => res.data!)
    );
  }

  // ==================== Advanced Database Operations ====================

  /**
   * Create new database
   * POST /api/v1/database/create
   */
  createDatabase(config: DatabaseConfig): Observable<any> {
    return this.post<BaseResponse<any>>('database/create', { database_config: config }).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Drop database
   * POST /api/v1/database/drop
   */
  dropDatabase(config: DatabaseConfig): Observable<any> {
    return this.post<BaseResponse<any>>('database/drop', { database_config: config }).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Create new table
   * POST /api/v1/database/create-table
   */
  createTable(tableName: string, schema: any, config: DatabaseConfig): Observable<any> {
    return this.post<BaseResponse<any>>('database/create-table', {
      table_name: tableName,
      schema,
      database_config: config
    }).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Drop table
   * POST /api/v1/database/drop-table
   */
  dropTable(tableName: string, config: DatabaseConfig): Observable<any> {
    return this.post<BaseResponse<any>>('database/drop-table', {
      table_name: tableName,
      database_config: config
    }).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Alter table
   * POST /api/v1/database/alter-table
   */
  alterTable(tableName: string, changes: any, config: DatabaseConfig): Observable<any> {
    return this.post<BaseResponse<any>>('database/alter-table', {
      table_name: tableName,
      changes,
      database_config: config
    }).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Get table indexes
   * POST /api/v1/database/get-indexes
   */
  getTableIndexes(tableName: string, config: DatabaseConfig): Observable<any> {
    return this.post<BaseResponse<any>>('database/get-indexes', {
      table_name: tableName,
      database_config: config
    }).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Create index
   * POST /api/v1/database/create-index
   */
  createIndex(tableName: string, indexName: string, columns: string[], config: DatabaseConfig): Observable<any> {
    return this.post<BaseResponse<any>>('database/create-index', {
      table_name: tableName,
      index_name: indexName,
      columns,
      database_config: config
    }).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Drop index
   * POST /api/v1/database/drop-index
   */
  dropIndex(tableName: string, indexName: string, config: DatabaseConfig): Observable<any> {
    return this.post<BaseResponse<any>>('database/drop-index', {
      table_name: tableName,
      index_name: indexName,
      database_config: config
    }).pipe(
      map(res => res.data!)
    );
  }

  // ==================== Database Backup & Restore ====================

  /**
   * Backup database
   * POST /api/v1/database/backup
   */
  backupDatabase(config: DatabaseConfig): Observable<any> {
    return this.post<BaseResponse<any>>('database/backup', { database_config: config }).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Restore database
   * POST /api/v1/database/restore
   */
  restoreDatabase(config: DatabaseConfig, backupFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('backup_file', backupFile);
    formData.append('database_config', JSON.stringify(config));

    return this.post<BaseResponse<any>>('database/restore', formData).pipe(
      map(res => res.data!)
    );
  }

  // ==================== Database Optimization ====================

  /**
   * Analyze table
   * POST /api/v1/database/analyze
   */
  analyzeTable(tableName: string, config: DatabaseConfig): Observable<any> {
    return this.post<BaseResponse<any>>('database/analyze', {
      table_name: tableName,
      database_config: config
    }).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Vacuum database
   * POST /api/v1/database/vacuum
   */
  vacuumDatabase(config: DatabaseConfig): Observable<any> {
    return this.post<BaseResponse<any>>('database/vacuum', { database_config: config }).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Optimize database
   * POST /api/v1/database/optimize
   */
  optimizeDatabase(config: DatabaseConfig): Observable<any> {
    return this.post<BaseResponse<any>>('database/optimize', { database_config: config }).pipe(
      map(res => res.data!)
    );
  }
}
