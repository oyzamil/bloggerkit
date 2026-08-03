[**blogr**](../README.md)

***

[blogr](../globals.md) / FeedModule

# Class: FeedModule

Defined in: [src/modules/feed.ts:18](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/feed.ts#L18)

Fetches the blog's feed in any of Blogger's supported wire formats.

## Constructors

### Constructor

> **new FeedModule**(`client`): `FeedModule`

Defined in: [src/modules/feed.ts:19](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/feed.ts#L19)

#### Parameters

##### client

[`Client`](Client.md)

#### Returns

`FeedModule`

## Methods

### atom()

> **atom**(`options?`, `requestOptions?`): `Promise`\<`string`\>

Defined in: [src/modules/feed.ts:34](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/feed.ts#L34)

Fetches the feed as raw Atom XML text.

#### Parameters

##### options?

[`FeedOptions`](../interfaces/FeedOptions.md) = `{}`

##### requestOptions?

[`RequestOptionsInterface`](../interfaces/RequestOptionsInterface.md) = `{}`

#### Returns

`Promise`\<`string`\>

***

### json()

> **json**(`options?`, `requestOptions?`): `Promise`\<[`ParsedFeed`](../interfaces/ParsedFeed.md)\>

Defined in: [src/modules/feed.ts:22](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/feed.ts#L22)

Fetches and parses the feed as JSON (default transport).

#### Parameters

##### options?

[`FeedOptions`](../interfaces/FeedOptions.md) = `{}`

##### requestOptions?

[`RequestOptionsInterface`](../interfaces/RequestOptionsInterface.md) = `{}`

#### Returns

`Promise`\<[`ParsedFeed`](../interfaces/ParsedFeed.md)\>

***

### jsonp()

> **jsonp**(`options?`, `requestOptions?`): `Promise`\<[`ParsedFeed`](../interfaces/ParsedFeed.md)\>

Defined in: [src/modules/feed.ts:56](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/feed.ts#L56)

Fetches and parses the feed over JSONP (browser-only; requires `jsonp: true`).

#### Parameters

##### options?

[`FeedOptions`](../interfaces/FeedOptions.md) = `{}`

##### requestOptions?

[`RequestOptionsInterface`](../interfaces/RequestOptionsInterface.md) = `{}`

#### Returns

`Promise`\<[`ParsedFeed`](../interfaces/ParsedFeed.md)\>

***

### rss()

> **rss**(`options?`, `requestOptions?`): `Promise`\<`string`\>

Defined in: [src/modules/feed.ts:45](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/feed.ts#L45)

Fetches the feed as raw RSS 2.0 XML text.

#### Parameters

##### options?

[`FeedOptions`](../interfaces/FeedOptions.md) = `{}`

##### requestOptions?

[`RequestOptionsInterface`](../interfaces/RequestOptionsInterface.md) = `{}`

#### Returns

`Promise`\<`string`\>
