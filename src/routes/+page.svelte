<script lang="ts">
	import BitInteraction, { type BitValue } from '$lib/components/bit-interaction.svelte';
	import JourneyShell from '$lib/components/journey-shell.svelte';
	import { buildJourneySteps } from '$lib/content/journey';

	const EXPLANATION_BY_STATE = {
		initial:
			'A bit is the smallest unit of classical information. It can only end up as 0 or 1, so when you let go, the arrow snaps to one clear state.',
		0: 'This bit is set to 0. A classical computer can read that exact value directly, because a bit stores one definite state at a time.',
		1: 'This bit is set to 1. It is still one clear state, just the other allowed value. Classical bits do not stay halfway between answers.'
	} as const;

	let selectedBit = $state<BitValue | null>(null);
	const journeySteps = $derived(buildJourneySteps('01', selectedBit === null ? 1 : 2));
	const reservedExplanation = Object.values(EXPLANATION_BY_STATE).reduce((longest, current) =>
		current.length > longest.length ? current : longest
	);

	const explanation = $derived.by(() => {
		if (selectedBit === 0) {
			return EXPLANATION_BY_STATE[0];
		}

		if (selectedBit === 1) {
			return EXPLANATION_BY_STATE[1];
		}

		return EXPLANATION_BY_STATE.initial;
	});
</script>

<svelte:head>
	<title>Explain QC | What's a bit?</title>
	<meta
		name="description"
		content="A clean first chapter that explains a classical bit with a draggable arrow that always resolves to 0 or 1."
	/>
</svelte:head>

<JourneyShell title="What's a bit?" steps={journeySteps}>
	<BitInteraction bind:value={selectedBit} />

	{#snippet footer()}
		<div class="grid text-pretty">
			<p class="invisible col-start-1 row-start-1" aria-hidden="true">{reservedExplanation}</p>
			<p class="col-start-1 row-start-1">{explanation}</p>
		</div>
	{/snippet}
</JourneyShell>
