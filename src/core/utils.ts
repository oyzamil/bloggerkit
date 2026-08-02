import { BloggerValidationError } from "./errors";

export function isString(input: unknown): input is string {
	return typeof input === "string";
}

export function isArray(input: unknown): input is unknown[] {
	return Array.isArray(input);
}

export function isObject(input: unknown): input is Record<string, unknown> {
	return typeof input === "object" && input !== null && !isArray(input);
}

export function isUndefined(input: unknown): input is undefined {
	return typeof input === "undefined";
}

export function assertNonBlankString(
	input: unknown,
	name: string,
): asserts input is string {
	if (!isString(input) || input.trim().length === 0) {
		throw new BloggerValidationError(`${name} must be a non-empty string`);
	}
}

export function getNested(obj: unknown, ...path: string[]): unknown {
	let current = obj;
	for (const key of path) {
		if (!isObject(current) && !isArray(current)) return undefined;
		current = (current as Record<string, unknown>)[key];
	}
	return current;
}

export function trailingSlash(url: string): string {
	return url.endsWith("/") ? url : `${url}/`;
}

/** Turns a `Date | string` value into an ISO 8601 string. */
export function toISOString(value: Date | string): string {
	return value instanceof Date ? value.toISOString() : value;
}

let lastTime = 0;
let counter = 0;

/** Generates a short, monotonically-unique id (used for JSONP callback names). */
export function generateId(): string {
	const now = Date.now();
	if (now === lastTime) {
		counter += 1;
	} else {
		lastTime = now;
		counter = 0;
	}
	return `${now}_${counter}`;
}

/** Builds `start-index` from a 1-based `page` + `limit`, Blogger-style (1-based). */
export function pageToStartIndex(page: number, limit: number): number {
	return (Math.max(1, page) - 1) * limit + 1;
}
