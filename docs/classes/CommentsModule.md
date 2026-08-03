[**blogr**](../README.md)

***

[blogr](../globals.md) / CommentsModule

# Class: CommentsModule

Defined in: [src/modules/comments.ts:14](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/comments.ts#L14)

Methods for listing and fetching comments.

## Constructors

### Constructor

> **new CommentsModule**(`client`): `CommentsModule`

Defined in: [src/modules/comments.ts:15](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/comments.ts#L15)

#### Parameters

##### client

[`Client`](Client.md)

#### Returns

`CommentsModule`

## Methods

### get()

> **get**(`commentId`, `postId?`, `options?`, `requestOptions?`): `Promise`\<[`Comment`](../interfaces/Comment.md) \| `null`\>

Defined in: [src/modules/comments.ts:48](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/comments.ts#L48)

Fetches a single comment by id.

Passing `postId` performs one direct request. Without it, this scans
the blog-level comments feed (in pages of `scanPageSize`, up to
`maxScan` comments) since Blogger's feed API has no id-only comment
lookup — prefer passing `postId` when you have it.

#### Parameters

##### commentId

`string`

##### postId?

`string`

##### options?

###### maxScan?

`number`

###### scanPageSize?

`number`

##### requestOptions?

[`RequestOptionsInterface`](../interfaces/RequestOptionsInterface.md) = `{}`

#### Returns

`Promise`\<[`Comment`](../interfaces/Comment.md) \| `null`\>

***

### list()

> **list**(`options?`, `requestOptions?`): `Promise`\<[`Pager`](../interfaces/Pager.md)\<[`Comment`](../interfaces/Comment.md)\>\>

Defined in: [src/modules/comments.ts:18](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/comments.ts#L18)

Lists comments for the whole blog, or for a single post when `options.postId` is set.

#### Parameters

##### options?

[`CommentsListOptions`](../interfaces/CommentsListOptions.md) = `{}`

##### requestOptions?

[`RequestOptionsInterface`](../interfaces/RequestOptionsInterface.md) = `{}`

#### Returns

`Promise`\<[`Pager`](../interfaces/Pager.md)\<[`Comment`](../interfaces/Comment.md)\>\>
