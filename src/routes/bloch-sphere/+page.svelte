<script lang="ts">
	import JourneyShell from '$lib/components/journey-shell.svelte';
	import QubitInteraction from '$lib/components/qubit-interaction.svelte';
	import { buildJourneySteps } from '$lib/content/journey';
	import {
		DEFAULT_QUBIT_COEFFICIENTS,
		buildQubitTerms,
		type QubitCoefficients
	} from '$lib/qubit-state';

	const journeySteps = buildJourneySteps('05', 5);

	let qubitCoefficients = $state<QubitCoefficients>({ ...DEFAULT_QUBIT_COEFFICIENTS });
	const qubitStateTerms = $derived(buildQubitTerms(qubitCoefficients));
</script>

<svelte:head>
	<title>Explain QC | Bloch Sphere</title>
	<meta
		name="description"
		content="Interactive Bloch sphere chapter showing qubit directions as quantum states."
	/>
</svelte:head>

<JourneyShell
	title="Bloch sphere"
	subtitle="Every point inside the sphere is a possible qubit state."
	steps={journeySteps}
>
	<QubitInteraction bind:coefficients={qubitCoefficients} />

	{#snippet formula()}
		<span class="inline-flex items-baseline gap-1.5">
			<span>q =</span>
			{#each qubitStateTerms as term, index}
				{#if index > 0}
					<span>+</span>
				{/if}
				<span>
					{term.coefficient}<span class="font-extrabold text-foreground">{term.basis}</span>
				</span>
			{/each}
		</span>
	{/snippet}

	{#snippet paragraph()}
		The sphere is a map of the qubit's possible states before measurement.
	{/snippet}
</JourneyShell>
