(() => {
	const blog = new Blogr(BLOG_URL, API_OPTS);

	function el(id) {
		return document.getElementById(id);
	}

	function buildOptions() {
		const options = {};
		const limit = Number(el("p-limit").value);
		if (!Number.isNaN(limit)) options.limit = limit;
		const page = Number(el("p-page").value);
		if (page > 1) options.page = page;
		if (el("p-orderby").value) options.orderBy = el("p-orderby").value;
		if (el("p-summary").checked) options.summary = true;
		return options;
	}

	function pageCardWithId(page) {
		return `<div class="post-card cursor-pointer" data-page-id="${escapeHtml(page.id)}" title="Click to load below">
			${postCardInnerHtml(page)}
		</div>`;
	}

	function renderGrid(container, items) {
		container.innerHTML = items.length
			? `<div class="post-grid">${items.map(pageCardWithId).join("")}</div>`
			: emptyBox("No pages matched these options.");
		container.querySelectorAll(".post-card").forEach((card) => {
			card.addEventListener("click", () => {
				el("page-id-input").value = card.dataset.pageId;
				runPageLookup();
			});
		});

		if (BlogrPlugins)
			BlogrPlugins.lazify(container.querySelectorAll("img[data-src]"));
	}

	function renderPage(pager) {
		renderGrid(el("pages-result"), pager.items);
		renderPagerControls(el("pages-pager"), pager, renderPage);
	}

	async function runPages(options) {
		const status = el("pages-status");
		setStatus(status, "loading", "fetching…");
		el("pages-code").innerHTML = highlightCode(
			`await blog.pages(${JSON.stringify(options, null, 2)});`,
		);
		try {
			const pager = await blog.pages(options);
			setStatus(
				status,
				"ok",
				`${pager.items.length} item(s) · totalResults=${pager.totalResults}`,
			);
			renderPage(pager);
		} catch (err) {
			setStatus(status, "error", "request failed");
			el("pages-result").innerHTML = errorBox(err);
		}
	}

	el("pages-form").addEventListener("submit", (e) => {
		e.preventDefault();
		runPages(buildOptions());
	});

	async function runPageLookup() {
		const id = el("page-id-input").value.trim();
		const out = el("page-id-result");
		if (!id) {
			out.innerHTML = emptyBox("Enter a pageId, or click a page above.");
			return;
		}
		out.innerHTML = `<div class="status-line is-loading"><span class="dot"></span>fetching…</div>`;
		try {
			const page = await blog.page(id, {
				summary: el("page-id-summary").checked,
			});
			out.innerHTML = page
				? `<h4 class="mb-1">${escapeHtml(page.title)}</h4>${jsonPreview(page)}`
				: emptyBox(`No page found for id "${id}".`);
		} catch (err) {
			out.innerHTML = errorBox(err);
		}
	}
	el("page-id-run").addEventListener("click", runPageLookup);

	runPages(buildOptions());
})();
