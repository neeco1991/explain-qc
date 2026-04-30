<script lang="ts">
	import QubitInteraction from '$lib/components/qubit-interaction.svelte';
	import JourneyShell from '$lib/components/journey-shell.svelte';
	import { buildJourneySteps } from '$lib/content/journey';

	const journeySteps = buildJourneySteps('03', 3);

	let qubitDirection = $state(100);
</script>

<svelte:head>
	<title>Explain QC | Qubit</title>
	<meta
		name="description"
		content="Dedicated third page explaining a qubit with an interactive Bloch sphere."
	/>
</svelte:head>

<JourneyShell
	title="What's a qubit?"
	subtitle="Drag the arrow anywhere inside the sphere to point the qubit in a new direction."
	steps={journeySteps}
>
	<QubitInteraction bind:direction={qubitDirection} />

	{#snippet formula()}
		state direction: <span class="font-extrabold text-foreground">{qubitDirection}%</span>
	{/snippet}

	{#snippet paragraph()}
		Move the arrow around the sphere. Unlike a classical bit, the qubit is not limited to only
		the two side positions before it is measured.
	{/snippet}
</JourneyShell>
