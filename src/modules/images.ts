import type { RequestOptions } from "../types/options";
import type { PostsModule } from "./posts";

import { extractImages } from "../parser/html";

/** Aggregate image discovery across posts. */
export class ImagesModule {
	constructor(private readonly posts: PostsModule) {}

	/**
	 * Returns every unique image URL found in the content of up to
	 * `sampleSize` (default 25) of the blog's most recent posts.
	 */
	async list(
		options: { sampleSize?: number } = {},
		requestOptions: RequestOptions = {},
	): Promise<string[]> {
		const page = await this.posts.list(
			{ limit: options.sampleSize ?? 25 },
			requestOptions,
		);
		const found = new Set<string>();
		for (const post of page.items) {
			for (const url of extractImages(post)) found.add(url);
		}
		return [...found];
	}
}
