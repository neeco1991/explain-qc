<script lang="ts">
	type RegisterBit = 0 | 1;

	const presets = ['0000', '0101', '1010', '1111'] as const;

	let bits = $state<RegisterBit[]>([0, 1, 0, 1]);

	const binaryValue = $derived(bits.join(''));
	const decimalValue = $derived(parseInt(bits.join(''), 2));

	function toggleBit(index: number) {
		bits = bits.map((bit, bitIndex) =>
			bitIndex === index ? ((bit === 0 ? 1 : 0) as RegisterBit) : bit
		);
	}

	function applyPreset(pattern: (typeof presets)[number]) {
		bits = pattern.split('').map((digit) => Number(digit) as RegisterBit);
	}
</script>

<div class="mx-auto grid w-full max-w-5xl gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
	<section class="rounded-[2rem] border border-white/60 bg-white/68 p-6 shadow-[0_24px_64px_rgba(146,64,14,0.08)] backdrop-blur sm:p-8">
		<p class="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
			Toggle the positions
		</p>

		<div class="mt-6 grid grid-cols-4 gap-3 sm:gap-4">
			{#each bits as bit, index}
				<button
					type="button"
					class="cursor-pointer rounded-[1.5rem] border border-border bg-background/82 px-3 py-6 text-center transition hover:border-primary/25 hover:bg-primary/5 sm:px-4 sm:py-8"
					onclick={() => toggleBit(index)}
				>
					<p class="text-[0.72rem] uppercase tracking-[0.22em] text-muted-foreground">
						Bit {index + 1}
					</p>
					<p class="mt-4 text-4xl font-semibold text-foreground sm:text-5xl">{bit}</p>
				</button>
			{/each}
		</div>

		<div class="mt-6 flex flex-wrap justify-center gap-2">
			{#each presets as preset}
				<button
					type="button"
					class="cursor-pointer rounded-full border border-border bg-background/78 px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/25 hover:bg-primary/5 hover:text-foreground"
					onclick={() => applyPreset(preset)}
				>
					{preset}
				</button>
			{/each}
		</div>
	</section>

	<aside class="rounded-[2rem] border border-white/60 bg-white/68 p-6 text-left shadow-[0_24px_64px_rgba(146,64,14,0.08)] backdrop-blur sm:p-8">
		<p class="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Current register</p>

		<div class="mt-5 rounded-[1.5rem] border border-border bg-background/82 px-5 py-5">
			<p class="text-sm text-muted-foreground">Binary</p>
			<p class="mt-2 text-4xl font-semibold tracking-[0.2em] text-foreground">{binaryValue}</p>
		</div>

		<div class="mt-4 rounded-[1.5rem] border border-border bg-background/82 px-5 py-5">
			<p class="text-sm text-muted-foreground">Decimal</p>
			<p class="mt-2 text-4xl font-semibold text-foreground">{decimalValue}</p>
		</div>

		<div class="mt-4 rounded-[1.5rem] border border-primary/15 bg-primary/8 px-5 py-5">
			<p class="text-sm leading-7 text-foreground/84">
				This register has many possible combinations, but right now it stores only one exact
				pattern: <span class="font-semibold text-foreground">{binaryValue}</span>.
			</p>
		</div>
	</aside>
</div>
