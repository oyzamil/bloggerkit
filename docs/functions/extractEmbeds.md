[**blogr**](../README.md)

***

[blogr](../globals.md) / extractEmbeds

# Function: extractEmbeds()

> **extractEmbeds**(`input`): [`ExtractedEmbed`](../interfaces/ExtractedEmbed.md)[]

Defined in: [src/parser/html.ts:220](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/parser/html.ts#L220)

Extracts every non-YouTube `<iframe>` embed (Spotify, Vimeo, Google Maps, forms, etc.) from a post.

## Parameters

### input

`string` \| [`Post`](../interfaces/Post.md) \| `null` \| `undefined`

## Returns

[`ExtractedEmbed`](../interfaces/ExtractedEmbed.md)[]
