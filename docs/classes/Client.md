[**blogr**](../README.md)

***

[blogr](../globals.md) / Client

# Class: Client

Defined in: [src/core/client.ts:42](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/core/client.ts#L42)

Resolves a blog URL or numeric id into request base URLs, and performs
(optionally cached, event-emitting) requests against the Blogger feed API.

## Constructors

### Constructor

> **new Client**(`urlOrId`, `options?`): `Client`

Defined in: [src/core/client.ts:52](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/core/client.ts#L52)

#### Parameters

##### urlOrId

`string` \| `URL`

##### options?

[`ClientOptions`](../interfaces/ClientOptions.md) = `{}`

#### Returns

`Client`

## Properties

### cache

> `readonly` **cache**: [`Cache`](Cache.md)

Defined in: [src/core/client.ts:44](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/core/client.ts#L44)

***

### events

> `readonly` **events**: [`EventEmitter`](EventEmitter.md)

Defined in: [src/core/client.ts:43](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/core/client.ts#L43)

## Methods

### fetchRaw()

> **fetchRaw**\<`T`\>(`url`, `options?`): `Promise`\<`T`\>

Defined in: [src/core/client.ts:242](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/core/client.ts#L242)

Low-level: fetch an arbitrary URL and return parsed JSON (no feed parsing).

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### url

`string` \| `URL`

##### options?

###### signal?

`AbortSignal`

#### Returns

`Promise`\<`T`\>

***

### getBlogId()

> **getBlogId**(): `Promise`\<`string`\>

Defined in: [src/core/client.ts:118](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/core/client.ts#L118)

#### Returns

`Promise`\<`string`\>

***

### getBlogInfo()

> **getBlogInfo**(`options?`): `Promise`\<[`BlogInfo`](../interfaces/BlogInfo.md)\>

Defined in: [src/core/client.ts:100](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/core/client.ts#L100)

Resolves (and caches) blog-level metadata, needed to discover id/url lazily.

#### Parameters

##### options?

###### signal?

`AbortSignal`

#### Returns

`Promise`\<[`BlogInfo`](../interfaces/BlogInfo.md)\>

***

### getBlogUrl()

> **getBlogUrl**(): `Promise`\<`string`\>

Defined in: [src/core/client.ts:123](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/core/client.ts#L123)

#### Returns

`Promise`\<`string`\>

***

### getDomainBase()

> **getDomainBase**(): `Promise`\<`string`\>

Defined in: [src/core/client.ts:129](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/core/client.ts#L129)

#### Returns

`Promise`\<`string`\>

***

### getServiceBase()

> **getServiceBase**(): `Promise`\<`string`\>

Defined in: [src/core/client.ts:133](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/core/client.ts#L133)

#### Returns

`Promise`\<`string`\>

***

### req()

> **req**(`path`, `options?`): `Promise`\<[`ParsedFeed`](../interfaces/ParsedFeed.md)\>

Defined in: [src/core/client.ts:149](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/core/client.ts#L149)

Performs a request against the Blogger feed API and returns the parsed feed.

#### Parameters

##### path

`string` \| `URL`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md) = `{}`

#### Returns

`Promise`\<[`ParsedFeed`](../interfaces/ParsedFeed.md)\>

***

### reqRaw()

> **reqRaw**(`path`, `format`, `options?`): `Promise`\<`string`\>

Defined in: [src/core/client.ts:211](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/core/client.ts#L211)

Fetches a feed url in `atom` or `rss` format and returns the raw XML text.

#### Parameters

##### path

`string` \| `URL`

##### format

`"atom"` \| `"rss"`

##### options?

`Omit`\<[`RequestOptions`](../interfaces/RequestOptions.md), `"format"`\> = `{}`

#### Returns

`Promise`\<`string`\>

***

### resolveUrl()

> **resolveUrl**(`path`, `options?`): `URL`

Defined in: [src/core/client.ts:138](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/core/client.ts#L138)

Returns the raw feed URL for `path` without performing a request.

#### Parameters

##### path

`string` \| `URL`

##### options?

`Omit`\<[`RequestOptions`](../interfaces/RequestOptions.md), `"signal"`\> = `{}`

#### Returns

`URL`
