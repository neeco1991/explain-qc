<script lang="ts">
	import { browser } from '$app/environment';
	import gsap from 'gsap';
	import { onDestroy, onMount } from 'svelte';

	type BitValue = 0 | 1;

	type JourneyStep = {
		number: string;
		label: string;
		href: string | null;
		unlocked: boolean;
		active: boolean;
	};

	const STORAGE_KEY = 'explain-qc.intro-bit.v2';
	const SNAP_ANGLES: Record<BitValue, number> = {
		0: -53,
		1: 53
	};
	const MAX_DRAG_ANGLE = 74;

	let selectedBit = $state<BitValue | null>(null);
	let currentAngle = $state(0);
	let dragSurface: HTMLDivElement | null = $state(null);
	let needle: SVGGElement | null = $state(null);
	let hydrated = $state(!browser);
	let dragging = $state(false);
	let activePointerId = $state<number | null>(null);

	const journeySteps = $derived.by<JourneyStep[]>(() => [
		{ number: '01', label: 'bit', href: '/', unlocked: true, active: true },
		{
			number: '02',
			label: 'registers',
			href: selectedBit === null ? null : '/chapters',
			unlocked: selectedBit !== null,
			active: false
		},
		{ number: '03', label: 'qubits', href: null, unlocked: false, active: false },
		{ number: '04', label: 'bloch sphere', href: null, unlocked: false, active: false }
	]);

	const explanation = $derived.by(() => {
		if (selectedBit === 0) {
			return 'This bit is set to 0. A classical computer can read that exact value directly, because a bit stores one definite state at a time.';
		}

		if (selectedBit === 1) {
			return 'This bit is set to 1. It is still one clear state, just the other allowed value. Classical bits do not stay halfway between answers.';
		}

		return 'A bit is the smallest unit of classical information. It can only end up as 0 or 1, so when you let go, the arrow snaps to one clear state.';
	});

	onMount(() => {
		if (!browser) return;

		const stored = localStorage.getItem(STORAGE_KEY);

		if (stored === '0' || stored === '1') {
			selectedBit = Number(stored) as BitValue;
			requestAnimationFrame(() => setNeedleAngle(SNAP_ANGLES[selectedBit as BitValue], false));
		} else {
			requestAnimationFrame(() => setNeedleAngle(0, false));
		}

		hydrated = true;
	});

	onDestroy(() => {
		detachDragListeners();
	});

	$effect(() => {
		if (!browser || !hydrated) return;

		if (selectedBit === null) {
			localStorage.removeItem(STORAGE_KEY);
			return;
		}

		localStorage.setItem(STORAGE_KEY, String(selectedBit));
	});

	function clamp(value: number, min: number, max: number) {
		return Math.min(max, Math.max(min, value));
	}

	function setNeedleAngle(angle: number, animate: boolean) {
		currentAngle = angle;

		if (!needle) return;

		if (animate) {
			gsap.to(needle, {
				rotate: angle,
				duration: 0.42,
				ease: 'power3.out',
				overwrite: 'auto',
				svgOrigin: '260 260'
			});
			return;
		}

		gsap.set(needle, {
			rotate: angle,
			overwrite: 'auto',
			svgOrigin: '260 260'
		});
	}

	function snapToBit(bit: BitValue, animate = true) {
		selectedBit = bit;
		setNeedleAngle(SNAP_ANGLES[bit], animate);
	}

	function angleFromPointer(clientX: number, clientY: number) {
		if (!dragSurface) return currentAngle;

		const rect = dragSurface.getBoundingClientRect();
		const pivotX = rect.left + rect.width * 0.5;
		const pivotY = rect.top + rect.height * 0.8125;
		const dx = clientX - pivotX;
		const dy = clientY - pivotY;
		const angle = (Math.atan2(dx, Math.max(Math.abs(dy), 1)) * 180) / Math.PI;

		return clamp(angle, -MAX_DRAG_ANGLE, MAX_DRAG_ANGLE);
	}

	function detachDragListeners() {
		if (!browser) return;

		window.removeEventListener('pointermove', handlePointerMove);
		window.removeEventListener('pointerup', handlePointerEnd);
		window.removeEventListener('pointercancel', handlePointerEnd);
	}

	function beginDrag(event: PointerEvent) {
		event.preventDefault();
		dragging = true;
		activePointerId = event.pointerId;
		setNeedleAngle(angleFromPointer(event.clientX, event.clientY), false);

		window.addEventListener('pointermove', handlePointerMove);
		window.addEventListener('pointerup', handlePointerEnd);
		window.addEventListener('pointercancel', handlePointerEnd);
	}

	function handlePointerMove(event: PointerEvent) {
		if (!dragging || activePointerId !== event.pointerId) return;
		setNeedleAngle(angleFromPointer(event.clientX, event.clientY), false);
	}

	function handlePointerEnd(event: PointerEvent) {
		if (activePointerId !== event.pointerId) return;

		dragging = false;
		activePointerId = null;
		detachDragListeners();

		snapToBit(currentAngle <= 0 ? 0 : 1);
	}

	function handleHandleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft' || event.key === '0') {
			event.preventDefault();
			snapToBit(0);
		}

		if (event.key === 'ArrowRight' || event.key === '1') {
			event.preventDefault();
			snapToBit(1);
		}
	}
</script>

<svelte:head>
	<title>Explain QC | what is a bit?</title>
	<meta
		name="description"
		content="A clean first chapter that explains a classical bit with a draggable arrow that always resolves to 0 or 1."
	/>
</svelte:head>

<div class="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8 sm:px-8 sm:py-10">
	<nav class="w-full">
		<ol class="flex items-start justify-between gap-2 sm:gap-4">
			{#each journeySteps as step, index}
				<div class="flex min-w-0 flex-1 items-start gap-2">
					{#if index > 0}
						<div
							class={`mt-5 hidden h-px flex-1 sm:block ${
								index === 1 && step.unlocked ? 'bg-primary/40' : 'bg-border'
							}`}
						></div>
					{/if}

					{#if step.href}
						<a
							href={step.href}
							class={`min-w-0 shrink-0 transition ${
								step.active
									? 'text-foreground'
									: step.unlocked
										? 'text-foreground hover:text-primary'
										: 'cursor-default text-muted-foreground'
							}`}
							aria-current={step.active ? 'page' : undefined}
						>
							<div
								class={`flex size-10 items-center justify-center rounded-full border text-sm font-medium ${
									step.active
										? 'border-foreground bg-foreground text-background'
										: step.unlocked
											? 'border-primary/30 text-primary'
											: 'border-border text-muted-foreground'
								}`}
							>
								{step.number}
							</div>
							<p class="mt-2 text-[0.72rem] uppercase tracking-[0.24em]">{step.label}</p>
						</a>
					{:else}
						<div class="min-w-0 shrink-0 text-muted-foreground">
							<div class="flex size-10 items-center justify-center rounded-full border border-border text-sm font-medium">
								{step.number}
							</div>
							<p class="mt-2 text-[0.72rem] uppercase tracking-[0.24em]">{step.label}</p>
						</div>
					{/if}
				</div>
			{/each}
		</ol>
	</nav>

	<main class="flex flex-1 flex-col items-center justify-center pb-10 text-center">
		<h1 class="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">what is a bit?</h1>

		<div bind:this={dragSurface} class="relative mt-10 aspect-[13/8] w-full max-w-4xl">
			<button
				type="button"
				class={`absolute top-[43.5%] left-[19.2%] z-10 -translate-x-1/2 -translate-y-1/2 text-5xl font-semibold transition sm:text-6xl ${
					selectedBit === 0 ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
				}`}
				onclick={() => snapToBit(0)}
			>
				0
			</button>

			<button
				type="button"
				class={`absolute top-[43.5%] left-[80.8%] z-10 -translate-x-1/2 -translate-y-1/2 text-5xl font-semibold transition sm:text-6xl ${
					selectedBit === 1 ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
				}`}
				onclick={() => snapToBit(1)}
			>
				1
			</button>

			<svg viewBox="0 0 520 320" class="absolute inset-0 h-full w-full overflow-visible">
				<path
					d="M 100 140 A 200 200 0 0 1 420 140"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					class="text-border"
					stroke-dasharray="6 8"
				/>
				<circle cx="100" cy="140" r="5" class="fill-foreground/18" />
				<circle cx="420" cy="140" r="5" class="fill-foreground/18" />

				<g bind:this={needle}>
					<line
						x1="260"
						y1="260"
						x2="260"
						y2="92"
						stroke="currentColor"
						stroke-width="4"
						stroke-linecap="round"
						class="text-foreground"
					/>
					<polygon points="260,62 246,96 274,96" class="fill-foreground" />
					<circle
						cx="260"
						cy="62"
						r="15"
						class="cursor-grab fill-background stroke-foreground/70 touch-none"
						role="slider"
						tabindex="0"
						aria-label="Bit direction"
						aria-valuemin="0"
						aria-valuemax="1"
						aria-valuenow={selectedBit ?? undefined}
						stroke-width="2"
						onpointerdown={beginDrag}
						onkeydown={handleHandleKeydown}
					/>
					<circle cx="260" cy="62" r="4" class="fill-foreground/70 pointer-events-none" />
				</g>

				<circle cx="260" cy="260" r="8" class="fill-foreground" />
			</svg>
		</div>

		<p class="mt-12 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
			{explanation}
		</p>
	</main>
</div>
