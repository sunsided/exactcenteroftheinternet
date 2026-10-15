export type SiteId = 'exact' | 'approximate';

export const SITES = {
	exact: {
		id: 'exact',
		title: 'Exact Center of the Internet',
		origin: 'https://exactcenteroftheinternet.com'
	},
	approximate: {
		id: 'approximate',
		title: 'Approximate Center of the Internet',
		origin: 'https://approximatecenteroftheinternet.com'
	}
} as const;

// Baked in at build time, see vite.config.ts.
export const site = SITES[__SITE__];
