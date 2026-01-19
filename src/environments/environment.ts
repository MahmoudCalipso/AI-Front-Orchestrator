export const environment = {
  production: false,
  apiUrl: '/api',
  wsUrl: 'ws://localhost:8000', // WebSockets often need explicit host/port
  apiVersion: 'v1',

  // API Endpoints
  endpoints: {
    auth: '/api/v1/auth',
    generation: '/api/v1/generation',
    migration: '/api/v1/migration',
    analysis: '/api/v1/analysis',
    kubernetes: '/api/v1/kubernetes',
    storage: '/api/v1/storage',
    monitoring: '/api/v1/monitoring',
    settings: '/api/v1/settings',
    ide: '/api/v1/ide',
    workspace: '/api/v1/workspace'
  },
  enableLogging: true,
  retryAttempts: 3,
  retryDelay: 1000,
  defaultTimeout: 30000,
  apiKey: 'dev-api-key',

  // WebSocket Endpoints
  websockets: {
    workbench: '/ws/workbench',
    terminal: '/ws/terminal',
    monitoring: '/ws/monitoring',
    collaboration: '/ws/collaboration'
  },

  // Feature Flags
  features: {
    enableRealTimeCollaboration: true,
    enableWebSocketMonitoring: true,
    enableAIAssistant: true,
    enableKubernetes: true,
    enableGitIntegration: true
  },

  // Configuration
  config: {
    requestTimeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
    maxFileSize: 10485760, // 10 MB
    allowedFileTypes: ['.ts', '.js', '.py', '.java', '.go', '.rs', '.cpp', '.c', '.html', '.css', '.json', '.xml', '.yaml', '.yml', '.md'],
    defaultPageSize: 20,
    maxPageSize: 100
  }
};
