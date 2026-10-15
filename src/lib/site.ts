export type SiteId = 'exact' | 'approximate';

export const SITES = {
	exact: {
		id: 'exact',
		title: 'Exact Center of the Internet',
		origin: 'https://exactcenteroftheinternet.com',
		sibling: 'approximate'
	},
	approximate: {
		id: 'approximate',
		title: 'Approximate Center of the Internet',
		origin: 'https://approximatecenteroftheinternet.com',
		sibling: 'exact'
	}
} as const;

// Baked in at build time, see vite.config.ts.
export const site = SITES[__SITE__];

/** The other site; the two link to each other with rel="me". */
export const sibling = SITES[site.sibling];
