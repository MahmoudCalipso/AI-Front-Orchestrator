import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { AiAgentService } from '../../../core/services/api/ai-agent.service';
import { SecurityService } from '../../../core/services/api/security.service';
import { ToastService } from '../../../shared/services/toast.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { StatusColorPipe } from '../../../shared/pipes/status-color.pipe';

@Component({
    selector: 'app-code-analysis',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTabsModule,
        StatusColorPipe,
        LoadingSpinnerComponent
    ],
    templateUrl: './code-analysis.component.html',
    styleUrl: './code-analysis.component.css'
})
export class CodeAnalysisComponent implements OnInit {
    private aiAgentService = inject(AiAgentService);
    private securityService = inject(SecurityService);
    private toast = inject(ToastService);

    loading = signal(false);
    analysisResult = signal<any>(null);
    securityScan = signal<any>(null);

    qualityMetrics = signal({
        codeQuality: 85,
        maintainability: 78,
        testCoverage: 65,
        documentation: 72
    });

    isHealthy = computed(() => {
        const metrics = this.qualityMetrics();
        return metrics.codeQuality > 80 && metrics.maintainability > 70;
    });

    ngOnInit(): void {
        this.loadMockData();
    }

    loadMockData(): void {
        // Mock analysis data using Signals
        this.analysisResult.set({
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
        });

        this.securityScan.set({
            vulnerabilities: [
                { severity: 'critical', type: 'SQL Injection', description: 'Unsanitized user input', location: 'database.ts:56' },
                { severity: 'high', type: 'XSS', description: 'Unescaped output', location: 'template.html:23' }
            ],
            score: 72
        });
    }

    runAnalysis(): void {
        this.loading.set(true);
        this.toast.info('Analysis started...');

        setTimeout(() => {
            this.loading.set(false);
            this.toast.success('Analysis completed');
            this.loadMockData();
        }, 2000);
    }

    runSecurityScan(): void {
        this.loading.set(true);
        this.toast.info('Security scan started...');

        setTimeout(() => {
            this.loading.set(false);
            this.toast.success('Security scan completed');
        }, 2000);
    }
}
