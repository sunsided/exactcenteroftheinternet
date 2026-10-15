<script lang="ts">
	import { site } from '#lib/site.ts';
	import Exact from '#lib/exact/ThankYou.svelte';
	import Approximate from '#lib/approximate/ThankYou.svelte';
</script>

{#if site.id === 'exact'}
	<Exact />
{:else}
	<Approximate />
{/if}
