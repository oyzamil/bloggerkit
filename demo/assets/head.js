(() => {
	var m = document.cookie.match(/(?:^|; )theme=([^;]*)/);
	var v = m ? decodeURIComponent(m[1]) : null;
	try {
		try {
			v = JSON.parse(v);
		} catch (e) {
			console.log(`Error: `, e);
		}
		document.documentElement.setAttribute(
			"data-theme",
			v === "light" ? "light" : "dark",
		);
	} catch (e) {}
})();
