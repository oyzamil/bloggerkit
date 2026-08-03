/** Global namespace used to stash pending JSONP callbacks in the browser. */
export const JSONP_NAMESPACE = "__blogr_jsonp__";
export const FALLBACK_IMAGE = "";

/** Default number of items requested per page. */
export const DEFAULT_LIMIT = 25;

/** Maps our friendly option names to Blogger's actual query param names. */
export const PARAM_MAP = {
	limit: "max-results",
	startIndex: "start-index",
	orderBy: "orderby",
	publishedMin: "published-min",
	publishedMax: "published-max",
	updatedMin: "updated-min",
	updatedMax: "updated-max",
	query: "q",
} as const;

export type ParamKey = keyof typeof PARAM_MAP;
