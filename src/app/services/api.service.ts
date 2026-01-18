import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-API-Key': user.api_key || ''
    });
  }

  // --- AI Agent (Universal) ---
  fixCode(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/code/fix`, data, { headers: this.getHeaders() });
  }

  analyzeCode(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/code/analyze`, data, { headers: this.getHeaders() });
  }

  optimizeCode(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/code/optimize`, data, { headers: this.getHeaders() });
  }

  refactorCode(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/code/refactor`, data, { headers: this.getHeaders() });
  }

  explainCode(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/code/explain`, data, { headers: this.getHeaders() });
  }

  // --- Project Operations ---
  analyzeProject(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/project/analyze`, data, { headers: this.getHeaders() });
  }

  migrateProject(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/project/migrate`, data, { headers: this.getHeaders() });
  }

  addFeature(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/project/add-feature`, data, { headers: this.getHeaders() });
  }

  // --- Generation ---
  generateProject(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/generate`, data, { headers: this.getHeaders() });
  }

  // --- Security ---
  scanSecurity(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/security/scan`, data, { headers: this.getHeaders() });
  }

  // --- Git ---
  getGitProviders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/git/providers`, { headers: this.getHeaders() });
  }

  initGitRepo(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/git/repositories/init`, data, { headers: this.getHeaders() });
  }

  // --- IDE & Workspace ---
  createWorkspace(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/workspace`, data, { headers: this.getHeaders() });
  }

  getWorkspace(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/workspace/${id}`, { headers: this.getHeaders() });
  }

  // --- Infrastructure ---
  generateK8s(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/kubernetes/generate`, data, { headers: this.getHeaders() });
  }
}
