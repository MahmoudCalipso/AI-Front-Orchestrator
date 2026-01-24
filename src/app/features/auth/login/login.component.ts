import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/api/auth.service';
import { LoginRequest } from '../../../core/models/auth/auth.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage: string | null = null;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [true]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const request: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(request).subscribe({
      next: (response) => {
        // Store tokens if remember me is checked
        if (this.loginForm.value.rememberMe) {
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
        }

        // Fetch user info and navigate to dashboard
        this.authService.getCurrentUser().subscribe({
          next: () => {
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            console.error('Failed to fetch user info:', error);
            this.router.navigate(['/dashboard']);
          }
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Login failed. Please try again.';
        console.error('Login error:', error);
      }
    });
  }

  connectGitHub(): void {
    this.authService.connectExternalAccount('github').subscribe({
      next: (response) => {
        window.location.href = response.auth_url;
      },
      error: (error) => {
        console.error('GitHub connection failed:', error);
      }
    });
  }

  connectGoogle(): void {
    this.authService.connectExternalAccount('google').subscribe({
      next: (response) => {
        window.location.href = response.auth_url;
      },
      error: (error) => {
        console.error('Google connection failed:', error);
      }
    });
  }
}
