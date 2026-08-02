import { describe, expect, it } from "vitest";

import { BloggerImage } from "../src/modules/image";

const FOLDER_STYLE =
	"https://1.bp.blogspot.com/-abc123/hash/AAAA/s72-c/image.jpg";
const QUERY_STYLE = "https://lh3.googleusercontent.com/abc123=s800";
const UNSUPPORTED = "https://example.com/image.jpg";

describe("BloggerImage", () => {
	it("recognizes supported hosts", () => {
		expect(new BloggerImage(FOLDER_STYLE).isSupported()).toBe(true);
		expect(new BloggerImage(QUERY_STYLE).isSupported()).toBe(true);
		expect(new BloggerImage(UNSUPPORTED).isSupported()).toBe(false);
	});

	it("throws for unsupported hosts unless passThrough is set", () => {
		expect(() => new BloggerImage(UNSUPPORTED).width(200).url()).toThrow();
		expect(
			new BloggerImage(UNSUPPORTED, { passThrough: true }).width(200).url(),
		).toBe(UNSUPPORTED);
	});

	it("adds width/height while preserving the existing size/crop params", () => {
		const url = new BloggerImage(FOLDER_STYLE).width(400).height(300).url();
		expect(url).toBe(
			"https://1.bp.blogspot.com/-abc123/hash/AAAA/s72-c-w400-h300/image.jpg",
		);
	});

	it("preserves existing params by default and lets you add to them", () => {
		const img = new BloggerImage(FOLDER_STYLE);
		expect(img.crop()).toBe(true);
		expect(img.size()).toBe(72);
		img.width(100);
		expect(img.url()).toContain("w100");
		expect(img.url()).toContain("c");
	});

	it("ignores existing params when existing: false", () => {
		const img = new BloggerImage(FOLDER_STYLE, { existing: false });
		expect(img.crop()).toBe(false);
	});

	it("switching crop modes clears the other crop flags", () => {
		const url = new BloggerImage(FOLDER_STYLE)
			.crop(true)
			.circularCrop(true)
			.url();
		expect(url).toContain("cc");
	});

	it("adds to the trailing query-style param segment", () => {
		const url = new BloggerImage(QUERY_STYLE).width(200).url();
		expect(url).toBe("https://lh3.googleusercontent.com/abc123=s800-w200");
	});

	it("drops all existing params when existing: false", () => {
		const url = new BloggerImage(QUERY_STYLE, { existing: false })
			.width(200)
			.url();
		expect(url).toBe("https://lh3.googleusercontent.com/abc123=w200");
	});

	it("validates hex color format", () => {
		expect(() => new BloggerImage(FOLDER_STYLE).color("not-a-color")).toThrow();
		expect(new BloggerImage(FOLDER_STYLE).color("0xff0000").url()).toContain(
			"c0xff0000",
		);
	});

	it("format toggles are mutually exclusive", () => {
		const img = new BloggerImage(FOLDER_STYLE).jpeg(true).webp(true);
		expect(img.jpeg()).toBe(false);
		expect(img.webp()).toBe(true);
	});
});
