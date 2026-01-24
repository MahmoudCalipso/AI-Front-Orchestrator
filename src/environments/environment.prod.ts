export const environment = {
  production: true,
  apiUrl: 'https://api.ai-orchestrator.io',
  wsUrl: 'wss://api.ai-orchestrator.io',
  apiKey: '',
  defaultTimeout: 30000,
  retryAttempts: 3,
  enableLogging: false,

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
