import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { AiAgentService } from '../../../core/services/api/ai-agent.service';
import { SecurityService } from '../../../core/services/api/security.service';
import { ToastService } from '../../../shared/services/toast.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-code-analysis',
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTabsModule,
        LoadingSpinnerComponent
    ],
    templateUrl: './code-analysis.component.html',
    styleUrl: './code-analysis.component.css'
})
export class CodeAnalysisComponent implements OnInit {
    private aiAgentService = inject(AiAgentService);
    private securityService = inject(SecurityService);
    private toast = inject(ToastService);

    loading = false;
    analysisResult: any = null;
    securityScan: any = null;

    qualityMetrics = {
        codeQuality: 85,
        maintainability: 78,
        testCoverage: 65,
        documentation: 72
    };

    ngOnInit(): void {
        this.loadMockData();
    }

    loadMockData(): void {
        // Mock analysis data
        this.analysisResult = {
            issues: [
                { severity: 'high', type: 'Performance', message: 'Inefficient database query in UserService', file: 'user.service.ts', line: 45 },
                { severity: 'medium', type: 'Code Smell', message: 'Long method detected', file: 'auth.controller.ts', line: 123 },
                { severity: 'low', type: 'Style', message: 'Missing JSDoc comment', file: 'utils.ts', line: 78 }
            ],
            complexity: {
                average: 5.2,
                highest: 12,
                files: [
                    { name: 'auth.controller.ts', complexity: 12 },
                    { name: 'user.service.ts', complexity: 8 },
                    { name: 'payment.service.ts', complexity: 7 }
                ]
            }
        };

        this.securityScan = {
            vulnerabilities: [
                { severity: 'critical', type: 'SQL Injection', description: 'Unsanitized user input', location: 'database.ts:56' },
                { severity: 'high', type: 'XSS', description: 'Unescaped output', location: 'template.html:23' }
            ],
            score: 72
        };
    }

    runAnalysis(): void {
        this.loading = true;
        this.toast.info('Analysis started...');

        setTimeout(() => {
            this.loading = false;
            this.toast.success('Analysis completed');
            this.loadMockData();
        }, 2000);
    }

    runSecurityScan(): void {
        this.loading = true;
        this.toast.info('Security scan started...');

        setTimeout(() => {
            this.loading = false;
            this.toast.success('Security scan completed');
        }, 2000);
    }

    getSeverityColor(severity: string): string {
        const colors: { [key: string]: string } = {
            'critical': 'error',
            'high': 'error',
            'medium': 'warning',
            'low': 'info'
        };
        return colors[severity] || 'info';
    }
}
