[**blogr**](../README.md)

***

[blogr](../globals.md) / LabelsModule

# Class: LabelsModule

Defined in: src/modules/labels.ts:9

Methods for discovering and filtering by labels (Blogger's "categories").

## Constructors

### Constructor

> **new LabelsModule**(`client`, `posts`): `LabelsModule`

Defined in: src/modules/labels.ts:10

#### Parameters

##### client

[`Client`](Client.md)

##### posts

[`PostsModule`](PostsModule.md)

#### Returns

`LabelsModule`

## Methods

### get()

> **get**(`label`, `options?`, `requestOptions?`): `Promise`\<[`Pager`](../interfaces/Pager.md)\<[`Post`](../interfaces/Post.md)\>\>

Defined in: src/modules/labels.ts:25

Lists posts carrying `label`.

#### Parameters

##### label

`string`

##### options?

`Omit`\<[`PostsListOptions`](../interfaces/PostsListOptions.md), `"label"`\> = `{}`

##### requestOptions?

`RequestOptions` = `{}`

#### Returns

`Promise`\<[`Pager`](../interfaces/Pager.md)\<[`Post`](../interfaces/Post.md)\>\>

***

### list()

> **list**(`requestOptions?`): `Promise`\<`string`[]\>

Defined in: src/modules/labels.ts:16

Returns every label currently known to the blog.

#### Parameters

##### requestOptions?

`RequestOptions` = `{}`

#### Returns

`Promise`\<`string`[]\>
