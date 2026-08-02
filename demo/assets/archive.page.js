(() => {
	const blog = new Blogr(BLOG_URL, API_OPTS);

	function el(id) {
		return document.getElementById(id);
	}

	async function runYear(year) {
		const status = el("year-status");
		const out = el("year-result");
		setStatus(status, "loading", "fetching…");
		try {
			function render(pager) {
				renderPostGrid(out, pager.items);
				renderPagerControls(el("year-pager"), pager, render);
			}
			const pager = await blog.archive.year(year, { limit: 6 });
			setStatus(
				status,
				"ok",
				`${pager.totalResults ?? pager.items.length} post(s) in ${year}`,
			);
			render(pager);
		} catch (err) {
			setStatus(status, "error", "request failed");
			out.innerHTML = errorBox(err);
		}
	}

	async function runMonth(year, month) {
		const status = el("month-status");
		const out = el("month-result");
		setStatus(status, "loading", "fetching…");
		try {
			function render(pager) {
				renderPostGrid(out, pager.items);
				renderPagerControls(el("month-pager"), pager, render);
			}
			const pager = await blog.archive.month(year, month, { limit: 6 });
			setStatus(
				status,
				"ok",
				`${pager.totalResults ?? pager.items.length} post(s) in ${year}-${String(month).padStart(2, "0")}`,
			);
			render(pager);
		} catch (err) {
			setStatus(status, "error", "request failed");
			out.innerHTML = errorBox(err);
		}
	}

	(async function loadYears() {
		const status = el("years-status");
		const box = el("years-chips");
		try {
			const years = await blog.archive.years();
			setStatus(
				status,
				"ok",
				years.length ? `${years[years.length - 1]}–${years[0]}` : "no posts",
			);
			box.innerHTML = years.length
				? years
						.map(
							(y) =>
								`<button type="button" class="chip" data-year="${y}">${y}</button>`,
						)
						.join("")
				: emptyBox("No posts on this blog.");
			box.querySelectorAll(".chip").forEach((chip) =>
				chip.addEventListener("click", () => {
					box
						.querySelectorAll(".chip")
						.forEach((c) => c.classList.remove("is-selected"));
					chip.classList.add("is-selected");
					el("year-input").value = chip.dataset.year;
					el("month-year-input").value = chip.dataset.year;
					runYear(Number(chip.dataset.year));
				}),
			);
		} catch (err) {
			setStatus(status, "error", "request failed");
			box.innerHTML = errorBox(err);
		}
	})();

	el("year-run").addEventListener("click", () => {
		const year = Number(el("year-input").value);
		if (year) runYear(year);
	});

	el("month-run").addEventListener("click", () => {
		const year = Number(el("month-year-input").value);
		const month = Number(el("month-input").value);
		if (year) runMonth(year, month);
	});
})();
