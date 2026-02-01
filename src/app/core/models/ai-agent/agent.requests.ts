import { AgentType } from '../common/enums';

export interface CreateAgentRequest {
    name: string;
    display_name: string;
    description?: string;
    agent_type: AgentType;
    model: string;
    system_prompt?: string;
    temperature: number;
    max_tokens: number;
    tools: string[];
    metadata?: Record<string, any>;
}

export interface UpdateAgentRequest {
    display_name?: string;
    description?: string;
    system_prompt?: string;
    temperature?: number;
    max_tokens?: number;
    tools?: string[];
    metadata?: Record<string, any>;
}
