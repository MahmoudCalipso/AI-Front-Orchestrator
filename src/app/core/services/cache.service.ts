import { Injectable } from '@angular/core';

interface CacheEntry<T> {
    data: T;
    expiry: number;
}

@Injectable({
    providedIn: 'root'
})
export class CacheService {
    private cache = new Map<string, CacheEntry<any>>();
    private readonly DEFAULT_TTL = 300000; // 5 minutes

    /**
     * Set cache entry
     */
    set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
        const expiry = Date.now() + ttl;
        this.cache.set(key, { data, expiry });
    }

    /**
     * Get cache entry
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) return null;

        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    /**
     * Remove specific cache entry
     */
    remove(key: string): void {
        this.cache.delete(key);
    }

    /**
     * Clear all cache
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Generate cache key from request
     */
    generateKey(url: string, params?: any): string {
        const paramsStr = params ? JSON.stringify(params) : '';
        return `${url}?${paramsStr}`;
    }
}
