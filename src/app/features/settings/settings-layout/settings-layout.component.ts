import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-settings-layout',
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: './settings-layout.component.html',
    styleUrl: './settings-layout.component.css'
})
export class SettingsLayoutComponent {
    settingsMenu = [
        { icon: 'person', label: 'Profile', route: '/settings/profile' },
        { icon: 'people', label: 'User Management', route: '/settings/users' },
        { icon: 'security', label: 'Security', route: '/settings/security' },
        { icon: 'api', label: 'API Configuration', route: '/settings/api' },
        { icon: 'palette', label: 'Appearance', route: '/settings/appearance' },
        { icon: 'notifications', label: 'Notifications', route: '/settings/notifications' }
    ];
}
