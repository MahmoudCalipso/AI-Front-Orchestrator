import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { EntityDesignerService } from '../../services/entity-designer.service';

@Component({
  selector: 'app-entity-list-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule
  ],
  template: `
    <div class="panel-container">
      <div class="panel-header">
        <h3>Designer Tools</h3>
      </div>
      
      <div class="panel-sections">
        <!-- Active Entities -->
        <div class="section-group">
          <div class="section-title">Active Entities</div>
          <mat-list dense>
            @for (node of nodes(); track node.id) {
              <mat-list-item (click)="selectNode(node.id)" [class.selected]="node.id === selectedNodeId()">
                <mat-icon matListItemIcon [style.color]="node.data.color">{{ node.data.icon }}</mat-icon>
                <div matListItemTitle>{{ node.data.entity.name }}</div>
                <button mat-icon-button matListItemMeta (click)="$event.stopPropagation(); designerService.deleteEntity(node.id)">
                  <mat-icon>close</mat-icon>
                </button>
              </mat-list-item>
            } @empty {
              <div class="empty-state">No entities on canvas</div>
            }
          </mat-list>
        </div>

        <mat-divider></mat-divider>

        <!-- Templates -->
        @for (cat of categories; track cat.name) {
          <div class="section-group">
            <div class="section-title">
              <mat-icon>{{ cat.icon }}</mat-icon>
              {{ cat.name }}
            </div>
            <mat-list dense>
              @for (item of cat.items; track item.name) {
                <mat-list-item (click)="addTemplate(item)" title="Add {{ item.name }}">
                  <mat-icon matListItemIcon>add_box</mat-icon>
                  <div matListItemTitle>{{ item.name }}</div>
                </mat-list-item>
              }
            </mat-list>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .panel-container { height: 100%; display: flex; flex-direction: column; background: #fff; }
    .panel-header { padding: 12px 16px; border-bottom: 1px solid #e5e7eb; }
    h3 { margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #9ca3af; letter-spacing: 0.1em; }
    
    .panel-sections { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; }
    .section-group { padding: 12px 0; }
    .section-title { 
      padding: 0 16px 8px; 
      font-size: 11px; 
      font-weight: 600; 
      color: #6b7280; 
      display: flex; 
      align-items: center; 
      gap: 6px;
    }
    .section-title mat-icon { font-size: 14px; width: 14px; height: 14px; }

    .empty-state { padding: 24px 16px; text-align: center; color: #d1d5db; font-size: 12px; }
    
    mat-list-item { 
      cursor: pointer; 
      font-size: 13px;
    }
    mat-list-item:hover { background: #f9fafb; }
    mat-list-item.selected { background: #eff6ff; border-right: 2px solid #3b82f6; }
    
    .mat-mdc-list-item-meta { margin-right: -8px; }
    .mat-mdc-button { --mdc-icon-button-icon-size: 18px; }
  `]
})
export class EntityListPanelComponent {
  protected designerService = inject(EntityDesignerService);
  nodes = this.designerService.nodes;
  selectedNodeId = this.designerService.selectedNodeId;

  categories = [
    {
      name: 'Templates', icon: 'auto_awesome', items: [
        {
          name: 'User', fields: [
            { name: 'id', type: 'uuid', primary_key: true, auto_increment: false, nullable: false },
            { name: 'email', type: 'string', unique: true, nullable: false },
            { name: 'password_hash', type: 'string', nullable: false },
            { name: 'created_at', type: 'datetime', nullable: false }
          ], features: ['Authentication']
        },
        {
          name: 'Profile', fields: [
            { name: 'id', type: 'uuid', primary_key: true, nullable: false },
            { name: 'user_id', type: 'uuid', foreign_key: 'id', nullable: false },
            { name: 'first_name', type: 'string', nullable: true },
            { name: 'last_name', type: 'string', nullable: true },
            { name: 'avatar_url', type: 'string', nullable: true }
          ], features: ['Core Business']
        },
        {
          name: 'Product', fields: [
            { name: 'id', type: 'uuid', primary_key: true, nullable: false },
            { name: 'sku', type: 'string', unique: true, nullable: false },
            { name: 'name', type: 'string', nullable: false },
            { name: 'price', type: 'decimal', nullable: false }
          ], features: ['Core Business']
        },
        {
          name: 'Order', fields: [
            { name: 'id', type: 'uuid', primary_key: true, nullable: false },
            { name: 'user_id', type: 'uuid', foreign_key: 'id', nullable: false },
            { name: 'status', type: 'string', nullable: false },
            { name: 'total_amount', type: 'decimal', nullable: false }
          ], features: ['Core Business']
        }
      ]
    }
  ];

  selectNode(id: string) {
    this.designerService.setSelectedNode(id);
  }

  addTemplate(template: any) {
    this.designerService.addEntity(template, { x: 100, y: 100 });
  }
}
