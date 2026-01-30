# 🚀 AI Orchestrator Platform - Complete Development Brief for Antigravity AI Agent

## 📋 Executive Summary

You are tasked with developing a **revolutionary AI-powered Platform-as-a-Service (PaaS)** called **AI Orchestrator**. This is an enterprise-grade system that combines autonomous multi-agent AI orchestration, cloud IDE, DevOps automation, and quantum-ready security into a unified platform. The frontend is built with **Angular 21** using the "Antigravity" design system (deep space aesthetics with glassmorphism), and the backend API is fully documented in the provided OpenAPI 3.1 specification.

---

## 🎯 Mission Statement

**"Transform software development from a months-long struggle into a hours-long orchestrated symphony by deploying autonomous AI agents that handle the entire lifecycle—from design to deployment—within a stunning, zero-gravity interface."**

---

## 🏗️ System Architecture Overview

### **Technology Stack**

#### **Frontend (Your Primary Focus)**
- **Framework**: Angular 21 (standalone components, signals, inject())
- **State Management**: NgRx 18+ with Entity adapters
- **Styling**: TailwindCSS 4 with custom Antigravity theme
- **API Client**: Auto-generated from OpenAPI spec using `openapi-generator-cli`
- **Real-time**: RxJS 7+ WebSocket streams
- **Code Editor**: Monaco Editor (VSCode engine)
- **Terminal**: xterm.js with WebGL renderer
- **Charts**: Recharts or Apache ECharts
- **Animations**: Angular Animations with custom easing functions
- **Forms**: Angular Reactive Forms with Zod/Valibot validation
- **Icons**: Lucide Angular or Heroicons
- **Fonts**: JetBrains Mono for monospace, Inter for UI text

#### **Backend (Already Provided via API)**
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT (Access + Refresh tokens)
- **WebSockets**: FastAPI WebSocket support
- **Security**: Post-quantum encryption vault
- **Orchestration**: Multi-agent system with streaming responses

---

## 📐 Complete Feature Specification

### **1. AUTHENTICATION & AUTHORIZATION SYSTEM**

#### **1.1 User Registration Flow**
- **Endpoint**: `POST /api/v1/auth/register`
- **Input**: Email, password (min 8 chars, must have uppercase, lowercase, digit), full_name (optional), tenant_name (required)
- **Response**: JWT access token (30min expiry) + refresh token
- **UI Requirements**:
  - Centered auth layout with glassmorphic card
  - Real-time password strength indicator (weak/medium/strong)
  - Email validation with debounced availability check
  - Auto-create tenant workspace on successful registration
  - Redirect to onboarding wizard after signup

#### **1.2 Login Flow**
- **Endpoint**: `POST /api/v1/auth/login`
- **Input**: Email, password
- **Features**:
  - Remember me checkbox (stores refresh token securely)
  - "Forgot password" link (future feature, show placeholder)
  - OAuth2 social login buttons (GitHub, Google, Microsoft)
    - **Endpoint**: `GET /api/v1/auth/external/connect/{provider}`
  - Failed login attempt counter (lock after 5 attempts)

#### **1.3 Token Management**
- **Access Token**: Store in memory (service variable), expires in 30 minutes
- **Refresh Token**: Store in httpOnly cookie or encrypted localStorage
- **Auto-Refresh Logic**:
  - Intercept 401 responses
  - Call `POST /api/v1/auth/refresh` with refresh_token
  - Retry original request with new access token
  - If refresh fails → logout and redirect to login

#### **1.4 User Context (`/auth/me`)**
- **Endpoint**: `GET /api/v1/auth/me`
- **Returns**:
  ```typescript
  {
    user: UserResponseDTO,
    tenant: TenantResponseDTO,
    external_accounts: ExternalAccountDTO[],
    permissions: string[]
  }
  ```
- **Usage**: Load on app initialization, store in NgRx auth state

#### **1.5 Role-Based Access Control (RBAC)**
- **Roles**: `superuser`, `enterprise`, `pro_developer`, `developer`
- **Guards**: 
  - `AuthGuard`: Verify token exists
  - `RoleGuard`: Check user role matches required level
  - `TenantGuard`: Ensure user belongs to requested tenant
- **Directive**: `*hasRole="['enterprise', 'superuser']"` for template-level checks

---

### **2. DASHBOARD - THE COMMAND CENTER**

#### **2.1 Layout Structure**
```
┌─────────────────────────────────────────────────────────────┐
│  Top Bar: Logo | Search | Tenant Switcher | User Menu      │
├────────┬────────────────────────────────────────────────────┤
│        │  📊 Metrics Grid (Real-time)                       │
│        ├────────────────────────────────────────────────────┤
│ Side   │  🔥 Activity Feed (Live WebSocket Stream)          │
│ Nav    ├────────────────────────────────────────────────────┤
│        │  ⚡ Quick Actions (CTA Buttons)                    │
│        ├────────────────────────────────────────────────────┤
│        │  📈 System Health Chart                            │
└────────┴────────────────────────────────────────────────────┘
```

#### **2.2 Real-Time Metrics Cards**
Display these metrics with auto-refresh every 5 seconds:

**Card 1: System Resources**
- **Endpoint**: `GET /health` (custom parsing of response)
- **Display**: 
  - CPU Usage: Circular progress bar with percentage
  - RAM Usage: Horizontal bar with GB used/total
  - Disk Usage: Radial gauge
  - Color coding: Green (<70%), Yellow (70-90%), Red (>90%)

**Card 2: Active Agents**
- **Endpoint**: `GET /api/v1/agents/?page=1&limit=100`
- **Display**:
  - Total agent count badge
  - Status breakdown: Idle (green dot), Busy (yellow pulse), Error (red)
  - List of top 5 most recently active agents with avatars

**Card 3: Project Statistics**
- **Endpoint**: `GET /api/v1/projects/?page=1&limit=100`
- **Display**:
  - Total projects count
  - Status pie chart: Running, Stopped, Building, Failed
  - Quick filters to jump to project list

**Card 4: Storage Usage**
- **Source**: `tenant.storage_used_gb / tenant.storage_quota_gb`
- **Display**:
  - Progress ring with percentage
  - "X GB of Y GB used"
  - Warning if >90%

#### **2.3 Activity Feed (Live Stream)**
- **WebSocket**: `wss://api.example.com/ws/activity?token={jwt}`
- **Message Types**:
  ```typescript
  {
    type: 'agent.started' | 'agent.completed' | 'project.created' | 'build.failed',
    timestamp: string,
    actor: string, // user or agent name
    message: string,
    severity: 'info' | 'warning' | 'error' | 'success',
    metadata: { ... }
  }
  ```
- **UI**:
  - Infinite scroll list (newest on top)
  - Icon based on type (rocket, checkmark, alert)
  - Colored left border (blue=info, green=success, red=error)
  - Click to open relevant detail view
  - Persist last 100 events in local state

#### **2.4 Quick Actions Panel**
Interactive buttons that trigger common workflows:
- **"New Project"** → Opens project creation wizard modal
- **"Summon Agent"** → Opens agent creation form
- **"View Alerts"** → Navigate to `/alerts` page
- **"Open IDE"** → Navigate to `/ide` with last opened project
- **"Run Security Scan"** → Trigger scan on active project

---

### **3. AGENT SWARM SYSTEM**

#### **3.1 Agent Studio (Create/Edit Agent)**

**Form Fields (from `CreateAgentRequest` schema)**:
```typescript
{
  display_name: string (3-200 chars), // "Senior React Developer"
  agent_type: 'generalist' | 'specialist' | 'coordinator',
  role: string, // "frontend", "backend", "devops", "qa", "security"
  description?: string (max 1000 chars),
  
  // Model Configuration
  model: 'gpt-4' | 'claude-3-opus' | 'gemini-pro',
  temperature: number (0-2, default 0.7),
  max_tokens: number (100-8000, default 4000),
  
  // Capabilities
  tools: string[], // ["code_execution", "web_search", "file_write"]
  system_prompt?: string (max 10000 chars),
  
  // Context
  project_id?: string,
  metadata?: Record<string, any>
}
```

**UI Design**:
- **Step 1**: Choose agent type (cards with icons)
- **Step 2**: Configure model and parameters (sliders for temp/tokens)
- **Step 3**: Select tools (multi-select checkboxes with descriptions)
- **Step 4**: Write system prompt (Monaco editor with markdown preview)
- **Step 5**: Review and create (shows summary)

**Validation**:
- Display_name must be unique per user
- Temperature 0.0-2.0 with 0.1 steps
- System prompt syntax highlighting
- Tool compatibility warnings (e.g., "code_execution requires project context")

#### **3.2 Agent Swarm View (List All Agents)**

**Layout**: Grid of agent cards (3-4 per row on desktop)

**Agent Card Structure**:
```
┌─────────────────────────────────┐
│  🤖 [Avatar]    [Status Badge]  │
│  Frontend Specialist            │
│  Model: GPT-4 • Temp: 0.7       │
│  ────────────────────────────   │
│  Tools: 5 active                │
│  Last active: 2 min ago         │
│  ────────────────────────────   │
│  [Chat] [Edit] [Delete]         │
└─────────────────────────────────┘
```

**Filters**:
- By status: All, Idle, Busy, Error
- By role: Frontend, Backend, QA, DevOps, Security
- By model: GPT-4, Claude, Gemini
- Search by name

**Bulk Actions**:
- Select multiple → Delete selected
- Start/Stop all agents in a project

#### **3.3 Agent Chat Interface**

**Multi-Session Chat Support**:
- **Endpoint**: `POST /api/v1/chat/sessions` (create new session)
- **Message Endpoint**: `POST /api/v1/chat/{session_id}/messages`
- **WebSocket**: `wss://api.example.com/ws/chat/{session_id}`

**Chat UI Components**:

**Left Sidebar**:
- List of chat sessions (sorted by last message)
- "New Chat" button
- Session context: Agent name, project, created date
- Search sessions

**Main Chat Area**:
```
┌─────────────────────────────────────────────────┐
│  Agent: Frontend Specialist 🤖                  │
│  Project: E-commerce Dashboard                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  [User] Create a product listing component      │
│  10:23 AM                                       │
│                                                 │
│  [Agent] I'll create a responsive product card  │
│  with image, title, price, and add to cart...  │
│  ┌─────────────────────────────────────┐       │
│  │ // ProductCard.tsx                  │       │
│  │ export const ProductCard = ...      │       │
│  └─────────────────────────────────────┘       │
│  [Copy Code] [Apply to Project]                │
│  10:23 AM                                       │
│                                                 │
├─────────────────────────────────────────────────┤
│  📎 [Attach File] | 💬 Type a message... [Send]│
└─────────────────────────────────────────────────┘
```

**Streaming Response Handling**:
```typescript
// WebSocket receives chunks
{
  type: 'delta',
  session_id: '...',
  content: 'piece of response',
  is_final: false
}

// Accumulate deltas into message
// Show typing indicator while is_final === false
// Render markdown with syntax highlighting (use marked.js)
```

**File Attachment**:
- Drag-and-drop or click to upload
- Support: .txt, .md, .py, .js, .json, .yaml (max 10MB)
- **Endpoint**: `POST /api/v1/chat/{session_id}/attachments`
- Show file preview in chat bubble

**Code Block Actions**:
- **Copy**: Copy code to clipboard
- **Apply**: Write code to current project file tree
- **Download**: Download as file
- **Diff**: Show changes if modifying existing file

---

### **4. PROJECT LIFECYCLE MANAGEMENT**

#### **4.1 Project List View**

**Data Table with Advanced Features**:
- **Columns**: Name, Framework, Language, Status, Created, Last Updated, Actions
- **Endpoint**: `GET /api/v1/projects/?page={page}&limit={limit}&status={status}&framework={framework}`
- **Pagination**: Server-side with page size selector (10/20/50/100)
- **Sorting**: Click column headers to sort
- **Filtering**: 
  - Status: All, Running, Stopped, Building, Failed, Deploying
  - Framework: React, Vue, Angular, FastAPI, Django, Spring, etc.
  - Language: TypeScript, Python, Java, Go, Rust
  - Date range picker

**Status Badge Design**:
```typescript
{
  'running': { color: 'green', icon: 'play-circle', pulse: true },
  'stopped': { color: 'gray', icon: 'stop-circle' },
  'building': { color: 'blue', icon: 'loader', spin: true },
  'failed': { color: 'red', icon: 'alert-triangle' },
  'deploying': { color: 'purple', icon: 'upload', pulse: true }
}
```

**Row Actions**:
- **View**: Navigate to project details
- **Open in IDE**: Navigate to `/ide/{project_id}`
- **Start/Stop**: Toggle project runtime
- **Delete**: Confirm modal → `DELETE /api/v1/projects/{project_id}`
- **Clone**: Duplicate project with new name

#### **4.2 Project Creation Wizard**

**Step-by-Step Flow**:

**Step 1: Choose Framework**
- **Endpoint**: `GET /api/v1/registry/frameworks` (lists available templates)
- **Display**: Grid of framework cards with logos
  - Frontend: React, Vue, Angular, Svelte, Next.js, Nuxt
  - Backend: FastAPI, Django, Flask, Express, NestJS, Spring Boot
  - Mobile: React Native, Flutter
  - Fullstack: T3 Stack, MEAN, MERN, JAMstack

**Step 2: Define Project Goal**
- **Input**: Multi-line textarea (500 char max)
- **Placeholder**: "Build a real-time chat application with user authentication, message history, and file sharing"
- **AI Suggestion**: As user types, show suggested features based on keywords

**Step 3: Review AI Plan (Optional)**
- **Endpoint**: `POST /api/v1/projects/plan` (send framework + goal)
- **Response**: 
  ```typescript
  {
    architecture: string, // High-level overview
    file_structure: TreeNode[], // Directory tree
    technologies: string[], // Dependencies
    estimated_files: number,
    estimated_time: string // "~5 minutes"
  }
  ```
- **UI**: 
  - Expandable tree view of file structure
  - List of dependencies with versions
  - "Looks good" or "Edit goal" buttons

**Step 4: Configure Settings**
- **Project Name**: Text input (required, unique per tenant)
- **Description**: Textarea (optional)
- **Visibility**: Public, Private, Team
- **Git Integration**: 
  - Create new repo checkbox
  - Git provider dropdown (GitHub, GitLab, Bitbucket)
  - Repo name input
- **Environment Variables**: Key-value pairs (encrypted storage)

**Step 5: Create & Initialize**
- **Endpoint**: `POST /api/v1/projects/`
- **Payload**:
  ```typescript
  {
    name: string,
    description?: string,
    framework: string,
    language: string,
    goal: string,
    template_id?: string,
    git_config?: {
      provider: string,
      repo_name: string,
      auto_commit: boolean
    },
    env_vars?: Record<string, string>
  }
  ```
- **Response**: `ProjectInitializationResponse` with `project_id`, `status`, `initialization_task_id`
- **UI**: 
  - Show loading state with progress bar
  - WebSocket stream of initialization logs
  - Auto-redirect to project details when complete

#### **4.3 Project Detail View**

**Layout (Tabbed Interface)**:

**Tab 1: Overview**
- **README Rendering**: Parse project README.md and display with markdown
- **Stats Cards**:
  - Total files count
  - Lines of code (from metadata)
  - Last commit time (if Git enabled)
  - Deployment URL (if deployed)
- **Quick Actions**:
  - Open in IDE
  - Deploy now
  - Run tests
  - View logs

**Tab 2: Pipeline Visualization**
- **Visual Stepper** showing project lifecycle phases:
  ```
  [✓ Generate] → [⟳ Build] → [○ Test] → [○ Scan] → [○ Deploy]
  ```
- **Phase Details**:
  - **Generate**: Show agent assignments, files created
  - **Build**: Build logs, dependency installation progress
  - **Test**: Test results with pass/fail counts, coverage %
  - **Scan**: Security vulnerabilities, suggested fixes
  - **Deploy**: Deployment URL, container status, resource usage

**Tab 3: Files & Code**
- Lightweight file browser (not full IDE)
- Click file → View in read-only Monaco editor
- "Open in IDE" button to switch to full editor

**Tab 4: Settings**
- **General**: Name, description, visibility
- **Git**: Connected repo, branch, auto-commit settings
- **Environment**: Manage env vars with reveal/hide toggle
- **Protection**: Toggle "Protected" status (enterprise only)
  - Shows lock icon, requires 2FA to modify
- **Danger Zone**: Delete project (requires confirmation)

#### **4.4 Project Status Management**

**Endpoints**:
- `POST /api/v1/projects/{project_id}/start` → Start runtime
- `POST /api/v1/projects/{project_id}/stop` → Stop runtime
- `POST /api/v1/projects/{project_id}/restart` → Restart
- `GET /api/v1/projects/{project_id}/status` → Poll for status updates

**Real-time Status Updates**:
- WebSocket: `wss://api.example.com/ws/projects/{project_id}/status`
- Auto-reconnect on disconnect
- Update UI badges without page refresh

---

### **5. CLOUD IDE - "ANTIGRAVITY MODE"**

#### **5.1 IDE Layout Architecture**

**Full-Screen Layout with Resizable Panes**:
```
┌────────────────────────────────────────────────────────────┐
│  Top Bar: Project Name | Branch | [Run] [Debug] [Deploy]  │
├──────────┬─────────────────────────────────────┬───────────┤
│          │                                     │           │
│  File    │                                     │   AI      │
│  Explorer│        Monaco Editor                │  Assistant│
│  (250px) │        (Flex-grow)                  │  (300px)  │
│          │                                     │           │
│          │                                     │           │
├──────────┴─────────────────────────────────────┴───────────┤
│  Integrated Terminal (xterm.js) - Collapsible (200px)     │
└────────────────────────────────────────────────────────────┘
```

**Pane Resizing**:
- Use Angular CDK Drag-Drop or custom resize handles
- Save pane sizes to localStorage
- Double-click divider to reset to defaults

#### **5.2 File Explorer Component**

**Features**:
- **Lazy Loading**: Only load visible folder contents
- **Virtual Scrolling**: For projects with 1000+ files
- **Context Menu**: Right-click → New File, New Folder, Rename, Delete, Download
- **File Icons**: Use `vscode-icons` or similar library
- **Search**: Fuzzy search across all files (Cmd+P)
- **Multi-select**: Shift+Click for bulk operations

**API Integration**:
- `GET /api/v1/projects/{project_id}/files` → List root files
- `GET /api/v1/projects/{project_id}/files?path={folder_path}` → List folder contents
- `GET /api/v1/projects/{project_id}/files/content?path={file_path}` → Get file content
- `POST /api/v1/projects/{project_id}/files` → Create file/folder
- `PUT /api/v1/projects/{project_id}/files?path={file_path}` → Update file
- `DELETE /api/v1/projects/{project_id}/files?path={file_path}` → Delete file

**Tree Node Structure**:
```typescript
interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  size?: number;
  extension?: string;
  children?: FileNode[];
  isExpanded?: boolean;
  isLoaded?: boolean;
}
```

#### **5.3 Monaco Editor Integration**

**Setup**:
```typescript
import * as monaco from 'monaco-editor';

// Configure worker paths
(window as any).MonacoEnvironment = {
  getWorkerUrl: (moduleId: string, label: string) => {
    if (label === 'json') return './json.worker.bundle.js';
    if (label === 'css' || label === 'scss') return './css.worker.bundle.js';
    if (label === 'html' || label === 'handlebars') return './html.worker.bundle.js';
    if (label === 'typescript' || label === 'javascript') return './ts.worker.bundle.js';
    return './editor.worker.bundle.js';
  }
};
```

**Editor Configuration**:
```typescript
{
  theme: 'antigravity-dark', // Custom theme
  fontSize: 14,
  fontFamily: 'JetBrains Mono',
  lineNumbers: 'on',
  minimap: { enabled: true },
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  insertSpaces: true,
  wordWrap: 'on',
  formatOnPaste: true,
  formatOnType: true,
  suggestOnTriggerCharacters: true,
  quickSuggestions: true,
  folding: true,
  glyphMargin: true, // For breakpoints
  lightbulb: { enabled: true } // For code actions
}
```

**Custom "Antigravity Dark" Theme**:
```typescript
monaco.editor.defineTheme('antigravity-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6B7280', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'A855F7', fontStyle: 'bold' },
    { token: 'string', foreground: '10B981' },
    { token: 'number', foreground: 'F59E0B' },
    { token: 'function', foreground: '06B6D4' },
    { token: 'variable', foreground: 'F8FAFC' },
    { token: 'type', foreground: '6366F1' }
  ],
  colors: {
    'editor.background': '#05050A',
    'editor.foreground': '#F8FAFC',
    'editor.lineHighlightBackground': '#1E293B',
    'editorCursor.foreground': '#06B6D4',
    'editor.selectionBackground': '#6366F144',
    'editorLineNumber.foreground': '#475569',
    'editorLineNumber.activeForeground': '#06B6D4'
  }
});
```

**File Tabs**:
- Show open files in tabs (max 10 visible, overflow menu)
- Close tab with X button or middle-click
- Unsaved files have dot indicator
- Cmd+W to close current tab
- Cmd+Tab to switch between tabs

**Auto-save**:
- Debounced auto-save after 1 second of inactivity
- Show "Saving..." indicator in tab
- API call: `PUT /api/v1/projects/{project_id}/files?path={file_path}`

#### **5.4 Integrated Terminal (xterm.js)**

**Setup**:
```typescript
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';

const term = new Terminal({
  theme: {
    background: '#0F172A',
    foreground: '#F8FAFC',
    cursor: '#06B6D4',
    selection: '#6366F144'
  },
  fontFamily: 'JetBrains Mono',
  fontSize: 13,
  cursorBlink: true,
  scrollback: 10000
});

const fitAddon = new FitAddon();
term.loadAddon(fitAddon);
term.loadAddon(new WebLinksAddon());
```

**WebSocket Connection**:
- `wss://api.example.com/ws/projects/{project_id}/terminal`
- Send user input to backend, receive stdout/stderr
- Handle ANSI color codes (xterm handles this automatically)

**Terminal Features**:
- Multiple terminal sessions (tabs)
- Split terminal (horizontal/vertical)
- Clear terminal (Cmd+K)
- Copy/paste with Cmd+C/V
- Searchable output (Cmd+F)

**Terminal Actions**:
- **Run Project**: Execute `npm run dev` or equivalent
- **Run Tests**: Execute `npm test`
- **Install Deps**: Execute `npm install`
- **Custom Commands**: User input

#### **5.5 AI Assistant Panel**

**Context-Aware Intelligence**:
- Auto-analyzes currently open file
- Understands project structure
- Remembers conversation history within IDE session

**UI Layout**:
```
┌───────────────────────────────────┐
│  🤖 AI Assistant                  │
│  ───────────────────────────────  │
│  Context: ProductCard.tsx         │
│  ───────────────────────────────  │
│  💬 Chat History                  │
│  [User] Add TypeScript types      │
│  [AI] I'll add interface...       │
│  ───────────────────────────────  │
│  ⚡ Quick Actions                 │
│  • Explain this code              │
│  • Optimize performance           │
│  • Add error handling             │
│  • Generate tests                 │
│  ───────────────────────────────  │
│  📝 Type a message...   [Send]    │
└───────────────────────────────────┘
```

**API Integration**:
- **Endpoint**: `POST /api/v1/chat/{session_id}/messages`
- **Context Payload**:
  ```typescript
  {
    message: string,
    context: {
      file_path: string,
      file_content: string,
      cursor_position: { line: number, column: number },
      selection?: { start: Position, end: Position }
    }
  }
  ```

**Code Actions**:
- Select code → Right-click → "Ask AI" → Opens assistant with selection
- Inline suggestions (like GitHub Copilot)
- Diff preview before applying AI changes

#### **5.6 Debugger Integration (DAP)**

**Debug Adapter Protocol Support**:
- Install `@vscode/debugadapter` for Node.js/TypeScript/Python
- Show breakpoint indicators in gutter (red dots)
- Debug toolbar: Continue, Step Over, Step Into, Step Out, Restart, Stop

**Debug Panel**:
- **Variables**: Show local/global variables
- **Call Stack**: Show function call hierarchy
- **Breakpoints**: List all breakpoints, enable/disable
- **Watch Expressions**: Add custom expressions to monitor

**Launch Configuration**:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Current File",
  "program": "${file}",
  "skipFiles": ["<node_internals>/**"]
}
```

---

### **6. DATABASE EXPLORER**

#### **6.1 Connection Manager**

**Add Connection Form**:
```typescript
{
  connection_name: string, // "Production DB"
  db_type: 'sqlite' | 'postgresql' | 'mysql' | 'mongodb' | 'redis',
  host?: string, // localhost
  port?: number, // 5432
  username?: string,
  password?: string, // Encrypted before sending
  database: string,
  ssl?: boolean,
  project_id?: string // Optional: Link to project
}
```

**Endpoints**:
- `POST /api/v1/database/connections` → Create connection
- `GET /api/v1/database/connections` → List connections
- `POST /api/v1/database/connections/{connection_id}/test` → Test connection
- `DELETE /api/v1/database/connections/{connection_id}` → Remove connection

**UI**:
- List of saved connections (cards with DB type icon)
- "Quick connect" for project databases (auto-detected)
- Connection status indicator (green=connected, red=failed)

#### **6.2 Schema Browser**

**After Connecting**:
- `GET /api/v1/database/{connection_id}/tables` → List all tables
- `GET /api/v1/database/{connection_id}/tables/{table_name}/schema` → Get columns, types, constraints

**UI**:
- Left sidebar: Tree view of tables
- Main area: Selected table details
  - **Columns**: Name, Type, Nullable, Default, Primary Key
  - **Indexes**: List indexes on table
  - **Relationships**: Foreign keys (clickable to navigate)

#### **6.3 Data Grid (Table Viewer)**

**Load Data**:
- `GET /api/v1/database/{connection_id}/tables/{table_name}/data?page=1&limit=50`
- Server-side pagination for large tables

**Features**:
- Editable cells (double-click to edit)
- Add new row (+ button)
- Delete row (select → delete key)
- Filter rows (input above each column)
- Sort by column (click header)
- Export to CSV/JSON

**Update API**:
- `PUT /api/v1/database/{connection_id}/tables/{table_name}/rows/{row_id}`
- `POST /api/v1/database/{connection_id}/tables/{table_name}/rows`
- `DELETE /api/v1/database/{connection_id}/tables/{table_name}/rows/{row_id}`

#### **6.4 SQL Query Runner**

**UI**:
- Monaco editor for SQL (with syntax highlighting)
- "Run Query" button (Cmd+Enter)
- Results table below editor
- Query history (save last 20 queries)

**Endpoints**:
- `POST /api/v1/database/{connection_id}/query`
  - Payload: `{ sql: string }`
  - Response: `{ columns: string[], rows: any[][], execution_time: number }`

**Features**:
- Auto-complete table/column names
- Syntax error highlighting
- Show execution time
- Export results to CSV

---

### **7. DEVOPS & KUBERNETES**

#### **7.1 Kubernetes Manifest Generator**

**Visual Form Wizard**:

**Step 1: Choose Resource Type**
- Deployment, Service, Ingress, ConfigMap, Secret, PersistentVolumeClaim

**Step 2: Configure Resource**

*For Deployment*:
```typescript
{
  name: string,
  namespace: string,
  replicas: number,
  image: string,
  image_pull_policy: 'Always' | 'IfNotPresent',
  ports: [{ name: string, container_port: number, protocol: 'TCP'|'UDP' }],
  env_vars: [{ name: string, value: string }],
  resources: {
    requests: { cpu: string, memory: string },
    limits: { cpu: string, memory: string }
  },
  volumes: [{ name: string, mount_path: string }]
}
```

*For Service*:
```typescript
{
  name: string,
  namespace: string,
  type: 'ClusterIP' | 'NodePort' | 'LoadBalancer',
  ports: [{ port: number, target_port: number, protocol: 'TCP' }],
  selector: Record<string, string>
}
```

**Step 3: Preview YAML**
- **Endpoint**: `POST /api/v1/tools/kubernetes/generate`
- Display generated YAML in Monaco editor
- Allow manual edits

**Step 4: Apply or Download**
- **Apply to Cluster**: `POST /api/v1/tools/kubernetes/apply` (if cluster connected)
- **Download**: Save YAML file locally
- **Add to Project**: Save to project's k8s folder

#### **7.2 Helm Chart Generator**

**Form**:
```typescript
{
  chart_name: string,
  version: string,
  app_version: string,
  description: string,
  values: Record<string, any>, // Custom values
  templates: ['deployment', 'service', 'ingress'] // Which templates to include
}
```

**Endpoint**: `POST /api/v1/tools/kubernetes/helm/generate`

**Output**: Downloadable .tar.gz file with complete Helm chart structure

---

### **8. SECURITY & TOOLS**

#### **8.1 Security Scanner**

**Trigger Scan**:
- **Endpoint**: `POST /api/v1/tools/security/scan`
- **Payload**: `{ project_id: string, scan_type: 'dependencies' | 'code' | 'secrets' }`

**Scan Results Dashboard**:
```
┌─────────────────────────────────────────────────────┐
│  🛡️ Security Report                                 │
│  ─────────────────────────────────────────────────  │
│  ⚠️ 3 Critical | 🟡 12 High | 🔵 5 Medium           │
│  ─────────────────────────────────────────────────  │
│  CVE-2024-12345: SQL Injection in package@1.2.3    │
│  Severity: Critical                                 │
│  Fix: Upgrade to package@1.2.4                      │
│  [AI Remediate] [Ignore] [View Details]            │
│  ─────────────────────────────────────────────────  │
│  ... more vulnerabilities ...                       │
└─────────────────────────────────────────────────────┘
```

**AI Remediation**:
- **Endpoint**: `POST /api/v1/tools/security/remediate`
- **Payload**: `{ vulnerability_id: string }`
- **Response**: AI-generated PR or code changes

**SBOM (Software Bill of Materials)**:
- `GET /api/v1/tools/security/sbom?project_id={id}`
- Display dependency tree with licenses

#### **8.2 Figma to Code**

**Input Form**:
```typescript
{
  figma_url: string, // https://figma.com/file/...
  target_framework: 'react' | 'vue' | 'angular',
  component_name: string,
  include_styles: boolean, // Generate CSS/TailwindCSS
  include_props: boolean // Generate TypeScript interfaces
}
```

**Endpoint**: `POST /api/v1/tools/figma/convert`

**Response**:
```typescript
{
  components: [
    {
      name: string,
      code: string,
      styles: string,
      props_interface: string
    }
  ],
  assets: [{ name: string, url: string }] // Images
}
```

**UI**:
- Preview Figma design (iframe or screenshot)
- Monaco editor with generated code
- "Copy" or "Add to Project" buttons
- Download assets as ZIP

#### **8.3 Code Analyzer**

**Analyze Endpoint**:
- `POST /api/v1/tools/analyze/code`
- **Payload**: `{ code: string, language: string }`

**Response**:
```typescript
{
  complexity: number, // Cyclomatic complexity
  lines_of_code: number,
  maintainability_index: number,
  issues: [
    {
      severity: 'error' | 'warning' | 'info',
      message: string,
      line: number,
      suggestion: string
    }
  ]
}
```

**UI**:
- Upload file or paste code
- Show metrics in cards
- List issues with line numbers (click to highlight in editor)

#### **8.4 Test Generator**

**Request**:
```typescript
{
  code: string,
  language: string,
  test_framework: 'jest' | 'pytest' | 'junit'
}
```

**Endpoint**: `POST /api/v1/tools/test/generate`

**Response**: Generated test file content

**UI**:
- Upload source file
- Choose test framework
- Preview generated tests
- "Add to Project" to create test file

---

### **9. ENTERPRISE CONSOLE (Role-Restricted)**

#### **9.1 User Management**

**List Users**:
- **Endpoint**: `GET /api/v1/enterprise/users?page=1&limit=20`
- **Table Columns**: Name, Email, Role, Status, Last Login, Actions

**Invite User**:
- **Modal Form**: Email, Role (pro_developer, developer), Permissions
- **Endpoint**: `POST /api/v1/workspaces/{workspace_id}/invite`
- Send invitation email with signup link

**Role Management**:
- **Dropdown**: Change user role (requires enterprise/superuser permission)
- **Endpoint**: `PATCH /api/v1/enterprise/users/{user_id}/role`

**Deactivate User**:
- **Toggle Switch**: Active/Inactive
- **Endpoint**: `PATCH /api/v1/enterprise/users/{user_id}/status`

#### **9.2 Project Protection**

**Protected Projects Table**:
- List all projects with "Protected" toggle
- **Endpoint**: `PATCH /api/v1/projects/{project_id}/protection`
- Protected projects show lock icon
- Require 2FA to modify (modal with code input)

#### **9.3 Billing Dashboard (Placeholder)**

**Display**:
- Current plan (Developer, Pro, Enterprise)
- Seat usage: X / Y seats used
- Storage usage: X GB / Y GB
- API usage: X requests / Y limit
- "Upgrade Plan" CTA button (links to pricing page)

**Endpoint**: `GET /api/v1/enterprise/billing/summary`

---

### **10. REGISTRY & CONFIGURATION**

#### **10.1 Framework Registry**

**List Frameworks**:
- **Endpoint**: `GET /api/v1/registry/frameworks`
- **Display**: Cards with framework logo, name, version, status

**Sync Registry**:
- **Button**: "Sync from Remote" (admin only)
- **Endpoint**: `POST /api/v1/registry/frameworks/sync`
- Shows progress toast

**Framework Details**:
- Click framework → Show template files, dependencies, creation stats

#### **10.2 Git Configuration**

**Manage Git Providers**:
- **List**: `GET /api/v1/git/config`
- **Add**: `POST /api/v1/git/config`
  - Provider: GitHub, GitLab, Bitbucket
  - Auth type: SSH key, Personal Access Token
  - Credentials (encrypted)

**SSH Key Management**:
- Generate SSH key pair
- Display public key (copy to GitHub/GitLab)
- Test connection

**Endpoint**: `POST /api/v1/git/config/{config_id}/test`

#### **10.3 Mobile Emulator**

**Start Emulator**:
- **Form**: OS (Android/iOS), Device (Pixel 6, iPhone 14), App URL
- **Endpoint**: `POST /api/v1/tools/mobile/emulator/start`

**Response**: WebSocket URL for VNC stream

**UI**:
- Embedded VNC viewer (use noVNC library)
- Emulator controls: Home, Back, Rotate
- Screenshot button
- Stop emulator button

---

### **11. GLOBAL FEATURES**

#### **11.1 Command Palette (Cmd+K)**

**Implementation**:
- Global keyboard listener
- Modal overlay with search input
- Fuzzy search through all available commands

**Command Categories**:
- **Navigation**: "Go to Dashboard", "Open Project X", "Open IDE"
- **Actions**: "Create Project", "Create Agent", "Run Security Scan"
- **Settings**: "Open Preferences", "Manage API Keys"
- **Help**: "View Documentation", "Contact Support"

**Command Structure**:
```typescript
interface Command {
  id: string;
  label: string;
  category: string;
  icon: string;
  shortcut?: string;
  action: () => void;
}
```

#### **11.2 Tenant Switcher**

**UI**: Dropdown in top bar showing current tenant name

**List Tenants**:
- **Endpoint**: `GET /api/v1/auth/me` → Returns user's tenants
- Display tenant name + icon

**Switch Tenant**:
- **Endpoint**: `POST /api/v1/auth/switch-tenant`
- **Payload**: `{ tenant_id: string }`
- Reload app context with new tenant data

#### **11.3 User Profile Menu**

**Dropdown Items**:
- User avatar + name + email
- "Profile Settings" → Navigate to `/settings/profile`
- "Preferences" → Navigate to `/settings/preferences`
- "API Keys" → Navigate to `/settings/api-keys`
- "Dark/Light Mode" toggle (though always dark in Antigravity theme)
- "Logout" → Call `POST /api/v1/auth/logout` + clear state

---

### **12. REAL-TIME FEATURES (WebSockets)**

#### **12.1 WebSocket Service (Global)**

**Connection Management**:
```typescript
@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket: WebSocket | null = null;
  
  connect(endpoint: string, token: string): Observable<any> {
    const wsUrl = `wss://api.example.com${endpoint}?token=${token}`;
    this.socket = new WebSocket(wsUrl);
    
    return new Observable(observer => {
      this.socket.onmessage = (event) => {
        observer.next(JSON.parse(event.data));
      };
      this.socket.onerror = (error) => {
        observer.error(error);
      };
      this.socket.onclose = () => {
        observer.complete();
      };
    });
  }
  
  send(message: any): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }
  
  disconnect(): void {
    this.socket?.close();
  }
}
```

#### **12.2 WebSocket Endpoints**

| Use Case | Endpoint | Message Types |
|----------|----------|---------------|
| Activity Feed | `/ws/activity` | agent.started, project.created, build.failed |
| Agent Chat | `/ws/chat/{session_id}` | message.delta, message.complete |
| Terminal | `/ws/projects/{project_id}/terminal` | stdout, stderr, exit |
| Project Status | `/ws/projects/{project_id}/status` | status.changed |
| Build Logs | `/ws/projects/{project_id}/build` | log.line, build.complete |

#### **12.3 Auto-Reconnect Logic**

```typescript
reconnect() {
  let retries = 0;
  const maxRetries = 5;
  
  const attemptReconnect = () => {
    if (retries < maxRetries) {
      setTimeout(() => {
        console.log(`Reconnecting... attempt ${retries + 1}`);
        this.connect(this.lastEndpoint, this.token).subscribe({
          error: () => {
            retries++;
            attemptReconnect();
          }
        });
      }, 2000 * Math.pow(2, retries)); // Exponential backoff
    }
  };
  
  attemptReconnect();
}
```

---

### **13. STATE MANAGEMENT (NgRx)**

#### **13.1 Store Structure**

```typescript
interface AppState {
  auth: AuthState;
  agents: AgentsState;
  projects: ProjectsState;
  chat: ChatState;
  ui: UIState;
}

interface AuthState {
  user: UserResponseDTO | null;
  tenant: TenantResponseDTO | null;
  tokens: { access: string, refresh: string } | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface AgentsState {
  entities: { [id: string]: AgentResponseDTO };
  ids: string[];
  selectedAgentId: string | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta;
}

// Similar for ProjectsState, ChatState...
```

#### **13.2 Actions (Examples)**

```typescript
// auth.actions.ts
export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: UserResponseDTO; tokens: TokenResponseDTO }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// agents.actions.ts
export const loadAgents = createAction(
  '[Agents] Load Agents',
  props<{ page: number; limit: number }>()
);

export const loadAgentsSuccess = createAction(
  '[Agents] Load Agents Success',
  props<{ agents: AgentResponseDTO[]; pagination: PaginationMeta }>()
);
```

#### **13.3 Effects (API Calls)**

```typescript
@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map(response => AuthActions.loginSuccess({
            user: response.data.user,
            tokens: response.data
          })),
          catchError(error => of(AuthActions.loginFailure({ error: error.message })))
        )
      )
    )
  );
  
  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {}
}
```

#### **13.4 Selectors**

```typescript
export const selectAuthState = (state: AppState) => state.auth;
export const selectUser = createSelector(
  selectAuthState,
  (state) => state.user
);
export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.isAuthenticated
);

export const selectAllAgents = createSelector(
  selectAgentsState,
  (state) => state.ids.map(id => state.entities[id])
);
```

---

### **14. API CLIENT GENERATION**

#### **14.1 Auto-Generate TypeScript Services**

**Use `openapi-generator-cli`**:
```bash
npm install @openapitools/openapi-generator-cli -D

npx openapi-generator-cli generate \
  -i ./openapi.json \
  -g typescript-angular \
  -o ./src/app/core/api \
  --additional-properties=ngVersion=18,providedInRoot=true
```

**Generated Files**:
- `api/agents.service.ts` → All agent endpoints
- `api/projects.service.ts` → All project endpoints
- `api/auth.service.ts` → All auth endpoints
- `model/agent-response-dto.ts` → TypeScript interfaces

#### **14.2 HTTP Interceptors**

**Auth Interceptor** (Add JWT to headers):
```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.store.selectSnapshot(state => state.auth.tokens?.access);
    
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    
    return next.handle(req);
  }
}
```

**Error Interceptor** (Handle 401/403/422):
```typescript
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired, try refresh
          return this.authService.refreshToken().pipe(
            switchMap(() => next.handle(this.retryRequest(req))),
            catchError(() => {
              this.store.dispatch(AuthActions.logout());
              this.router.navigate(['/login']);
              return throwError(() => error);
            })
          );
        }
        
        if (error.status === 403) {
          this.toastr.error('Permission denied');
        }
        
        if (error.status === 422) {
          // Validation errors
          const validationErrors = error.error.detail;
          this.toastr.error('Validation failed');
        }
        
        return throwError(() => error);
      })
    );
  }
}
```

---

### **15. DESIGN SYSTEM IMPLEMENTATION**

#### **15.1 TailwindCSS Configuration**

**`tailwind.config.js`**:
```javascript
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        void: '#05050A',
        space: {
          50: '#0F172A',
          100: '#1E293B',
          200: '#334155',
        },
        indigo: {
          500: '#6366F1',
          600: '#A855F7',
        },
        neon: {
          cyan: '#06B6D4',
        },
        ghost: '#F8FAFC',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Geist Mono', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        'glow': '0 0 16px rgba(99, 102, 241, 0.3)',
        'levitate': '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 16px rgba(99, 102, 241, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

#### **15.2 Reusable Components**

**Glass Panel Component**:
```typescript
@Component({
  selector: 'app-glass-panel',
  template: `
    <div class="glass-panel" [ngClass]="size">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .glass-panel {
      background: rgba(30, 41, 59, 0.4);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(248, 250, 252, 0.08);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 16px rgba(99, 102, 241, 0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .glass-panel:hover {
      border-color: rgba(99, 102, 241, 0.3);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5), 0 0 24px rgba(99, 102, 241, 0.2);
    }
    
    .sm { padding: 1rem; }
    .md { padding: 1.5rem; }
    .lg { padding: 2rem; }
  `]
})
export class GlassPanelComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
}
```

**Neon Button Component**:
```typescript
@Component({
  selector: 'app-neon-button',
  template: `
    <button 
      class="neon-button" 
      [ngClass]="variant"
      [disabled]="disabled"
      (click)="handleClick($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .neon-button {
      position: relative;
      padding: 0.75rem 1.5rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.875rem;
      font-weight: 600;
      border-radius: 6px;
      transition: all 0.2s;
      cursor: pointer;
      border: none;
      outline: none;
    }
    
    .primary {
      background: linear-gradient(135deg, #6366F1, #A855F7);
      color: white;
    }
    
    .primary:hover {
      box-shadow: 0 0 16px rgba(99, 102, 241, 0.5);
      transform: translateY(-1px);
    }
    
    .secondary {
      background: rgba(30, 41, 59, 0.6);
      color: #06B6D4;
      border: 1px solid rgba(6, 182, 212, 0.3);
    }
    
    .secondary:hover {
      border-color: #06B6D4;
      box-shadow: 0 0 12px rgba(6, 182, 212, 0.3);
    }
    
    .neon-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class NeonButtonComponent {
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() disabled = false;
  @Output() clicked = new EventEmitter<Event>();
  
  handleClick(event: Event) {
    if (!this.disabled) {
      this.clicked.emit(event);
    }
  }
}
```

**Loading Skeleton Component**:
```typescript
@Component({
  selector: 'app-skeleton',
  template: `
    <div class="skeleton" [ngClass]="type" [style.width]="width" [style.height]="height">
      <div class="shimmer"></div>
    </div>
  `,
  styles: [`
    .skeleton {
      position: relative;
      background: rgba(30, 41, 59, 0.4);
      border-radius: 4px;
      overflow: hidden;
    }
    
    .shimmer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        rgba(30, 41, 59, 0) 0%,
        rgba(99, 102, 241, 0.1) 50%,
        rgba(30, 41, 59, 0) 100%
      );
      animation: shimmer 2s linear infinite;
    }
    
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    .text { height: 1rem; border-radius: 4px; }
    .circle { border-radius: 50%; }
    .rect { border-radius: 8px; }
  `]
})
export class SkeletonComponent {
  @Input() type: 'text' | 'circle' | 'rect' = 'rect';
  @Input() width = '100%';
  @Input() height = '2rem';
}
```

---

### **16. ANIMATIONS & MICRO-INTERACTIONS**

#### **16.1 Page Transitions**

```typescript
// app.animations.ts
export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(10px)' }),
    animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
  ])
]);

export const slideInFromRight = trigger('slideInFromRight', [
  transition(':enter', [
    style({ transform: 'translateX(100%)' }),
    animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(0)' }))
  ])
]);
```

#### **16.2 List Animations**

```typescript
export const listAnimation = trigger('listAnimation', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger(50, [
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);
```

**Usage**:
```html
<div @listAnimation>
  <div *ngFor="let agent of agents" class="agent-card">
    {{ agent.display_name }}
  </div>
</div>
```

---

### **17. ERROR HANDLING & VALIDATION**

#### **17.1 Form Validation**

**Reactive Forms with Custom Validators**:
```typescript
// password.validators.ts
export class PasswordValidators {
  static strong(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasMinLength = value.length >= 8;
    
    const valid = hasUpperCase && hasLowerCase && hasNumeric && hasMinLength;
    return valid ? null : { weakPassword: true };
  }
}

// register.component.ts
this.registerForm = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, PasswordValidators.strong]],
  tenant_name: ['', [Validators.required, Validators.minLength(3)]]
});
```

**Display Errors**:
```html
<input formControlName="password" type="password" />
<div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
  <span *ngIf="registerForm.get('password')?.errors?.['required']" class="error">
    Password is required
  </span>
  <span *ngIf="registerForm.get('password')?.errors?.['weakPassword']" class="error">
    Password must contain uppercase, lowercase, and digit
  </span>
</div>
```

#### **17.2 Global Error Handler**

```typescript
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private toastr: ToastrService,
    private logger: LoggerService
  ) {}
  
  handleError(error: any): void {
    // Log to external service
    this.logger.error(error);
    
    // Show user-friendly message
    if (error instanceof HttpErrorResponse) {
      this.toastr.error(error.error.message || 'An error occurred');
    } else {
      this.toastr.error('Something went wrong');
    }
  }
}

// app.module.ts
providers: [
  { provide: ErrorHandler, useClass: GlobalErrorHandler }
]
```

---

### **18. PERFORMANCE OPTIMIZATION**

#### **18.1 Lazy Loading Modules**

```typescript
const routes: Routes = [
  { path: 'login', loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent) },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES) },
  { path: 'agents', loadChildren: () => import('./agents/agents.routes').then(m => m.AGENTS_ROUTES) },
  { path: 'ide', loadChildren: () => import('./ide/ide.routes').then(m => m.IDE_ROUTES) }
];
```

#### **18.2 Virtual Scrolling**

```html
<cdk-virtual-scroll-viewport itemSize="50" class="viewport">
  <div *cdkVirtualFor="let agent of agents" class="agent-item">
    {{ agent.display_name }}
  </div>
</cdk-virtual-scroll-viewport>
```

#### **18.3 OnPush Change Detection**

```typescript
@Component({
  selector: 'app-agent-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`
})
export class AgentCardComponent {
  @Input() agent!: AgentResponseDTO;
}
```

#### **18.4 Service Workers (PWA)**

```bash
ng add @angular/pwa
```

**Cache Strategy**:
- Static assets: Cache-first
- API calls: Network-first with fallback
- Images: Cache-first with network fallback

---

### **19. TESTING STRATEGY**

#### **19.1 Unit Tests (Jasmine + Karma)**

```typescript
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  it('should login successfully', () => {
    const mockResponse = { data: { access_token: 'token', refresh_token: 'refresh' } };
    
    service.login('test@example.com', 'password').subscribe(response => {
      expect(response.data.access_token).toBe('token');
    });
    
    const req = httpMock.expectOne('/api/v1/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
  
  afterEach(() => {
    httpMock.verify();
  });
});
```

#### **19.2 E2E Tests (Cypress)**

```typescript
describe('Project Creation Flow', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password');
  });
  
  it('should create a new project', () => {
    cy.visit('/projects');
    cy.get('[data-testid="new-project-btn"]').click();
    cy.get('[data-testid="framework-react"]').click();
    cy.get('[data-testid="project-goal"]').type('Build a todo app');
    cy.get('[data-testid="create-btn"]').click();
    cy.url().should('include', '/projects/');
    cy.contains('Project created successfully');
  });
});
```

---

### **20. DEPLOYMENT & CI/CD**

#### **20.1 Docker Configuration**

**`Dockerfile`**:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration=production

FROM nginx:alpine
COPY --from=builder /app/dist/ai-orchestrator /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**`nginx.conf`**:
```nginx
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
  
  location /api {
    proxy_pass http://backend:8000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
  }
}
```

#### **20.2 GitHub Actions CI/CD**

**`.github/workflows/deploy.yml`**:
```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:ci
      
      - name: Build
        run: npm run build
      
      - name: Build Docker image
        run: docker build -t ai-orchestrator:latest .
      
      - name: Push to registry
        run: docker push ai-orchestrator:latest
      
      - name: Deploy to Kubernetes
        run: kubectl apply -f k8s/deployment.yaml
```

---

## 🎯 CRITICAL IMPLEMENTATION PRIORITIES

### **Phase 1: Foundation (Week 1-2)**
1. ✅ Project scaffolding (Angular 21 + TailwindCSS)
2. ✅ Authentication system (Login, Register, JWT management)
3. ✅ API client generation from OpenAPI
4. ✅ NgRx store setup (Auth, Agents, Projects)
5. ✅ Base layout components (AuthLayout, DashboardLayout)
6. ✅ Design system components (GlassPanel, NeonButton, etc.)

### **Phase 2: Core Features (Week 3-4)**
1. ✅ Dashboard with real-time metrics
2. ✅ Agent Swarm (Create, List, Edit agents)
3. ✅ Agent Chat interface with streaming
4. ✅ Project creation wizard
5. ✅ Project list and details view

### **Phase 3: Advanced Features (Week 5-6)**
1. ✅ Cloud IDE with Monaco Editor
2. ✅ File explorer and integrated terminal
3. ✅ AI Assistant panel in IDE
4. ✅ Database Explorer
5. ✅ Security Scanner dashboard

### **Phase 4: DevOps & Enterprise (Week 7-8)**
1. ✅ Kubernetes manifest generator
2. ✅ Enterprise console (User management, billing)
3. ✅ Framework registry and Git configuration
4. ✅ Figma to Code tool
5. ✅ Mobile emulator integration

### **Phase 5: Polish & Deploy (Week 9-10)**
1. ✅ Comprehensive testing (Unit + E2E)
2. ✅ Performance optimization
3. ✅ Documentation
4. ✅ Docker + K8s deployment
5. ✅ Production launch 🚀

---

## 📚 KEY TECHNICAL REQUIREMENTS

### **Must-Haves**
- ✅ Angular 21 with standalone components
- ✅ TypeScript strict mode
- ✅ RxJS for reactive programming
- ✅ NgRx for state management
- ✅ TailwindCSS for styling
- ✅ Monaco Editor for code editing
- ✅ xterm.js for terminal
- ✅ WebSocket support for real-time features
- ✅ JWT authentication with auto-refresh
- ✅ Role-based access control
- ✅ Responsive design (mobile-first)
- ✅ Dark mode (Antigravity theme)
- ✅ Accessibility (WCAG 2.1 AA compliance)

### **Nice-to-Haves**
- PWA support with offline mode
- Internationalization (i18n)
- Voice commands (speech-to-text)
- Mobile app (Ionic or React Native)
- Browser extension for quick access

---

## 🚨 CRITICAL SUCCESS FACTORS

1. **User Experience**: The UI must feel magical—zero-gravity, smooth, responsive
2. **Performance**: Sub-second page loads, instant interactions
3. **Reliability**: 99.9% uptime, graceful error handling
4. **Security**: Zero-trust architecture, encrypted everything
5. **Scalability**: Handle 10,000+ concurrent users
6. **Developer Experience**: Clean code, well-documented, easy to maintain

---

## 📞 SUPPORT & COLLABORATION

**Your Role as AI Agent**:
- Implement all features described in this document
- Follow Angular best practices and style guide
- Ensure type safety (no `any` types)
- Write unit tests for critical logic
- Document complex components
- Ask clarifying questions when requirements are ambiguous
- Suggest improvements or optimizations

**Expected Deliverables**:
- Fully functional Angular 21 application
- Integrated with the provided OpenAPI backend
- "Antigravity" design system implemented
- All 10 major feature modules complete
- Test coverage >80%
- Deployment-ready Docker container
- README with setup instructions

---

## 🎨 DESIGN REFERENCE

**Inspiration**:
- Linear.app → Clean, minimal, fast
- Vercel Dashboard → Smooth animations, dark theme
- GitHub Copilot → AI-first interface
- Raycast → Command palette excellence
- Stripe Dashboard → Data visualization

**Key Differentiators**:
- **More futuristic**: Neon accents, glassmorphism, glow effects
- **More intelligent**: AI in every corner
- **More integrated**: Everything in one place (no context switching)

---

## ✅ FINAL CHECKLIST

Before considering the project complete, ensure:

- [ ] All API endpoints from OpenAPI spec are integrated
- [ ] Authentication flow works (Login, Register, Logout, Refresh)
- [ ] All 10 feature modules are functional
- [ ] WebSocket connections are stable
- [ ] Real-time updates work (dashboard, chat, terminal)
- [ ] Forms have proper validation
- [ ] Error handling is graceful
- [ ] Loading states are shown
- [ ] Mobile responsive (tested on 3 screen sizes)
- [ ] Accessibility tested (keyboard navigation, screen reader)
- [ ] Performance metrics: Lighthouse score >90
- [ ] Tests pass (Unit + E2E)
- [ ] Documentation is complete
- [ ] Docker image builds successfully
- [ ] Deployed to staging environment

---

## 🚀 LET'S BUILD THE FUTURE!

You now have **everything you need** to build the most advanced AI-powered PaaS platform. This is not just another SaaS—it's a paradigm shift. Every line of code, every animation, every interaction should scream **"The future of development is here."**

**Remember**:
- Obsess over details
- Make it fast
- Make it beautiful
- Make it intelligent
- Make it production-ready

**Now go build something extraordinary.** 🌌✨
