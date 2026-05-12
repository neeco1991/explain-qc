<script lang="ts">
	import { onMount, tick } from 'svelte';
	import type { JourneyStep } from '$lib/content/journey';

	let { steps }: { steps: JourneyStep[] } = $props();

	let viewport: HTMLDivElement | null = $state(null);
	let activeItem: HTMLDivElement | null = $state(null);
	let mounted = $state(false);
	let hasCentered = false;

	const activeNumber = $derived(steps.find((step) => step.active)?.number);

	onMount(() => {
		mounted = true;

		return () => {
			mounted = false;
		};
	});

	$effect(() => {
		activeNumber;
		if (!mounted || !activeItem) return;

		centerActive(hasCentered ? 'smooth' : 'auto');
		hasCentered = true;
	});

	function setActiveItem(node: HTMLDivElement, enabled: boolean) {
		if (enabled) {
			activeItem = node;
		}

		return {
			update(nextEnabled: boolean) {
				if (nextEnabled) {
					activeItem = node;
				} else if (activeItem === node) {
					activeItem = null;
				}
			},
			destroy() {
				if (activeItem === node) {
					activeItem = null;
				}
			}
		};
	}

	async function centerActive(behavior: ScrollBehavior) {
		await tick();
		if (!viewport || !activeItem) return;

		requestAnimationFrame(() => {
			if (!viewport || !activeItem) return;

			const viewportRect = viewport.getBoundingClientRect();
			const activeRect = activeItem.getBoundingClientRect();
			const left =
				viewport.scrollLeft +
				activeRect.left +
				activeRect.width / 2 -
				(viewportRect.left + viewportRect.width / 2);

			viewport.scrollTo({ left, behavior });
		});
	}

	function canNavigate(step: JourneyStep) {
		return Boolean(step.href);
	}

	function keyClass(step: JourneyStep, interactive = false) {
		const base =
			'flex h-14 min-w-14 items-center justify-center rounded-xl border-2 px-4 text-sm font-semibold transition-all';

		if (step.active) {
			return `${base} translate-y-[6px] border-foreground bg-foreground text-background shadow-[inset_0_3px_0_rgba(255,255,255,0.16),inset_0_-5px_0_rgba(0,0,0,0.18),0_2px_0_rgba(120,81,0,0.28)]`;
		}

		if (step.highlighted) {
			return `${base} border-foreground/30 bg-white/84 text-foreground shadow-[inset_0_3px_0_rgba(255,255,255,0.38),inset_0_-8px_0_rgba(120,81,0,0.16),0_8px_0_rgba(120,81,0,0.2),0_16px_28px_rgba(120,81,0,0.12)]`;
		}

		if (step.unlocked) {
			return `${base} border-foreground/24 bg-white/72 text-foreground shadow-[inset_0_3px_0_rgba(255,255,255,0.36),inset_0_-8px_0_rgba(120,81,0,0.14),0_8px_0_rgba(120,81,0,0.18),0_16px_28px_rgba(120,81,0,0.1)] ${
				interactive
					? 'group-hover:-translate-y-1 group-hover:bg-white/88 group-active:translate-y-[4px] group-active:shadow-[inset_0_2px_0_rgba(255,255,255,0.26),inset_0_-5px_0_rgba(120,81,0,0.14),0_3px_0_rgba(120,81,0,0.2)]'
					: ''
			}`;
		}

		return `${base} border-border/80 bg-white/38 text-muted-foreground shadow-[inset_0_3px_0_rgba(255,255,255,0.24),inset_0_-7px_0_rgba(120,81,0,0.08),0_7px_0_rgba(120,81,0,0.08)]`;
	}
</script>

<nav
	class="relative left-1/2 w-dvw max-w-none -translate-x-1/2"
	aria-label="Chapter progression"
>
	<div
		bind:this={viewport}
		class="overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
	>
		<div class="flex min-w-max items-start">
			<div class="shrink-0" style="width: max(0px, calc(50vw - 3rem));" aria-hidden="true"
			></div>

			{#each steps as step, index}
				<div class="flex w-24 shrink-0 flex-col items-center text-center" use:setActiveItem={step.active}>
					{#if canNavigate(step)}
						<a
							href={step.href}
							class="group flex flex-col items-center text-center"
							aria-current={step.active ? 'step' : undefined}
							aria-label={`Go to chapter ${step.number}: ${step.label}`}
						>
							<span class={keyClass(step, true)}>
								{step.number}
							</span>
							<span
								class="mt-3 max-w-24 text-center text-[0.68rem] leading-4 uppercase tracking-[0.16em] text-foreground"
							>
								{step.label}
							</span>
						</a>
					{:else}
						<div
							class="flex flex-col items-center text-center"
							aria-current={step.active ? 'step' : undefined}
							aria-disabled={step.active || step.unlocked ? undefined : 'true'}
						>
							<div class={keyClass(step)}>
								{step.number}
							</div>
							<p
								class={`mt-3 max-w-24 text-center text-[0.68rem] leading-4 uppercase tracking-[0.16em] ${
									step.active || step.unlocked || step.highlighted
										? 'text-foreground'
										: 'text-muted-foreground'
								}`}
							>
								{step.label}
							</p>
						</div>
					{/if}
				</div>

				{#if index < steps.length - 1}
					<div
						class={`mt-7 h-0.5 w-9 shrink-0 rounded-full ${
							steps[index + 1].unlocked || steps[index + 1].highlighted
								? 'bg-foreground/26'
								: 'bg-border/85'
						}`}
						aria-hidden="true"
					></div>
				{/if}
			{/each}

			<div class="shrink-0" style="width: max(0px, calc(50vw - 3rem));" aria-hidden="true"
			></div>
		</div>
	</div>
</nav>
