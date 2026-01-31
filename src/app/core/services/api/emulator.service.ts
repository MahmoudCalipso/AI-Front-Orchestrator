import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { BaseResponse } from '../../models/index';

export interface EmulatorStartRequest {
    platform: 'android' | 'ios';
    device_name?: string;
    os_version?: string;
    headless?: boolean;
}

export interface EmulatorResponseDTO {
    id: string;
    name: string;
    platform: string;
    status: string;
    vnc_port?: number;
    adb_port?: number;
    web_url?: string;
}

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
    stopEmulator(emulatorId: string): Observable<any> {
        return this.post<BaseResponse<any>>('emulator/stop', { emulator_id: emulatorId }).pipe(
            map(res => res.data)
        );
    }

    /**
     * List all active emulators
     * GET /api/v1/emulator/active
     */
    listActiveEmulators(): Observable<EmulatorResponseDTO[]> {
        return this.get<BaseResponse<EmulatorResponseDTO[]>>('emulator/active').pipe(
            map(res => res.data)
        );
    }
}
