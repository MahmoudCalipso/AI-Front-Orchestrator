import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
    SecurityScanRequest,
    SecurityScanResponse
} from '../../models/security/security.model';
import { BaseResponse } from '../../models/index';

/**
 * Security Service
 * Handles security scanning operations via AI Swarm
 */
@Injectable({
    providedIn: 'root'
})
export class SecurityService extends BaseApiService {

    /**
     * Perform security scan on project
     * POST /api/v1/security/scan
     */
    scanProject(request: SecurityScanRequest): Observable<SecurityScanResponse> {
        return this.post<BaseResponse<any>>('security/scan', request, {
            timeout: 120000 // 2 minutes
        }).pipe(
            map(res => {
                // Return data directly if acts as response, or map fields
                return res.data;
            })
        );
    }
}
