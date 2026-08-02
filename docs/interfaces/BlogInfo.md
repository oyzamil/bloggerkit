[**blogr**](../README.md)

***

[blogr](../globals.md) / BlogInfo

# Interface: BlogInfo

Defined in: src/types/feed.ts:44

Blog-level metadata.

## Properties

### author

> **author**: [`Author`](Author.md)

Defined in: src/types/feed.ts:60

Blog author/owner.

***

### favicon

> **favicon**: `string` \| `null`

Defined in: src/types/feed.ts:62

Favicon URL, best-effort (derived), or `null`.

***

### id

> **id**: `string`

Defined in: src/types/feed.ts:46

Numeric Blogger blog id.

***

### labels

> **labels**: `string`[]

Defined in: src/types/feed.ts:54

All labels currently known to the feed response.

***

### language

> **language**: `string` \| `null`

Defined in: src/types/feed.ts:56

Language code of the blog, if available.

***

### links

> **links**: [`Link`](Link.md)[]

Defined in: src/types/feed.ts:64

Raw `<link>` entries from the feed.

***

### subtitle

> **subtitle**: `string` \| `null`

Defined in: src/types/feed.ts:50

Blog subtitle/description, or `null`.

***

### title

> **title**: `string`

Defined in: src/types/feed.ts:48

Blog title.

***

### updated

> **updated**: `string`

Defined in: src/types/feed.ts:58

ISO timestamp of the last update to the blog.

***

### url

> **url**: `string`

Defined in: src/types/feed.ts:52

Canonical URL of the blog.
