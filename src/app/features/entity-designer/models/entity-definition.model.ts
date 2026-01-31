export interface ValidationRule {
    type: string;
    value?: any;
    message?: string | null;
    condition?: string | null;
}

export interface EntityField {
    name: string;
    type: string;
    length?: number | null;
    projected_name?: string | null;
    description?: string | null;
    nullable?: boolean;
    unique?: boolean;
    primary_key?: boolean;
    auto_increment?: boolean;
    foreign_key?: string | null;
    default_value?: any;
    validations?: ValidationRule[];
}

export interface EntityRelationship {
    name: string;
    type: '1:1' | '1:N' | 'N:M';
    target_entity: string;
    foreign_key: string;
    on_delete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
    on_update?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
    bidirectional?: boolean;
}

export interface EntityDefinition {
    name: string;
    table_name?: string | null;
    description?: string | null;
    fields: EntityField[];
    relationships?: EntityRelationship[];
    features?: string[];
}
