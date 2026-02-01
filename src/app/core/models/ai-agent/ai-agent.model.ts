/**
 * AI Agent operation types
 */
export type AgentOperation =
  | 'fix'
  | 'analyze'
  | 'test'
  | 'optimize'
  | 'document'
  | 'review'
  | 'explain'
  | 'refactor';

/**
 * Base AI Agent request
 */
export interface AgentRequest {
  code: string;
  language: string;
  context?: string;
  options?: AgentOptions;
}

/**
 * AI Agent options
 */
export interface AgentOptions {
  strictMode?: boolean;
  targetVersion?: string;
  includeComments?: boolean;
  performanceOptimization?: boolean;
  securityScan?: boolean;
  customRules?: any[];
}

/**
 * Fix request
 */
export interface FixRequest extends AgentRequest {
  errors?: string[];
  autoCorrect?: boolean;
  maxAttempts?: number;
}

/**
 * Fix response
 */
export interface FixResponse {
  fixed_code: string;
  issues_found: Issue[];
  issues_fixed: Issue[];
  remaining_issues: Issue[];
  success: boolean;
  attempts: number;
  changes_summary: string;
}

/**
 * Code issue
 */
export interface Issue {
  type: 'error' | 'warning' | 'info';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  line?: number;
  column?: number;
  code?: string;
  suggestion?: string;
}

/**
 * Analyze request
 */
export interface AnalyzeRequest extends AgentRequest {
  depth?: 'shallow' | 'medium' | 'deep';
  includeMetrics?: boolean;
  includeSuggestions?: boolean;
}

/**
 * Analyze response
 */
export interface AnalyzeResponse {
  quality_score: number;
  complexity: 'low' | 'medium' | 'high';
  maintainability: number;
  issues: Issue[];
  metrics: CodeMetrics;
  suggestions: string[];
  patterns_detected: string[];
  antipatterns: string[];
}

/**
 * Code metrics
 */
export interface CodeMetrics {
  lines_of_code: number;
  cyclomatic_complexity: number;
  cognitive_complexity: number;
  duplication_percentage: number;
  test_coverage?: number;
  technical_debt?: string;
}

/**
 * Test generation request
 */
export interface TestRequest extends AgentRequest {
  test_framework?: string;
  coverage_target?: number;
  include_edge_cases?: boolean;
  include_mocks?: boolean;
}

/**
 * Test generation response
 */
export interface TestResponse {
  test_code: string;
  test_cases: TestCase[];
  coverage_estimate: number;
  framework: string;
  setup_code?: string;
  teardown_code?: string;
}

/**
 * Test case
 */
export interface TestCase {
  name: string;
  type: 'unit' | 'integration' | 'e2e';
  description: string;
  assertions: number;
  mocks?: string[];
}

/**
 * Optimization request
 */
export interface OptimizeRequest extends AgentRequest {
  optimization_target?: 'performance' | 'memory' | 'readability' | 'all';
  preserve_functionality?: boolean;
}

/**
 * Optimization response
 */
export interface OptimizeResponse {
  optimized_code: string;
  improvements: Improvement[];
  performance_gain?: number;
  memory_reduction?: number;
  before_metrics: CodeMetrics;
  after_metrics: CodeMetrics;
}

/**
 * Code improvement
 */
export interface Improvement {
  type: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  line?: number;
}

/**
 * Documentation request
 */
export interface DocumentRequest extends AgentRequest {
  format?: 'markdown' | 'jsdoc' | 'sphinx' | 'javadoc';
  include_examples?: boolean;
  detail_level?: 'minimal' | 'standard' | 'detailed';
}

/**
 * Documentation response
 */
export interface DocumentResponse {
  documentation: string;
  format: string;
  sections: DocumentSection[];
  coverage: number;
}

/**
 * Documentation section
 */
export interface DocumentSection {
  title: string;
  content: string;
  type: 'overview' | 'parameters' | 'returns' | 'examples' | 'notes';
}

/**
 * Code review request
 */
export interface ReviewRequest extends AgentRequest {
  review_type?: 'security' | 'performance' | 'style' | 'comprehensive';
  standards?: string[];
}

/**
 * Code review response
 */
export interface ReviewResponse {
  overall_rating: number;
  comments: ReviewComment[];
  security_issues: Issue[];
  performance_issues: Issue[];
  style_violations: Issue[];
  recommendations: string[];
  approved: boolean;
}

/**
 * Review comment
 */
export interface ReviewComment {
  line: number;
  severity: 'critical' | 'major' | 'minor' | 'suggestion';
  message: string;
  category: string;
  suggestion?: string;
}

/**
 * Explain request
 */
export interface ExplainRequest extends AgentRequest {
  detail_level?: 'brief' | 'standard' | 'detailed';
  include_examples?: boolean;
  target_audience?: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * Explain response
 */
export interface ExplainResponse {
  explanation: string;
  summary: string;
  key_concepts: string[];
  flow_description: string;
  examples?: string[];
  complexity_level: string;
}

/**
 * Refactor request
 */
export interface RefactorRequest extends AgentRequest {
  refactor_type?: 'extract-method' | 'rename' | 'move' | 'simplify' | 'comprehensive';
  target_pattern?: string;
  preserve_behavior?: boolean;
}

/**
 * Refactor response
 */
export interface RefactorResponse {
  refactored_code: string;
  changes: RefactorChange[];
  benefits: string[];
  risks: string[];
  test_recommendations: string[];
}

/**
 * Refactor change
 */
export interface RefactorChange {
  type: string;
  description: string;
  location: string;
  before: string;
  after: string;
}

/**
 * Agent Project-level analyze request
 */
export interface AgentProjectAnalyzeRequest {
  project_path: string;
  include_dependencies?: boolean;
  analyze_architecture?: boolean;
  detect_vulnerabilities?: boolean;
}

/**
 * Project-level analyze response
 */
export interface ProjectAnalyzeResponse {
  project_name: string;
  languages: { [key: string]: number };
  total_files: number;
  total_lines: number;
  architecture: ArchitectureAnalysis;
  dependencies: Dependency[];
  vulnerabilities: Issue[];
  quality_score: number;
  recommendations: string[];
}

/**
 * Architecture analysis
 */
export interface ArchitectureAnalysis {
  pattern: string;
  layers: string[];
  modules: Module[];
  complexity: string;
}

/**
 * Module information
 */
export interface Module {
  name: string;
  path: string;
  dependencies: string[];
  lines_of_code: number;
}

/**
 * Dependency information
 */
export interface Dependency {
  name: string;
  version: string;
  type: 'production' | 'development';
  vulnerabilities?: Issue[];
}

/**
 * Add feature request
 */
export interface AddFeatureRequest {
  project_path: string;
  feature_description: string;
  feature_type?: 'crud' | 'api' | 'ui' | 'service' | 'integration';
  integration_points?: string[];
}

/**
 * Add feature response
 */
export interface AddFeatureResponse {
  status: 'success' | 'partial' | 'failed';
  files_created: string[];
  files_modified: string[];
  feature_summary: string;
  integration_steps: string[];
  testing_recommendations: string[];
}

/**
 * Agent Figma analyze request
 */
export interface AgentFigmaAnalyzeRequest {
  figma_file_id: string;
  figma_token?: string; // Optional if using system configured token
  nodes?: string[];
  extract_styles?: boolean;
  extract_components?: boolean;
}

/**
 * Figma analyze response
 */
export interface AgentFigmaAnalyzeResponse {
  project_name: string;
  design_system: DesignSystem;
  components: DesignComponent[];
  pages: PageDefinition[];
  assets: AssetDefinition[];
  summary: string;
}

export interface DesignSystem {
  colors: StyleDefinition[];
  typography: StyleDefinition[];
  spacing: number[];
  grid: LayoutInfo;
}

export interface DesignComponent {
  name: string;
  id: string;
  type: string;
  code_snippet: string;
  properties: { [key: string]: any };
}

export interface PageDefinition {
  name: string;
  id: string;
  layout: LayoutInfo;
  sections: SectionDefinition[];
}

export interface SectionDefinition {
  name: string;
  type: string;
  content: any;
}

export interface AssetDefinition {
  name: string;
  url: string;
  format: string;
  scale: number;
}

export interface StyleDefinition {
  name: string;
  value: string | number;
  type: string;
}

export interface LayoutInfo {
  width: number;
  height: number;
  alignment: string;
  padding: number | { [key: string]: number };
}
