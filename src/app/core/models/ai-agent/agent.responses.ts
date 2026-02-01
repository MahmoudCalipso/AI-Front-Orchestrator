import { UUID, Timestamp } from '../common/common.types';
import { AgentStatus } from '../common/enums';

export interface AgentResponseDTO {
    id: UUID;
    name: string;
    display_name: string;
    description?: string;
    agent_type: string;
    status: AgentStatus;
    model: string;
    temperature: number;
    max_tokens: number;
    tools: string[];
    created_at: Timestamp;
    updated_at: Timestamp;
    user_id: UUID;
    session_count: number;
    total_tokens_used: number;
    last_active_at?: Timestamp;
    metadata?: Record<string, any>;
}

export interface AgentInitializationResponseDTO {
    agent: AgentResponseDTO;
    initialization_status: string;
    websocket_url?: string;
}

export interface AgentListResponseDTO {
    agents: AgentResponseDTO[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}
