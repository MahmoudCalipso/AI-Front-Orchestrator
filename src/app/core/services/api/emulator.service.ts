import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { BaseResponse } from '../../models/index';
import {
    EmulatorStartRequest,
    EmulatorResponseDTO,
    EmulatorStopRequest,
    EmulatorControlAction,
    EmulatorScreenshotResponse,
    EmulatorListResponse
} from '../../models/backend/dtos/responses/emulator.models';

/**
 * Emulator Service
 * Handles Mobile Emulator operations
 */
@Injectable({
    providedIn: 'root'
})
export class EmulatorService extends BaseApiService {

    /**
     * Start a mobile emulator
     * POST /api/v1/emulator/start
     */
    startEmulator(request: EmulatorStartRequest): Observable<EmulatorResponseDTO> {
        return this.post<BaseResponse<EmulatorResponseDTO>>('emulator/start', request).pipe(
            map(res => res.data)
        );
    }

    /**
     * Stop a mobile emulator
     * POST /api/v1/emulator/stop
     */
    stopEmulator(request: EmulatorStopRequest): Observable<any> {
        return this.post<BaseResponse<any>>('emulator/stop', request).pipe(
            map(res => res.data)
        );
    }

    /**
     * List all active emulators
     * GET /api/v1/emulator/active
     */
    listActiveEmulators(): Observable<EmulatorListResponse> {
        return this.get<BaseResponse<EmulatorListResponse>>('emulator/active').pipe(
            map(res => res.data)
        );
    }

    /**
     * Get emulator details
     * GET /api/v1/emulator/{emulator_id}
     */
    getEmulator(emulatorId: string): Observable<EmulatorResponseDTO> {
        return this.get<BaseResponse<EmulatorResponseDTO>>(`emulator/${emulatorId}`).pipe(
            map(res => res.data)
        );
    }

    /**
     * Control emulator (rotate, home, back, etc.)
     * POST /api/v1/emulator/{emulator_id}/control
     */
    controlEmulator(action: EmulatorControlAction): Observable<any> {
        return this.post<BaseResponse<any>>(`emulator/${action.emulator_id}/control`, action).pipe(
            map(res => res.data)
        );
    }

    /**
     * Take emulator screenshot
     * POST /api/v1/emulator/{emulator_id}/screenshot
     */
    takeScreenshot(emulatorId: string): Observable<EmulatorScreenshotResponse> {
        return this.post<BaseResponse<EmulatorScreenshotResponse>>(`emulator/${emulatorId}/screenshot`, {}).pipe(
            map(res => res.data)
        );
    }

    /**
     * Pause emulator
     * POST /api/v1/emulator/{emulator_id}/pause
     */
    pauseEmulator(emulatorId: string): Observable<EmulatorResponseDTO> {
        return this.post<BaseResponse<EmulatorResponseDTO>>(`emulator/${emulatorId}/pause`, {}).pipe(
            map(res => res.data)
        );
    }

    /**
     * Resume emulator
     * POST /api/v1/emulator/{emulator_id}/resume
     */
    resumeEmulator(emulatorId: string): Observable<EmulatorResponseDTO> {
        return this.post<BaseResponse<EmulatorResponseDTO>>(`emulator/${emulatorId}/resume`, {}).pipe(
            map(res => res.data)
        );
    }
}

