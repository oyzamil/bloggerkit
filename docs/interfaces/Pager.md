[**blogr**](../README.md)

***

[blogr](../globals.md) / Pager

# Interface: Pager\<T\>

Defined in: src/types/options.ts:80

Result of any listing call — a page of items plus pagination helpers.

## Type Parameters

### T

`T`

## Properties

### hasNext

> `readonly` **hasNext**: `boolean`

Defined in: src/types/options.ts:92

Whether a [Pager.next](#next) page is available.

***

### hasPrevious

> `readonly` **hasPrevious**: `boolean`

Defined in: src/types/options.ts:94

Whether a [Pager.previous](#previous) page is available.

***

### items

> `readonly` **items**: `T`[]

Defined in: src/types/options.ts:82

Items on the current page.

***

### itemsPerPage

> `readonly` **itemsPerPage**: `number` \| `null`

Defined in: src/types/options.ts:84

Items requested per page (mirrors `limit`), or `null`.

***

### selfUrl

> `readonly` **selfUrl**: `string` \| `null`

Defined in: src/types/options.ts:90

URL of the current page's feed request.

***

### startIndex

> `readonly` **startIndex**: `number` \| `null`

Defined in: src/types/options.ts:86

1-based index of the first item on this page, or `null`.

***

### totalResults

> `readonly` **totalResults**: `number` \| `null`

Defined in: src/types/options.ts:88

Total number of items available across all pages, or `null`.

## Methods

### next()

> **next**(`options?`): `Promise`\<`Pager`\<`T`\> \| `null`\>

Defined in: src/types/options.ts:96

Fetches the next page, or `null` if there isn't one.

#### Parameters

##### options?

`RequestOptions`

#### Returns

`Promise`\<`Pager`\<`T`\> \| `null`\>

***

### previous()

> **previous**(`options?`): `Promise`\<`Pager`\<`T`\> \| `null`\>

Defined in: src/types/options.ts:98

Fetches the previous page, or `null` if there isn't one.

#### Parameters

##### options?

`RequestOptions`

#### Returns

`Promise`\<`Pager`\<`T`\> \| `null`\>
