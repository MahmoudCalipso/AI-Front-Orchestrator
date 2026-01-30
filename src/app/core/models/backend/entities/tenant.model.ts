// Tenant Entity Models

import { TenantPlan, SubscriptionStatus } from '../types/enums';
import { UUID, Timestamp, Metadata } from '../types/common.types';

export interface Tenant {
  id: UUID;
  name: string;
  plan: TenantPlan;
  storage_quota_gb: number; // -1 for unlimited
  storage_used_gb: number;
  workbench_quota: number; // -1 for unlimited
  api_rate_limit: number; // -1 for unlimited
  max_users: number;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  subscription_status: SubscriptionStatus;
  is_active: boolean;
  trial_ends_at?: Timestamp;
  created_at: Timestamp;
  updated_at: Timestamp;
  metadata?: Metadata;
}

export interface TenantUsage {
  tenant_id: UUID;
  period_start: Timestamp;
  period_end: Timestamp;
  api_calls: number;
  storage_used_gb: number;
  active_projects: number;
  active_users: number;
  costs: {
    api_cost: number;
    storage_cost: number;
    total_cost: number;
  };
}

export interface TenantLimits {
  max_users: number;
  max_projects: number;
  max_storage_gb: number;
  max_api_calls_per_month: number;
  max_concurrent_builds: number;
  max_workbench_runtime_hours: number;
}
