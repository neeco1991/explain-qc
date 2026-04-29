<script lang="ts">
	import RegistersInteraction from '$lib/components/registers-interaction.svelte';
	import JourneyShell from '$lib/components/journey-shell.svelte';
	import { buildJourneySteps } from '$lib/content/journey';

	const journeySteps = buildJourneySteps('02', 2);
</script>

<svelte:head>
	<title>Explain QC | Registers</title>
	<meta
		name="description"
		content="Dedicated second page explaining how several bits form a register."
	/>
</svelte:head>

<JourneyShell
	title="from one bit to many bits"
	description="A register is just several bits placed side by side. Each position is still a clean 0 or 1, but together they can represent a much larger set of exact patterns."
	steps={journeySteps}
	wide={true}
>
	<RegistersInteraction />

	{#snippet footer()}
		A classical register does not become fuzzy when it grows. It simply gives the computer more
		room to store one exact binary pattern at a time.
	{/snippet}
</JourneyShell>
