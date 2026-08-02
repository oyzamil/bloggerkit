import type { Client } from "../core/client";
import type { RequestOptions } from "../types/options";

export interface BlogStats {
	posts: number;
	pages: number;
	comments: number;
	labels: number;
}

/** Cheap aggregate counts for the blog (posts/pages/comments/labels totals). */
export class StatsModule {
	constructor(private readonly client: Client) {}

	async get(requestOptions: RequestOptions = {}): Promise<BlogStats> {
		const [postsFeed, pagesFeed, commentsFeed] = await Promise.all([
			this.client.req("./posts/summary", {
				params: { limit: 0 },
				signal: requestOptions.signal,
			}),
			this.client.req("./pages/summary", {
				params: { limit: 0 },
				signal: requestOptions.signal,
			}),
			this.client.req("./comments/summary", {
				params: { limit: 0 },
				signal: requestOptions.signal,
			}),
		]);

		return {
			posts: postsFeed.totalResults ?? 0,
			pages: pagesFeed.totalResults ?? 0,
			comments: commentsFeed.totalResults ?? 0,
			labels: postsFeed.blog?.labels.length ?? 0,
		};
	}
}
