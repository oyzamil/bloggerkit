import { describe, expect, it } from "vitest";

import { parseFeed } from "../src/parser/feed-parser";

function makeFeed(entries: unknown[] = []) {
	return {
		feed: {
			id: { $t: "tag:blogger.com,1999:blog-1234567890" },
			title: { $t: "My Blog" },
			subtitle: { $t: "A blog about things" },
			updated: { $t: "2026-01-01T00:00:00.000-08:00" },
			category: [{ term: "JavaScript" }, { term: "TypeScript" }],
			link: [
				{
					rel: "alternate",
					type: "text/html",
					href: "https://example.blogspot.com/",
				},
				{
					rel: "self",
					type: "application/atom+xml",
					href: "https://example.blogspot.com/feeds/posts/default?start-index=1&max-results=25",
				},
				{
					rel: "next",
					type: "application/atom+xml",
					href: "https://example.blogspot.com/feeds/posts/default?start-index=26&max-results=25",
				},
			],
			author: [
				{
					name: { $t: "Jane Doe" },
					uri: { $t: "https://www.blogger.com/profile/111" },
					gd$image: { src: "https://example.com/avatar.jpg" },
				},
			],
			openSearch$itemsPerPage: { $t: "25" },
			openSearch$startIndex: { $t: "1" },
			openSearch$totalResults: { $t: "42" },
			entry: entries,
		},
	};
}

function makePostEntry(overrides: Record<string, unknown> = {}) {
	return {
		id: { $t: "tag:blogger.com,1999:blog-1234567890.post-987" },
		title: { $t: "Hello World" },
		published: { $t: "2026-01-01T00:00:00.000-08:00" },
		updated: { $t: "2026-01-02T00:00:00.000-08:00" },
		category: [{ term: "JavaScript" }],
		summary: { $t: "A short summary" },
		content: {
			$t: '<p>Hello <img src="https://example.com/pic.jpg"> world</p>',
		},
		author: [
			{
				name: { $t: "Jane Doe" },
				uri: { $t: "https://www.blogger.com/profile/111" },
			},
		],
		link: [
			{
				rel: "alternate",
				type: "text/html",
				href: "https://example.blogspot.com/2026/01/hello.html",
			},
			{
				rel: "replies",
				type: "text/html",
				title: "3 Comments",
				href: "https://example.blogspot.com/2026/01/hello.html#comments",
			},
			{
				rel: "replies",
				type: "application/atom+xml",
				href: "https://example.blogspot.com/feeds/987/comments/default",
			},
		],
		...overrides,
	};
}

function makeCommentEntry(overrides: Record<string, unknown> = {}) {
	return {
		id: { $t: "tag:blogger.com,1999:blog-1234567890.post-987.comment-555" },
		title: { $t: "Nice post!" },
		published: { $t: "2026-01-03T00:00:00.000-08:00" },
		updated: { $t: "2026-01-03T00:00:00.000-08:00" },
		content: { $t: "Nice post!" },
		author: [
			{
				name: { $t: "A Reader" },
				uri: { $t: "https://www.blogger.com/profile/222" },
			},
		],
		"thr$in-reply-to": {
			href: "https://example.blogspot.com/2026/01/hello.html",
			ref: "tag:blogger.com,1999:blog-1234567890.post-987",
		},
		link: [
			{
				rel: "alternate",
				type: "text/html",
				href: "https://example.blogspot.com/2026/01/hello.html?showComment=1#c555",
			},
			{
				rel: "related",
				type: "application/atom+xml",
				href: "https://example.blogspot.com/feeds/987/comments/default/555",
			},
		],
		...overrides,
	};
}

describe("parseFeed", () => {
	it("parses blog metadata", () => {
		const result = parseFeed(makeFeed());
		expect(result.blog).not.toBeNull();
		expect(result.blog?.id).toBe("1234567890");
		expect(result.blog?.title).toBe("My Blog");
		expect(result.blog?.url).toBe("https://example.blogspot.com/");
		expect(result.blog?.labels).toEqual(["JavaScript", "TypeScript"]);
		expect(result.blog?.author.name).toBe("Jane Doe");
		expect(result.blog?.favicon).toBe(
			"https://example.blogspot.com/favicon.ico",
		);
	});

	it("parses pagination fields", () => {
		const result = parseFeed(makeFeed());
		expect(result.itemsPerPage).toBe(25);
		expect(result.totalResults).toBe(42);
		expect(result.nextUrl).toContain("start-index=26");
		expect(result.previousUrl).toBeNull();
	});

	it("parses post entries, including thumbnail extraction and comment info", () => {
		const result = parseFeed(makeFeed([makePostEntry()]));
		expect(result.posts).toHaveLength(1);
		const post = result.posts?.[0];
		expect(post?.id).toBe("987");
		expect(post?.title).toBe("Hello World");
		expect(post?.url).toBe("https://example.blogspot.com/2026/01/hello.html");
		expect(post?.labels).toEqual(["JavaScript"]);
		expect(post?.thumbnailAlt).toBe("https://example.com/pic.jpg");
		expect(post?.comments.number).toBe(3);
		expect(post?.comments.feed).toBe(
			"https://example.blogspot.com/feeds/987/comments/default",
		);
	});

	it("parses comment entries and links them to their post", () => {
		const result = parseFeed(makeFeed([makeCommentEntry()]));
		expect(result.comments).toHaveLength(1);
		const comment = result.comments?.[0];
		expect(comment?.id).toBe("555");
		expect(comment?.post.id).toBe("987");
		expect(comment?.inReplyTo).toBe("555");
	});

	it("separates posts and comments when both are present", () => {
		const result = parseFeed(makeFeed([makePostEntry(), makeCommentEntry()]));
		expect(result.posts).toHaveLength(1);
		expect(result.comments).toHaveLength(1);
	});
});
