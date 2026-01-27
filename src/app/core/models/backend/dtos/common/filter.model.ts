// Filter Models for Powerful Data Filtering

import { SortDirection, FilterOperator } from '../../types/enums';
import { Timestamp } from '../../types/common.types';

export interface BaseFilter {
  search?: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_direction?: SortDirection;
}

export interface DateRangeFilter {
  created_after?: Timestamp;
  created_before?: Timestamp;
  updated_after?: Timestamp;
  updated_before?: Timestamp;
}

export interface UserFilter extends BaseFilter, DateRangeFilter {
  role?: string;
  is_active?: boolean;
  tenant_id?: string;
  email_contains?: string;
}

export interface ProjectFilter extends BaseFilter, DateRangeFilter {
  status?: string;
  language?: string;
  framework?: string;
  user_id?: string;
  workspace_id?: string;
  build_status?: string;
  run_status?: string;
}

export interface WorkspaceFilter extends BaseFilter, DateRangeFilter {
  owner_id?: string;
  member_count_min?: number;
  member_count_max?: number;
  has_projects?: boolean;
}

export interface TenantFilter extends BaseFilter, DateRangeFilter {
  plan?: string;
  is_active?: boolean;
  storage_usage_min?: number;
  storage_usage_max?: number;
  user_count_min?: number;
  user_count_max?: number;
}

export interface ActivityFilter extends BaseFilter, DateRangeFilter {
  user_id?: string;
  activity_type?: string;
  workspace_id?: string;
  project_id?: string;
}

export interface AuditLogFilter extends BaseFilter, DateRangeFilter {
  user_id?: string;
  action?: string;
  resource_type?: string;
  resource_id?: string;
  ip_address?: string;
}

export interface AdvancedFilter {
  field: string;
  operator: FilterOperator;
  value: any;
  case_sensitive?: boolean;
}

export interface ComplexFilter extends BaseFilter {
  filters?: AdvancedFilter[];
  date_range?: DateRangeFilter;
  group_by?: string[];
  aggregations?: string[];
}

// Filter State for UI Components
export interface FilterState<T extends BaseFilter = BaseFilter> {
  filters: T;
  applied_filters: string[]; // Keys of applied filters
  is_loading: boolean;
  total_count?: number;
  last_updated?: Timestamp;
}

export interface SortOption {
  field: string;
  label: string;
  direction: SortDirection;
}

export interface FilterOption {
  field: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'boolean';
  options?: { value: any; label: string }[];
  placeholder?: string;
  multiple?: boolean;
}
