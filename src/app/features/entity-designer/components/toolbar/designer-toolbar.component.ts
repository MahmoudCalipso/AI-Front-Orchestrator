import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EntityDesignerService } from '../../services/entity-designer.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { GenerationService } from '../../../../core/services/api/generation.service';
import { EntityDefinition as ApiEntityDefinition } from '../../../../core/models/generation/generation.model';

@Component({
  selector: 'app-designer-toolbar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, MatSnackBarModule],
  templateUrl: './designer-toolbar.component.html',
  styleUrls: ['./designer-toolbar.component.scss']
})
export class DesignerToolbarComponent {
  private designerService = inject(EntityDesignerService);
  private snackBar = inject(MatSnackBar);
  private generationService = inject(GenerationService);

  addEntity() {
    this.designerService.addEntity({
      name: 'NewEntity',
      fields: [
        { name: 'id', type: 'uuid', primary_key: true, auto_increment: false, nullable: false }
      ],
      features: ['Core Business']
    }, { x: 100, y: 100 });
  }

  autoLayout() {
    this.snackBar.open('Auto Layout not yet implemented. Use manual dragging for now.', 'OK', { duration: 3000 });
  }

  exportJson() {
    const data = this.designerService.exportToJSON();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `entity-schema-${new Date().getTime()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    this.snackBar.open('Schema exported successfully!', 'OK', { duration: 3000 });
  }

  importJson() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          const data = JSON.parse(event.target.result);
          this.designerService.importFromJSON(data);
          this.snackBar.open('Schema imported successfully!', 'OK', { duration: 3000 });
        } catch (err) {
          this.snackBar.open('Error parsing JSON file.', 'OK', { duration: 3000 });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  generateProject() {
    const projectName = prompt('Enter project name:', 'my-awesome-project');
    if (!projectName) return;

    const entities = this.designerService.entityDefinitions();

    this.snackBar.open(`Generating system "${projectName}"...`, 'Close');

    // Map our local EntityDefinition to the API's EntityDefinition format if needed
    // In this case, they are mostly compatible, but we cast to be sure or map specifically
    this.generationService.generateFromEntities({
      entities: entities as any,
      project_name: projectName,
      target_language: 'typescript',
      framework: 'angular',
      include_crud: true,
      include_validation: true,
      include_tests: true
    }).subscribe({
      next: (response) => {
        this.snackBar.open('Project generated successfully!', 'Open IDE', { duration: 5000 })
          .onAction().subscribe(() => {
            // Navigate to IDE or specific path
          });
      },
      error: (err) => {
        this.snackBar.open('Generation failed: ' + (err.message || 'Unknown error'), 'OK');
      }
    });
  }
}
