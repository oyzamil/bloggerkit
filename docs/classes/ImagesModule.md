[**blogr**](../README.md)

***

[blogr](../globals.md) / ImagesModule

# Class: ImagesModule

Defined in: src/modules/images.ts:7

Aggregate image discovery across posts.

## Constructors

### Constructor

> **new ImagesModule**(`posts`): `ImagesModule`

Defined in: src/modules/images.ts:8

#### Parameters

##### posts

[`PostsModule`](PostsModule.md)

#### Returns

`ImagesModule`

## Methods

### list()

> **list**(`options?`, `requestOptions?`): `Promise`\<`string`[]\>

Defined in: src/modules/images.ts:14

Returns every unique image URL found in the content of up to
`sampleSize` (default 25) of the blog's most recent posts.

#### Parameters

##### options?

###### sampleSize?

`number`

##### requestOptions?

`RequestOptions` = `{}`

#### Returns

`Promise`\<`string`[]\>
