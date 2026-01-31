import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { EntityField } from '../../models/entity-definition.model';

@Component({
    selector: 'app-field-editor-modal',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatButtonModule
    ],
    template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Edit Field' : 'Add Field' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="field-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Field Name</mat-label>
          <input matInput formControlName="name" placeholder="e.g. email_address">
        </mat-form-field>

        <div class="row">
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Type</mat-label>
            <mat-select formControlName="type">
              @for (type of fieldTypes; track type) {
                <mat-option [value]="type">{{ type }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="flex-1" *ngIf="showLength()">
            <mat-label>Length</mat-label>
            <input matInput type="number" formControlName="length">
          </mat-form-field>
        </div>

        <div class="checkbox-grid">
          <mat-checkbox formControlName="primary_key">Primary Key</mat-checkbox>
          <mat-checkbox formControlName="nullable">Nullable</mat-checkbox>
          <mat-checkbox formControlName="unique">Unique</mat-checkbox>
          <mat-checkbox formControlName="auto_increment">Auto Increment</mat-checkbox>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Default Value</mat-label>
          <input matInput formControlName="default_value">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="2"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-flat-button color="primary" (click)="onSave()" [disabled]="form.invalid">Save</button>
    </mat-dialog-actions>
  `,
    styles: [`
    .field-form { display: flex; flex-direction: column; gap: 8px; padding-top: 8px; }
    .full-width { width: 100%; }
    .row { display: flex; gap: 12px; }
    .flex-1 { flex: 1; }
    .checkbox-grid { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 12px; 
      margin: 8px 0;
      padding: 12px;
      background: #f9fafb;
      border-radius: 8px;
    }
  `]
})
export class FieldEditorModalComponent {
    form: FormGroup;
    isEdit: boolean;
    fieldTypes = ['string', 'number', 'boolean', 'datetime', 'date', 'uuid', 'json', 'text', 'decimal'];

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<FieldEditorModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { field?: EntityField }
    ) {
        this.isEdit = !!data.field;
        this.form = this.fb.group({
            name: [data.field?.name || '', [Validators.required, Validators.pattern(/^[a-z][a-z0-9_]*$/)]],
            type: [data.field?.type || 'string', Validators.required],
            length: [data.field?.length || null],
            primary_key: [data.field?.primary_key || false],
            nullable: [data.field?.nullable ?? true],
            unique: [data.field?.unique || false],
            auto_increment: [data.field?.auto_increment || false],
            default_value: [data.field?.default_value || ''],
            description: [data.field?.description || '']
        });
    }

    showLength() {
        return this.form.get('type')?.value === 'string' || this.form.get('type')?.value === 'decimal';
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
