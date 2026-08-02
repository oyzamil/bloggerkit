/**
 * Parses and rewrites the `=s0`/`/s72-c/`-style size & transform parameters
 * Google attaches to `googleusercontent.com` / `*.blogspot.com` hosted
 * images, letting you request resized, cropped, reformatted, rotated, etc.
 * variants through a fluent builder.
 *
 * Host detection and parameter-segment matching mirror the approach used by
 * https://github.com/bloggerkit/bloggerkit/tree/main/packages/blogger-images.
 */

const HOSTS_REGEX =
	/^(https?:)?(\/\/)[^/]*.(googleusercontent\.com|blogspot\.com)/;
const PARAMS_REGEX = /[^/]+(?=\/[^/]+\.[^/?]+(?:\?|$))|(?<==)[^=&?/]+(?=\?|$)/;

/** Recognized boolean-flag param prefixes (`present` = on, `absent` = off). */
const BOOLEAN_PARAMS = new Set([
	"nu", // no-upscaling
	"c", // crop
	"cc", // circular crop
	"ci", // square ("center-in") crop
	"p", // alternate crop
	"fh", // flip horizontally
	"fv", // flip vertically
	"pd", // pad
	"rj", // force jpeg
	"rp", // force png
	"rw", // force webp
	"rwa", // force animated webp
	"rg", // force gif
	"rh", // force mp4
	"h", // html view
	"d", // force download
	"no", // no button
	"o", // button
	"k", // disable animation
]);
/** Recognized numeric param prefixes. */
const NUMBER_PARAMS = new Set(["w", "h", "s", "r", "ba", "br", "b", "e", "a"]);

type ParamKind = "bool" | "num" | "hex";

function getParamInfo(
	part: string,
): [ParamKind, string, string | number | boolean] | null {
	const hexMatch = /^(c|bc|pc)(0x[0-9A-Fa-f]{6,8})$/.exec(part);
	if (hexMatch?.[1] && hexMatch[2]) return ["hex", hexMatch[1], hexMatch[2]];

	const numMatch = /^([a-z]{1,3})(\d+)$/i.exec(part);
	if (numMatch?.[1] && NUMBER_PARAMS.has(numMatch[1])) {
		return ["num", numMatch[1], Number(numMatch[2])];
	}

	if (BOOLEAN_PARAMS.has(part)) return ["bool", part, true];

	return null;
}

export interface BloggerImageOptions {
	/** Keep existing size/transform params found in the URL. @default true */
	existing?: boolean;
	/**
	 * When `true`, `.url()` returns the original URL unchanged for
	 * unsupported hosts instead of throwing. @default false
	 */
	passThrough?: boolean;
}

/** A fluent builder for Blogger/Google-hosted image transform URLs. */
export class BloggerImage {
	private readonly originalUrl: string;
	private readonly match: [string, number] | null;
	private readonly params: Record<string, string | number | boolean> = {};
	private readonly passThrough: boolean;

	constructor(url: string | URL, options: BloggerImageOptions = {}) {
		this.originalUrl = url instanceof URL ? url.toString() : url;
		this.passThrough = options.passThrough === true;
		this.match = null;

		if (!HOSTS_REGEX.test(this.originalUrl)) return;

		const matches = PARAMS_REGEX.exec(this.originalUrl);
		if (!matches?.[0] || matches.index === undefined) return;

		this.match = [matches[0], matches.index];

		if (options.existing === false) return;

		for (const part of matches[0].split("-")) {
			if (!part) continue;
			const info = getParamInfo(part);
			if (!info) continue;
			this.params[`${info[0]}:${info[1]}`] = info[2];
		}
	}

	private check(): boolean {
		if (this.match) return true;
		if (!this.passThrough) {
			throw new Error("Image url is not supported for transformations");
		}
		return false;
	}

	private boolean(
		param: string,
		value: boolean | undefined,
		removeBeforeAdding?: string[],
	) {
		const ok = this.check();
		const key = `bool:${param}`;

		if (value === undefined) return ok ? Boolean(this.params[key]) : false;

		if (value === false) {
			if (ok) delete this.params[key];
		} else if (ok) {
			for (const other of removeBeforeAdding ?? [])
				delete this.params[`bool:${other}`];
			this.params[key] = true;
		}
		return this;
	}

	private number(param: string, value: number | null | undefined) {
		const ok = this.check();
		const key = `num:${param}`;

		if (value === undefined)
			return ok ? ((this.params[key] as number) ?? null) : null;
		if (value === null) {
			if (ok) delete this.params[key];
		} else if (ok) {
			this.params[key] = value;
		}
		return this;
	}

	private hex(param: string, value: string | null | undefined) {
		const ok = this.check();
		const key = `hex:${param}`;

		if (value === undefined)
			return ok ? ((this.params[key] as string) ?? null) : null;
		if (value === null) {
			if (ok) delete this.params[key];
			return this;
		}

		if (!/^0x[0-9A-Fa-f]{6,8}$/.test(value)) {
			throw new Error("color value must match '0xrrggbb' or '0xaarrggbb'");
		}
		if (ok) this.params[key] = value;
		return this;
	}

	private format(param: string, value?: boolean) {
		return this.boolean(param, value, ["rj", "rp", "rw", "rwa", "rg", "rh"]);
	}

	/** `true` if this URL is a recognized Blogger/Google image host. */
	isSupported(): boolean {
		return this.match !== null;
	}

	width(): number | null;
	width(value: number | null): this;
	width(value?: number | null): number | null | this {
		return this.number("w", value) as never;
	}

	height(): number | null;
	height(value: number | null): this;
	height(value?: number | null): number | null | this {
		return this.number("h", value) as never;
	}

	size(): number | null;
	size(value: number | null): this;
	size(value?: number | null): number | null | this {
		return this.number("s", value) as never;
	}

	noUpscaling(): boolean;
	noUpscaling(value: boolean): this;
	noUpscaling(value?: boolean): boolean | this {
		return this.boolean("nu", value) as never;
	}

	crop(): boolean;
	crop(value: boolean): this;
	crop(value?: boolean): boolean | this {
		return this.boolean("c", value, ["cc", "ci", "p"]) as never;
	}

	circularCrop(): boolean;
	circularCrop(value: boolean): this;
	circularCrop(value?: boolean): boolean | this {
		return this.boolean("cc", value, ["c", "ci", "p"]) as never;
	}

	squareCrop(): boolean;
	squareCrop(value: boolean): this;
	squareCrop(value?: boolean): boolean | this {
		return this.boolean("ci", value, ["c", "cc", "p"]) as never;
	}

	flipHorizontally(): boolean;
	flipHorizontally(value: boolean): this;
	flipHorizontally(value?: boolean): boolean | this {
		return this.boolean("fh", value) as never;
	}

	flipVertically(): boolean;
	flipVertically(value: boolean): this;
	flipVertically(value?: boolean): boolean | this {
		return this.boolean("fv", value) as never;
	}

	rotate(): 90 | 180 | 270 | null;
	rotate(value: 90 | 180 | 270 | null): this;
	rotate(value?: 90 | 180 | 270 | null): number | null | this {
		return this.number("r", value) as never;
	}

	borderRadius(): number | null;
	borderRadius(value: number | null): this;
	borderRadius(value?: number | null): number | null | this {
		return this.number("br", value) as never;
	}

	border(): number | null;
	border(value: number | null): this;
	border(value?: number | null): number | null | this {
		return this.number("b", value) as never;
	}

	color(): string | null;
	color(value: string | null): this;
	color(value?: string | null): string | null | this {
		return this.hex("c", value) as never;
	}

	backgroundColor(): string | null;
	backgroundColor(value: string | null): this;
	backgroundColor(value?: string | null): string | null | this {
		return this.hex("bc", value) as never;
	}

	pad(): boolean;
	pad(value: boolean): this;
	pad(value?: boolean): boolean | this {
		return this.boolean("pd", value, ["c", "cc", "ci", "p"]) as never;
	}

	padColor(): string | null;
	padColor(value: string | null): this;
	padColor(value?: string | null): string | null | this {
		return this.hex("pc", value) as never;
	}

	jpeg(): boolean;
	jpeg(value: boolean): this;
	jpeg(value?: boolean): boolean | this {
		return this.format("rj", value) as never;
	}

	png(): boolean;
	png(value: boolean): this;
	png(value?: boolean): boolean | this {
		return this.format("rp", value) as never;
	}

	webp(): boolean;
	webp(value: boolean): this;
	webp(value?: boolean): boolean | this {
		return this.format("rw", value) as never;
	}

	animatedWebp(): boolean;
	animatedWebp(value: boolean): this;
	animatedWebp(value?: boolean): boolean | this {
		return this.format("rwa", value) as never;
	}

	gif(): boolean;
	gif(value: boolean): this;
	gif(value?: boolean): boolean | this {
		return this.format("rg", value) as never;
	}

	mp4(): boolean;
	mp4(value: boolean): this;
	mp4(value?: boolean): boolean | this {
		return this.format("rh", value) as never;
	}

	download(): boolean;
	download(value: boolean): this;
	download(value?: boolean): boolean | this {
		return this.boolean("d", value) as never;
	}

	cacheDays(): number | null;
	cacheDays(value: number | null): this;
	cacheDays(value?: number | null): number | null | this {
		return this.number("e", value) as never;
	}

	/** Builds the transformed image URL. */
	url(): string {
		this.check();
		if (!this.match) return this.originalUrl;

		const [oldSegment, offset] = this.match;
		const parts: string[] = [];

		for (const key in this.params) {
			const [kind, prefix] = key.split(":") as [ParamKind, string];
			const value = this.params[key];
			if (kind === "bool") {
				if (value) parts.push(prefix);
			} else {
				parts.push(`${prefix}${value}`);
			}
		}

		const suffix = parts.length > 0 ? parts.join("-") : "s0";
		return `${this.originalUrl.slice(0, offset)}${suffix}${this.originalUrl.slice(
			offset + oldSegment.length,
		)}`;
	}
}
