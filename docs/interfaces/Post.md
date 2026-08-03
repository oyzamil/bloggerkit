[**blogr**](../README.md)

***

[blogr](../globals.md) / Post

# Interface: Post

Defined in: [src/types/feed.ts:68](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L68)

A Blogger post or page entry.

## Properties

### author

> **author**: [`Author`](Author.md)

Defined in: [src/types/feed.ts:82](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L82)

Entry author.

***

### comments

> **comments**: [`PostCommentInfo`](PostCommentInfo.md)

Defined in: [src/types/feed.ts:92](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L92)

Comment count/metadata for this entry.

***

### content

> **content**: `string` \| `null`

Defined in: [src/types/feed.ts:84](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L84)

Full HTML content, or `null` when only a summary was requested.

***

### geo

> **geo**: [`Geo`](Geo.md)

Defined in: [src/types/feed.ts:94](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L94)

Geo-location, if attached.

***

### id

> **id**: `string`

Defined in: [src/types/feed.ts:70](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L70)

Entry id (numeric string).

***

### labels

> **labels**: `string`[]

Defined in: [src/types/feed.ts:80](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L80)

Labels attached to the entry.

***

### links

> **links**: [`Link`](Link.md)[]

Defined in: [src/types/feed.ts:96](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L96)

Raw `<link>` entries from the feed.

***

### published

> **published**: `string`

Defined in: [src/types/feed.ts:76](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L76)

ISO published timestamp.

***

### summary

> **summary**: `string` \| `null`

Defined in: [src/types/feed.ts:86](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L86)

Plain-text/HTML summary/snippet, or `null`.

***

### thumbnail

> **thumbnail**: `string` \| `null`

Defined in: [src/types/feed.ts:88](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L88)

Best-guess thumbnail extracted from content, or `null`.

***

### thumbnailAlt

> **thumbnailAlt**: `string` \| `null`

Defined in: [src/types/feed.ts:90](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L90)

Thumbnail explicitly selected by Blogger, or `null`.

***

### title

> **title**: `string`

Defined in: [src/types/feed.ts:72](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L72)

Title of the entry.

***

### updated

> **updated**: `string`

Defined in: [src/types/feed.ts:78](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L78)

ISO last-updated timestamp.

***

### url

> **url**: `string`

Defined in: [src/types/feed.ts:74](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L74)

Canonical URL of the entry.
