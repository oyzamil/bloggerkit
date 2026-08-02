/** Common request-level controls, available on every method. */
export interface RequestOptions {
	/** Abort the underlying `fetch` call. */
	signal?: AbortSignal;
}

/** Fields shared between posts/pages/comments listing options. */
export interface BaseListOptions {
	/**
	 * Page number (1-based). Converted internally to `startIndex` using
	 * `limit`. Ignored if `startIndex` is also provided.
	 */
	page?: number;
	/** Alias for Blogger's `max-results`. @default 25 */
	limit?: number;
	/** Raw 1-based start index, takes precedence over `page`. */
	startIndex?: number;
	/** Sort field. */
	orderBy?: "published" | "updated";
	/** Only include entries published on/after this date. */
	publishedMin?: Date | string;
	/** Only include entries published on/before this date. */
	publishedMax?: Date | string;
	/** Only include entries updated on/after this date. */
	updatedMin?: Date | string;
	/** Only include entries updated on/before this date. */
	updatedMax?: Date | string;
	/** When `true`, requests the lightweight "summary" projection. */
	summary?: boolean;
}

/** Options for {@link PostsModule.list}. */
export interface PostsListOptions extends BaseListOptions {
	/** Full-text search query (maps to Blogger's `q` param). */
	query?: string;
	/**
	 * Filter by one or more labels.
	 *
	 * - `string` — a single label.
	 * - `string[]` — multiple labels, combined with AND semantics
	 *   (an entry must carry every label).
	 */
	label?: string | string[];
}

/**
 * Options for {@link PostsModule.latest}. A bare
 * `number` is shorthand for `{ limit: number }`; pass an object instead to
 * also filter by `label`, `query`, date range, etc.
 */
export type LatestOptions =
	| number
	| Omit<PostsListOptions, "orderBy" | "startIndex">;

/**
 * Options for {@link PostsModule.random}. A bare
 * `number` is shorthand for `{ count: number }`; pass an object instead to
 * also filter by `label`, `query`, date range, etc.
 */
export type RandomOptions =
	| number
	| (Omit<PostsListOptions, "limit" | "startIndex"> & { count?: number });

/** Options for {@link PagesModule.list}. */
export type PagesListOptions = BaseListOptions;

/** Options for {@link CommentsModule.list}. */
export interface CommentsListOptions extends BaseListOptions {
	/** Restrict to comments on a single post. */
	postId?: string;
}

/** Options for {@link SearchModule}. */
export interface SearchOptions extends BaseListOptions {
	query: string;
	label?: string | string[];
}

/** Result of any listing call — a page of items plus pagination helpers. */
export interface Pager<T> {
	/** Items on the current page. */
	readonly items: T[];
	/** Items requested per page (mirrors `limit`), or `null`. */
	readonly itemsPerPage: number | null;
	/** 1-based index of the first item on this page, or `null`. */
	readonly startIndex: number | null;
	/** Total number of items available across all pages, or `null`. */
	readonly totalResults: number | null;
	/** URL of the current page's feed request. */
	readonly selfUrl: string | null;
	/** Whether a {@link Pager.next} page is available. */
	readonly hasNext: boolean;
	/** Whether a {@link Pager.previous} page is available. */
	readonly hasPrevious: boolean;
	/** Fetches the next page, or `null` if there isn't one. */
	next(options?: RequestOptions): Promise<Pager<T> | null>;
	/** Fetches the previous page, or `null` if there isn't one. */
	previous(options?: RequestOptions): Promise<Pager<T> | null>;
}
