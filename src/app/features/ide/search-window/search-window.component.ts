import { Component, Input, Output, EventEmitter, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IDEService } from '../../../core/services/api/ide.service';

@Component({
  selector: 'app-search-window',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatTooltipModule
  ],
  templateUrl: './search-window.component.html',
  styleUrls: ['./search-window.component.scss']
})
export class SearchWindowComponent {
  private ideService = inject(IDEService);

  @Input() workspaceId!: string;
  @Output() openFile = new EventEmitter<any>();

  query = signal('');
  matchCase = signal(false);
  wholeWord = signal(false);
  useRegex = signal(false);

  // Advanced Filters
  showFilters = false;
  includePattern = '';
  excludePattern = '';

  searching = signal(false);
  results = signal<any[]>([]);
  expandedFiles = signal<Set<string>>(new Set());

  // Computed
  filteredResultsCount = computed(() => {
    return this.results().length;
  });

  performSearch() {
    if (!this.query()) return;

    this.searching.set(true);
    // In a real backend, we would pass include/exclude patterns here
    // For now, we might filter client-side or assume backend logic handles it
    // Simulating the backend request payload
    const searchPayload = {
      query: this.query(),
      caseSensitive: this.matchCase(),
      wholeWord: this.wholeWord(),
      regex: this.useRegex(),
      include: this.includePattern,
      exclude: this.excludePattern
    };

    // Note: IDEService searchFiles signature might need adjustment to accept payload object if not already
    // Assuming simplistic string for now, but in ready-state we'd pass config
    this.ideService.searchFiles(this.workspaceId, this.query()).subscribe({
      next: (data: any) => {
        let matches = data.matches || [];

        // Client-side filtering simulation if backend doesn't support it yet
        if (this.excludePattern) {
          matches = matches.filter((m: any) => !m.path.includes(this.excludePattern));
        }

        this.results.set(matches);
        this.searching.set(false);

        // Auto expand all if reasonable size
        const files = [...new Set(matches.map((m: any) => m.path))] as string[];
        if (files.length < 10) {
          this.expandedFiles.set(new Set(files));
        } else {
          this.expandedFiles.set(new Set(files.slice(0, 3)));
        }
      },
      error: () => {
        this.searching.set(false);
        this.results.set([]);
      }
    });
  }

  resultsByFile() {
    const groups: any[] = [];
    this.results().forEach(match => {
      let group = groups.find(g => g.path === match.path);
      if (!group) {
        group = {
          path: match.path,
          name: match.path.split('/').pop(),
          matches: []
        };
        groups.push(group);
      }
      group.matches.push(match);
    });
    return groups;
  }

  isExpanded(path: string) {
    return this.expandedFiles().has(path);
  }

  toggleFile(path: string) {
    const current = new Set(this.expandedFiles());
    if (current.has(path)) {
      current.delete(path);
    } else {
      current.add(path);
    }
    this.expandedFiles.set(current);
  }

  collapseAll() {
    this.expandedFiles.set(new Set());
  }

  toggleMatchCase() { this.matchCase.update(v => !v); }
  toggleWholeWord() { this.wholeWord.update(v => !v); }
  toggleRegex() { this.useRegex.update(v => !v); }

  clearSearch() {
    this.query.set('');
    this.results.set([]);
  }

  selectMatch(match: any) {
    this.openFile.emit({
      path: match.path,
      name: match.path.split('/').pop(),
      line: match.line,
      isDirectory: false
    });
  }

  highlightMatch(content: string) {
    if (!this.query()) return content;
    try {
      let pattern = this.query();
      let flags = 'gi';

      if (this.useRegex()) {
        // Use input as regex
      } else {
        // Escape special regex chars
        pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (this.wholeWord()) {
          pattern = `\\b${pattern}\\b`;
        }
      }

      if (this.matchCase()) flags = 'g';

      const regex = new RegExp(`(${pattern})`, flags);
      return content.replace(regex, '<b>$1</b>');
    } catch (e) {
      return content; // Fallback if regex invalid
    }
  }
}
