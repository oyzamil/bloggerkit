import type { Client } from "../core/client";
import type { ParsedFeed } from "../types/feed";
import type { BaseListOptions, RequestOptions } from "../types/options";

import { toQueryOptions } from "../core/query";

export interface FeedOptions extends BaseListOptions {
	/** Which feed to fetch. @default "posts" */
	type?: "posts" | "pages" | "comments";
}

function pathFor(type: FeedOptions["type"], summary?: boolean): string {
	const t = type ?? "posts";
	return `./${t}/${summary ? "summary" : "default"}`;
}

/** Fetches the blog's feed in any of Blogger's supported wire formats. */
export class FeedModule {
	constructor(private readonly client: Client) {}

	/** Fetches and parses the feed as JSON (default transport). */
	async json(
		options: FeedOptions = {},
		requestOptions: RequestOptions = {},
	): Promise<ParsedFeed> {
		return this.client.req(pathFor(options.type, options.summary), {
			params: toQueryOptions(options),
			format: "json",
			signal: requestOptions.signal,
		});
	}

	/** Fetches the feed as raw Atom XML text. */
	async atom(
		options: FeedOptions = {},
		requestOptions: RequestOptions = {},
	): Promise<string> {
		return this.client.reqRaw(pathFor(options.type, options.summary), "atom", {
			params: toQueryOptions(options),
			signal: requestOptions.signal,
		});
	}

	/** Fetches the feed as raw RSS 2.0 XML text. */
	async rss(
		options: FeedOptions = {},
		requestOptions: RequestOptions = {},
	): Promise<string> {
		return this.client.reqRaw(pathFor(options.type, options.summary), "rss", {
			params: toQueryOptions(options),
			signal: requestOptions.signal,
		});
	}

	/** Fetches and parses the feed over JSONP (browser-only; requires `jsonp: true`). */
	async jsonp(
		options: FeedOptions = {},
		requestOptions: RequestOptions = {},
	): Promise<ParsedFeed> {
		return this.client.req(pathFor(options.type, options.summary), {
			params: toQueryOptions(options),
			format: "jsonp",
			signal: requestOptions.signal,
		});
	}
}
