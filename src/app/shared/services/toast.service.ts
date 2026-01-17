import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private defaultConfig: MatSnackBarConfig = {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
    };

    constructor(private snackBar: MatSnackBar) { }

    success(message: string, duration?: number): void {
        this.show(message, 'success', duration);
    }

    error(message: string, duration?: number): void {
        this.show(message, 'error', duration);
    }

    warning(message: string, duration?: number): void {
        this.show(message, 'warning', duration);
    }

    info(message: string, duration?: number): void {
        this.show(message, 'info', duration);
    }

    private show(message: string, type: string, duration?: number): void {
        this.snackBar.open(message, 'Close', {
            ...this.defaultConfig,
            duration: duration || this.defaultConfig.duration,
            panelClass: [`toast-${type}`]
        });
    }
}
