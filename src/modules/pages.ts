import type { Client } from "../core/client";
import type { Post } from "../types/feed";
import type { Pager, PagesListOptions, RequestOptions } from "../types/options";

import { paginate } from "../core/pagination";
import { toQueryOptions } from "../core/query";
import { assertNonBlankString } from "../core/utils";

/** Methods for listing and fetching static blog pages. */
export class PagesModule {
	constructor(private readonly client: Client) {}

	/** Lists the blog's static pages. */
	async list(
		options: PagesListOptions = {},
		requestOptions: RequestOptions = {},
	): Promise<Pager<Post>> {
		const feed = await this.client.req(
			`./pages/${options.summary ? "summary" : "default"}`,
			{
				params: toQueryOptions(options),
				signal: requestOptions.signal,
			},
		);
		return paginate(this.client, feed, feed.posts ?? []);
	}

	/** Fetches a single page by id, or `null` if it doesn't exist. */
	async get(
		pageId: string,
		options: { summary?: boolean } = {},
		requestOptions: RequestOptions = {},
	): Promise<Post | null> {
		assertNonBlankString(pageId, "pageId");
		const feed = await this.client.req(
			`./pages/${options.summary ? "summary" : "default"}/${encodeURIComponent(pageId)}`,
			{ signal: requestOptions.signal },
		);
		return feed.posts?.find((p) => p.id === pageId) ?? feed.posts?.[0] ?? null;
	}
}
