(() => {
	const blog = new Blogr(BLOG_URL, API_OPTS);
	document.getElementById("fetch-url").value = blog.url.posts();

	if (window.BlogrPlugins) {
		window.BlogrPlugins.tocify("#toc", { content: "#article", headings: "h2" });
	}

	function el(id) {
		return document.getElementById(id);
	}

	// ---- low-level ---------------------------------------------------
	el("req-run").addEventListener("click", async () => {
		const out = el("req-result");
		out.innerHTML = `<div class="status-line is-loading"><span class="dot"></span>fetching…</div>`;
		try {
			const feed = await blog.request(el("req-endpoint").value.trim());
			out.innerHTML = jsonPreview(feed);
		} catch (err) {
			out.innerHTML = errorBox(err);
		}
	});

	el("fetch-run").addEventListener("click", async () => {
		const out = el("fetch-result");
		out.innerHTML = `<div class="status-line is-loading"><span class="dot"></span>fetching…</div>`;
		try {
			const raw = await blog.fetch(el("fetch-url").value.trim());
			out.innerHTML = jsonPreview(raw);
		} catch (err) {
			out.innerHTML = errorBox(err);
		}
	});

	// ---- plugin system --------------------------------------------------
	el("plugin-install").addEventListener("click", () => {
		blog.use((b) => {
			b.shout = async () => `${(await b.info()).title.toUpperCase()}!`;
		});
		el("plugin-run").disabled = false;
		el("plugin-result").innerHTML = emptyBox(
			"Installed — blog.shout is now a function. Try calling it.",
		);
	});

	el("plugin-run").addEventListener("click", async () => {
		const out = el("plugin-result");
		try {
			out.innerHTML = jsonPreview({ "blog.shout()": await blog.shout() });
		} catch (err) {
			out.innerHTML = errorBox(err);
		}
	});

	// ---- events -----------------------------------------------------
	let onRequest;
	let onResponse;
	let onError;
	function appendLog(line) {
		const log = el("events-log");
		const text = log.textContent === "(not attached)" ? "" : log.textContent;
		log.textContent = `${text}${line}\n`;
		log.scrollTop = log.scrollHeight;
	}
	el("events-attach").addEventListener("click", () => {
		onRequest = ({ url, method }) => appendLog(`→ request  ${method} ${url}`);
		onResponse = ({ url, status, durationMs }) =>
			appendLog(`← response ${status} in ${durationMs}ms — ${url}`);
		onError = ({ url, error }) =>
			appendLog(`✗ error ${url} — ${error?.message ?? error}`);
		blog
			.on("request", onRequest)
			.on("response", onResponse)
			.on("error", onError);
		el("events-log").textContent = "";
		setStatus(
			el("events-status"),
			"ok",
			"listening for request / response / error",
		);
	});
	el("events-trigger").addEventListener("click", () => {
		blog.posts({ limit: 1 }).catch(() => {});
	});
	el("events-detach").addEventListener("click", () => {
		if (onRequest)
			blog
				.off("request", onRequest)
				.off("response", onResponse)
				.off("error", onError);
		setStatus(el("events-status"), "loading", "detached");
	});

	// ---- cache --------------------------------------------------------
	let requestCount = 0;
	blog.on("request", () => {
		requestCount += 1;
		el("cache-count").textContent = String(requestCount);
	});
	el("cache-enable").addEventListener("click", () => {
		blog.cache.enable({ ttlMs: 30000 });
		setStatus(
			el("cache-status"),
			"ok",
			`cache enabled — requests fired this session: ${requestCount}`,
		);
	});
	el("cache-disable").addEventListener("click", () => {
		blog.cache.disable();
		setStatus(
			el("cache-status"),
			"loading",
			`cache disabled — requests fired this session: ${requestCount}`,
		);
	});
	el("cache-clear").addEventListener("click", () => {
		blog.cache.clear();
		toast("cache cleared");
	});
	el("cache-fetch").addEventListener("click", async () => {
		await blog.posts({ limit: 3 }).catch(() => {});
	});

	// ---- replacify ------------------------------------------------------
	const ORIGINAL_TEXT = el("replacify-target").textContent;
	el("rp-run").addEventListener("click", () => {
		const raw = el("rp-search").value;
		const regexMatch = /^\/(.*)\/([a-z]*)$/.exec(raw);
		const search = regexMatch ? new RegExp(regexMatch[1], regexMatch[2]) : raw;
		const replacement = el("rp-replace").value;
		const options = { allowHtml: el("rp-html").checked };
		try {
			if (el("rp-jquery").checked && window.jQuery) {
				window
					.jQuery("#replacify-target")
					.replacify(search, replacement, options);
			} else {
				window.BlogrPlugins.replacify(
					"#replacify-target",
					search,
					replacement,
					options,
				);
			}
		} catch (err) {
			toast(err.message, "error");
		}
	});
	el("rp-reset").addEventListener("click", () => {
		el("replacify-target").textContent = ORIGINAL_TEXT;
	});

	// ---- cookify --------------------------------------------------------
	el("ck-set").addEventListener("click", () => {
		window.BlogrPlugins.cookify.set(el("ck-key").value, el("ck-value").value, {
			expiresDays: Number(el("ck-days").value) || 30,
		});
		el("ck-out").textContent =
			`set ${el("ck-key").value} = ${JSON.stringify(el("ck-value").value)}`;
	});
	el("ck-get").addEventListener("click", () => {
		el("ck-out").textContent = JSON.stringify(
			window.BlogrPlugins.cookify.get(el("ck-key").value),
		);
	});
	el("ck-getall").addEventListener("click", () => {
		el("ck-out").textContent = JSON.stringify(
			window.BlogrPlugins.cookify.getAll(),
			null,
			2,
		);
	});
	el("ck-remove").addEventListener("click", () => {
		window.BlogrPlugins.cookify.remove(el("ck-key").value);
		el("ck-out").textContent = `removed ${el("ck-key").value}`;
	});
})();
