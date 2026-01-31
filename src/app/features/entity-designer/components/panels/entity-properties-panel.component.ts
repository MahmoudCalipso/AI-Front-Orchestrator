import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EntityDesignerService } from '../../services/entity-designer.service';
import { EntityField } from '../../models/entity-definition.model';

import { FieldEditorModalComponent } from '../modals/field-editor-modal.component';

@Component({
  selector: 'app-entity-properties-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDialogModule
  ],
  templateUrl: './entity-properties-panel.component.html',
  styleUrls: ['./entity-properties-panel.component.scss']
})
export class EntityPropertiesPanelComponent {
  private designerService = inject(EntityDesignerService);
  private dialog = inject(MatDialog);

  selectedNode = this.designerService.selectedNode;

  updateName(name: string) {
    const node = this.selectedNode();
    if (node) this.designerService.updateEntity(node.id, { name });
  }

  updateTable(table_name: string) {
    const node = this.selectedNode();
    if (node) this.designerService.updateEntity(node.id, { table_name });
  }

  updateDesc(description: string) {
    const node = this.selectedNode();
    if (node) this.designerService.updateEntity(node.id, { description });
  }

  addField() {
    const node = this.selectedNode();
    if (!node) return;

    this.dialog.open(FieldEditorModalComponent, {
      width: '450px',
      data: {}
    }).afterClosed().subscribe(result => {
      if (result) {
        const fields = [...node.data.entity.fields, result];
        this.designerService.updateEntity(node.id, { fields });
      }
    });
  }

  editField(index: number) {
    const node = this.selectedNode();
    if (!node) return;

    const field = node.data.entity.fields[index];
    this.dialog.open(FieldEditorModalComponent, {
      width: '450px',
      data: { field }
    }).afterClosed().subscribe(result => {
      if (result) {
        const fields = [...node.data.entity.fields];
        fields[index] = result;
        this.designerService.updateEntity(node.id, { fields });
      }
    });
  }

  deleteField(index: number) {
    const node = this.selectedNode();
    if (!node) return;

    const fields = node.data.entity.fields.filter((_, i) => i !== index);
    this.designerService.updateEntity(node.id, { fields });
  }

  deleteEntity() {
    const node = this.selectedNode();
    if (node) {
      if (confirm(`Are you sure you want to delete entity "${node.data.entity.name}"?`)) {
        this.designerService.deleteEntity(node.id);
      }
    }
  }
}
