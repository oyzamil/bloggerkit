import { describe, expect, it } from "vitest";

import {
	extractEmbeds,
	extractImages,
	extractLinks,
	extractYouTube,
	htmlToMarkdown,
	htmlToText,
	thumbnail,
} from "../src/parser/html";

const SAMPLE_HTML = `
	<h2>Title</h2>
	<p>Some <strong>bold</strong> and <em>italic</em> text with a <a href="https://example.com">link</a>.</p>
	<img src="https://example.com/a.jpg" alt="A"/>
	<img src="https://example.com/b.jpg" alt="B"/>
	<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>
	<iframe src="https://open.spotify.com/embed/track/xyz"></iframe>
	<ul><li>one</li><li>two</li></ul>
`;

describe("htmlToText", () => {
	it("strips tags and collapses whitespace", () => {
		const text = htmlToText(SAMPLE_HTML);
		expect(text).toContain("Title");
		expect(text).toContain("Some bold and italic text with a link.");
		expect(text).not.toContain("<");
	});

	it("accepts a Post object and reads its content/summary", () => {
		const text = htmlToText({ content: "<p>hi</p>", summary: null } as never);
		expect(text).toBe("hi");
	});

	it("returns an empty string for null/undefined", () => {
		expect(htmlToText(null)).toBe("");
		expect(htmlToText(undefined)).toBe("");
	});
});

describe("htmlToMarkdown", () => {
	it("converts headings, bold, italic and links", () => {
		const md = htmlToMarkdown(SAMPLE_HTML);
		expect(md).toContain("## Title");
		expect(md).toContain("**bold**");
		expect(md).toContain("*italic*");
		expect(md).toContain("[link](https://example.com)");
	});

	it("converts list items to markdown bullets", () => {
		const md = htmlToMarkdown(SAMPLE_HTML);
		expect(md).toContain("- one");
		expect(md).toContain("- two");
	});
});

describe("extractImages", () => {
	it("returns every unique image src", () => {
		expect(extractImages(SAMPLE_HTML)).toEqual([
			"https://example.com/a.jpg",
			"https://example.com/b.jpg",
		]);
	});
});

describe("extractLinks", () => {
	it("returns url + text for every anchor", () => {
		expect(extractLinks(SAMPLE_HTML)).toEqual([
			{ url: "https://example.com", text: "link" },
		]);
	});
});

describe("extractYouTube", () => {
	it("finds an embedded YouTube video", () => {
		const videos = extractYouTube(SAMPLE_HTML);
		expect(videos).toEqual([
			{ id: "dQw4w9WgXcQ", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
		]);
	});
});

describe("extractEmbeds", () => {
	it("finds non-YouTube iframe embeds with a guessed provider", () => {
		const embeds = extractEmbeds(SAMPLE_HTML);
		expect(embeds).toEqual([
			{ src: "https://open.spotify.com/embed/track/xyz", provider: "spotify" },
		]);
	});
});

describe("thumbnail", () => {
	it("prefers the post's own thumbnail field", () => {
		expect(
			thumbnail({
				thumbnail: "https://example.com/thumb.jpg",
				content: SAMPLE_HTML,
			} as never),
		).toBe("https://example.com/thumb.jpg");
	});

	it("falls back to the first extracted image", () => {
		expect(thumbnail(SAMPLE_HTML)).toBe("https://example.com/a.jpg");
	});
});
