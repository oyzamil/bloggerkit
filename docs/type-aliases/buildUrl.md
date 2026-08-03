[**blogr**](../README.md)

***

[blogr](../globals.md) / buildUrl

# Type Alias: buildUrl

> **buildUrl** = (`path`, `base`, `__namedParameters`) => `URL`

Defined in: [src/core/http.ts:22](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/core/http.ts#L22)

Builds a feed URL from a base + path + friendly query options.

## Parameters

### path

`string` \| `URL`

### base

`string` \| `URL`

### \_\_namedParameters?

#### callback?

`string`

#### format?

[`FeedFormat`](FeedFormat.md) = `"json"`

#### query?

[`QueryOptions`](../interfaces/QueryOptions.md)

## Returns

`URL`
