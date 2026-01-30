import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SanitizationService {
    constructor(private sanitizer: DomSanitizer) { }

    sanitizeHtml(html: string): SafeHtml {
        return this.sanitizer.sanitize(1, html) || '';
    }

    sanitizeUrl(url: string): string {
        // Only allow http, https, and relative URLs
        const urlPattern = /^(https?:\/\/|\/)/i;
        if (!urlPattern.test(url)) {
            return '';
        }
        return url;
    }

    stripScripts(html: string): string {
        const div = document.createElement('div');
        div.innerHTML = html;
        const scripts = div.getElementsByTagName('script');
        Array.from(scripts).forEach(script => script.remove());
        return div.innerHTML;
    }
}
