[**blogr**](../README.md)

***

[blogr](../globals.md) / SearchModule

# Class: SearchModule

Defined in: [src/modules/search.ts:8](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/search.ts#L8)

Full-text search across posts.

## Constructors

### Constructor

> **new SearchModule**(`posts`): `SearchModule`

Defined in: [src/modules/search.ts:9](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/search.ts#L9)

#### Parameters

##### posts

[`PostsModule`](PostsModule.md)

#### Returns

`SearchModule`

## Methods

### run()

> **run**(`input`, `requestOptions?`): `Promise`\<[`Pager`](../interfaces/Pager.md)\<[`Post`](../interfaces/Post.md)\>\>

Defined in: [src/modules/search.ts:12](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/search.ts#L12)

Searches posts by a plain query string, or a [SearchOptions](../interfaces/SearchOptions.md) object.

#### Parameters

##### input

`string` \| [`SearchOptions`](../interfaces/SearchOptions.md)

##### requestOptions?

[`RequestOptionsInterface`](../interfaces/RequestOptionsInterface.md) = `{}`

#### Returns

`Promise`\<[`Pager`](../interfaces/Pager.md)\<[`Post`](../interfaces/Post.md)\>\>
