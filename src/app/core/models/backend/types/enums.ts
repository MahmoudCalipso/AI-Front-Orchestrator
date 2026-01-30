// Enums and Constants from Backend Analysis

export enum UserRole {
  ADMIN = 'admin',
  ENTERPRISE = 'enterprise',
  PRO_DEVELOPER = 'pro_developer',
  DEVELOPER = 'developer'
}

export enum ProjectStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  BUILDING = 'building',
  RUNNING = 'running'
}

export enum BuildStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PENDING = 'pending',
  BUILDING = 'building'
}

export enum RunStatus {
  RUNNING = 'running',
  STOPPED = 'stopped',
  CRASHED = 'crashed'
}

export enum TenantPlan {
  DEVELOPER = 'developer',
  PRO_DEVELOPER = 'pro_developer',
  ENTERPRISE = 'enterprise',
  ADMIN = 'admin'
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  PAST_DUE = 'past_due'
}

export enum ModelStatus {
  AVAILABLE = 'available',
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error',
  UNAVAILABLE = 'unavailable'
}

export enum TaskType {
  FIX_CODE = 'fix_code',
  ANALYZE_CODE = 'analyze_code',
  TEST_CODE = 'test_code',
  OPTIMIZE_CODE = 'optimize_code',
  DOCUMENT_CODE = 'document_code',
  REVIEW_CODE = 'review_code',
  EXPLAIN_CODE = 'explain_code',
  REFACTOR_CODE = 'refactor_code'
}

export enum DatabaseType {
  POSTGRESQL = 'postgresql',
  MYSQL = 'mysql',
  SQLITE = 'sqlite',
  MONGODB = 'mongodb',
  REDIS = 'redis'
}

export enum ProjectType {
  WEB = 'web',
  API = 'api',
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
  CLI = 'cli',
  LIBRARY = 'library'
}

export enum ArchitecturePattern {
  MVC = 'mvc',
  MVVM = 'mvvm',
  CLEAN_ARCHITECTURE = 'clean_architecture',
  HEXAGONAL = 'hexagonal',
  LAYERED = 'layered',
  MICROSERVICES = 'microservices'
}

export enum SecurityConfigType {
  JWT = 'jwt',
  OAUTH2 = 'oauth2',
  API_KEY = 'api_key',
  BASIC_AUTH = 'basic_auth',
  SAML = 'saml'
}

export enum DeploymentType {
  DOCKER = 'docker',
  KUBERNETES = 'kubernetes',
  SERVERLESS = 'serverless',
  HEROKU = 'heroku',
  AWS = 'aws',
  AZURE = 'azure',
  GCP = 'gcp'
}

export enum ExternalProvider {
  GITHUB = 'github',
  BITBUCKET = 'bitbucket',
  GITLAB = 'gitlab',
  GOOGLE = 'google'
}


export enum ActivityType {
  PROJECT_CREATED = 'project_created',
  PROJECT_UPDATED = 'project_updated',
  PROJECT_DELETED = 'project_deleted',
  USER_JOINED = 'user_joined',
  USER_LEFT = 'user_left',
  FILE_EDITED = 'file_edited',
  BUILD_STARTED = 'build_started',
  BUILD_COMPLETED = 'build_completed'
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export enum FilterOperator {
  EQUALS = 'eq',
  NOT_EQUALS = 'ne',
  GREATER_THAN = 'gt',
  LESS_THAN = 'lt',
  GREATER_EQUAL = 'gte',
  LESS_EQUAL = 'lte',
  CONTAINS = 'contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  IN = 'in',
  NOT_IN = 'not_in'
}
