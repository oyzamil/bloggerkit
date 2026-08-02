import type { Client } from "../core/client";
import type { Comment } from "../types/feed";
import type {
	CommentsListOptions,
	Pager,
	RequestOptions,
} from "../types/options";

import { paginate } from "../core/pagination";
import { toQueryOptions } from "../core/query";
import { assertNonBlankString, isUndefined } from "../core/utils";

/** Methods for listing and fetching comments. */
export class CommentsModule {
	constructor(private readonly client: Client) {}

	/** Lists comments for the whole blog, or for a single post when `options.postId` is set. */
	async list(
		options: CommentsListOptions = {},
		requestOptions: RequestOptions = {},
	): Promise<Pager<Comment>> {
		const { postId } = options;
		if (!isUndefined(postId)) assertNonBlankString(postId, "options.postId");

		const path = `./${postId ? `${encodeURIComponent(postId)}/` : ""}comments/${
			options.summary ? "summary" : "default"
		}`;

		const feed = await this.client.req(path, {
			params: toQueryOptions(options),
			signal: requestOptions.signal,
		});

		let comments = feed.comments ?? [];
		if (postId) comments = comments.filter((c) => c.post.id === postId);

		return paginate(this.client, feed, comments);
	}

	/**
	 * Fetches a single comment by id.
	 *
	 * Passing `postId` performs one direct request. Without it, this scans
	 * the blog-level comments feed (in pages of `scanPageSize`, up to
	 * `maxScan` comments) since Blogger's feed API has no id-only comment
	 * lookup — prefer passing `postId` when you have it.
	 */
	async get(
		commentId: string,
		postId?: string,
		options: { maxScan?: number; scanPageSize?: number } = {},
		requestOptions: RequestOptions = {},
	): Promise<Comment | null> {
		assertNonBlankString(commentId, "commentId");

		if (postId) {
			assertNonBlankString(postId, "postId");
			const feed = await this.client.req(
				`./${encodeURIComponent(postId)}/comments/default/${encodeURIComponent(commentId)}`,
				{
					base: await this.client.getServiceBase(),
					signal: requestOptions.signal,
				},
			);
			return (
				feed.comments?.find((c) => c.id === commentId) ??
				feed.comments?.[0] ??
				null
			);
		}

		const scanPageSize = options.scanPageSize ?? 100;
		const maxScan = options.maxScan ?? 500;

		let startIndex = 1;
		while (startIndex <= maxScan) {
			const page = await this.list(
				{ startIndex, limit: scanPageSize },
				{ signal: requestOptions.signal },
			);
			const found = page.items.find((c) => c.id === commentId);
			if (found) return found;
			if (!page.hasNext || page.items.length === 0) break;
			startIndex += scanPageSize;
		}

		return null;
	}
}
