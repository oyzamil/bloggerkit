import type { Post } from "../types/feed";
import type { Pager, RequestOptions } from "../types/options";
import type { PostsModule } from "./posts";

function yearRange(year: number): [Date, Date] {
	return [new Date(Date.UTC(year, 0, 1)), new Date(Date.UTC(year + 1, 0, 1))];
}

function monthRange(year: number, month: number): [Date, Date] {
	// `month` is 1-based (1 = January), matching calendar convention.
	return [
		new Date(Date.UTC(year, month - 1, 1)),
		new Date(Date.UTC(year, month, 1)),
	];
}

/**
 * Year/month archive browsing. Blogger's public feed API has no dedicated
 * archive endpoint, so this is built on top of `publishedMin`/`publishedMax`
 * range queries against the posts feed.
 */
export class ArchiveModule {
	constructor(private readonly posts: PostsModule) {}

	/** Lists posts published in `year`. */
	async year(
		year: number,
		options: { limit?: number; page?: number } = {},
		requestOptions: RequestOptions = {},
	): Promise<Pager<Post>> {
		const [publishedMin, publishedMax] = yearRange(year);
		return this.posts.list(
			{ ...options, publishedMin, publishedMax },
			requestOptions,
		);
	}

	/** Lists posts published in `month` (1-based) of `year`. */
	async month(
		year: number,
		month: number,
		options: { limit?: number; page?: number } = {},
		requestOptions: RequestOptions = {},
	): Promise<Pager<Post>> {
		const [publishedMin, publishedMax] = monthRange(year, month);
		return this.posts.list(
			{ ...options, publishedMin, publishedMax },
			requestOptions,
		);
	}

	/**
	 * Returns every year that has at least one post, newest first.
	 *
	 * Determined by locating the newest and oldest post (via `totalResults`
	 * + `startIndex`), since there's no direct "list of years" endpoint.
	 */
	async years(requestOptions: RequestOptions = {}): Promise<number[]> {
		const first = await this.posts.list({ limit: 1 }, requestOptions);
		if (first.items.length === 0 || first.totalResults === null) return [];

		const newestYear = new Date(first.items[0]!.published).getUTCFullYear();

		const last = await this.posts.list(
			{ startIndex: first.totalResults, limit: 1 },
			requestOptions,
		);
		const oldestYear = last.items[0]
			? new Date(last.items[0].published).getUTCFullYear()
			: newestYear;

		const years: number[] = [];
		for (let y = newestYear; y >= oldestYear; y -= 1) years.push(y);
		return years;
	}
}
