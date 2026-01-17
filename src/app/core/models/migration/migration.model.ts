/**
 * Migration request
 */
export interface MigrationRequest {
  source_code: string;
  source_language: string;
  source_framework?: string;
  target_language: string;
  target_framework?: string;
  preserve_structure?: boolean;
  migrate_tests?: boolean;
  migrate_config?: boolean;
}

/**
 * Migration response
 */
export interface MigrationResponse {
  migrated_code: string;
  source_language: string;
  target_language: string;
  success: boolean;
  files_migrated: number;
  migration_notes: string[];
  warnings: string[];
  manual_steps?: string[];
  execution_time: number;
}

/**
 * Migration workflow request
 */
export interface MigrationWorkflowRequest {
  project_path: string;
  source_stack: TechStack;
  target_stack: TechStack;
  migration_strategy?: MigrationStrategy;
  include_dependencies?: boolean;
  dry_run?: boolean;
}

/**
 * Tech stack definition
 */
export interface TechStack {
  language: string;
  framework?: string;
  version?: string;
  database?: string;
  build_tool?: string;
  package_manager?: string;
}

/**
 * Migration strategy
 */
export type MigrationStrategy = 
  | 'big-bang'        // Migrate everything at once
  | 'strangler-fig'   // Gradual migration
  | 'parallel-run'    // Run both versions
  | 'phased';         // Phase by phase

/**
 * Migration workflow response
 */
export interface MigrationWorkflowResponse {
  migration_id: string;
  status: 'initiated' | 'in-progress' | 'completed' | 'failed';
  progress: number;
  current_phase?: string;
  phases: MigrationPhase[];
  estimated_completion?: string;
  results?: MigrationResults;
}

/**
 * Migration phase
 */
export interface MigrationPhase {
  phase_number: number;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  progress: number;
  started_at?: string;
  completed_at?: string;
  components: string[];
  issues?: Issue[];
}

/**
 * Migration results
 */
export interface MigrationResults {
  total_files: number;
  files_migrated: number;
  files_failed: number;
  lines_migrated: number;
  compatibility_score: number;
  test_results?: TestResults;
  performance_comparison?: PerformanceComparison;
  manual_intervention_required: string[];
}

/**
 * Test results
 */
export interface TestResults {
  total_tests: number;
  passed: number;
  failed: number;
  skipped: number;
  coverage: number;
}

/**
 * Performance comparison
 */
export interface PerformanceComparison {
  source_metrics: PerformanceMetrics;
  target_metrics: PerformanceMetrics;
  improvement_percentage: number;
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  startup_time: number;
  memory_usage: number;
  response_time: number;
  throughput: number;
}

/**
 * Issue during migration
 */
export interface Issue {
  type: 'error' | 'warning' | 'info';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  file?: string;
  line?: number;
  suggestion?: string;
}

/**
 * Compatibility check request
 */
export interface CompatibilityCheckRequest {
  source_language: string;
  target_language: string;
  source_framework?: string;
  target_framework?: string;
  features?: string[];
}

/**
 * Compatibility check response
 */
export interface CompatibilityCheckResponse {
  compatible: boolean;
  compatibility_score: number;
  supported_features: string[];
  unsupported_features: string[];
  workarounds: Workaround[];
  recommendations: string[];
}

/**
 * Workaround for unsupported features
 */
export interface Workaround {
  feature: string;
  alternative: string;
  complexity: 'low' | 'medium' | 'high';
  description: string;
}
