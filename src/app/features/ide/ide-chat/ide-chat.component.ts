import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface ChatMessage {
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
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

        // Simulate AI thinking and response
        this.isThinking = true;
        const prompt = this.userInput;
        this.userInput = '';

        setTimeout(() => {
            this.isThinking = false;
            const aiMsg: ChatMessage = {
                role: 'ai',
                content: `I received your request: "${prompt}". \n\nI can analyze ${this.contextFile ? this.contextFile : 'your project'} and suggest refactors. (Mock Response)`,
                timestamp: new Date()
            };
            this.messages.push(aiMsg);
        }, 1500);
    }

    clearChat(): void {
        this.messages = [];
    }
}
