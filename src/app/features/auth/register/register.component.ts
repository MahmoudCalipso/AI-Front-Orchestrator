import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/api/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-register',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        LoadingSpinnerComponent
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    private toast = inject(ToastService);

    registerForm: FormGroup;
    loading = false;
    hidePassword = true;
    hideConfirmPassword = true;

    constructor() {
        this.registerForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
            confirmPassword: ['', [Validators.required]]
        }, { validators: this.passwordMatchValidator });
    }

    passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null;

        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumeric = /[0-9]/.test(value);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

        const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;

        return !passwordValid ? { passwordStrength: true } : null;
    }

    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');

        if (!password || !confirmPassword) return null;

        return password.value === confirmPassword.value ? null : { passwordMismatch: true };
    }

    onSubmit(): void {
        if (this.registerForm.valid) {
            this.loading = true;
            const { username, email, password } = this.registerForm.value;

            this.authService.register({ username, email, password }).subscribe({
                next: (response) => {
                    this.toast.success('Registration successful! Please log in.');
                    this.router.navigate(['/login']);
                },
                error: (error) => {
                    this.loading = false;
                    this.toast.error(error.message || 'Registration failed. Please try again.');
                },
                complete: () => {
                    this.loading = false;
                }
            });
        } else {
            this.markFormGroupTouched(this.registerForm);
        }
    }

    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            control?.markAsTouched();
        });
    }

    getErrorMessage(field: string): string {
        const control = this.registerForm.get(field);
        if (control?.hasError('required')) {
            return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        }
        if (control?.hasError('email')) {
            return 'Please enter a valid email';
        }
        if (control?.hasError('minlength')) {
            const minLength = control.getError('minlength').requiredLength;
            return `Must be at least ${minLength} characters`;
        }
        if (control?.hasError('passwordStrength')) {
            return 'Password must contain uppercase, lowercase, number, and special character';
        }
        if (field === 'confirmPassword' && this.registerForm.hasError('passwordMismatch')) {
            return 'Passwords do not match';
        }
        return '';
    }

    getPasswordStrength(): string {
        const password = this.registerForm.get('password')?.value;
        if (!password) return '';

        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

        if (strength <= 2) return 'weak';
        if (strength <= 4) return 'medium';
        return 'strong';
    }
}
