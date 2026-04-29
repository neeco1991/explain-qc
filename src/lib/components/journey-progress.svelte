<script lang="ts">
	import type { JourneyStep } from '$lib/content/journey';

	let { steps }: { steps: JourneyStep[] } = $props();
</script>

<nav class="mx-auto w-full max-w-4xl" aria-label="Chapter progression">
	<div class="grid grid-cols-[minmax(0,1fr)_minmax(1.5rem,1fr)_minmax(0,1fr)_minmax(1.5rem,1fr)_minmax(0,1fr)_minmax(1.5rem,1fr)_minmax(0,1fr)] items-start">
		{#each steps as step, index}
			<div class="flex min-w-0 flex-col items-center text-center">
				<div
					class={`flex size-10 items-center justify-center rounded-full border text-sm font-medium ${
						step.active
							? 'border-foreground bg-foreground text-background'
							: step.unlocked
								? 'border-primary/35 bg-background text-foreground'
								: 'border-border text-muted-foreground'
					}`}
				>
					{step.number}
				</div>
				<p
					class={`mt-2 max-w-[7rem] text-center text-[0.72rem] uppercase tracking-[0.24em] ${
						step.active || step.unlocked ? 'text-foreground' : 'text-muted-foreground'
					}`}
				>
					{step.label}
				</p>
			</div>

			{#if index < steps.length - 1}
				<div
					class={`mt-5 h-px w-full ${steps[index + 1].unlocked ? 'bg-primary/40' : 'bg-border'}`}
					aria-hidden="true"
				></div>
			{/if}
		{/each}
	</div>
</nav>
