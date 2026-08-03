[**blogr**](../README.md)

***

[blogr](../globals.md) / parseFeed

# Function: parseFeed()

> **parseFeed**(`input`): [`ParsedFeed`](../interfaces/ParsedFeed.md)

Defined in: [src/parser/feed-parser.ts:344](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/parser/feed-parser.ts#L344)

Parses a raw Blogger GData JSON response (the shape returned by
`?alt=json`) into a typed [ParsedFeed](../interfaces/ParsedFeed.md).

Accepts either `{ feed: { entry } }` (a full feed response) or
`{ entry }` (a single-entry response).

## Parameters

### input

`unknown`

## Returns

[`ParsedFeed`](../interfaces/ParsedFeed.md)
