import { JSONP_NAMESPACE, PARAM_MAP, type ParamKey } from "./constants";
import { BloggerError, BloggerRequestError } from "./errors";
import { generateId, toISOString } from "./utils";

export type FeedFormat = "json" | "atom" | "rss" | "jsonp";

/** Friendly query options accepted by {@link buildUrl}. */
export interface QueryOptions {
	limit?: number;
	startIndex?: number;
	orderBy?: string;
	publishedMin?: Date | string;
	publishedMax?: Date | string;
	updatedMin?: Date | string;
	updatedMax?: Date | string;
	query?: string;
}

const KNOWN_KEYS = Object.keys(PARAM_MAP) as ParamKey[];

/** Builds a feed URL from a base + path + friendly query options. */
export function buildUrl(
	path: string | URL,
	base: string | URL,
	{
		format = "json",
		query,
		callback,
	}: { format?: FeedFormat; query?: QueryOptions; callback?: string } = {},
): URL {
	const url = new URL(path, base);

	if (query) {
		for (const key of KNOWN_KEYS) {
			const value = query[key];
			if (value === undefined) continue;
			const mapped = PARAM_MAP[key];
			const stringValue =
				value instanceof Date ? toISOString(value) : String(value);
			url.searchParams.set(mapped, stringValue);
		}
	}

	if (format === "atom") {
		url.searchParams.delete("alt");
	} else if (format === "rss") {
		url.searchParams.set("alt", "rss");
	} else if (format === "jsonp") {
		url.searchParams.set("alt", "json-in-script");
		if (callback) url.searchParams.set("callback", callback);
	} else {
		url.searchParams.set("alt", "json");
	}

	url.searchParams.set("redirect", "false");

	return url;
}

/** Fetches and returns parsed JSON from `url`. */
export async function fetchJSON<T = unknown>(
	url: string | URL,
	{ signal }: { signal?: AbortSignal } = {},
): Promise<T> {
	let response: Response;
	try {
		response = await fetch(url, { signal });
	} catch (error) {
		throw new BloggerRequestError(
			`Network request failed for '${String(url)}'`,
			url,
			null,
			{ cause: error },
		);
	}

	if (!response.ok) {
		await response.body?.cancel().catch(() => {});
		throw new BloggerRequestError(
			`Request failed with status ${response.status} for '${response.url}'`,
			response.url,
			response.status,
		);
	}

	return (await response.json()) as T;
}

/** Fetches raw text (used for atom/rss formats) from `url`. */
export async function fetchText(
	url: string | URL,
	{ signal }: { signal?: AbortSignal } = {},
): Promise<string> {
	let response: Response;
	try {
		response = await fetch(url, { signal });
	} catch (error) {
		throw new BloggerRequestError(
			`Network request failed for '${String(url)}'`,
			url,
			null,
			{ cause: error },
		);
	}

	if (!response.ok) {
		await response.body?.cancel().catch(() => {});
		throw new BloggerRequestError(
			`Request failed with status ${response.status} for '${response.url}'`,
			response.url,
			response.status,
		);
	}

	return response.text();
}

const jsonpQueue: Record<string, (data: unknown) => void> = {};

/**
 * Fetches JSONP data by injecting a `<script>` tag. Browser-only; will
 * throw when `window`/`document` are unavailable.
 */
export async function fetchJSONP<T = unknown>(
	getUrl: (data: { callback: string; id: string }) => string | URL,
	{ signal }: { signal?: AbortSignal } = {},
): Promise<T> {
	if (typeof window !== "object" || typeof document !== "object") {
		throw new BloggerError("JSONP is only supported in browser environments");
	}

	return new Promise<T>((resolvePromise, rejectPromise) => {
		let settled = false;
		const resolve = (value: T) => {
			if (!settled) {
				settled = true;
				resolvePromise(value);
			}
		};
		const reject = (error: unknown) => {
			if (!settled) {
				settled = true;
				rejectPromise(error);
			}
		};

		if (signal?.aborted) {
			reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
			return;
		}

		const id = `callback_${generateId()}`;
		const callback = `window.${JSONP_NAMESPACE}.${id}`;
		const url = getUrl({ callback, id });

		const script = document.createElement("script");
		script.async = true;
		script.src = String(url);

		const cleanup = () => {
			delete jsonpQueue[id];
			signal?.removeEventListener("abort", onAbort);
			script.onerror = null;
			script.onload = null;
			script.remove();
		};

		const onAbort = () => {
			jsonpQueue[id] = () => {};
			reject(signal?.reason ?? new DOMException("Aborted", "AbortError"));
		};
		signal?.addEventListener("abort", onAbort, { once: true });

		jsonpQueue[id] = (data) => resolve(data as T);

		script.onload = () => {
			cleanup();
			if (!settled) {
				reject(
					new BloggerError(
						`JSONP callback was not invoked for '${script.src}'`,
					),
				);
			}
		};
		script.onerror = () => {
			cleanup();
			reject(new BloggerError(`Failed to load script '${script.src}'`));
		};

		(window as unknown as Record<string, unknown>)[JSONP_NAMESPACE] ??=
			jsonpQueue;
		document.head.appendChild(script);
	});
}
