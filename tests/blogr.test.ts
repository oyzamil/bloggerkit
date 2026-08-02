import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Blogr } from "../src/blogger";

function feedJson(entries: unknown[], overrides: Record<string, unknown> = {}) {
	return {
		feed: {
			id: { $t: "tag:blogger.com,1999:blog-42" },
			title: { $t: "Test Blog" },
			updated: { $t: "2026-01-01T00:00:00.000-08:00" },
			category: [{ term: "Tech" }],
			link: [
				{
					rel: "alternate",
					type: "text/html",
					href: "https://example.blogspot.com/",
				},
				{
					rel: "self",
					type: "application/atom+xml",
					href: "https://example.blogspot.com/feeds/posts/default",
				},
			],
			author: [
				{ name: { $t: "Jane" }, uri: { $t: "https://blogger.com/profile/1" } },
			],
			openSearch$itemsPerPage: { $t: "25" },
			openSearch$startIndex: { $t: "1" },
			openSearch$totalResults: { $t: String(entries.length) },
			entry: entries,
			...overrides,
		},
	};
}

function post(id: string, title: string) {
	return {
		id: { $t: `tag:blogger.com,1999:blog-42.post-${id}` },
		title: { $t: title },
		published: { $t: "2026-01-01T00:00:00.000-08:00" },
		updated: { $t: "2026-01-01T00:00:00.000-08:00" },
		content: { $t: `<p>${title}</p>` },
		author: [
			{ name: { $t: "Jane" }, uri: { $t: "https://blogger.com/profile/1" } },
		],
		link: [
			{
				rel: "alternate",
				type: "text/html",
				href: `https://example.blogspot.com/2026/01/${id}.html`,
			},
		],
	};
}

describe("Blogr", () => {
	let fetchMock: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		fetchMock = vi.fn(async (url: string | URL) => {
			const u = String(url);
			let body: unknown;
			if (u.includes("start-index=2")) {
				body = feedJson([post("2", "Second")]);
			} else {
				body = feedJson([post("1", "First")]);
			}
			return new Response(JSON.stringify(body), { status: 200 });
		});
		vi.stubGlobal("fetch", fetchMock);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("lists posts and exposes pagination", async () => {
		const blog = new Blogr("https://example.blogspot.com");
		const page = await blog.posts({ limit: 1 });
		expect(page.items).toHaveLength(1);
		expect(page.items[0]?.title).toBe("First");
		expect(page.totalResults).toBe(1);
	});

	it("fetches blog info", async () => {
		const blog = new Blogr("https://example.blogspot.com");
		const info = await blog.info();
		expect(info.title).toBe("Test Blog");
		expect(info.labels).toEqual(["Tech"]);
	});

	it("builds raw feed urls without making a request", () => {
		const blog = new Blogr("https://example.blogspot.com");
		expect(blog.url.posts()).toBe(
			"https://example.blogspot.com/feeds/posts/default?alt=json&redirect=false",
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("emits request/response events", async () => {
		const blog = new Blogr("https://example.blogspot.com");
		const onRequest = vi.fn();
		const onResponse = vi.fn();
		blog.on("request", onRequest).on("response", onResponse);
		await blog.posts({ limit: 1 });
		expect(onRequest).toHaveBeenCalled();
		expect(onResponse).toHaveBeenCalled();
	});

	it("caches identical requests when cache is enabled", async () => {
		const blog = new Blogr("https://example.blogspot.com");
		blog.cache.enable();
		await blog.posts({ limit: 1 });
		await blog.posts({ limit: 1 });
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it("installs a plugin via use()", () => {
		const blog = new Blogr("https://example.blogspot.com");
		const install = vi.fn();
		blog.use(install);
		expect(install).toHaveBeenCalledWith(blog);
	});

	it("converts a post's HTML content via htmlToText", async () => {
		const blog = new Blogr("https://example.blogspot.com");
		const page = await blog.posts({ limit: 1 });
		expect(blog.htmlToText(page.items[0])).toBe("First");
	});
});
