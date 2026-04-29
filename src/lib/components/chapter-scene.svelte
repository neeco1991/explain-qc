<script lang="ts">
	import { Binary, Orbit, Sparkles } from '@lucide/svelte';
	import { Badge } from '$lib/components/ui/badge';
	import type { Chapter } from '$lib/content/chapters';

	let {
		chapter,
		stepIndex,
		selectedSignal = null
	}: {
		chapter: Chapter;
		stepIndex: number;
		selectedSignal?: string | null;
	} = $props();

	const activePoint = $derived.by(() => {
		const points = [
			{ left: '50%', top: '18%' },
			{ left: '73%', top: '50%' },
			{ left: '34%', top: '73%' }
		];

		return points[stepIndex % points.length];
	});
</script>

<div class="relative overflow-hidden rounded-[2rem] border border-white/55 bg-white/80 p-6 shadow-[0_30px_80px_rgba(23,37,84,0.08)] backdrop-blur">
	<div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.18),transparent_30%)]"></div>

	{#if chapter.slug === 'classical-registers'}
		<div class="relative space-y-6">
			<div class="flex items-center justify-between">
				<Badge variant="secondary">{chapter.stageLabel}</Badge>
				<Binary class="size-4 text-primary" />
			</div>

			<div class="grid gap-3 sm:grid-cols-2">
				<div
					class={`rounded-[1.5rem] border px-5 py-8 text-center text-5xl font-semibold transition ${
						stepIndex % 2 === 0
							? 'border-primary/30 bg-primary text-primary-foreground shadow-[0_20px_45px_rgba(14,116,144,0.24)]'
							: 'border-border bg-background/70 text-foreground'
					}`}
				>
					0
				</div>
				<div
					class={`rounded-[1.5rem] border px-5 py-8 text-center text-5xl font-semibold transition ${
						stepIndex % 2 === 1
							? 'border-primary/30 bg-primary text-primary-foreground shadow-[0_20px_45px_rgba(14,116,144,0.24)]'
							: 'border-border bg-background/70 text-foreground'
					}`}
				>
					1
				</div>
			</div>

			<div class="grid grid-cols-4 gap-2">
				{#each ['00', '01', '10', '11'] as combo, index}
					<div
						class={`rounded-2xl border px-3 py-4 text-center text-sm font-medium transition ${
							index === stepIndex
								? 'border-accent-foreground/10 bg-accent text-accent-foreground'
								: 'border-border bg-background/65 text-muted-foreground'
						}`}
					>
						{combo}
					</div>
				{/each}
			</div>

			<p class="text-sm leading-6 text-muted-foreground">
				{selectedSignal ?? 'Choose an answer to reveal the mental model behind the scene.'}
			</p>
		</div>
	{:else if chapter.slug === 'qubit-intuition'}
		<div class="relative space-y-6">
			<div class="flex items-center justify-between">
				<Badge variant="secondary">{chapter.stageLabel}</Badge>
				<Sparkles class="size-4 text-primary" />
			</div>

			<div class="relative flex h-64 items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/60 bg-[linear-gradient(135deg,rgba(248,250,252,0.92),rgba(224,242,254,0.82))]">
				<div class="absolute left-12 top-14 size-28 rounded-full bg-sky-300/65 blur-sm"></div>
				<div class="absolute right-12 top-12 size-28 rounded-full bg-amber-200/85 blur-sm"></div>
				<div class="absolute left-1/2 top-1/2 size-[7.5rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20 bg-white/65 shadow-[0_20px_60px_rgba(14,116,144,0.16)]"></div>
				<div class="absolute inset-x-12 bottom-10 space-y-3">
					<div class="h-3 overflow-hidden rounded-full bg-white/65">
						<div
							class={`h-full rounded-full bg-sky-500 transition-all duration-500 ${
								stepIndex === 0 ? 'w-[58%]' : stepIndex === 1 ? 'w-[72%]' : 'w-[46%]'
							}`}
						></div>
					</div>
					<div class="h-3 overflow-hidden rounded-full bg-white/65">
						<div
							class={`h-full rounded-full bg-amber-400 transition-all duration-500 ${
								stepIndex === 0 ? 'w-[42%]' : stepIndex === 1 ? 'w-[28%]' : 'w-[54%]'
							}`}
						></div>
					</div>
				</div>
			</div>

			<p class="text-sm leading-6 text-muted-foreground">
				{selectedSignal ?? 'Here the state is described as a weighted possibility, not a fixed switch.'}
			</p>
		</div>
	{:else}
		<div class="relative space-y-6">
			<div class="flex items-center justify-between">
				<Badge variant="secondary">{chapter.stageLabel}</Badge>
				<Orbit class="size-4 text-primary" />
			</div>

			<div class="relative flex h-64 items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/60 bg-[linear-gradient(160deg,rgba(255,255,255,0.94),rgba(224,242,254,0.78))]">
				<div class="absolute size-[11.5rem] rounded-full border border-primary/18 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7)]"></div>
				<div class="absolute h-px w-48 bg-primary/28"></div>
				<div class="absolute h-48 w-px bg-primary/28"></div>
				<div class="absolute h-40 w-40 rounded-full border border-dashed border-primary/18"></div>
				<div
					class="absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_0_8px_rgba(14,116,144,0.14)] transition-all duration-500"
					style={`left: ${activePoint.left}; top: ${activePoint.top};`}
				></div>
				<div class="absolute inset-x-8 bottom-8 flex items-center justify-between text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
					<span>x</span>
					<span>y</span>
					<span>z</span>
				</div>
			</div>

			<p class="text-sm leading-6 text-muted-foreground">
				{selectedSignal ?? 'The next build phase can swap this placeholder for a real Threlte Bloch sphere.'}
			</p>
		</div>
	{/if}
</div>
