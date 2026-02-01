/**
 * Database and registry models
 */

export interface DatabaseAnalyzeRequest {
    connection_string?: string;
    database_type: 'mysql' | 'postgresql' | 'mongodb' | 'mssql' | 'oracle';
    schema_name?: string;
}

export interface DatabaseAnalyzeResponse {
    database_type: string;
    schema: DatabaseSchema;
    tables: TableInfo[];
    relationships: Relationship[];
    indexes: IndexInfo[];
    statistics: DatabaseStatistics;
}

export interface DatabaseSchema {
    name: string;
    version?: string;
    charset?: string;
    collation?: string;
}

export interface TableInfo {
    name: string;
    schema: string;
    columns: ColumnInfo[];
    primary_key?: string[];
    row_count?: number;
    size_mb?: number;
}

export interface ColumnInfo {
    name: string;
    type: string;
    nullable: boolean;
    default_value?: any;
    max_length?: number;
    precision?: number;
    scale?: number;
    is_primary_key: boolean;
    is_foreign_key: boolean;
    is_unique: boolean;
    is_indexed: boolean;
}

export interface Relationship {
    name: string;
    from_table: string;
    from_column: string;
    to_table: string;
    to_column: string;
    type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

export interface IndexInfo {
    name: string;
    table: string;
    columns: string[];
    is_unique: boolean;
    type: string;
}

export interface DatabaseStatistics {
    total_tables: number;
    total_columns: number;
    total_indexes: number;
    total_relationships: number;
    total_size_mb: number;
}

export interface LanguageRegistry {
    languages: LanguageInfo[];
    last_updated: string;
}

export interface LanguageInfo {
    name: string;
    display_name: string;
    version: string;
    frameworks: FrameworkInfo[];
    package_manager: string;
    file_extensions: string[];
}

export interface FrameworkInfo {
    name: string;
    version: string;
    latest_version: string;
    description: string;
    architecture?: string;
    dependencies?: string[];
    features?: string[];
}

// ==================== Database Query ====================
export interface DatabaseQueryResponse {
    columns: string[];
    rows: any[][];
    execution_time?: number;
    total_count?: number;
}
