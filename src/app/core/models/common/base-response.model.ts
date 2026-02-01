// Base Response Models

import { UUID, Timestamp, ApiResponse, PaginatedResponse } from '../../types/common.types';

export interface BaseResponseDTO<T = any> {
  status: 'success' | 'error';
  code: string;
  message: string;
  data?: T;
  errors?: string[];
  meta?: {
    pagination?: PaginationMeta;
    timestamp?: Timestamp;
    request_id?: string;
    version?: string;
  };
}

/**
 * Base Response (alias for compatibility)
 */
export type BaseResponse<T = any> = BaseResponseDTO<T>;

export interface PaginationMeta {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}

export interface ErrorResponseDTO {
  status: 'error';
  code: string;
  message: string;
  errors?: ErrorDetail[];
  details?: { [key: string]: any };
  timestamp?: Timestamp;
  request_id?: string;
}

export interface ErrorDetail {
  field?: string;
  message: string;
  code?: string;
  value?: any;
}

export interface SuccessResponseDTO<T = any> extends BaseResponseDTO<T> {
  status: 'success';
  data: T;
}

export interface ListResponseDTO<T = any> extends BaseResponseDTO<T[]> {
  data: T[];
  meta: {
    pagination: PaginationMeta;
    timestamp: Timestamp;
    request_id?: string;
  };
}

export interface ValidationErrorResponseDTO extends ErrorResponseDTO {
  code: 'VALIDATION_ERROR';
  errors: ErrorDetail[];
}
