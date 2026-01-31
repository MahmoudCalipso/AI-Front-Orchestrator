import { EntityDefinition } from './entity-definition.model';
import { Node, Edge } from '@xyflow/react';

export interface CanvasState {
    zoom: number;
    panX: number;
    panY: number;
    gridEnabled: boolean;
    snapToGrid: boolean;
    gridSize: number;
}

export interface EntityNodeData {
    entity: EntityDefinition;
    color: string;
    icon: string;
    category: string;
    collapsed: boolean;
    [key: string]: unknown;
}

export type EntityNode = Node<EntityNodeData, 'entity'>;

export interface RelationshipEdgeData {
    relationshipType: '1:1' | '1:N' | 'N:M';
    label: string;
    foreignKey: string;
    onDelete: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
    onUpdate: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
    bidirectional: boolean;
    [key: string]: unknown;
}

export type RelationshipEdge = Edge<RelationshipEdgeData, 'relationship'>;
