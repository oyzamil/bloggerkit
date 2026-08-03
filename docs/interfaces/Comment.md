[**blogr**](../README.md)

***

[blogr](../globals.md) / Comment

# Interface: Comment

Defined in: [src/types/feed.ts:100](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L100)

A comment entry.

## Properties

### author

> **author**: [`Author`](Author.md)

Defined in: [src/types/feed.ts:106](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L106)

***

### content

> **content**: `string` \| `null`

Defined in: [src/types/feed.ts:107](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L107)

***

### extended

> **extended**: [`Extended`](Extended.md)

Defined in: [src/types/feed.ts:109](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L109)

***

### id

> **id**: `string`

Defined in: [src/types/feed.ts:101](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L101)

***

### inReplyTo

> **inReplyTo**: `string` \| `null`

Defined in: [src/types/feed.ts:116](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L116)

Id of the parent comment when this is a reply, else `null`.

***

### links

> **links**: [`Link`](Link.md)[]

Defined in: [src/types/feed.ts:117](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L117)

***

### post

> **post**: `object`

Defined in: [src/types/feed.ts:111](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L111)

The post this comment belongs to.

#### id

> **id**: `string`

#### url

> **url**: `string`

***

### published

> **published**: `string`

Defined in: [src/types/feed.ts:104](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L104)

***

### summary

> **summary**: `string` \| `null`

Defined in: [src/types/feed.ts:108](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L108)

***

### title

> **title**: `string`

Defined in: [src/types/feed.ts:102](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L102)

***

### updated

> **updated**: `string`

Defined in: [src/types/feed.ts:105](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L105)

***

### url

> **url**: `string`

Defined in: [src/types/feed.ts:103](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/types/feed.ts#L103)
