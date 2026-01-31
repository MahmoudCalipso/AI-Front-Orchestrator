/**
 * Database Explorer Models
 * DTOs for database introspection and querying
 */

/**
 * Database Type Enumeration
 */
export enum DatabaseType {
    POSTGRESQL = 'postgresql',
    MYSQL = 'mysql',
    SQLITE = 'sqlite',
    MONGODB = 'mongodb',
    REDIS = 'redis'
}

/**
 * Database Configuration
 */
export interface DatabaseConfig {
    type: DatabaseType;
    host?: string;
    port?: number;
    database: string;
    username?: string;
    password?: string;
    connection_string?: string;
    ssl?: boolean;
    options?: Record<string, any>;
}

/**
 * Table Schema DTO
 */
export interface TableSchemaDTO {
    table_name: string;
    columns: ColumnDefinition[];
    primary_keys: string[];
    foreign_keys: ForeignKeyDefinition[];
    indexes: IndexDefinition[];
    row_count?: number;
    size_bytes?: number;
}

/**
 * Column Definition
 */
export interface ColumnDefinition {
    name: string;
    data_type: string;
    is_nullable: boolean;
    default_value?: string;
    max_length?: number;
    precision?: number;
    scale?: number;
    is_primary_key: boolean;
    is_foreign_key: boolean;
    is_unique: boolean;
    is_indexed: boolean;
}

/**
 * Foreign Key Definition
 */
export interface ForeignKeyDefinition {
    name: string;
    column: string;
    referenced_table: string;
    referenced_column: string;
    on_delete?: string;
    on_update?: string;
}

/**
 * Index Definition
 */
export interface IndexDefinition {
    name: string;
    columns: string[];
    is_unique: boolean;
    type: string;
}

/**
 * Table Data Response
 */
export interface TableDataResponse {
    table_name: string;
    columns: string[];
    rows: any[][];
    total_rows: number;
    page: number;
    page_size: number;
}

/**
 * Query Execution Request
 */
export interface QueryExecutionRequest {
    query: string;
    database_config: DatabaseConfig;
    limit?: number;
    timeout?: number;
}

/**
 * Query Execution Response
 */
export interface QueryExecutionResponse {
    success: boolean;
    columns?: string[];
    rows?: any[][];
    affected_rows?: number;
    execution_time_ms: number;
    error?: string;
}

/**
 * Database Connection Test Request
 */
export interface DatabaseConnectionTestRequest {
    database_config: DatabaseConfig;
}

/**
 * Database Connection Test Response
 */
export interface DatabaseConnectionTestResponse {
    success: boolean;
    message: string;
    database_version?: string;
    connection_time_ms: number;
}

/**
 * Database List Response
 */
export interface DatabaseListResponse {
    databases: string[];
    total: number;
}

/**
 * Table List Response
 */
export interface TableListResponse {
    tables: string[];
    total: number;
}
