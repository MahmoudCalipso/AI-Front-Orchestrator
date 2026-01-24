import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
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
        MatProgressBarModule
    ],
    template: `
    <div class="search-window">
      <div class="window-header">
        <span>SEARCH</span>
      </div>
      
      <div class="search-controls">
        <mat-form-field appearance="outline" class="search-input">
          <input matInput [(ngModel)]="query" (keyup.enter)="performSearch()" placeholder="Search" #searchInput>
          <mat-icon matSuffix (click)="performSearch()">search</mat-icon>
        </mat-form-field>

        <div class="search-options">
          <button mat-icon-button [class.active]="matchCase()" (click)="matchCase.set(!matchCase())" matTooltip="Match Case">
            <span class="icon-label">Aa</span>
          </button>
          <button mat-icon-button [class.active]="wholeWord()" (click)="wholeWord.set(!wholeWord())" matTooltip="Whole Word">
            <span class="icon-label"><u>ab</u></span>
          </button>
        </div>
      </div>

      @if (searching()) {
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      }

      <div class="search-results">
        @if (results().length > 0) {
          <div class="results-header">{{ results().length }} results in {{ resultsByFile().length }} files</div>
          
          @for (fileGroup of resultsByFile(); track fileGroup.path) {
            <div class="file-group">
                <div class="file-header" (click)="toggleFile(fileGroup.path)">
                    <mat-icon>{{ isExpanded(fileGroup.path) ? 'expand_more' : 'chevron_right' }}</mat-icon>
                    <mat-icon class="file-icon">description</mat-icon>
                    <span>{{ fileGroup.name }}</span>
                    <span class="count-badge">{{ fileGroup.matches.length }}</span>
                </div>
                
                @if (isExpanded(fileGroup.path)) {
                    <div class="matches-list">
                        @for (match of fileGroup.matches; track match.id) {
                            <div class="match-item" (click)="selectMatch(match)">
                                <span class="line-num">{{ match.line }}:</span>
                                <span class="line-content" [innerHTML]="highlightMatch(match.content)"></span>
                            </div>
                        }
                    </div>
                }
            </div>
          }
        } @else if (query() && !searching()) {
          <div class="no-results">No results found for "{{ query() }}"</div>
        }
      </div>
    </div>
  `,
    styles: [`
    .search-window {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: #1e1e1e;
      color: #cccccc;
    }
    .window-header {
      padding: 10px 15px;
      font-size: 11px;
      font-weight: 600;
      color: #969696;
      border-bottom: 1px solid #333;
    }
    .search-controls {
      padding: 15px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .search-input {
      width: 100%;
      ::ng-deep .mat-mdc-form-field-container {
        background: #3c3c3c;
      }
    }
    .search-options {
      display: flex;
      gap: 5px;
      button {
        width: 24px;
        height: 24px;
        line-height: 24px;
        border-radius: 4px;
        &.active {
          background: #007acc;
          color: white;
        }
      }
      .icon-label { font-size: 12px; font-weight: 700; }
    }
    .search-results {
      flex: 1;
      overflow-y: auto;
      padding: 0 5px;
    }
    .results-header {
        padding: 5px 10px;
        font-size: 12px;
        opacity: 0.7;
    }
    .file-group {
        margin-bottom: 2px;
    }
    .file-header {
        display: flex;
        align-items: center;
        padding: 4px 5px;
        cursor: pointer;
        &:hover { background: #2a2d2e; }
        mat-icon { font-size: 18px; width: 18px; height: 18px; margin-right: 5px; }
        .file-icon { color: #519aba; }
        span { flex: 1; font-size: 13px; overflow: hidden; text-overflow: ellipsis; }
        .count-badge {
            background: #4d4d4d;
            border-radius: 10px;
            padding: 0 6px;
            font-size: 11px;
            color: #fff;
        }
    }
    .matches-list {
        padding-left: 20px;
    }
    .match-item {
        padding: 3px 5px;
        font-size: 12px;
        font-family: 'JetBrains Mono', monospace;
        cursor: pointer;
        display: flex;
        gap: 10px;
        white-space: nowrap;
        overflow: hidden;
        &:hover { background: #2a2d2e; }
        .line-num { color: #858585; min-width: 25px; text-align: right; }
        .line-content { 
            color: #cccccc;
            ::ng-deep b { background: #613214; color: #fff; }
        }
    }
    .no-results {
      padding: 20px;
      text-align: center;
      opacity: 0.6;
    }
  `]
})
export class SearchWindowComponent {
    private ideService = inject(IDEService);

    @Input() workspaceId!: string;
    @Output() openFile = new EventEmitter<any>();

    query = signal('');
    matchCase = signal(false);
    wholeWord = signal(false);
    searching = signal(false);
    results = signal<any[]>([]);
    expandedFiles = signal<Set<string>>(new Set());

    performSearch() {
        if (!this.query()) return;

        this.searching.set(true);
        this.ideService.searchFiles(this.workspaceId, this.query()).subscribe({
            next: (data: any) => {
                this.results.set(data.matches || []);
                this.searching.set(false);
                // Auto expand first few files
                const files = [...new Set(data.matches.map((m: any) => m.path))].slice(0, 3) as string[];
                this.expandedFiles.set(new Set(files));
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
        const current = this.expandedFiles();
        if (current.has(path)) {
            current.delete(path);
        } else {
            current.add(path);
        }
        this.expandedFiles.set(new Set(current));
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
        const regex = new RegExp(`(${this.query()})`, this.matchCase() ? 'g' : 'gi');
        return content.replace(regex, '<b>$1</b>');
    }
}
