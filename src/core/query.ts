import type { BaseListOptions } from "../types/options";
import type { QueryOptions } from "./http";

import { DEFAULT_LIMIT } from "./constants";
import { pageToStartIndex } from "./utils";

/** Translates friendly list options (`page`, `limit`, ...) into raw query params. */
export function toQueryOptions(
	options: BaseListOptions & { query?: string } = {},
): QueryOptions {
	const limit = options.limit ?? DEFAULT_LIMIT;

	let startIndex = options.startIndex;
	if (startIndex === undefined && options.page !== undefined) {
		startIndex = pageToStartIndex(options.page, limit);
	}

	return {
		limit,
		startIndex,
		orderBy: options.orderBy,
		publishedMin: options.publishedMin,
		publishedMax: options.publishedMax,
		updatedMin: options.updatedMin,
		updatedMax: options.updatedMax,
		query: options.query,
	};
}
