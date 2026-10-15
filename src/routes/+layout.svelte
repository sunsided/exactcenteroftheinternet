<script lang="ts">
	import { site, sibling } from '#lib/site.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<title>{site.title}</title>
	<link rel="icon" href="/center.jpg" />
	<link rel="me" href="{sibling.origin}/" />
</svelte:head>

{@render children()}
