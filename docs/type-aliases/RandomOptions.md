[**blogr**](../README.md)

***

[blogr](../globals.md) / RandomOptions

# Type Alias: RandomOptions

> **RandomOptions** = `number` \| `Omit`\<[`PostsListOptions`](../interfaces/PostsListOptions.md), `"limit"` \| `"startIndex"`\> & `object`

Defined in: src/types/options.ts:60

Options for [PostsModule.random](../classes/PostsModule.md#random). A bare
`number` is shorthand for `{ count: number }`; pass an object instead to
also filter by `label`, `query`, date range, etc.
