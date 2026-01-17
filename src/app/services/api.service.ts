import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080'; // À adapter selon l'environnement
  private apiKey = ''; // À configurer via un service de paramètres

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey
    });
  }

  // Core Endpoints
  getHealth(): Observable<any> {
    return this.http.get(`${this.baseUrl}/health`);
  }

  getStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/status`, { headers: this.getHeaders() });
  }

  // Models
  getModels(): Observable<any> {
    return this.http.get(`${this.baseUrl}/models`, { headers: this.getHeaders() });
  }

  // Inference
  runInference(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/inference`, data, { headers: this.getHeaders() });
  }

  // Generation
  generateProject(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/generate`, data, { headers: this.getHeaders() });
  }

  analyzeDescription(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/analyze-description`, data, { headers: this.getHeaders() });
  }

  // Project Management
  getUserProjects(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/user/${userId}/projects`, { headers: this.getHeaders() });
  }

  createProject(userId: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/user/${userId}/projects`, data, { headers: this.getHeaders() });
  }

  openProject(projectId: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/projects/${projectId}/open`, data, { headers: this.getHeaders() });
  }

  // Git
  getGitProviders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/git/providers`, { headers: this.getHeaders() });
  }

  // Security
  scanSecurity(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/security/scan`, data, { headers: this.getHeaders() });
  }
}
