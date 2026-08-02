(() => {
	const blog = new Blogr(BLOG_URL, API_OPTS);

	function el(id) {
		return document.getElementById(id);
	}

	el("resolve-run").addEventListener("click", async () => {
		const out = el("resolve-result");
		out.innerHTML = `<div class="status-line is-loading"><span class="dot"></span>resolving…</div>`;
		try {
			const resolved = await blog.resolve(el("resolve-input").value.trim());
			out.innerHTML = `<a href="${resolved}" target="_blank" rel="noreferrer">${escapeHtml(resolved)} ↗</a>`;
		} catch (err) {
			out.innerHTML = errorBox(err);
		}
	});

	function runExtraction() {
		const html = el("html-input").value;
		el("out-text").innerHTML = highlightCode(
			blog.htmlToText(html) || "(empty)",
		);
		el("out-markdown").innerHTML = highlightCode(
			blog.htmlToMarkdown(html) || "(empty)",
		);
		el("out-images").innerHTML = jsonPreview(blog.extractImages(html));
		el("out-links").innerHTML = jsonPreview(blog.extractLinks(html));
		el("out-youtube").innerHTML = jsonPreview(blog.extractYouTube(html));
		el("out-embeds").innerHTML = jsonPreview(blog.extractEmbeds(html));
		const thumb = blog.thumbnail(html);
		el("out-thumbnail").innerHTML = thumb
			? `<div class="img-preview min-h-[120px]"><img src="${escapeHtml(thumb)}" alt="" class="max-h-[160px]"></div>`
			: emptyBox("No image found to use as a thumbnail.");
	}
	el("run-all-extract").addEventListener("click", runExtraction);

	el("load-real-post").addEventListener("click", async () => {
		try {
			const [post] = await blog.latest(1);
			if (post) {
				el("html-input").value = post.content || post.summary || "";
				runExtraction();
			}
		} catch (err) {
			toast(`Could not load a post: ${err.message}`, "error");
		}
	});

	el("html-input").value = `<h2>Welcome</h2>
<p>This is a <strong>sample</strong> paragraph with a <a href="https://example.com">link</a>.</p>
<img src="https://example.com/photo.jpg" alt="">
<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>`;
	runExtraction();

	async function loadRawEntry() {
		const out = el("raw-result");
		try {
			const [post] = await blog.latest(1);
			if (!post) return;
			const url = blog.url.post(post.id);
			const raw = await blog.fetch(url);
			el("raw-input").value = JSON.stringify(raw, null, 2);
			out.innerHTML = emptyBox("Loaded — run parse() or normalize() below.");
		} catch (err) {
			out.innerHTML = errorBox(err);
		}
	}
	el("load-raw").addEventListener("click", loadRawEntry);

	el("run-parse").addEventListener("click", () => {
		const out = el("raw-result");
		try {
			const parsed = blog.parse(JSON.parse(el("raw-input").value));
			out.innerHTML = jsonPreview(parsed);
		} catch (err) {
			out.innerHTML = errorBox(err);
		}
	});

	el("run-normalize").addEventListener("click", () => {
		const out = el("raw-result");
		try {
			const raw = JSON.parse(el("raw-input").value);
			const entry = raw.entry ?? raw;
			const normalized = blog.normalize(entry);
			out.innerHTML = normalized
				? jsonPreview(normalized)
				: emptyBox("Could not normalize this entry.");
		} catch (err) {
			out.innerHTML = errorBox(err);
		}
	});

	loadRawEntry();
})();
