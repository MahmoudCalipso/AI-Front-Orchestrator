import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface CommandAction {
    id: string;
    label: string;
    category?: string;
    shortcut?: string;
    icon?: string;
    execute: () => void;
}

@Injectable({
    providedIn: 'root'
})
export class CommandService {
    private commands = new Map<string, CommandAction>();
    private paletteVisibility$ = new Subject<boolean>();

    paletteVisibilityStatus$ = this.paletteVisibility$.asObservable();

    register(command: CommandAction): void {
        this.commands.set(command.id, command);
    }

    unregister(id: string): void {
        this.commands.delete(id);
    }

    getCommands(): CommandAction[] {
        return Array.from(this.commands.values());
    }

    execute(id: string): void {
        const cmd = this.commands.get(id);
        if (cmd) {
            cmd.execute();
            this.hidePalette();
        }
    }

    showPalette(): void {
        this.paletteVisibility$.next(true);
    }

    hidePalette(): void {
        this.paletteVisibility$.next(false);
    }

    togglePalette(): void {
        this.paletteVisibility$.next(true);
    }
}
