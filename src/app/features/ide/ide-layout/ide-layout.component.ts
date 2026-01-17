import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { MatTabsModule } from '@angular/material/tabs';
import { IdeService } from '../../../core/services/api/ide.service';
import { ToastService } from '../../../shared/services/toast.service';

declare const monaco: any;

interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
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
    MatTabsModule
  ],
  templateUrl: './ide-layout.component.html',
  styleUrl: './ide-layout.component.css'
})
export class IdeLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('editorContainer', { static: false }) editorContainer!: ElementRef;
  @ViewChild('terminalContainer', { static: false }) terminalContainer!: ElementRef;

  private ideService = inject(IdeService);
  private toast = inject(ToastService);

  editor: any;
  terminal: any;
  workspaceId = 'demo-workspace';
  currentFile: FileNode | null = null;
  openFiles: FileNode[] = [];

  fileTree: FileNode[] = [
    {
      name: 'src',
      path: '/src',
      isDirectory: true,
      children: [
        { name: 'main.ts', path: '/src/main.ts', isDirectory: false },
        { name: 'app.ts', path: '/src/app.ts', isDirectory: false }
      ]
    },
    {
      name: 'package.json',
      path: '/package.json',
      isDirectory: false
    }
  ];

  ngOnInit(): void {
    this.loadMonacoEditor();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeEditor();
      this.initializeTerminal();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.dispose();
    }
    if (this.terminal) {
      this.terminal.dispose();
    }
  }

  loadMonacoEditor(): void {
    if (typeof monaco !== 'undefined') {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js';
    script.onload = () => {
      (window as any).require.config({
        paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' }
      });
      (window as any).require(['vs/editor/editor.main'], () => {
        this.initializeEditor();
      });
    };
    document.head.appendChild(script);
  }

  initializeEditor(): void {
    if (!this.editorContainer || typeof monaco === 'undefined') {
      return;
    }

    this.editor = monaco.editor.create(this.editorContainer.nativeElement, {
      value: '// Welcome to AI Orchestrator IDE\n// Open a file from the file explorer to start editing\n\nconsole.log("Hello, World!");',
      language: 'typescript',
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: true },
      fontSize: 14,
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: false
    });
  }

  initializeTerminal(): void {
    // Terminal initialization would use xterm.js
    // For now, showing placeholder
    console.log('Terminal initialized');
  }

  openFile(file: FileNode): void {
    if (file.isDirectory) return;

    this.currentFile = file;

    if (!this.openFiles.find(f => f.path === file.path)) {
      this.openFiles.push(file);
    }

    // Load file content
    this.ideService.getFileContent(this.workspaceId, file.path).subscribe({
      next: (content) => {
        if (this.editor) {
          this.editor.setValue(content.content);
          const language = this.getLanguageFromPath(file.path);
          monaco.editor.setModelLanguage(this.editor.getModel(), language);
        }
      },
      error: (error) => {
        this.toast.error('Failed to load file');
        // Show demo content
        if (this.editor) {
          this.editor.setValue(`// ${file.name}\n// Demo content\n\nfunction example() {\n  return "Hello from ${file.name}";\n}`);
        }
      }
    });
  }

  closeFile(file: FileNode, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    const index = this.openFiles.findIndex(f => f.path === file.path);
    if (index > -1) {
      this.openFiles.splice(index, 1);
    }

    if (this.currentFile === file) {
      this.currentFile = this.openFiles.length > 0 ? this.openFiles[0] : null;
      if (this.currentFile) {
        this.openFile(this.currentFile);
      } else if (this.editor) {
        this.editor.setValue('// No file open');
      }
    }
  }

  saveFile(): void {
    if (!this.currentFile || !this.editor) return;

    const content = this.editor.getValue();

    this.ideService.updateFileContent(this.workspaceId, this.currentFile.path, { content }).subscribe({
      next: () => {
        this.toast.success('File saved successfully');
      },
      error: (error) => {
        this.toast.error('Failed to save file');
      }
    });
  }

  runCode(): void {
    this.toast.info('Run functionality will be implemented');
  }

  formatCode(): void {
    if (this.editor) {
      this.editor.getAction('editor.action.formatDocument').run();
      this.toast.success('Code formatted');
    }
  }

  getLanguageFromPath(path: string): string {
    const ext = path.split('.').pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      'ts': 'typescript',
      'js': 'javascript',
      'py': 'python',
      'java': 'java',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'md': 'markdown'
    };
    return languageMap[ext || ''] || 'plaintext';
  }
}
