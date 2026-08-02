[**blogr**](../README.md)

***

[blogr](../globals.md) / SearchOptions

# Interface: SearchOptions

Defined in: src/types/options.ts:74

Options for [SearchModule](../classes/SearchModule.md).

## Extends

- [`BaseListOptions`](BaseListOptions.md)

## Properties

### label?

> `optional` **label?**: `string` \| `string`[]

Defined in: src/types/options.ts:76

***

### limit?

> `optional` **limit?**: `number`

Defined in: src/types/options.ts:15

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

Defined in: src/types/options.ts:19

Sort field.

#### Inherited from

[`BaseListOptions`](BaseListOptions.md).[`orderBy`](BaseListOptions.md#orderby)

***

### page?

> `optional` **page?**: `number`

Defined in: src/types/options.ts:13

Page number (1-based). Converted internally to `startIndex` using
`limit`. Ignored if `startIndex` is also provided.

#### Inherited from

[`BaseListOptions`](BaseListOptions.md).[`page`](BaseListOptions.md#page)

***

### publishedMax?

> `optional` **publishedMax?**: `string` \| `Date`

Defined in: src/types/options.ts:23

Only include entries published on/before this date.

#### Inherited from

[`BaseListOptions`](BaseListOptions.md).[`publishedMax`](BaseListOptions.md#publishedmax)

***

### publishedMin?

> `optional` **publishedMin?**: `string` \| `Date`

Defined in: src/types/options.ts:21

Only include entries published on/after this date.

#### Inherited from

[`BaseListOptions`](BaseListOptions.md).[`publishedMin`](BaseListOptions.md#publishedmin)

***

### query

> **query**: `string`

Defined in: src/types/options.ts:75

***

### startIndex?

> `optional` **startIndex?**: `number`

Defined in: src/types/options.ts:17

Raw 1-based start index, takes precedence over `page`.

#### Inherited from

[`BaseListOptions`](BaseListOptions.md).[`startIndex`](BaseListOptions.md#startindex)

***

### summary?

> `optional` **summary?**: `boolean`

Defined in: src/types/options.ts:29

When `true`, requests the lightweight "summary" projection.

#### Inherited from

[`BaseListOptions`](BaseListOptions.md).[`summary`](BaseListOptions.md#summary)

***

### updatedMax?

> `optional` **updatedMax?**: `string` \| `Date`

Defined in: src/types/options.ts:27

Only include entries updated on/before this date.

#### Inherited from

[`BaseListOptions`](BaseListOptions.md).[`updatedMax`](BaseListOptions.md#updatedmax)

***

### updatedMin?

> `optional` **updatedMin?**: `string` \| `Date`

Defined in: src/types/options.ts:25

Only include entries updated on/after this date.

#### Inherited from

[`BaseListOptions`](BaseListOptions.md).[`updatedMin`](BaseListOptions.md#updatedmin)
