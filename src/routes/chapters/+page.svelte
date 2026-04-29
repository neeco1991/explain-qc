<script lang="ts">
	import { browser } from '$app/environment';
	import { ArrowLeft, Atom, Binary, LockKeyhole, Orbit, RefreshCw } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';
	import ChapterPlayer from '$lib/components/chapter-player.svelte';
	import { chapters } from '$lib/content/chapters';

	const STORAGE_KEY = 'explain-qc.chapters.progress.v2';

	type ProgressSnapshot = {
		activeIndex?: number;
		completedSlugs?: string[];
		unlockedCount?: number;
	};

	let activeIndex = $state(0);
	let completedSlugs = $state<string[]>([]);
	let unlockedCount = $state(1);
	let hydrated = $state(!browser);

	const activeChapter = $derived(chapters[activeIndex]);
	const nextChapter = $derived(chapters[activeIndex + 1] ?? null);
	const overallProgress = $derived(Math.round((completedSlugs.length / chapters.length) * 100));
	const allChaptersComplete = $derived(completedSlugs.length === chapters.length);

	onMount(() => {
		if (!browser) return;

		const stored = localStorage.getItem(STORAGE_KEY);

		if (stored) {
			try {
				const parsed = JSON.parse(stored) as ProgressSnapshot;
				const validCompleted = Array.isArray(parsed.completedSlugs)
					? [
							...new Set(
								parsed.completedSlugs.filter((slug) =>
									chapters.some((chapter) => chapter.slug === slug)
								)
							)
						]
					: [];
				const minimumUnlocked = Math.min(chapters.length, validCompleted.length + 1);
				const parsedUnlocked =
					typeof parsed.unlockedCount === 'number' && Number.isFinite(parsed.unlockedCount)
						? parsed.unlockedCount
						: minimumUnlocked;

				completedSlugs = validCompleted;
				unlockedCount = Math.max(
					1,
					Math.min(chapters.length, Math.max(parsedUnlocked, minimumUnlocked))
				);
				activeIndex =
					typeof parsed.activeIndex === 'number' && Number.isFinite(parsed.activeIndex)
						? Math.max(
								0,
								Math.min(Math.min(chapters.length - 1, unlockedCount - 1), parsed.activeIndex)
							)
						: 0;
			} catch {
				resetProgress();
			}
		}

		hydrated = true;
	});

	$effect(() => {
		if (!browser || !hydrated) return;

		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				activeIndex,
				completedSlugs,
				unlockedCount
			} satisfies ProgressSnapshot)
		);
	});

	function setActiveChapter(index: number) {
		if (index >= unlockedCount) return;
		activeIndex = index;
	}

	function handleComplete(slug: string) {
		if (!completedSlugs.includes(slug)) {
			completedSlugs = [...completedSlugs, slug];
		}

		unlockedCount = Math.min(chapters.length, Math.max(unlockedCount, activeIndex + 2));
	}

	function goToNextChapter() {
		if (activeIndex >= chapters.length - 1) return;
		activeIndex += 1;
	}

	function resetProgress() {
		activeIndex = 0;
		completedSlugs = [];
		unlockedCount = 1;
	}
</script>

<svelte:head>
	<title>Explain QC | Chapters</title>
	<meta
		name="description"
		content="Chapter-driven interactive shell for explaining the difference between classical and quantum computing."
	/>
</svelte:head>

<div class="relative isolate overflow-hidden">
	<div class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_36%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.18),transparent_24%)]"></div>

	<div class="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8 lg:py-10">
		<section class="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
			<div class="space-y-6">
				<div class="flex flex-wrap items-center gap-3">
					<Badge variant="outline">Chapter shell</Badge>
					<Badge variant="secondary">Continue after the single-bit intro</Badge>
					<Badge variant="secondary">Threlte + GSAP ready</Badge>
				</div>

				<div class="max-w-4xl space-y-4">
					<h1 class="max-w-4xl text-5xl leading-none font-semibold tracking-tight text-balance sm:text-6xl">
						From one definite bit to the broader quantum story.
					</h1>
					<p class="max-w-3xl text-lg leading-8 text-foreground/74">
						The first page established that a bit must pick one lane. This shell continues
						from there with multi-step chapters, unlockable progression, and room for future
						Bloch-sphere scenes.
					</p>
				</div>

				<div class="flex flex-wrap items-center gap-3">
					<Button href="/">
						<ArrowLeft class="size-4" />
						Back to the bit page
					</Button>
					<Button variant="outline" onclick={resetProgress}>
						<RefreshCw class="size-4" />
						Reset chapter progress
					</Button>
				</div>
			</div>

			<Card class="border-white/65 bg-white/72 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur">
				<CardHeader class="gap-4">
					<div class="flex items-center justify-between gap-3">
						<Badge variant="outline">Journey state</Badge>
						<p class="text-sm text-muted-foreground">{overallProgress}% complete</p>
					</div>
					<div class="space-y-2">
						<CardTitle class="text-2xl tracking-tight">Built for chapter-driven explanations</CardTitle>
						<CardDescription class="text-base leading-7 text-foreground/75">
							The repository now has a distinct first page and a dedicated progression shell
							for the remaining lessons.
						</CardDescription>
					</div>
				</CardHeader>

				<CardContent class="space-y-5">
					<Progress value={overallProgress} class="h-2" />

					<div class="grid gap-3">
						<div class="flex items-start gap-3 rounded-[1.3rem] border border-white/60 bg-background/72 px-4 py-4">
							<div class="rounded-full bg-primary/10 p-2 text-primary">
								<Binary class="size-4" />
							</div>
							<div>
								<p class="font-medium">Classical scaling</p>
								<p class="mt-1 text-sm leading-6 text-muted-foreground">
									Move from a single bit to registers and clear multi-bit patterns.
								</p>
							</div>
						</div>

						<div class="flex items-start gap-3 rounded-[1.3rem] border border-white/60 bg-background/72 px-4 py-4">
							<div class="rounded-full bg-primary/10 p-2 text-primary">
								<Atom class="size-4" />
							</div>
							<div>
								<p class="font-medium">Quantum intuition</p>
								<p class="mt-1 text-sm leading-6 text-muted-foreground">
									Introduce superposition and measurement without collapsing into equations.
								</p>
							</div>
						</div>

						<div class="flex items-start gap-3 rounded-[1.3rem] border border-white/60 bg-background/72 px-4 py-4">
							<div class="rounded-full bg-primary/10 p-2 text-primary">
								<Orbit class="size-4" />
							</div>
							<div>
								<p class="font-medium">Bloch-sphere path</p>
								<p class="mt-1 text-sm leading-6 text-muted-foreground">
									Keep the next visual layer ready with `three`, `Threlte`, and motion.
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</section>

		<section class="grid gap-6 xl:grid-cols-[21rem_minmax(0,1fr)]">
			<aside class="space-y-4">
				<Card class="border-white/65 bg-white/72 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur">
					<CardHeader class="gap-4">
						<div class="flex items-center justify-between gap-3">
							<Badge variant="outline">Chapter map</Badge>
							{#if allChaptersComplete}
								<Badge>All unlocked</Badge>
							{:else}
								<Badge variant="secondary">{unlockedCount}/{chapters.length} open</Badge>
							{/if}
						</div>
						<div class="space-y-2">
							<CardTitle class="text-2xl tracking-tight">Move one chapter at a time</CardTitle>
							<CardDescription class="text-base leading-7 text-foreground/75">
								Only unlocked chapters can be opened. Completion is remembered locally in the
								browser.
							</CardDescription>
						</div>
					</CardHeader>

					<CardContent class="space-y-3">
						{#each chapters as chapter, index}
							{@const unlocked = index < unlockedCount}
							{@const completed = completedSlugs.includes(chapter.slug)}
							<button
								type="button"
								class={`w-full rounded-[1.45rem] border px-4 py-4 text-left transition ${
									index === activeIndex
										? 'border-primary/28 bg-primary/8 shadow-[0_18px_40px_rgba(14,116,144,0.12)]'
										: 'border-white/60 bg-background/72 hover:border-primary/20 hover:bg-primary/4'
								} ${unlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
								onclick={() => setActiveChapter(index)}
								disabled={!unlocked}
							>
								<div class="flex items-start justify-between gap-3">
									<div class="space-y-2">
										<p class="text-xs uppercase tracking-[0.24em] text-muted-foreground">
											Chapter {chapter.number}
										</p>
										<p class="text-base font-medium">{chapter.title}</p>
										<p class="text-sm leading-6 text-muted-foreground">{chapter.summary}</p>
									</div>

									{#if completed}
										<Badge>Done</Badge>
									{:else if unlocked}
										<Badge variant="secondary">Ready</Badge>
									{:else}
										<Badge variant="outline">
											<LockKeyhole class="size-3" />
											Locked
										</Badge>
									{/if}
								</div>
							</button>
						{/each}
					</CardContent>
				</Card>
			</aside>

			<ChapterPlayer
				chapter={activeChapter}
				isCompleted={completedSlugs.includes(activeChapter.slug)}
				nextChapterTitle={nextChapter?.title ?? null}
				onComplete={handleComplete}
				onAdvanceChapter={goToNextChapter}
			/>
		</section>
	</div>
</div>
