/** Payloads for each event emitted by a {@link Blogr} instance. */
export interface BloggerEventMap {
	/** Fired right before a network request is made. */
	request: { url: string; method: string };
	/** Fired after a network request completes successfully. */
	response: { url: string; status: number; durationMs: number };
	/** Fired when a request or parsing step fails. */
	error: { url: string | null; error: unknown };
}

export type BloggerEventName = keyof BloggerEventMap;

export type Listener<K extends BloggerEventName> = (
	payload: BloggerEventMap[K],
) => void;

/** A minimal, dependency-free, typed event emitter. */
export class EventEmitter {
	private readonly listeners = new Map<
		BloggerEventName,
		Set<Listener<BloggerEventName>>
	>();

	on<K extends BloggerEventName>(event: K, listener: Listener<K>): this {
		let set = this.listeners.get(event);
		if (!set) {
			set = new Set();
			this.listeners.set(event, set);
		}
		set.add(listener as Listener<BloggerEventName>);
		return this;
	}

	off<K extends BloggerEventName>(event: K, listener: Listener<K>): this {
		this.listeners.get(event)?.delete(listener as Listener<BloggerEventName>);
		return this;
	}

	once<K extends BloggerEventName>(event: K, listener: Listener<K>): this {
		const wrapped: Listener<K> = (payload) => {
			this.off(event, wrapped);
			listener(payload);
		};
		return this.on(event, wrapped);
	}

	emit<K extends BloggerEventName>(
		event: K,
		payload: BloggerEventMap[K],
	): void {
		const set = this.listeners.get(event);
		if (!set) return;
		for (const listener of set) {
			listener(payload);
		}
	}
}
