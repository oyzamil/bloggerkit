[**blogr**](../README.md)

***

[blogr](../globals.md) / StatsModule

# Class: StatsModule

Defined in: [src/modules/stats.ts:12](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/stats.ts#L12)

Cheap aggregate counts for the blog (posts/pages/comments/labels totals).

## Constructors

### Constructor

> **new StatsModule**(`client`): `StatsModule`

Defined in: [src/modules/stats.ts:13](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/stats.ts#L13)

#### Parameters

##### client

[`Client`](Client.md)

#### Returns

`StatsModule`

## Methods

### get()

> **get**(`requestOptions?`): `Promise`\<[`BlogStats`](../interfaces/BlogStats.md)\>

Defined in: [src/modules/stats.ts:15](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/stats.ts#L15)

#### Parameters

##### requestOptions?

[`RequestOptionsInterface`](../interfaces/RequestOptionsInterface.md) = `{}`

#### Returns

`Promise`\<[`BlogStats`](../interfaces/BlogStats.md)\>
