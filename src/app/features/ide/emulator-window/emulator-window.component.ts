import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmulatorService, EmulatorResponseDTO } from '../../../core/services/api/emulator.service';

@Component({
    selector: 'app-emulator-window',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatProgressSpinnerModule
    ],
    template: `
    <div class="emulator-window">
      <div class="header">
        <h3>Mobile Emulators</h3>
        <button mat-icon-button (click)="loadEmulators()" matTooltip="Refresh">
          <mat-icon>refresh</mat-icon>
        </button>
      </div>

      <div class="emulator-list">
        @if (loading()) {
            <div class="loading-state">
                <mat-spinner diameter="30"></mat-spinner>
            </div>
        } @else if (emulators().length === 0) {
            <div class="empty-state">
                <mat-icon>smartphone</mat-icon>
                <p>No active emulators</p>
                <button mat-stroked-button color="primary" (click)="startEmulator('android')">
                    Start Android
                </button>
            </div>
        } @else {
            @for (device of emulators(); track device.id) {
                <div class="emulator-card glass-panel">
                    <div class="device-info">
                        <mat-icon>{{ device.platform === 'android' ? 'android' : 'phone_iphone' }}</mat-icon>
                        <span class="device-name">{{ device.name }}</span>
                        <span class="status-badge" [class.active]="device.status === 'running'">{{ device.status }}</span>
                    </div>
                    @if (device.web_url) {
                        <div class="preview-area">
                            <iframe [src]="device.web_url | safeResourceUrl" frameborder="0"></iframe>
                        </div>
                    }
                    <div class="actions">
                        <button mat-icon-button color="warn" (click)="stopEmulator(device.id)">
                            <mat-icon>stop</mat-icon>
                        </button>
                    </div>
                </div>
            }
        }
      </div>
    </div>
  `,
    styles: [`
    .emulator-window {
        height: 100%;
        display: flex;
        flex-direction: column;
        color: var(--text-primary);
        background: var(--bg-secondary);
    }
    .header {
        padding: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--border-color);
        h3 { margin: 0; font-size: 14px; font-weight: 500; }
    }
    .emulator-list {
        flex: 1;
        overflow-y: auto;
        padding: 12px;
    }
    .loading-state, .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 200px;
        color: var(--text-secondary);
        mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 12px; opacity: 0.5; }
        p { margin-bottom: 16px; }
    }
    .emulator-card {
        padding: 12px;
        margin-bottom: 12px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-color);
    }
    .device-info {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
    }
    .status-badge {
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 4px;
        background: #333;
        &.active { background: var(--success-color, #4caf50); color: white; }
    }
  `]
})
export class EmulatorWindowComponent implements OnInit {
    private emulatorService = inject(EmulatorService);

    emulators = signal<EmulatorResponseDTO[]>([]);
    loading = signal(false);

    ngOnInit() {
        this.loadEmulators();
    }

    loadEmulators() {
        this.loading.set(true);
        this.emulatorService.listActiveEmulators().subscribe({
            next: (data) => {
                this.emulators.set(data);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
                // Mock for demo if backend fails/missing in dev
                // this.emulators.set([{ id: '1', name: 'Pixel 6', platform: 'android', status: 'running' } as any]);
            }
        });
    }

    startEmulator(platform: 'android' | 'ios') {
        this.loading.set(true);
        this.emulatorService.startEmulator({ platform }).subscribe({
            next: () => this.loadEmulators(),
            error: () => this.loading.set(false)
        });
    }

    stopEmulator(id: string) {
        this.emulatorService.stopEmulator(id).subscribe({
            next: () => this.loadEmulators()
        });
    }
}
