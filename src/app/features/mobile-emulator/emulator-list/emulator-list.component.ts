import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil, interval } from 'rxjs';
import { EmulatorService } from '../../../core/services/api/emulator.service';
import { EmulatorResponseDTO, EmulatorStatus, DeviceType } from '../../../core/models/emulator/emulator.model';

@Component({
  selector: 'app-emulator-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="emulator-list">
      <div class="list-header">
        <h3>Active Emulators</h3>
        <div class="header-actions">
          <button mat-icon-button (click)="refreshEmulators()" matTooltip="Refresh">
            <mat-icon>refresh</mat-icon>
          </button>
          <button mat-raised-button color="primary" routerLink="/emulator/launch">
            <mat-icon>add</mat-icon>
            New Emulator
          </button>
        </div>
      </div>

      @if (isLoading()) {
        <div class="loading-state">
          <mat-spinner diameter="40"></mat-spinner>
          <span>Loading emulators...</span>
        </div>
      }

      <div class="emulators-grid">
        @for (emulator of emulators(); track emulator.emulator_id) {
          <mat-card class="emulator-card" [class]="'status-' + emulator.status">
            <mat-card-header>
              <mat-icon mat-card-avatar [class]="getDeviceIcon(emulator.device_config.device_type)">
                {{ getDeviceIcon(emulator.device_config.device_type) }}
              </mat-icon>
              <mat-card-title>{{ emulator.device_config.device_name }}</mat-card-title>
              <mat-card-subtitle>
                {{ emulator.device_config.screen_width }}×{{ emulator.device_config.screen_height }} ·
                {{ emulator.device_config.os_version }}
              </mat-card-subtitle>
            </mat-card-header>

            <mat-card-content>
              <div class="emulator-preview">
                @if (emulator.preview_url) {
                  <img [src]="emulator.preview_url" alt="Emulator Preview" class="preview-image">
                } @else {
                  <div class="preview-placeholder">
                    <mat-icon>phone_android</mat-icon>
                    <span>No preview available</span>
                  </div>
                }
              </div>

              <div class="emulator-status">
                <mat-chip [color]="getStatusColor(emulator.status)">
                  {{ emulator.status }}
                </mat-chip>
                <span class="start-time">Started {{ emulator.started_at | date:'short' }}</span>
              </div>

              @if (emulator.error_message) {
                <div class="error-message">
                  <mat-icon>error</mat-icon>
                  <span>{{ emulator.error_message }}</span>
                </div>
              }
            </mat-card-content>

            <mat-card-actions>
              @switch (emulator.status) {
                @case ('running') {
                  <button mat-button (click)="pauseEmulator(emulator.emulator_id)">
                    <mat-icon>pause</mat-icon>
                    Pause
                  </button>
                  <button mat-button (click)="takeScreenshot(emulator.emulator_id)">
                    <mat-icon>camera_alt</mat-icon>
                    Screenshot
                  </button>
                  <button mat-button color="warn" (click)="stopEmulator(emulator.emulator_id)">
                    <mat-icon>stop</mat-icon>
                    Stop
                  </button>
                }
                @case ('paused') {
                  <button mat-button color="primary" (click)="resumeEmulator(emulator.emulator_id)">
                    <mat-icon>play_arrow</mat-icon>
                    Resume
                  </button>
                  <button mat-button color="warn" (click)="stopEmulator(emulator.emulator_id)">
                    <mat-icon>stop</mat-icon>
                    Stop
                  </button>
                }
                @default {
                  <button mat-button (click)="removeEmulator(emulator.emulator_id)">
                    <mat-icon>delete</mat-icon>
                    Remove
                  </button>
                }
              }
            </mat-card-actions>
          </mat-card>
        }
        @empty {
          @if (!isLoading()) {
            <div class="empty-state">
              <mat-icon>phone_android</mat-icon>
              <h4>No Active Emulators</h4>
              <p>Launch a new emulator to get started</p>
              <button mat-raised-button color="primary" routerLink="/emulator/launch">
                <mat-icon>add</mat-icon>
                Launch Emulator
              </button>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .emulator-list {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      h3 {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
      }

      .header-actions {
        display: flex;
        gap: 12px;
        align-items: center;
      }
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px;
      color: rgba(0, 0, 0, 0.6);

      span {
        margin-top: 16px;
      }
    }

    .emulators-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .emulator-card {
      &.status-running {
        border-top: 3px solid #4caf50;
      }

      &.status-paused {
        border-top: 3px solid #ff9800;
      }

      &.status-error {
        border-top: 3px solid #f44336;
      }

      &.status-starting {
        border-top: 3px solid #2196f3;
      }

      mat-card-header {
        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;

          &.phone_iphone {
            color: #1976d2;
          }

          &.phone_android {
            color: #4caf50;
          }

          &.tablet {
            color: #ff9800;
          }
        }
      }

      mat-card-content {
        .emulator-preview {
          height: 200px;
          background-color: #f5f5f5;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 16px;

          .preview-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }

          .preview-placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: rgba(0, 0, 0, 0.38);

            mat-icon {
              font-size: 48px;
              width: 48px;
              height: 48px;
              margin-bottom: 8px;
            }
          }
        }

        .emulator-status {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .start-time {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.6);
          }
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
          padding: 8px 12px;
          background-color: #ffebee;
          border-radius: 4px;
          color: #c62828;
          font-size: 12px;

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }
        }
      }

      mat-card-actions {
        display: flex;
        gap: 8px;
        padding: 8px 16px 16px;
      }
    }

    .empty-state {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 64px;
      color: rgba(0, 0, 0, 0.38);

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
      }

      h4 {
        margin: 0 0 8px 0;
        font-size: 18px;
      }

      p {
        margin: 0 0 24px 0;
      }
    }
  `]
})
export class EmulatorListComponent implements OnInit, OnDestroy {
  private readonly emulatorService = inject(EmulatorService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroy$ = new Subject<void>();

  readonly emulators = signal<EmulatorResponseDTO[]>([]);
  readonly isLoading = signal(false);

  ngOnInit(): void {
    this.loadEmulators();

    // Auto-refresh every 10 seconds
    interval(10000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadEmulators());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEmulators(): void {
    this.isLoading.set(true);
    this.emulatorService.listActiveEmulators().subscribe({
      next: (response) => {
        this.emulators.set(response.emulators);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load emulators:', error);
        this.isLoading.set(false);
        this.snackBar.open('Failed to load emulators', 'Dismiss', { duration: 3000 });
      }
    });
  }

  refreshEmulators(): void {
    this.loadEmulators();
  }

  pauseEmulator(emulatorId: string): void {
    this.emulatorService.pauseEmulator(emulatorId).subscribe({
      next: () => {
        this.snackBar.open('Emulator paused', 'Dismiss', { duration: 2000 });
        this.loadEmulators();
      },
      error: (error) => {
        console.error('Failed to pause emulator:', error);
        this.snackBar.open('Failed to pause emulator', 'Dismiss', { duration: 3000 });
      }
    });
  }

  resumeEmulator(emulatorId: string): void {
    this.emulatorService.resumeEmulator(emulatorId).subscribe({
      next: () => {
        this.snackBar.open('Emulator resumed', 'Dismiss', { duration: 2000 });
        this.loadEmulators();
      },
      error: (error) => {
        console.error('Failed to resume emulator:', error);
        this.snackBar.open('Failed to resume emulator', 'Dismiss', { duration: 3000 });
      }
    });
  }

  stopEmulator(emulatorId: string): void {
    this.emulatorService.stopEmulator(emulatorId).subscribe({
      next: () => {
        this.snackBar.open('Emulator stopped', 'Dismiss', { duration: 2000 });
        this.loadEmulators();
      },
      error: (error) => {
        console.error('Failed to stop emulator:', error);
        this.snackBar.open('Failed to stop emulator', 'Dismiss', { duration: 3000 });
      }
    });
  }

  takeScreenshot(emulatorId: string): void {
    this.emulatorService.takeScreenshot(emulatorId).subscribe({
      next: (response) => {
        this.snackBar.open('Screenshot captured', 'Dismiss', { duration: 2000 });
        // Open screenshot in new tab or download
        if (response.screenshot_url) {
          window.open(response.screenshot_url, '_blank');
        }
      },
      error: (error) => {
        console.error('Failed to take screenshot:', error);
        this.snackBar.open('Failed to take screenshot', 'Dismiss', { duration: 3000 });
      }
    });
  }

  removeEmulator(emulatorId: string): void {
    // Remove from list (emulator is already stopped)
    this.emulators.update(emulators =>
      emulators.filter(e => e.emulator_id !== emulatorId)
    );
    this.snackBar.open('Emulator removed', 'Dismiss', { duration: 2000 });
  }

  trackByEmulatorId(index: number, emulator: EmulatorResponseDTO): string {
    return emulator.emulator_id;
  }

  getDeviceIcon(deviceType: DeviceType): string {
    switch (deviceType) {
      case DeviceType.IOS:
        return 'phone_iphone';
      case DeviceType.ANDROID:
        return 'phone_android';
      case DeviceType.TABLET:
        return 'tablet';
      default:
        return 'phone_android';
    }
  }

  getStatusColor(status: EmulatorStatus): string {
    switch (status) {
      case EmulatorStatus.RUNNING:
        return 'primary';
      case EmulatorStatus.PAUSED:
        return 'accent';
      case EmulatorStatus.ERROR:
        return 'warn';
      case EmulatorStatus.STARTING:
        return 'primary';
      default:
        return '';
    }
  }
}
