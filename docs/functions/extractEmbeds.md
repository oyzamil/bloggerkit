[**blogr**](../README.md)

***

[blogr](../globals.md) / extractEmbeds

# Function: extractEmbeds()

> **extractEmbeds**(`input`): [`ExtractedEmbed`](../interfaces/ExtractedEmbed.md)[]

Defined in: src/parser/html.ts:203

Extracts every non-YouTube `<iframe>` embed (Spotify, Vimeo, Google Maps, forms, etc.) from a post.

## Parameters

### input

`string` \| [`Post`](../interfaces/Post.md) \| `null` \| `undefined`

## Returns

[`ExtractedEmbed`](../interfaces/ExtractedEmbed.md)[]
