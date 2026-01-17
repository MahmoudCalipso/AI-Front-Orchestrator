/**
 * Security scanning models
 */

export interface SecurityScanRequest {
    project_path: string;
    scan_type?: 'full' | 'quick' | 'dependencies' | 'code';
    include_dependencies?: boolean;
    severity_threshold?: 'low' | 'medium' | 'high' | 'critical';
}

export interface SecurityScanResponse {
    scan_id: string;
    project_path: string;
    scan_date: string;
    vulnerabilities: Vulnerability[];
    summary: SecuritySummary;
    recommendations: string[];
    compliance: ComplianceInfo;
}

export interface Vulnerability {
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: 'injection' | 'xss' | 'csrf' | 'auth' | 'crypto' | 'dependency' | 'other';
    cwe_id?: string;
    cvss_score?: number;
    affected_files: string[];
    line_numbers?: number[];
    remediation: string;
    references?: string[];
    fixed: boolean;
}

export interface SecuritySummary {
    total_vulnerabilities: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    risk_score: number;
    risk_level: 'low' | 'medium' | 'high' | 'critical';
}

export interface ComplianceInfo {
    owasp_top_10: ComplianceStatus[];
    sans_top_25: ComplianceStatus[];
    pci_dss?: boolean;
    hipaa?: boolean;
    gdpr?: boolean;
}

export interface ComplianceStatus {
    id: string;
    name: string;
    compliant: boolean;
    issues?: string[];
}

export interface DependencyVulnerability {
    package_name: string;
    version: string;
    vulnerability_id: string;
    severity: string;
    fixed_version?: string;
    description: string;
}
