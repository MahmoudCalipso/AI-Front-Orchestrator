import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  MigrationRequest,
  MigrationResponse,
  MigrationWorkflowRequest,
  MigrationWorkflowResponse,
  CompatibilityCheckRequest,
  CompatibilityCheckResponse
} from '../../models/migration/migration.model';

/**
 * Migration Service
 * Handles code migration between tech stacks
 */
@Injectable({
  providedIn: 'root'
})
export class MigrationService extends BaseApiService {

  /**
   * Migrate code between tech stacks
   * POST /api/migrate
   */
  migrateCode(request: MigrationRequest): Observable<MigrationResponse> {
    return this.post<MigrationResponse>('/api/migrate', request, {
      timeout: 180000 // 3 minutes
    });
  }

  /**
   * Legacy migration endpoint
   * POST /migrate
   */
  migrateLegacy(request: MigrationRequest): Observable<MigrationResponse> {
    return this.post<MigrationResponse>('/migrate', request, {
      timeout: 180000
    });
  }

  /**
   * Start migration workflow
   * POST /migration/start
   */
  startMigrationWorkflow(request: MigrationWorkflowRequest): Observable<MigrationWorkflowResponse> {
    return this.post<MigrationWorkflowResponse>('/migration/start', request, {
      timeout: 300000 // 5 minutes
    });
  }

  /**
   * Get migration workflow status
   * GET /migration/{migration_id}/status
   */
  getMigrationStatus(migrationId: string): Observable<MigrationWorkflowResponse> {
    return this.get<MigrationWorkflowResponse>(`/migration/${migrationId}/status`);
  }

  /**
   * Cancel migration workflow
   * POST /migration/{migration_id}/cancel
   */
  cancelMigration(migrationId: string): Observable<void> {
    return this.post<void>(`/migration/${migrationId}/cancel`, {});
  }

  /**
   * Migrate entire project
   * POST /api/project/migrate
   */
  migrateProject(request: MigrationWorkflowRequest): Observable<MigrationWorkflowResponse> {
    return this.post<MigrationWorkflowResponse>('/api/project/migrate', request, {
      timeout: 300000 // 5 minutes
    });
  }

  /**
   * Check compatibility between tech stacks
   * POST /api/migration/compatibility
   */
  checkCompatibility(request: CompatibilityCheckRequest): Observable<CompatibilityCheckResponse> {
    return this.post<CompatibilityCheckResponse>('/api/migration/compatibility', request);
  }
}
