/* ===========================================================
   blogr demo — shared chrome + helpers
   Loaded on every page after blogr.iife.js and blogr-plugins.
   =========================================================== */

const BLOG_URL = "https://softwebtuts.blogspot.com";
const API_OPTS = {
	jsonp: true,
};

/** Every page in the demo, grouped for the sidebar; "_" prefix (stripped by
 * menuify) marks a top-nav item as nested under the previous group header. */
const NAV = [
	{ group: "Overview", items: [{ href: "index.html", label: "Home" }] },
	{
		group: "Content",
		items: [
			{ href: "posts.html", label: "Posts" },
			{ href: "pages.html", label: "Pages" },
			{ href: "labels.html", label: "Labels & categories" },
			{ href: "authors.html", label: "Authors" },
			{ href: "search.html", label: "Search" },
			{ href: "archive.html", label: "Archive" },
			{ href: "comments.html", label: "Comments" },
		],
	},
	{ group: "Media", items: [{ href: "images.html", label: "Images" }] },
	{
		group: "Feeds",
		items: [{ href: "feed-urls.html", label: "Feed formats & URLs" }],
	},
	{
		group: "Toolkit",
		items: [
			{ href: "utils.html", label: "Utilities" },
			{ href: "advanced.html", label: "Advanced" },
		],
	},
];

function currentPage() {
	const path = location.pathname.split("/").pop() || "index.html";
	return path;
}

function escapeHtml(str) {
	return String(str ?? "").replace(
		/[&<>"']/g,
		(c) =>
			({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
				c
			],
	);
}

function fmtDate(iso) {
	if (!iso) return "—";
	try {
		return new Date(iso).toLocaleDateString(undefined, {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	} catch {
		return iso;
	}
}

/* ---------- theme (persisted with blogr-plugins' cookify) ---------- */

function applyTheme(theme) {
	document.documentElement.setAttribute("data-theme", theme);
}

function initTheme() {
	let saved = null;
	try {
		saved = window.BlogrPlugins?.cookify?.get("theme");
	} catch {
		/* ignore */
	}
	applyTheme(saved === "dark" ? "dark" : saved === "light" ? "light" : "dark");
}

function toggleTheme() {
	const next =
		document.documentElement.getAttribute("data-theme") === "dark"
			? "light"
			: "dark";
	applyTheme(next);
	try {
		window.BlogrPlugins?.cookify?.set("theme", next, { expiresDays: 365 });
	} catch {
		/* ignore */
	}
}

/* ---------- chrome: header, sidebar, footer ---------- */

function navMenuHtml() {
	const parts = [];
	for (const group of NAV) {
		if (group.items.length === 1) {
			const item = group.items[0];
			parts.push(
				`<li><a href="${item.href}">${escapeHtml(group.items.length > 1 ? group.group : item.label)}</a></li>`,
			);
			continue;
		}
		parts.push(`<li><a href="#">${escapeHtml(group.group)}</a></li>`);
		for (const item of group.items) {
			parts.push(
				`<li><a href="${item.href}">_${escapeHtml(item.label)}</a></li>`,
			);
		}
	}
	return parts.join("");
}

function sidebarHtml() {
	const page = currentPage();
	return NAV.map(
		(group) => `
		<div class="sidebar-group">
			<h4>${escapeHtml(group.group)}</h4>
			${group.items
				.map(
					(item) => `
				<a href="${item.href}" class="${item.href === page ? "is-active" : ""}">
					<span class="dot"></span>${escapeHtml(item.label)}
				</a>`,
				)
				.join("")}
		</div>`,
	).join("");
}

function renderChrome() {
	const header = document.getElementById("site-header");
	if (header) {
		header.innerHTML = `
			<div class="site-header__bar">
				<a href="index.html" class="brand">
					<span class="brand__mark">◆</span>blogr
					<span class="brand__tag">softwebtuts.blogspot.com</span>
				</a>
				<ul id="primary-menu">${navMenuHtml()}</ul>
				<div class="header-actions">
					<button class="icon-btn" id="theme-toggle" title="Toggle theme" aria-label="Toggle theme">🌓</button>
					<a class="pill-link" href="https://www.npmjs.com/package/blogr-plugins" target="_blank" rel="noreferrer">blogr-plugins ↗</a>
				</div>
			</div>`;
		document
			.getElementById("theme-toggle")
			?.addEventListener("click", toggleTheme);
	}

	const sidebar = document.getElementById("site-sidebar");
	if (sidebar) {
		sidebar.innerHTML = `<div class="sidebar-inner">${sidebarHtml()}</div>`;
	}

	const footer = document.getElementById("site-footer");
	if (footer) {
		footer.innerHTML = `
			<div class="shell">
				<span>blogr demo — every function, every option, against a real live blog.</span>
				<span>
					<a href="https://www.npmjs.com/package/blogr-plugins" target="_blank" rel="noreferrer">blogr-plugins</a>
					· built with the <code>blogr</code> SDK
				</span>
			</div>`;
	}

	// Wire up blogr-plugins once the chrome exists in the DOM.
	if (window.BlogrPlugins) {
		if (document.getElementById("primary-menu")) {
			window.BlogrPlugins.menuify("#primary-menu");
		}
		if (document.querySelector(".sidebar-inner")) {
			window.BlogrPlugins.stickify(".sidebar-inner", {
				containerSelector: ".layout",
				additionalMarginTop: 24,
				additionalMarginBottom: 24,
			});
		}
	}
}

/* ---------- toasts ---------- */

function toast(message, kind = "info") {
	let stack = document.querySelector(".toast-stack");
	if (!stack) {
		stack = document.createElement("div");
		stack.className = "toast-stack";
		document.body.appendChild(stack);
	}
	const el = document.createElement("div");
	el.className = "toast";
	el.textContent = message;
	if (kind === "error") el.style.background = "var(--danger)";
	stack.appendChild(el);
	setTimeout(() => el.remove(), 3200);
}

/* ---------- status line ---------- */

function setStatus(el, state, text) {
	if (!el) return;
	el.className = `status-line is-${state}`;
	el.innerHTML = `<span class="dot"></span>${escapeHtml(text)}`;
}

/* ---------- minimal code highlighter (no dependency) ---------- */

function highlightCode(code) {
	return escapeHtml(code)
		.replace(/(\/\/.*$)/gm, '<span class="tok-com">$1</span>')
		.replace(
			/(&quot;.*?&quot;|&#39;.*?&#39;)/g,
			'<span class="tok-str">$1</span>',
		)
		.replace(
			/\b(blog|Blogge)\.([a-zA-Z]+)/g,
			'<span class="tok-key">$1</span>.<span class="tok-fn">$2</span>',
		);
}

function codeBlock(code) {
	return `<pre class="code"><code>${highlightCode(code)}</code></pre>`;
}

/* ---------- JSON preview (truncates long HTML/text fields) ---------- */

function truncateStrings(value, max = 160) {
	if (typeof value === "string") {
		return value.length > max ? `${value.slice(0, max)}…` : value;
	}
	if (Array.isArray(value)) return value.map((v) => truncateStrings(v, max));
	if (value && typeof value === "object") {
		const out = {};
		for (const k of Object.keys(value)) out[k] = truncateStrings(value[k], max);
		return out;
	}
	return value;
}

function jsonPreview(value) {
	return codeBlock(JSON.stringify(truncateStrings(value), null, 2));
}

/* ---------- error / empty boxes ---------- */

function errorBox(err) {
	return `<div class="error-box">${escapeHtml(err?.message ?? String(err))}</div>`;
}

function emptyBox(text) {
	return `<div class="empty-box">${escapeHtml(text)}</div>`;
}

/* ---------- post card + pager (shared by posts/pages/search/archive/labels) ---------- */

function postCardInnerHtml(post) {
	const thumb = post.thumbnail || post.thumbnailAlt;
	return `
		<div class="post-card__thumb">
			${thumb ? `<img data-src="${escapeHtml(thumb)}" alt="">` : ""}
		</div>
		<div class="post-card__body">
			<div class="post-card__meta">${fmtDate(post.published)} · ${escapeHtml(post.author?.name || "—")}</div>
			<div class="post-card__title">${escapeHtml(post.title)}</div>
			<div class="post-card__labels">${(post.labels || [])
				.slice(0, 3)
				.map((l) => `<span>${escapeHtml(l)}</span>`)
				.join("")}</div>
			<p>${escapeHtml(post.content)}</P>
		</div>`;
}

function postCardHtml(post) {
	return `<article class="post-card">${postCardInnerHtml(post)}</article>`;
}

function renderPostGrid(container, items) {
	container.innerHTML = items.length
		? `<div class="post-grid">${items.map(postCardHtml).join("")}</div>`
		: emptyBox("No items came back for these options.");
	if (window.BlogrPlugins)
		window.BlogrPlugins.lazify(container.querySelectorAll("img[data-src]"));
}

/** Wires Prev/Next buttons to a Pager<T>, re-rendering via `render(pager)` each time. */
function renderPagerControls(container, pager, render) {
	const info = `Showing ${pager.items.length} item(s)${
		pager.totalResults !== null ? ` of ${pager.totalResults}` : ""
	}${pager.startIndex !== null ? ` — starting at #${pager.startIndex}` : ""}`;

	container.innerHTML = `
		<span>${escapeHtml(info)}</span>
		<button class="btn btn-ghost btn-sm" data-action="prev" ${pager.hasPrevious ? "" : "disabled"}>← Previous</button>
		<button class="btn btn-ghost btn-sm" data-action="next" ${pager.hasNext ? "" : "disabled"}>Next →</button>
	`;

	container
		.querySelector('[data-action="next"]')
		?.addEventListener("click", async () => {
			const next = await pager.next();
			if (next) render(next);
		});
	container
		.querySelector('[data-action="prev"]')
		?.addEventListener("click", async () => {
			const prev = await pager.previous();
			if (prev) render(prev);
		});
}

document.addEventListener("DOMContentLoaded", () => {
	initTheme();
	renderChrome();
});
