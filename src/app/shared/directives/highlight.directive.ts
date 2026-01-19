import { Directive, ElementRef, Input, OnChanges, AfterViewInit } from '@angular/core';

@Directive({
    selector: '[appHighlight]',
    standalone: true
})
export class HighlightDirective implements OnChanges, AfterViewInit {
    @Input() code: string = '';
    @Input() language: string = 'typescript';

    constructor(private el: ElementRef) { }

    ngOnChanges() {
        this.highlight();
    }

    ngAfterViewInit() {
        this.highlight();
    }

    private highlight() {
        if (!this.code) return;

        // Basic syntax highlighting logic if Prism/HLJS is not available
        // or wrapper logic if they are.
        // Ideally this would delegate to a service or library.

        // For now, doing simple token replacement for demonstration
        // In production, integrate Prism.highlightElement(this.el.nativeElement)

        const escaped = this.escapeHtml(this.code);
        const highlighted = this.simpleHighlight(escaped, this.language);

        this.el.nativeElement.innerHTML = `<pre><code class="language-${this.language}">${highlighted}</code></pre>`;
    }

    private escapeHtml(text: string): string {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    private simpleHighlight(text: string, lang: string): string {
        // Very basic keyword highlighting
        const keywords = ['import', 'export', 'class', 'interface', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while'];
        let result = text;

        keywords.forEach(kw => {
            const regex = new RegExp(`\\b${kw}\\b`, 'g');
            result = result.replace(regex, `<span class="keyword">${kw}</span>`);
        });

        return result;
    }
}
