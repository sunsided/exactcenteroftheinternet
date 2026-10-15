// The exact site is written in 2008 HTML. Teach svelte-check about the presentational
// attributes and elements it uses (all still rendered by every browser).
import 'svelte/elements';

declare module 'svelte/elements' {
	interface HTMLAttributes<T> {
		align?: 'left' | 'center' | 'right' | 'justify' | null;
		bordercolor?: string | null;
	}

	interface HTMLImgAttributes {
		border?: string | number | null;
	}

	interface HTMLTableAttributes {
		height?: string | number | null;
	}

	interface HTMLTdAttributes {
		nowrap?: boolean | null;
	}

	interface SvelteHTMLElements {
		font: HTMLAttributes<HTMLElement> & {
			face?: string | null;
			size?: string | number | null;
			color?: string | null;
		};
	}
}

export {};
