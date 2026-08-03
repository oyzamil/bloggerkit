(async () => {
	const blog = new Blogr(BLOG_URL, API_OPTS);

	const EXPLORE = [
		{
			href: "posts.html",
			title: "Posts",
			fns: "posts() · post() · latest() · featured() · random()",
		},
		{ href: "pages.html", title: "Pages", fns: "pages() · page()" },
		{
			href: "labels.html",
			title: "Labels & categories",
			fns: "labels() · label() · categories()",
		},
		{ href: "search.html", title: "Search", fns: "search(string | object)" },
		{
			href: "archive.html",
			title: "Archive",
			fns: "archive.years() · archive.year() · archive.month()",
		},
		{ href: "comments.html", title: "Comments", fns: "comments() · comment()" },
		{
			href: "images.html",
			title: "Images",
			fns: "images()",
		},
		{
			href: "feed-urls.html",
			title: "Feed formats & URLs",
			fns: "feed.json/atom/rss/jsonp · url.*",
		},
		{
			href: "utils.html",
			title: "Utilities",
			fns: "resolve · parse · normalize · html→text/markdown · extract*",
		},
		{
			href: "advanced.html",
			title: "Advanced & plugins",
			fns: "request() · fetch() · use() · on/off · cache · blogr-plugins",
		},
	];

	document.getElementById("explore-grid").innerHTML = EXPLORE.map(
		(e) => `
		<a class="post-card no-underline" href="${e.href}">
			<div class="post-card__body p-4">
				<div class="post-card__title text-[1.05rem]">${e.title}</div>
				<div class="post-card__meta mono mt-1">${e.fns}</div>
			</div>
		</a>`,
	).join("");

	// ---- ticker ---------------------------------------------------------
	try {
		const latest = await blog.latest(12);
		const track = document.getElementById("ticker-track");
		const items = latest
			.map(
				(p) =>
					`<span>${fmtDate(p.published)} — <em>${escapeHtml(p.title)}</em></span>`,
			)
			.join("");
		track.innerHTML = items + items; // doubled for a seamless CSS loop
	} catch (err) {
		document.getElementById("ticker-track").innerHTML =
			`<span>${escapeHtml(err.message)}</span>`;
	}

	// ---- info / stats / links / authors ---------------------------------
	const infoStatus = document.getElementById("info-status");
	try {
		const [info, stats, authors] = await Promise.all([
			blog.info(),
			blog.stats(),
			blog.authors(),
		]);
		setStatus(
			infoStatus,
			"ok",
			`fetched ./posts/summary, ./pages/summary, ./comments/summary`,
		);
		document.getElementById("info-body").innerHTML = `
			<div class="grid-2">
				<dl class="kv">
					<dt>Title</dt><dd>${escapeHtml(info.title)}</dd>
					<dt>Subtitle</dt><dd>${escapeHtml(info.subtitle || "—")}</dd>
					<dt>URL</dt><dd><a href="${info.url}" target="_blank" rel="noreferrer">${escapeHtml(info.url)}</a></dd>
					<dt>Author</dt><dd>${escapeHtml(info.author.name || "—")}</dd>
					<dt>Updated</dt><dd>${fmtDate(info.updated)}</dd>
					<dt>Favicon</dt><dd><a href="${info.favicon}" target="_blank" rel="noreferrer">${escapeHtml(info.favicon || "—")}</a></dd>
					<dt>Authors seen</dt><dd>${authors.map((a) => escapeHtml(a.name || "—")).join(", ")}</dd>
				</dl>
				<div class="stat-row">
					<div class="stat"><div class="num">${stats.posts}</div><div class="label">Posts</div></div>
					<div class="stat"><div class="num">${stats.pages}</div><div class="label">Pages</div></div>
					<div class="stat"><div class="num">${stats.comments}</div><div class="label">Comments</div></div>
					<div class="stat"><div class="num">${stats.labels}</div><div class="label">Labels</div></div>
				</div>
			</div>`;
	} catch (err) {
		setStatus(infoStatus, "error", "request failed");
		document.getElementById("info-body").innerHTML = errorBox(err);
	}

	// ---- latest posts -----------------------------------------------------
	const latestStatus = document.getElementById("latest-status");
	try {
		const posts = await blog.latest(6);
		setStatus(
			latestStatus,
			"ok",
			`GET ./posts/default?max-results=6&orderby=published`,
		);
		renderPostGrid(document.getElementById("latest-body"), posts);
	} catch (err) {
		setStatus(latestStatus, "error", "request failed");
		document.getElementById("latest-body").innerHTML = errorBox(err);
	}

	// ---- quick search -------------------------------------------------
	document
		.getElementById("quick-search-form")
		.addEventListener("submit", async (e) => {
			e.preventDefault();
			const q = document.getElementById("quick-search-input").value.trim();
			const out = document.getElementById("quick-search-body");
			if (!q) {
				out.innerHTML = emptyBox("Type something to search for.");
				return;
			}
			out.innerHTML = `<div class="status-line is-loading"><span class="dot"></span>searching…</div>`;
			try {
				const pager = await blog.search(q, undefined);
				out.innerHTML = `<p class="mb-2.5">${pager.totalResults ?? pager.items.length} result(s) for <strong>${escapeHtml(q)}</strong> — <a href="search.html">open in the full search playground →</a></p>`;
				const grid = document.createElement("div");
				out.appendChild(grid);
				renderPostGrid(grid, pager.items.slice(0, 6));
			} catch (err) {
				out.innerHTML = errorBox(err);
			}
		});
})();
