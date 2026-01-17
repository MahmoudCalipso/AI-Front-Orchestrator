import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats = {
    activeProjects: 0,
    totalMigrations: 0,
    codeAnalysis: 0,
    storageUsed: '0GB'
  };

  recentProjects: any[] = [];
  activityTimeline: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Simulation de chargement des données basées sur l'UI fournie
    this.stats = {
      activeProjects: 24,
      totalMigrations: 156,
      codeAnalysis: 89,
      storageUsed: '3.2GB'
    };

    this.recentProjects = [
      { name: 'Project Alpha', status: 'In Progress', type: 'Image Rec', stacks: ['python', 'react', 'go'] },
      { name: 'Beta Migration', status: 'Completed', type: 'Legacy DB', stacks: ['python', 'react', 'java', 'go'] },
      { name: 'Gamma Chatbot', status: 'Completed', type: 'NLP Core', stacks: ['python', 'react', 'go'] }
    ];

    this.activityTimeline = [
      { time: '10:32 AM', user: 'System', action: 'Project Alpha deployment successful', type: 'success' },
      { time: '10:15 AM', user: 'jdoe', action: 'started Code Analysis on Gamma Chatbot', type: 'info' },
      { time: '09:50 AM', user: 'System', action: 'Storage alert: Reached 30% capacity', type: 'warning' }
    ];
  }
}
