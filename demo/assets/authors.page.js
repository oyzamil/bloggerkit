(() => {
	const blog = new Blogr(BLOG_URL, API_OPTS);

	function el(id) {
		return document.getElementById(id);
	}

	function renderAuthorGrid(container, authors) {
		if (authors.length === 0) {
			container.innerHTML = emptyBox("No authors found in the sampled posts.");
			return;
		}
		container.innerHTML = authors
			.map(
				(a) => `
					<a class="author-card" href="${escapeHtml(a.url || "#")}" target="_blank" rel="noopener">
						${
							a.image
								? `<img class="author-card__avatar" src="${escapeHtml(a.image)}" alt="" />`
								: `<span class="author-card__avatar author-card__avatar--placeholder"></span>`
						}
						<span class="author-card__name">${escapeHtml(a.name)}</span>
					</a>
				`,
			)
			.join("");
	}

	async function runAuthors() {
		const status = el("authors-status");
		const out = el("authors-result");
		const sampleSize = Number(el("authors-sample-size").value);

		const options = {};
		if (!Number.isNaN(sampleSize) && sampleSize > 0)
			options.sampleSize = sampleSize;

		setStatus(status, "loading", "fetching…");
		try {
			// const raw = await blog.fetch(blog.url.posts({ format: "json" }));
			// console.log(raw.feed.entry[0].author);

			const authors = await blog.authors(options);
			console.log({ authors });
			setStatus(
				status,
				"ok",
				`${authors.length} author(s) · sampled ${options.sampleSize ?? 150} posts`,
			);
			renderAuthorGrid(out, authors);
		} catch (err) {
			setStatus(status, "error", "request failed");
			out.innerHTML = errorBox(err);
		}
	}

	el("authors-run").addEventListener("click", runAuthors);

	runAuthors();
})();
