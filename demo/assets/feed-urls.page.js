(() => {
	const blog = new Blogr(BLOG_URL, API_OPTS);

	function el(id) {
		return document.getElementById(id);
	}

	function feedOptions() {
		const options = { type: el("feed-type").value };
		const limit = Number(el("feed-limit").value);
		if (!Number.isNaN(limit)) options.limit = limit;
		if (el("feed-summary").checked) options.summary = true;
		return options;
	}

	async function runJson() {
		const status = el("feed-status");
		const out = el("feed-result");
		const options = feedOptions();
		setStatus(status, "loading", "fetching…");
		try {
			const feed = await blog.feed.json(options);
			setStatus(status, "ok", `blog.feed.json(${JSON.stringify(options)})`);
			out.innerHTML = jsonPreview(feed);
		} catch (err) {
			setStatus(status, "error", "request failed");
			out.innerHTML = errorBox(err);
		}
	}

	async function runRaw(format) {
		const status = el("feed-status");
		const out = el("feed-result");
		const options = feedOptions();
		setStatus(status, "loading", `fetching raw ${format}…`);
		try {
			const text = await blog.feed[format](options);
			setStatus(
				status,
				"ok",
				`blog.feed.${format}(${JSON.stringify(options)}) — ${text.length} chars`,
			);
			out.innerHTML = codeBlock(
				text.slice(0, 1400) + (text.length > 1400 ? "\n…" : ""),
			);
		} catch (err) {
			setStatus(
				status,
				"error",
				`raw ${format} fetch failed (often a browser CORS restriction on XML feeds)`,
			);
			const rawUrl =
				options.type === "comments"
					? blog.url.comments(undefined, { format })
					: blog.url[options.type]({ format });
			out.innerHTML =
				errorBox(err) +
				`<p class="mt-2.5 text-[0.85rem]">Try opening the <a href="${rawUrl}" target="_blank" rel="noreferrer">raw feed URL</a> directly instead.</p>`;
		}
	}

	async function runJsonp() {
		const status = el("feed-status");
		const out = el("feed-result");
		const options = feedOptions();
		setStatus(status, "loading", "requesting via <script> injection (JSONP)…");
		try {
			const feed = await blog.feed.jsonp(options);
			setStatus(status, "ok", `blog.feed.jsonp(${JSON.stringify(options)})`);
			out.innerHTML = jsonPreview(feed);
		} catch (err) {
			setStatus(status, "error", "jsonp request failed");
			out.innerHTML = errorBox(err);
		}
	}

	el("feed-json-run").addEventListener("click", runJson);
	el("feed-atom-run").addEventListener("click", () => runRaw("atom"));
	el("feed-rss-run").addEventListener("click", () => runRaw("rss"));
	el("feed-jsonp-run").addEventListener("click", runJsonp);

	function runUrlBuilder() {
		const kind = el("url-kind").value;
		const id = el("url-id").value.trim();
		const format = el("url-format").value;
		let url;
		let code;
		try {
			switch (kind) {
				case "posts":
					url = blog.url.posts({ format });
					code = `blog.url.posts({ format: "${format}" })`;
					break;
				case "pages":
					url = blog.url.pages({ format });
					code = `blog.url.pages({ format: "${format}" })`;
					break;
				case "comments":
					url = blog.url.comments(undefined, { format });
					code = `blog.url.comments(undefined, { format: "${format}" })`;
					break;
				case "post":
					if (!id) throw new Error("postId is required for url.post()");
					url = blog.url.post(id, { format });
					code = `blog.url.post(${JSON.stringify(id)}, { format: "${format}" })`;
					break;
				case "page":
					if (!id) throw new Error("pageId is required for url.page()");
					url = blog.url.page(id, { format });
					code = `blog.url.page(${JSON.stringify(id)}, { format: "${format}" })`;
					break;
				case "comments-scoped":
					if (!id)
						throw new Error("postId is required for this url.comments() form");
					url = blog.url.comments(id, { format });
					code = `blog.url.comments(${JSON.stringify(id)}, { format: "${format}" })`;
					break;
			}
			el("url-code").innerHTML = highlightCode(`${code};\n// -> ${url}`);
			el("url-result").innerHTML =
				`<a href="${url}" target="_blank" rel="noreferrer">${escapeHtml(url)} ↗</a>`;
		} catch (err) {
			el("url-result").innerHTML = errorBox(err);
		}
	}
	el("url-run").addEventListener("click", runUrlBuilder);

	runJson();
	runUrlBuilder();
})();
