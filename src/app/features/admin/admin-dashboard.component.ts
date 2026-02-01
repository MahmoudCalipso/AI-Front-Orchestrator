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
  UserFilter,
  ProjectFilter,
  SortDirection,
  UserRole,
  ProjectStatus,
  BuildStatus,
  RunStatus
} from '../../core/models';
import {
  AdminUserDTO,
  AdminProjectDTO,
  AdminSystemMetricsResponse as SystemMetricsResponse
} from '../../core/models/admin/admin.model';

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
  users: AdminUserDTO[] = [];
  projects: AdminProjectDTO[] = [];
  filteredUsers: AdminUserDTO[] = [];
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
    uptime: '',
    totalProjects: 0,
    totalUsers: 0,
    activeWorkbenches: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    systemLoad: 0,
    activeProjects: 0,
    recordedActivities: 0
  };

  userColumns = ['email', 'role', 'is_active', 'created_at', 'actions'];
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
    this.adminService.getUsers({
      page: this.userFilters.page,
      page_size: this.userFilters.page_size,
      role: this.userFilters.role
    }).subscribe({
      next: (response: any) => {
        this.users = response.users;
        this.filteredUsers = [...this.users];
        this.usersLoading = false;
      },
      error: (error: any) => {
        this.toast.error('Failed to load users');
        this.usersLoading = false;
      }
    });
  }

  loadProjects() {
    this.projectsLoading = true;
    this.adminService.getProjects({
      page: this.projectFilters.page,
      page_size: this.projectFilters.page_size
    }).subscribe({
      next: (response: any) => {
        this.projects = response.projects;
        this.filteredProjects = [...this.projects];
        this.projectsLoading = false;
      },
      error: (error: any) => {
        this.toast.error('Failed to load projects');
        this.projectsLoading = false;
      }
    });
  }

  loadSystemMetrics() {
    this.adminService.getSystemMetrics().subscribe({
      next: (response) => {
        this.systemMetrics = {
          uptime: response.uptime || '00:00:00',
          totalProjects: response.total_projects,
          totalUsers: response.total_users,
          activeWorkbenches: response.active_workbenches || 0,
          recordedActivities: response.recorded_activities || 0,
          cpuUsage: response.cpu_usage || 0,
          memoryUsage: response.memory_usage || 0,
          systemLoad: response.cpu_usage || 0,
          activeProjects: response.active_workbenches || 0
        };
      },
      error: (error) => {
        this.toast.error('Failed to load system metrics');
      }
    });
  }

  // Methods removed - duplicates exist below

  refreshMetrics() {
    this.loadSystemMetrics();
    this.toast.success('Metrics refreshed');
  }

  runSystemCleanup() {
    if (confirm('Are you sure you want to run system cleanup? This may take some time.')) {
      this.adminService.runSystemCleanup().subscribe({
        next: (response: any) => {
          this.toast.success('System cleanup completed successfully');
        },
        error: (error: any) => {
          this.toast.error('System cleanup failed');
        }
      });
    }
  }

  backupSystem() {
    if (confirm('Are you sure you want to create a system backup?')) {
      this.adminService.createSystemBackup().subscribe({
        next: (response: any) => {
          this.toast.success(`System backup created successfully. Backup ID: ${response.backup_id}`);
        },
        error: (error: any) => {
          this.toast.error('System backup failed');
        }
      });
    }
  }

  getTotalPages(totalItems: number, pageSize: number): number {
    return Math.ceil(totalItems / pageSize) || 1;
  }

  updateUserRole(user: AdminUserDTO) {
    const newRole = prompt(`Update role for ${user.email}:`, user.role);
    if (newRole && newRole !== user.role) {
      this.adminService.updateUserRole(user.id, { role: newRole as any }).subscribe({
        next: (response: any) => {
          user.role = newRole;
          this.toast.success('User role updated successfully');
        },
        error: (error: any) => {
          this.toast.error('Failed to update user role');
        }
      });
    }
  }

  toggleUserStatus(user: AdminUserDTO) {
    const action = user.is_active ? 'suspend' : 'activate';
    const serviceCall = user.is_active ?
      this.adminService.suspendUser(user.id) :
      this.adminService.activateUser(user.id);

    serviceCall.subscribe({
      next: (response: any) => {
        user.is_active = !user.is_active;
        this.toast.success(`User ${user.is_active ? 'activated' : 'suspended'} successfully`);
      },
      error: (error: any) => {
        this.toast.error(`Failed to ${action} user`);
      }
    });
  }

  deleteUser(user: AdminUserDTO) {
    if (confirm(`Are you sure you want to delete user ${user.email}? This action cannot be undone.`)) {
      this.adminService.deleteUser(user.id).subscribe({
        next: (response: any) => {
          this.users = this.users.filter(u => u.id !== user.id);
          this.filteredUsers = this.filteredUsers.filter(u => u.id !== user.id);
          this.toast.success('User deleted successfully');
        },
        error: (error) => {
          this.toast.error('Failed to delete user');
        }
      });
    }
  }

  viewProject(project: AdminProjectDTO) {
    // For now, show a simple alert with project details
    // In a real app, this would open a detailed dialog/modal
    alert(`Project Details:\n\nName: ${project.project_name}\nLanguage: ${project.language}\nFramework: ${project.framework}\nStatus: ${project.status}\nCreated: ${project.created_at}\nBuild Status: ${project.build_status}\nRun Status: ${project.run_status}`);
  }

  deleteProject(project: AdminProjectDTO) {
    if (confirm(`Are you sure you want to delete project "${project.project_name}"? This action cannot be undone.`)) {
      this.adminService.deleteProject(project.id).subscribe({
        next: (response) => {
          this.projects = this.projects.filter(p => p.id !== project.id);
          this.filteredProjects = this.filteredProjects.filter(p => p.id !== project.id);
          this.toast.success('Project deleted successfully');
        },
        error: (error) => {
          this.toast.error('Failed to delete project');
        }
      });
    }
  }
}
