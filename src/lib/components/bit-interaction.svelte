<script lang="ts">
	import { browser } from '$app/environment';
	import gsap from 'gsap';
	import { onDestroy, onMount } from 'svelte';

	export type BitValue = 0 | 1;

	const SNAP_ANGLES: Record<BitValue, number> = {
		0: -90,
		1: 90
	};
	const MAX_DRAG_ANGLE = 90;

	let { value = $bindable<BitValue | null>(null) }: { value?: BitValue | null } = $props();

	let currentAngle = $state(0);
	let dragSurface: HTMLDivElement | null = $state(null);
	let dragHandle: SVGCircleElement | null = $state(null);
	let needle: SVGGElement | null = $state(null);
	let dragging = $state(false);
	let activePointerId = $state<number | null>(null);

	onMount(() => {
		requestAnimationFrame(() => {
			setNeedleAngle(value === null ? 0 : SNAP_ANGLES[value], false);
		});
	});

	onDestroy(() => {
		detachDragListeners();
	});

	$effect(() => {
		if (dragging) return;
		setNeedleAngle(value === null ? 0 : SNAP_ANGLES[value], true);
	});

	function clamp(number: number, min: number, max: number) {
		return Math.min(max, Math.max(min, number));
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
		value = bit;
		setNeedleAngle(SNAP_ANGLES[bit], animate);
	}

	function angleFromPointer(clientX: number, clientY: number) {
		if (!dragSurface) return currentAngle;

		const rect = dragSurface.getBoundingClientRect();
		const pivotX = rect.left + rect.width * 0.5;
		const pivotY = rect.top + rect.height * 0.5;
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

		if (dragHandle?.setPointerCapture) {
			dragHandle.setPointerCapture(event.pointerId);
		}

		window.addEventListener('pointermove', handlePointerMove);
		window.addEventListener('pointerup', handlePointerEnd);
		window.addEventListener('pointercancel', handlePointerEnd);
	}

	function handlePointerMove(event: PointerEvent) {
		if (!dragging || activePointerId !== event.pointerId) return;
		event.preventDefault();
		setNeedleAngle(angleFromPointer(event.clientX, event.clientY), false);
	}

	function handlePointerEnd(event: PointerEvent) {
		if (activePointerId !== event.pointerId) return;

		if (dragHandle?.hasPointerCapture?.(event.pointerId)) {
			dragHandle.releasePointerCapture(event.pointerId);
		}

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

<div class="interaction-frame mx-auto w-full">
	<div
		class="flex w-full items-center justify-center gap-3 sm:gap-5"
		style="touch-action: none;"
	>
		<button
			type="button"
			class={`shrink-0 cursor-pointer text-5xl font-semibold transition sm:text-6xl ${
				value === 0 ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
			}`}
			onpointerdown={() => snapToBit(0)}
			onclick={() => snapToBit(0)}
		>
			0
		</button>

		<div
			bind:this={dragSurface}
			class="interaction-stage relative aspect-square min-w-0 flex-1 select-none"
		>
			<svg viewBox="0 0 520 520" class="absolute inset-0 z-10 h-full w-full overflow-visible">
				<path
					d="M 62 260 A 198 198 0 0 1 458 260"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					class="pointer-events-none text-foreground/28"
					stroke-dasharray="6 8"
				/>
				<circle cx="62" cy="260" r="5" class="pointer-events-none fill-foreground/24" />
				<circle cx="458" cy="260" r="5" class="pointer-events-none fill-foreground/24" />

				<g bind:this={needle}>
					<circle
						bind:this={dragHandle}
						cx="260"
						cy="62"
						r="24"
						class={`${dragging ? 'cursor-grabbing' : 'cursor-grab'} fill-transparent pointer-events-auto`}
						pointer-events="all"
						role="slider"
						tabindex="0"
						aria-label="Bit direction"
						aria-valuemin="0"
						aria-valuemax="1"
						aria-valuenow={value ?? undefined}
						stroke="transparent"
						stroke-width="0"
						style="touch-action: none;"
						onpointerdown={beginDrag}
						onkeydown={handleHandleKeydown}
					/>
					<circle
						cx="260"
						cy="62"
						r="13"
						class="pointer-events-none fill-background stroke-foreground/70"
						stroke-width="2"
					/>
					<circle cx="260" cy="62" r="4" class="pointer-events-none fill-foreground/70" />
					<line
						x1="260"
						y1="260"
						x2="260"
						y2="92"
						stroke="currentColor"
						stroke-width="4"
						stroke-linecap="round"
						class="pointer-events-none text-foreground"
					/>
					<polygon points="260,62 246,96 274,96" class="pointer-events-none fill-foreground" />
				</g>

				<circle cx="260" cy="260" r="8" class="pointer-events-none fill-foreground" />
			</svg>
		</div>

		<button
			type="button"
			class={`shrink-0 cursor-pointer text-5xl font-semibold transition sm:text-6xl ${
				value === 1 ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
			}`}
			onpointerdown={() => snapToBit(1)}
			onclick={() => snapToBit(1)}
		>
			1
		</button>
	</div>

</div>

<style>
	.interaction-frame {
		max-width: min(20.5rem, 94cqw, 100cqh);
	}

	.interaction-stage {
		max-width: min(15.75rem, 64cqw, 100cqh);
	}

	@media (min-width: 640px) {
		.interaction-frame {
			max-width: min(38rem, 94cqw, 100cqh);
		}

		.interaction-stage {
			max-width: min(30rem, 78cqw, 100cqh);
		}
	}
</style>
