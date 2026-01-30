import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
    static projectName(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (!value) return null;

            // Only allow alphanumeric, hyphens, and underscores
            const pattern = /^[a-zA-Z0-9_-]+$/;
            if (!pattern.test(value)) {
                return { invalidProjectName: true };
            }

            // Check for path traversal attempts
            if (value.includes('..') || value.includes('/') || value.includes('\\')) {
                return { pathTraversal: true };
            }

            return null;
        };
    }

    static safeUrl(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (!value) return null;

            const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b/;
            if (!urlPattern.test(value)) {
                return { invalidUrl: true };
            }

            return null;
        };
    }

    static noScriptTags(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (!value) return null;

            const scriptPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
            if (scriptPattern.test(value)) {
                return { containsScript: true };
            }

            return null;
        };
    }

    static maxFileSize(maxSizeInMB: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const file = control.value as File;
            if (!file) return null;

            const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
            if (file.size > maxSizeInBytes) {
                return { maxFileSize: { requiredSize: maxSizeInMB, actualSize: file.size / 1024 / 1024 } };
            }

            return null;
        };
    }
}
