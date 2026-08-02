import type { Client } from "../core/client";
import type { Post } from "../types/feed";
import type { Pager, PostsListOptions, RequestOptions } from "../types/options";
import type { PostsModule } from "./posts";

import { assertNonBlankString } from "../core/utils";

/** Methods for discovering and filtering by labels (Blogger's "categories"). */
export class LabelsModule {
	constructor(
		private readonly client: Client,
		private readonly posts: PostsModule,
	) {}

	/** Returns every label currently known to the blog. */
	async list(requestOptions: RequestOptions = {}): Promise<string[]> {
		const feed = await this.client.req("./posts/summary", {
			params: { limit: 0 },
			signal: requestOptions.signal,
		});
		return feed.blog?.labels ?? [];
	}

	/** Lists posts carrying `label`. */
	async get(
		label: string,
		options: Omit<PostsListOptions, "label"> = {},
		requestOptions: RequestOptions = {},
	): Promise<Pager<Post>> {
		assertNonBlankString(label, "label");
		return this.posts.list({ ...options, label }, requestOptions);
	}
}
