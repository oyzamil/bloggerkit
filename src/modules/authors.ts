import type { Author } from "../types/feed";
import type { RequestOptions } from "../types/options";
import type { PostsModule } from "./posts";

/**
 * Lists distinct post authors. Blogger's feed API has no dedicated authors
 * endpoint, so this aggregates authors seen across up to `sampleSize`
 * (default 150) of the blog's most recent posts.
 */
export class AuthorsModule {
	constructor(private readonly posts: PostsModule) {}

	async list(
		options: { sampleSize?: number } = {},
		requestOptions: RequestOptions = {},
	): Promise<Author[]> {
		const page = await this.posts.list(
			{ limit: options.sampleSize ?? 150, summary: true },
			requestOptions,
		);

		const seen = new Map<string, Author>();
		for (const post of page.items) {
			const key = post.author.url ?? post.author.name ?? "unknown";
			if (!seen.has(key)) seen.set(key, post.author);
		}

		return [...seen.values()];
	}
}
