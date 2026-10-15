<script lang="ts">
	import { site } from '#lib/site.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<title>{site.title}</title>
	<link rel="icon" href="/center.jpg" />
</svelte:head>

{@render children()}
