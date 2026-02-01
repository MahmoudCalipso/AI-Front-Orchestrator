/**
 * System Models
 * All System-related DTOs matching backend Python models
 */

import { ModelStatus } from '../common/enums';

// ==================== System Info ====================
export interface SystemInfoDTO {
  service: string;
  version: string;
  status: string;
}

// ==================== Health ====================
export interface HealthResponseDTO {
  status: string;
  version: string;
  uptime: number;
  models_loaded: number;
  runtimes_available: string[];
}

// ==================== System Status ====================
export interface SystemStatusDTO {
  status: string;
  uptime: number;
  models: Record<string, ModelStatus>;
  runtimes: Record<string, Record<string, any>>;
  resources: Record<string, any>;
  metrics: Record<string, any>;
}

// Re-export ModelStatus for convenience
export { ModelStatus };
