import type { ParsedFeed } from "../types/feed";
import type { Pager, RequestOptions } from "../types/options";
import type { Client } from "./client";

/** Builds a {@link Pager} for `items` out of a parsed feed's pagination fields. */
export function paginate<T>(
	client: Client,
	feed: ParsedFeed,
	items: T[],
): Pager<T> {
	const self: Pager<T> = {
		items,
		itemsPerPage: feed.itemsPerPage,
		startIndex: feed.startIndex,
		totalResults: feed.totalResults,
		selfUrl: feed.selfUrl,
		hasNext: feed.nextUrl !== null,
		hasPrevious: feed.previousUrl !== null,
		async next(options?: RequestOptions) {
			if (!feed.nextUrl) return null;
			const nextFeed = await client.req(feed.nextUrl, {
				signal: options?.signal,
			});
			return paginate(
				client,
				nextFeed,
				(nextFeed.posts ?? nextFeed.comments ?? []) as T[],
			);
		},
		async previous(options?: RequestOptions) {
			if (!feed.previousUrl) return null;
			const prevFeed = await client.req(feed.previousUrl, {
				signal: options?.signal,
			});
			return paginate(
				client,
				prevFeed,
				(prevFeed.posts ?? prevFeed.comments ?? []) as T[],
			);
		},
	};

	return self;
}
