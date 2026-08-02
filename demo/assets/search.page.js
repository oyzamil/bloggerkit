(() => {
	const blog = new Blogr(BLOG_URL, API_OPTS);

	function el(id) {
		return document.getElementById(id);
	}

	blog.labels().then((labels) => {
		const sel = el("o-label");
		for (const l of labels)
			sel.insertAdjacentHTML(
				"beforeend",
				`<option value="${escapeHtml(l)}">${escapeHtml(l)}</option>`,
			);
	});

	el("string-form").addEventListener("submit", async (e) => {
		e.preventDefault();
		const q = el("string-query").value.trim();
		const status = el("string-status");
		const out = el("string-result");
		if (!q) {
			out.innerHTML = emptyBox("Type a query first.");
			return;
		}
		setStatus(status, "loading", "fetching…");
		try {
			function render(pager) {
				renderPostGrid(out, pager.items);
				renderPagerControls(el("string-pager"), pager, render);
			}
			const pager = await blog.search(q);
			setStatus(
				status,
				"ok",
				`${pager.totalResults ?? pager.items.length} result(s) for "${q}"`,
			);
			render(pager);
		} catch (err) {
			setStatus(status, "error", "request failed");
			out.innerHTML = errorBox(err);
		}
	});

	el("object-form").addEventListener("submit", async (e) => {
		e.preventDefault();
		const query = el("o-query").value.trim();
		const status = el("object-status");
		const out = el("object-result");
		if (!query) {
			out.innerHTML = emptyBox("query is required in object form.");
			return;
		}
		const options = { query };
		if (el("o-label").value) options.label = el("o-label").value;
		const limit = Number(el("o-limit").value);
		if (!Number.isNaN(limit)) options.limit = limit;
		if (el("o-orderby").value) options.orderBy = el("o-orderby").value;
		const page = Number(el("o-page").value);
		if (page > 1) options.page = page;
		if (el("o-summary").checked) options.summary = true;

		el("object-code").innerHTML = highlightCode(
			`await blog.search(${JSON.stringify(options, null, 2)});`,
		);
		setStatus(status, "loading", "fetching…");
		try {
			function render(pager) {
				renderPostGrid(out, pager.items);
				renderPagerControls(el("object-pager"), pager, render);
			}
			const pager = await blog.search(options);
			setStatus(
				status,
				"ok",
				`${pager.totalResults ?? pager.items.length} result(s)`,
			);
			render(pager);
		} catch (err) {
			setStatus(status, "error", "request failed");
			out.innerHTML = errorBox(err);
		}
	});
})();
