[**blogr**](../README.md)

***

[blogr](../globals.md) / PagesModule

# Class: PagesModule

Defined in: src/modules/pages.ts:10

Methods for listing and fetching static blog pages.

## Constructors

### Constructor

> **new PagesModule**(`client`): `PagesModule`

Defined in: src/modules/pages.ts:11

#### Parameters

##### client

[`Client`](Client.md)

#### Returns

`PagesModule`

## Methods

### get()

> **get**(`pageId`, `options?`, `requestOptions?`): `Promise`\<[`Post`](../interfaces/Post.md) \| `null`\>

Defined in: src/modules/pages.ts:29

Fetches a single page by id, or `null` if it doesn't exist.

#### Parameters

##### pageId

`string`

##### options?

###### summary?

`boolean`

##### requestOptions?

`RequestOptions` = `{}`

#### Returns

`Promise`\<[`Post`](../interfaces/Post.md) \| `null`\>

***

### list()

> **list**(`options?`, `requestOptions?`): `Promise`\<[`Pager`](../interfaces/Pager.md)\<[`Post`](../interfaces/Post.md)\>\>

Defined in: src/modules/pages.ts:14

Lists the blog's static pages.

#### Parameters

##### options?

[`BaseListOptions`](../interfaces/BaseListOptions.md) = `{}`

##### requestOptions?

`RequestOptions` = `{}`

#### Returns

`Promise`\<[`Pager`](../interfaces/Pager.md)\<[`Post`](../interfaces/Post.md)\>\>
