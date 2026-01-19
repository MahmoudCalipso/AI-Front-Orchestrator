import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastService } from '../../../shared/services/toast.service';

export interface ChatMessage {
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
    codeSnippet?: string; // For Agentic "Apply" feature
    isAgentic?: boolean;
}

@Component({
    selector: 'app-ide-chat',
    standalone: true, // Ensuring standalone is explicit
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './ide-chat.component.html',
    styleUrl: './ide-chat.component.css'
})
export class IdeChatComponent {
    @Input() contextFile: string | null = null;
    @Output() closeChat = new EventEmitter<void>();

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
        if (!this.userInput.trim()) return;

        const userMsg: ChatMessage = {
            role: 'user',
            content: this.userInput,
            timestamp: new Date()
        };
        this.messages.push(userMsg);

        this.isThinking = true;
        const prompt = this.userInput;
        this.userInput = '';

        setTimeout(() => {
            this.isThinking = false;

            // Logic to simulate Agentic response
            const isRefactorRequest = prompt.toLowerCase().includes('fix') || prompt.toLowerCase().includes('refactor');

            const aiMsg: ChatMessage = {
                role: 'ai',
                content: isRefactorRequest
                    ? `I've analyzed the code in ${this.contextFile}. Here is a suggested improvement:`
                    : `I received your request: "${prompt}". How else can I assist with your ${this.contextFile} file?`,
                timestamp: new Date(),
                isAgentic: isRefactorRequest,
                codeSnippet: isRefactorRequest ? `// Optimized version of ${this.contextFile}\nexport class RefactoredCode {\n  // AI suggested optimization\n}` : undefined
            };
            this.messages.push(aiMsg);
        }, 1500);
    }

    applySuggestion(code: string): void {
        this.toast.success('AI suggestion applied to editor!');
        // In real impl, this would emit to IdeLayout to update Monaco
    }

    private toast = inject(ToastService);

    clearChat(): void {
        this.messages = [];
    }
}
