(() => {
	const blog = new Blogr(BLOG_URL, API_OPTS);

	function el(id) {
		return document.getElementById(id);
	}

	async function runLabel() {
		const label = el("label-input").value.trim();
		const status = el("label-status");
		const out = el("label-result");
		if (!label) {
			out.innerHTML = emptyBox("Pick a label above, or type one.");
			el("label-pager").innerHTML = "";
			return;
		}
		const options = {};
		const limit = Number(el("label-limit").value);
		if (!Number.isNaN(limit)) options.limit = limit;
		if (el("label-orderby").value) options.orderBy = el("label-orderby").value;

		setStatus(status, "loading", "fetching…");
		try {
			function render(pager) {
				renderPostGrid(out, pager.items);
				renderPagerControls(el("label-pager"), pager, render);
			}
			const pager = await blog.label(label, options);
			setStatus(
				status,
				"ok",
				`GET ./posts/default/-/${encodeURIComponent(label)} · ${pager.totalResults} total`,
			);
			render(pager);
		} catch (err) {
			setStatus(status, "error", "request failed");
			out.innerHTML = errorBox(err);
		}
	}

	(async function loadLabels() {
		const status = el("labels-status");
		const box = el("labels-chips");
		try {
			const labels = await blog.labels();
			setStatus(status, "ok", `${labels.length} label(s)`);
			box.innerHTML = labels
				.map(
					(l) =>
						`<button type="button" class="chip" data-label="${escapeHtml(l)}">${escapeHtml(l)}</button>`,
				)
				.join("");
			box.querySelectorAll(".chip").forEach((chip) =>
				chip.addEventListener("click", () => {
					box
						.querySelectorAll(".chip")
						.forEach((c) => c.classList.remove("is-selected"));
					chip.classList.add("is-selected");
					el("label-input").value = chip.dataset.label;
					runLabel();
				}),
			);
		} catch (err) {
			setStatus(status, "error", "request failed");
			box.innerHTML = errorBox(err);
		}
	})();

	el("label-run").addEventListener("click", runLabel);

	el("categories-run").addEventListener("click", async () => {
		const out = el("categories-result");
		out.innerHTML = `<div class="status-line is-loading"><span class="dot"></span>fetching…</div>`;
		try {
			const categories = await blog.categories();
			out.innerHTML = `<div class="chips">${categories.map((c) => `<span class="chip">${escapeHtml(c)}</span>`).join("")}</div>`;
		} catch (err) {
			out.innerHTML = errorBox(err);
		}
	});
})();
