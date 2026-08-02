/** An author of a post, page, comment or the blog itself. */
export interface Author {
	/** Display name of the author, or `null` if unavailable. */
	name: string | null;
	/** Profile URL of the author, or `null` if unavailable. */
	url: string | null;
	/** Avatar/profile image URL of the author, or `null` if unavailable. */
	image: string | null;
}

/** A single `<link>` entry as reported by the feed. */
export interface Link {
	rel: string;
	href: string;
	type: string | null;
	title: string | null;
}

/** Geo-location info attached to a post, if any. */
export interface Geo {
	box: string | null;
	featureName: string | null;
	point: string | null;
}

/** Extra info attached to a comment entry. */
export interface Extended {
	/** CSS class assigned to the commenter, if any. */
	class: string | null;
	/** Human formatted publish time, if any. */
	time: string | null;
	/** Whether the comment has been removed/moderated. */
	removed: boolean;
}

/** Metadata about comments attached to a post. */
export interface PostCommentInfo {
	feed: string | null;
	number: number | null;
	title: string | null;
}

/** Blog-level metadata. */
export interface BlogInfo {
	/** Numeric Blogger blog id. */
	id: string;
	/** Blog title. */
	title: string;
	/** Blog subtitle/description, or `null`. */
	subtitle: string | null;
	/** Canonical URL of the blog. */
	url: string;
	/** All labels currently known to the feed response. */
	labels: string[];
	/** Language code of the blog, if available. */
	language: string | null;
	/** ISO timestamp of the last update to the blog. */
	updated: string;
	/** Blog author/owner. */
	author: Author;
	/** Favicon URL, best-effort (derived), or `null`. */
	favicon: string | null;
	/** Raw `<link>` entries from the feed. */
	links: Link[];
}

/** A Blogger post or page entry. */
export interface Post {
	/** Entry id (numeric string). */
	id: string;
	/** Title of the entry. */
	title: string;
	/** Canonical URL of the entry. */
	url: string;
	/** ISO published timestamp. */
	published: string;
	/** ISO last-updated timestamp. */
	updated: string;
	/** Labels attached to the entry. */
	labels: string[];
	/** Entry author. */
	author: Author;
	/** Full HTML content, or `null` when only a summary was requested. */
	content: string | null;
	/** Plain-text/HTML summary/snippet, or `null`. */
	summary: string | null;
	/** Best-guess thumbnail extracted from content, or `null`. */
	thumbnail: string | null;
	/** Thumbnail explicitly selected by Blogger, or `null`. */
	thumbnailAlt: string | null;
	/** Comment count/metadata for this entry. */
	comments: PostCommentInfo;
	/** Geo-location, if attached. */
	geo: Geo;
	/** Raw `<link>` entries from the feed. */
	links: Link[];
}

/** A comment entry. */
export interface Comment {
	id: string;
	title: string;
	url: string;
	published: string;
	updated: string;
	author: Author;
	content: string | null;
	summary: string | null;
	extended: Extended;
	/** The post this comment belongs to. */
	post: {
		id: string;
		url: string;
	};
	/** Id of the parent comment when this is a reply, else `null`. */
	inReplyTo: string | null;
	links: Link[];
}

/** The parsed shape of any Blogger feed response (posts, pages or comments). */
export interface ParsedFeed {
	blog: BlogInfo | null;
	posts: Post[] | null;
	comments: Comment[] | null;
	itemsPerPage: number | null;
	startIndex: number | null;
	totalResults: number | null;
	selfUrl: string | null;
	previousUrl: string | null;
	nextUrl: string | null;
	links: Link[];
}
