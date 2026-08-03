[**blogr**](../README.md)

***

[blogr](../globals.md) / Cache

# Class: Cache

Defined in: [src/core/cache.ts:10](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/core/cache.ts#L10)

A tiny in-memory cache keyed by request URL. Disabled by default —
call [Cache.enable](#enable) to turn it on.

## Constructors

### Constructor

> **new Cache**(): `Cache`

#### Returns

`Cache`

## Accessors

### isEnabled

#### Get Signature

> **get** **isEnabled**(): `boolean`

Defined in: [src/core/cache.ts:34](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/core/cache.ts#L34)

##### Returns

`boolean`

## Methods

### clear()

> **clear**(): `this`

Defined in: [src/core/cache.ts:29](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/core/cache.ts#L29)

Clears every cached entry.

#### Returns

`this`

***

### disable()

> **disable**(): `this`

Defined in: [src/core/cache.ts:23](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/core/cache.ts#L23)

Disables caching (existing entries are kept, but bypassed until re-enabled).

#### Returns

`this`

***

### enable()

> **enable**(`options?`): `this`

Defined in: [src/core/cache.ts:16](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/core/cache.ts#L16)

Enables caching. Optionally pass a TTL in milliseconds.

#### Parameters

##### options?

###### ttlMs?

`number`

#### Returns

`this`

***

### get()

> **get**\<`T`\>(`key`): `T` \| `undefined`

Defined in: [src/core/cache.ts:38](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/core/cache.ts#L38)

#### Type Parameters

##### T

`T`

#### Parameters

##### key

`string`

#### Returns

`T` \| `undefined`

***

### set()

> **set**\<`T`\>(`key`, `value`): `void`

Defined in: [src/core/cache.ts:49](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/core/cache.ts#L49)

#### Type Parameters

##### T

`T`

#### Parameters

##### key

`string`

##### value

`T`

#### Returns

`void`
