import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MigrationService } from '../../core/services/api/migration.service';
import { MigrationWorkflowRequest, MigrationWorkflowResponse } from '../../core/models/migration/migration.model';

@Component({
  selector: 'app-project-migration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-migration.component.html',
  styleUrls: ['./project-migration.component.scss']
})
export class ProjectMigrationComponent {
  sourcePath = '';
  sourceStack = '';
  targetStack = '';
  isMigrating = false;
  migrationProgress = 0;
  currentStep = '';
  migrationId: string | null = null;

  constructor(
    private migrationService: MigrationService,
    private router: Router
  ) {}

  startMigration() {
    if (!this.sourcePath || !this.sourceStack || !this.targetStack) return;

    this.isMigrating = true;
    const request: MigrationWorkflowRequest = {
      project_path: this.sourcePath,
      source_stack: { language: this.sourceStack.split(' ')[0], framework: this.sourceStack.split(' ')[1] },
      target_stack: { language: this.targetStack.split(' ')[0], framework: this.targetStack.split(' ')[1] },
      include_dependencies: true,
      dry_run: false
    };

    this.migrationService.startMigrationWorkflow(request).subscribe(response => {
      this.migrationId = response.migration_id;
      this.checkMigrationStatus();
    });
  }

  private checkMigrationStatus() {
    if (!this.migrationId) return;

    this.migrationService.getMigrationStatus(this.migrationId).subscribe(status => {
      this.migrationProgress = status.progress || 0;
      this.currentStep = status.current_phase || '';

      if (status.status === 'completed') {
        this.isMigrating = false;
        alert('Migration completed!');
        // Navigate to project or something
      } else if (status.status === 'failed') {
        this.isMigrating = false;
        alert('Migration failed');
      } else {
        setTimeout(() => this.checkMigrationStatus(), 2000);
      }
    });
  }
}
