<script lang="ts">
  import { Eye } from '@lucide/svelte';
  import { onDestroy, onMount } from 'svelte';
  import JourneyShell from '$lib/components/journey-shell.svelte';
  import QubitInteraction from '$lib/components/qubit-interaction.svelte';
  import { buildJourneySteps } from '$lib/content/journey';
  import {
    DEFAULT_QUBIT_COEFFICIENTS,
    DEFAULT_QUBIT_VECTOR,
    MEASUREMENT_QUBIT_VECTOR_KEY,
    buildQubitTerms,
    chooseMeasurementOutcome,
    parseStoredQubitVector,
    type QubitBasisState,
    type QubitCoefficients,
    type QubitVector,
  } from '$lib/qubit-state';

  const journeySteps = buildJourneySteps('04', 4);
  const OBSERVER_DURATION = 1700;

  let qubitCoefficients = $state<QubitCoefficients>({
    ...DEFAULT_QUBIT_COEFFICIENTS,
  });
  let qubitVector = $state<QubitVector>({ ...DEFAULT_QUBIT_VECTOR });
  let collapseTarget = $state<QubitBasisState | null>(null);
  let measuredBit = $state<QubitBasisState | null>(null);
  let measuring = $state(false);
  let observerVisible = $state(false);
  let observerRun = $state(0);
  let timers: ReturnType<typeof setTimeout>[] = [];

  const qubitStateTerms = $derived(buildQubitTerms(qubitCoefficients));

  onMount(() => {
    const storedVector = sessionStorage.getItem(MEASUREMENT_QUBIT_VECTOR_KEY);

    if (!storedVector) return;

    const parsedVector = parseStoredQubitVector(storedVector);

    if (parsedVector) {
      qubitVector = parsedVector;
    }

    sessionStorage.removeItem(MEASUREMENT_QUBIT_VECTOR_KEY);
  });

  onDestroy(() => {
    for (const timer of timers) {
      clearTimeout(timer);
    }
  });

  function lookAtIt() {
    if (measuring) return;

    const outcome = chooseMeasurementOutcome(qubitCoefficients);

    measuring = true;
    measuredBit = null;
    collapseTarget = null;
    observerVisible = false;
    observerRun += 1;

    requestAnimationFrame(() => {
      observerVisible = true;
      measuredBit = outcome;
      collapseTarget = outcome;
      schedule(() => {
        measuring = false;
      }, OBSERVER_DURATION);
    });
  }

  function schedule(callback: () => void, delay: number) {
    timers.push(setTimeout(callback, delay));
  }
</script>

<svelte:head>
  <title>Explain QC | Measurement</title>
  <meta
    name="description"
    content="Interactive measurement chapter showing a qubit collapse to 0 or 1 with the matching probability."
  />
</svelte:head>

<JourneyShell
  title="Measurement"
  subtitle="Drag the qubit, then look at it."
  steps={journeySteps}
>
  <QubitInteraction
    bind:coefficients={qubitCoefficients}
    bind:vector={qubitVector}
    {collapseTarget}
    readonly={measuring}
  />

  {#snippet control()}
    <button
      type="button"
      class="measure-button"
      onclick={lookAtIt}
      disabled={measuring}
      aria-label="Look at the qubit and measure it"
    >
      <Eye class="size-5" stroke-width={2.2} />
      <span>Look at it</span>
    </button>
  {/snippet}

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
    The catch is that you can't actually see where the qubit points. The moment
    you look at it, it snaps to one of the two poles — 0 or 1 — and the rest of
    the sphere is gone. Try it a few times: same starting point, different
    outcomes.
  {/snippet}
</JourneyShell>

{#key observerRun}
  {#if observerVisible}
    <div class="measurement-observer" aria-hidden="true">
      <div class="measurement-observer__face">
        <span class="measurement-observer__eye measurement-observer__eye--left"
        ></span>
        <span class="measurement-observer__eye measurement-observer__eye--right"
        ></span>
        <span class="measurement-observer__mouth"></span>
      </div>
    </div>
  {/if}
{/key}

<span class="sr-only" aria-live="polite">
  {measuredBit === null ? '' : `The qubit measured ${measuredBit}.`}
</span>

<style>
  .measure-button {
    display: inline-flex;
    height: 2.75rem;
    min-width: 9rem;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border-radius: 0.75rem;
    border: 2px solid color-mix(in oklab, var(--foreground) 24%, transparent);
    background: color-mix(in oklab, white 78%, transparent);
    padding: 0 1.25rem;
    color: var(--foreground);
    font-weight: 700;
    text-transform: lowercase;
    box-shadow:
      inset 0 3px 0 rgb(255 255 255 / 0.36),
      inset 0 -8px 0 rgb(120 81 0 / 0.14),
      0 8px 0 rgb(120 81 0 / 0.18),
      0 18px 42px rgb(120 81 0 / 0.14);
    transition:
      transform 150ms ease,
      background 150ms ease,
      box-shadow 150ms ease,
      opacity 150ms ease;
  }

  .measure-button:hover {
    transform: translateY(-0.25rem);
    background: color-mix(in oklab, white 90%, transparent);
  }

  .measure-button:active,
  .measure-button:disabled {
    transform: translateY(4px);
    background: color-mix(in oklab, white 86%, transparent);
    box-shadow:
      inset 0 2px 0 rgb(255 255 255 / 0.26),
      inset 0 -5px 0 rgb(120 81 0 / 0.14),
      0 3px 0 rgb(120 81 0 / 0.2);
  }

  .measure-button:disabled {
    cursor: default;
    opacity: 0.72;
  }

  .measurement-observer {
    position: fixed;
    top: 34%;
    right: 0;
    z-index: 50;
    pointer-events: none;
    animation: observer-peek 1700ms cubic-bezier(0.2, 0.8, 0.18, 1) forwards;
  }

  .measurement-observer__face {
    position: relative;
    width: clamp(5.5rem, 14vw, 8rem);
    aspect-ratio: 1;
    border: 3px solid var(--foreground);
    border-radius: 999px;
    background: color-mix(in oklab, white 92%, var(--background));
    box-shadow:
      inset 0 6px 0 rgb(255 255 255 / 0.5),
      0 14px 32px rgb(120 81 0 / 0.2);
  }

  .measurement-observer__eye {
    position: absolute;
    top: 27%;
    width: 29%;
    aspect-ratio: 1;
    border: 3px solid var(--foreground);
    border-radius: 999px;
    background: var(--background);
  }

  .measurement-observer__eye::after {
    position: absolute;
    top: 46%;
    left: 14%;
    width: 43%;
    aspect-ratio: 1;
    border-radius: 999px;
    background: var(--foreground);
    content: '';
  }

  .measurement-observer__eye--left {
    left: 17%;
  }

  .measurement-observer__eye--right {
    right: 17%;
  }

  .measurement-observer__mouth {
    position: absolute;
    bottom: 21%;
    left: 39%;
    width: 22%;
    height: 3%;
    border-radius: 999px;
    background: var(--foreground);
  }

  @keyframes observer-peek {
    0% {
      opacity: 0;
      transform: translate(120%, -50%) scale(0.94);
    }

    24%,
    72% {
      opacity: 1;
      transform: translate(-1.25rem, -50%) scale(1);
    }

    100% {
      opacity: 0;
      transform: translate(120%, -50%) scale(0.94);
    }
  }

  @media (min-width: 640px) {
    .measure-button {
      height: 3.25rem;
      min-width: 10rem;
    }

    .measurement-observer {
      top: 45%;
    }
  }
</style>
