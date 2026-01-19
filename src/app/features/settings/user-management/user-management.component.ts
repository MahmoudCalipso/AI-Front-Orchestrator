import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../core/services/api/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    permissions: string[];
    created_at: string;
    is_active: boolean;
}

@Component({
    selector: 'app-user-management',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatChipsModule,
        MatDialogModule,
        MatCheckboxModule,
        MatTooltipModule,
        LoadingSpinnerComponent
    ],
    templateUrl: './user-management.component.html',
    styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
    private authService = inject(AuthService);
    private toast = inject(ToastService);
    private dialog = inject(MatDialog);
    private fb = inject(FormBuilder);

    users: User[] = [];
    loading = false;
    displayedColumns = ['username', 'email', 'role', 'permissions', 'status', 'actions'];

    userForm!: FormGroup;
    editingUser: User | null = null;

    roles = ['admin', 'developer', 'viewer'];
    availablePermissions = [
        'project.create',
        'project.read',
        'project.update',
        'project.delete',
        'deployment.create',
        'deployment.read',
        'deployment.update',
        'deployment.delete',
        'user.manage',
        'settings.manage'
    ];

    ngOnInit(): void {
        this.initializeForm();
        this.loadUsers();
    }

    initializeForm(): void {
        this.userForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            role: ['developer', Validators.required],
            permissions: [[]],
            is_active: [true]
        });
    }

    loadUsers(): void {
        this.loading = true;
        this.authService.listUsers().subscribe({
            next: (users: any[]) => {
                this.users = users.map(u => ({
                    id: u.user_id || u.id,
                    username: u.username,
                    email: u.email,
                    role: u.role || 'viewer',
                    permissions: u.permissions || [],
                    created_at: u.created_at,
                    is_active: u.is_active !== undefined ? u.is_active : true
                }));
                this.loading = false;
            },
            error: (error) => {
                console.error('Failed to load users from API:', error);
                this.loading = false;
                this.toast.error('Failed to load users. Please check your connection to the backend.');
                this.users = [];
            }
        });
    }

    createUser(): void {
        if (this.userForm.invalid) return;

        const userData = this.userForm.value;
        this.authService.register(userData).subscribe({
            next: (user) => {
                this.toast.success('User created successfully');
                this.loadUsers();
                this.resetForm();
            },
            error: (error) => {
                this.toast.error('Failed to create user');
            }
        });
    }

    editUser(user: User): void {
        this.editingUser = user;
        this.userForm.patchValue({
            username: user.username,
            email: user.email,
            role: user.role,
            permissions: user.permissions,
            is_active: user.is_active
        });
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();
    }

    updateUser(): void {
        if (this.userForm.invalid || !this.editingUser) return;

        const userData = this.userForm.value;
        this.authService.updateUser(this.editingUser.id, userData).subscribe({
            next: () => {
                this.toast.success('User updated successfully');
                this.loadUsers();
                this.resetForm();
            },
            error: (error) => {
                this.toast.error('Failed to update user');
            }
        });
    }

    deleteUser(user: User): void {
        if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
            this.authService.deleteUser(user.id).subscribe({
                next: () => {
                    this.toast.success('User deleted successfully');
                    this.loadUsers();
                },
                error: (error) => {
                    this.toast.error('Failed to delete user');
                }
            });
        }
    }

    toggleUserStatus(user: User): void {
        const newStatus = !user.is_active;
        this.authService.updateUser(user.id, { is_active: newStatus }).subscribe({
            next: () => {
                this.toast.success(`User ${newStatus ? 'activated' : 'deactivated'}`);
                this.loadUsers();
            },
            error: (error) => {
                this.toast.error('Failed to update user status');
            }
        });
    }

    resetForm(): void {
        this.editingUser = null;
        this.userForm.reset({
            role: 'developer',
            permissions: [],
            is_active: true
        });
        this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
        this.userForm.get('password')?.updateValueAndValidity();
    }

    getRoleBadgeClass(role: string): string {
        const classes: { [key: string]: string } = {
            'admin': 'badge-error',
            'developer': 'badge-primary',
            'viewer': 'badge-info'
        };
        return classes[role] || 'badge-info';
    }
}
