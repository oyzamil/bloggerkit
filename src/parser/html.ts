import type { Post } from "../types/feed";

function resolveHtml(input: Post | string | null | undefined): string {
	if (input === null || input === undefined) return "";
	if (typeof input === "string") return input;
	return input.content ?? input.summary ?? "";
}

const ENTITIES: Record<string, string> = {
	"&amp;": "&",
	"&lt;": "<",
	"&gt;": ">",
	"&quot;": '"',
	"&#39;": "'",
	"&apos;": "'",
	"&nbsp;": " ",
};

function decodeEntities(text: string): string {
	return text
		.replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
		.replace(/&#x([0-9a-f]+);/gi, (_, code) =>
			String.fromCodePoint(Number.parseInt(code, 16)),
		)
		.replace(/&(amp|lt|gt|quot|#39|apos|nbsp);/g, (m) => ENTITIES[m] ?? m);
}

/** Strips HTML tags and decodes entities, collapsing whitespace into a plain-text string. */
export function htmlToText(input: Post | string | null | undefined): string {
	const html = resolveHtml(input);
	if (!html) return "";

	const withBreaks = html
		.replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
		.replace(/<br\s*\/?>/gi, "\n")
		.replace(/<\/(p|div|li|h[1-6]|blockquote|tr)>/gi, "\n")
		.replace(/<[^>]+>/g, "");

	return decodeEntities(withBreaks)
		.replace(/[ \t]+/g, " ")
		.replace(/\n{3,}/g, "\n\n")
		.replace(/[ \t]*\n[ \t]*/g, "\n")
		.trim();
}

/**
 * Best-effort HTML → Markdown conversion for Blogger post content. Handles
 * the common tags Blogger emits: headings, paragraphs, bold/italic, links,
 * images, lists, blockquotes and inline/block code.
 */
export function htmlToMarkdown(
	input: Post | string | null | undefined,
): string {
	let html = resolveHtml(input);
	if (!html) return "";

	html = html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, "");

	// Block elements
	html = html.replace(
		/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi,
		(_, level, text) => {
			return `\n${"#".repeat(Number(level))} ${stripInline(text)}\n\n`;
		},
	);
	html = html.replace(
		/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi,
		(_, text) => {
			const lines = stripInline(text).trim().split("\n");
			return `\n${lines.map((l) => `> ${l}`).join("\n")}\n\n`;
		},
	);
	html = html.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_, text) => {
		return `\n\`\`\`\n${decodeEntities(text.replace(/<[^>]+>/g, ""))}\n\`\`\`\n\n`;
	});
	html = html.replace(
		/<li[^>]*>([\s\S]*?)<\/li>/gi,
		(_, text) => `- ${stripInline(text)}\n`,
	);
	html = html.replace(/<\/(ul|ol)>/gi, "\n");
	html = html.replace(/<(ul|ol)[^>]*>/gi, "\n");
	html = html.replace(
		/<p[^>]*>([\s\S]*?)<\/p>/gi,
		(_, text) => `${stripInline(text)}\n\n`,
	);
	html = html.replace(/<br\s*\/?>/gi, "  \n");
	html = html.replace(/<div[^>]*>/gi, "").replace(/<\/div>/gi, "\n");

	return decodeEntities(stripInline(html))
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

function stripInline(text: string): string {
	return text
		.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, "**$2**")
		.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, "*$2*")
		.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`")
		.replace(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)")
		.replace(
			/<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi,
			"![$2]($1)",
		)
		.replace(/<img[^>]+src=["']([^"']+)["'][^>]*\/?>/gi, "![]($1)")
		.replace(/<[^>]+>/g, "");
}

/** Extracts every unique `<img>` source URL from a post's HTML content.
 * Optionally includes `post.thumbnail`.
 */
export function extractImages(
	input: Post | string | null | undefined,
	includeThumbnail = true,
): string[] {
	const html = resolveHtml(input);
	const found = new Set<string>();

	const regex = /<img\s+[^>]*?src=["']([^"']+)["'][^>]*>/gi;

	for (const match of html.matchAll(regex)) {
		if (match[1]) {
			found.add(match[1]);
		}
	}

	if (
		includeThumbnail &&
		input &&
		typeof input === "object" &&
		input.thumbnail
	) {
		found.add(input.thumbnail);
	}

	return [...found];
}

/** A link extracted from post HTML content. */
export interface ExtractedLink {
	url: string;
	text: string;
}

/** Extracts every `<a href>` from a post's HTML content, in document order. */
export function extractLinks(
	input: Post | string | null | undefined,
): ExtractedLink[] {
	const html = resolveHtml(input);
	const links: ExtractedLink[] = [];
	const regex = /<a\s+[^>]*?href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
	for (const match of html.matchAll(regex)) {
		const url = match[1];
		if (!url) continue;
		links.push({ url, text: htmlToText(match[2] ?? "") });
	}
	return links;
}

/** A YouTube video referenced/embedded in a post. */
export interface ExtractedYouTube {
	id: string;
	url: string;
}

const YOUTUBE_PATTERNS = [
	/youtube(?:-nocookie)?\.com\/embed\/([\w-]{6,})/i,
	/youtube\.com\/watch\?v=([\w-]{6,})/i,
	/youtu\.be\/([\w-]{6,})/i,
];

/** Extracts every unique YouTube video referenced (as an `<iframe>` or link) in a post. */
export function extractYouTube(
	input: Post | string | null | undefined,
): ExtractedYouTube[] {
	const html = resolveHtml(input);
	const seen = new Set<string>();
	const results: ExtractedYouTube[] = [];

	const srcRegex = /(?:src|href)=["']([^"']+)["']/gi;
	for (const match of html.matchAll(srcRegex)) {
		const url = match[1];
		if (!url) continue;
		for (const pattern of YOUTUBE_PATTERNS) {
			const idMatch = pattern.exec(url);
			if (idMatch?.[1] && !seen.has(idMatch[1])) {
				seen.add(idMatch[1]);
				results.push({
					id: idMatch[1],
					url: `https://www.youtube.com/watch?v=${idMatch[1]}`,
				});
			}
		}
	}

	return results;
}

/** A generic (non-YouTube) `<iframe>` embed found in a post. */
export interface ExtractedEmbed {
	src: string;
	provider: string;
}

function guessProvider(src: string): string {
	try {
		const labels = new URL(src).hostname.replace(/^www\./, "").split(".");
		// Prefer the registrable-domain label (second-to-last), e.g.
		// "open.spotify.com" -> "spotify", "docs.google.com" -> "google".
		return labels.length >= 2
			? labels[labels.length - 2]!
			: (labels[0] ?? "unknown");
	} catch {
		return "unknown";
	}
}

const YOUTUBE_HOST_REGEX = /youtube(?:-nocookie)?\.com|youtu\.be/i;

/** Extracts every non-YouTube `<iframe>` embed (Spotify, Vimeo, Google Maps, forms, etc.) from a post. */
export function extractEmbeds(
	input: Post | string | null | undefined,
): ExtractedEmbed[] {
	const html = resolveHtml(input);
	const seen = new Set<string>();
	const results: ExtractedEmbed[] = [];
	const regex = /<iframe\s+[^>]*?src=["']([^"']+)["'][^>]*>/gi;

	for (const match of html.matchAll(regex)) {
		const src = match[1];
		if (!src || seen.has(src) || YOUTUBE_HOST_REGEX.test(src)) continue;
		seen.add(src);
		results.push({ src, provider: guessProvider(src) });
	}

	return results;
}

/** Best available thumbnail for a post: Blogger's own pick, else the first extracted image. */
export function thumbnail(
	input: Post | string | null | undefined,
): string | null {
	if (input && typeof input !== "string") {
		if (input.thumbnail) return input.thumbnail;
		if (input.thumbnailAlt) return input.thumbnailAlt;
	}
	return extractImages(input)[0] ?? null;
}
