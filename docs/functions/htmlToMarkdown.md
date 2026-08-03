[**blogr**](../README.md)

***

[blogr](../globals.md) / htmlToMarkdown

# Function: htmlToMarkdown()

> **htmlToMarkdown**(`input`): `string`

Defined in: [src/parser/html.ts:51](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/parser/html.ts#L51)

Best-effort HTML → Markdown conversion for Blogger post content. Handles
the common tags Blogger emits: headings, paragraphs, bold/italic, links,
images, lists, blockquotes and inline/block code.

## Parameters

### input

`string` \| [`Post`](../interfaces/Post.md) \| `null` \| `undefined`

## Returns

`string`
