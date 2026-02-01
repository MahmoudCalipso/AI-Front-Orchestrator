import { Injectable, inject, computed } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { AIService } from '../../services/api/ai.service';
import { AiAgentService } from '../../services/api/ai-agent.service';
import {
  ModelInfo,
  OrchestrationRequest,
  OrchestrationResponse,
  FixCodeRequest,
  AnalyzeCodeRequest,
  TestCodeRequest,
  OptimizeCodeRequest,
  RefactorCodeRequest,
  SwarmResponse
} from '../../models/ai/ai.model';
import {
  AgentResponseDTO,
  CreateAgentRequest,
  UpdateAgentRequest
} from '../../models/ai-agent/agent-entity.model';

export interface AIState {
  models: ModelInfo[];
  selectedModel: ModelInfo | null;
  agents: AgentResponseDTO[];
  selectedAgent: AgentResponseDTO | null;
  loading: boolean;
  error: string | null;
  operationInProgress: 'generate' | 'migrate' | 'fix' | 'analyze' | 'test' | 'optimize' | 'refactor' | null;
  lastOperationResult: any | null;
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
}

const initialState: AIState = {
  models: [],
  selectedModel: null,
  agents: [],
  selectedAgent: null,
  loading: false,
  error: null,
  operationInProgress: null,
  lastOperationResult: null,
  chatHistory: []
};

export const AIStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, aiService = inject(AIService), agentService = inject(AiAgentService)) => ({
    // Load models
    loadModels: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() => aiService.listModels().pipe(
          tapResponse({
            next: (models) => {
              patchState(store, { models, loading: false });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to load models',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Load model info
    loadModelInfo: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((modelName) => aiService.getModelInfo(modelName).pipe(
          tapResponse({
            next: (model) => {
              patchState(store, { selectedModel: model, loading: false });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to load model info',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Load model
    loadModel: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((modelName) => aiService.loadModel(modelName).pipe(
          tapResponse({
            next: () => {
              patchState(store, { loading: false });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to load model',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Unload model
    unloadModel: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((modelName) => aiService.unloadModel(modelName).pipe(
          tapResponse({
            next: () => {
              patchState(store, { loading: false });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to unload model',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Generate project
    generateProject: rxMethod<any>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null, operationInProgress: 'generate' })),
        switchMap((request) => aiService.generateProject(request).pipe(
          tapResponse({
            next: (result) => {
              patchState(store, {
                lastOperationResult: result,
                loading: false,
                operationInProgress: null
              });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to generate project',
                loading: false,
                operationInProgress: null
              });
            }
          })
        ))
      )
    ),

    // Migrate project
    migrateProject: rxMethod<any>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null, operationInProgress: 'migrate' })),
        switchMap((request) => aiService.migrateProject(request).pipe(
          tapResponse({
            next: (result) => {
              patchState(store, {
                lastOperationResult: result,
                loading: false,
                operationInProgress: null
              });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to migrate project',
                loading: false,
                operationInProgress: null
              });
            }
          })
        ))
      )
    ),

    // Fix code
    fixCode: rxMethod<FixCodeRequest>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null, operationInProgress: 'fix' })),
        switchMap((request) => aiService.fixCode(request).pipe(
          tapResponse({
            next: (result) => {
              patchState(store, {
                lastOperationResult: result,
                loading: false,
                operationInProgress: null
              });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to fix code',
                loading: false,
                operationInProgress: null
              });
            }
          })
        ))
      )
    ),

    // Analyze code
    analyzeCode: rxMethod<AnalyzeCodeRequest>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null, operationInProgress: 'analyze' })),
        switchMap((request) => aiService.analyzeCode(request).pipe(
          tapResponse({
            next: (result) => {
              patchState(store, {
                lastOperationResult: result,
                loading: false,
                operationInProgress: null
              });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to analyze code',
                loading: false,
                operationInProgress: null
              });
            }
          })
        ))
      )
    ),

    // Generate tests
    generateTests: rxMethod<TestCodeRequest>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null, operationInProgress: 'test' })),
        switchMap((request) => aiService.generateTests(request).pipe(
          tapResponse({
            next: (result) => {
              patchState(store, {
                lastOperationResult: result,
                loading: false,
                operationInProgress: null
              });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to generate tests',
                loading: false,
                operationInProgress: null
              });
            }
          })
        ))
      )
    ),

    // Optimize code
    optimizeCode: rxMethod<OptimizeCodeRequest>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null, operationInProgress: 'optimize' })),
        switchMap((request) => aiService.optimizeCode(request).pipe(
          tapResponse({
            next: (result) => {
              patchState(store, {
                lastOperationResult: result,
                loading: false,
                operationInProgress: null
              });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to optimize code',
                loading: false,
                operationInProgress: null
              });
            }
          })
        ))
      )
    ),

    // Refactor code
    refactorCode: rxMethod<RefactorCodeRequest>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null, operationInProgress: 'refactor' })),
        switchMap((request) => aiService.refactorCode(request).pipe(
          tapResponse({
            next: (result) => {
              patchState(store, {
                lastOperationResult: result,
                loading: false,
                operationInProgress: null
              });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to refactor code',
                loading: false,
                operationInProgress: null
              });
            }
          })
        ))
      )
    ),

    // Chat with AI
    chat: rxMethod<{ prompt: string; model?: string; temperature?: number }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((request) => aiService.chat(request).pipe(
          tapResponse({
            next: (result) => {
              patchState(store, (state) => ({
                chatHistory: [
                  ...state.chatHistory,
                  { role: 'user' as const, content: request.prompt },
                  { role: 'assistant' as const, content: result.response }
                ],
                loading: false
              }));
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to get response',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Load agents
    loadAgents: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() => agentService.listAgents(1, 100).pipe(
          tapResponse({
            next: (result) => {
              patchState(store, { agents: result.agents as any[], loading: false });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to load agents',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Create agent
    createAgent: rxMethod<CreateAgentRequest>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((request) => agentService.createAgent(request as any).pipe(
          tapResponse({
            next: (agent) => {
              patchState(store, (state: any) => ({
                agents: [...state.agents, agent.agent as any],
                loading: false
              }));
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to create agent',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Delete agent
    deleteAgent: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((agentId) => agentService.deleteAgent(agentId).pipe(
          tapResponse({
            next: () => {
              patchState(store, (state) => ({
                agents: state.agents.filter(a => a.id !== agentId),
                selectedAgent: state.selectedAgent?.id === agentId ? null : state.selectedAgent,
                loading: false
              }));
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to delete agent',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Select model
    selectModel: (model: ModelInfo | null) => {
      patchState(store, { selectedModel: model });
    },

    // Select agent
    selectAgent: (agent: AgentResponseDTO | null) => {
      patchState(store, { selectedAgent: agent });
    },

    // Clear error
    clearError: () => {
      patchState(store, { error: null });
    },

    // Clear chat history
    clearChatHistory: () => {
      patchState(store, { chatHistory: [] });
    },

    // Clear last operation result
    clearLastOperation: () => {
      patchState(store, { lastOperationResult: null });
    }
  })),
  withComputed((store) => ({
    // Check if has models
    hasModels: computed(() => store.models().length > 0),

    // Get model count
    modelCount: computed(() => store.models().length),

    // Get loaded models
    loadedModels: computed(() => store.models().filter(m => m.loaded)),

    // Check if has agents
    hasAgents: computed(() => store.agents().length > 0),

    // Get agent count
    agentCount: computed(() => store.agents().length),

    // Check if operation is in progress
    isOperating: computed(() => store.operationInProgress() !== null),

    // Get current operation
    currentOperation: computed(() => store.operationInProgress()),

    // Get chat history length
    chatHistoryLength: computed(() => store.chatHistory().length),

    // Check if has chat history
    hasChatHistory: computed(() => store.chatHistory().length > 0)
  }))
);
