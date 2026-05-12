<script lang="ts">
  import ChapterAdvanceKey from '$lib/components/chapter-advance-key.svelte';
  import JourneyShell from '$lib/components/journey-shell.svelte';
  import QubitInteraction from '$lib/components/qubit-interaction.svelte';
  import { buildJourneySteps } from '$lib/content/journey';
  import {
    DEFAULT_QUBIT_COEFFICIENTS,
    DEFAULT_QUBIT_VECTOR,
    MEASUREMENT_QUBIT_VECTOR_KEY,
    buildQubitTerms,
    type QubitCoefficients,
    type QubitVector,
  } from '$lib/qubit-state';
  import { fly } from 'svelte/transition';

  const journeySteps = buildJourneySteps('03', 4, '04');
  const EXPLANATION =
    'A qubit is different. Instead of just 0 or 1, it can sit anywhere on the surface of a sphere. The two poles still mean 0 and 1, but every other direction is a mix of both at the same time.';
  const INFINITE_STATES_EXPLANATION =
    "Since there are infinite points on a sphere, a qubit can be in infinitely many different states. It's tempting to think this means we can store infinite information in a single qubit — but before you cancel your Drive subscription, there's a catch:";

  let qubitCoefficients = $state<QubitCoefficients>({
    ...DEFAULT_QUBIT_COEFFICIENTS,
  });
  let qubitVector = $state<QubitVector>({ ...DEFAULT_QUBIT_VECTOR });
  let explanationRevealed = $state(false);

  const qubitStateTerms = $derived(buildQubitTerms(qubitCoefficients));

  function handleAdvance() {
    if (!explanationRevealed) {
      explanationRevealed = true;
      return false;
    }

    sessionStorage.setItem(
      MEASUREMENT_QUBIT_VECTOR_KEY,
      JSON.stringify(qubitVector),
    );
  }
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
  <QubitInteraction
    bind:coefficients={qubitCoefficients}
    bind:vector={qubitVector}
  />

  {#snippet formula()}
    <span class="inline-flex items-baseline gap-1.5">
      <span>q =</span>
      {#each qubitStateTerms as term, index}
        {#if index > 0}
          <span>+</span>
        {/if}
        <span>
          {term.coefficient}<span class="font-extrabold text-foreground"
            >{term.basis}</span
          >
        </span>
      {/each}
    </span>
  {/snippet}

  {#snippet paragraph()}
    <div class="qubit-copy">
      {#key explanationRevealed}
        <p class="text-pretty" transition:fly={{ y: 8, duration: 220 }}>
          {explanationRevealed ? INFINITE_STATES_EXPLANATION : EXPLANATION}
        </p>
      {/key}
    </div>
  {/snippet}

  {#snippet action()}
    <ChapterAdvanceKey
      href="/measurement"
      ariaLabel="Go to the measurement chapter"
      beforeNavigate={handleAdvance}
    />
  {/snippet}
</JourneyShell>

<style>
  .qubit-copy {
    display: grid;
    width: 100%;
    min-height: 100%;
    align-items: center;
  }

  .qubit-copy p {
    grid-area: 1 / 1;
    margin: 0;
  }
</style>
