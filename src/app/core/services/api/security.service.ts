import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
    SecurityScanRequest,
    SecurityScanResponse
} from '../../models/security/security.model';

/**
 * Security Service
 * Handles security scanning operations
 */
@Injectable({
    providedIn: 'root'
})
export class SecurityService extends BaseApiService {

    /**
     * Perform security scan on project
     * POST /api/security/scan
     */
    scanProject(request: SecurityScanRequest): Observable<SecurityScanResponse> {
        return this.post<SecurityScanResponse>('/api/security/scan', request, {
            timeout: 120000 // 2 minutes
        });
    }

    /**
     * Get scan results by ID
     * GET /api/security/scan/{scan_id}
     */
    getScanResults(scanId: string): Observable<SecurityScanResponse> {
        return this.get<SecurityScanResponse>(`/api/security/scan/${scanId}`);
    }

    /**
     * List all scans for a project
     * GET /api/security/scans/{project_path}
     */
    listScans(projectPath: string): Observable<SecurityScanResponse[]> {
        return this.get<SecurityScanResponse[]>('/api/security/scans', { project_path: projectPath });
    }
}
