/**
 * Registry Models
 * All Registry-related DTOs matching backend Python models
 */

// ==================== Framework ====================
export interface FrameworkDTO {
  name: string;
  display_name: string;
  category: string;
  description?: string;
  languages: string[];
  versions: string[];
  default_version?: string;
  features: string[];
}

// ==================== Framework List ====================
export interface FrameworkListResponseDTO {
  frameworks: FrameworkDTO[];
  total: number;
}

// ==================== Language ====================
export interface LanguageDTO {
  name: string;
  display_name: string;
  category: string;
  description?: string;
  versions: string[];
  default_version?: string;
  frameworks: string[];
}

// ==================== Language List ====================
export interface LanguageListResponseDTO {
  languages: LanguageDTO[];
  total: number;
}

// ==================== Database ====================
export interface DatabaseDTO {
  name: string;
  display_name: string;
  category: string;
  description?: string;
  versions: string[];
  default_version?: string;
  drivers: string[];
  features: string[];
}

// ==================== Database List ====================
export interface DatabaseListResponseDTO {
  databases: DatabaseDTO[];
  total: number;
}

// ==================== Template ====================
export interface TemplateDTO {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  category: string;
  framework: string;
  language: string;
  database?: string;
  features: string[];
  tags: string[];
  source_url?: string;
  is_official: boolean;
  created_at: string;
  updated_at: string;
}

// ==================== Template List ====================
export interface TemplateListResponseDTO {
  templates: TemplateDTO[];
  total: number;
}

// ==================== Registry Category ====================
export enum RegistryCategory {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  DATABASE = 'database',
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
  FULL_STACK = 'full_stack',
  MICROSERVICES = 'microservices',
  SERVERLESS = 'serverless'
}

// ==================== Registry Filter ====================
export interface RegistryFilter {
  category?: string;
  framework?: string;
  language?: string;
  database?: string;
  search?: string;
  tags?: string[];
  is_official?: boolean;
}
