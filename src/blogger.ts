import type { Cache } from "./core/cache";
import type { BloggerEventMap, BloggerEventName } from "./core/events";
import type { BlogStats } from "./modules/stats";
import type { BlogInfo, Comment, Link, ParsedFeed, Post } from "./types/feed";
import type {
	CommentsListOptions,
	LatestOptions,
	Pager,
	PagesListOptions,
	PostsListOptions,
	RandomOptions,
	RequestOptions,
	SearchOptions,
} from "./types/options";

import { Client, type ClientOptions } from "./core/client";
import { assertNonBlankString, isString } from "./core/utils";
import { ArchiveModule } from "./modules/archive";
import { AuthorsModule } from "./modules/authors";
import { CommentsModule } from "./modules/comments";
import { FeedModule } from "./modules/feed";
import { ImagesModule } from "./modules/images";
import { LabelsModule } from "./modules/labels";
import { PagesModule } from "./modules/pages";
import { PostsModule } from "./modules/posts";
import { SearchModule } from "./modules/search";
import { StatsModule } from "./modules/stats";
import { UrlModule } from "./modules/url";
import { parseFeed } from "./parser/feed-parser";
import {
	type ExtractedEmbed,
	type ExtractedLink,
	type ExtractedYouTube,
	extractEmbeds,
	extractImages,
	extractLinks,
	extractYouTube,
	htmlToMarkdown,
	htmlToText,
	thumbnail,
} from "./parser/html";
import { type BloggerPlugin, installPlugin } from "./plugins";

export type { ClientOptions as BloggerOptions };

/**
 * A modern, modular, fully-typed SDK for the Blogger (Blogspot) public feed
 * API.
 *
 * ```ts
 * import { Blogr } from "blogr";
 *
 * const blog = new Blogr("https://example.blogspot.com");
 * const { items } = await blog.posts({ limit: 10, label: "JavaScript" });
 * ```
 */
export class Blogr {
	private readonly client: Client;

	/** Raw feed URL builders — no requests are made. */
	readonly url: UrlModule;
	/** Raw feed fetchers for each wire format (json/atom/rss/jsonp). */
	readonly feed: FeedModule;
	/** Year/month archive browsing. */
	readonly archive: ArchiveModule;
	/** Response cache (disabled by default). */
	readonly cache: Cache;

	private readonly postsModule: PostsModule;
	private readonly pagesModule: PagesModule;
	private readonly commentsModule: CommentsModule;
	private readonly labelsModule: LabelsModule;
	private readonly searchModule: SearchModule;
	private readonly authorsModule: AuthorsModule;
	private readonly statsModule: StatsModule;
	private readonly imagesModule: ImagesModule;

	/**
	 * Creates a Blogger SDK client.
	 *
	 * @param urlOrId The blog's URL (custom domain or `*.blogspot.com`), or its numeric Blogger blog id.
	 * @param options SDK options.
	 */
	constructor(urlOrId: string | URL, options: ClientOptions = {}) {
		this.client = new Client(urlOrId, options);
		this.cache = this.client.cache;

		this.postsModule = new PostsModule(this.client);
		this.pagesModule = new PagesModule(this.client);
		this.commentsModule = new CommentsModule(this.client);
		this.labelsModule = new LabelsModule(this.client, this.postsModule);
		this.searchModule = new SearchModule(this.postsModule);
		this.authorsModule = new AuthorsModule(this.postsModule);
		this.statsModule = new StatsModule(this.client);
		this.imagesModule = new ImagesModule(this.postsModule);

		this.url = new UrlModule(this.client);
		this.feed = new FeedModule(this.client);
		this.archive = new ArchiveModule(this.postsModule);
	}

	// ---------------------------------------------------------------------
	// Metadata
	// ---------------------------------------------------------------------

	/** Fetches blog metadata (title, subtitle, labels, author, url, favicon, ...). */
	async info(requestOptions: RequestOptions = {}): Promise<BlogInfo> {
		return this.client.getBlogInfo(requestOptions);
	}

	/** Returns the blog's top-level `<link>` entries. */
	async links(requestOptions: RequestOptions = {}): Promise<Link[]> {
		return (await this.info(requestOptions)).links;
	}

	/** Cheap aggregate counts: total posts, pages, comments and labels. */
	async stats(requestOptions: RequestOptions = {}): Promise<BlogStats> {
		return this.statsModule.get(requestOptions);
	}

	/** Distinct post authors, aggregated from a sample of recent posts. */
	async authors(
		options?: { sampleSize?: number },
		requestOptions?: RequestOptions,
	): Promise<BlogInfo["author"][]> {
		return this.authorsModule.list(options, requestOptions);
	}

	// ---------------------------------------------------------------------
	// Posts
	// ---------------------------------------------------------------------

	/** Lists posts, optionally filtered/paginated/sorted. */
	async posts(
		options?: PostsListOptions,
		requestOptions?: RequestOptions,
	): Promise<Pager<Post>> {
		return this.postsModule.list(options, requestOptions);
	}

	/** Fetches a single post by id, or `null` if it doesn't exist. */
	async post(
		postId: string,
		options?: { summary?: boolean },
		requestOptions?: RequestOptions,
	): Promise<Post | null> {
		return this.postsModule.get(postId, options, requestOptions);
	}

	/**
	 * Returns the most recent posts (default 5), newest first. Pass a bare
	 * `number` for just a limit, or an options object to also filter by
	 * `label`, `query`, date range, etc.
	 */
	async latest(
		options?: LatestOptions,
		requestOptions?: RequestOptions,
	): Promise<Post[]> {
		return this.postsModule.latest(options, requestOptions);
	}

	/** Best-effort "featured"/pinned post — see {@link PostsModule.featured}. */
	async featured(requestOptions?: RequestOptions): Promise<Post | null> {
		return this.postsModule.featured(requestOptions);
	}

	/**
	 * Returns random post(s) sampled from the whole blog. Pass a bare
	 * `number` for just a count, or an options object to also filter by
	 * `label`, `query`, date range, etc.
	 */
	async random(
		options?: RandomOptions,
		requestOptions?: RequestOptions,
	): Promise<Post[]> {
		return this.postsModule.random(options, requestOptions);
	}

	// ---------------------------------------------------------------------
	// Pages
	// ---------------------------------------------------------------------

	/** Lists the blog's static pages. */
	async pages(
		options?: PagesListOptions,
		requestOptions?: RequestOptions,
	): Promise<Pager<Post>> {
		return this.pagesModule.list(options, requestOptions);
	}

	/** Fetches a single page by id, or `null` if it doesn't exist. */
	async page(
		pageId: string,
		options?: { summary?: boolean },
		requestOptions?: RequestOptions,
	): Promise<Post | null> {
		return this.pagesModule.get(pageId, options, requestOptions);
	}

	// ---------------------------------------------------------------------
	// Comments
	// ---------------------------------------------------------------------

	/**
	 * Lists comments — for the whole blog when called with no argument or an
	 * options object, or scoped to a single post when passed a `postId` string.
	 */
	async comments(
		postIdOrOptions?: string | CommentsListOptions,
		requestOptions?: RequestOptions,
	): Promise<Pager<Comment>> {
		const options: CommentsListOptions = isString(postIdOrOptions)
			? { postId: postIdOrOptions }
			: (postIdOrOptions ?? {});
		return this.commentsModule.list(options, requestOptions);
	}

	/**
	 * Fetches a single comment by id. Pass `postId` when known for a single,
	 * direct request — see {@link CommentsModule.get}.
	 */
	async comment(
		commentId: string,
		postId?: string,
		requestOptions?: RequestOptions,
	): Promise<Comment | null> {
		return this.commentsModule.get(
			commentId,
			postId,
			undefined,
			requestOptions,
		);
	}

	// ---------------------------------------------------------------------
	// Labels / categories
	// ---------------------------------------------------------------------

	/** Lists every label known to the blog. */
	async labels(requestOptions?: RequestOptions): Promise<string[]> {
		return this.labelsModule.list(requestOptions);
	}

	/** Lists posts carrying `label`. */
	async label(
		label: string,
		options?: Omit<PostsListOptions, "label">,
		requestOptions?: RequestOptions,
	): Promise<Pager<Post>> {
		return this.labelsModule.get(label, options, requestOptions);
	}

	/** Alias of {@link Blogr.labels} — Blogger uses "labels" and "categories" interchangeably. */
	async categories(requestOptions?: RequestOptions): Promise<string[]> {
		return this.labels(requestOptions);
	}

	// ---------------------------------------------------------------------
	// Search
	// ---------------------------------------------------------------------

	/** Full-text search across posts. Accepts a query string or a {@link SearchOptions} object. */
	async search(
		input: string | SearchOptions,
		requestOptions?: RequestOptions,
	): Promise<Pager<Post>> {
		return this.searchModule.run(input, requestOptions);
	}

	// ---------------------------------------------------------------------
	// Images
	// ---------------------------------------------------------------------

	/** Unique image URLs found across a sample of recent posts. */
	async images(
		options?: { sampleSize?: number },
		requestOptions?: RequestOptions,
	): Promise<string[]> {
		return this.imagesModule.list(options, requestOptions);
	}

	// ---------------------------------------------------------------------
	// Utilities
	// ---------------------------------------------------------------------

	/** Resolves a possibly-relative URL against the blog's own URL. */
	async resolve(url: string): Promise<string> {
		const base = await this.client.getBlogUrl();
		return new URL(url, base).toString();
	}

	/** Parses a raw Blogger feed JSON payload (e.g. from {@link Blogr.fetch}) into a {@link ParsedFeed}. */
	parse(raw: unknown): ParsedFeed {
		return parseFeed(raw);
	}

	/** Normalizes a single raw feed entry object into a typed {@link Post}, {@link Comment} or {@link BlogInfo}. */
	normalize(data: unknown): Post | Comment | BlogInfo | null {
		const wrapped = parseFeed({ entry: data });
		if (wrapped.posts?.[0]) return wrapped.posts[0];
		if (wrapped.comments?.[0]) return wrapped.comments[0];
		const direct = parseFeed(data);
		return direct.blog ?? direct.posts?.[0] ?? direct.comments?.[0] ?? null;
	}

	/** Strips HTML tags, returning plain text. */
	htmlToText(input: Post | string | null | undefined): string {
		return htmlToText(input);
	}

	/** Best-effort HTML → Markdown conversion. */
	htmlToMarkdown(input: Post | string | null | undefined): string {
		return htmlToMarkdown(input);
	}

	/** Every unique image URL in a post's HTML content. */
	extractImages(input: Post | string | null | undefined): string[] {
		return extractImages(input);
	}

	/** Every link (`{ url, text }`) in a post's HTML content. */
	extractLinks(input: Post | string | null | undefined): ExtractedLink[] {
		return extractLinks(input);
	}

	/** Every YouTube video (`{ id, url }`) referenced/embedded in a post. */
	extractYouTube(input: Post | string | null | undefined): ExtractedYouTube[] {
		return extractYouTube(input);
	}

	/** Every non-YouTube `<iframe>` embed (`{ src, provider }`) in a post. */
	extractEmbeds(input: Post | string | null | undefined): ExtractedEmbed[] {
		return extractEmbeds(input);
	}

	/** Best available thumbnail for a post. */
	thumbnail(input: Post | string | null | undefined): string | null {
		return thumbnail(input);
	}

	// ---------------------------------------------------------------------
	// Low-level
	// ---------------------------------------------------------------------

	/** Performs a request against a feed-relative `endpoint` (or absolute URL) and returns the parsed feed. */
	async request(
		endpoint: string | URL,
		requestOptions?: RequestOptions,
	): Promise<ParsedFeed> {
		return this.client.req(endpoint, { signal: requestOptions?.signal });
	}

	/** Fetches an arbitrary URL and returns raw parsed JSON (bypasses feed parsing). */
	async fetch<T = unknown>(
		url: string | URL,
		requestOptions?: RequestOptions,
	): Promise<T> {
		return this.client.fetchRaw<T>(url, requestOptions);
	}

	// ---------------------------------------------------------------------
	// Plugins & events
	// ---------------------------------------------------------------------

	/** Installs a plugin — a function `(blog) => void`, or an object with an `install(blog)` method. */
	use(plugin: BloggerPlugin): this {
		installPlugin(this, plugin);
		return this;
	}

	/** Subscribes to `"request"`, `"response"` or `"error"` lifecycle events. */
	on<K extends BloggerEventName>(
		event: K,
		listener: (payload: BloggerEventMap[K]) => void,
	): this {
		this.client.events.on(event, listener);
		return this;
	}

	/** Unsubscribes a previously-registered listener. */
	off<K extends BloggerEventName>(
		event: K,
		listener: (payload: BloggerEventMap[K]) => void,
	): this {
		this.client.events.off(event, listener);
		return this;
	}

	// ---------------------------------------------------------------------
	// Factories
	// ---------------------------------------------------------------------

	/** Creates a client and eagerly resolves/validates the blog's metadata. */
	static async connect(
		urlOrId: string | URL,
		options: ClientOptions = {},
	): Promise<Blogr> {
		const blog = new Blogr(urlOrId, options);
		await blog.info();
		return blog;
	}

	/** Creates a client from a numeric Blogger blog id. */
	static fromBlogId(id: string, options: ClientOptions = {}): Blogr {
		assertNonBlankString(id, "id");
		return new Blogr(id, options);
	}

	/** Creates a client from a blog URL (custom domain or `*.blogspot.com`). */
	static fromUrl(url: string | URL, options: ClientOptions = {}): Blogr {
		return new Blogr(url, options);
	}

	/**
	 * Creates a client from any Blogger feed URL, e.g.
	 * `https://example.blogspot.com/feeds/posts/default` or
	 * `https://www.blogger.com/feeds/1234567890/posts/default`.
	 */
	static fromFeed(feedUrl: string | URL, options: ClientOptions = {}): Blogr {
		const url = feedUrl instanceof URL ? feedUrl : new URL(feedUrl);

		if (/^(www\.)?blogger\.com$/i.test(url.hostname)) {
			const match = /\/feeds\/(\d{10,24})\//.exec(url.pathname);
			if (match?.[1]) return new Blogr(match[1], options);
		}

		return new Blogr(url.origin, options);
	}
}
