[**blogr**](../README.md)

***

[blogr](../globals.md) / LatestOptions

# Type Alias: LatestOptions

> **LatestOptions** = `number` \| `Omit`\<[`PostsListOptions`](../interfaces/PostsListOptions.md), `"orderBy"` \| `"startIndex"`\>

Defined in: [src/types/options.ts:54](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/options.ts#L54)

Options for [PostsModule.latest](../classes/PostsModule.md#latest). A bare
`number` is shorthand for `{ limit: number }`; pass an object instead to
also filter by `label`, `query`, date range, etc.
