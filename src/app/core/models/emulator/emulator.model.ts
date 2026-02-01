/**
 * Mobile Emulator Models
 * Consolidated DTOs for mobile device emulation
 */

/**
 * Device Type Enumeration
 */
export enum DeviceType {
  ANDROID = 'android',
  IOS = 'ios',
  TABLET = 'tablet',
  CUSTOM = 'custom'
}

/**
 * Emulator Status Enumeration
 */
export enum EmulatorStatus {
  STARTING = 'starting',
  RUNNING = 'running',
  PAUSED = 'paused',
  STOPPED = 'stopped',
  ERROR = 'error'
}

/**
 * Device Configuration
 */
export interface DeviceConfiguration {
  device_type: DeviceType;
  device_name: string;
  screen_width: number;
  screen_height: number;
  pixel_density: number;
  os_version: string;
  user_agent?: string;
  orientation?: 'portrait' | 'landscape';
}

/**
 * Emulator Start Request
 */
export interface EmulatorStartRequest {
  project_id: string;
  device_config: DeviceConfiguration;
  app_url?: string;
  enable_debugging?: boolean;
  enable_network_throttling?: boolean;
  network_profile?: 'fast-3g' | 'slow-3g' | '4g' | 'wifi';
}

/**
 * Emulator Response DTO
 */
export interface EmulatorResponseDTO {
  emulator_id: string;
  project_id: string;
  device_config: DeviceConfiguration;
  status: EmulatorStatus;
  app_url?: string;
  preview_url?: string;
  websocket_url?: string;
  started_at: string;
  stopped_at?: string;
  error_message?: string;
}

/**
 * Emulator Stop Request
 */
export interface EmulatorStopRequest {
  emulator_id: string;
}

/**
 * Emulator Control Action
 */
export interface EmulatorControlAction {
  emulator_id: string;
  action: 'rotate' | 'home' | 'back' | 'screenshot' | 'reload' | 'pause' | 'resume';
  params?: Record<string, any>;
}

/**
 * Emulator Screenshot Response
 */
export interface EmulatorScreenshotResponse {
  emulator_id: string;
  screenshot_url: string;
  timestamp: string;
  format: 'png' | 'jpeg';
}

/**
 * Emulator List Response
 */
export interface EmulatorListResponse {
  emulators: EmulatorResponseDTO[];
  total: number;
}

/**
 * Network Throttling Profile
 */
export interface NetworkThrottlingProfile {
  name: string;
  download_speed: number; // kbps
  upload_speed: number; // kbps
  latency: number; // ms
  packet_loss?: number; // percentage
}
