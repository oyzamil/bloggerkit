[**blogr**](../README.md)

***

[blogr](../globals.md) / RandomOptions

# Type Alias: RandomOptions

> **RandomOptions** = `number` \| `Omit`\<[`PostsListOptions`](../interfaces/PostsListOptions.md), `"limit"` \| `"startIndex"`\> & `object`

Defined in: [src/types/options.ts:63](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/options.ts#L63)

Options for [PostsModule.random](../classes/PostsModule.md#random). A bare
`number` is shorthand for `{ count: number }`; pass an object instead to
also filter by `label`, `query`, date range, etc.
