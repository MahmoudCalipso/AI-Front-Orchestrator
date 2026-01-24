export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000',
  wsUrl: 'ws://localhost:8000',
  apiKey: 'dev-api-key',
  defaultTimeout: 30000,
  retryAttempts: 3,
  enableLogging: true,

  // Feature flags
  features: {
    aiChat: true,
    collaboration: true,
    kubernetes: true,
    monitoring: true,
    gitIntegration: true,
    databaseExplorer: true
  }
};
