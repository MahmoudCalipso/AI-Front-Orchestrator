import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { BaseResponse } from '../../models/index';
import {
  EmulatorStartRequest,
  EmulatorResponseDTO,
  EmulatorStopRequest
} from '../../models/emulator/emulator.model';

export type {
  EmulatorStartRequest,
  EmulatorResponseDTO,
  EmulatorStopRequest
};

/**
 * Emulator Service
 * Handles Mobile Emulator operations
 * Aligned with OpenAPI specification
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
      map(res => res.data!)
    );
  }

  /**
   * Stop a mobile emulator
   * POST /api/v1/emulator/stop
   */
  stopEmulator(emulatorId: string): Observable<any> {
    return this.post<BaseResponse<any>>('emulator/stop', { emulator_id: emulatorId }).pipe(
      map(res => res.data!)
    );
  }

  /**
   * List all active emulators
   * GET /api/v1/emulator/active
   */
  listActiveEmulators(): Observable<{ emulators: EmulatorResponseDTO[] }> {
    return this.get<BaseResponse<{ emulators: EmulatorResponseDTO[] }>>('emulator/active').pipe(
      map(res => res.data!)
    );
  }

  /**
   * Pause a mobile emulator
   * POST /api/v1/emulator/{emulator_id}/pause
   */
  pauseEmulator(emulatorId: string): Observable<any> {
    return this.post<BaseResponse<any>>(`emulator/${emulatorId}/pause`, {}).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Resume a mobile emulator
   * POST /api/v1/emulator/{emulator_id}/resume
   */
  resumeEmulator(emulatorId: string): Observable<any> {
    return this.post<BaseResponse<any>>(`emulator/${emulatorId}/resume`, {}).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Take a screenshot of the emulator
   * GET /api/v1/emulator/{emulator_id}/screenshot
   */
  takeScreenshot(emulatorId: string): Observable<{ screenshot_url: string }> {
    return this.get<BaseResponse<{ screenshot_url: string }>>(`emulator/${emulatorId}/screenshot`).pipe(
      map(res => res.data!)
    );
  }
}
