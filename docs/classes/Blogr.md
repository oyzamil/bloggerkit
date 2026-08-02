[**blogr**](../README.md)

***

[blogr](../globals.md) / Blogr

# Class: Blogr

Defined in: src/blogger.ts:57

A modern, modular, fully-typed SDK for the Blogger (Blogspot) public feed
API.

```ts
import { Blogr } from "blogr";

const blog = new Blogr("https://example.blogspot.com");
const { items } = await blog.posts({ limit: 10, label: "JavaScript" });
```

## Constructors

### Constructor

> **new Blogr**(`urlOrId`, `options?`): `Blogr`

Defined in: src/blogger.ts:84

Creates a Blogger SDK client.

#### Parameters

##### urlOrId

`string` \| `URL`

The blog's URL (custom domain or `*.blogspot.com`), or its numeric Blogger blog id.

##### options?

[`ClientOptions`](../interfaces/ClientOptions.md) = `{}`

SDK options.

#### Returns

`Blogr`

## Properties

### archive

> `readonly` **archive**: [`ArchiveModule`](ArchiveModule.md)

Defined in: src/blogger.ts:65

Year/month archive browsing.

***

### cache

> `readonly` **cache**: [`Cache`](Cache.md)

Defined in: src/blogger.ts:67

Response cache (disabled by default).

***

### feed

> `readonly` **feed**: [`FeedModule`](FeedModule.md)

Defined in: src/blogger.ts:63

Raw feed fetchers for each wire format (json/atom/rss/jsonp).

***

### url

> `readonly` **url**: [`UrlModule`](UrlModule.md)

Defined in: src/blogger.ts:61

Raw feed URL builders — no requests are made.

## Methods

### authors()

> **authors**(`options?`, `requestOptions?`): `Promise`\<[`Author`](../interfaces/Author.md)[]\>

Defined in: src/blogger.ts:122

Distinct post authors, aggregated from a sample of recent posts.

#### Parameters

##### options?

###### sampleSize?

`number`

##### requestOptions?

`RequestOptions`

#### Returns

`Promise`\<[`Author`](../interfaces/Author.md)[]\>

***

### categories()

> **categories**(`requestOptions?`): `Promise`\<`string`[]\>

Defined in: src/blogger.ts:254

Alias of [Blogr.labels](#labels) — Blogger uses "labels" and "categories" interchangeably.

#### Parameters

##### requestOptions?

`RequestOptions`

#### Returns

`Promise`\<`string`[]\>

***

### comment()

> **comment**(`commentId`, `postId?`, `requestOptions?`): `Promise`\<[`Comment`](../interfaces/Comment.md) \| `null`\>

Defined in: src/blogger.ts:222

Fetches a single comment by id. Pass `postId` when known for a single,
direct request — see [CommentsModule.get](CommentsModule.md#get).

#### Parameters

##### commentId

`string`

##### postId?

`string`

##### requestOptions?

`RequestOptions`

#### Returns

`Promise`\<[`Comment`](../interfaces/Comment.md) \| `null`\>

***

### comments()

> **comments**(`postIdOrOptions?`, `requestOptions?`): `Promise`\<[`Pager`](../interfaces/Pager.md)\<[`Comment`](../interfaces/Comment.md)\>\>

Defined in: src/blogger.ts:208

Lists comments — for the whole blog when called with no argument or an
options object, or scoped to a single post when passed a `postId` string.

#### Parameters

##### postIdOrOptions?

`string` \| [`CommentsListOptions`](../interfaces/CommentsListOptions.md)

##### requestOptions?

`RequestOptions`

#### Returns

`Promise`\<[`Pager`](../interfaces/Pager.md)\<[`Comment`](../interfaces/Comment.md)\>\>

***

### extractEmbeds()

> **extractEmbeds**(`input`): [`ExtractedEmbed`](../interfaces/ExtractedEmbed.md)[]

Defined in: src/blogger.ts:332

Every non-YouTube `<iframe>` embed (`{ src, provider }`) in a post.

#### Parameters

##### input

`string` \| [`Post`](../interfaces/Post.md) \| `null` \| `undefined`

#### Returns

[`ExtractedEmbed`](../interfaces/ExtractedEmbed.md)[]

***

### extractImages()

> **extractImages**(`input`): `string`[]

Defined in: src/blogger.ts:317

Every unique image URL in a post's HTML content.

#### Parameters

##### input

`string` \| [`Post`](../interfaces/Post.md) \| `null` \| `undefined`

#### Returns

`string`[]

***

### extractLinks()

> **extractLinks**(`input`): [`ExtractedLink`](../interfaces/ExtractedLink.md)[]

Defined in: src/blogger.ts:322

Every link (`{ url, text }`) in a post's HTML content.

#### Parameters

##### input

`string` \| [`Post`](../interfaces/Post.md) \| `null` \| `undefined`

#### Returns

[`ExtractedLink`](../interfaces/ExtractedLink.md)[]

***

### extractYouTube()

> **extractYouTube**(`input`): [`ExtractedYouTube`](../interfaces/ExtractedYouTube.md)[]

Defined in: src/blogger.ts:327

Every YouTube video (`{ id, url }`) referenced/embedded in a post.

#### Parameters

##### input

`string` \| [`Post`](../interfaces/Post.md) \| `null` \| `undefined`

#### Returns

[`ExtractedYouTube`](../interfaces/ExtractedYouTube.md)[]

***

### featured()

> **featured**(`requestOptions?`): `Promise`\<[`Post`](../interfaces/Post.md) \| `null`\>

Defined in: src/blogger.ts:163

Best-effort "featured"/pinned post — see [PostsModule.featured](PostsModule.md#featured).

#### Parameters

##### requestOptions?

`RequestOptions`

#### Returns

`Promise`\<[`Post`](../interfaces/Post.md) \| `null`\>

***

### fetch()

> **fetch**\<`T`\>(`url`, `requestOptions?`): `Promise`\<`T`\>

Defined in: src/blogger.ts:354

Fetches an arbitrary URL and returns raw parsed JSON (bypasses feed parsing).

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### url

`string` \| `URL`

##### requestOptions?

`RequestOptions`

#### Returns

`Promise`\<`T`\>

***

### htmlToMarkdown()

> **htmlToMarkdown**(`input`): `string`

Defined in: src/blogger.ts:312

Best-effort HTML → Markdown conversion.

#### Parameters

##### input

`string` \| [`Post`](../interfaces/Post.md) \| `null` \| `undefined`

#### Returns

`string`

***

### htmlToText()

> **htmlToText**(`input`): `string`

Defined in: src/blogger.ts:307

Strips HTML tags, returning plain text.

#### Parameters

##### input

`string` \| [`Post`](../interfaces/Post.md) \| `null` \| `undefined`

#### Returns

`string`

***

### images()

> **images**(`options?`, `requestOptions?`): `Promise`\<`string`[]\>

Defined in: src/blogger.ts:275

Unique image URLs found across a sample of recent posts.

#### Parameters

##### options?

###### sampleSize?

`number`

##### requestOptions?

`RequestOptions`

#### Returns

`Promise`\<`string`[]\>

***

### info()

> **info**(`requestOptions?`): `Promise`\<[`BlogInfo`](../interfaces/BlogInfo.md)\>

Defined in: src/blogger.ts:107

Fetches blog metadata (title, subtitle, labels, author, url, favicon, ...).

#### Parameters

##### requestOptions?

`RequestOptions` = `{}`

#### Returns

`Promise`\<[`BlogInfo`](../interfaces/BlogInfo.md)\>

***

### label()

> **label**(`label`, `options?`, `requestOptions?`): `Promise`\<[`Pager`](../interfaces/Pager.md)\<[`Post`](../interfaces/Post.md)\>\>

Defined in: src/blogger.ts:245

Lists posts carrying `label`.

#### Parameters

##### label

`string`

##### options?

`Omit`\<[`PostsListOptions`](../interfaces/PostsListOptions.md), `"label"`\>

##### requestOptions?

`RequestOptions`

#### Returns

`Promise`\<[`Pager`](../interfaces/Pager.md)\<[`Post`](../interfaces/Post.md)\>\>

***

### labels()

> **labels**(`requestOptions?`): `Promise`\<`string`[]\>

Defined in: src/blogger.ts:240

Lists every label known to the blog.

#### Parameters

##### requestOptions?

`RequestOptions`

#### Returns

`Promise`\<`string`[]\>

***

### latest()

> **latest**(`options?`, `requestOptions?`): `Promise`\<[`Post`](../interfaces/Post.md)[]\>

Defined in: src/blogger.ts:155

Returns the most recent posts (default 5), newest first. Pass a bare
`number` for just a limit, or an options object to also filter by
`label`, `query`, date range, etc.

#### Parameters

##### options?

[`LatestOptions`](../type-aliases/LatestOptions.md)

##### requestOptions?

`RequestOptions`

#### Returns

`Promise`\<[`Post`](../interfaces/Post.md)[]\>

***

### links()

> **links**(`requestOptions?`): `Promise`\<[`Link`](../interfaces/Link.md)[]\>

Defined in: src/blogger.ts:112

Returns the blog's top-level `<link>` entries.

#### Parameters

##### requestOptions?

`RequestOptions` = `{}`

#### Returns

`Promise`\<[`Link`](../interfaces/Link.md)[]\>

***

### normalize()

> **normalize**(`data`): [`BlogInfo`](../interfaces/BlogInfo.md) \| [`Post`](../interfaces/Post.md) \| [`Comment`](../interfaces/Comment.md) \| `null`

Defined in: src/blogger.ts:298

Normalizes a single raw feed entry object into a typed [Post](../interfaces/Post.md), [Comment](../interfaces/Comment.md) or [BlogInfo](../interfaces/BlogInfo.md).

#### Parameters

##### data

`unknown`

#### Returns

[`BlogInfo`](../interfaces/BlogInfo.md) \| [`Post`](../interfaces/Post.md) \| [`Comment`](../interfaces/Comment.md) \| `null`

***

### off()

> **off**\<`K`\>(`event`, `listener`): `this`

Defined in: src/blogger.ts:381

Unsubscribes a previously-registered listener.

#### Type Parameters

##### K

`K` *extends* keyof [`BloggerEventMap`](../interfaces/BloggerEventMap.md)

#### Parameters

##### event

`K`

##### listener

(`payload`) => `void`

#### Returns

`this`

***

### on()

> **on**\<`K`\>(`event`, `listener`): `this`

Defined in: src/blogger.ts:372

Subscribes to `"request"`, `"response"` or `"error"` lifecycle events.

#### Type Parameters

##### K

`K` *extends* keyof [`BloggerEventMap`](../interfaces/BloggerEventMap.md)

#### Parameters

##### event

`K`

##### listener

(`payload`) => `void`

#### Returns

`this`

***

### page()

> **page**(`pageId`, `options?`, `requestOptions?`): `Promise`\<[`Post`](../interfaces/Post.md) \| `null`\>

Defined in: src/blogger.ts:192

Fetches a single page by id, or `null` if it doesn't exist.

#### Parameters

##### pageId

`string`

##### options?

###### summary?

`boolean`

##### requestOptions?

`RequestOptions`

#### Returns

`Promise`\<[`Post`](../interfaces/Post.md) \| `null`\>

***

### pages()

> **pages**(`options?`, `requestOptions?`): `Promise`\<[`Pager`](../interfaces/Pager.md)\<[`Post`](../interfaces/Post.md)\>\>

Defined in: src/blogger.ts:184

Lists the blog's static pages.

#### Parameters

##### options?

[`BaseListOptions`](../interfaces/BaseListOptions.md)

##### requestOptions?

`RequestOptions`

#### Returns

`Promise`\<[`Pager`](../interfaces/Pager.md)\<[`Post`](../interfaces/Post.md)\>\>

***

### parse()

> **parse**(`raw`): [`ParsedFeed`](../interfaces/ParsedFeed.md)

Defined in: src/blogger.ts:293

Parses a raw Blogger feed JSON payload (e.g. from [Blogr.fetch](#fetch)) into a [ParsedFeed](../interfaces/ParsedFeed.md).

#### Parameters

##### raw

`unknown`

#### Returns

[`ParsedFeed`](../interfaces/ParsedFeed.md)

***

### post()

> **post**(`postId`, `options?`, `requestOptions?`): `Promise`\<[`Post`](../interfaces/Post.md) \| `null`\>

Defined in: src/blogger.ts:142

Fetches a single post by id, or `null` if it doesn't exist.

#### Parameters

##### postId

`string`

##### options?

###### summary?

`boolean`

##### requestOptions?

`RequestOptions`

#### Returns

`Promise`\<[`Post`](../interfaces/Post.md) \| `null`\>

***

### posts()

> **posts**(`options?`, `requestOptions?`): `Promise`\<[`Pager`](../interfaces/Pager.md)\<[`Post`](../interfaces/Post.md)\>\>

Defined in: src/blogger.ts:134

Lists posts, optionally filtered/paginated/sorted.

#### Parameters

##### options?

[`PostsListOptions`](../interfaces/PostsListOptions.md)

##### requestOptions?

`RequestOptions`

#### Returns

`Promise`\<[`Pager`](../interfaces/Pager.md)\<[`Post`](../interfaces/Post.md)\>\>

***

### random()

> **random**(`options?`, `requestOptions?`): `Promise`\<[`Post`](../interfaces/Post.md)[]\>

Defined in: src/blogger.ts:172

Returns random post(s) sampled from the whole blog. Pass a bare
`number` for just a count, or an options object to also filter by
`label`, `query`, date range, etc.

#### Parameters

##### options?

[`RandomOptions`](../type-aliases/RandomOptions.md)

##### requestOptions?

`RequestOptions`

#### Returns

`Promise`\<[`Post`](../interfaces/Post.md)[]\>

***

### request()

> **request**(`endpoint`, `requestOptions?`): `Promise`\<[`ParsedFeed`](../interfaces/ParsedFeed.md)\>

Defined in: src/blogger.ts:346

Performs a request against a feed-relative `endpoint` (or absolute URL) and returns the parsed feed.

#### Parameters

##### endpoint

`string` \| `URL`

##### requestOptions?

`RequestOptions`

#### Returns

`Promise`\<[`ParsedFeed`](../interfaces/ParsedFeed.md)\>

***

### resolve()

> **resolve**(`url`): `Promise`\<`string`\>

Defined in: src/blogger.ts:287

Resolves a possibly-relative URL against the blog's own URL.

#### Parameters

##### url

`string`

#### Returns

`Promise`\<`string`\>

***

### search()

> **search**(`input`, `requestOptions?`): `Promise`\<[`Pager`](../interfaces/Pager.md)\<[`Post`](../interfaces/Post.md)\>\>

Defined in: src/blogger.ts:263

Full-text search across posts. Accepts a query string or a [SearchOptions](../interfaces/SearchOptions.md) object.

#### Parameters

##### input

`string` \| [`SearchOptions`](../interfaces/SearchOptions.md)

##### requestOptions?

`RequestOptions`

#### Returns

`Promise`\<[`Pager`](../interfaces/Pager.md)\<[`Post`](../interfaces/Post.md)\>\>

***

### stats()

> **stats**(`requestOptions?`): `Promise`\<[`BlogStats`](../interfaces/BlogStats.md)\>

Defined in: src/blogger.ts:117

Cheap aggregate counts: total posts, pages, comments and labels.

#### Parameters

##### requestOptions?

`RequestOptions` = `{}`

#### Returns

`Promise`\<[`BlogStats`](../interfaces/BlogStats.md)\>

***

### thumbnail()

> **thumbnail**(`input`): `string` \| `null`

Defined in: src/blogger.ts:337

Best available thumbnail for a post.

#### Parameters

##### input

`string` \| [`Post`](../interfaces/Post.md) \| `null` \| `undefined`

#### Returns

`string` \| `null`

***

### use()

> **use**(`plugin`): `this`

Defined in: src/blogger.ts:366

Installs a plugin — a function `(blog) => void`, or an object with an `install(blog)` method.

#### Parameters

##### plugin

[`BloggerPlugin`](../type-aliases/BloggerPlugin.md)

#### Returns

`this`

***

### connect()

> `static` **connect**(`urlOrId`, `options?`): `Promise`\<`Blogr`\>

Defined in: src/blogger.ts:394

Creates a client and eagerly resolves/validates the blog's metadata.

#### Parameters

##### urlOrId

`string` \| `URL`

##### options?

[`ClientOptions`](../interfaces/ClientOptions.md) = `{}`

#### Returns

`Promise`\<`Blogr`\>

***

### fromBlogId()

> `static` **fromBlogId**(`id`, `options?`): `Blogr`

Defined in: src/blogger.ts:404

Creates a client from a numeric Blogger blog id.

#### Parameters

##### id

`string`

##### options?

[`ClientOptions`](../interfaces/ClientOptions.md) = `{}`

#### Returns

`Blogr`

***

### fromFeed()

> `static` **fromFeed**(`feedUrl`, `options?`): `Blogr`

Defined in: src/blogger.ts:419

Creates a client from any Blogger feed URL, e.g.
`https://example.blogspot.com/feeds/posts/default` or
`https://www.blogger.com/feeds/1234567890/posts/default`.

#### Parameters

##### feedUrl

`string` \| `URL`

##### options?

[`ClientOptions`](../interfaces/ClientOptions.md) = `{}`

#### Returns

`Blogr`

***

### fromUrl()

> `static` **fromUrl**(`url`, `options?`): `Blogr`

Defined in: src/blogger.ts:410

Creates a client from a blog URL (custom domain or `*.blogspot.com`).

#### Parameters

##### url

`string` \| `URL`

##### options?

[`ClientOptions`](../interfaces/ClientOptions.md) = `{}`

#### Returns

`Blogr`
