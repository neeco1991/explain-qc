<script lang="ts">
  const WORD = 'Qubit';
  const BYTE_SIZE = 8;

  type Bit = 0 | 1;
  type ByteRow = {
    id: number;
    original: string;
    bits: Bit[];
  };

  let rows = $state<ByteRow[]>(
    WORD.split('').map((letter, index) => ({
      id: index,
      original: letter,
      bits: letter
        .charCodeAt(0)
        .toString(2)
        .padStart(BYTE_SIZE, '0')
        .split('')
        .map((bit) => Number(bit) as Bit),
    })),
  );

  let skipNextClick = false;

  function byteValue(bits: Bit[]) {
    return parseInt(bits.join(''), 2);
  }

  function byteText(bits: Bit[]) {
    return bits.join('');
  }

  function characterFor(bits: Bit[]) {
    const value = byteValue(bits);
    return value >= 32 && value <= 126 ? String.fromCharCode(value) : '.';
  }

  function toggleBit(rowIndex: number, bitIndex: number) {
    rows[rowIndex].bits[bitIndex] = rows[rowIndex].bits[bitIndex] === 1 ? 0 : 1;
  }

  function handlePointerDown(rowIndex: number, bitIndex: number) {
    skipNextClick = true;
    toggleBit(rowIndex, bitIndex);
  }

  function handleClick(rowIndex: number, bitIndex: number) {
    if (skipNextClick) {
      skipNextClick = false;
      return;
    }

    toggleBit(rowIndex, bitIndex);
  }
</script>

<div
  class="ascii-memory mx-auto flex h-full w-full max-w-3xl items-center justify-center"
>
  <div class="ascii-memory__rows w-full">
    {#each rows as row, rowIndex (row.id)}
      <div class="ascii-memory__row">
        <div
          class="grid grid-cols-8 gap-1 sm:gap-1.5"
          aria-label={`ASCII byte for ${row.original}`}
        >
          {#each row.bits as bit, bitIndex}
            <button
              type="button"
              class={`ascii-memory__bit ${
                bit === 1 ? 'ascii-memory__bit--one' : 'ascii-memory__bit--zero'
              }`}
              aria-label={`Toggle bit ${bitIndex + 1} in byte ${rowIndex + 1}. ${byteText(row.bits)} currently decodes to ${characterFor(row.bits)}.`}
              onpointerdown={() => handlePointerDown(rowIndex, bitIndex)}
              onclick={() => handleClick(rowIndex, bitIndex)}
            >
              {bit}
            </button>
          {/each}
        </div>

        <div
          class="ascii-memory__char"
          aria-label={`Decoded character ${characterFor(row.bits)}`}
        >
          {characterFor(row.bits)}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .ascii-memory {
    font-family: 'Geist Mono', 'SFMono-Regular', Consolas, 'Liberation Mono',
      Menlo, ui-monospace, monospace;
  }

  .ascii-memory__rows {
    max-height: 16.4rem;
  }

  .ascii-memory__row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 2rem;
    align-items: center;
    gap: 0.55rem;
    width: min(100%, 20rem);
    margin: 0 auto 0.3rem;
  }

  .ascii-memory__bit,
  .ascii-memory__char {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid color-mix(in oklab, var(--foreground) 26%, transparent);
    background: rgba(255, 255, 255, 0.72);
    color: var(--foreground);
    box-shadow:
      inset 0 2px 0 rgba(255, 255, 255, 0.34),
      inset 0 -2px 0 rgba(120, 81, 0, 0.12),
      0 2px 0 rgba(120, 81, 0, 0.15);
  }

  .ascii-memory__bit {
    aspect-ratio: 1;
    min-width: 0;
    border-radius: 0.42rem;
    font-size: 0.68rem;
    font-weight: 800;
    line-height: 1;
    transition:
      transform 140ms ease,
      box-shadow 140ms ease,
      background-color 140ms ease;
  }

  .ascii-memory__bit:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-1px);
  }

  .ascii-memory__bit:active {
    transform: translateY(1px);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      inset 0 -1px 0 rgba(120, 81, 0, 0.12),
      0 1px 0 rgba(120, 81, 0, 0.18);
  }

  .ascii-memory__bit--zero {
    color: color-mix(in oklab, var(--foreground) 62%, transparent);
  }

  .ascii-memory__bit--one {
    border-color: color-mix(in oklab, var(--foreground) 42%, transparent);
    background: rgba(255, 255, 255, 0.86);
  }

  .ascii-memory__char {
    aspect-ratio: 1;
    border-radius: 0.46rem;
    font-size: 0.95rem;
    font-weight: 900;
    color: var(--accent-foreground);
    border-color: color-mix(in oklab, var(--accent-foreground) 40%, transparent);
  }

  @media (min-width: 640px) {
    .ascii-memory__rows {
      max-height: 27rem;
    }

    .ascii-memory__row {
      grid-template-columns: minmax(0, 1fr) 2.25rem;
      gap: 0.75rem;
      width: min(100%, 31rem);
      margin-bottom: 0.38rem;
    }

    .ascii-memory__bit {
      border-radius: 0.5rem;
      font-size: 0.8rem;
    }

    .ascii-memory__char {
      border-radius: 0.55rem;
      font-size: 1.05rem;
    }
  }
</style>
