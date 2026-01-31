import { Component, inject, signal } from '@angular/core';
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
    standalone: true,
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
    loading = signal(false);
    hidePassword = signal(true);
    hideConfirmPassword = signal(true);

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
        return !(hasUpperCase && hasLowerCase && hasNumeric && hasSpecial) ? { passwordStrength: true } : null;
    }

    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');
        if (!password || !confirmPassword) return null;
        return password.value === confirmPassword.value ? null : { passwordMismatch: true };
    }

    onSubmit(): void {
        if (this.registerForm.valid) {
            this.loading.set(true);
            const { username, email, password } = this.registerForm.value;
            this.authService.register({
                email,
                password,
                full_name: username,
                tenant_name: `${username}-tenant`
            }).subscribe({
                next: () => {
                    this.toast.success('Registration successful! Please log in.');
                    this.router.navigate(['/login']);
                    this.loading.set(false);
                },
                error: (error) => {
                    this.loading.set(false);
                    this.toast.error(error.message || 'Registration failed');
                }
            });
        }
    }

    getErrorMessage(field: string): string {
        const control = this.registerForm.get(field);
        if (control?.hasError('required')) return 'Required';
        if (control?.hasError('email')) return 'Invalid email';
        if (control?.hasError('minlength')) return `Min ${control.getError('minlength').requiredLength} chars`;
        if (control?.hasError('passwordStrength')) return 'Weak password';
        if (field === 'confirmPassword' && this.registerForm.hasError('passwordMismatch')) return 'Passwords mismatch';
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
        return strength <= 2 ? 'weak' : strength <= 4 ? 'medium' : 'strong';
    }
}
