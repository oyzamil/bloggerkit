import type {
	Author,
	BlogInfo,
	Comment,
	Extended,
	Geo,
	Link,
	ParsedFeed,
	Post,
	PostCommentInfo,
} from "../types/feed";

import { getNested, isArray, isObject, isString } from "../core/utils";

function getLinks(linkArray: unknown): {
	alternate: string | null;
	links: Link[];
} {
	const links: Link[] = [];
	let href: string | null = null;

	if (isArray(linkArray)) {
		for (const link of linkArray) {
			const rel = getNested(link, "rel");
			const linkHref = getNested(link, "href");
			const type = getNested(link, "type");
			const title = getNested(link, "title");

			if (isString(rel) && isString(linkHref)) {
				links.push({
					rel,
					href: linkHref,
					type: isString(type) ? type : null,
					title: isString(title) ? title : null,
				});

				if (rel === "alternate" && type === "text/html") {
					href = linkHref;
				}
			}
		}
	}

	return { alternate: href, links };
}

function getPagination(
	feed: unknown,
): Record<"self" | "previous" | "next", string | null> {
	const result: Record<"self" | "previous" | "next", string | null> = {
		self: null,
		previous: null,
		next: null,
	};

	const { links } = getLinks(getNested(feed, "link"));

	for (const { rel, href, type } of links) {
		if (type === "text/html") continue;
		if (rel === "self") result.self = href;
		else if (rel === "previous") result.previous = href;
		else if (rel === "next") result.next = href;
	}

	return result;
}

function getLabels(categoryArray: unknown): string[] {
	const labels: string[] = [];
	if (isArray(categoryArray)) {
		for (const category of categoryArray) {
			const term = getNested(category, "term");
			if (isString(term)) labels.push(term);
		}
	}
	return labels;
}

function getGeo(entry: unknown): Geo {
	const [box, featureName, point] = [
		"georss$box",
		"georss$featurename",
		"georss$point",
	].map((key) => {
		const value = getNested(entry, key, "$t");
		return isString(value) ? value : null;
	});
	return {
		box: box ?? null,
		featureName: featureName ?? null,
		point: point ?? null,
	};
}

function getPostComments(linkArray: unknown): PostCommentInfo {
	const result: PostCommentInfo = { feed: null, number: null, title: null };
	const replies = getLinks(linkArray).links.filter((l) => l.rel === "replies");

	for (const { title, type, href } of replies) {
		if (type === "text/html" && isString(title)) {
			const match = title.match(/\d+/);
			result.title = title;
			result.number = match ? Number.parseInt(match[0], 10) : 0;
		} else if (type === "application/atom+xml" && isString(href)) {
			result.feed = href;
		}
	}

	return result;
}

function getAuthors(authorArray: unknown): Author[] {
	const authors: Author[] = [];
	if (isArray(authorArray)) {
		for (const author of authorArray) {
			const name = getNested(author, "name", "$t");
			const uri = getNested(author, "uri", "$t");
			const image = getNested(author, "gd$image", "src");

			authors.push({
				name: isString(name) ? name : null,
				url: isString(uri) ? uri : null,
				image:
					isString(image) &&
					image.trim().toLowerCase() !==
						"https://img1.blogblog.com/img/b16-rounded.gif"
						? image
						: null,
			});
		}
	}
	return authors;
}

const EMPTY_AUTHOR: Author = { name: null, url: null, image: null };

function getExtended(entry: unknown): Extended {
	const result: Extended = { class: null, time: null, removed: false };
	const list = getNested(entry, "gd$extendedProperty");

	if (isArray(list)) {
		for (const item of list) {
			const name = getNested(item, "name");
			const value = getNested(item, "value");
			if (!isString(name) || !isString(value)) continue;

			if (name === "blogger.itemClass") result.class = value;
			else if (name === "blogger.displayTime") result.time = value;
			else if (name === "blogger.contentRemoved")
				result.removed = value === "true";
		}
	}

	return result;
}

function getThumbnail(entry: unknown): [string | null, string | null] {
	const media = getNested(entry, "media$thumbnail", "url");
	const thumbnail = isString(media) ? media : null;

	if (thumbnail !== null) return [thumbnail, thumbnail];

	const content = getNested(entry, "content", "$t");
	const summary = getNested(entry, "summary", "$t");
	const html = isString(content) ? content : isString(summary) ? summary : null;

	const match = html
		? /<img\s+(.*?)src=(["'])([^"']+?)\2(.*?)\/?>/i.exec(html)
		: null;

	return [null, match?.[3] ?? null];
}

function getOpenSearchNumber(feed: unknown, key: string): number | null {
	const value = getNested(feed, key, "$t");
	return isString(value) ? Number(value) : null;
}

function getBlog(feed: unknown): BlogInfo | null {
	const id = getNested(feed, "id", "$t");
	const title = getNested(feed, "title", "$t");
	const subtitle = getNested(feed, "subtitle", "$t");
	const updated = getNested(feed, "updated", "$t");
	const language = getNested(feed, "title", "lang");
	const { alternate, links } = getLinks(getNested(feed, "link"));

	if (
		isObject(feed) &&
		isString(id) &&
		isString(title) &&
		isString(updated) &&
		isString(alternate)
	) {
		let favicon: string | null = null;
		try {
			favicon = new URL("/favicon.ico", alternate).toString();
		} catch {
			favicon = null;
		}

		return {
			id: id.replace(/^.*blog-(\d+).*$/, "$1"),
			title,
			subtitle: isString(subtitle) ? subtitle : null,
			labels: getLabels(getNested(feed, "category")),
			url: alternate,
			language: isString(language) ? language : null,
			links,
			updated,
			author: getAuthors(getNested(feed, "author"))[0] ?? EMPTY_AUTHOR,
			favicon,
		};
	}

	return null;
}

function getPost(entry: unknown): Post | null {
	const id = getNested(entry, "id", "$t");
	const title = getNested(entry, "title", "$t");
	const published = getNested(entry, "published", "$t");
	const updated = getNested(entry, "updated", "$t");
	const summary = getNested(entry, "summary", "$t");
	const content = getNested(entry, "content", "$t");
	const linkArray = getNested(entry, "link");
	const { alternate, links } = getLinks(linkArray);

	if (
		isObject(entry) &&
		isString(alternate) &&
		isString(id) &&
		isString(title) &&
		isString(published) &&
		isString(updated)
	) {
		const [thumbnail, thumbnailAlt] = getThumbnail(entry);

		return {
			id: id.replace(/^.*(?:page|post)-(\d+)$/, "$1"),
			title,
			published,
			updated,
			labels: getLabels(getNested(entry, "category")),
			url: alternate,
			links,
			author: getAuthors(getNested(entry, "author"))[0] ?? EMPTY_AUTHOR,
			thumbnail,
			thumbnailAlt,
			summary: isString(summary) ? summary : null,
			content: isString(content) ? content : null,
			comments: getPostComments(linkArray),
			geo: getGeo(entry),
		};
	}

	return null;
}

function getComment(entry: unknown): Comment | null {
	const id = getNested(entry, "id", "$t");
	const title = getNested(entry, "title", "$t");
	const published = getNested(entry, "published", "$t");
	const updated = getNested(entry, "updated", "$t");
	const inReplyTo = getNested(entry, "thr$in-reply-to");
	const inReplyToHref = getNested(inReplyTo, "href");
	const inReplyToRef = getNested(inReplyTo, "ref");
	const summary = getNested(entry, "summary", "$t");
	const content = getNested(entry, "content", "$t");
	const linkArray = getNested(entry, "link");
	const { alternate, links } = getLinks(linkArray);

	if (
		isObject(entry) &&
		isString(alternate) &&
		isString(id) &&
		isString(title) &&
		isString(published) &&
		isString(updated) &&
		isString(inReplyToHref) &&
		isString(inReplyToRef)
	) {
		const inReplyToMatch = links
			.find((l) => l.rel === "related")
			?.href.match(/\/feeds\/(.*)\/comments\/[^/]+\/(\d+)/);

		return {
			id: id.replace(/^.*(?:page|post|comment)-(\d+)$/, "$1"),
			title,
			published,
			updated,
			url: alternate,
			links,
			author: getAuthors(getNested(entry, "author"))[0] ?? EMPTY_AUTHOR,
			summary: isString(summary) ? summary : null,
			content: isString(content) ? content : null,
			extended: getExtended(entry),
			post: {
				id: inReplyToRef.replace(/^.*(?:page|post)-(\d+)$/, "$1"),
				url: inReplyToHref.split("?")[0] ?? inReplyToHref,
			},
			inReplyTo: inReplyToMatch?.[2] ?? null,
		};
	}

	return null;
}

function getEntries(entryArray: unknown): {
	posts: Post[] | null;
	comments: Comment[] | null;
} {
	if (!isArray(entryArray)) return { posts: null, comments: null };

	const posts: Post[] = [];
	const comments: Comment[] = [];

	for (const entry of entryArray) {
		if (!isObject(entry)) continue;
		if ("thr$in-reply-to" in entry) {
			const comment = getComment(entry);
			if (comment) comments.push(comment);
		} else {
			const post = getPost(entry);
			if (post) posts.push(post);
		}
	}

	return { posts, comments };
}

function getEntryArray(input: unknown): unknown[] | null {
	if (isArray(input)) return input;
	if (isObject(input)) return [input];
	return null;
}

/**
 * Parses a raw Blogger GData JSON response (the shape returned by
 * `?alt=json`) into a typed {@link ParsedFeed}.
 *
 * Accepts either `{ feed: { entry } }` (a full feed response) or
 * `{ entry }` (a single-entry response).
 */
export function parseFeed(input: unknown): ParsedFeed {
	const feedObject = getNested(input, "feed");

	const root = isObject(feedObject) ? feedObject : input;
	const entryArray = getEntryArray(getNested(root, "entry"));

	const { posts, comments } = getEntries(entryArray);
	const pagination = getPagination(
		isObject(feedObject) ? feedObject : undefined,
	);

	return {
		blog: getBlog(isObject(feedObject) ? feedObject : undefined),
		links: getLinks(getNested(root, "link")).links,
		posts,
		comments,
		itemsPerPage: getOpenSearchNumber(root, "openSearch$itemsPerPage"),
		startIndex: getOpenSearchNumber(root, "openSearch$startIndex"),
		totalResults: getOpenSearchNumber(root, "openSearch$totalResults"),
		selfUrl: pagination.self,
		previousUrl: pagination.previous,
		nextUrl: pagination.next,
	};
}
