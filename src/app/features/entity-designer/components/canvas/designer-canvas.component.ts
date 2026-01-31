import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    XYFlowModule,
} from 'ngx-xyflow';
import {
    Node,
    Edge,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    Connection,
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    BackgroundVariant
} from '@xyflow/react';
import { EntityDesignerService } from '@app/features/entity-designer/services/entity-designer.service';
import { DesignerToolbarComponent } from '@app/features/entity-designer/components/toolbar/designer-toolbar.component';
import { EntityListPanelComponent } from '@app/features/entity-designer/components/panels/entity-list-panel.component';
import { EntityPropertiesPanelComponent } from '@app/features/entity-designer/components/panels/entity-properties-panel.component';
import { EntityNodeComponent } from '@app/features/entity-designer/components/nodes/entity-node.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RelationshipEditorModalComponent } from '@app/features/entity-designer/components/modals/relationship-editor-modal.component';

@Component({
    selector: 'app-designer-canvas',
    standalone: true,
    imports: [
        CommonModule,
        XYFlowModule,
        DesignerToolbarComponent,
        EntityListPanelComponent,
        EntityPropertiesPanelComponent,
        EntityNodeComponent,
        MatDialogModule
    ],
    templateUrl: './designer-canvas.component.html',
    styleUrls: ['./designer-canvas.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesignerCanvasComponent {
    private designerService = inject(EntityDesignerService);
    private dialog = inject(MatDialog);

    nodes = this.designerService.nodes;
    edges = this.designerService.edges;

    onNodesChange(changes: any) {
        // We update the state in the service
        const currentNodes = this.designerService.nodes();
        const updatedNodes = applyNodeChanges(changes, currentNodes as Node[]);
        this.designerService.setNodes(updatedNodes as any[]);
    }

    onEdgesChange(changes: any) {
        const currentEdges = this.designerService.edges();
        const updatedEdges = applyEdgeChanges(changes, currentEdges as Edge[]);
        this.designerService.setEdges(updatedEdges as any[]);
    }

    onConnect(event: any) {
        const connection = event as Connection;
        const sourceNode = this.designerService.nodes().find(n => n.id === connection.source);
        const targetNode = this.designerService.nodes().find(n => n.id === connection.target);

        if (sourceNode && targetNode) {
            this.dialog.open(RelationshipEditorModalComponent, {
                width: '500px',
                data: {
                    sourceEntity: sourceNode.data.entity,
                    targetEntity: targetNode.data.entity
                }
            }).afterClosed().subscribe(result => {
                if (result) {
                    this.designerService.addRelationship(connection.source || '', connection.target || '', result);
                }
            });
        }
    }

    onEdgeClick(event: any) {
        const edge = event.edge as Edge;
        const sourceNode = this.designerService.nodes().find(n => n.id === edge.source);
        const targetNode = this.designerService.nodes().find(n => n.id === edge.target);

        if (sourceNode && targetNode) {
            this.dialog.open(RelationshipEditorModalComponent, {
                width: '500px',
                data: {
                    edge: edge.data,
                    sourceEntity: sourceNode.data.entity,
                    targetEntity: targetNode.data.entity
                }
            }).afterClosed().subscribe(result => {
                if (result) {
                    this.designerService.updateRelationship(edge.id, result);
                }
            });
        }
    }

    onNodeClick(event: any) {
        const node = event.node;
        if (node) {
            this.designerService.setSelectedNode(node.id);
        }
    }

    onPaneClick() {
        this.designerService.setSelectedNode(null);
    }

    protected readonly BackgroundVariant = BackgroundVariant;
}
