import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/auth/login.component';
import { ProjectGenerationComponent } from './components/project-generation/project-generation.component';
import { ProjectMigrationComponent } from './components/project-migration/project-migration.component';
import { ProjectAnalysisComponent } from './components/project-analysis/project-analysis.component';
import { IdeComponent } from './components/ide/ide.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'generate', component: ProjectGenerationComponent },
  { path: 'migrate', component: ProjectMigrationComponent },
  { path: 'analyze', component: ProjectAnalysisComponent },
  { path: 'ide', component: IdeComponent },
  { path: 'profile', component: UserProfileComponent },
];
