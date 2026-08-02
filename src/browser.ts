// Entry point for the IIFE (global `Blogr`) build. Unlike `src/index.ts`
// (full ESM/CJS API surface), this only exposes the `Blogr` class itself as
// the default export, so the global script build can do `new Blogr(...)`
// directly instead of `Blogr.default(...)`.
export { Blogr as default } from "./blogger";
