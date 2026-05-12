<script lang="ts">
  import AsciiMemoryInteraction from '$lib/components/ascii-memory-interaction.svelte';
  import ChapterAdvanceKey from '$lib/components/chapter-advance-key.svelte';
  import JourneyShell from '$lib/components/journey-shell.svelte';
  import { buildJourneySteps } from '$lib/content/journey';

  const EXPLANATION =
    'Classical computers store everything as long sequences of 1s and 0s. To turn those into letters, numbers, colors or sounds, we just agree on a shared dictionary. For text, every group of 8 bits stands for one character.';
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
  subtitle="Tap any number below to see what happens."
  steps={journeySteps}
>
  <AsciiMemoryInteraction />

  <!-- {#snippet formula()}
    8 bits = <span class="font-extrabold text-foreground">1 byte</span>
  {/snippet} -->

  {#snippet paragraph()}
    <p class="text-pretty">{EXPLANATION}</p>
  {/snippet}

  {#snippet action()}
    <ChapterAdvanceKey
      href="/bit"
      ariaLabel="Go to the classical bit chapter"
    />
  {/snippet}
</JourneyShell>
