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
import { GitService } from '../../../core/services/api/git.service';
import { ToastService } from '../../../shared/services/toast.service';
import { IdeChatComponent } from '../ide-chat/ide-chat.component';
import { GitWindowComponent } from '../git-window/git-window';
import { K8sWindowComponent } from '../k8s-window/k8s-window';
import { CommandPaletteComponent } from '../command-palette/command-palette';
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
    CommandPaletteComponent
  ],
  templateUrl: './ide-layout.component.html',
  styleUrl: './ide-layout.component.css'
})
export class IdeLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('editorContainer') editorContainers!: QueryList<ElementRef>;
  @ViewChild('terminalContainer', { static: false }) terminalContainer!: ElementRef;

  private ideService = inject(IdeService);
  private gitService = inject(GitService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private commandService = inject(CommandService);

  workspaceId = 'demo-workspace';
  fileTree: FileNode[] = [];

  // Layout Resizing (Phase 4)
  explorerWidth = 260;
  chatWidth = 350;
  gitWidth = 300;
  k8sWidth = 300;
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

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    this.isGitOpen = false;
    this.isK8sOpen = false;
    // Resize editors when layout changes
    setTimeout(() => {
      this.editorGroups.forEach(g => g.editorInstance?.layout() || g.diffEditorInstance?.layout());
      this.fitAddon?.fit();
    }, 300);
  }

  toggleGit(): void {
    this.isGitOpen = !this.isGitOpen;
    this.isChatOpen = false;
    this.isK8sOpen = false;
    setTimeout(() => {
      this.editorGroups.forEach(g => g.editorInstance?.layout() || g.diffEditorInstance?.layout());
      this.fitAddon?.fit();
    }, 300);
  }

  toggleK8s(): void {
    this.isK8sOpen = !this.isK8sOpen;
    this.isChatOpen = false;
    this.isGitOpen = false;
    setTimeout(() => {
      this.editorGroups.forEach(g => g.editorInstance?.layout() || g.diffEditorInstance?.layout());
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
    this.registerCommands();
  }

  @HostListener('window:keydown', ['$event'])
  handleShortcuts(event: KeyboardEvent): void {
    // Ctrl+Shift+P (Command Palette)
    if (event.ctrlKey && event.shiftKey && event.key === 'P') {
      event.preventDefault();
      this.commandService.togglePalette();
    }
    // Ctrl+P (Quick Open - also Command Palette for now)
    if (event.ctrlKey && event.key === 'p' && !event.shiftKey) {
      event.preventDefault();
      this.commandService.togglePalette();
    }
    // Ctrl+S (Save)
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      this.saveFile();
    }
  }

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
      id: 'toggle-git',
      label: 'Toggle Git Source Control',
      category: 'View',
      icon: 'source_control',
      execute: () => this.toggleGit()
    });
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

  handleGitDiff(path: string): void {
    const group = this.getActiveGroup();
    if (!group) return;

    this.gitService.getDiff(this.workspaceId, path).subscribe({
      next: (diff) => {
        this.showDiffEditor(group, diff.original_content, diff.modified_content, path);
      },
      error: () => this.toast.error('Failed to load diff for ' + path)
    });
  }

  showDiffEditor(group: EditorGroup, original: string, modified: string, path: string): void {
    group.isDiffMode = true;
    const container = this.editorContainers.toArray()[this.editorGroups.indexOf(group)].nativeElement;

    if (group.editorInstance) {
      group.editorInstance.dispose();
      group.editorInstance = null;
    }

    group.diffEditorInstance = monaco.editor.createDiffEditor(container, {
      theme: 'vs-dark',
      automaticLayout: true,
      readOnly: false,
      renderSideBySide: true
    });

    const originalModel = monaco.editor.createModel(original, this.getLanguageFromPath(path));
    const modifiedModel = monaco.editor.createModel(modified, this.getLanguageFromPath(path));

    group.diffEditorInstance.setModel({
      original: originalModel,
      modified: modifiedModel
    });
  }

  refreshEditorContainer(group: EditorGroup): void {
    const index = this.editorGroups.indexOf(group);
    const container = this.editorContainers.toArray()[index].nativeElement;
    this.createEditor(container, group);
  }

  initTerminal(): void {
    this.term = new Terminal({
      fontFamily: 'Fira Code, monospace',
      fontSize: 13,
      cursorBlink: true,
      allowProposedApi: true,
      theme: {
        background: '#151515',
        foreground: '#e0e0e0',
        cursor: '#4facfe',
        selectionBackground: 'rgba(79, 172, 254, 0.3)',
        black: '#151515',
        red: '#ff5555',
        green: '#50fa7b',
        yellow: '#f1fa8c',
        blue: '#6272a4',
        magenta: '#bd93f9',
        cyan: '#8be9fd',
        white: '#f8f8f2'
      }
    });

    this.fitAddon = new FitAddon();
    this.term.loadAddon(this.fitAddon);

    if (this.terminalContainer && this.terminalContainer.nativeElement) {
      this.terminalContainer.nativeElement.innerHTML = '';
      this.term.open(this.terminalContainer.nativeElement);
      this.fitAddon.fit();
    }

    // Professional Boot Sequence
    this.term.write('\x1b[34m[SYSTEM]\x1b[0m Initializing AI Orchestrator Terminal...\r\n');
    this.term.write('\x1b[36mAI-ORCH-OS v2026.1.0-POWERFUL\x1b[0m\r\n');
    this.term.write('\x1b[90m--------------------------------------------------\x1b[0m\r\n');

    // Connect to Backend Session
    this.ideService.createTerminal({ workspace_id: this.workspaceId }).subscribe({
      next: (session) => {
        this.term.write('\x1b[32m[OK]\x1b[0m Terminal Session Established: \x1b[33m' + session.session_id + '\x1b[0m\r\n');
        this.connectTerminalSocket(session.session_id);
      },
      error: (err) => {
        this.term.write('\x1b[31m[ERROR]\x1b[0m Critical failure in backend handshake.\r\n');
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
    const url = `${environment.wsUrl}/ws/terminal/${sessionId}`;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      const languageProfile = this.getProjectLanguageProfile();
      this.term.write('\x1b[32m[OK]\x1b[0m Secure WebSocket Handshake Verified.\r\n');
      this.term.write('\x1b[34m[INFO]\x1b[0m Detected Project stack:\r\n');
      languageProfile.forEach(lang => {
        this.term.write(`      \x1b[90m->\x1b[0m \x1b[35m${lang}\x1b[0m\r\n`);
      });
      this.term.write('\x1b[90m--------------------------------------------------\x1b[0m\r\n\r\n');
      this.fitAddon.fit();
    };

    this.socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'output') {
          this.term.write(msg.data);
        }
      } catch (e) {
        this.term.write(event.data);
      }
    };

    this.socket.onclose = () => {
      this.term.write('\r\n\x1b[31m[DISCONNECTED]\x1b[0m Session closed by host.\r\n');
    };
  }

  private getProjectLanguageProfile(): string[] {
    const languages = new Set<string>();

    const scanNode = (nodes: FileNode[]) => {
      nodes.forEach(node => {
        if (node.isDirectory && node.children) {
          scanNode(node.children);
        } else {
          const ext = node.name.split('.').pop()?.toLowerCase();
          if (ext === 'java' || node.name === 'pom.xml' || node.name === 'build.gradle') languages.add('Java/JVM');
          if (ext === 'py' || node.name === 'requirements.txt' || node.name === 'pyproject.toml') languages.add('Python');
          if (ext === 'ts' || ext === 'js' || node.name === 'package.json') languages.add('Node.js/TypeScript');
          if (ext === 'go' || node.name === 'go.mod') languages.add('Go (Golang)');
          if (ext === 'rs' || node.name === 'Cargo.toml') languages.add('Rust');
          if (ext === 'cs' || ext === 'csproj' || ext === 'sln') languages.add('C#/.NET');
          if (ext === 'cpp' || ext === 'hpp' || ext === 'c' || ext === 'h') languages.add('C/C++');
          if (ext === 'php' || node.name === 'composer.json') languages.add('PHP');
          if (ext === 'rb' || node.name === 'Gemfile') languages.add('Ruby');
          if (ext === 'swift') languages.add('Swift');
          if (ext === 'kt' || ext === 'kts') languages.add('Kotlin');
          if (ext === 'dockerfile' || node.name.toLowerCase() === 'dockerfile') languages.add('Docker/DevOps');
          if (ext === 'yaml' || ext === 'yml') languages.add('YAML/Configuration');
        }
      });
    };

    if (this.fileTree.length > 0) {
      scanNode(this.fileTree);
    }

    return languages.size > 0 ? Array.from(languages) : ['Universal Polyglot'];
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
    const group = this.getActiveGroup();
    if (!group) return;

    // Reset Diff Mode if active
    if (group.isDiffMode) {
      if (group.diffEditorInstance) {
        group.diffEditorInstance.dispose();
        group.diffEditorInstance = null;
      }
      group.isDiffMode = false;
      // Re-initialize normal editor
      this.refreshEditorContainer(group);
    }

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

  // Phase 4: Resizing Handlers
  startResizing(event: MouseEvent, edge: string): void {
    event.preventDefault();
    this.isResizing = true;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (edge === 'explorer') this.explorerWidth = moveEvent.clientX;
      if (edge === 'chat') this.chatWidth = window.innerWidth - moveEvent.clientX;
      if (edge === 'git') this.gitWidth = window.innerWidth - moveEvent.clientX;
      if (edge === 'k8s') this.k8sWidth = window.innerWidth - moveEvent.clientX;
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
