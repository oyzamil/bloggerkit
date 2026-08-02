/** Base error type for all errors thrown by blogr. */
export class BloggerError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
		this.name = "BloggerError";
	}
}

/** Thrown when a network/HTTP request fails or returns a non-2xx status. */
export class BloggerRequestError extends BloggerError {
	readonly url: string;
	readonly status: number | null;

	constructor(
		message: string,
		url: string | URL,
		status: number | null = null,
		options?: ErrorOptions,
	) {
		super(message, options);
		this.name = "BloggerRequestError";
		this.url = String(url);
		this.status = status;
	}
}

/** Thrown when constructor/method arguments are invalid. */
export class BloggerValidationError extends BloggerError {
	constructor(message: string) {
		super(message);
		this.name = "BloggerValidationError";
	}
}
