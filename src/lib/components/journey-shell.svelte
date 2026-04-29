<script lang="ts">
	import type { Snippet } from 'svelte';
	import JourneyProgress from '$lib/components/journey-progress.svelte';
	import type { JourneyStep } from '$lib/content/journey';

	let {
		title,
		description = null,
		steps,
		wide = false,
		children,
		footer
	}: {
		title: string;
		description?: string | null;
		steps: JourneyStep[];
		wide?: boolean;
		children?: Snippet;
		footer?: Snippet;
	} = $props();
</script>

<div
	class={`mx-auto flex min-h-screen w-full flex-col px-6 py-8 sm:px-8 sm:py-10 ${
		wide ? 'max-w-7xl' : 'max-w-5xl'
	}`}
>
	<JourneyProgress {steps} />

	<main class="flex flex-1 flex-col pb-10 text-center">
		<div class="flex flex-1 flex-col items-center justify-center">
			<div class="mt-10 w-full max-w-4xl">
				<h1 class="font-display text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-6xl">
					{title}
				</h1>

				{#if description}
					<p class="mx-auto mt-5 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
						{description}
					</p>
				{/if}
			</div>

			<div class={`mt-10 w-full ${wide ? '' : 'max-w-4xl'}`}>
				{@render children?.()}
			</div>
		</div>

		{#if footer}
			<div class="mx-auto mt-12 min-h-[7rem] max-w-2xl text-base leading-8 text-muted-foreground sm:min-h-[5rem] sm:text-lg">
				{@render footer()}
			</div>
		{/if}
	</main>
</div>
