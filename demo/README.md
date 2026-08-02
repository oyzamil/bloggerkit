# blogr demo site

A static, no-build multi-page site that exercises every function of the
`blogr` SDK against a real live blog — **softwebtuts.blogspot.com** — with
every option exposed as a control. Styling and interactivity lean on
[`blogr-plugins`](https://www.npmjs.com/package/blogr-plugins) (stickify,
menuify, lazify, tocify, replacify, cookify, resizeImage). Both libraries are
vendored locally under `assets/` — nothing is loaded from a CDN.

## Styling: Tailwind CSS

`assets/style.css` is a compiled Tailwind CSS v4 build — the whole design
system (colors, fonts, radii, animations) is now a set of Tailwind theme
tokens in `tailwind/input.css`, and every one of the original hand-written
CSS classes (`.card`, `.status-line`, `.chip`, `.post-card`, …) is now just
`@apply`'d Tailwind utilities. Class names were kept as-is so no HTML or
`*.page.js` template needed to change — they're used both as JS/plugin
selector hooks (e.g. `#primary-menu`, `.sidebar-inner`, `.lazy-ify`) and as
component classes shared across many dynamically-rendered cards. A handful
of one-off inline `style="…"` attributes were replaced with real Tailwind
utility classes directly in the markup (`class="min-w-[180px] px-3 …"` etc.).

Light/dark theming still works exactly as before: `--ink`, `--paper`,
`--accent`, etc. are plain CSS custom properties that flip on
`html[data-theme="dark"]`, and the Tailwind color utilities (`bg-paper`,
`text-ink`, `border-border`, …) are just aliases for those variables — so
no `dark:` variant classes are needed anywhere.

To rebuild the CSS after editing `tailwind/input.css`:

```bash
cd tailwind
npm install
npm run build     # outputs to ../assets/style.css
npm run watch      # rebuild on change while you edit
```

Running the site itself still needs no build step — `assets/style.css` is
committed as a regular static file, same as the vendored SDK below.

## Running it

Just open `index.html` in a browser — no build step, no server required.
Both `blogr` and `blogr-plugins` are plain `<script>` tags (IIFE builds
exposing `window.Blogr` / `window.BlogrPlugins`), so everything works fine
over `file://`. If your browser is picky about `fetch()` from `file://`
(mostly older Safari), serve the folder with anything static instead, e.g.
`npx serve .` or `python3 -m http.server`.

## Pages

| Page | Covers |
| --- | --- |
| `index.html` | `info()`, `stats()`, `links()`, `authors()`, `latest()`, `search()` |
| `posts.html` | `posts()` (every option), `post()`, `latest()`, `featured()`, `random()` |
| `pages.html` | `pages()`, `page()` |
| `labels.html` | `labels()`, `label()`, `categories()` |
| `search.html` | `search(string)`, `search(object)` |
| `archive.html` | `archive.years()`, `archive.year()`, `archive.month()` |
| `comments.html` | `comments()`, `comments(postId)`, `comment(id, postId?)` |
| `images.html` | `images()`, `image()` → `BloggerImage` (every transform option), vs. `resizeImage()` |
| `feed-urls.html` | `feed.json/atom/rss/jsonp()`, `url.*` |
| `utils.html` | `resolve()`, `parse()`, `normalize()`, `htmlToText/Markdown()`, `extract*()`, `thumbnail()` |
| `advanced.html` | `request()`, `fetch()`, `use()`, `on()/off()`, `cache.*`, plus a tour of every `blogr-plugins` helper |

## Rebuilding `assets/blogr.iife.js`

It's a straight copy of the `blogr` package's `dist/blogr.iife.js` (built via
`tsdown`, global name `Blogr`). Rebuild the SDK and re-copy that file if you
change the library.