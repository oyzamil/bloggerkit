[**blogr**](../README.md)

***

[blogr](../globals.md) / extractImages

# Function: extractImages()

> **extractImages**(`input`, `includeThumbnail?`): `string`[]

Defined in: [src/parser/html.ts:111](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/parser/html.ts#L111)

Extracts every unique `<img>` source URL from a post's HTML content.
Optionally includes `post.thumbnail`.

## Parameters

### input

`string` \| [`Post`](../interfaces/Post.md) \| `null` \| `undefined`

### includeThumbnail?

`boolean` = `true`

## Returns

`string`[]
