import { Injectable, inject, computed } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { IDEService } from '../../services/api/ide.service';
import { IdeTerminalService } from '../../services/websocket/ide-terminal.service';

export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  isExpanded?: boolean;
  isSelected?: boolean;
  content?: string;
  language?: string;
  lastModified?: string;
  size?: number;
}

export interface OpenFile {
  node: FileNode;
  isDirty: boolean;
  cursorPosition: { line: number; column: number };
  scrollPosition: { top: number; left: number };
}

export interface TerminalSession {
  id: string;
  name: string;
  isActive: boolean;
  output: string[];
  currentDirectory: string;
}

export interface IDEState {
  projectId: string | null;
  fileTree: FileNode[];
  openFiles: OpenFile[];
  activeFile: OpenFile | null;
  selectedNodes: Set<string>;
  loading: boolean;
  error: string | null;
  terminals: TerminalSession[];
  activeTerminal: TerminalSession | null;
  isTerminalConnected: boolean;
  diagnostics: Array<{
    file: string;
    line: number;
    column: number;
    severity: 'error' | 'warning' | 'info';
    message: string;
    code?: string;
  }>;
  aiCompletions: Array<{
    label: string;
    detail?: string;
    documentation?: string;
    insertText: string;
    kind?: 'method' | 'function' | 'variable' | 'class' | 'interface' | 'keyword' | 'snippet';
    range?: { startLineNumber: number; startColumn: number; endLineNumber: number; endColumn: number };
  }>;
  searchResults: Array<{
    file: string;
    line: number;
    column: number;
    preview: string;
  }>;
}

const initialState: IDEState = {
  projectId: null,
  fileTree: [],
  openFiles: [],
  activeFile: null,
  selectedNodes: new Set(),
  loading: false,
  error: null,
  terminals: [],
  activeTerminal: null,
  isTerminalConnected: false,
  diagnostics: [],
  aiCompletions: [],
  searchResults: []
};

export const IDEStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, ideService = inject(IDEService), terminalService = inject(IdeTerminalService)) => ({
    // Load file tree
    loadFileTree: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((projectId) => ideService.getFileTree(projectId).pipe(
          tapResponse({
            next: (tree) => {
              patchState(store, {
                projectId,
                fileTree: [tree as any],
                loading: false
              });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to load file tree',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Open file
    openFile: rxMethod<{ projectId: string; filePath: string }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ projectId, filePath }) => ideService.getFileContent(projectId, filePath).pipe(
          tapResponse({
            next: (content) => {
              patchState(store, (state) => {
                const existingIndex = state.openFiles.findIndex(f => f.node.path === filePath);
                if (existingIndex >= 0) {
                  return {
                    activeFile: state.openFiles[existingIndex],
                    loading: false
                  };
                }

                const fileNode: FileNode = {
                  id: filePath,
                  name: filePath.split('/').pop() || filePath,
                  path: filePath,
                  type: 'file',
                  content: content?.content || '',
                  language: getLanguageFromPath(filePath)
                };

                const openFile: OpenFile = {
                  node: fileNode,
                  isDirty: false,
                  cursorPosition: { line: 1, column: 1 },
                  scrollPosition: { top: 0, left: 0 }
                };

                return {
                  openFiles: [...state.openFiles, openFile],
                  activeFile: openFile,
                  loading: false
                };
              });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to open file',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Save file
    saveFile: rxMethod<{ projectId: string; filePath: string; content: string }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ projectId, filePath, content }) => ideService.saveFile(projectId, filePath, content).pipe(
          tapResponse({
            next: () => {
              patchState(store, (state) => {
                const updatedFiles = state.openFiles.map(f =>
                  f.node.path === filePath ? { ...f, isDirty: false } : f
                );
                return {
                  openFiles: updatedFiles,
                  activeFile: state.activeFile?.node.path === filePath
                    ? { ...state.activeFile, isDirty: false }
                    : state.activeFile,
                  loading: false
                };
              });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to save file',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Close file
    closeFile: (filePath: string) => {
      patchState(store, (state) => {
        const updatedFiles = state.openFiles.filter(f => f.node.path !== filePath);
        const newActiveFile = state.activeFile?.node.path === filePath
          ? updatedFiles[updatedFiles.length - 1] || null
          : state.activeFile;

        return {
          openFiles: updatedFiles,
          activeFile: newActiveFile
        };
      });
    },

    // Set active file
    setActiveFile: (filePath: string) => {
      patchState(store, (state) => {
        const file = state.openFiles.find(f => f.node.path === filePath);
        return { activeFile: file || null };
      });
    },

    // Update file content
    updateFileContent: (filePath: string, content: string) => {
      patchState(store, (state) => {
        const updatedFiles = state.openFiles.map(f =>
          f.node.path === filePath
            ? { ...f, node: { ...f.node, content }, isDirty: true }
            : f
        );
        return {
          openFiles: updatedFiles,
          activeFile: state.activeFile?.node.path === filePath
            ? { ...state.activeFile, node: { ...state.activeFile.node, content }, isDirty: true }
            : state.activeFile
        };
      });
    },

    // Toggle directory expansion
    toggleDirectory: (path: string) => {
      patchState(store, (state) => ({
        fileTree: toggleNodeExpansion(state.fileTree, path)
      }));
    },

    // Select node
    selectNode: (path: string, multiSelect: boolean = false) => {
      patchState(store, (state) => {
        const newSelection = new Set(multiSelect ? state.selectedNodes : []);
        if (newSelection.has(path)) {
          newSelection.delete(path);
        } else {
          newSelection.add(path);
        }
        return { selectedNodes: newSelection };
      });
    },

    // Create terminal session
    createTerminal: rxMethod<string>(
      pipe(
        switchMap((projectId) => ideService.createTerminal({ workspace_id: projectId }).pipe(
          tapResponse({
            next: (session: any) => {
              patchState(store, (state) => {
                const terminal: TerminalSession = {
                  id: session.id,
                  name: `Terminal ${state.terminals.length + 1}`,
                  isActive: true,
                  output: [],
                  currentDirectory: session.cwd || '/'
                };
                return {
                  terminals: [...state.terminals, terminal],
                  activeTerminal: terminal,
                  isTerminalConnected: true
                };
              });
              // Connect to WebSocket
              terminalService.connectToTerminal(session.id).subscribe({
                next: (message) => {
                  patchState(store, (state) => {
                    const terminalOutput = typeof message.data === 'string' ? message.data : JSON.stringify(message.data);
                    const updatedTerminals = state.terminals.map(t =>
                      t.id === session.id
                        ? { ...t, output: [...t.output, terminalOutput] }
                        : t
                    );
                    return {
                      terminals: updatedTerminals,
                      activeTerminal: state.activeTerminal && state.activeTerminal.id === session.id
                        ? { ...state.activeTerminal, output: [...state.activeTerminal.output, terminalOutput] }
                        : state.activeTerminal
                    };
                  });
                },
                error: (error) => {
                  patchState(store, {
                    error: error.message || 'Terminal connection error',
                    isTerminalConnected: false
                  });
                }
              });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to create terminal'
              });
            }
          })
        ))
      )
    ),

    // Send terminal command
    sendTerminalCommand: (command: string) => {
      terminalService.sendData(command + '\n');
    },

    // Resize terminal
    resizeTerminal: (cols: number, rows: number) => {
      terminalService.resizeTerminal({ cols, rows });
    },

    // Close terminal
    closeTerminal: (terminalId: string) => {
      terminalService.closeTerminal();
      patchState(store, (state) => {
        const updatedTerminals = state.terminals.filter(t => t.id !== terminalId);
        return {
          terminals: updatedTerminals,
          activeTerminal: state.activeTerminal?.id === terminalId
            ? updatedTerminals[updatedTerminals.length - 1] || null
            : state.activeTerminal,
          isTerminalConnected: updatedTerminals.length > 0
        };
      });
    },

    // Set active terminal
    setActiveTerminal: (terminalId: string) => {
      patchState(store, (state) => {
        const terminal = state.terminals.find(t => t.id === terminalId);
        return { activeTerminal: terminal || null };
      });
    },

    // Update cursor position
    updateCursorPosition: (filePath: string, line: number, column: number) => {
      patchState(store, (state) => {
        const updatedFiles = state.openFiles.map(f =>
          f.node.path === filePath
            ? { ...f, cursorPosition: { line, column } }
            : f
        );
        return {
          openFiles: updatedFiles,
          activeFile: state.activeFile?.node.path === filePath
            ? { ...state.activeFile, cursorPosition: { line, column } }
            : state.activeFile
        };
      });
    },

    // Set AI completions
    setAICompletions: (completions: IDEState['aiCompletions']) => {
      patchState(store, { aiCompletions: completions });
    },

    // Clear AI completions
    clearAICompletions: () => {
      patchState(store, { aiCompletions: [] });
    },

    // Set diagnostics
    setDiagnostics: (diagnostics: IDEState['diagnostics']) => {
      patchState(store, { diagnostics });
    },

    // Clear diagnostics
    clearDiagnostics: () => {
      patchState(store, { diagnostics: [] });
    },

    // Set search results
    setSearchResults: (results: IDEState['searchResults']) => {
      patchState(store, { searchResults: results });
    },

    // Clear search results
    clearSearchResults: () => {
      patchState(store, { searchResults: [] });
    },

    // Clear error
    clearError: () => {
      patchState(store, { error: null });
    }
  })),
  withComputed((store) => ({
    // Check if has open files
    hasOpenFiles: computed(() => store.openFiles().length > 0),

    // Get open file count
    openFileCount: computed(() => store.openFiles().length),

    // Check if active file is dirty
    isActiveFileDirty: computed(() => store.activeFile()?.isDirty ?? false),

    // Get active file path
    activeFilePath: computed(() => store.activeFile()?.node.path),

    // Get active file language
    activeFileLanguage: computed(() => store.activeFile()?.node.language),

    // Get active file content
    activeFileContent: computed(() => store.activeFile()?.node.content),

    // Get active file cursor position
    activeFileCursor: computed(() => store.activeFile()?.cursorPosition),

    // Check if has terminals
    hasTerminals: computed(() => store.terminals().length > 0),

    // Get terminal count
    terminalCount: computed(() => store.terminals().length),

    // Get active terminal output
    activeTerminalOutput: computed(() => store.activeTerminal()?.output ?? []),

    // Check if terminal is connected
    isTerminalActive: computed(() => store.isTerminalConnected()),

    // Get error count
    errorCount: computed(() => store.diagnostics().filter(d => d.severity === 'error').length),

    // Get warning count
    warningCount: computed(() => store.diagnostics().filter(d => d.severity === 'warning').length),

    // Get info count
    infoCount: computed(() => store.diagnostics().filter(d => d.severity === 'info').length),

    // Check if has diagnostics
    hasDiagnostics: computed(() => store.diagnostics().length > 0),

    // Check if has search results
    hasSearchResults: computed(() => store.searchResults().length > 0),

    // Get selected node count
    selectedNodeCount: computed(() => store.selectedNodes().size),

    // Check if has selection
    hasSelection: computed(() => store.selectedNodes().size > 0)
  }))
);

// Helper function to get language from file path
function getLanguageFromPath(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase();
  const languageMap: Record<string, string> = {
    'ts': 'typescript',
    'tsx': 'typescript',
    'js': 'javascript',
    'jsx': 'javascript',
    'py': 'python',
    'java': 'java',
    'go': 'go',
    'rs': 'rust',
    'cpp': 'cpp',
    'c': 'c',
    'h': 'c',
    'hpp': 'cpp',
    'cs': 'csharp',
    'rb': 'ruby',
    'php': 'php',
    'swift': 'swift',
    'kt': 'kotlin',
    'scala': 'scala',
    'r': 'r',
    'sql': 'sql',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'less': 'less',
    'json': 'json',
    'yaml': 'yaml',
    'yml': 'yaml',
    'xml': 'xml',
    'md': 'markdown',
    'sh': 'shell',
    'bash': 'shell',
    'dockerfile': 'dockerfile'
  };
  return languageMap[ext || ''] || 'plaintext';
}

// Helper function to toggle node expansion
function toggleNodeExpansion(nodes: FileNode[], path: string): FileNode[] {
  return nodes.map(node => {
    if (node.path === path) {
      return { ...node, isExpanded: !node.isExpanded };
    }
    if (node.children) {
      return { ...node, children: toggleNodeExpansion(node.children, path) };
    }
    return node;
  });
}
