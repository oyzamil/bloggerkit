[**blogr**](../README.md)

***

[blogr](../globals.md) / BlogInfo

# Interface: BlogInfo

Defined in: [src/types/feed.ts:44](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L44)

Blog-level metadata.

## Properties

### author

> **author**: [`Author`](Author.md)

Defined in: [src/types/feed.ts:60](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L60)

Blog author/owner.

***

### favicon

> **favicon**: `string` \| `null`

Defined in: [src/types/feed.ts:62](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L62)

Favicon URL, best-effort (derived), or `null`.

***

### id

> **id**: `string`

Defined in: [src/types/feed.ts:46](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L46)

Numeric Blogger blog id.

***

### labels

> **labels**: `string`[]

Defined in: [src/types/feed.ts:54](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L54)

All labels currently known to the feed response.

***

### language

> **language**: `string` \| `null`

Defined in: [src/types/feed.ts:56](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L56)

Language code of the blog, if available.

***

### links

> **links**: [`Link`](Link.md)[]

Defined in: [src/types/feed.ts:64](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L64)

Raw `<link>` entries from the feed.

***

### subtitle

> **subtitle**: `string` \| `null`

Defined in: [src/types/feed.ts:50](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L50)

Blog subtitle/description, or `null`.

***

### title

> **title**: `string`

Defined in: [src/types/feed.ts:48](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L48)

Blog title.

***

### updated

> **updated**: `string`

Defined in: [src/types/feed.ts:58](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L58)

ISO timestamp of the last update to the blog.

***

### url

> **url**: `string`

Defined in: [src/types/feed.ts:52](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L52)

Canonical URL of the blog.
