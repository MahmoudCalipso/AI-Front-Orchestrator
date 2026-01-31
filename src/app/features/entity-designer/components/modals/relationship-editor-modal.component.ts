import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RelationshipEdgeData } from '../../models/designer-state.model';
import { EntityDefinition } from '../../models/entity-definition.model';

@Component({
  selector: 'app-relationship-editor-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Edit Relationship</h2>
    <mat-dialog-content>
      <div class="relationship-info">
        <div class="info-box">
          <span class="label">Source</span>
          <span class="value">{{ data.sourceEntity.name }}</span>
        </div>
        <mat-icon>arrow_forward</mat-icon>
        <div class="info-box">
          <span class="label">Target</span>
          <span class="value">{{ data.targetEntity.name }}</span>
        </div>
      </div>

      <form [formGroup]="form" class="rel-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Relationship Label</mat-label>
          <input matInput formControlName="label" placeholder="e.g. orders_by_user">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Cardinality</mat-label>
          <mat-select formControlName="relationshipType">
            <mat-option value="1:1">One-to-One (1:1)</mat-option>
            <mat-option value="1:N">One-to-Many (1:N)</mat-option>
            <mat-option value="N:M">Many-to-Many (N:M)</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Foreign Key Field</mat-label>
          <mat-select formControlName="foreignKey">
            @for (field of data.sourceEntity.fields; track field.name) {
              <mat-option [value]="field.name">{{ field.name }} ({{ field.type }})</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <div class="row">
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>On Delete</mat-label>
            <mat-select formControlName="onDelete">
              <mat-option value="CASCADE">CASCADE</mat-option>
              <mat-option value="SET NULL">SET NULL</mat-option>
              <mat-option value="RESTRICT">RESTRICT</mat-option>
              <mat-option value="NO ACTION">NO ACTION</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>On Update</mat-label>
            <mat-select formControlName="onUpdate">
              <mat-option value="CASCADE">CASCADE</mat-option>
              <mat-option value="SET NULL">SET NULL</mat-option>
              <mat-option value="RESTRICT">RESTRICT</mat-option>
              <mat-option value="NO ACTION">NO ACTION</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <mat-checkbox formControlName="bidirectional">Bidirectional Relationship</mat-checkbox>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-flat-button color="primary" (click)="onSave()" [disabled]="form.invalid">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .relationship-info {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      margin-bottom: 24px;
      padding: 16px;
      background: #f3f4f6;
      border-radius: 12px;
    }
    .info-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      .label { font-size: 11px; text-transform: uppercase; color: #6b7280; margin-bottom: 4px; }
      .value { font-weight: 600; color: #111827; }
    }
    .rel-form { display: flex; flex-direction: column; gap: 8px; }
    .full-width { width: 100%; }
    .row { display: flex; gap: 12px; }
    .flex-1 { flex: 1; }
  `]
})
export class RelationshipEditorModalComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RelationshipEditorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      edge?: RelationshipEdgeData,
      sourceEntity: EntityDefinition,
      targetEntity: EntityDefinition
    }
  ) {
    this.form = this.fb.group({
      label: [data.edge?.label || '', Validators.required],
      relationshipType: [data.edge?.relationshipType || '1:N', Validators.required],
      foreignKey: [data.edge?.foreignKey || (data.sourceEntity.fields[0]?.name || ''), Validators.required],
      onDelete: [data.edge?.onDelete || 'CASCADE'],
      onUpdate: [data.edge?.onUpdate || 'CASCADE'],
      bidirectional: [data.edge?.bidirectional || false]
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
