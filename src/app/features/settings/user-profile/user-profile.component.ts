import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AuthService } from '../../../core/services/api/auth.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        MatSelectModule,
        MatButtonToggleModule,
        CardComponent,
        ButtonComponent,
        ModalComponent
    ],
    templateUrl: './user-profile.component.html',
    styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);

    user: any = null;
    profileForm!: FormGroup;
    preferencesForm!: FormGroup;
    passwordForm!: FormGroup;

    saving = false;
    savingPreferences = false;
    changingPassword = false;
    showPasswordModal = false;

    recentActivity: any[] = [];

    ngOnInit(): void {
        this.initializeForms();
        this.loadUserProfile();
        this.loadRecentActivity();
    }

    initializeForms(): void {
        this.profileForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            bio: [''],
            organization: ['']
        });

        this.preferencesForm = this.fb.group({
            theme: ['dark'],
            language: ['en'],
            notifications_enabled: [true],
            email_notifications: [false]
        });

        this.passwordForm = this.fb.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required]
        });
    }

    loadUserProfile(): void {
        this.authService.getCurrentUser().subscribe({
            next: (user) => {
                this.user = user;
                this.profileForm.patchValue({
                    username: user.username,
                    email: user.email,
                    bio: user.bio || '',
                    organization: user.organization || ''
                });

                if (user.preferences) {
                    this.preferencesForm.patchValue(user.preferences);
                }
            },
            error: (error) => console.error('Failed to load user profile', error)
        });
    }

    loadRecentActivity(): void {
        // Mock data - replace with actual API call
        this.recentActivity = [
            {
                id: '1',
                type: 'project',
                description: 'Created new project "E-commerce API"',
                timestamp: new Date(Date.now() - 3600000).toISOString()
            },
            {
                id: '2',
                type: 'build',
                description: 'Build completed successfully',
                timestamp: new Date(Date.now() - 7200000).toISOString()
            },
            {
                id: '3',
                type: 'login',
                description: 'Logged in from new device',
                timestamp: new Date(Date.now() - 86400000).toISOString()
            }
        ];
    }

    saveProfile(): void {
        if (this.profileForm.invalid) return;

        this.saving = true;
        // API call to save profile
        setTimeout(() => {
            this.saving = false;
            console.log('Profile saved', this.profileForm.value);
        }, 1000);
    }

    savePreferences(): void {
        this.savingPreferences = true;
        // API call to save preferences
        setTimeout(() => {
            this.savingPreferences = false;
            console.log('Preferences saved', this.preferencesForm.value);
        }, 1000);
    }

    resetForm(): void {
        this.loadUserProfile();
    }

    uploadAvatar(): void {
        // Implement avatar upload
        console.log('Upload avatar');
    }

    changePassword(): void {
        this.showPasswordModal = true;
        this.passwordForm.reset();
    }

    submitPasswordChange(): void {
        if (this.passwordForm.invalid) return;

        this.changingPassword = true;
        this.authService.changePassword(this.passwordForm.value).subscribe({
            next: () => {
                this.changingPassword = false;
                this.showPasswordModal = false;
                console.log('Password changed successfully');
            },
            error: (error) => {
                this.changingPassword = false;
                console.error('Failed to change password', error);
            }
        });
    }

    toggle2FA(): void {
        console.log('Toggle 2FA');
    }

    manageAPIKeys(): void {
        console.log('Manage API keys');
    }

    getActivityIcon(type: string): string {
        const icons: Record<string, string> = {
            project: 'folder',
            build: 'build',
            login: 'login',
            deploy: 'cloud_upload',
            error: 'error'
        };
        return icons[type] || 'info';
    }

    formatTime(timestamp: string): string {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }
}
