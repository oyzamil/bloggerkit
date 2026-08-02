[**blogr**](../README.md)

***

[blogr](../globals.md) / BaseListOptions

# Interface: BaseListOptions

Defined in: src/types/options.ts:8

Fields shared between posts/pages/comments listing options.

## Extended by

- [`PostsListOptions`](PostsListOptions.md)
- [`CommentsListOptions`](CommentsListOptions.md)
- [`SearchOptions`](SearchOptions.md)
- [`FeedOptions`](FeedOptions.md)

## Properties

### limit?

> `optional` **limit?**: `number`

Defined in: src/types/options.ts:15

Alias for Blogger's `max-results`.

#### Default

```ts
25
```

***

### orderBy?

> `optional` **orderBy?**: `"updated"` \| `"published"`

Defined in: src/types/options.ts:19

Sort field.

***

### page?

> `optional` **page?**: `number`

Defined in: src/types/options.ts:13

Page number (1-based). Converted internally to `startIndex` using
`limit`. Ignored if `startIndex` is also provided.

***

### publishedMax?

> `optional` **publishedMax?**: `string` \| `Date`

Defined in: src/types/options.ts:23

Only include entries published on/before this date.

***

### publishedMin?

> `optional` **publishedMin?**: `string` \| `Date`

Defined in: src/types/options.ts:21

Only include entries published on/after this date.

***

### startIndex?

> `optional` **startIndex?**: `number`

Defined in: src/types/options.ts:17

Raw 1-based start index, takes precedence over `page`.

***

### summary?

> `optional` **summary?**: `boolean`

Defined in: src/types/options.ts:29

When `true`, requests the lightweight "summary" projection.

***

### updatedMax?

> `optional` **updatedMax?**: `string` \| `Date`

Defined in: src/types/options.ts:27

Only include entries updated on/before this date.

***

### updatedMin?

> `optional` **updatedMin?**: `string` \| `Date`

Defined in: src/types/options.ts:25

Only include entries updated on/after this date.
