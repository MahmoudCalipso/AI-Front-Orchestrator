import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AdminService } from '../../core/services/api/admin.service';
import { ToastService } from '../../shared/services/toast.service';
import {
  UserResponseDTO,
  UserFilter,
  ProjectFilter,
  SortDirection,
  UserRole,
  ProjectStatus,
  BuildStatus,
  RunStatus
} from '../../core/models/backend';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  private toast = inject(ToastService);
  private dialog = inject(MatDialog);

  @ViewChild('userPaginator') userPaginator!: MatPaginator;
  @ViewChild('userSort') userSort!: MatSort;
  @ViewChild('projectPaginator') projectPaginator!: MatPaginator;
  @ViewChild('projectSort') projectSort!: MatSort;

  // Data
  users: UserResponseDTO[] = [];
  projects: any[] = []; // TODO: Create proper Project DTO
  filteredUsers: UserResponseDTO[] = [];
  filteredProjects: any[] = [];

  // Loading states
  usersLoading = false;
  projectsLoading = false;

  // Filters
  userFilters: UserFilter = {
    page: 1,
    page_size: 10,
    sort_by: 'created_at',
    sort_direction: SortDirection.DESC
  };

  projectFilters: ProjectFilter = {
    page: 1,
    page_size: 10,
    sort_by: 'created_at',
    sort_direction: SortDirection.DESC
  };

  // Search subjects for debouncing
  private userSearchSubject = new Subject<string>();
  private projectSearchSubject = new Subject<string>();

  // Filter options
  userRoleOptions = [
    { value: UserRole.ADMIN, label: 'Admin' },
    { value: UserRole.ENTERPRISE, label: 'Enterprise' },
    { value: UserRole.PRO_DEVELOPER, label: 'Pro Developer' },
    { value: UserRole.DEVELOPER, label: 'Developer' }
  ];

  projectStatusOptions = [
    { value: ProjectStatus.ACTIVE, label: 'Active' },
    { value: ProjectStatus.ARCHIVED, label: 'Archived' },
    { value: ProjectStatus.BUILDING, label: 'Building' },
    { value: ProjectStatus.RUNNING, label: 'Running' }
  ];

  sortOptions = [
    { value: 'created_at', label: 'Creation Date' },
    { value: 'updated_at', label: 'Last Updated' },
    { value: 'email', label: 'Email' },
    { value: 'full_name', label: 'Name' }
  ];

  systemMetrics = {
    totalUsers: 0,
    activeProjects: 0,
    systemLoad: 0,
    memoryUsage: 0
  };

  userColumns = ['full_name', 'email', 'role', 'is_active', 'created_at', 'actions'];
  projectColumns = ['project_name', 'language', 'framework', 'status', 'created_at', 'actions'];

  ngOnInit() {
    this.setupSearchDebouncing();
    this.loadUsers();
    this.loadProjects();
    this.loadSystemMetrics();
  }

  ngAfterViewInit() {
    // Set up paginators and sorters after view init
    if (this.userPaginator) {
      this.userPaginator.page.subscribe(() => this.onUserPageChange());
    }
    if (this.userSort) {
      this.userSort.sortChange.subscribe(() => this.onUserSortChange());
    }
    if (this.projectPaginator) {
      this.projectPaginator.page.subscribe(() => this.onProjectPageChange());
    }
    if (this.projectSort) {
      this.projectSort.sortChange.subscribe(() => this.onProjectSortChange());
    }
  }

  private setupSearchDebouncing() {
    this.userSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(search => {
      this.userFilters.search = search;
      this.loadUsers();
    });

    this.projectSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(search => {
      this.projectFilters.search = search;
      this.loadProjects();
    });
  }

  onUserSearch(search: string) {
    this.userSearchSubject.next(search);
  }

  onProjectSearch(search: string) {
    this.projectSearchSubject.next(search);
  }

  onUserPageChange() {
    this.userFilters.page = this.userPaginator.pageIndex + 1;
    this.userFilters.page_size = this.userPaginator.pageSize;
    this.loadUsers();
  }

  onUserSortChange() {
    this.userFilters.sort_by = this.userSort.active;
    this.userFilters.sort_direction = this.userSort.direction as SortDirection;
    this.loadUsers();
  }

  onProjectPageChange() {
    this.projectFilters.page = this.projectPaginator.pageIndex + 1;
    this.projectFilters.page_size = this.projectPaginator.pageSize;
    this.loadProjects();
  }

  onProjectSortChange() {
    this.projectFilters.sort_by = this.projectSort.active;
    this.projectFilters.sort_direction = this.projectSort.direction as SortDirection;
    this.loadProjects();
  }

  onUserFilterChange() {
    this.loadUsers();
  }

  onProjectFilterChange() {
    this.loadProjects();
  }

  loadUsers() {
    this.usersLoading = true;
    // TODO: Replace with actual API call
    // this.adminService.getUsers(this.userFilters).subscribe({
    //   next: (response) => {
    //     this.users = response.data;
    //     this.filteredUsers = [...this.users];
    //     this.usersLoading = false;
    //   },
    //   error: (error) => {
    //     this.toast.error('Failed to load users');
    //     this.usersLoading = false;
    //   }
    // });

    // Mock data for now
    setTimeout(() => {
      this.users = [
        {
          id: '1',
          email: 'john@example.com',
          full_name: 'John Doe',
          role: UserRole.DEVELOPER,
          tenant_id: 'tenant-1',
          is_active: true,
          is_verified: true,
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          email: 'jane@example.com',
          full_name: 'Jane Smith',
          role: UserRole.ADMIN,
          tenant_id: 'tenant-1',
          is_active: true,
          is_verified: true,
          created_at: '2024-01-02T00:00:00Z'
        }
      ];
      this.filteredUsers = [...this.users];
      this.usersLoading = false;
    }, 500);
  }

  loadProjects() {
    this.projectsLoading = true;
    // TODO: Replace with actual API call

    // Mock data for now
    setTimeout(() => {
      this.projects = [
        {
          id: '1',
          project_name: 'E-commerce Platform',
          user_id: '1',
          status: ProjectStatus.RUNNING,
          language: 'typescript',
          framework: 'nestjs',
          created_at: '2024-01-10T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z',
          build_status: BuildStatus.SUCCESS,
          run_status: RunStatus.RUNNING
        },
        {
          id: '2',
          project_name: 'Data Analytics API',
          user_id: '2',
          status: ProjectStatus.BUILDING,
          language: 'python',
          framework: 'fastapi',
          created_at: '2024-01-12T00:00:00Z',
          updated_at: '2024-01-14T00:00:00Z',
          build_status: BuildStatus.BUILDING,
          run_status: RunStatus.STOPPED
        }
      ];
      this.filteredProjects = [...this.projects];
      this.projectsLoading = false;
    }, 500);
  }

  loadSystemMetrics() {
    this.systemMetrics = {
      totalUsers: this.users.length,
      activeProjects: this.projects.filter(p => p.status === 'running').length,
      systemLoad: 45,
      memoryUsage: 67
    };
  }

  // Methods removed - duplicates exist below

  refreshMetrics() {
    this.loadSystemMetrics();
    this.toast.success('Metrics refreshed');
  }

  runSystemCleanup() {
    // TODO: Implement system cleanup
    this.toast.info('System cleanup functionality coming soon');
  }

  backupSystem() {
    // TODO: Implement system backup
    this.toast.info('System backup functionality coming soon');
  }

  getTotalPages(totalItems: number, pageSize: number): number {
    return Math.ceil(totalItems / pageSize) || 1;
  }

  updateUserRole(user: UserResponseDTO) {
    // TODO: Implement role update dialog
    this.toast.info('Role update functionality coming soon');
  }

  toggleUserStatus(user: UserResponseDTO) {
    user.is_active = !user.is_active;
    this.toast.success(`User ${user.is_active ? 'activated' : 'suspended'}`);
  }

  deleteUser(user: UserResponseDTO) {
    if (confirm(`Are you sure you want to delete user ${user.full_name || user.email}?`)) {
      this.users = this.users.filter(u => u.id !== user.id);
      this.filteredUsers = this.filteredUsers.filter(u => u.id !== user.id);
      this.toast.success('User deleted successfully');
    }
  }

  viewProject(project: any) {
    // TODO: Implement project details dialog
    this.toast.info('Project details view coming soon');
  }

  deleteProject(project: any) {
    if (confirm(`Are you sure you want to delete project ${project.project_name}?`)) {
      this.projects = this.projects.filter(p => p.id !== project.id);
      this.filteredProjects = this.filteredProjects.filter(p => p.id !== project.id);
      this.toast.success('Project deleted successfully');
    }
  }
}
