import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EntityNode } from '../../models/designer-state.model';
import { XYFlowModule } from 'ngx-xyflow';
import { Position } from '@xyflow/react';

@Component({
    selector: 'app-entity-node',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, MatDividerModule, MatTooltipModule, XYFlowModule],
    templateUrl: './entity-node.component.html',
    styleUrls: ['./entity-node.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntityNodeComponent {
    @Input() node!: EntityNode;

    protected readonly Position = Position;

    get entity() {
        return this.node.data.entity;
    }

    get color() {
        return this.node.data.color;
    }

    get icon() {
        return this.node.data.icon;
    }

    toggleCollapse(event: MouseEvent) {
        event.stopPropagation();
        // Logic to toggle data.collapsed if needed
    }
}
