<script lang="ts">
	import { tick } from 'svelte';
	import gsap from 'gsap';
	import { ArrowLeft, ArrowRight, Check, RotateCcw } from '@lucide/svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';
	import { Separator } from '$lib/components/ui/separator';
	import type { Chapter } from '$lib/content/chapters';
	import ChapterScene from '$lib/components/chapter-scene.svelte';

	let {
		chapter,
		isCompleted = false,
		nextChapterTitle = null,
		onComplete = (_slug: string) => {},
		onAdvanceChapter = () => {}
	}: {
		chapter: Chapter;
		isCompleted?: boolean;
		nextChapterTitle?: string | null;
		onComplete?: (slug: string) => void;
		onAdvanceChapter?: () => void;
	} = $props();

	let panel: HTMLDivElement | null = $state(null);
	let stepIndex = $state(0);
	let answers = $state<Record<string, string>>({});
	let finished = $state(false);

	const step = $derived(chapter.steps[stepIndex]);
	const selectedChoice = $derived.by(
		() => step?.choices.find((choice) => choice.value === answers[step.id]) ?? null
	);
	const isLastStep = $derived(stepIndex === chapter.steps.length - 1);
	const progressValue = $derived(
		finished
			? 100
			: Math.round(((stepIndex + (selectedChoice ? 1 : 0)) / chapter.steps.length) * 100)
	);

	$effect(() => {
		chapter.slug;
		stepIndex = 0;
		answers = {};
		finished = false;
	});

	$effect(() => {
		chapter.slug;
		stepIndex;
		selectedChoice?.value;

		tick().then(() => {
			if (!panel) return;

			gsap.fromTo(
				panel,
				{ opacity: 0, y: 18 },
				{ opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', overwrite: 'auto' }
			);
		});
	});

	function choose(value: string) {
		if (!step) return;
		answers = { ...answers, [step.id]: value };
		finished = false;
	}

	function goBack() {
		if (stepIndex === 0) return;
		stepIndex -= 1;
		finished = false;
	}

	function goForward() {
		if (!selectedChoice) return;

		if (isLastStep) {
			finished = true;
			onComplete(chapter.slug);
			return;
		}

		stepIndex += 1;
	}

	function replayChapter() {
		stepIndex = 0;
		answers = {};
		finished = false;
	}
</script>

<div class="grid gap-6 xl:grid-cols-[minmax(0,1.02fr)_minmax(24rem,0.98fr)]">
	<Card class="border-white/65 bg-white/72 shadow-[0_30px_80px_rgba(23,37,84,0.08)] backdrop-blur">
		<CardHeader class="gap-4">
			<div class="flex flex-wrap items-center justify-between gap-3">
				<Badge variant="outline">Chapter {chapter.number}</Badge>
				<p class="text-sm text-muted-foreground">{chapter.duration}</p>
			</div>
			<div class="space-y-2">
				<CardTitle class="text-3xl tracking-tight">{chapter.title}</CardTitle>
				<CardDescription class="max-w-2xl text-base leading-7 text-foreground/75">
					{chapter.lead}
				</CardDescription>
			</div>
		</CardHeader>

		<CardContent class="space-y-6">
			<ChapterScene
				chapter={chapter}
				stepIndex={stepIndex}
				selectedSignal={selectedChoice?.signal ?? null}
			/>

			<div class="grid gap-3 md:grid-cols-3">
				{#each chapter.highlights as highlight}
					<div class="rounded-[1.4rem] border border-white/55 bg-background/70 px-4 py-4 text-sm leading-6 text-muted-foreground">
						{highlight}
					</div>
				{/each}
			</div>

			<div class="rounded-[1.5rem] border border-primary/12 bg-primary/8 px-5 py-4">
				<p class="text-sm font-medium text-primary">Build note</p>
				<p class="mt-2 text-sm leading-6 text-foreground/78">{chapter.buildNote}</p>
			</div>
		</CardContent>
	</Card>

	<Card
		bind:ref={panel}
		class="border-white/65 bg-white/82 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur"
	>
		<CardHeader class="gap-4">
			<div class="flex items-start justify-between gap-4">
				<div class="space-y-3">
					<Badge variant="secondary">{step.eyebrow}</Badge>
					<div class="space-y-2">
						<CardTitle class="text-2xl tracking-tight">{step.title}</CardTitle>
						<CardDescription class="text-base leading-7 text-foreground/75">
							{step.body}
						</CardDescription>
					</div>
				</div>
				<Badge variant="outline">
					{stepIndex + 1}/{chapter.steps.length}
				</Badge>
			</div>

			<div class="space-y-2">
				<Progress value={progressValue} class="h-2" />
				<p class="text-xs uppercase tracking-[0.24em] text-muted-foreground">
					Interaction progress
				</p>
			</div>
		</CardHeader>

		<CardContent class="space-y-5">
			<div class="rounded-[1.5rem] border border-border/70 bg-muted/40 px-4 py-4">
				<p class="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Try it</p>
				<p class="mt-2 text-base leading-7 text-foreground/85">{step.prompt}</p>
			</div>

			<div class="grid gap-3">
				{#each step.choices as choice}
					<button
						type="button"
						class={`cursor-pointer rounded-[1.35rem] border px-4 py-4 text-left transition ${
							selectedChoice?.value === choice.value
								? 'border-primary/35 bg-primary/10 shadow-[0_18px_40px_rgba(14,116,144,0.12)]'
								: 'border-border bg-background/75 hover:border-primary/20 hover:bg-primary/4'
						}`}
						onclick={() => choose(choice.value)}
					>
						<div class="flex items-start justify-between gap-4">
							<div>
								<p class="text-sm font-medium text-foreground">{choice.label}</p>
								<p class="mt-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
									{choice.signal}
								</p>
							</div>
							{#if selectedChoice?.value === choice.value}
								<div class="rounded-full bg-primary/12 p-2 text-primary">
									<Check class="size-4" />
								</div>
							{/if}
						</div>
					</button>
				{/each}
			</div>

			{#if selectedChoice}
				<div class="rounded-[1.5rem] border border-primary/20 bg-primary/8 px-4 py-4">
					<p class="text-sm font-semibold text-primary">{selectedChoice.signal}</p>
					<p class="mt-2 text-sm leading-7 text-foreground/82">{selectedChoice.feedback}</p>
					<Separator class="my-4 bg-primary/14" />
					<p class="text-sm leading-7 text-muted-foreground">{step.insight}</p>
				</div>
			{/if}

			{#if finished}
				<div class="rounded-[1.5rem] border border-emerald-500/18 bg-emerald-500/8 px-4 py-4">
					<p class="text-sm font-semibold text-emerald-700">Chapter complete</p>
					<p class="mt-2 text-sm leading-7 text-foreground/82">
						You unlocked the next chapter and kept the current sequence ready for review.
					</p>
				</div>
			{/if}
		</CardContent>

		<CardFooter class="justify-between gap-3 border-t border-border/60 bg-white/55">
			<div class="flex items-center gap-2">
				<Button variant="outline" onclick={goBack} disabled={stepIndex === 0}>
					<ArrowLeft class="size-4" />
					Previous
				</Button>
				<Button variant="ghost" onclick={replayChapter}>
					<RotateCcw class="size-4" />
					Replay
				</Button>
			</div>

			{#if finished}
				{#if nextChapterTitle}
					<Button onclick={onAdvanceChapter}>
						Open {nextChapterTitle}
						<ArrowRight class="size-4" />
					</Button>
				{:else}
					<Button variant="secondary" onclick={replayChapter}>Run it again</Button>
				{/if}
			{:else}
				<Button onclick={goForward} disabled={!selectedChoice}>
					{#if isLastStep}
						Finish chapter
					{:else}
						Next step
					{/if}
					<ArrowRight class="size-4" />
				</Button>
			{/if}
		</CardFooter>
	</Card>
</div>
