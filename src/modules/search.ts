import type { Post } from "../types/feed";
import type { Pager, RequestOptions, SearchOptions } from "../types/options";
import type { PostsModule } from "./posts";

import { assertNonBlankString, isString } from "../core/utils";

/** Full-text search across posts. */
export class SearchModule {
	constructor(private readonly posts: PostsModule) {}

	/** Searches posts by a plain query string, or a {@link SearchOptions} object. */
	async run(
		input: string | SearchOptions,
		requestOptions: RequestOptions = {},
	): Promise<Pager<Post>> {
		const options: SearchOptions = isString(input) ? { query: input } : input;
		assertNonBlankString(options.query, "query");
		return this.posts.list(
			{
				query: options.query,
				label: options.label,
				limit: options.limit,
				page: options.page,
				startIndex: options.startIndex,
				orderBy: options.orderBy,
				publishedMin: options.publishedMin,
				publishedMax: options.publishedMax,
				updatedMin: options.updatedMin,
				updatedMax: options.updatedMax,
				summary: options.summary,
			},
			requestOptions,
		);
	}
}
