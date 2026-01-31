import { Injectable } from '@angular/core';
import { EntityDefinition } from '../models/entity-definition.model';
import { RelationshipEdge, EntityNode } from '../models/designer-state.model';

export interface ValidationError {
    path: string;
    message: string;
    severity: 'error' | 'warning';
}

@Injectable({
    providedIn: 'root'
})
export class EntityValidationService {

    validateEntities(entities: EntityDefinition[]): ValidationError[] {
        const errors: ValidationError[] = [];

        // Check for duplicate entity names
        const names = entities.map(e => e.name.toLowerCase());
        const duplicates = names.filter((name, index) => names.indexOf(name) !== index);

        duplicates.forEach(name => {
            errors.push({
                path: `entities.${name}`,
                message: `Entity name "${name}" is duplicated`,
                severity: 'error'
            });
        });

        entities.forEach(entity => {
            // Validate Entity Name format (PascalCase)
            if (!/^[A-Z][a-zA-Z0-9]*$/.test(entity.name)) {
                errors.push({
                    path: entity.name,
                    message: `Entity name "${entity.name}" should be in PascalCase`,
                    severity: 'warning'
                });
            }

            // Validate Fields
            if (!entity.fields || entity.fields.length === 0) {
                errors.push({
                    path: entity.name,
                    message: `Entity "${entity.name}" must have at least one field`,
                    severity: 'error'
                });
            } else {
                const fieldNames = entity.fields.map(f => f.name.toLowerCase());
                const fieldDuplicates = fieldNames.filter((name, index) => fieldNames.indexOf(name) !== index);

                fieldDuplicates.forEach(name => {
                    errors.push({
                        path: `${entity.name}.${name}`,
                        message: `Field name "${name}" is duplicated in entity "${entity.name}"`,
                        severity: 'error'
                    });
                });

                // Check for primary key
                if (!entity.fields.some(f => f.primary_key)) {
                    errors.push({
                        path: entity.name,
                        message: `Entity "${entity.name}" is missing a primary key`,
                        severity: 'warning'
                    });
                }
            }

            // Validate Relationships
            entity.relationships?.forEach(rel => {
                const target = entities.find(e => e.name === rel.target_entity);
                if (!target) {
                    errors.push({
                        path: `${entity.name}.${rel.name}`,
                        message: `Relationship target "${rel.target_entity}" not found`,
                        severity: 'error'
                    });
                }
            });
        });

        return errors;
    }

    validateRelationship(edge: RelationshipEdge, nodes: EntityNode[]): ValidationError[] {
        const errors: ValidationError[] = [];
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);

        if (!sourceNode || !targetNode) {
            errors.push({ path: 'edge', message: 'Source or target node not found', severity: 'error' });
            return errors;
        }

        if (!edge.data?.foreignKey) {
            errors.push({ path: 'edge', message: 'Foreign key field must be specified', severity: 'error' });
        } else {
            // Check if FK field exists in source
            const fieldExists = sourceNode.data.entity.fields.some(f => f.name === edge.data?.foreignKey);
            if (!fieldExists) {
                errors.push({
                    path: sourceNode.data.entity.name,
                    message: `Field "${edge.data.foreignKey}" not found in source entity "${sourceNode.data.entity.name}"`,
                    severity: 'error'
                });
            }
        }

        return errors;
    }
}
