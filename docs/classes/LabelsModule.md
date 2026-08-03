[**blogr**](../README.md)

***

[blogr](../globals.md) / LabelsModule

# Class: LabelsModule

Defined in: [src/modules/labels.ts:9](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/labels.ts#L9)

Methods for discovering and filtering by labels (Blogger's "categories").

## Constructors

### Constructor

> **new LabelsModule**(`client`, `posts`): `LabelsModule`

Defined in: [src/modules/labels.ts:10](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/labels.ts#L10)

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

Defined in: [src/modules/labels.ts:25](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/labels.ts#L25)

Lists posts carrying `label`.

#### Parameters

##### label

`string`

##### options?

`Omit`\<[`PostsListOptions`](../interfaces/PostsListOptions.md), `"label"`\> = `{}`

##### requestOptions?

[`RequestOptionsInterface`](../interfaces/RequestOptionsInterface.md) = `{}`

#### Returns

`Promise`\<[`Pager`](../interfaces/Pager.md)\<[`Post`](../interfaces/Post.md)\>\>

***

### list()

> **list**(`requestOptions?`): `Promise`\<`string`[]\>

Defined in: [src/modules/labels.ts:16](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/labels.ts#L16)

Returns every label currently known to the blog.

#### Parameters

##### requestOptions?

[`RequestOptionsInterface`](../interfaces/RequestOptionsInterface.md) = `{}`

#### Returns

`Promise`\<`string`[]\>
