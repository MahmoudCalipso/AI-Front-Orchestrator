import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { EmulatorService } from '../../../core/services/api/emulator.service';
import { DeviceType, DeviceConfiguration, EmulatorStartRequest } from '../../../core/models/emulator/emulator.models';

interface DevicePreset {
  name: string;
  deviceType: DeviceType;
  width: number;
  height: number;
  pixelDensity: number;
  osVersion: string;
}

const DEVICE_PRESETS: DevicePreset[] = [
  { name: 'iPhone 14 Pro', deviceType: DeviceType.IOS, width: 393, height: 852, pixelDensity: 3, osVersion: '16.0' },
  { name: 'iPhone 14', deviceType: DeviceType.IOS, width: 390, height: 844, pixelDensity: 3, osVersion: '16.0' },
  { name: 'iPhone SE', deviceType: DeviceType.IOS, width: 375, height: 667, pixelDensity: 2, osVersion: '16.0' },
  { name: 'Pixel 7 Pro', deviceType: DeviceType.ANDROID, width: 412, height: 915, pixelDensity: 3.5, osVersion: '13.0' },
  { name: 'Pixel 7', deviceType: DeviceType.ANDROID, width: 412, height: 915, pixelDensity: 2.5, osVersion: '13.0' },
  { name: 'Samsung S23 Ultra', deviceType: DeviceType.ANDROID, width: 412, height: 915, pixelDensity: 3.5, osVersion: '13.0' },
  { name: 'iPad Pro 12.9"', deviceType: DeviceType.TABLET, width: 1024, height: 1366, pixelDensity: 2, osVersion: '16.0' },
  { name: 'iPad Air', deviceType: DeviceType.TABLET, width: 820, height: 1180, pixelDensity: 2, osVersion: '16.0' },
];

const NETWORK_PROFILES = [
  { name: 'WiFi', download: 50000, upload: 30000, latency: 2 },
  { name: '4G LTE', download: 20000, upload: 10000, latency: 20 },
  { name: 'Fast 3G', download: 3000, upload: 1500, latency: 100 },
  { name: 'Slow 3G', download: 400, upload: 200, latency: 300 },
];

@Component({
  selector: 'app-emulator-launcher',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  template: `
    <div class="emulator-launcher">
      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar>phone_android</mat-icon>
          <mat-card-title>Mobile Emulator</mat-card-title>
          <mat-card-subtitle>Launch and configure mobile device emulation</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <!-- Device Selection -->
          <div class="section">
            <h4>Device Configuration</h4>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Device Preset</mat-label>
              <mat-select [(ngModel)]="selectedPreset" (selectionChange)="onPresetChange()">
                @for (preset of devicePresets; track preset.name) {
                  <mat-option [value]="preset">
                    {{ preset.name }} ({{ preset.width }}x{{ preset.height }})
                  </mat-option>
                }
              </mat-select>
            </mat-form-field>

            <div class="device-details">
              <div class="detail-row">
                <mat-form-field appearance="outline">
                  <mat-label>Device Type</mat-label>
                  <mat-select [(ngModel)]="deviceConfig.device_type">
                    <mat-option [value]="'android'">Android</mat-option>
                    <mat-option [value]="'ios'">iOS</mat-option>
                    <mat-option [value]="'tablet'">Tablet</mat-option>
                    <mat-option [value]="'custom'">Custom</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Device Name</mat-label>
                  <input matInput [(ngModel)]="deviceConfig.device_name" placeholder="My Device">
                </mat-form-field>
              </div>

              <div class="detail-row">
                <mat-form-field appearance="outline">
                  <mat-label>Width (px)</mat-label>
                  <input matInput type="number" [(ngModel)]="deviceConfig.screen_width">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Height (px)</mat-label>
                  <input matInput type="number" [(ngModel)]="deviceConfig.screen_height">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Pixel Density</mat-label>
                  <input matInput type="number" step="0.1" [(ngModel)]="deviceConfig.pixel_density">
                </mat-form-field>
              </div>

              <div class="detail-row">
                <mat-form-field appearance="outline">
                  <mat-label>OS Version</mat-label>
                  <input matInput [(ngModel)]="deviceConfig.os_version" placeholder="16.0">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Orientation</mat-label>
                  <mat-select [(ngModel)]="deviceConfig.orientation">
                    <mat-option [value]="'portrait'">Portrait</mat-option>
                    <mat-option [value]="'landscape'">Landscape</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
            </div>
          </div>

          <!-- Advanced Options -->
          <div class="section">
            <h4>Advanced Options</h4>

            <div class="advanced-options">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Network Profile</mat-label>
                <mat-select [(ngModel)]="selectedNetworkProfile">
                  @for (profile of networkProfiles; track profile.name) {
                    <mat-option [value]="profile">
                      {{ profile.name }} ({{ profile.download }}kbps ↓ / {{ profile.upload }}kbps ↑)
                    </mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <div class="toggles">
                <mat-slide-toggle [(ngModel)]="enableDebugging" color="primary">
                  Enable Debugging
                </mat-slide-toggle>

                <mat-slide-toggle [(ngModel)]="enableNetworkThrottling" color="primary">
                  Enable Network Throttling
                </mat-slide-toggle>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>App URL (Optional)</mat-label>
                <input matInput [(ngModel)]="appUrl" placeholder="http://localhost:3000">
                <mat-hint>URL to load in the emulator</mat-hint>
              </mat-form-field>
            </div>
          </div>

          <!-- Preview -->
          <div class="section">
            <h4>Device Preview</h4>
            <div class="device-preview" [style.width.px]="previewWidth" [style.height.px]="previewHeight">
              <div class="device-frame" [class.landscape]="deviceConfig.orientation === 'landscape'">
                <div class="device-screen">
                  <span class="screen-resolution">
                    {{ deviceConfig.screen_width }} × {{ deviceConfig.screen_height }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <button mat-button (click)="resetConfiguration()">
            <mat-icon>refresh</mat-icon>
            Reset
          </button>
          <span class="spacer"></span>
          <button
            mat-raised-button
            color="primary"
            (click)="launchEmulator()"
            [disabled]="isLaunching() || !isValidConfiguration()"
          >
            @if (isLaunching()) {
              <mat-spinner diameter="20"></mat-spinner>
            } @else {
              <mat-icon>play_arrow</mat-icon>
            }
            Launch Emulator
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .emulator-launcher {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;

      mat-card {
        mat-card-header {
          margin-bottom: 16px;

          mat-icon {
            font-size: 40px;
            width: 40px;
            height: 40px;
            color: #1976d2;
          }
        }

        mat-card-content {
          .section {
            margin-bottom: 24px;

            h4 {
              margin: 0 0 16px 0;
              font-size: 14px;
              font-weight: 500;
              color: rgba(0, 0, 0, 0.6);
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }

            .device-details {
              .detail-row {
                display: flex;
                gap: 16px;
                margin-bottom: 16px;

                mat-form-field {
                  flex: 1;
                }
              }
            }

            .advanced-options {
              .toggles {
                display: flex;
                gap: 24px;
                margin-bottom: 16px;
              }
            }

            .device-preview {
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 24px;
              background-color: #f5f5f5;
              border-radius: 8px;

              .device-frame {
                background-color: #333;
                border-radius: 20px;
                padding: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

                &.landscape {
                  transform: rotate(0deg);
                }

                .device-screen {
                  background-color: #000;
                  border-radius: 12px;
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;

                  .screen-resolution {
                    color: #666;
                    font-size: 12px;
                    font-family: monospace;
                  }
                }
              }
            }
          }

          .full-width {
            width: 100%;
          }
        }

        mat-card-actions {
          display: flex;
          padding: 16px;

          .spacer {
            flex: 1;
          }

          button {
            display: flex;
            align-items: center;
            gap: 8px;
          }
        }
      }
    }
  `]
})
export class EmulatorLauncherComponent implements OnInit {
  private readonly emulatorService = inject(EmulatorService);

  readonly devicePresets = DEVICE_PRESETS;
  readonly networkProfiles = NETWORK_PROFILES;

  selectedPreset: DevicePreset | null = null;
  selectedNetworkProfile = NETWORK_PROFILES[0];
  enableDebugging = false;
  enableNetworkThrottling = false;
  appUrl = '';

  readonly isLaunching = signal(false);

  deviceConfig: DeviceConfiguration = {
    device_type: DeviceType.ANDROID,
    device_name: 'Custom Device',
    screen_width: 412,
    screen_height: 915,
    pixel_density: 2.5,
    os_version: '13.0',
    orientation: 'portrait'
  };

  ngOnInit(): void {
    // Set default preset
    this.selectedPreset = this.devicePresets[0];
    this.onPresetChange();
  }

  onPresetChange(): void {
    if (this.selectedPreset) {
      this.deviceConfig = {
        device_type: this.selectedPreset.deviceType,
        device_name: this.selectedPreset.name,
        screen_width: this.selectedPreset.width,
        screen_height: this.selectedPreset.height,
        pixel_density: this.selectedPreset.pixelDensity,
        os_version: this.selectedPreset.osVersion,
        orientation: 'portrait'
      };
    }
  }

  readonly previewWidth = computed(() => {
    const scale = 0.3;
    return this.deviceConfig.orientation === 'landscape'
      ? this.deviceConfig.screen_height * scale
      : this.deviceConfig.screen_width * scale;
  });

  readonly previewHeight = computed(() => {
    const scale = 0.3;
    return this.deviceConfig.orientation === 'landscape'
      ? this.deviceConfig.screen_width * scale
      : this.deviceConfig.screen_height * scale;
  });

  isValidConfiguration(): boolean {
    return !!this.deviceConfig.device_name &&
      this.deviceConfig.screen_width > 0 &&
      this.deviceConfig.screen_height > 0 &&
      this.deviceConfig.pixel_density > 0;
  }

  launchEmulator(): void {
    if (!this.isValidConfiguration()) return;

    this.isLaunching.set(true);

    const request: EmulatorStartRequest = {
      project_id: 'current-project', // Would come from context
      device_config: this.deviceConfig,
      app_url: this.appUrl || undefined,
      enable_debugging: this.enableDebugging,
      enable_network_throttling: this.enableNetworkThrottling,
      network_profile: this.enableNetworkThrottling
        ? (this.selectedNetworkProfile.name.toLowerCase().replace(' ', '-') as any)
        : undefined
    };

    this.emulatorService.startEmulator(request).subscribe({
      next: (response) => {
        this.isLaunching.set(false);
        console.log('Emulator started:', response);
        // Navigate to emulator view or show success message
      },
      error: (error) => {
        this.isLaunching.set(false);
        console.error('Failed to start emulator:', error);
        // Show error message
      }
    });
  }

  resetConfiguration(): void {
    this.selectedPreset = this.devicePresets[0];
    this.onPresetChange();
    this.enableDebugging = false;
    this.enableNetworkThrottling = false;
    this.appUrl = '';
  }
}
