[**blogr**](../README.md)

***

[blogr](../globals.md) / htmlToMarkdown

# Function: htmlToMarkdown()

> **htmlToMarkdown**(`input`): `string`

Defined in: src/parser/html.ts:51

Best-effort HTML → Markdown conversion for Blogger post content. Handles
the common tags Blogger emits: headings, paragraphs, bold/italic, links,
images, lists, blockquotes and inline/block code.

## Parameters

### input

`string` \| [`Post`](../interfaces/Post.md) \| `null` \| `undefined`

## Returns

`string`
