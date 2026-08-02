(() => {
	const blog = new Blogr(BLOG_URL, API_OPTS);
	const selectedLabels = new Set();

	function el(id) {
		return document.getElementById(id);
	}

	function toISODate(value) {
		if (!value) return undefined;
		return new Date(`${value}T00:00:00.000Z`).toISOString();
	}

	async function loadLabelChips() {
		const box = el("label-chips");
		try {
			const labels = await blog.labels();
			box.innerHTML = labels
				.map(
					(l) =>
						`<button type="button" class="chip" data-label="${escapeHtml(l)}">${escapeHtml(l)}</button>`,
				)
				.join("");
			box.querySelectorAll(".chip").forEach((chip) => {
				chip.addEventListener("click", () => {
					const label = chip.dataset.label;
					if (selectedLabels.has(label)) {
						selectedLabels.delete(label);
						chip.classList.remove("is-selected");
					} else {
						selectedLabels.add(label);
						chip.classList.add("is-selected");
					}
				});
			});
		} catch (err) {
			box.innerHTML = errorBox(err);
		}
	}

	function buildOptions() {
		const options = {};
		const limit = Number(el("f-limit").value);
		if (!Number.isNaN(limit)) options.limit = limit;
		const page = Number(el("f-page").value);
		if (page > 1) options.page = page;
		if (el("f-orderby").value) options.orderBy = el("f-orderby").value;
		if (el("f-summary").checked) options.summary = true;
		if (el("f-query").value.trim()) options.query = el("f-query").value.trim();
		if (selectedLabels.size) options.label = [...selectedLabels];
		const pubMin = toISODate(el("f-published-min").value);
		if (pubMin) options.publishedMin = pubMin;
		const pubMax = toISODate(el("f-published-max").value);
		if (pubMax) options.publishedMax = pubMax;
		const updMin = toISODate(el("f-updated-min").value);
		if (updMin) options.updatedMin = updMin;
		const updMax = toISODate(el("f-updated-max").value);
		if (updMax) options.updatedMax = updMax;
		return options;
	}

	function postCardWithId(post) {
		return `<div class="post-card cursor-pointer" data-post-id="${escapeHtml(post.id)}" title="Click to load in the single-post lookup below">
			${postCardInnerHtml(post)}
		</div>`;
	}

	function renderClickableGrid(container, items) {
		container.innerHTML = items.length
			? `<div class="post-grid">${items.map(postCardWithId).join("")}</div>`
			: emptyBox("No posts matched these options.");
		if (window.BlogrPlugins)
			window.BlogrPlugins.lazify(container.querySelectorAll("img[data-src]"));
		container.querySelectorAll(".post-card").forEach((card) => {
			card.addEventListener("click", () => {
				el("post-id-input").value = card.dataset.postId;
				el("post-id-input").scrollIntoView({
					behavior: "smooth",
					block: "center",
				});
				runPostLookup();
			});
		});
	}

	function renderPage(pager) {
		renderClickableGrid(el("posts-result"), pager.items);
		renderPagerControls(el("posts-pager"), pager, renderPage);
	}

	async function runPosts(options) {
		const status = el("posts-status");
		setStatus(status, "loading", "fetching…");
		el("posts-code").innerHTML = highlightCode(
			`await blog.posts(${JSON.stringify(options, null, 2)});`,
		);
		try {
			const pager = await blog.posts(options);
			setStatus(
				status,
				"ok",
				`${pager.items.length} item(s) · totalResults=${pager.totalResults}`,
			);
			renderPage(pager);
		} catch (err) {
			setStatus(status, "error", "request failed");
			el("posts-result").innerHTML = errorBox(err);
			el("posts-pager").innerHTML = "";
		}
	}

	el("posts-form").addEventListener("submit", (e) => {
		e.preventDefault();
		runPosts(buildOptions());
	});

	el("f-reset").addEventListener("click", () => {
		el("posts-form").reset();
		selectedLabels.clear();
		document
			.querySelectorAll("#label-chips .chip")
			.forEach((c) => c.classList.remove("is-selected"));
	});

	async function runPostLookup() {
		const id = el("post-id-input").value.trim();
		const out = el("post-id-result");
		if (!id) {
			out.innerHTML = emptyBox("Enter a postId, or click a card above.");
			return;
		}
		out.innerHTML = `<div class="status-line is-loading"><span class="dot"></span>fetching…</div>`;
		try {
			const post = await blog.post(id, {
				summary: el("post-id-summary").checked,
			});
			out.innerHTML = post
				? `<h4 class="mb-1">${escapeHtml(post.title)}</h4>
					<p class="text-[0.85rem]">${escapeHtml(blog.htmlToText(post).slice(0, 220))}…</p>
					${jsonPreview(post)}`
				: emptyBox(`No post found for id "${id}".`);
		} catch (err) {
			out.innerHTML = errorBox(err);
		}
	}
	el("post-id-run").addEventListener("click", runPostLookup);

	el("latest-run").addEventListener("click", async () => {
		const out = el("latest-out");
		out.innerHTML = `<div class="status-line is-loading"><span class="dot"></span>fetching…</div>`;
		try {
			const posts = await blog.latest(Number(el("latest-limit").value) || 3);
			renderPostGrid(out, posts);
		} catch (err) {
			out.innerHTML = errorBox(err);
		}
	});

	el("featured-run").addEventListener("click", async () => {
		const out = el("featured-out");
		out.innerHTML = `<div class="status-line is-loading"><span class="dot"></span>fetching…</div>`;
		try {
			const post = await blog.featured();
			out.innerHTML = post ? "" : emptyBox("No posts on this blog.");
			if (post) renderPostGrid(out, [post]);
		} catch (err) {
			out.innerHTML = errorBox(err);
		}
	});

	el("random-run").addEventListener("click", async () => {
		const out = el("random-out");
		out.innerHTML = `<div class="status-line is-loading"><span class="dot"></span>fetching…</div>`;
		try {
			const posts = await blog.random(Number(el("random-count").value) || 2);
			renderPostGrid(out, posts);
		} catch (err) {
			out.innerHTML = errorBox(err);
		}
	});

	loadLabelChips();
	runPosts(buildOptions());

	if (window.BlogrPlugins) {
		window.BlogrPlugins.tocify("#toc", { content: "#article", headings: "h2" });
	}
})();
