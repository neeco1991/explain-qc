<script lang="ts">
	import BitInteraction, { type BitValue } from '$lib/components/bit-interaction.svelte';
	import ChapterAdvanceKey from '$lib/components/chapter-advance-key.svelte';
	import JourneyShell from '$lib/components/journey-shell.svelte';
	import { buildJourneySteps } from '$lib/content/journey';

	const TRANSITION_KEY = 'explain-qc.transition-to-qubit';
	const TRANSITION_BIT_KEY = 'explain-qc.transition-bit';

	const EXPLANATION =
		'A classical bit is like a tiny switch inside a computer. It can be in one clear position or the other: 0 or 1.';

	let selectedBit = $state<BitValue | null>(null);
	const journeySteps = $derived(
		buildJourneySteps('02', selectedBit === null ? 2 : 3, selectedBit === null ? null : '03')
	);

	function prepareQubitPage() {
		if (selectedBit === null) return;

		sessionStorage.setItem(TRANSITION_KEY, '1');
		sessionStorage.setItem(TRANSITION_BIT_KEY, String(selectedBit));
	}
</script>

<svelte:head>
	<title>Explain QC | What's a classical bit?</title>
	<meta
		name="description"
		content="A clean chapter that explains a classical bit with a draggable arrow that always resolves to 0 or 1."
	/>
</svelte:head>

<JourneyShell
	title="What's a classical bit?"
	subtitle="Drag the arrow, or press one of the two side keys, to choose 0 or 1."
	steps={journeySteps}
	showAction={selectedBit !== null}
>
	<BitInteraction bind:value={selectedBit} />

	{#snippet formula()}
		b =
		{#if selectedBit === 0}
			<span class="font-extrabold text-foreground">0</span>
		{:else if selectedBit === 1}
			<span class="font-extrabold text-foreground">1</span>
		{:else}
			<span>?</span>
		{/if}
	{/snippet}

	{#snippet paragraph()}
		<p class="text-pretty">{EXPLANATION}</p>
	{/snippet}

	{#snippet action()}
		<ChapterAdvanceKey href="/chapters" beforeNavigate={prepareQubitPage} />
	{/snippet}
</JourneyShell>
