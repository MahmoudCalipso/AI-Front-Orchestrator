/**
 * Security Models
 * All Security-related DTOs matching backend Python models
 */

// ==================== Security Scan Request ====================
export interface SecurityScanRequest {
  project_id: string;
  scan_type: string;
  target_path?: string;
  severity_level?: string;
  include_dependencies?: boolean;
}

// ==================== Security Scan Response ====================
export interface SecurityScanResponseDTO {
  scan_id: string;
  project_id: string;
  scan_type: string;
  status: string;
  started_at: string;
  completed_at?: string;
  findings: SecurityFinding[];
  summary: SecuritySummary;
}

/**
 * Security Scan Response (alias for compatibility)
 */
export type SecurityScanResponse = SecurityScanResponseDTO;

// ==================== Security Finding ====================
export interface SecurityFinding {
  id: string;
  severity: string;
  category: string;
  title: string;
  description: string;
  file_path?: string;
  line_number?: number;
  code_snippet?: string;
  recommendation?: string;
  references?: string[];
  cve_id?: string;
  cvss_score?: number;
}

// ==================== Security Summary ====================
export interface SecuritySummary {
  total_findings: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
}

// ==================== Security Scan List ====================
export interface SecurityScanListResponseDTO {
  scans: SecurityScanResponseDTO[];
  total: number;
  page: number;
  page_size: number;
}

// ==================== Vulnerability ====================
export interface VulnerabilityDTO {
  id: string;
  cve_id: string;
  severity: string;
  cvss_score: number;
  description: string;
  affected_package: string;
  affected_version: string;
  fixed_version?: string;
  references: string[];
  published_date: string;
}

// ==================== Vulnerability List ====================
export interface VulnerabilityListResponseDTO {
  vulnerabilities: VulnerabilityDTO[];
  total: number;
}

// ==================== Security Severity ====================
export enum SecuritySeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info'
}

// ==================== Scan Type ====================
export enum ScanType {
  SAST = 'sast',
  DEPENDENCY = 'dependency',
  CONTAINER = 'container',
  IAC = 'iac',
  SECRET = 'secret'
}

// ==================== Scan Status ====================
export enum ScanStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}
