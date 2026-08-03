[**blogr**](../README.md)

***

[blogr](../globals.md) / AuthorsModule

# Class: AuthorsModule

Defined in: [src/modules/authors.ts:10](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/authors.ts#L10)

Lists distinct post authors. Blogger's feed API has no dedicated authors
endpoint, so this aggregates authors seen across up to `sampleSize`
(default 150) of the blog's most recent posts.

## Constructors

### Constructor

> **new AuthorsModule**(`posts`): `AuthorsModule`

Defined in: [src/modules/authors.ts:11](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/authors.ts#L11)

#### Parameters

##### posts

[`PostsModule`](PostsModule.md)

#### Returns

`AuthorsModule`

## Methods

### list()

> **list**(`options?`, `requestOptions?`): `Promise`\<[`Author`](../interfaces/Author.md)[]\>

Defined in: [src/modules/authors.ts:13](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/authors.ts#L13)

#### Parameters

##### options?

###### sampleSize?

`number`

##### requestOptions?

[`RequestOptionsInterface`](../interfaces/RequestOptionsInterface.md) = `{}`

#### Returns

`Promise`\<[`Author`](../interfaces/Author.md)[]\>
