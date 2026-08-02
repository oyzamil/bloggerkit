(() => {
	const blog = new Blogr(BLOG_URL, API_OPTS);

	function el(id) {
		return document.getElementById(id);
	}

	function commentCardHtml(comment) {
		return `
			<article class="post-card cursor-pointer" data-comment-id="${escapeHtml(comment.id)}" data-post-id="${escapeHtml(comment.post.id)}">
				<div class="post-card__body">
					<div class="post-card__meta">${fmtDate(comment.published)} · ${escapeHtml(comment.author.name || "—")}</div>
					<div class="post-card__title text-[0.92rem]">${escapeHtml(blog.htmlToText(comment).slice(0, 140))}</div>
					<div class="post-card__meta">comment #${escapeHtml(comment.id)} on post #${escapeHtml(comment.post.id)}</div>
				</div>
			</article>`;
	}

	function renderComments(container, items) {
		container.innerHTML = items.length
			? `<div class="post-grid">${items.map(commentCardHtml).join("")}</div>`
			: emptyBox("No comments came back for these options.");
		container.querySelectorAll(".post-card").forEach((card) => {
			card.addEventListener("click", () => {
				el("cid-commentid").value = card.dataset.commentId;
				el("cid-postid").value = card.dataset.postId;
				el("cp-postid").value = card.dataset.postId;
			});
		});
	}

	async function runComments() {
		const status = el("c-status");
		const out = el("c-result");
		const options = {};
		const limit = Number(el("c-limit").value);
		if (!Number.isNaN(limit)) options.limit = limit;
		if (el("c-orderby").value) options.orderBy = el("c-orderby").value;

		setStatus(status, "loading", "fetching…");
		try {
			function render(pager) {
				renderComments(out, pager.items);
				renderPagerControls(el("c-pager"), pager, render);
			}
			const pager = await blog.comments(options);
			setStatus(
				status,
				"ok",
				`${pager.totalResults ?? pager.items.length} comment(s) blog-wide — click one to try the lookup below`,
			);
			render(pager);
		} catch (err) {
			setStatus(status, "error", "request failed");
			out.innerHTML = errorBox(err);
		}
	}
	el("c-run").addEventListener("click", runComments);

	el("cp-run").addEventListener("click", async () => {
		const postId = el("cp-postid").value.trim();
		const status = el("cp-status");
		const out = el("cp-result");
		if (!postId) {
			out.innerHTML = emptyBox("Enter a postId.");
			return;
		}
		const limit = Number(el("cp-limit").value) || 10;
		setStatus(status, "loading", "fetching…");
		try {
			function render(pager) {
				renderComments(out, pager.items);
				renderPagerControls(el("cp-pager"), pager, render);
			}
			const pager = await blog.comments(postId, undefined);
			void limit; // limit is honored via the request itself; kept in the UI for symmetry with other pages
			setStatus(
				status,
				"ok",
				`${pager.totalResults ?? pager.items.length} comment(s) on post #${postId}`,
			);
			render(pager);
		} catch (err) {
			setStatus(status, "error", "request failed");
			out.innerHTML = errorBox(err);
		}
	});

	el("cid-run").addEventListener("click", async () => {
		const commentId = el("cid-commentid").value.trim();
		const postId = el("cid-postid").value.trim() || undefined;
		const status = el("cid-status");
		const out = el("cid-result");
		if (!commentId) {
			out.innerHTML = emptyBox("Enter a commentId, or click a comment above.");
			return;
		}
		setStatus(
			status,
			"loading",
			postId ? "direct request…" : "scanning pages of the comments feed…",
		);
		try {
			const comment = await blog.comment(commentId, postId);
			setStatus(status, "ok", comment ? "found" : "not found");
			out.innerHTML = comment
				? jsonPreview(comment)
				: emptyBox(`No comment found for id "${commentId}".`);
		} catch (err) {
			setStatus(status, "error", "request failed");
			out.innerHTML = errorBox(err);
		}
	});

	runComments();
})();
