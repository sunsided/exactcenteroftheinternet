// Post-process a prerendered site so the build directory mirrors the bucket 1:1.
//
//  - SvelteKit writes the route /thankyou.htm as thankyou.htm.html. The 2008 URLs are
//    /thankyou.htm and /index.htm, and GCS serves object names literally, so rename them.
//  - Pages ship without client-side JS (csr = false), so Svelte's hydration markers are
//    dead weight. Strip them to keep view-source as clean as the original.
//  - With --quirks, drop the doctype. The 2008 pages had none, so browsers render them in
//    quirks mode, where images in table cells sit flush (the dot touches the arrow tip).
import { readdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const [dir, ...flags] = process.argv.slice(2);
if (!dir) throw new Error('usage: node scripts/postbuild.js <build-dir> [--quirks]');
const quirks = flags.includes('--quirks');

const HYDRATION_MARKER = /<!--(?:\[-?\d*|\]|[a-z0-9]{0,8})-->/g;

for (const entry of await readdir(dir, { recursive: true, withFileTypes: true })) {
	if (!entry.isFile() || !/\.html?$/.test(entry.name)) continue;
	let path = join(entry.parentPath, entry.name);

	let html = (await readFile(path, 'utf8')).replace(HYDRATION_MARKER, '');
	if (quirks) html = html.replace(/^<!doctype html>\s*/i, '');
	await writeFile(path, html);

	if (path.endsWith('.htm.html')) {
		const target = path.slice(0, -'.html'.length);
		await rename(path, target);
		path = target;
	}
	console.log(`postbuild: ${path}`);
}

// Nothing references the (empty) client bundle when csr = false.
await rm(join(dir, '_app'), { recursive: true, force: true });
