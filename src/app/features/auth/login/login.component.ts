import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/api/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-login',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        MatIconModule,
        LoadingSpinnerComponent
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private toast = inject(ToastService);

    loginForm: FormGroup;
    loading = false;
    hidePassword = true;

    constructor() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            rememberMe: [false]
        });
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            this.loading = true;
            const { email: username, password } = this.loginForm.value;

            this.authService.login({ username, password }).subscribe({
                next: () => {
                    // Navigate based on return URL or default
                    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
                    this.router.navigate([returnUrl]);
                },
                error: (error) => {
                    this.loading = false;
                    this.toast.error(error.message || 'Login failed. Please check your credentials.');
                },
                complete: () => {
                    this.loading = false;
                }
            });
        } else {
            this.markFormGroupTouched(this.loginForm);
        }
    }

    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            control?.markAsTouched();
        });
    }

    getErrorMessage(field: string): string {
        const control = this.loginForm.get(field);
        if (control?.hasError('required')) {
            return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        }
        if (control?.hasError('email')) {
            return 'Please enter a valid email';
        }
        if (control?.hasError('minlength')) {
            return 'Password must be at least 6 characters';
        }
        return '';
    }
}
