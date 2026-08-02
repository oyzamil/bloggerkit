[**blogr**](../README.md)

***

[blogr](../globals.md) / Comment

# Interface: Comment

Defined in: src/types/feed.ts:100

A comment entry.

## Properties

### author

> **author**: [`Author`](Author.md)

Defined in: src/types/feed.ts:106

***

### content

> **content**: `string` \| `null`

Defined in: src/types/feed.ts:107

***

### extended

> **extended**: [`Extended`](Extended.md)

Defined in: src/types/feed.ts:109

***

### id

> **id**: `string`

Defined in: src/types/feed.ts:101

***

### inReplyTo

> **inReplyTo**: `string` \| `null`

Defined in: src/types/feed.ts:116

Id of the parent comment when this is a reply, else `null`.

***

### links

> **links**: [`Link`](Link.md)[]

Defined in: src/types/feed.ts:117

***

### post

> **post**: `object`

Defined in: src/types/feed.ts:111

The post this comment belongs to.

#### id

> **id**: `string`

#### url

> **url**: `string`

***

### published

> **published**: `string`

Defined in: src/types/feed.ts:104

***

### summary

> **summary**: `string` \| `null`

Defined in: src/types/feed.ts:108

***

### title

> **title**: `string`

Defined in: src/types/feed.ts:102

***

### updated

> **updated**: `string`

Defined in: src/types/feed.ts:105

***

### url

> **url**: `string`

Defined in: src/types/feed.ts:103
