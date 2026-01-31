# System Scenarios and Process Design

## 1. Project Lifecycle Scenarios

### 1.1 Project Generation
**Goal**: Create a new project from a description.

**Happy Path**:
1. User provides description.
2. AI analyzes description (Success: Suggestions provided).
3. User selects language/framework.
4. User configures options (Docker, CI, etc.).
5. AI generates project structure and code.
6. Project saved successfully.
**Recovery**: On generation failure, progress interval is cleared, and user can retry with "Generate" button.

### 1.2 Project Migration
**Goal**: Migrate project to a different stack.

**Happy Path**:
1. User selects source project/path.
2. User selects target stack.
3. AI performs migration analysis.
4. AI performs code transformation.
5. User reviews changes in split view.
6. User downloads/saves migrated project.
**Failure**: On network error, retry logic in `BaseApiService` triggers 3 times with exponential backoff.

---

## 2. Infrastructure Scenarios

### 2.1 Kubernetes Deployment
**Goal**: Deploy manifests to a cluster.

**Process**:
1. Generate Manifest (Deployment/Service).
2. Validate YAML.
3. Click "Deploy".
4. System triggers `KubernetesService.deployManifest`.
5. WebSocket stream starts (if implemented) for real-time logs.
**Error Handling**: Centralized `ErrorHandlerService` displays toast and logs to console.

---

## 3. Reliability & Failure Recovery

### 3.1 Network Interruption
**Detector**: `BaseApiService` retry strategy (status 0 or 5xx).
**Action**: 
- Attempt 1: 1s delay.
- Attempt 2: 2s delay.
- Attempt 3: 4s delay.
**Outcome**: If still failing, global `ErrorHandlerService` notifies user.

### 3.2 Authentication Expiry
**Detector**: `AuthInterceptor` (status 401).
**Action**: 
1. `isRefreshing` mutex set to true.
2. `refreshToken` service called.
3. On Success: Queue of failed requests replayed with new token.
4. On Failure: Global logout redirected to `/login`.

---

## 4. Performance Standards

- **Initial Load**: < 1.5s (Lazy loading + optimized chunks).
- **List Rendering**: Virtual scrolling for lists > 50 items.
- **API Responses**: 
  - Standard GET: < 200ms (Cacheable).
  - AI Orchestration: Progress indicators for long-running tasks.
- **Memory**: Automatic cleanup of `setInterval` and `Subscriptions` via `ngOnDestroy`.
