import { Component, OnInit, OnDestroy, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommandService, CommandAction } from '../../../core/services/command.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './command-palette.html',
  styleUrl: './command-palette.scss'
})
export class CommandPaletteComponent implements OnInit, OnDestroy {
  private commandService = inject(CommandService);
  private sub = new Subscription();

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  isVisible = false;
  query = '';
  commands: CommandAction[] = [];
  filteredCommands: CommandAction[] = [];
  selectedIndex = 0;

  ngOnInit(): void {
    this.commands = this.commandService.getCommands();
    this.filteredCommands = [...this.commands];

    this.sub.add(
      this.commandService.paletteVisibilityStatus$.subscribe(visible => {
        this.isVisible = visible;
        if (visible) {
          this.query = '';
          this.selectedIndex = 0;
          this.filterCommands();
          setTimeout(() => this.searchInput.nativeElement.focus(), 10);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  filterCommands(): void {
    const q = this.query.toLowerCase();
    this.filteredCommands = this.commands.filter(cmd =>
      cmd.label.toLowerCase().includes(q) ||
      cmd.category?.toLowerCase().includes(q)
    );
    this.selectedIndex = 0;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.selectedIndex = (this.selectedIndex + 1) % this.filteredCommands.length;
      this.scrollIntoView();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.selectedIndex = (this.selectedIndex - 1 + this.filteredCommands.length) % this.filteredCommands.length;
      this.scrollIntoView();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.selectCommand(this.filteredCommands[this.selectedIndex]);
    } else if (event.key === 'Escape') {
      this.close();
    }
  }

  selectCommand(command: CommandAction): void {
    if (command) {
      this.commandService.execute(command.id);
    }
  }

  close(): void {
    this.commandService.hidePalette();
  }

  private scrollIntoView(): void {
    // Simple implementation could go here if list gets long
  }
}
