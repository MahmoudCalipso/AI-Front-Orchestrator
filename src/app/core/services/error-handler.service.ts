import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../shared/services/toast.service';

/**
 * App Error Classification
 */
export enum ErrorType {
    NETWORK = 'NETWORK',
    VALIDATION = 'VALIDATION',
    AUTH = 'AUTH',
    SERVER = 'SERVER',
    UNKNOWN = 'UNKNOWN'
}

@Injectable({
    providedIn: 'root'
})
export class ErrorHandlerService {
    private toast = inject(ToastService);

    /**
     * Handle application errors
     */
    handleError(error: any): void {
        const errorType = this.classifyError(error);
        const userMessage = this.getUserMessage(error, errorType);

        // Log error for monitoring
        this.logError(error, errorType);

        // Notify user
        this.toast.error(userMessage);
    }

    /**
     * Classify error into predefined types
     */
    classifyError(error: any): ErrorType {
        if (error instanceof HttpErrorResponse) {
            if (error.status === 0) return ErrorType.NETWORK;
            if (error.status === 401 || error.status === 403) return ErrorType.AUTH;
            if (error.status === 422 || error.status === 400) return ErrorType.VALIDATION;
            if (error.status >= 500) return ErrorType.SERVER;
        }
        return ErrorType.UNKNOWN;
    }

    /**
     * Get user-friendly error message
     */
    getUserMessage(error: any, type?: ErrorType): string {
        const errorType = type || this.classifyError(error);

        switch (errorType) {
            case ErrorType.NETWORK:
                return 'Network error. Please check your internet connection.';
            case ErrorType.AUTH:
                return 'Session expired or unauthorized. Please log in again.';
            case ErrorType.VALIDATION:
                return error.error?.message || 'Invalid data provided. Please check your input.';
            case ErrorType.SERVER:
                return 'A server error occurred. Our team has been notified.';
            default:
                return error.message || 'An unexpected error occurred. Please try again later.';
        }
    }

    /**
     * Log error to console/monitoring service
     */
    private logError(error: any, type: ErrorType): void {
        console.error(`[AppError] [${type}]`, {
            message: error.message,
            status: error.status,
            timestamp: new Date().toISOString(),
            originalError: error
        });
    }
}
