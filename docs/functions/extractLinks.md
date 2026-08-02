[**blogr**](../README.md)

***

[blogr](../globals.md) / extractLinks

# Function: extractLinks()

> **extractLinks**(`input`): [`ExtractedLink`](../interfaces/ExtractedLink.md)[]

Defined in: src/parser/html.ts:128

Extracts every `<a href>` from a post's HTML content, in document order.

## Parameters

### input

`string` \| [`Post`](../interfaces/Post.md) \| `null` \| `undefined`

## Returns

[`ExtractedLink`](../interfaces/ExtractedLink.md)[]
