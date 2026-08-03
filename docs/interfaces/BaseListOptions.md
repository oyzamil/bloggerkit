[**blogr**](../README.md)

***

[blogr](../globals.md) / BaseListOptions

# Interface: BaseListOptions

Defined in: [src/types/options.ts:11](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/options.ts#L11)

Fields shared between posts/pages/comments listing options.

## Extended by

- [`PostsListOptions`](PostsListOptions.md)
- [`CommentsListOptions`](CommentsListOptions.md)
- [`SearchOptions`](SearchOptions.md)
- [`FeedOptions`](FeedOptions.md)

## Properties

### limit?

> `optional` **limit?**: `number`

Defined in: [src/types/options.ts:18](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/options.ts#L18)

Alias for Blogger's `max-results`.

#### Default

```ts
25
```

***

### orderBy?

> `optional` **orderBy?**: `"updated"` \| `"published"`

Defined in: [src/types/options.ts:22](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/options.ts#L22)

Sort field.

***

### page?

> `optional` **page?**: `number`

Defined in: [src/types/options.ts:16](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/options.ts#L16)

Page number (1-based). Converted internally to `startIndex` using
`limit`. Ignored if `startIndex` is also provided.

***

### publishedMax?

> `optional` **publishedMax?**: `string` \| `Date`

Defined in: [src/types/options.ts:26](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/options.ts#L26)

Only include entries published on/before this date.

***

### publishedMin?

> `optional` **publishedMin?**: `string` \| `Date`

Defined in: [src/types/options.ts:24](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/options.ts#L24)

Only include entries published on/after this date.

***

### startIndex?

> `optional` **startIndex?**: `number`

Defined in: [src/types/options.ts:20](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/options.ts#L20)

Raw 1-based start index, takes precedence over `page`.

***

### summary?

> `optional` **summary?**: `boolean`

Defined in: [src/types/options.ts:32](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/options.ts#L32)

When `true`, requests the lightweight "summary" projection.

***

### updatedMax?

> `optional` **updatedMax?**: `string` \| `Date`

Defined in: [src/types/options.ts:30](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/options.ts#L30)

Only include entries updated on/before this date.

***

### updatedMin?

> `optional` **updatedMin?**: `string` \| `Date`

Defined in: [src/types/options.ts:28](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/options.ts#L28)

Only include entries updated on/after this date.
