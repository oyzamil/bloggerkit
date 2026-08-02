import type { Client } from "../core/client";
import type { Post } from "../types/feed";
import type {
	LatestOptions,
	Pager,
	PostsListOptions,
	RandomOptions,
	RequestOptions,
} from "../types/options";

import { paginate } from "../core/pagination";
import { toQueryOptions } from "../core/query";
import { assertNonBlankString, isArray } from "../core/utils";

function labelPathSegment(label: string | string[] | undefined): string {
	if (!label) return "";
	const labels = isArray(label) ? label : [label];
	if (labels.length === 0) return "";
	return `/-/${labels.map((l) => encodeURIComponent(l)).join("/")}`;
}

/** Methods for listing, fetching and searching blog posts. */
export class PostsModule {
	constructor(private readonly client: Client) {}

	/** Lists posts, optionally filtered/paginated/sorted. */
	async list(
		options: PostsListOptions = {},
		requestOptions: RequestOptions = {},
	): Promise<Pager<Post>> {
		const path = `./posts/${options.summary ? "summary" : "default"}${labelPathSegment(options.label)}`;
		const feed = await this.client.req(path, {
			params: { ...toQueryOptions(options), query: options.query },
			signal: requestOptions.signal,
		});
		return paginate(this.client, feed, feed.posts ?? []);
	}

	/** Fetches a single post by id, or `null` if it doesn't exist. */
	async get(
		postId: string,
		options: { summary?: boolean } = {},
		requestOptions: RequestOptions = {},
	): Promise<Post | null> {
		assertNonBlankString(postId, "postId");
		const feed = await this.client.req(
			`./posts/${options.summary ? "summary" : "default"}/${encodeURIComponent(postId)}`,
			{ signal: requestOptions.signal },
		);
		return feed.posts?.find((p) => p.id === postId) ?? feed.posts?.[0] ?? null;
	}

	/** Full-text search across posts (equivalent to `search()` scoped to posts). */
	async query(
		query: string,
		options: Omit<PostsListOptions, "query" | "label"> = {},
		requestOptions: RequestOptions = {},
	): Promise<Pager<Post>> {
		assertNonBlankString(query, "query");
		return this.list({ ...options, query }, requestOptions);
	}

	/**
	 * Returns the most recent posts (default 5), newest first. Pass a bare
	 * `number` for just a limit, or an options object to also filter by
	 * `label`, `query`, date range, etc.
	 */
	async latest(
		options: LatestOptions = {},
		requestOptions: RequestOptions = {},
	): Promise<Post[]> {
		const opts = typeof options === "number" ? { limit: options } : options;
		const page = await this.list(
			{ ...opts, limit: opts.limit ?? 5, orderBy: "published" },
			requestOptions,
		);
		return page.items;
	}

	/**
	 * Best-effort "featured" post — Blogger's public feed API has no explicit
	 * flag for a pinned/featured post, so this returns the first post in the
	 * blog's default (unfiltered) order, which is the pinned post when one
	 * is set.
	 */
	async featured(requestOptions: RequestOptions = {}): Promise<Post | null> {
		const page = await this.list({ limit: 1 }, requestOptions);
		return page.items[0] ?? null;
	}

	/**
	 * Returns random post(s) (default 1) by sampling random indexes. Pass a
	 * bare `number` for just a count, or an options object to also filter by
	 * `label`, `query`, date range, etc.
	 */
	async random(
		options: RandomOptions = {},
		requestOptions: RequestOptions = {},
	): Promise<Post[]> {
		const { count = 1, ...filters } =
			typeof options === "number" ? { count: options } : options;

		const countFeed = await this.list(
			{ ...filters, limit: 0 },
			requestOptions,
		);
		const total = countFeed.totalResults ?? 0;
		if (total === 0) return [];

		const picks = new Set<number>();
		const wanted = Math.min(count, total);
		while (picks.size < wanted) {
			picks.add(1 + Math.floor(Math.random() * total));
		}

		const results = await Promise.all(
			[...picks].map(async (startIndex) => {
				const page = await this.list(
					{ ...filters, startIndex, limit: 1 },
					requestOptions,
				);
				return page.items[0];
			}),
		);

		return results.filter((p): p is Post => Boolean(p));
	}
}
