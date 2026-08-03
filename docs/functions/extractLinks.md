[**blogr**](../README.md)

***

[blogr](../globals.md) / extractLinks

# Function: extractLinks()

> **extractLinks**(`input`): [`ExtractedLink`](../interfaces/ExtractedLink.md)[]

Defined in: [src/parser/html.ts:145](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/parser/html.ts#L145)

Extracts every `<a href>` from a post's HTML content, in document order.

## Parameters

### input

`string` \| [`Post`](../interfaces/Post.md) \| `null` \| `undefined`

## Returns

[`ExtractedLink`](../interfaces/ExtractedLink.md)[]
