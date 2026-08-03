interface CacheEntry<T = unknown> {
	value: T;
	expiresAt: number | null;
}

/**
 * A tiny in-memory cache keyed by request URL. Disabled by default —
 * call {@link Cache.enable} to turn it on.
 */
export class Cache {
	private enabled = false;
	private readonly store = new Map<string, CacheEntry<any>>();
	private ttlMs: number | null = null;

	/** Enables caching. Optionally pass a TTL in milliseconds. */
	enable(options: { ttlMs?: number } = {}): this {
		this.enabled = true;
		this.ttlMs = options.ttlMs ?? null;
		return this;
	}

	/** Disables caching (existing entries are kept, but bypassed until re-enabled). */
	disable(): this {
		this.enabled = false;
		return this;
	}

	/** Clears every cached entry. */
	clear(): this {
		this.store.clear();
		return this;
	}

	delete(key: string): boolean {
		return this.store.delete(key);
	}
	get size(): number {
		return this.store.size;
	}
	has(key: string): boolean {
		return this.get(key) !== undefined;
	}
	get isEnabled(): boolean {
		return this.enabled;
	}

	get<T>(key: string): T | undefined {
		if (!this.enabled) return undefined;
		const entry = this.store.get(key);
		if (!entry) return undefined;
		if (entry.expiresAt !== null && entry.expiresAt <= Date.now()) {
			this.store.delete(key);
			return undefined;
		}
		return entry.value as T;
	}

	set<T>(key: string, value: T): void {
		if (!this.enabled) return;
		this.store.set(key, {
			value,
			expiresAt: this.ttlMs !== null ? Date.now() + this.ttlMs : null,
		});
	}
}
