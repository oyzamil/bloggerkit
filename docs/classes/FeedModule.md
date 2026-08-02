[**blogr**](../README.md)

***

[blogr](../globals.md) / FeedModule

# Class: FeedModule

Defined in: src/modules/feed.ts:18

Fetches the blog's feed in any of Blogger's supported wire formats.

## Constructors

### Constructor

> **new FeedModule**(`client`): `FeedModule`

Defined in: src/modules/feed.ts:19

#### Parameters

##### client

[`Client`](Client.md)

#### Returns

`FeedModule`

## Methods

### atom()

> **atom**(`options?`, `requestOptions?`): `Promise`\<`string`\>

Defined in: src/modules/feed.ts:34

Fetches the feed as raw Atom XML text.

#### Parameters

##### options?

[`FeedOptions`](../interfaces/FeedOptions.md) = `{}`

##### requestOptions?

`RequestOptions` = `{}`

#### Returns

`Promise`\<`string`\>

***

### json()

> **json**(`options?`, `requestOptions?`): `Promise`\<[`ParsedFeed`](../interfaces/ParsedFeed.md)\>

Defined in: src/modules/feed.ts:22

Fetches and parses the feed as JSON (default transport).

#### Parameters

##### options?

[`FeedOptions`](../interfaces/FeedOptions.md) = `{}`

##### requestOptions?

`RequestOptions` = `{}`

#### Returns

`Promise`\<[`ParsedFeed`](../interfaces/ParsedFeed.md)\>

***

### jsonp()

> **jsonp**(`options?`, `requestOptions?`): `Promise`\<[`ParsedFeed`](../interfaces/ParsedFeed.md)\>

Defined in: src/modules/feed.ts:56

Fetches and parses the feed over JSONP (browser-only; requires `jsonp: true`).

#### Parameters

##### options?

[`FeedOptions`](../interfaces/FeedOptions.md) = `{}`

##### requestOptions?

`RequestOptions` = `{}`

#### Returns

`Promise`\<[`ParsedFeed`](../interfaces/ParsedFeed.md)\>

***

### rss()

> **rss**(`options?`, `requestOptions?`): `Promise`\<`string`\>

Defined in: src/modules/feed.ts:45

Fetches the feed as raw RSS 2.0 XML text.

#### Parameters

##### options?

[`FeedOptions`](../interfaces/FeedOptions.md) = `{}`

##### requestOptions?

`RequestOptions` = `{}`

#### Returns

`Promise`\<`string`\>
