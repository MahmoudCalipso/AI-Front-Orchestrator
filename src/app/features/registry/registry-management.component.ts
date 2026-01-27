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
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { RegistryService } from '../../core/services/api/registry.service';
import { ToastService } from '../../shared/services/toast.service';

interface Language {
  name: string;
  version: string;
  frameworks: string[];
  package_manager: string;
  build_tool?: string;
  framework_count: number;
  description?: string;
}

interface Framework {
  name: string;
  language: string;
  version: string;
  latest_version: string;
  description: string;
  architectures?: string[];
  dependencies?: string[];
  templates?: string[];
  best_practices?: string[];
}

interface RegistryInfo {
  last_updated: string;
  total_languages: number;
  total_frameworks: number;
  version: string;
}

@Component({
  selector: 'app-registry-management',
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
    MatChipsModule,
    MatExpansionModule,
    MatTooltipModule
  ],
  templateUrl: './registry-management.component.html',
  styleUrls: ['./registry-management.component.scss']
})
export class RegistryManagementComponent implements OnInit {
  private registryService = inject(RegistryService);
  private toast = inject(ToastService);
  private dialog = inject(MatDialog);

  @ViewChild('languagePaginator') languagePaginator!: MatPaginator;
  @ViewChild('languageSort') languageSort!: MatSort;
  @ViewChild('frameworkPaginator') frameworkPaginator!: MatPaginator;
  @ViewChild('frameworkSort') frameworkSort!: MatSort;

  // Data
  languages: Language[] = [];
  frameworks: Framework[] = [];
  frameworksByLanguage: { [language: string]: Framework[] } = {};
  registryInfo: RegistryInfo | null = null;

  // UI state
  selectedLanguage: string | null = null;
  showFrameworksView = false;

  // Filtered data
  filteredLanguages: Language[] = [];
  filteredFrameworks: Framework[] = [];

  // Loading states
  languagesLoading = false;
  frameworksLoading = false;
  syncLoading = false;

  // Filters
  languageFilters = {
    search: '',
    page: 1,
    page_size: 10,
    sort_by: 'name',
    sort_direction: 'asc' as 'asc' | 'desc'
  };

  frameworkFilters = {
    search: '',
    language: '',
    page: 1,
    page_size: 10,
    sort_by: 'name',
    sort_direction: 'asc' as 'asc' | 'desc'
  };

  // Search subjects for debouncing
  private languageSearchSubject = new Subject<string>();
  private frameworkSearchSubject = new Subject<string>();

  // Table columns
  languageColumns = ['name', 'version', 'framework_count', 'package_manager', 'actions'];
  frameworkColumns = ['name', 'language', 'version', 'latest_version', 'description', 'actions'];

  ngOnInit() {
    this.setupSearchDebouncing();
    this.loadRegistryInfo();
    this.loadLanguages();
    this.loadFrameworks();
  }

  ngAfterViewInit() {
    // Set up paginators and sorters after view init
    setTimeout(() => {
      if (this.languagePaginator) {
        this.languagePaginator.page.subscribe(() => this.onLanguagePageChange());
      }
      if (this.languageSort) {
        this.languageSort.sortChange.subscribe(() => this.onLanguageSortChange());
      }
      if (this.frameworkPaginator) {
        this.frameworkPaginator.page.subscribe(() => this.onFrameworkPageChange());
      }
      if (this.frameworkSort) {
        this.frameworkSort.sortChange.subscribe(() => this.onFrameworkSortChange());
      }
    });
  }

  private setupSearchDebouncing() {
    this.languageSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(search => {
      this.languageFilters.search = search;
      this.loadLanguages();
    });

    this.frameworkSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(search => {
      this.frameworkFilters.search = search;
      this.loadFrameworks();
    });
  }

  onLanguageSearch(search: string) {
    this.languageSearchSubject.next(search);
  }

  onFrameworkSearch(search: string) {
    this.frameworkSearchSubject.next(search);
  }

  onLanguagePageChange() {
    this.languageFilters.page = this.languagePaginator.pageIndex + 1;
    this.languageFilters.page_size = this.languagePaginator.pageSize;
    this.loadLanguages();
  }

  onLanguageSortChange() {
    this.languageFilters.sort_by = this.languageSort.active;
    this.languageFilters.sort_direction = this.languageSort.direction as 'asc' | 'desc';
    this.loadLanguages();
  }

  onFrameworkPageChange() {
    this.frameworkFilters.page = this.frameworkPaginator.pageIndex + 1;
    this.frameworkFilters.page_size = this.frameworkPaginator.pageSize;
    this.loadFrameworks();
  }

  onFrameworkSortChange() {
    this.frameworkFilters.sort_by = this.frameworkSort.active;
    this.frameworkFilters.sort_direction = this.frameworkSort.direction as 'asc' | 'desc';
    this.loadFrameworks();
  }

  onFrameworkLanguageFilterChange() {
    this.loadFrameworks();
  }

  loadRegistryInfo() {
    this.registryService.getRegistryInfo().subscribe({
      next: (info) => {
        this.registryInfo = info;
      },
      error: (err) => {
        console.error('Failed to load registry info:', err);
      }
    });
  }

  loadLanguages() {
    this.languagesLoading = true;
    this.registryService.getLanguages().subscribe({
      next: (response) => {
        this.languages = (response.languages || []).map(lang => ({
          ...lang,
          framework_count: lang.frameworks?.length || 0
        }));
        this.filteredLanguages = [...this.languages];
        this.languagesLoading = false;
      },
      error: (error) => {
        this.toast.error('Failed to load languages');
        this.languagesLoading = false;
      }
    });
  }

  loadFrameworks() {
    this.frameworksLoading = true;

    this.registryService.getAllFrameworks().subscribe({
      next: (response) => {
        this.frameworksByLanguage = {};
        this.frameworks = [];

        // Transform backend data structure to component format
        const data = response.data || {};
        Object.keys(data).forEach(language => {
          this.frameworksByLanguage[language] = [];
          const frameworksForLang = data[language] || {};
          Object.keys(frameworksForLang).forEach(framework => {
            const fwData = frameworksForLang[framework];
            const frameworkObj: Framework = {
              name: framework,
              language: language,
              version: fwData.latest_version || fwData.version || 'Unknown',
              latest_version: fwData.latest_version || fwData.version || 'Unknown',
              description: fwData.description || 'No description available',
              architectures: fwData.architectures,
              dependencies: fwData.required_packages || fwData.dependencies,
              templates: fwData.templates,
              best_practices: fwData.best_practices
            };
            this.frameworksByLanguage[language].push(frameworkObj);
            this.frameworks.push(frameworkObj);
          });
        });

        this.filteredFrameworks = [...this.frameworks];
        this.frameworksLoading = false;
      },
      error: (error) => {
        this.toast.error('Failed to load frameworks');
        this.frameworksLoading = false;
      }
    });
  }

  syncRegistry() {
    this.syncLoading = true;
    this.registryService.updateRegistry().subscribe({
      next: (response) => {
        this.toast.success(`Registry updated: ${response.updated_count} items`);
        this.loadRegistryInfo();
        this.loadLanguages();
        this.loadFrameworks();
        this.syncLoading = false;
      },
      error: (error) => {
        this.toast.error('Failed to sync registry');
        this.syncLoading = false;
      }
    });
  }

  viewLanguageDetails(language: Language) {
    this.toast.info(`Language details: ${language.name} v${language.version}`);
  }

  viewFrameworkDetails(framework: Framework) {
    this.toast.info(`Framework details: ${framework.name} (${framework.language})`);
  }

  selectLanguage(language: Language) {
    this.selectedLanguage = language.name;
    this.showFrameworksView = true;
    this.loadFrameworksForLanguage(language.name);
  }

  backToLanguages() {
    this.selectedLanguage = null;
    this.showFrameworksView = false;
    this.filteredFrameworks = [];
  }

  loadFrameworksForLanguage(languageName: string) {
    this.frameworksLoading = true;

    // Get frameworks for the selected language
    const frameworks = this.frameworksByLanguage[languageName] || [];
    this.filteredFrameworks = [...frameworks];
    this.frameworksLoading = false;
  }

  getLanguageOptions(): string[] {
    return this.languages.map(lang => lang.name);
  }
}
