import { Component, Input, OnInit, OnChanges, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GitStore } from '../../../core/store/git/git.store';

interface CommitNode {
  id: string;
  message: string;
  author: string;
  date: string;
  branch: string;
  parents: string[];
  x: number;
  y: number;
  color: string;
}

interface BranchLine {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
}

@Component({
  selector: 'app-branch-visualizer',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule
  ],
  template: `
    <div class="branch-visualizer">
      <div class="visualizer-header">
        <h3>Branch Visualization</h3>
        <div class="branch-legend">
          @for (branch of branches(); track branch.name) {
            <div class="legend-item">
              <span class="legend-color" [style.background-color]="branch.color"></span>
              <span class="legend-name">{{ branch.name }}</span>
            </div>
          }
        </div>
      </div>

      <div class="graph-container">
        <svg [attr.viewBox]="'0 0 ' + svgWidth + ' ' + svgHeight" class="commit-graph">
          <!-- Branch lines -->
          @for (line of branchLines(); track $index) {
            <line
              [attr.x1]="line.from.x"
              [attr.y1]="line.from.y"
              [attr.x2]="line.to.x"
              [attr.y2]="line.to.y"
              [attr.stroke]="line.color"
              stroke-width="2"
              fill="none"
            />
          }

          <!-- Commit nodes -->
          @for (commit of commitNodes(); track commit.id) {
            <g class="commit-node" [attr.transform]="'translate(' + commit.x + ',' + commit.y + ')'">
              <circle
                r="8"
                [attr.fill]="commit.color"
                stroke="white"
                stroke-width="2"
                class="commit-circle"
              />
              <text
                x="15"
                y="5"
                class="commit-message"
                [attr.title]="commit.message"
              >
                {{ commit.message | slice:0:40 }}{{ commit.message.length > 40 ? '...' : '' }}
              </text>
              <text
                x="15"
                y="20"
                class="commit-meta"
              >
                {{ commit.author }} · {{ commit.date | date:'short' }}
              </text>
            </g>
          }
        </svg>
      </div>

      <!-- Commit details panel -->
      @if (selectedCommit()) {
        <div class="commit-details">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Commit Details</mat-card-title>
              <button mat-icon-button (click)="selectedCommit.set(null)">
                <mat-icon>close</mat-icon>
              </button>
            </mat-card-header>
            <mat-card-content>
              <div class="detail-row">
                <span class="detail-label">Hash:</span>
                <code>{{ selectedCommit()!.id }}</code>
              </div>
              <div class="detail-row">
                <span class="detail-label">Message:</span>
                <span>{{ selectedCommit()!.message }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Author:</span>
                <span>{{ selectedCommit()!.author }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span>{{ selectedCommit()!.date | date:'medium' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Branch:</span>
                <mat-chip [style.background-color]="selectedCommit()!.color">
                  {{ selectedCommit()!.branch }}
                </mat-chip>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      }

      <!-- Controls -->
      <div class="visualizer-controls">
        <button mat-icon-button (click)="zoomIn()" matTooltip="Zoom In">
          <mat-icon>zoom_in</mat-icon>
        </button>
        <button mat-icon-button (click)="zoomOut()" matTooltip="Zoom Out">
          <mat-icon>zoom_out</mat-icon>
        </button>
        <button mat-icon-button (click)="resetZoom()" matTooltip="Reset">
          <mat-icon>center_focus_strong</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .branch-visualizer {
      display: flex;
      flex-direction: column;
      height: 100%;
      background-color: #fafafa;
      border-radius: 8px;
      overflow: hidden;
    }

    .visualizer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
      background-color: white;

      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
      }

      .branch-legend {
        display: flex;
        gap: 16px;

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;

          .legend-color {
            width: 12px;
            height: 12px;
            border-radius: 50%;
          }

          .legend-name {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.6);
          }
        }
      }
    }

    .graph-container {
      flex: 1;
      overflow: auto;
      padding: 24px;

      .commit-graph {
        min-width: 100%;
        min-height: 100%;

        .commit-node {
          cursor: pointer;

          &:hover .commit-circle {
            r: 10;
          }

          .commit-message {
            font-size: 12px;
            fill: rgba(0, 0, 0, 0.87);
          }

          .commit-meta {
            font-size: 10px;
            fill: rgba(0, 0, 0, 0.54);
          }
        }
      }
    }

    .commit-details {
      position: absolute;
      bottom: 16px;
      right: 16px;
      width: 350px;
      z-index: 100;

      mat-card {
        mat-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
        }

        mat-card-content {
          padding: 16px;

          .detail-row {
            display: flex;
            margin-bottom: 12px;

            .detail-label {
              width: 80px;
              color: rgba(0, 0, 0, 0.6);
              font-size: 12px;
            }

            code {
              background-color: #f5f5f5;
              padding: 2px 6px;
              border-radius: 4px;
              font-family: monospace;
              font-size: 12px;
            }
          }
        }
      }
    }

    .visualizer-controls {
      display: flex;
      gap: 8px;
      padding: 8px 16px;
      border-top: 1px solid #e0e0e0;
      background-color: white;
    }
  `]
})
export class BranchVisualizerComponent implements OnInit, OnChanges {
  private readonly gitStore = inject(GitStore);

  @Input() repoId: string = '';
  @Input() localPath: string = '';

  readonly selectedCommit = signal<CommitNode | null>(null);
  readonly zoom = signal(1);

  readonly svgWidth = 800;
  readonly svgHeight = 600;

  // Colors for different branches
  private readonly branchColors = [
    '#1976d2', // Blue
    '#4caf50', // Green
    '#ff9800', // Orange
    '#9c27b0', // Purple
    '#f44336', // Red
    '#00bcd4', // Cyan
    '#795548', // Brown
    '#607d8b'  // Grey
  ];

  readonly branches = computed(() => {
    const branches = this.gitStore.branches();
    if (!branches) return [];

    return branches.branches.map((b, index) => ({
      name: b.name,
      color: this.branchColors[index % this.branchColors.length]
    }));
  });

  readonly commitNodes = computed<CommitNode[]>(() => {
    const history = this.gitStore.history();
    if (!history) return [];

    const commits = history.commits;
    const nodes: CommitNode[] = [];
    const branchPositions = new Map<string, number>();

    commits.forEach((commit, index) => {
      // Determine branch color
      let branchName = 'main';
      const branch = this.branches().find(b => commit.message.includes(b.name));
      if (branch) {
        branchName = branch.name;
      }

      if (!branchPositions.has(branchName)) {
        branchPositions.set(branchName, branchPositions.size);
      }

      const branchIndex = branchPositions.get(branchName) || 0;
      const color = this.branchColors[branchIndex % this.branchColors.length];

      nodes.push({
        id: commit.hash,
        message: commit.message,
        author: commit.author,
        date: commit.date,
        branch: branchName,
        parents: commit.parents || [],
        x: 50 + (branchIndex * 60),
        y: 50 + (index * 50),
        color
      });
    });

    return nodes;
  });

  readonly branchLines = computed<BranchLine[]>(() => {
    const nodes = this.commitNodes();
    const lines: BranchLine[] = [];

    nodes.forEach((node, index) => {
      // Connect to parent commits
      node.parents.forEach(parentId => {
        const parentNode = nodes.find(n => n.id === parentId);
        if (parentNode) {
          lines.push({
            from: { x: parentNode.x, y: parentNode.y },
            to: { x: node.x, y: node.y },
            color: node.color
          });
        }
      });

      // Connect to next commit in same branch
      if (index < nodes.length - 1) {
        const nextNode = nodes[index + 1];
        if (nextNode.branch === node.branch) {
          lines.push({
            from: { x: node.x, y: node.y },
            to: { x: nextNode.x, y: nextNode.y },
            color: node.color
          });
        }
      }
    });

    return lines;
  });

  ngOnInit(): void {
    if (this.repoId && this.localPath) {
      this.loadHistory();
    }
  }

  ngOnChanges(): void {
    if (this.repoId && this.localPath) {
      this.loadHistory();
    }
  }

  private loadHistory(): void {
    this.gitStore.loadHistory({
      repoId: this.repoId,
      localPath: this.localPath,
      limit: 50
    });
  }

  zoomIn(): void {
    this.zoom.update(z => Math.min(z * 1.2, 3));
  }

  zoomOut(): void {
    this.zoom.update(z => Math.max(z / 1.2, 0.5));
  }

  resetZoom(): void {
    this.zoom.set(1);
  }
}
