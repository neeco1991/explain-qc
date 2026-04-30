<script lang="ts">
	import type { Snippet } from 'svelte';
	import JourneyProgress from '$lib/components/journey-progress.svelte';
	import type { JourneyStep } from '$lib/content/journey';

	let {
		title,
		subtitle,
		steps,
		wide = false,
		showAction = true,
		children,
		formula,
		paragraph,
		action
	}: {
		title: string;
		subtitle: string;
		steps: JourneyStep[];
		wide?: boolean;
		showAction?: boolean;
		children?: Snippet;
		formula?: Snippet;
		paragraph?: Snippet;
		action?: Snippet;
	} = $props();
</script>

<div class={`journey-shell mx-auto ${wide ? 'max-w-7xl' : 'max-w-5xl'}`}>
	<div class="journey-shell__progress">
		<JourneyProgress {steps} />
	</div>

	<main class="journey-shell__main">
		<header class="journey-shell__header">
			<h1
				class="journey-shell__title font-display font-semibold tracking-normal text-balance"
			>
				{title}
			</h1>

			<p class="journey-shell__subtitle text-balance text-muted-foreground">
				{subtitle}
			</p>
		</header>

		<section
			class={`journey-shell__interactive ${wide ? '' : 'max-w-4xl'}`}
			aria-label="Interactive figure"
		>
			{@render children?.()}
		</section>

		<section class="journey-shell__formula" aria-label="Formula">
			{@render formula?.()}
		</section>

		<section class="journey-shell__paragraph" aria-label="Explanation">
			{@render paragraph?.()}
		</section>

		<div class="journey-shell__action" aria-hidden={!(action && showAction)}>
			{#if action && showAction}
				{@render action()}
			{/if}
		</div>
	</main>
</div>

<style>
	.journey-shell {
		display: flex;
		height: 100dvh;
		max-height: 100dvh;
		width: 100%;
		flex-direction: column;
		overflow: hidden;
		padding: 0.75rem 1.25rem 1rem;
	}

	.journey-shell__progress {
		height: 6rem;
		flex: 0 0 6rem;
	}

	.journey-shell__main {
		display: grid;
		min-height: 0;
		flex: 1 1 0;
		grid-template-rows: 8.5rem minmax(0, 1fr) 2.75rem 5.25rem 4rem;
		row-gap: 0.35rem;
		justify-items: center;
		text-align: center;
	}

	.journey-shell__header,
	.journey-shell__interactive,
	.journey-shell__formula,
	.journey-shell__paragraph,
	.journey-shell__action {
		width: 100%;
		min-height: 0;
	}

	.journey-shell__header {
		max-width: 64rem;
	}

	.journey-shell__title {
		display: flex;
		height: 5.5rem;
		align-items: center;
		justify-content: center;
		font-size: 2.25rem;
		line-height: 1.02;
	}

	.journey-shell__subtitle {
		display: flex;
		height: 3rem;
		max-width: 48rem;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
		font-size: 0.875rem;
		line-height: 1.25rem;
	}

	.journey-shell__interactive {
		container-type: size;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: visible;
	}

	.journey-shell__formula {
		display: flex;
		max-width: 48rem;
		align-items: center;
		justify-content: center;
		color: color-mix(in oklab, var(--foreground) 82%, transparent);
		font-size: 1rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		line-height: 1.2;
		overflow: hidden;
	}

	.journey-shell__paragraph {
		display: flex;
		max-width: 42rem;
		align-items: center;
		justify-content: center;
		color: var(--muted-foreground);
		font-size: 0.95rem;
		line-height: 1.35rem;
		overflow: hidden;
	}

	.journey-shell__action {
		display: flex;
		align-items: start;
		justify-content: center;
	}

	@media (min-width: 640px) {
		.journey-shell {
			padding: 2rem;
		}

		.journey-shell__progress {
			height: 6.5rem;
			flex-basis: 6.5rem;
		}

		.journey-shell__main {
			grid-template-rows: 7rem minmax(0, 1fr) 3.25rem 5rem 4.75rem;
			row-gap: 0.65rem;
		}

		.journey-shell__title {
			height: 4.25rem;
			font-size: 3.75rem;
		}

		.journey-shell__subtitle {
			height: 2.75rem;
			font-size: 1rem;
			line-height: 1.5rem;
		}

		.journey-shell__formula {
			font-size: 1.5rem;
		}

		.journey-shell__paragraph {
			font-size: 1.125rem;
			line-height: 1.75rem;
		}
	}
</style>
