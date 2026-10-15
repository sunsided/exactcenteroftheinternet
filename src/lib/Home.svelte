<script lang="ts">
	import { site } from '#lib/site.ts';
	import Exact from '#lib/exact/Home.svelte';
	import Approximate from '#lib/approximate/Home.svelte';
</script>

{#if site.id === 'exact'}
	<Exact />
{:else}
	<Approximate />
{/if}
