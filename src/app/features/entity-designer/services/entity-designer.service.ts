import { Injectable, signal, computed } from '@angular/core';
import { EntityDefinition, EntityField, EntityRelationship } from '../models/entity-definition.model';
import { EntityNode, RelationshipEdge, CanvasState, EntityNodeData } from '../models/designer-state.model';

@Injectable({
    providedIn: 'root'
})
export class EntityDesignerService {
    // State signals
    private nodesSignal = signal<EntityNode[]>([]);
    private edgesSignal = signal<RelationshipEdge[]>([]);
    private selectedNodeIdSignal = signal<string | null>(null);
    private canvasStateSignal = signal<CanvasState>({
        zoom: 1,
        panX: 0,
        panY: 0,
        gridEnabled: true,
        snapToGrid: true,
        gridSize: 20
    });

    // Public readonly signals
    nodes = this.nodesSignal.asReadonly();
    edges = this.edgesSignal.asReadonly();
    selectedNodeId = this.selectedNodeIdSignal.asReadonly();
    canvasState = this.canvasStateSignal.asReadonly();

    // Computed: Selected Node
    selectedNode = computed(() => {
        const id = this.selectedNodeIdSignal();
        return id ? this.nodesSignal().find(n => n.id === id) || null : null;
    });

    // Computed: Get EntityDefinition array for API
    entityDefinitions = computed(() => {
        return this.nodesSignal().map(node => {
            const entity = { ...node.data.entity };

            // Sync relationships from edges where this node is the source
            const relationships: EntityRelationship[] = this.edgesSignal()
                .filter(edge => edge.source === node.id)
                .map(edge => ({
                    name: edge.data?.label || '',
                    type: edge.data?.relationshipType || '1:1',
                    target_entity: this.getEntityNameById(edge.target),
                    foreign_key: edge.data?.foreignKey || '',
                    on_delete: edge.data?.onDelete,
                    on_update: edge.data?.onUpdate,
                    bidirectional: edge.data?.bidirectional
                }));

            return {
                ...entity,
                relationships
            };
        });
    });

    // Actions
    addEntity(entity: EntityDefinition, position: { x: number, y: number }): string {
        const id = crypto.randomUUID();
        const newNode: EntityNode = {
            id,
            type: 'entity',
            position,
            data: {
                entity,
                color: this.getCategoryColor(entity.features?.[0] || 'Core Business'),
                icon: this.getCategoryIcon(entity.features?.[0] || 'Core Business'),
                category: entity.features?.[0] || 'Core Business',
                collapsed: false
            }
        };

        this.nodesSignal.update(nodes => [...nodes, newNode]);
        return id;
    }

    updateEntity(nodeId: string, updates: Partial<EntityDefinition>) {
        this.nodesSignal.update(nodes =>
            nodes.map(node =>
                node.id === nodeId
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            entity: { ...node.data.entity, ...updates },
                            // Sync color if category changed
                            color: updates.features ? this.getCategoryColor(updates.features[0]) : node.data.color,
                            icon: updates.features ? this.getCategoryIcon(updates.features[0]) : node.data.icon,
                            category: updates.features?.[0] || node.data.category
                        }
                    }
                    : node
            )
        );
    }

    deleteEntity(nodeId: string) {
        this.nodesSignal.update(nodes => nodes.filter(n => n.id !== nodeId));
        this.edgesSignal.update(edges =>
            edges.filter(e => e.source !== nodeId && e.target !== nodeId)
        );
        if (this.selectedNodeIdSignal() === nodeId) {
            this.selectedNodeIdSignal.set(null);
        }
    }

    addRelationship(sourceId: string, targetId: string, relationshipData: any) {
        const newEdge: RelationshipEdge = {
            id: crypto.randomUUID(),
            source: sourceId,
            target: targetId,
            type: 'relationship',
            data: relationshipData,
            animated: true,
            label: relationshipData.label
        };

        this.edgesSignal.update(edges => [...edges, newEdge]);
    }

    deleteRelationship(edgeId: string) {
        this.edgesSignal.update(edges => edges.filter(e => e.id !== edgeId));
    }

    updateRelationship(edgeId: string, updates: any) {
        this.edgesSignal.update(edges =>
            edges.map(edge =>
                edge.id === edgeId
                    ? { ...edge, data: { ...edge.data, ...updates }, label: updates.label }
                    : edge
            )
        );
    }

    setSelectedNode(nodeId: string | null) {
        this.selectedNodeIdSignal.set(nodeId);
    }

    updateCanvasState(updates: Partial<CanvasState>) {
        this.canvasStateSignal.update(state => ({ ...state, ...updates }));
    }

    setNodes(nodes: EntityNode[]) {
        this.nodesSignal.set(nodes);
    }

    setEdges(edges: RelationshipEdge[]) {
        this.edgesSignal.set(edges);
    }

    // Helpers
    private getEntityNameById(id: string): string {
        const node = this.nodesSignal().find(n => n.id === id);
        return node ? node.data.entity.name : 'Unknown';
    }

    private getCategoryColor(category: string): string {
        const colors: Record<string, string> = {
            'Authentication': '#4F46E5', // Indigo
            'Core Business': '#10B981', // Green
            'Feature': '#F59E0B',        // Amber
            'Auxiliary': '#6366F1',      // Blue
            'default': '#10B981'
        };
        return colors[category] || colors['default'];
    }

    private getCategoryIcon(category: string): string {
        const icons: Record<string, string> = {
            'Authentication': 'security',
            'Core Business': 'business_center',
            'Feature': 'star',
            'Auxiliary': 'settings_input_component',
            'default': 'account_tree'
        };
        return icons[category] || icons['default'];
    }

    // Import/Export
    exportToJSON() {
        return {
            entities: this.entityDefinitions()
        };
    }

    importFromJSON(data: { entities: EntityDefinition[] }) {
        this.nodesSignal.set([]);
        this.edgesSignal.set([]);

        data.entities.forEach((entity, index) => {
            this.addEntity(entity, {
                x: 100 + (index % 3) * 400,
                y: 100 + Math.floor(index / 3) * 400
            });
        });

        // Restore relationships after nodes are created
        data.entities.forEach(entity => {
            const sourceNode = this.nodesSignal().find(n => n.data.entity.name === entity.name);
            if (sourceNode && entity.relationships) {
                entity.relationships.forEach(rel => {
                    const targetNode = this.nodesSignal().find(n => n.data.entity.name === rel.target_entity);
                    if (targetNode) {
                        this.addRelationship(sourceNode.id, targetNode.id, {
                            relationshipType: rel.type,
                            label: rel.name,
                            foreignKey: rel.foreign_key,
                            onDelete: rel.on_delete || 'CASCADE',
                            onUpdate: rel.on_update || 'CASCADE',
                            bidirectional: rel.bidirectional || false
                        });
                    }
                });
            }
        });
    }
}
