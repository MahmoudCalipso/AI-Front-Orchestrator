import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { ProjectService } from '../../core/services/api/project.service';
import { IDEService } from '../../core/services/api/ide.service';
import { GitService } from '../../core/services/api/git.service';
import { IdeTerminalService } from '../../core/services/websocket/ide-terminal.service';
import { Project } from '../../core/models/project/project.model';
import { FileTreeNode } from '../../core/models/ide/ide.model';
import { GitStatus } from '../../core/models/git/git.model';
import * as monaco from 'monaco-editor';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

@Component({
  selector: 'app-ide',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatChipsModule,
    MatTooltipModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTreeModule,
    MatDividerModule,
    MatCardModule,
    MatBadgeModule,
    MatSlideToggleModule
  ],
  templateUrl: './ide.component.html',
  styleUrls: ['./ide.component.scss']
})
export class IdeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  @ViewChild('terminalContainer', { static: true }) terminalContainer!: ElementRef;

  // Core IDE state
  project: Project | null = null;
  files: FileTreeNode[] = [];
  activeFile: FileTreeNode | null = null;
  openFiles: FileTreeNode[] = [];
  editor: monaco.editor.IStandaloneCodeEditor | null = null;
  editors: Map<string, monaco.editor.IStandaloneCodeEditor> = new Map();

  // Enhanced terminal system
  terminals: { id: string, name: string, terminal: Terminal, fitAddon: FitAddon, cwd?: string }[] = [];
  activeTerminalId = '';
  terminalLines: string[] = [];
  fitAddon: FitAddon | null = null;
  terminalHistory: string[] = [];
  terminalHistoryIndex = -1;

  // AI Assistant
  chatMessages: { role: 'user' | 'assistant', content: string, timestamp: Date }[] = [];
  commandInput = '';
  isAiThinking = false;
  aiSuggestions: any[] = [];

  // Git integration
  gitStatus: GitStatus | null = null;
  gitBranches: string[] = [];
  gitHistory: any[] = [];
  currentBranch = '';
  gitStaged: string[] = [];
  gitUnstaged: string[] = [];
  gitUntracked: string[] = [];

  // Search and navigation
  searchQuery = '';
  searchResults: any[] = [];
  replaceQuery = '';
  searchCaseSensitive = false;
  searchRegex = false;
  searchWholeWord = false;
  commandPaletteOpen = false;
  commandPaletteQuery = '';
  availableCommands: any[] = [];
  recentFiles: FileTreeNode[] = [];

  // Panel states
  leftPanelCollapsed = false;
  rightPanelCollapsed = false;
  bottomPanelCollapsed = false;
  terminalPanelHeight = 300;
  leftPanelWidth = 250;
  rightPanelWidth = 300;

  // UI state
  theme: 'dark' | 'light' = 'dark';
  fontSize = 14;
  wordWrap = true;
  minimap = true;
  lineNumbers = true;
  folding = true;

  // Kubernetes integration
  k8sClusters: any[] = [];
  k8sPods: any[] = [];
  k8sServices: any[] = [];
  k8sDeployments: any[] = [];
  k8sNamespaces: string[] = [];
  selectedNamespace = 'default';

  // Debugging
  breakpoints: any[] = [];
  debugSession: any = null;
  debugVariables: any[] = [];
  debugCallStack: any[] = [];
  debugWatchExpressions: string[] = [];

  // Extensions/Plugins
  extensions: any[] = [];
  loadedExtensions: Map<string, any> = new Map();

  // File management
  fileTemplates: any[] = [];
  recentProjects: any[] = [];
  bookmarks: FileTreeNode[] = [];

  // Performance monitoring
  performanceMetrics: any = {};
  memoryUsage: number = 0;
  cpuUsage: number = 0;

  // Collaboration
  collaborators: any[] = [];
  cursorPositions: Map<string, any> = new Map();
  comments: any[] = [];

  // Testing
  testResults: any[] = [];
  testCoverage: any = {};

  // Deployment
  deploymentConfigs: any[] = [];
  ciCdPipelines: any[] = [];

  // Security
  securityScanResults: any[] = [];
  vulnerabilities: any[] = [];

  // Additional properties for template
  activeTerminalIndex = 0;
  splitEditors: boolean = false;
  activeEditorGroup = 0;
  editorGroups: any[] = [{ files: [], activeFile: null }];

  constructor(
    private projectService: ProjectService,
    private ideService: IDEService,
    private gitService: GitService,
    private terminalService: IdeTerminalService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.initializeCommandPalette();
  }

  ngOnInit() {
    this.loadProject();
    this.setupWebSocket();
  }

  ngAfterViewInit() {
    this.initMonacoEditor();
    this.initTerminal();
  }

  ngOnDestroy() {
    if (this.editor) {
      this.editor.dispose();
    }
    // Dispose all terminals
    this.terminals.forEach(term => {
      term.terminal.dispose();
    });
    this.terminals = [];
    this.terminalService.disconnect();
  }

  private loadProject() {
    // Assume project ID from route or state
    const projectId = 'current-project-id'; // TODO: get from route
    const userId = 'current-user-id'; // TODO: get from auth
    this.projectService.getUserProject(userId, projectId).subscribe(project => {
      this.project = project;
      this.loadFileTree();
      this.loadGitStatus();
    });
  }

  private loadFileTree() {
    if (this.project) {
      this.ideService.getProjectStructure(this.project.id).subscribe(response => {
        this.files = response.files;
      });
    }
  }

  private loadGitStatus() {
    // TODO: Implement git status loading
    this.gitStatus = { branch: 'main', ahead: 0, behind: 0, staged: [], unstaged: [], untracked: [], conflicts: [] };
  }

  private setupWebSocket() {
    // Assume sessionId is available, perhaps from creating terminal
    const sessionId = 'terminal-session-id'; // TODO: get or create session
    this.terminalService.connectToTerminal(sessionId).subscribe(message => {
      const activeTerminal = this.terminals.find(t => t.id === this.activeTerminalId);
      if (activeTerminal && typeof message.data === 'string') {
        activeTerminal.terminal.write(message.data);
      }
    });
  }

  private initMonacoEditor() {
    this.editor = monaco.editor.create(this.editorContainer.nativeElement, {
      value: '',
      language: 'typescript',
      theme: 'vs-dark',
      automaticLayout: true
    });
  }

  private initTerminal() {
    // Create the first terminal
    this.createNewTerminal();
  }

  openFile(file: FileTreeNode) {
    if (file.type === 'file') {
      this.activeFile = file;
      // Add to open files if not already open
      if (!this.openFiles.find(f => f.path === file.path)) {
        this.openFiles.push(file);
        this.recentFiles.unshift(file);
        if (this.recentFiles.length > 10) {
          this.recentFiles = this.recentFiles.slice(0, 10);
        }
      }

      this.ideService.readFile(this.project!.id, file.path).subscribe(response => {
        this.editor?.setValue(response.content);
        const language = this.getLanguageFromPath(file.path);
        monaco.editor.setModelLanguage(this.editor!.getModel()!, language);
        this.updateEditorDecorations();
      });
    }
  }

  closeFile(file: FileTreeNode) {
    const index = this.openFiles.findIndex(f => f.path === file.path);
    if (index !== -1) {
      this.openFiles.splice(index, 1);
      if (this.activeFile?.path === file.path) {
        this.activeFile = this.openFiles.length > 0 ? this.openFiles[Math.max(0, index - 1)] : null;
        if (this.activeFile) {
          this.openFile(this.activeFile);
        }
      }
    }
  }

  switchToFile(file: FileTreeNode) {
    this.activeFile = file;
    this.openFile(file);
  }

  createNewFileFromTemplate(template: any) {
    // TODO: Implement file creation from template
    console.log('Creating file from template:', template);
  }

  duplicateFile(file: FileTreeNode) {
    const newName = file.name.replace(/\.[^/.]+$/, '_copy$&');
    const newPath = file.path.replace(file.name, newName);
    // TODO: Implement file duplication
    console.log('Duplicating file:', file.name, 'to:', newName);
  }

  renameFile(file: FileTreeNode, newName: string) {
    // TODO: Implement file renaming
    console.log('Renaming file:', file.name, 'to:', newName);
  }

  deleteFile(file: FileTreeNode) {
    // TODO: Implement file deletion with confirmation
    console.log('Deleting file:', file.name);
  }

  addBookmark(file: FileTreeNode) {
    if (!this.bookmarks.find(b => b.path === file.path)) {
      this.bookmarks.push(file);
    }
  }

  removeBookmark(file: FileTreeNode) {
    this.bookmarks = this.bookmarks.filter(b => b.path !== file.path);
  }

  private getLanguageFromPath(path: string): string {
    const ext = path.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts': return 'typescript';
      case 'js': return 'javascript';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'scss': return 'scss';
      case 'json': return 'json';
      default: return 'plaintext';
    }
  }

  onCodeChange() {
    if (this.activeFile && this.project) {
      const content = this.editor?.getValue() || '';
      this.ideService.writeFile(this.project.id, this.activeFile.path, content).subscribe();
    }
  }

  sendTerminalCommand(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    if (input) {
      this.terminalService.sendData(input + '\n');
      (event.target as HTMLInputElement).value = '';
    }
  }

  askAssistant(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    if (input) {
      this.chatMessages.push({ role: 'user', content: input, timestamp: new Date() });
      // TODO: Implement AI chat
      setTimeout(() => {
        this.chatMessages.push({ role: 'assistant', content: 'AI response placeholder', timestamp: new Date() });
      }, 1000);
      (event.target as HTMLInputElement).value = '';
    }
  }

  // Git methods
  commitChanges() {
    // TODO: Implement git commit
    alert('Commit functionality not implemented yet');
  }

  // Enhanced IDE methods
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Command palette shortcut
    if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
      event.preventDefault();
      this.openCommandPalette();
    }

    // Save shortcut
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      this.saveCurrentFile();
    }

    // Search shortcut
    if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
      event.preventDefault();
      this.openSearch();
    }
  }

  private initializeCommandPalette() {
    this.availableCommands = [
      { id: 'file.new', title: 'New File', action: () => this.createNewFile() },
      { id: 'file.save', title: 'Save File', action: () => this.saveCurrentFile() },
      { id: 'file.open', title: 'Open File', action: () => this.openFileDialog() },
      { id: 'git.commit', title: 'Git Commit', action: () => this.commitChanges() },
      { id: 'git.push', title: 'Git Push', action: () => this.gitPush() },
      { id: 'git.pull', title: 'Git Pull', action: () => this.gitPull() },
      { id: 'terminal.new', title: 'New Terminal', action: () => this.createNewTerminal() },
      { id: 'search.global', title: 'Global Search', action: () => this.openSearch() },
      { id: 'debug.start', title: 'Start Debugging', action: () => this.startDebugging() },
      { id: 'k8s.dashboard', title: 'Kubernetes Dashboard', action: () => this.openK8sDashboard() }
    ];
  }

  openCommandPalette() {
    this.commandPaletteOpen = true;
    this.commandPaletteQuery = '';
  }

  closeCommandPalette() {
    this.commandPaletteOpen = false;
  }

  executeCommand(command: any) {
    command.action();
    this.closeCommandPalette();
  }

  filterCommands(): any[] {
    if (!this.commandPaletteQuery) return this.availableCommands;
    return this.availableCommands.filter(cmd =>
      cmd.title.toLowerCase().includes(this.commandPaletteQuery.toLowerCase())
    );
  }

  // File operations
  createNewFile() {
    // TODO: Implement new file creation
    console.log('Creating new file...');
  }

  saveCurrentFile() {
    this.onCodeChange();
  }

  openFileDialog() {
    // TODO: Implement file dialog
    console.log('Opening file dialog...');
  }

  // Advanced Git operations
  gitPush() {
    // TODO: Implement git push with force option
    console.log('Pushing to remote...');
  }

  gitPull() {
    // TODO: Implement git pull with rebase option
    console.log('Pulling from remote...');
  }

  gitFetch() {
    // TODO: Implement git fetch
    console.log('Fetching from remote...');
  }

  gitMerge(branch: string) {
    // TODO: Implement git merge
    console.log('Merging branch:', branch);
  }

  gitRebase(branch: string) {
    // TODO: Implement git rebase
    console.log('Rebasing onto branch:', branch);
  }

  createBranch(branchName: string) {
    // TODO: Implement branch creation
    console.log('Creating branch:', branchName);
  }

  switchBranch(branchName: string) {
    // TODO: Implement branch switching
    console.log('Switching to branch:', branchName);
  }

  deleteBranch(branchName: string) {
    // TODO: Implement branch deletion
    console.log('Deleting branch:', branchName);
  }

  resolveConflict(file: FileTreeNode) {
    // TODO: Implement conflict resolution
    console.log('Resolving conflict in file:', file.name);
  }

  gitStash() {
    // TODO: Implement git stash
    console.log('Stashing changes...');
  }

  gitStashPop() {
    // TODO: Implement git stash pop
    console.log('Popping stashed changes...');
  }

  // Terminal operations
  createNewTerminal() {
    const terminalId = `terminal-${Date.now()}`;
    const fitAddon = new FitAddon();
    const terminal = new Terminal({
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4'
      }
    });

    this.terminals.push({
      id: terminalId,
      name: `Terminal ${this.terminals.length + 1}`,
      terminal,
      fitAddon
    });

    this.activeTerminalId = terminalId;
  }

  switchTerminal(terminalId: string) {
    this.activeTerminalId = terminalId;
  }

  closeTerminal(terminalId: string) {
    this.terminals = this.terminals.filter(t => t.id !== terminalId);
    if (this.activeTerminalId === terminalId && this.terminals.length > 0) {
      this.activeTerminalId = this.terminals[0].id;
    }
  }

  // Search operations
  openSearch() {
    // TODO: Implement global search
    console.log('Opening global search...');
  }

  performSearch() {
    if (!this.searchQuery.trim()) return;

    // TODO: Implement advanced search with regex, case sensitivity, whole word matching
    const searchOptions = {
      query: this.searchQuery,
      caseSensitive: this.searchCaseSensitive,
      regex: this.searchRegex,
      wholeWord: this.searchWholeWord
    };

    // Search in current file
    if (this.activeFile && this.editor) {
      const model = this.editor.getModel();
      if (model) {
        const matches = model.findMatches(
          this.searchQuery,
          false,
          this.searchRegex,
          this.searchCaseSensitive,
          this.searchWholeWord ? 'word' : null,
          true
        );
        this.searchResults = matches.map(match => ({
          file: this.activeFile!.name,
          path: this.activeFile!.path,
          line: match.range.startLineNumber,
          column: match.range.startColumn,
          text: model.getLineContent(match.range.startLineNumber),
          range: match.range
        }));
      }
    }

    // TODO: Search across all files in project
    console.log('Searching for:', searchOptions);
  }

  performReplace() {
    if (!this.searchQuery.trim() || !this.replaceQuery) return;

    // TODO: Implement replace functionality
    if (this.editor) {
      const model = this.editor.getModel();
      if (model) {
        const edit = {
          range: model.getFullModelRange(),
          text: model.getValue().replace(
            new RegExp(this.searchQuery, this.searchRegex ? 'g' : 'g' + (this.searchCaseSensitive ? '' : 'i')),
            this.replaceQuery
          )
        };
        model.pushEditOperations([], [edit], () => null);
      }
    }
  }

  replaceAll() {
    // TODO: Implement replace all across files
    console.log('Replacing all occurrences');
  }

  goToLine(line: number, column?: number) {
    if (this.editor) {
      this.editor.revealLine(line);
      this.editor.setPosition({ lineNumber: line, column: column || 1 });
      this.editor.focus();
    }
  }

  goToSymbol(symbol: string) {
    // TODO: Implement symbol navigation
    console.log('Going to symbol:', symbol);
  }

  // AI-Powered Features
  sendChatMessage() {
    if (!this.commandInput.trim()) return;

    this.chatMessages.push({
      role: 'user',
      content: this.commandInput,
      timestamp: new Date()
    });

    this.isAiThinking = true;
    this.commandInput = '';

    // TODO: Implement actual AI chat with backend integration
    setTimeout(() => {
      this.chatMessages.push({
        role: 'assistant',
        content: 'AI response placeholder - This would integrate with your AI backend',
        timestamp: new Date()
      });
      this.isAiThinking = false;
    }, 1500);
  }

  getAISuggestions() {
    // TODO: Get AI-powered code completion suggestions
    if (this.editor) {
      const position = this.editor.getPosition();
      // TODO: Call AI service for suggestions
      this.aiSuggestions = [
        { text: 'console.log', kind: 'function' },
        { text: 'forEach', kind: 'method' },
        { text: 'map', kind: 'method' }
      ];
    }
  }

  applyAIRefactoring() {
    // TODO: Implement AI-powered code refactoring
    console.log('Applying AI refactoring...');
  }

  explainCode() {
    // TODO: Get AI explanation of selected code
    if (this.editor) {
      const selection = this.editor.getSelection();
      if (selection) {
        const selectedText = this.editor.getModel()?.getValueInRange(selection);
        console.log('Explaining code:', selectedText);
      }
    }
  }

  generateUnitTests() {
    // TODO: Generate unit tests using AI
    console.log('Generating unit tests...');
  }

  optimizeCode() {
    // TODO: AI-powered code optimization
    console.log('Optimizing code...');
  }

  // Advanced Debugging
  startDebugging() {
    // TODO: Implement debugging session start
    console.log('Starting debugger...');
    this.debugSession = { active: true, breakpoints: this.breakpoints };
  }

  stopDebugging() {
    // TODO: Implement debugging session stop
    console.log('Stopping debugger...');
    this.debugSession = null;
    this.debugVariables = [];
    this.debugCallStack = [];
  }

  toggleBreakpoint(line: number) {
    const existing = this.breakpoints.find(bp => bp.line === line && bp.file === this.activeFile?.path);
    if (existing) {
      this.breakpoints = this.breakpoints.filter(bp => bp !== existing);
    } else {
      this.breakpoints.push({
        file: this.activeFile!.path,
        line: line,
        enabled: true,
        condition: null
      });
    }
    this.updateEditorDecorations();
  }

  stepOver() {
    // TODO: Implement step over
    console.log('Stepping over...');
  }

  stepInto() {
    // TODO: Implement step into
    console.log('Stepping into...');
  }

  stepOut() {
    // TODO: Implement step out
    console.log('Stepping out...');
  }

  continueExecution() {
    // TODO: Implement continue
    console.log('Continuing execution...');
  }

  addWatchExpression(expression: string) {
    if (!this.debugWatchExpressions.includes(expression)) {
      this.debugWatchExpressions.push(expression);
    }
  }

  removeWatchExpression(expression: string) {
    this.debugWatchExpressions = this.debugWatchExpressions.filter(exp => exp !== expression);
  }

  // Kubernetes
  openK8sDashboard() {
    // TODO: Implement K8s dashboard
    console.log('Opening Kubernetes dashboard...');
  }

  // Panel management
  toggleLeftPanel() {
    this.leftPanelCollapsed = !this.leftPanelCollapsed;
  }

  toggleRightPanel() {
    this.rightPanelCollapsed = !this.rightPanelCollapsed;
  }

  toggleBottomPanel() {
    this.bottomPanelCollapsed = !this.bottomPanelCollapsed;
  }

  // Settings
  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    // TODO: Apply theme changes
  }

  updateFontSize() {
    if (this.editor) {
      const fontSize = this.fontSize;
      this.editor.updateOptions({ fontSize });
    }
  }

  toggleWordWrap() {
    if (this.editor) {
      this.editor.updateOptions({ wordWrap: this.wordWrap ? 'on' : 'off' });
    }
  }

  // Collaboration Features
  shareProject() {
    // TODO: Generate shareable link for collaboration
    console.log('Sharing project...');
  }

  inviteCollaborator(email: string) {
    // TODO: Send invitation to collaborator
    console.log('Inviting collaborator:', email);
  }

  addComment(file: FileTreeNode, line: number, content: string) {
    // TODO: Add comment to specific line
    const comment = {
      id: Date.now().toString(),
      file: file.path,
      line: line,
      content: content,
      author: 'current-user',
      timestamp: new Date()
    };
    this.comments.push(comment);
  }

  resolveComment(commentId: string) {
    // TODO: Mark comment as resolved
    const comment = this.comments.find(c => c.id === commentId);
    if (comment) {
      comment.resolved = true;
    }
  }

  // Performance Monitoring
  startPerformanceMonitoring() {
    // TODO: Start monitoring performance metrics
    setInterval(() => {
      this.updatePerformanceMetrics();
    }, 5000);
  }

  updatePerformanceMetrics() {
    // TODO: Update memory, CPU usage, etc.
    this.memoryUsage = Math.random() * 100;
    this.cpuUsage = Math.random() * 100;
  }

  // Testing Integration
  runTests() {
    // TODO: Run test suite
    console.log('Running tests...');
    // Simulate test results
    setTimeout(() => {
      this.testResults = [
        { name: 'test1', status: 'passed', duration: 100 },
        { name: 'test2', status: 'failed', duration: 50, error: 'Assertion failed' }
      ];
    }, 2000);
  }

  runTestCoverage() {
    // TODO: Generate test coverage report
    console.log('Generating test coverage...');
    this.testCoverage = {
      statements: 85,
      branches: 80,
      functions: 90,
      lines: 85
    };
  }

  // Deployment and CI/CD
  deployToProduction() {
    // TODO: Deploy to production environment
    console.log('Deploying to production...');
  }

  runCI() {
    // TODO: Run CI pipeline
    console.log('Running CI pipeline...');
  }

  configureDeployment() {
    // TODO: Configure deployment settings
    console.log('Configuring deployment...');
  }

  // Security Features
  runSecurityScan() {
    // TODO: Run security vulnerability scan
    console.log('Running security scan...');
    // Simulate security results
    setTimeout(() => {
      this.securityScanResults = [
        { severity: 'high', description: 'SQL injection vulnerability', file: 'app.js', line: 25 },
        { severity: 'medium', description: 'Outdated dependency', package: 'lodash', version: '4.17.0' }
      ];
    }, 3000);
  }

  // Extensions Management
  loadExtensions() {
    // TODO: Load user extensions
    this.extensions = [
      { id: 'prettier', name: 'Prettier', enabled: true },
      { id: 'eslint', name: 'ESLint', enabled: true },
      { id: 'gitlens', name: 'GitLens', enabled: false },
      { id: 'docker', name: 'Docker', enabled: true },
      { id: 'kubernetes', name: 'Kubernetes', enabled: true }
    ];
  }

  toggleExtension(extension: any) {
    extension.enabled = !extension.enabled;
    // TODO: Actually enable/disable extension
    if (extension.enabled) {
      this.loadExtension(extension);
    } else {
      this.unloadExtension(extension);
    }
  }

  loadExtension(extension: any) {
    // TODO: Load extension dynamically
    console.log('Loading extension:', extension.name);
  }

  unloadExtension(extension: any) {
    // TODO: Unload extension
    console.log('Unloading extension:', extension.name);
  }

  // Utility Methods
  updateEditorDecorations() {
    if (!this.editor) return;

    const decorations: monaco.editor.IModelDeltaDecoration[] = [];

    // Add breakpoint decorations
    this.breakpoints
      .filter(bp => bp.file === this.activeFile?.path)
      .forEach(bp => {
        decorations.push({
          range: new monaco.Range(bp.line, 1, bp.line, 1),
          options: {
            isWholeLine: true,
            className: 'breakpoint-decoration',
            glyphMarginClassName: 'breakpoint-glyph'
          }
        });
      });

    this.editor.deltaDecorations([], decorations);
  }

  formatDocument() {
    if (this.editor) {
      this.editor.getAction('editor.action.formatDocument')?.run();
    }
  }

  toggleSplitEditors() {
    this.splitEditors = !this.splitEditors;
    // TODO: Implement split editor functionality
  }

  createNewEditorGroup() {
    this.editorGroups.push({ files: [], activeFile: null });
  }

  closeEditorGroup(groupIndex: number) {
    if (this.editorGroups.length > 1) {
      this.editorGroups.splice(groupIndex, 1);
      this.activeEditorGroup = Math.min(this.activeEditorGroup, this.editorGroups.length - 1);
    }
  }

  // Additional methods for template
  closeFileFromTab(file: FileTreeNode) {
    // TODO: Implement file closing
    console.log('Closing file:', file.name);
  }

  onPaletteKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closeCommandPalette();
    }
  }

  getCommandShortcut(commandId: string): string {
    const shortcutMap: { [key: string]: string } = {
      'file.new': 'Ctrl+N',
      'file.save': 'Ctrl+S',
      'file.open': 'Ctrl+O',
      'git.commit': 'Ctrl+Shift+G',
      'git.push': 'Ctrl+Shift+P',
      'git.pull': 'Ctrl+Shift+L',
      'terminal.new': 'Ctrl+Shift+`',
      'search.global': 'Ctrl+Shift+F',
      'debug.start': 'F5',
      'k8s.dashboard': 'Ctrl+Shift+K'
    };
    return shortcutMap[commandId] || '';
  }

  getCommandIcon(commandId: string): string {
    const iconMap: { [key: string]: string } = {
      'file.new': 'add',
      'file.save': 'save',
      'file.open': 'folder_open',
      'git.commit': 'commit',
      'git.push': 'publish',
      'git.pull': 'download',
      'terminal.new': 'terminal',
      'search.global': 'search',
      'debug.start': 'play_arrow',
      'k8s.dashboard': 'cloud'
    };
    return iconMap[commandId] || 'code';
  }

}
