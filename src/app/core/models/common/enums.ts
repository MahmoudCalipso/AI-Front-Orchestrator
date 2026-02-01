/**
 * Backend Enums
 * All enums matching the backend Python enums
 */

// ==================== Task Types ====================
export enum TaskType {
  CODE_GENERATION = 'code_generation',
  CODE_REVIEW = 'code_review',
  REASONING = 'reasoning',
  QUICK_QUERY = 'quick_query',
  CREATIVE_WRITING = 'creative_writing',
  DATA_ANALYSIS = 'data_analysis',
  DOCUMENTATION = 'documentation',
  CHAT = 'chat',
  EMBEDDING = 'embedding'
}

// ==================== Runtime Types ====================
export enum RuntimeType {
  OLLAMA = 'ollama',
  VLLM = 'vllm',
  TRANSFORMERS = 'transformers',
  LLAMACPP = 'llamacpp'
}

// ==================== Model Status ====================
export enum ModelStatus {
  AVAILABLE = 'available',
  LOADING = 'loading',
  LOADED = 'loaded',
  UNLOADING = 'unloading',
  ERROR = 'error',
  UNAVAILABLE = 'unavailable'
}

// ==================== Project Status ====================
export enum ProjectStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
  BUILDING = 'building',
  RUNNING = 'running'
}

// ==================== Project Type ====================
export enum ProjectType {
  WEB = 'web',
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
  API = 'api',
  FULLSTACK = 'fullstack'
}

// ==================== Architecture Pattern ====================
export enum ArchitecturePattern {
  MVC = 'mvc',
  MVVM = 'mvvm',
  CLEAN_ARCHITECTURE = 'clean_architecture',
  HEXAGONAL = 'hexagonal',
  MICROSERVICES = 'microservices',
  REPOSITORY_PATTERN = 'repository_pattern',
  CQRS = 'cqrs'
}

// ==================== Database Type ====================
export enum DatabaseType {
  POSTGRESQL = 'postgresql',
  MYSQL = 'mysql',
  SQLSERVER = 'sqlserver',
  SQLITE = 'sqlite',
  MONGODB = 'mongodb',
  REDIS = 'redis',
  DYNAMODB = 'dynamodb',
  COSMOSDB = 'cosmosdb',
  CASSANDRA = 'cassandra',
  NONE = 'none'
}

// ==================== Build Status ====================
export enum BuildStatus {
  PENDING = 'pending',
  BUILDING = 'building',
  SUCCESS = 'success',
  FAILED = 'failed'
}

// ==================== Run Status ====================
export enum RunStatus {
  STOPPED = 'stopped',
  RUNNING = 'running',
  CRASHED = 'crashed',
  STARTING = 'starting'
}

// ==================== Workflow Status ====================
export enum WorkflowStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

// ==================== Agent Status ====================
export enum AgentStatus {
  IDLE = 'idle',
  INITIALIZING = 'initializing',
  ACTIVE = 'active',
  PAUSED = 'paused',
  ERROR = 'error',
  TERMINATED = 'terminated',
  ARCHIVED = 'archived'
}

// ==================== Agent Type ====================
export enum AgentType {
  ORCHESTRATOR = 'orchestrator',
  CODE_GENERATOR = 'code_generator',
  CODE_REVIEWER = 'code_reviewer',
  DEBUGGER = 'debugger',
  DOCUMENTATION = 'documentation',
  ANALYZER = 'analyzer',
  SECURITY = 'security',
  OPTIMIZER = 'optimizer',
  CUSTOM = 'custom'
}

// ==================== Agent Selection Mode ====================
export enum AgentSelectionMode {
  AUTO = 'auto',
  MANUAL = 'manual',
  SEMI_AUTO = 'semi_auto'
}

// ==================== Execution Mode ====================
export enum ExecutionMode {
  SEQUENTIAL = 'sequential',
  PARALLEL = 'parallel',
  ADAPTIVE = 'adaptive'
}

// ==================== Execution Status ====================
export enum ExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  TIMEOUT = 'timeout'
}

// ==================== Response Status ====================
export enum ResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning'
}
// ==================== Sort Direction ====================
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

// ==================== Filter Operator ====================
export enum FilterOperator {
  EQ = 'eq',
  NE = 'ne',
  GT = 'gt',
  GTE = 'gte',
  LT = 'lt',
  LTE = 'lte',
  CONTAINS = 'contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  IN = 'in'
}

// ==================== User Roles ====================
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
  VIEWER = 'viewer',
  ENTERPRISE = 'enterprise',
  PRO_DEVELOPER = 'pro_developer',
  DEVELOPER = 'developer'
}

// ==================== User Status ====================
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

// ==================== Activity Types ====================
export enum ActivityType {
  PROJECT_CREATE = 'project_create',
  PROJECT_UPDATE = 'project_update',
  PROJECT_DELETE = 'project_delete',
  CODE_GENERATE = 'code_generate',
  CODE_ANALYZE = 'code_analyze',
  CODE_FIX = 'code_fix',
  SECURITY_SCAN = 'security_scan',
  AGENT_ORCHESTRATE = 'agent_orchestrate',
  GIT_SYNC = 'git_sync',
  BUILD_RUN = 'build_run'
}
