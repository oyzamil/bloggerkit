import type { Blogr } from "../blogger";

/** A plugin function, or an object exposing an `install` function (Vue-style). */
export type BloggerPlugin =
	| ((blog: Blogr) => void)
	| { install: (blog: Blogr) => void };

/** Installs `plugin` onto `blog`. */
export function installPlugin(blog: Blogr, plugin: BloggerPlugin): void {
	if (typeof plugin === "function") {
		plugin(blog);
	} else {
		plugin.install(blog);
	}
}
