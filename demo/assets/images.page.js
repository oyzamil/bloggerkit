(() => {
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
					<div class="post-card cursor-pointer" data-url="${escapeHtml(u)}" title="Click to load in the playground below">
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
					el("bi-url").value = card.dataset.url;
					buildImage();
					el("bi-url").scrollIntoView({ behavior: "smooth", block: "center" });
				}),
			);
		} catch (err) {
			setStatus(status, "error", "request failed");
			el("img-gallery").innerHTML = errorBox(err);
		}
	}
	el("img-run").addEventListener("click", loadGallery);

	function buildImage() {
		const status = el("bi-status");
		const url = el("bi-url").value.trim();
		if (!url) {
			el("bi-preview").innerHTML = "";
			el("bi-code").innerHTML = "";
			el("bi-supported").textContent = "";
			return;
		}
		const keepExisting = el("bi-existing").checked;
		const lines = [
			`blog.image(${JSON.stringify(url)}, { existing: ${keepExisting} })`,
		];

		try {
			const img = blog.image(url, { existing: keepExisting });

			const w = el("bi-width").value;
			if (w) {
				img.width(Number(w));
				lines.push(`  .width(${Number(w)})`);
			}
			const h = el("bi-height").value;
			if (h) {
				img.height(Number(h));
				lines.push(`  .height(${Number(h)})`);
			}
			const s = el("bi-size").value;
			if (s) {
				img.size(Number(s));
				lines.push(`  .size(${Number(s)})`);
			}
			if (el("bi-nu").checked) {
				img.noUpscaling(true);
				lines.push("  .noUpscaling(true)");
			}
			if (el("bi-crop").checked) {
				img.crop(true);
				lines.push("  .crop(true)");
			}
			if (el("bi-circular").checked) {
				img.circularCrop(true);
				lines.push("  .circularCrop(true)");
			}
			if (el("bi-square").checked) {
				img.squareCrop(true);
				lines.push("  .squareCrop(true)");
			}
			if (el("bi-flip-h").checked) {
				img.flipHorizontally(true);
				lines.push("  .flipHorizontally(true)");
			}
			if (el("bi-flip-v").checked) {
				img.flipVertically(true);
				lines.push("  .flipVertically(true)");
			}
			const rotate = el("bi-rotate").value;
			if (rotate) {
				img.rotate(Number(rotate));
				lines.push(`  .rotate(${rotate})`);
			}
			const br = el("bi-borderradius").value;
			if (br) {
				img.borderRadius(Number(br));
				lines.push(`  .borderRadius(${Number(br)})`);
			}
			const border = el("bi-border").value;
			if (border) {
				img.border(Number(border));
				lines.push(`  .border(${Number(border)})`);
			}
			const color = el("bi-color").value.trim();
			if (color) {
				img.color(color);
				lines.push(`  .color(${JSON.stringify(color)})`);
			}
			const bg = el("bi-bgcolor").value.trim();
			if (bg) {
				img.backgroundColor(bg);
				lines.push(`  .backgroundColor(${JSON.stringify(bg)})`);
			}
			if (el("bi-pad").checked) {
				img.pad(true);
				lines.push("  .pad(true)");
			}
			const padColor = el("bi-padcolor").value.trim();
			if (padColor) {
				img.padColor(padColor);
				lines.push(`  .padColor(${JSON.stringify(padColor)})`);
			}
			const format = el("bi-format").value;
			if (format) {
				img[format](true);
				lines.push(`  .${format}(true)`);
			}
			if (el("bi-download").checked) {
				img.download(true);
				lines.push("  .download(true)");
			}
			const cacheDays = el("bi-cachedays").value;
			if (cacheDays) {
				img.cacheDays(Number(cacheDays));
				lines.push(`  .cacheDays(${Number(cacheDays)})`);
			}

			const finalUrl = img.url();
			lines.push("  .url();");
			el("bi-code").innerHTML = highlightCode(lines.join("\n"));
			el("bi-preview").innerHTML = `<img src="${escapeHtml(finalUrl)}" alt="">`;
			el("bi-supported").textContent = img.isSupported()
				? `✓ recognized host — ${finalUrl}`
				: "✗ unrecognized host — passThrough would return the original url unchanged";
			setStatus(status, "ok", "built");
		} catch (err) {
			setStatus(status, "error", err.message);
			el("bi-preview").innerHTML = errorBox(err);
			el("bi-code").innerHTML = highlightCode(lines.join("\n"));
		}
	}
	el("bi-run").addEventListener("click", buildImage);
	el("bi-reset").addEventListener("click", () => {
		document
			.querySelectorAll(
				"#bi-width,#bi-height,#bi-size,#bi-borderradius,#bi-border,#bi-color,#bi-bgcolor,#bi-padcolor,#bi-cachedays",
			)
			.forEach((i) => (i.value = ""));
		document
			.querySelectorAll("#bi-rotate,#bi-format")
			.forEach((s) => (s.value = ""));
		document
			.querySelectorAll(
				"#bi-nu,#bi-crop,#bi-circular,#bi-square,#bi-flip-h,#bi-flip-v,#bi-pad,#bi-download",
			)
			.forEach((c) => (c.checked = false));
		el("bi-existing").checked = true;
		buildImage();
	});

	el("rz-run").addEventListener("click", () => {
		const status = el("rz-status");
		const url = el("bi-url").value.trim();
		if (!url) {
			el("rz-preview").innerHTML = emptyBox(
				"Pick an image url in the playground above first.",
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
		if (el("rz-grayscale").checked) options.grayscale = true;

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
