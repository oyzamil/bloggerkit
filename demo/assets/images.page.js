(async () => {
	const blog = new Blogr(BLOG_URL, API_OPTS);

	function el(id) {
		return document.getElementById(id);
	}

	async function loadGallery() {
		const status = el("img-status");
		setStatus(status, "loading", "scanning recent posts…");
		try {
			const sampleSize = Number(el("img-sample").value) || 15;
			const urls = await blog.images({ sampleSize });
			setStatus(
				status,
				"ok",
				`${urls.length} unique image(s) found across ${sampleSize} post(s)`,
			);
			const gallery = el("img-gallery");
			gallery.innerHTML = urls.length
				? urls
						.map(
							(u) => `
					<div class="post-card" data-url="${escapeHtml(u)}" style="cursor:pointer" title="Click to load in the resizeImage() playground below">
						<div class="post-card__thumb"><img data-src="${escapeHtml(u)}" alt=""></div>
					</div>`,
						)
						.join("")
				: emptyBox(
						"No images found in this sample — try a larger sample size.",
					);
			if (window.BlogrPlugins)
				window.BlogrPlugins.lazify(gallery.querySelectorAll("img[data-src]"));
			gallery.querySelectorAll(".post-card").forEach((card) =>
				card.addEventListener("click", () => {
					el("rz-url").value = card.dataset.url;
					el("rz-url").scrollIntoView({ behavior: "smooth", block: "center" });
				}),
			);
		} catch (err) {
			setStatus(status, "error", "request failed");
			el("img-gallery").innerHTML = errorBox(err);
		}
	}
	el("img-run").addEventListener("click", loadGallery);

	el("rz-run").addEventListener("click", () => {
		const status = el("rz-status");
		const url = el("rz-url").value.trim();
		if (!url) {
			el("rz-preview").innerHTML = emptyBox(
				"Pick an image url from the gallery above, or paste one.",
			);
			return;
		}
		const options = {};
		const width = Number(el("rz-width").value);
		if (width) options.width = width;
		const height = Number(el("rz-height").value);
		if (height) options.height = height;
		if (el("rz-crop").value) options.crop = el("rz-crop").value;
		if (el("rz-format").value) options.format = el("rz-format").value;
		if (el("rz-flip").value) options.flip = el("rz-flip").value;
		const rotate = Number(el("rz-rotate").value);
		if (rotate) options.rotate = rotate;

		el("rz-code").innerHTML = highlightCode(
			`BlogrPlugins.isSupportedImage(url);\nBlogrPlugins.resizeImage(url, ${JSON.stringify(options, null, 2)});`,
		);
		try {
			const supported = window.BlogrPlugins.isSupportedImage(url);
			const out = window.BlogrPlugins.resizeImage(url, options);
			setStatus(
				status,
				supported ? "ok" : "error",
				supported
					? "recognized host"
					: "unrecognized host — returned unchanged",
			);
			el("rz-preview").innerHTML = `<img src="${escapeHtml(out)}" alt="">`;
		} catch (err) {
			setStatus(status, "error", err.message);
			el("rz-preview").innerHTML = errorBox(err);
		}
	});

	loadGallery();
})();
