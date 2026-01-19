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
import { IdeService } from '../../../core/services/api/ide.service';
import { ToastService } from '../../../shared/services/toast.service';
import { IdeChatComponent } from '../ide-chat/ide-chat.component';
import { environment } from '../../../../environments/environment';

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
  editorInstance?: any; // strict type removed for AMD usage
}

@Component({
  selector: 'app-ide-layout',
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTreeModule,
    MatTabsModule,
    IdeChatComponent
  ],
  templateUrl: './ide-layout.component.html',
  styleUrl: './ide-layout.component.css'
})
export class IdeLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('editorContainer') editorContainers!: QueryList<ElementRef>;
  @ViewChild('terminalContainer', { static: false }) terminalContainer!: ElementRef;

  private ideService = inject(IdeService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);

  workspaceId = 'demo-workspace';
  fileTree: FileNode[] = [];

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

  // Chat State
  isChatOpen = false;

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    // Resize editors when layout changes
    setTimeout(() => {
      this.editorGroups.forEach(g => g.editorInstance?.layout());
      this.fitAddon?.fit();
    }, 300);
  }

  ngOnInit(): void {
    // Initialize with one default group
    this.addEditorGroup();

    this.route.queryParams.subscribe(params => {
      if (params['project']) {
        this.workspaceId = params['project'];
        this.loadProjectFiles();
      }
    });

    this.loadMonacoLoader();
  }

  loadMonacoLoader(): void {
    if (typeof monaco !== 'undefined') {
      // Already loaded
      return;
    }
    const script = document.createElement('script');
    // Load from local assets copy
    script.src = 'assets/monaco/vs/loader.js';
    script.onload = () => {
      (window as any).require.config({ paths: { 'vs': 'assets/monaco/vs' } });
      (window as any).require(['vs/editor/editor.main'], () => {
        this.initializeEditors();
      });
    };
    document.head.appendChild(script);
  }

  loadProjectFiles(): void {
    this.ideService.getProjectStructure(this.workspaceId).subscribe({
      next: (structure: any) => {
        this.fileTree = structure.files || [];
        this.dataSource.data = this.fileTree;
      },
      error: (error) => {
        console.error('Failed to load project structure', error);
        this.toast.error('Failed to load project files');
        this.fileTree = [
          { name: 'src', path: '/src', isDirectory: true, children: [] },
          { name: 'package.json', path: '/package.json', isDirectory: false }
        ];
        this.dataSource.data = this.fileTree;
      }
    });
  }

  ngAfterViewInit(): void {
    this.editorContainers.changes.subscribe(() => {
      if (typeof monaco !== 'undefined') {
        this.initializeEditors();
      }
    });

    // Initialize Terminal
    if (this.terminalContainer) {
      this.initTerminal();
    }
  }

  initTerminal(): void {
    this.term = new Terminal({
      fontFamily: 'Fira Code, monospace',
      fontSize: 14,
      cursorBlink: true,
      theme: {
        background: '#1e1e1e',
        foreground: '#ffffff',
        cursor: '#00ff88',
        selectionBackground: 'rgba(0, 255, 136, 0.3)'
      }
    });

    this.fitAddon = new FitAddon();
    this.term.loadAddon(this.fitAddon);

    // Create container
    if (this.terminalContainer && this.terminalContainer.nativeElement) {
      this.terminalContainer.nativeElement.innerHTML = ''; // Clear placeholder
      this.term.open(this.terminalContainer.nativeElement);
      this.fitAddon.fit();
    }

    // Connect to Backend Session
    this.ideService.createTerminal({ workspace_id: this.workspaceId }).subscribe({
      next: (session) => {
        this.connectTerminalSocket(session.session_id);
      },
      error: (err) => {
        this.term.write('\x1b[31mFailed to create terminal session\x1b[0m\r\n');
        console.error(err);
      }
    });

    // Handle user input
    this.term.onData(data => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'input', data }));
      }
    });
  }

  connectTerminalSocket(sessionId: string): void {
    // Use environment wsUrl
    const url = `${environment.wsUrl}/ws/terminal/${sessionId}`;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      this.term.write('\x1b[32mConnected to AI terminal\x1b[0m\r\n');
      this.fitAddon.fit();
    };

    this.socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'output') {
          this.term.write(msg.data);
        }
      } catch (e) {
        // If raw text
        this.term.write(event.data);
      }
    };

    this.socket.onclose = () => {
      this.term.write('\r\n\x1b[31mConnection closed\x1b[0m\r\n');
    };
  }

  ngOnDestroy(): void {
    this.editorGroups.forEach(group => {
      if (group.editorInstance) {
        group.editorInstance.dispose();
      }
    });
    if (this.term) this.term.dispose();
    if (this.socket) this.socket.close();
  }

  addEditorGroup(): void {
    const newGroup: EditorGroup = {
      id: 'group-' + Date.now().toString() + '-' + Math.random().toString(),
      files: [],
      activeFile: null
    };
    this.editorGroups.push(newGroup);
    this.activeGroupId = newGroup.id;
  }

  saveFile(): void {
    const group = this.getActiveGroup();
    if (!group || !group.activeFile || !group.editorInstance) return;

    const content = group.editorInstance.getValue();

    this.ideService.updateFileContent(this.workspaceId, group.activeFile.path, { content }).subscribe({
      next: () => {
        this.toast.success('File saved');
      },
      error: () => {
        this.toast.error('Failed to save file');
      }
    });
  }

  initializeEditors(): void {
    if (typeof monaco === 'undefined') return;

    this.editorContainers.forEach((container, index) => {
      const group = this.editorGroups[index];
      if (group && !group.editorInstance) {
        this.createEditor(container.nativeElement, group);
      }
    });
  }

  createEditor(container: HTMLElement, group: EditorGroup): void {
    // Cleanup if existing (safety)
    if (container.children.length > 0) {
      container.innerHTML = '';
    }

    group.editorInstance = monaco.editor.create(container, {
      value: '// Select a file to view',
      language: 'javascript',
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: true },
      fontSize: 14,
      scrollBeyondLastLine: false
    });

    group.editorInstance.onDidFocusEditorText(() => {
      this.activeGroupId = group.id;
    });
  }

  splitEditor(direction: 'horizontal' | 'vertical'): void {
    // For now, only vertical split (side-by-side) supported in UI for Phase 1
    this.addEditorGroup();
    // In a real implementation we would copy the active file to the new group
    const activeGroup = this.getActiveGroup();
    const newGroup = this.editorGroups[this.editorGroups.length - 1];

    if (activeGroup && activeGroup.activeFile) {
      newGroup.files = [activeGroup.activeFile];
      newGroup.activeFile = activeGroup.activeFile;
      // We need to wait for view to update to initialize the editor, then set value
      setTimeout(() => {
        if (newGroup.editorInstance && activeGroup.activeFile) {
          this.loadFileContent(activeGroup.activeFile, newGroup);
        }
      }, 200);
    }
  }

  closeEditorGroup(groupId: string): void {
    if (this.editorGroups.length <= 1) return;

    const index = this.editorGroups.findIndex(g => g.id === groupId);
    if (index > -1) {
      this.editorGroups[index].editorInstance?.dispose();
      this.editorGroups.splice(index, 1);
      this.activeGroupId = this.editorGroups[Math.max(0, index - 1)].id;
    }
  }

  getActiveGroup(): EditorGroup | undefined {
    return this.editorGroups.find(g => g.id === this.activeGroupId) || this.editorGroups[0];
  }

  openFile(file: FileNode): void {
    if (file.isDirectory) return;

    const group = this.getActiveGroup();
    if (!group) return;

    if (!group.files.find(f => f.path === file.path)) {
      group.files.push(file);
    }
    group.activeFile = file;
    this.loadFileContent(file, group);
  }

  loadFileContent(file: FileNode, group: EditorGroup): void {
    this.ideService.getFileContent(this.workspaceId, file.path).subscribe({
      next: (content) => {
        if (group.editorInstance) {
          group.editorInstance.setValue(content.content);
          const model = group.editorInstance.getModel();
          if (model) {
            monaco.editor.setModelLanguage(model, this.getLanguageFromPath(file.path));
          }
        }
      },
      error: () => {
        if (group.editorInstance) {
          group.editorInstance.setValue('// Failed to load ' + file.name);
        }
      }
    });
  }

  closeFile(file: FileNode, group: EditorGroup, event?: Event): void {
    event?.stopPropagation();
    const idx = group.files.findIndex(f => f.path === file.path);
    if (idx > -1) {
      group.files.splice(idx, 1);
      if (group.activeFile?.path === file.path) {
        group.activeFile = group.files.length > 0 ? group.files[group.files.length - 1] : null;
        if (group.activeFile) {
          this.loadFileContent(group.activeFile, group);
        } else {
          group.editorInstance?.setValue('// No file open');
        }
      }
    }
  }

  setActiveFile(file: FileNode, group: EditorGroup): void {
    group.activeFile = file;
    this.loadFileContent(file, group);
  }

  runCode(): void { this.toast.info('Run not implemented yet'); }

  formatCode(): void {
    const group = this.getActiveGroup();
    group?.editorInstance?.getAction('editor.action.formatDocument')?.run();
  }

  getLanguageFromPath(path: string): string {
    const ext = path.split('.').pop()?.toLowerCase();
    const map: any = { ts: 'typescript', js: 'javascript', html: 'html', css: 'css', json: 'json', md: 'markdown' };
    return map[ext || ''] || 'plaintext';
  }
}
