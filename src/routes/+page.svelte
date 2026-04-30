<script lang="ts">
	import AsciiMemoryInteraction from '$lib/components/ascii-memory-interaction.svelte';
	import ChapterAdvanceKey from '$lib/components/chapter-advance-key.svelte';
	import JourneyShell from '$lib/components/journey-shell.svelte';
	import { buildJourneySteps } from '$lib/content/journey';

	const EXPLANATION =
		'Classical computers store text as numbers. ASCII assigns each character a number, and the computer stores that number as an 8-bit byte.';
	const journeySteps = buildJourneySteps('01', 1, '02');
</script>

<svelte:head>
	<title>Explain QC | How computers store information</title>
	<meta
		name="description"
		content="An interactive ASCII chapter showing how classical computers store text as bytes."
	/>
</svelte:head>

<JourneyShell
	title="How computers store information"
	subtitle="Tap any bit to change a byte and watch the character beside it update."
	steps={journeySteps}
>
	<AsciiMemoryInteraction />

	{#snippet formula()}
		8 bits = <span class="font-extrabold text-foreground">1 byte</span>
	{/snippet}

	{#snippet paragraph()}
		<p class="text-pretty">{EXPLANATION}</p>
	{/snippet}

	{#snippet action()}
		<ChapterAdvanceKey href="/bit" ariaLabel="Go to the classical bit chapter" />
	{/snippet}
</JourneyShell>
