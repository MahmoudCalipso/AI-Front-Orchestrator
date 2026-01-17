export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com',
  wsUrl: 'wss://api.yourdomain.com',
  apiVersion: 'v1',

  // API Endpoints
  endpoints: {
    auth: '/api/v1/auth',
    generation: '/api',
    migration: '/api',
    storage: '/api/storage',
    kubernetes: '/api/k8s',
    monitoring: '/api/monitoring',
    ide: '/api/ide',
    git: '/api/git',
    database: '/api/registry',
    security: '/api/security',
    lifecycle: '/api/lifecycle',
    docker: '/api/docker',
    collaboration: '/api/collaboration',
    workspace: '/api/workspaces'
  },

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
