import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AIService } from '../../../core/services/api/ai.service';
import { ToastService } from '../../../shared/services/toast.service';
import { SafeHtmlPipe } from '../../../shared/pipes/safe-html.pipe';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';

export interface ChatMessage {
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
    codeSnippet?: string; // For Agentic "Apply" feature
    isAgentic?: boolean;
}

@Component({
    selector: 'app-ide-chat',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        SafeHtmlPipe,
        HighlightDirective
    ],
    templateUrl: './ide-chat.component.html',
    styleUrl: './ide-chat.component.css'
})
export class IdeChatComponent {
    @Input() workspaceId: string = '';
    @Input() contextFile: string | null = null;
    @Output() closeChat = new EventEmitter<void>();
    @Output() applyChange = new EventEmitter<string>();

    private aiService = inject(AIService);
    private toast = inject(ToastService);

    messages: ChatMessage[] = [
        {
            role: 'ai',
            content: 'Hello! I am your AI Assistant. How can I help you with your code today?',
            timestamp: new Date()
        }
    ];

    userInput: string = '';
    isThinking: boolean = false;

    sendMessage(): void {
        if (!this.userInput.trim() || !this.workspaceId) return;

        const userMsg: ChatMessage = {
            role: 'user',
            content: this.userInput,
            timestamp: new Date()
        };
        this.messages.push(userMsg);

        this.isThinking = true;
        const prompt = this.userInput;
        this.userInput = '';

        this.aiService.chat({
            project_id: this.workspaceId,
            message: prompt,
            context: {
                active_file: this.contextFile || undefined
            }
        }).subscribe({
            next: (response: any) => {
                this.isThinking = false;
                const aiMsg: ChatMessage = {
                    role: 'ai',
                    content: response.data?.answer || response.answer || 'I am sorry, I could not generate a response.',
                    timestamp: new Date(),
                    isAgentic: !!response.data?.code,
                    codeSnippet: response.data?.code
                };
                this.messages.push(aiMsg);
            },
            error: (err: any) => {
                this.isThinking = false;
                this.toast.error('AI Service failed');
                this.messages.push({
                    role: 'ai',
                    content: 'Error communicating with AI service.',
                    timestamp: new Date()
                });
            }
        });
    }

    applySuggestion(code: string): void {
        this.applyChange.emit(code);
        this.toast.success('AI suggestion applied to editor!');
    }

    clearChat(): void {
        this.messages = [];
    }
}
