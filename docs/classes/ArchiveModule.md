[**blogr**](../README.md)

***

[blogr](../globals.md) / ArchiveModule

# Class: ArchiveModule

Defined in: [src/modules/archive.ts:22](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/archive.ts#L22)

Year/month archive browsing. Blogger's public feed API has no dedicated
archive endpoint, so this is built on top of `publishedMin`/`publishedMax`
range queries against the posts feed.

## Constructors

### Constructor

> **new ArchiveModule**(`posts`): `ArchiveModule`

Defined in: [src/modules/archive.ts:23](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/archive.ts#L23)

#### Parameters

##### posts

[`PostsModule`](PostsModule.md)

#### Returns

`ArchiveModule`

## Methods

### month()

> **month**(`year`, `month`, `options?`, `requestOptions?`): `Promise`\<[`Pager`](../interfaces/Pager.md)\<[`Post`](../interfaces/Post.md)\>\>

Defined in: [src/modules/archive.ts:39](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/archive.ts#L39)

Lists posts published in `month` (1-based) of `year`.

#### Parameters

##### year

`number`

##### month

`number`

##### options?

###### limit?

`number`

###### page?

`number`

##### requestOptions?

[`RequestOptionsInterface`](../interfaces/RequestOptionsInterface.md) = `{}`

#### Returns

`Promise`\<[`Pager`](../interfaces/Pager.md)\<[`Post`](../interfaces/Post.md)\>\>

***

### year()

> **year**(`year`, `options?`, `requestOptions?`): `Promise`\<[`Pager`](../interfaces/Pager.md)\<[`Post`](../interfaces/Post.md)\>\>

Defined in: [src/modules/archive.ts:26](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/archive.ts#L26)

Lists posts published in `year`.

#### Parameters

##### year

`number`

##### options?

###### limit?

`number`

###### page?

`number`

##### requestOptions?

[`RequestOptionsInterface`](../interfaces/RequestOptionsInterface.md) = `{}`

#### Returns

`Promise`\<[`Pager`](../interfaces/Pager.md)\<[`Post`](../interfaces/Post.md)\>\>

***

### years()

> **years**(`requestOptions?`): `Promise`\<`number`[]\>

Defined in: [src/modules/archive.ts:58](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/modules/archive.ts#L58)

Returns every year that has at least one post, newest first.

Determined by locating the newest and oldest post (via `totalResults`
+ `startIndex`), since there's no direct "list of years" endpoint.

#### Parameters

##### requestOptions?

[`RequestOptionsInterface`](../interfaces/RequestOptionsInterface.md) = `{}`

#### Returns

`Promise`\<`number`[]\>
