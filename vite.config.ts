import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// One codebase, two sites. Pick with PUBLIC_SITE=exact|approximate (see package.json scripts).
const site = process.env.PUBLIC_SITE ?? 'exact';
if (site !== 'exact' && site !== 'approximate') {
	throw new Error(`PUBLIC_SITE must be "exact" or "approximate", got "${site}"`);
}

export default defineConfig({
	define: {
		__SITE__: JSON.stringify(site)
	},
	plugins: [
		sveltekit({
			compilerOptions: {
				// Emit component styles inline, only for components actually rendered. Keeps the
				// exact site free of stylesheets: the internet uses tables, not CSS.
				css: 'injected',
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter({
				pages: `build/${site}`,
				assets: `build/${site}`,
				strict: true
			})
		})
	]
});
