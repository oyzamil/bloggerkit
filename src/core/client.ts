import type { ParsedFeed } from "../types/feed";

import { parseFeed } from "../parser/feed-parser";
import { Cache } from "./cache";
import { BloggerValidationError } from "./errors";
import { EventEmitter } from "./events";
import {
	buildUrl,
	type FeedFormat,
	fetchJSON,
	fetchJSONP,
	fetchText,
	type QueryOptions,
} from "./http";
import { isString, trailingSlash } from "./utils";

export interface ClientOptions {
	/** Enable JSONP transport (browser-only). @default false */
	jsonp?: boolean;
}

export interface RequestOptions {
	params?: QueryOptions;
	format?: FeedFormat;
	/** Overrides the resolved base URL for this single request. */
	base?: string | URL;
	signal?: AbortSignal;
}

function getServiceBase(blogId: string): string {
	return `https://www.blogger.com/feeds/${blogId}/`;
}

function getDomainBase(origin: string): string {
	return `${trailingSlash(origin)}feeds/`;
}

/**
 * Resolves a blog URL or numeric id into request base URLs, and performs
 * (optionally cached, event-emitting) requests against the Blogger feed API.
 */
export class Client {
	readonly events = new EventEmitter();
	readonly cache = new Cache();

	private readonly jsonp: boolean;
	private base: string;
	private blogId: string | undefined;
	private blogUrl: string | undefined;
	private blogInfoPromise: Promise<ParsedFeed["blog"]> | undefined;

	constructor(urlOrId: string | URL, options: ClientOptions = {}) {
		if (isString(urlOrId) && /^\d{10,24}$/.test(urlOrId)) {
			this.blogId = urlOrId;
			this.base = getServiceBase(urlOrId);
		} else {
			let url: URL | null = null;
			if (urlOrId instanceof URL) {
				url = urlOrId;
			} else if (isString(urlOrId)) {
				try {
					url = new URL(
						/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(urlOrId)
							? urlOrId
							: `https://${urlOrId}`,
					);
				} catch {
					url = null;
				}
			}

			if (!url) {
				throw new BloggerValidationError(
					"'urlOrId' must be a valid blog URL, numeric blog id, or URL instance",
				);
			}
			if (!/^https?:$/i.test(url.protocol)) {
				throw new BloggerValidationError(
					`Unsupported protocol '${url.protocol}'`,
				);
			}

			this.blogUrl = trailingSlash(url.origin);
			this.base = getDomainBase(url.origin);
		}

		this.jsonp = options.jsonp === true;

		if (
			this.jsonp &&
			(typeof window !== "object" || typeof document !== "object")
		) {
			throw new BloggerValidationError(
				"options.jsonp is true but the current environment does not support it",
			);
		}
	}

	/** Resolves (and caches) blog-level metadata, needed to discover id/url lazily. */
	async getBlogInfo(
		options: { signal?: AbortSignal } = {},
	): Promise<NonNullable<ParsedFeed["blog"]>> {
		this.blogInfoPromise ??= this.req("./posts/summary", {
			params: { limit: 0 },
			signal: options.signal,
		}).then((feed) => feed.blog);

		const blog = await this.blogInfoPromise;
		if (!blog) {
			this.blogInfoPromise = undefined;
			throw new BloggerValidationError(
				"Blog could not be found for the given url/id",
			);
		}
		return blog;
	}

	async getBlogId(): Promise<string> {
		if (!this.blogId) this.blogId = (await this.getBlogInfo()).id;
		return this.blogId;
	}

	async getBlogUrl(): Promise<string> {
		if (!this.blogUrl)
			this.blogUrl = trailingSlash((await this.getBlogInfo()).url);
		return this.blogUrl;
	}

	async getDomainBase(): Promise<string> {
		return getDomainBase(await this.getBlogUrl());
	}

	async getServiceBase(): Promise<string> {
		return getServiceBase(await this.getBlogId());
	}

	/** Returns the raw feed URL for `path` without performing a request. */
	resolveUrl(
		path: string | URL,
		options: Omit<RequestOptions, "signal"> = {},
	): URL {
		return buildUrl(path, options.base ?? this.base, {
			format: options.format,
			query: options.params,
		});
	}

	/** Performs a request against the Blogger feed API and returns the parsed feed. */
	async req(
		path: string | URL,
		options: RequestOptions = {},
	): Promise<ParsedFeed> {
		const format = options.format ?? (this.jsonp ? "jsonp" : "json");
		const base = options.base ?? this.base;

		if (format === "jsonp") {
			const url = buildUrl(path, base, { format, query: options.params });
			const cacheKey = String(url);
			const cached = this.cache.get<ParsedFeed>(cacheKey);
			if (cached) return cached;

			this.events.emit("request", { url: cacheKey, method: "JSONP" });
			const started = Date.now();
			try {
				const data = await fetchJSONP(
					({ callback }) => {
						const withCallback = new URL(url);
						withCallback.searchParams.set("callback", callback);
						return withCallback;
					},
					{ signal: options.signal },
				);
				this.events.emit("response", {
					url: cacheKey,
					status: 200,
					durationMs: Date.now() - started,
				});
				const parsed = parseFeed(data);
				this.cache.set(cacheKey, parsed);
				return parsed;
			} catch (error) {
				this.events.emit("error", { url: cacheKey, error });
				throw error;
			}
		}

		const url = buildUrl(path, base, { format: "json", query: options.params });
		const cacheKey = String(url);
		const cached = this.cache.get<ParsedFeed>(cacheKey);
		if (cached) return cached;

		this.events.emit("request", { url: cacheKey, method: "GET" });
		const started = Date.now();
		try {
			const data = await fetchJSON(url, { signal: options.signal });
			this.events.emit("response", {
				url: cacheKey,
				status: 200,
				durationMs: Date.now() - started,
			});
			const parsed = parseFeed(data);
			this.cache.set(cacheKey, parsed);
			return parsed;
		} catch (error) {
			this.events.emit("error", { url: cacheKey, error });
			throw error;
		}
	}

	/** Fetches a feed url in `atom` or `rss` format and returns the raw XML text. */
	async reqRaw(
		path: string | URL,
		format: "atom" | "rss",
		options: Omit<RequestOptions, "format"> = {},
	): Promise<string> {
		const url = buildUrl(path, options.base ?? this.base, {
			format,
			query: options.params,
		});
		const cacheKey = String(url);
		const cached = this.cache.get<string>(cacheKey);
		if (cached !== undefined) return cached;

		this.events.emit("request", { url: cacheKey, method: "GET" });
		const started = Date.now();
		try {
			const text = await fetchText(url, { signal: options.signal });
			this.events.emit("response", {
				url: cacheKey,
				status: 200,
				durationMs: Date.now() - started,
			});
			this.cache.set(cacheKey, text);
			return text;
		} catch (error) {
			this.events.emit("error", { url: cacheKey, error });
			throw error;
		}
	}

	/** Low-level: fetch an arbitrary URL and return parsed JSON (no feed parsing). */
	async fetchRaw<T = unknown>(
		url: string | URL,
		options: { signal?: AbortSignal } = {},
	): Promise<T> {
		this.events.emit("request", { url: String(url), method: "GET" });
		const started = Date.now();
		try {
			const data = await fetchJSON<T>(url, options);
			this.events.emit("response", {
				url: String(url),
				status: 200,
				durationMs: Date.now() - started,
			});
			return data;
		} catch (error) {
			this.events.emit("error", { url: String(url), error });
			throw error;
		}
	}
}
