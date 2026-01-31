import { Action } from 'rxjs/internal/scheduler/Action';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, inject, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { MatTabsModule } from '@angular/material/tabs';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { IDEService } from '../../../core/services/api/ide.service';
import { GitService } from '../../../core/services/api/git.service';
import { ToastService } from '../../../shared/services/toast.service';
import { IdeChatComponent } from '../ide-chat/ide-chat.component';
import { GitWindowComponent } from '../git-window/git-window.component';
import { K8sWindowComponent } from '../k8s-window/k8s-window.component';
import { SearchWindowComponent } from '../search-window/search-window.component';
import { CommandPaletteComponent } from '../command-palette/command-palette.component';
import { EmulatorWindowComponent } from '../emulator-window/emulator-window.component';
import { SignalStoreService } from '../../../core/services/signal-store.service';
import { CommandService } from '../../../core/services/command.service';
import { environment } from '../../../../environments/environment';
import { HostListener } from '@angular/core';

declare const monaco: any;

interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
}

interface EditorGroup {
  id: string;
  files: FileNode[];
  activeFile: FileNode | null;
  editorInstance?: any;
  diffEditorInstance?: any;
  isDiffMode?: boolean;
}

@Component({
  selector: 'app-ide-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTreeModule,
    MatTabsModule,
    IdeChatComponent,
    GitWindowComponent,
    K8sWindowComponent,
    SearchWindowComponent,
    EmulatorWindowComponent,
    CommandPaletteComponent
  ],
  templateUrl: './ide-layout.component.html',
  styleUrl: './ide-layout.component.css'
})
export class IdeLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('editorContainer') editorContainers!: QueryList<ElementRef>;
  @ViewChild('terminalContainer', { static: false }) terminalContainer!: ElementRef;

  private ideService = inject(IDEService);
  private gitService = inject(GitService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private commandService = inject(CommandService);
  private store = inject(SignalStoreService);

  workspaceId = 'demo-workspace';
  fileTree: FileNode[] = [];

  // Layout Resizing (Phase 4)
  explorerWidth = 260;
  chatWidth = 350;
  gitWidth = 300;
  k8sWidth = 300;
  searchWidth = 300;
  emulatorWidth = 300;
  bottomPanelHeight = 300;
  isResizing = false;

  // Terminal
  private term!: Terminal;
  private fitAddon!: FitAddon;
  private socket!: WebSocket;

  // Tree Control
  treeControl = new NestedTreeControl<FileNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FileNode>();

  hasChild = (_: number, node: FileNode) => !!node.children && node.children.length > 0;

  // Editor Groups Management
  editorGroups: EditorGroup[] = [];
  activeGroupId: string = '';

  // Sidebars State
  isChatOpen = false;
  isGitOpen = false;
  isK8sOpen = false;
  isSearchOpen = false;
  isEmulatorOpen = false;

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    this.isGitOpen = false;
    this.isK8sOpen = false;
    this.isSearchOpen = false;
    this.isEmulatorOpen = false;
    this.resizeAll();
  }

  toggleGit(): void {
    this.isGitOpen = !this.isGitOpen;
    this.isChatOpen = false;
    this.isK8sOpen = false;
    this.isSearchOpen = false;
    this.isEmulatorOpen = false;
    this.resizeAll();
  }

  toggleK8s(): void {
    this.isK8sOpen = !this.isK8sOpen;
    this.isChatOpen = false;
    this.isGitOpen = false;
    this.isSearchOpen = false;
    this.isEmulatorOpen = false;
    this.resizeAll();
  }

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
    this.isChatOpen = false;
    this.isGitOpen = false;
    this.isK8sOpen = false;
    this.isEmulatorOpen = false;
    this.resizeAll();
  }

  toggleEmulator(): void {
    this.isEmulatorOpen = !this.isEmulatorOpen;
    this.isChatOpen = false;
    this.isGitOpen = false;
    this.isK8sOpen = false;
    this.isSearchOpen = false;
    this.resizeAll();
  }

  // ... (resizeAll method follows)

  // ... (registerCommands overrides)
  registerCommands(): void {
    this.commandService.register({
      id: 'toggle-chat',
      label: 'Toggle AI Assistant',
      category: 'View',
      shortcut: 'Ctrl+Shift+L',
      icon: 'smart_toy',
      execute: () => this.toggleChat()
    });
    this.commandService.register({
      id: 'toggle-emulator',
      label: 'Toggle Mobile Emulator',
      category: 'View',
      icon: 'smartphone',
      execute: () => this.toggleEmulator()
    });
    this.commandService.register({
      id: 'toggle-git',
      label: 'Toggle Git Source Control',
      category: 'View',
      icon: 'source_control',
      execute: () => this.toggleGit()
    });
    // ... rest of commands
    this.commandService.register({
      id: 'toggle-k8s',
      label: 'Toggle Kubernetes Explorer',
      category: 'View',
      icon: 'cloud',
      execute: () => this.toggleK8s()
    });
    this.commandService.register({
      id: 'save-file',
      label: 'Save Active File',
      category: 'File',
      shortcut: 'Ctrl+S',
      icon: 'save',
      execute: () => this.saveFile()
    });
    this.commandService.register({
      id: 'split-right',
      label: 'Split Editor Right',
      category: 'Editor',
      icon: 'vertical_split',
      execute: () => this.splitEditor('vertical')
    });
    this.commandService.register({
      id: 'format-code',
      label: 'Format Document',
      category: 'Editor',
      icon: 'format_align_left',
      execute: () => this.formatCode()
    });
  }

  // ... rest of methods

  // Update startResizing
  startResizing(event: MouseEvent, edge: string): void {
    event.preventDefault();
    this.isResizing = true;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (edge === 'explorer') this.explorerWidth = moveEvent.clientX;
      if (edge === 'chat') this.chatWidth = window.innerWidth - moveEvent.clientX;
      if (edge === 'emulator') this.emulatorWidth = window.innerWidth - moveEvent.clientX;
      if (edge === 'git') this.gitWidth = window.innerWidth - moveEvent.clientX;
      if (edge === 'k8s') this.k8sWidth = window.innerWidth - moveEvent.clientX;
      if (edge === 'search') this.searchWidth = window.innerWidth - moveEvent.clientX;
      if (edge === 'bottom') this.bottomPanelHeight = window.innerHeight - moveEvent.clientY;

      this.editorGroups.forEach(g => g.editorInstance?.layout() || g.diffEditorInstance?.layout());
      this.fitAddon?.fit();
    };

    const onMouseUp = () => {
      this.isResizing = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
}
