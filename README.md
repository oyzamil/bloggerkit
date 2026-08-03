# blogr

A modern, modular, fully-typed SDK for the [Blogger](https://www.blogger.com) (Blogspot) public feed API. Zero dependencies.

```bash
npm install blogr
```

## Quick start

```ts
import { Blogr } from "blogr";

const blog = new Blogr("https://example.blogspot.com");

const { items } = await blog.posts({ limit: 10, label: "JavaScript" });
```

## Table of contents

- [Constructing a client](#constructing-a-client)
- [Metadata](#metadata)
- [Posts](#posts)
- [Pager](#pager)
- [Pages](#pages)
- [Comments](#comments)
- [Labels / categories](#labels--categories)
- [Search](#search)
- [Archive](#archive)
- [Images](#images)
- [Raw feed URLs](#raw-feed-urls-no-request-made)
- [Feed formats](#feed-formats)
- [Utilities](#utilities)
- [Low-level](#low-level)
- [Cache](#cache)
- [Events](#events)
- [Plugins](#plugins)
- [Errors](#errors)
- [Standalone exports](#standalone-exports)
- [Types reference](#types-reference)
- [Architecture](#architecture)
- [Limitations](#limitations)

## Constructing a client

### `new Blogr(urlOrId, options?)`

The main entry point. Accepts a blog's URL (custom domain or `*.blogspot.com`), a `URL` instance, or a numeric Blogger blog id.

```ts
import { Blogr } from "blogr";

new Blogr("https://example.blogspot.com");
new Blogr("example.blogspot.com");           // scheme optional, defaults to https
new Blogr(new URL("https://example.blogspot.com"));
new Blogr("1234567890123456789");            // numeric blog id
new Blogr("https://example.blogspot.com", { jsonp: true }); // browser-only JSONP transport
```

`options`:

| Option  | Type      | Default | Description                                             |
| ------- | --------- | ------- | --------------------------------------------------------- |
| `jsonp` | `boolean` | `false` | Use JSONP transport instead of `fetch`. Browser-only — throws if `window`/`document` aren't available. |

The constructor throws a `BloggerValidationError` if `urlOrId` isn't a valid URL/id, or if `jsonp: true` is used outside a browser.

### `Blogr.connect(urlOrId, options?)`

Static factory that builds the client **and** eagerly resolves/validates the blog by calling `.info()` once, so you find out immediately if the URL/id is wrong instead of on the first real request.

```ts
const blog = await Blogr.connect("https://example.blogspot.com");
```

### `Blogr.fromBlogId(id, options?)`

Same as `new Blogr(id, options)`, but throws early with a clearer error if `id` is blank.

```ts
const blog = Blogr.fromBlogId("1234567890123456789");
```

### `Blogr.fromUrl(url, options?)`

Same as `new Blogr(url, options)` — explicit alternative when you want the "from a URL" intent to be obvious in code.

```ts
const blog = Blogr.fromUrl("https://example.blogspot.com");
```

### `Blogr.fromFeed(feedUrl, options?)`

Builds a client from any Blogger feed URL — either a blog's own feed URL, or the `www.blogger.com/feeds/{id}/...` service form (in which case the numeric id is extracted automatically).

```ts
Blogr.fromFeed("https://example.blogspot.com/feeds/posts/default");
Blogr.fromFeed("https://www.blogger.com/feeds/1234567890123456789/posts/default");
```

## Metadata

### `blog.info(requestOptions?)`

Fetches blog-level metadata: `id`, `title`, `subtitle`, `url`, `labels`, `language`, `updated`, `author`, `favicon`, `links`. Returns a `BlogInfo` object (see [Types reference](#types-reference)).

```ts
const info = await blog.info();
console.log(info.title, info.subtitle, info.labels);
```

### `blog.links(requestOptions?)`

Shorthand for `(await blog.info()).links` — the blog's raw top-level `<link>` entries (`Link[]`).

```ts
const links = await blog.links();
```

### `blog.stats(requestOptions?)`

Cheap aggregate counts for the whole blog — total posts, pages, comments, and labels. Fetches all three summary feeds in parallel (`limit: 0`, so no items are actually downloaded).

```ts
const { posts, pages, comments, labels } = await blog.stats();
```

### `blog.authors(options?, requestOptions?)`

Distinct post authors. Blogger's feed API has no dedicated authors endpoint, so this aggregates unique authors seen across a sample of the most recent posts.

```ts
await blog.authors();                    // default sampleSize: 150
await blog.authors({ sampleSize: 300 }); // scan more posts for better coverage
```

`options.sampleSize` — how many recent posts to scan (default `150`). Returns `Author[]` — see [Limitations](#limitations).

## Posts

### `blog.posts(options?, requestOptions?)`

Lists posts, filtered/paginated/sorted. Returns a [`Pager<Post>`](#pager).

```ts
await blog.posts();

await blog.posts({
  page: 2,                  // 1-based page number
  limit: 10,                // items per page (Blogger's "max-results"), default 25
  orderBy: "published",     // "published" | "updated"
  query: "react",           // full-text search
  label: ["JavaScript"],    // string | string[] — string[] is AND'd together
  publishedMin: "2026-01-01",
  publishedMax: "2026-06-01",
  updatedMin: "2026-01-01",
  updatedMax: "2026-06-01",
  summary: true,            // lightweight projection (no full content)
  startIndex: 21,           // raw 1-based start index, overrides `page`
});
```

| Option         | Type                    | Notes                                              |
| -------------- | ----------------------- | --------------------------------------------------- |
| `page`         | `number`                | 1-based; converted internally to `startIndex` using `limit`. Ignored if `startIndex` is set. |
| `limit`        | `number`                | Default `25`.                                       |
| `startIndex`   | `number`                | Raw 1-based start index; takes precedence over `page`. |
| `orderBy`      | `"published" \| "updated"` | Sort field.                                      |
| `query`        | `string`                | Full-text search (Blogger's `q` param).             |
| `label`        | `string \| string[]`    | `string[]` = AND semantics (entry must carry every label). |
| `publishedMin` / `publishedMax` | `Date \| string` | Filter by publish date range.        |
| `updatedMin` / `updatedMax`     | `Date \| string` | Filter by last-updated date range.    |
| `summary`      | `boolean`               | Lightweight projection — `content` will be `null`.  |

### `blog.post(postId, options?, requestOptions?)`

Fetches a single post by id, or `null` if it doesn't exist.

```ts
const post = await blog.post("1234567890123456789");
await blog.post("1234567890123456789", { summary: true }); // lightweight projection
```

### `blog.latest(options?, requestOptions?)`

Returns the most recent posts (default 5), newest first. Pass a bare `number` as shorthand for `{ limit: number }`, or a full options object to also filter by `label`, `query`, date range, etc. (same shape as `posts()`, minus `orderBy`/`startIndex`, which are fixed internally).

```ts
await blog.latest();                                     // 5 most recent
await blog.latest(12);                                   // just a limit
await blog.latest({ limit: 12, label: "JavaScript" });    // filter by label too
await blog.latest({ label: ["JS", "Web"], publishedMin: "2026-01-01" });
```

### `blog.featured(requestOptions?)`

Best-effort "featured"/pinned post. Blogger's public feed API has no explicit pinned-post flag, so this returns the first post in the blog's default (unfiltered) order — which is the pinned post when one is set, or just the newest post otherwise. See [Limitations](#limitations).

```ts
const post = await blog.featured();
```

### `blog.random(options?, requestOptions?)`

Returns random post(s) (default 1), sampled by picking random indexes across the whole blog. Pass a bare `number` as shorthand for `{ count: number }`, or an options object to also filter by `label`, `query`, date range, etc.

```ts
await blog.random();                                    // 1 random post
await blog.random(3);                                   // 3 random posts
await blog.random({ count: 3, label: "React" });         // random posts within a label
await blog.random({ query: "hooks" });                   // random post matching a search, count defaults to 1
```

Internally this makes one cheap request (`limit: 0`) to learn `totalResults`, then one request per picked index — so `random({ count: 20 })` makes 21 requests total.

## Pager

`posts()`, `pages()`, `comments()`, `label()`, and `search()` all return a `Pager<T>`:

```ts
const pager = await blog.posts({ limit: 10 });

pager.items;         // T[] — items on the current page
pager.itemsPerPage;  // number | null
pager.startIndex;    // number | null — 1-based index of the first item
pager.totalResults;  // number | null
pager.selfUrl;       // string | null — URL of the current page's request
pager.hasNext;       // boolean
pager.hasPrevious;   // boolean

const nextPage = await pager.next();       // Pager<T> | null
const prevPage = await pager.previous();   // Pager<T> | null
```

`next()`/`previous()` each accept an optional `{ signal }` and return `null` when there's no such page.

## Pages

### `blog.pages(options?, requestOptions?)`

Lists the blog's static pages. Returns `Pager<Post>` (pages share the same `Post` shape as blog posts). Accepts `page`, `limit`, `startIndex`, `orderBy`, date-range filters, and `summary` (same as `PostsListOptions`, minus `query`/`label`).

```ts
await blog.pages();
await blog.pages({ limit: 5 });
```

### `blog.page(pageId, options?, requestOptions?)`

Fetches a single page by id, or `null` if it doesn't exist.

```ts
const page = await blog.page("1234567890123456789");
```

## Comments

### `blog.comments(postIdOrOptions?, requestOptions?)`

Lists comments — for the whole blog when called with no argument or an options object, or scoped to a single post when passed a `postId` string directly.

```ts
await blog.comments();                          // whole blog
await blog.comments("1234567890123456789");      // shorthand: scoped to a post
await blog.comments({ postId: "...", limit: 20 }); // equivalent, with extra options
```

`CommentsListOptions` extends the same base list options (`page`, `limit`, `startIndex`, `orderBy`, date ranges, `summary`) plus `postId`.

### `blog.comment(commentId, postId?, requestOptions?)`

Fetches a single comment by id.

```ts
await blog.comment("commentId", "postId"); // single direct request — recommended
await blog.comment("commentId");           // scans the blog-wide comments feed — slower
```

Passing `postId` makes one direct request. Without it, blogr scans the blog-level comments feed in pages (up to 500 comments by default) since Blogger's feed API has no id-only comment lookup — pass `postId` whenever you have it.

## Labels / categories

### `blog.labels(requestOptions?)`

Returns every label currently known to the blog, as `string[]`.

```ts
const labels = await blog.labels();
```

### `blog.label(label, options?, requestOptions?)`

Lists posts carrying `label`. Returns `Pager<Post>`. Accepts the same options as `posts()` minus `label` itself.

```ts
await blog.label("React");
await blog.label("React", { limit: 20, orderBy: "updated" });
```

### `blog.categories(requestOptions?)`

Alias of `blog.labels()` — Blogger uses "labels" and "categories" interchangeably.

```ts
const categories = await blog.categories();
```

## Search

### `blog.search(input, requestOptions?)`

Full-text search across posts. Accepts either a plain query string, or a `SearchOptions` object for extra filtering. Returns `Pager<Post>`.

```ts
await blog.search("react");
await blog.search({ query: "react", label: "JavaScript", limit: 20 });
```

`SearchOptions` — `query` (required), plus `label`, `page`, `limit`, `startIndex`, `orderBy`, date ranges, `summary`.

## Archive

Year/month archive browsing, built on top of `publishedMin`/`publishedMax` range queries against the posts feed (Blogger's public feed API has no dedicated archive endpoint).

### `blog.archive.year(year, options?, requestOptions?)`

Lists posts published in `year`. Returns `Pager<Post>`. `options` accepts `limit`/`page`.

```ts
await blog.archive.year(2026);
await blog.archive.year(2026, { limit: 50 });
```

### `blog.archive.month(year, month, options?, requestOptions?)`

Lists posts published in `month` (1-based, 1 = January) of `year`. Returns `Pager<Post>`.

```ts
await blog.archive.month(2026, 8); // August 2026
```

### `blog.archive.years(requestOptions?)`

Returns every year with at least one post, newest first, as `number[]`. Determined by locating the newest and oldest post rather than a real archive index — see [Limitations](#limitations).

```ts
const years = await blog.archive.years(); // e.g. [2026, 2025, 2024, ...]
```

## Images

### `blog.images(options?, requestOptions?)`

Unique image URLs found across a sample of recent posts (default `sampleSize: 25`). Returns `string[]`.

```ts
await blog.images();
await blog.images({ sampleSize: 100 });
```

## Raw feed URLs (no request made)

`blog.url` builds feed URLs synchronously — nothing is fetched.

```ts
blog.url.posts();                       // -> "https://example.blogspot.com/feeds/posts/default?alt=json&redirect=false"
blog.url.posts({ format: "atom" });
blog.url.post(postId);
blog.url.pages();
blog.url.page(pageId);
blog.url.comments();                    // blog-wide
blog.url.comments(postId);              // scoped to a post
```

Each method accepts `{ format?: "json" | "atom" | "rss" | "jsonp" }` (default `"json"`).

## Feed formats

`blog.feed` fetches the raw feed in any of Blogger's wire formats.

```ts
await blog.feed.json();   // parsed ParsedFeed
await blog.feed.atom();   // raw Atom XML string
await blog.feed.rss();    // raw RSS 2.0 XML string
await blog.feed.jsonp();  // parsed, browser-only — requires `new Blogr(url, { jsonp: true })`
```

All four accept `FeedOptions`: `type` (`"posts" | "pages" | "comments"`, default `"posts"`), plus the usual `limit`, `startIndex`, `orderBy`, date ranges, `summary`.

```ts
await blog.feed.rss({ type: "comments", limit: 50 });
```

## Utilities

### `blog.resolve(url)`

Resolves a possibly-relative URL against the blog's own canonical URL.

```ts
await blog.resolve("/2026/01/hello.html"); // -> "https://example.blogspot.com/2026/01/hello.html"
```

### `blog.parse(raw)`

Parses a raw Blogger GData JSON payload (e.g. from `blog.fetch()`) into a typed `ParsedFeed`.

```ts
const raw = await blog.fetch(someBloggerFeedUrl);
const feed = blog.parse(raw);
```

### `blog.normalize(data)`

Normalizes a single raw feed entry object into a typed `Post`, `Comment`, or `BlogInfo` — or `null` if it doesn't match any known shape.

```ts
const normalized = blog.normalize(rawEntryFromWebhookOrExport);
```

### `blog.htmlToText(input)`

Strips HTML tags and decodes entities, collapsing whitespace into a clean plain-text string. Accepts a `Post` or a raw HTML string.

```ts
blog.htmlToText(post);                    // uses post.content, falling back to post.summary
blog.htmlToText("<p>Hello <b>world</b></p>"); // "Hello world"
```

### `blog.htmlToMarkdown(input)`

Best-effort HTML → Markdown conversion. Handles the common tags Blogger emits: headings, paragraphs, bold/italic, links, images, lists, blockquotes, and inline/block code.

```ts
const markdown = blog.htmlToMarkdown(post);
```

### `blog.extractImages(input)`

Every unique `<img>` source URL found in a post's HTML content, in document order of first appearance. Returns `string[]`.

```ts
const images = blog.extractImages(post);
```

### `blog.extractLinks(input)`

Every `<a href>` found in a post's HTML content, in document order. Returns `{ url, text }[]`.

```ts
const links = blog.extractLinks(post);
// [{ url: "https://...", text: "click here" }, ...]
```

### `blog.extractYouTube(input)`

Every unique YouTube video referenced (as an `<iframe>` embed or a plain link) in a post. Returns `{ id, url }[]`.

```ts
const videos = blog.extractYouTube(post);
// [{ id: "dQw4w9WgXcQ", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }, ...]
```

### `blog.extractEmbeds(input)`

Every non-YouTube `<iframe>` embed (Spotify, Vimeo, Google Maps, forms, etc.) in a post. Returns `{ src, provider }[]`, where `provider` is a best-effort guess derived from the embed's hostname.

```ts
const embeds = blog.extractEmbeds(post);
// [{ src: "https://open.spotify.com/embed/...", provider: "spotify" }, ...]
```

### `blog.thumbnail(input)`

Best available thumbnail for a post — Blogger's own explicit pick if set, otherwise the first image extracted from the content. Returns `string | null`.

```ts
const thumb = blog.thumbnail(post);
```

> All utility methods above (`htmlToText`, `htmlToMarkdown`, `extractImages`, `extractLinks`, `extractYouTube`, `extractEmbeds`, `thumbnail`) accept either a `Post` object *or* a raw HTML string in place of it — useful if you're working with normalized/imported data that isn't a full `Post`.

## Low-level

### `blog.request(endpoint, requestOptions?)`

Performs a request against a feed-relative `endpoint` (or an absolute URL) and returns the parsed feed (`ParsedFeed`) — same parsing `posts()`/`pages()`/etc. use internally, but lets you hit any endpoint directly.

```ts
await blog.request("./posts/default");
await blog.request("./posts/default", { params: { "max-results": 5 } });
```

### `blog.fetch(url, requestOptions?)`

Fetches an arbitrary URL and returns raw parsed JSON, bypassing feed parsing entirely. Useful together with `blog.parse()`/`blog.normalize()` for non-standard payloads.

```ts
const raw = await blog.fetch<{ feed: unknown }>(someUrl);
```

## Cache

An in-memory response cache, keyed by request URL. Disabled by default.

```ts
blog.cache.enable();                   // cache indefinitely
blog.cache.enable({ ttlMs: 60_000 });  // cache for 60s
blog.cache.isEnabled;                  // boolean
blog.cache.clear();                    // drop all cached entries
blog.cache.disable();                  // stop reading/writing the cache (entries kept, but bypassed)
```

`enable()`/`disable()`/`clear()` all return `this` (the `Cache` instance) for chaining.

## Events

`blog.on`/`blog.off` subscribe to lifecycle events fired around every network request blogr makes.

```ts
blog.on("request", ({ url, method }) => {
  console.log(`-> ${method} ${url}`);
});

blog.on("response", ({ url, status, durationMs }) => {
  console.log(`<- ${status} ${url} (${durationMs}ms)`);
});

blog.on("error", ({ url, error }) => {
  console.error(`x ${url}`, error);
});

// Unsubscribe later:
const handler = (payload) => { /* ... */ };
blog.on("request", handler);
blog.off("request", handler);
```

Both `on()` and `off()` return `this` for chaining. Event payloads:

| Event      | Payload                                        |
| ---------- | ----------------------------------------------- |
| `request`  | `{ url: string; method: string }`               |
| `response` | `{ url: string; status: number; durationMs: number }` |
| `error`    | `{ url: string \| null; error: unknown }`       |

## Plugins

### `blog.use(plugin)`

Installs a plugin — either a plain function `(blog) => void`, or a Vue-style object with an `install(blog)` method. Returns `this` for chaining.

```ts
blog.use((blog) => {
  // add your own methods, wire up events, etc.
});

// or Vue-style:
blog.use({ install(blog) { /* ... */ } });
```

### Building your own plugin

A plugin is just a function (or `install` object) that receives the `blog` instance and can hang extra methods off it, listen for lifecycle events, or wrap the cache:

```ts
// random-quote-plugin.ts
import type { Blogr, BloggerPlugin } from "blogr";

export function randomQuotePlugin(): BloggerPlugin {
  return (blog: Blogr) => {
    // Add a method under blog.randomQuote()
    (blog as any).randomQuote = async () => {
      const [post] = await blog.random(1);
      return post ? blog.htmlToText(post).slice(0, 140) : null;
    };

    // Hook into existing lifecycle events
    blog.on("error", ({ url, error }) => {
      console.error(`[random-quote-plugin] request to ${url} failed:`, error);
    });
  };
}
```

```ts
import { Blogr } from "blogr";
import { randomQuotePlugin } from "./random-quote-plugin";

const blog = new Blogr(BLOG_URL);
blog.use(randomQuotePlugin());

const quote = await (blog as any).randomQuote();
```

For proper typing instead of `as any`, augment the `Blogr` class via declaration merging in your plugin's `.d.ts`:

```ts
declare module "blogr" {
  interface Blogr {
    randomQuote(): Promise<string | null>;
  }
}
```

## Errors

Every error blogr throws extends `BloggerError`, so a single `catch` can handle all of them, or you can narrow with `instanceof` for specifics.

```ts
import { BloggerError, BloggerRequestError, BloggerValidationError } from "blogr";

try {
  await blog.post("nonexistent");
} catch (error) {
  if (error instanceof BloggerRequestError) {
    console.error(`Request to ${error.url} failed with status ${error.status}`);
  } else if (error instanceof BloggerValidationError) {
    console.error(`Bad input: ${error.message}`);
  } else if (error instanceof BloggerError) {
    console.error(`Something else went wrong: ${error.message}`);
  }
}
```

- **`BloggerError`** — base class for everything below. `error.name === "BloggerError"`.
- **`BloggerRequestError`** — a network/HTTP request failed or returned a non-2xx status. Adds `error.url: string` and `error.status: number | null` (`null` for network-level failures, e.g. no connectivity).
- **`BloggerValidationError`** — constructor/method arguments were invalid (bad URL, blank id, etc.).

## Standalone exports

Everything below is exported from `"blogr"` alongside the default `Blogr` class, in case you want to use a piece directly without a full client — e.g. for testing, building your own plugin, or working with feed data you fetched some other way.

```ts
import {
  Cache,
  Client,
  EventEmitter,
  ArchiveModule,
  AuthorsModule,
  CommentsModule,
  FeedModule,
  ImagesModule,
  LabelsModule,
  PagesModule,
  PostsModule,
  SearchModule,
  StatsModule,
  UrlModule,
  parseFeed,
  installPlugin,
  extractEmbeds,
  extractImages,
  extractLinks,
  extractYouTube,
  htmlToMarkdown,
  htmlToText,
  thumbnail,
} from "blogr";
```

- **`Cache`** — the in-memory cache class backing `blog.cache` (see [Cache](#cache)). Can be instantiated on its own: `new Cache()`.
- **`Client`** — the low-level request/URL-resolution engine every module is built on (`new Client(urlOrId, options)`). What `blog.request()`/`blog.fetch()` call into.
- **`EventEmitter`** — the minimal, dependency-free typed event emitter backing `blog.on()`/`blog.off()` (see [Events](#events)). Has an extra `once(event, listener)` not exposed on `Blogr` directly.
- **`ArchiveModule`**, **`AuthorsModule`**, **`CommentsModule`**, **`FeedModule`**, **`ImagesModule`**, **`LabelsModule`**, **`PagesModule`**, **`PostsModule`**, **`SearchModule`**, **`StatsModule`**, **`UrlModule`** — the per-concern classes bound onto every `Blogr` instance (`blog.archive`, `blog.feed`, `blog.url`, and the rest are used internally). Constructing one directly requires a `Client` (and, for a few, another module) — mainly useful for tests or advanced composition.
- **`parseFeed(raw)`** — the standalone function behind `blog.parse()`. Turns a raw Blogger GData JSON payload into a typed `ParsedFeed`.
- **`installPlugin(blog, plugin)`** — the standalone function behind `blog.use()`.
- **`extractEmbeds`**, **`extractImages`**, **`extractLinks`**, **`extractYouTube`**, **`htmlToMarkdown`**, **`htmlToText`**, **`thumbnail`** — standalone versions of every `blog.*` HTML utility (see [Utilities](#utilities)), usable without a `Blogr` instance at all:

```ts
import { htmlToText, extractImages } from "blogr";

htmlToText("<p>Hello <b>world</b></p>"); // "Hello world"
extractImages(someRawHtmlString);
```

## Types reference

All of these are exported as TypeScript types only (no runtime value):

| Type | Description |
| ---- | ----------- |
| `ClientOptions` | Constructor options for `Blogr`/`Client` — currently just `{ jsonp?: boolean }`. |
| `BloggerEventMap` / `BloggerEventName` | Event name → payload map for `blog.on()`/`blog.off()`. |
| `FeedFormat` | `"json" \| "atom" \| "rss" \| "jsonp"`. |
| `FeedOptions` | Options for `blog.feed.*()` — `type` plus base list options. |
| `BlogStats` | Shape returned by `blog.stats()` — `{ posts, pages, comments, labels }`. |
| `UrlOptions` | Options for `blog.url.*()` — `{ format?: FeedFormat }`. |
| `ExtractedEmbed` / `ExtractedLink` / `ExtractedYouTube` | Shapes returned by the corresponding `extract*` utilities. |
| `BloggerPlugin` | `(blog: Blogr) => void`, or `{ install(blog: Blogr): void }` — the shape `blog.use()` accepts. |
| `Author` | `{ name, url, image }` — an author of a post, page, comment, or the blog itself. |
| `Link` | `{ rel, href, type, title }` — a raw feed `<link>` entry. |
| `Geo` | `{ box, featureName, point }` — geo-location attached to a post, if any. |
| `Extended` | `{ class, time, removed }` — extra info attached to a comment entry. |
| `PostCommentInfo` | `{ feed, number, title }` — comment metadata attached to a post. |
| `BlogInfo` | Shape returned by `blog.info()` — `id`, `title`, `subtitle`, `url`, `labels`, `language`, `updated`, `author`, `favicon`, `links`. |
| `Post` | A single post or page entry — `id`, `title`, `url`, `published`, `updated`, `labels`, `author`, `content`, `summary`, `thumbnail`, `thumbnailAlt`, `comments`, `geo`, `links`. |
| `Comment` | A single comment entry — `id`, `title`, `url`, `published`, `updated`, `author`, `content`, `summary`, `extended`, `post`, `inReplyTo`, `links`. |
| `ParsedFeed` | The full parsed shape of any raw feed response — `blog`, `posts`, `comments`, `itemsPerPage`, `startIndex`, `totalResults`, `selfUrl`, `previousUrl`, `nextUrl`, `links`. |
| `RequestOptions` | `{ signal?: AbortSignal }` — accepted as the last argument on nearly every method. |
| `BaseListOptions` | Shared fields for posts/pages/comments listing — `page`, `limit`, `startIndex`, `orderBy`, date ranges, `summary`. |
| `PostsListOptions` | `BaseListOptions` + `query` + `label`. |
| `LatestOptions` | `number \| Omit<PostsListOptions, "orderBy" \| "startIndex">` — accepted by `blog.latest()`. |
| `RandomOptions` | `number \| (Omit<PostsListOptions, "limit" \| "startIndex"> & { count?: number })` — accepted by `blog.random()`. |
| `PagesListOptions` | Same as `BaseListOptions` (pages have no `query`/`label`). |
| `CommentsListOptions` | `BaseListOptions` + `postId`. |
| `SearchOptions` | `BaseListOptions` + required `query` + `label`. |
| `Pager<T>` | Pagination wrapper returned by every listing method — see [Pager](#pager). |

## Architecture

Each concern lives in its own small module and is bound together on the
`Blogr` class, so it's easy to extend or replace a piece later:

```
src/
  core/      client, http (json/atom/rss/jsonp transport), cache, events, errors
  parser/    feed-parser (raw GData JSON -> typed objects), html (text/markdown/extraction)
  modules/   posts, pages, comments, labels, search, archive, authors,
             stats, url, feed, images
  plugins/   blog.use() plugin installer
  types/     Post, Comment, BlogInfo, Pager, list options, ...
```

## Limitations

Blogger's public feed API has no dedicated endpoint for a few things this
SDK still exposes for convenience — they're implemented as best-effort
approximations, documented inline in the source:

- **`featured()`** — no "pinned post" flag exists in the feed; this returns
  the first post in the blog's default order.
- **`archive.years()`** — derived from the oldest/newest post rather than a
  real archive index.
- **`authors()` / `images()`** — aggregated from a sample of recent posts
  rather than a dedicated feed.
- **`comment(commentId)` without `postId`** — scans the blog-wide comments
  feed in pages, since comment lookup by id alone isn't supported. Pass
  `postId` when you have it for a single direct request.

## License

MIT