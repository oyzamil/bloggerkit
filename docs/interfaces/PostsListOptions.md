[**blogr**](../README.md)

***

[blogr](../globals.md) / PostsListOptions

# Interface: PostsListOptions

Defined in: [src/types/options.ts:36](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/options.ts#L36)

Options for [PostsModule.list](../classes/PostsModule.md#list).

## Extends

- [`BaseListOptions`](BaseListOptions.md)

## Properties

### label?

> `optional` **label?**: `string` \| `string`[]

Defined in: [src/types/options.ts:46](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/options.ts#L46)

Filter by one or more labels.

- `string` — a single label.
- `string[]` — multiple labels, combined with AND semantics
  (an entry must carry every label).

***

### limit?

> `optional` **limit?**: `number`

Defined in: [src/types/options.ts:18](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/options.ts#L18)

Alias for Blogger's `max-results`.

#### Default

```ts
25
```

#### Inherited from

[`BaseListOptions`](BaseListOptions.md).[`limit`](BaseListOptions.md#limit)

***

### orderBy?

> `optional` **orderBy?**: `"updated"` \| `"published"`

Defined in: [src/types/options.ts:22](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/options.ts#L22)

Sort field.

#### Inherited from

[`BaseListOptions`](BaseListOptions.md).[`orderBy`](BaseListOptions.md#orderby)

***

### page?

> `optional` **page?**: `number`

Defined in: [src/types/options.ts:16](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/options.ts#L16)

Page number (1-based). Converted internally to `startIndex` using
`limit`. Ignored if `startIndex` is also provided.

#### Inherited from

[`BaseListOptions`](BaseListOptions.md).[`page`](BaseListOptions.md#page)

***

### publishedMax?

> `optional` **publishedMax?**: `string` \| `Date`

Defined in: [src/types/options.ts:26](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/options.ts#L26)

Only include entries published on/before this date.

#### Inherited from

[`BaseListOptions`](BaseListOptions.md).[`publishedMax`](BaseListOptions.md#publishedmax)

***

### publishedMin?

> `optional` **publishedMin?**: `string` \| `Date`

Defined in: [src/types/options.ts:24](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/options.ts#L24)

Only include entries published on/after this date.

#### Inherited from

[`BaseListOptions`](BaseListOptions.md).[`publishedMin`](BaseListOptions.md#publishedmin)

***

### query?

> `optional` **query?**: `string`

Defined in: [src/types/options.ts:38](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/options.ts#L38)

Full-text search query (maps to Blogger's `q` param).

***

### startIndex?

> `optional` **startIndex?**: `number`

Defined in: [src/types/options.ts:20](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/options.ts#L20)

Raw 1-based start index, takes precedence over `page`.

#### Inherited from

[`BaseListOptions`](BaseListOptions.md).[`startIndex`](BaseListOptions.md#startindex)

***

### summary?

> `optional` **summary?**: `boolean`

Defined in: [src/types/options.ts:32](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/options.ts#L32)

When `true`, requests the lightweight "summary" projection.

#### Inherited from

[`BaseListOptions`](BaseListOptions.md).[`summary`](BaseListOptions.md#summary)

***

### updatedMax?

> `optional` **updatedMax?**: `string` \| `Date`

Defined in: [src/types/options.ts:30](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/options.ts#L30)

Only include entries updated on/before this date.

#### Inherited from

[`BaseListOptions`](BaseListOptions.md).[`updatedMax`](BaseListOptions.md#updatedmax)

***

### updatedMin?

> `optional` **updatedMin?**: `string` \| `Date`

Defined in: [src/types/options.ts:28](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/options.ts#L28)

Only include entries updated on/after this date.

#### Inherited from

[`BaseListOptions`](BaseListOptions.md).[`updatedMin`](BaseListOptions.md#updatedmin)
