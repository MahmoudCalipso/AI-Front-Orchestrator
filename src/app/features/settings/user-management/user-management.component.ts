import { Component, OnInit, inject, signal } from '@angular/core';
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
import { User } from '../../../core/models';

@Component({
    selector: 'app-user-management',
    standalone: true,
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
    private fb = inject(FormBuilder);

    users = signal<User[]>([]);
    loading = signal(false);
    displayedColumns = ['username', 'email', 'role', 'permissions', 'status', 'actions'];

    userForm!: FormGroup;
    editingUser = signal<User | null>(null);

    roles = ['admin', 'developer', 'viewer'];
    availablePermissions = [
        'project.create', 'project.read', 'project.update', 'project.delete',
        'deployment.create', 'deployment.read', 'deployment.update', 'deployment.delete',
        'user.manage', 'settings.manage'
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
        this.loading.set(true);
        this.authService.listUsers().subscribe({
            next: (users: any[]) => {
                this.users.set(users.map(u => ({
                    id: u.user_id || u.id,
                    username: u.username,
                    email: u.email,
                    role: u.role || 'viewer',
                    permissions: u.permissions || [],
                    created_at: u.created_at,
                    is_active: u.is_active !== undefined ? u.is_active : true
                }) as any as User));
                this.loading.set(false);
            },
            error: (error) => {
                this.loading.set(false);
                this.toast.error('Failed to load users');
                this.users.set([]);
            }
        });
    }

    createUser(): void {
        if (this.userForm.invalid) return;
        this.authService.register(this.userForm.value).subscribe({
            next: () => {
                this.toast.success('User created successfully');
                this.loadUsers();
                this.resetForm();
            },
            error: () => this.toast.error('Failed to create user')
        });
    }

    editUser(user: User): void {
        this.editingUser.set(user);
        this.userForm.patchValue(user);
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();
    }

    updateUser(): void {
        if (this.userForm.invalid || !this.editingUser()) return;
        this.authService.updateUser(this.editingUser()!.id, this.userForm.value).subscribe({
            next: () => {
                this.toast.success('User updated successfully');
                this.loadUsers();
                this.resetForm();
            },
            error: () => this.toast.error('Failed to update user')
        });
    }

    deleteUser(user: User): void {
        if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
            this.authService.deleteUser(user.id).subscribe({
                next: () => {
                    this.toast.success('User deleted successfully');
                    this.loadUsers();
                },
                error: () => this.toast.error('Failed to delete user')
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
            error: () => this.toast.error('Failed to update user status')
        });
    }

    resetForm(): void {
        this.editingUser.set(null);
        this.userForm.reset({ role: 'developer', permissions: [], is_active: true });
        this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
        this.userForm.get('password')?.updateValueAndValidity();
    }

    getRoleBadgeClass(role: string): string {
        const classes: Record<string, string> = { 'admin': 'badge-error', 'developer': 'badge-primary', 'viewer': 'badge-info' };
        return classes[role] || 'badge-info';
    }
}
