[**blogr**](../README.md)

***

[blogr](../globals.md) / UrlModule

# Class: UrlModule

Defined in: [src/modules/url.ts:12](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/url.ts#L12)

Builds raw Blogger feed URLs without performing any request.

## Constructors

### Constructor

> **new UrlModule**(`client`): `UrlModule`

Defined in: [src/modules/url.ts:13](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/url.ts#L13)

#### Parameters

##### client

[`Client`](Client.md)

#### Returns

`UrlModule`

## Methods

### comments()

> **comments**(`postId?`, `options?`): `string`

Defined in: [src/modules/url.ts:50](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/url.ts#L50)

URL for the comments feed (blog-wide, or scoped to `postId`).

#### Parameters

##### postId?

`string`

##### options?

[`UrlOptions`](../interfaces/UrlOptions.md) = `{}`

#### Returns

`string`

***

### page()

> **page**(`pageId`, `options?`): `string`

Defined in: [src/modules/url.ts:40](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/url.ts#L40)

URL for a single page entry.

#### Parameters

##### pageId

`string`

##### options?

[`UrlOptions`](../interfaces/UrlOptions.md) = `{}`

#### Returns

`string`

***

### pages()

> **pages**(`options?`): `string`

Defined in: [src/modules/url.ts:33](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/url.ts#L33)

URL for the pages feed.

#### Parameters

##### options?

[`UrlOptions`](../interfaces/UrlOptions.md) = `{}`

#### Returns

`string`

***

### post()

> **post**(`postId`, `options?`): `string`

Defined in: [src/modules/url.ts:23](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/url.ts#L23)

URL for a single post entry.

#### Parameters

##### postId

`string`

##### options?

[`UrlOptions`](../interfaces/UrlOptions.md) = `{}`

#### Returns

`string`

***

### posts()

> **posts**(`options?`): `string`

Defined in: [src/modules/url.ts:16](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/url.ts#L16)

URL for the posts feed.

#### Parameters

##### options?

[`UrlOptions`](../interfaces/UrlOptions.md) = `{}`

#### Returns

`string`
