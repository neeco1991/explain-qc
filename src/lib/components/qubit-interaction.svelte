<script lang="ts">
	import { browser } from '$app/environment';
	import {
		DEFAULT_QUBIT_COEFFICIENTS,
		DEFAULT_QUBIT_VECTOR,
		QUBIT_RADIUS,
		clampQubitVector,
		coefficientsFromVector,
		vectorForBasisState,
		type QubitBasisState,
		type QubitCoefficients,
		type QubitVector
	} from '$lib/qubit-state';
	import gsap from 'gsap';
	import { onDestroy, onMount } from 'svelte';

	const TRANSITION_KEY = 'explain-qc.transition-to-qubit';
	const TRANSITION_BIT_KEY = 'explain-qc.transition-bit';
	const CENTER = 260;
	const RADIUS = QUBIT_RADIUS;
	const DRAW_LENGTH = 1280;
	const DRAW_DURATION = 1450;

	let {
		direction = $bindable(100),
		coefficients = $bindable<QubitCoefficients>({ ...DEFAULT_QUBIT_COEFFICIENTS }),
		vector = $bindable<QubitVector>({ ...DEFAULT_QUBIT_VECTOR }),
		collapseTarget = null,
		readonly = false
	}: {
		direction?: number;
		coefficients?: QubitCoefficients;
		vector?: QubitVector;
		collapseTarget?: QubitBasisState | null;
		readonly?: boolean;
	} = $props();

	let sphereSurface: SVGSVGElement | null = $state(null);
	let dragHandle: SVGCircleElement | null = $state(null);
	let activePointerId = $state<number | null>(null);
	let dragging = $state(false);
	let sphereReady = $state(false);
	let previousCollapseTarget = $state<QubitBasisState | null>(null);

	const tipX = $derived(CENTER + vector.x);
	const tipY = $derived(CENTER + vector.y);
	const vectorLength = $derived(Math.hypot(vector.x, vector.y));
	const normalizedValue = $derived(vectorLength / RADIUS);
	const currentCoefficients = $derived(coefficientsFromVector(vector));
	const arrowHeadPoints = $derived.by(() => {
		const angle = Math.atan2(vector.y, vector.x);
		const backX = tipX - Math.cos(angle) * 22;
		const backY = tipY - Math.sin(angle) * 22;
		const wingX = Math.cos(angle + Math.PI / 2) * 10;
		const wingY = Math.sin(angle + Math.PI / 2) * 10;

		return `${tipX},${tipY} ${backX + wingX},${backY + wingY} ${backX - wingX},${backY - wingY}`;
	});
	const drawStyle = $derived(
		`stroke-dasharray: ${DRAW_LENGTH}; stroke-dashoffset: ${sphereReady ? 0 : DRAW_LENGTH}; transition: stroke-dashoffset ${DRAW_DURATION}ms linear, opacity ${DRAW_DURATION}ms linear;`
	);

	onMount(() => {
		const shouldAnimate = sessionStorage.getItem(TRANSITION_KEY) === '1';
		const incomingBit = sessionStorage.getItem(TRANSITION_BIT_KEY);

		if (incomingBit === '0' || incomingBit === '1') {
			setVectorToBit(Number(incomingBit) as QubitBasisState, false);
		}

		sessionStorage.removeItem(TRANSITION_KEY);
		sessionStorage.removeItem(TRANSITION_BIT_KEY);

		if (!shouldAnimate) {
			sphereReady = true;
			return;
		}

		requestAnimationFrame(() => {
			sphereReady = true;
		});
	});

	onDestroy(() => {
		detachDragListeners();
	});

	$effect(() => {
		direction = Math.round(normalizedValue * 100);
		coefficients = currentCoefficients;
	});

	$effect(() => {
		if (collapseTarget === previousCollapseTarget) return;

		previousCollapseTarget = collapseTarget;

		if (collapseTarget === null) return;

		setVectorToBit(collapseTarget);
	});

	function setVector(x: number, y: number, animate: boolean) {
		const next = clampQubitVector({ x, y });

		if (animate) {
			const tweenState = { x: vector.x, y: vector.y };

			gsap.to(tweenState, {
				x: next.x,
				y: next.y,
				duration: 0.34,
				ease: 'power2.out',
				overwrite: 'auto',
				onUpdate() {
					vector = { x: tweenState.x, y: tweenState.y };
				}
			});
			return;
		}

		vector = next;
	}

	function setVectorToBit(bit: QubitBasisState, animate = true) {
		const next = vectorForBasisState(bit);

		setVector(next.x, next.y, animate);
	}

	function vectorFromPointer(clientX: number, clientY: number) {
		if (!sphereSurface) return vector;

		const rect = sphereSurface.getBoundingClientRect();
		const x = ((clientX - rect.left) / rect.width) * 520 - CENTER;
		const y = ((clientY - rect.top) / rect.height) * 520 - CENTER;

		return { x, y };
	}

	function detachDragListeners() {
		if (!browser) return;

		window.removeEventListener('pointermove', handlePointerMove);
		window.removeEventListener('pointerup', handlePointerEnd);
		window.removeEventListener('pointercancel', handlePointerEnd);
	}

	function beginDrag(event: PointerEvent) {
		if (readonly) return;

		event.preventDefault();
		event.stopPropagation();
		dragging = true;
		activePointerId = event.pointerId;

		const vector = vectorFromPointer(event.clientX, event.clientY);
		setVector(vector.x, vector.y, false);

		if (dragHandle?.setPointerCapture) {
			dragHandle.setPointerCapture(event.pointerId);
		}

		window.addEventListener('pointermove', handlePointerMove);
		window.addEventListener('pointerup', handlePointerEnd);
		window.addEventListener('pointercancel', handlePointerEnd);
	}

	function handlePointerMove(event: PointerEvent) {
		if (readonly || !dragging || activePointerId !== event.pointerId) return;
		event.preventDefault();

		const vector = vectorFromPointer(event.clientX, event.clientY);
		setVector(vector.x, vector.y, false);
	}

	function handlePointerEnd(event: PointerEvent) {
		if (activePointerId !== event.pointerId) return;

		if (dragHandle?.hasPointerCapture?.(event.pointerId)) {
			dragHandle.releasePointerCapture(event.pointerId);
		}

		dragging = false;
		activePointerId = null;
		detachDragListeners();
	}

	function handleHandleKeydown(event: KeyboardEvent) {
		if (readonly) return;

		const step = 18;

		if (event.key === '0') {
			event.preventDefault();
			setVectorToBit(0);
			return;
		}

		if (event.key === '1') {
			event.preventDefault();
			setVectorToBit(1);
			return;
		}

		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			setVector(vector.x - step, vector.y, true);
		}

		if (event.key === 'ArrowRight') {
			event.preventDefault();
			setVector(vector.x + step, vector.y, true);
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault();
			setVector(vector.x, vector.y - step, true);
		}

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			setVector(vector.x, vector.y + step, true);
		}
	}
</script>

<div class="interaction-frame mx-auto w-full">
	<div class="flex w-full items-center justify-center gap-3 sm:gap-5">
		<button
			type="button"
			class={`shrink-0 cursor-pointer text-5xl font-semibold text-foreground transition-colors hover:text-foreground/72 sm:text-6xl ${readonly ? 'pointer-events-none opacity-60' : ''}`}
			onpointerdown={() => !readonly && setVectorToBit(0)}
			onclick={() => !readonly && setVectorToBit(0)}
			disabled={readonly}
			aria-label="Set qubit direction to 0"
		>
			0
		</button>

		<div
			class="interaction-stage relative aspect-square min-w-0 flex-1 select-none"
			style="touch-action: none;"
		>
			<svg
				bind:this={sphereSurface}
				viewBox="0 0 520 520"
				class="absolute inset-0 z-10 h-full w-full overflow-visible"
				role="application"
				aria-label="Interactive Bloch sphere"
				onpointerdown={beginDrag}
			>
				<defs>
					<radialGradient id="bloch-fill" cx="38%" cy="28%" r="68%">
						<stop offset="0%" stop-color="white" stop-opacity="0.35" />
						<stop offset="55%" stop-color="white" stop-opacity="0.08" />
						<stop offset="100%" stop-color="white" stop-opacity="0" />
					</radialGradient>
				</defs>

				<circle
					cx={CENTER}
					cy={CENTER}
					r={RADIUS}
					fill="url(#bloch-fill)"
					class="pointer-events-none stroke-foreground/16"
					stroke-width="1.5"
					style={`opacity: ${sphereReady ? 1 : 0}; transition: opacity ${DRAW_DURATION}ms linear;`}
				/>
				<path
					d="M 62 260 A 198 198 0 0 1 458 260"
					fill="none"
					stroke="currentColor"
					stroke-width="1.7"
					class="pointer-events-none text-foreground/32"
					stroke-dasharray="6 8"
				/>
				<path
					d="M 62 260 A 198 198 0 0 0 458 260"
					fill="none"
					stroke="currentColor"
					stroke-width="1.7"
					class="pointer-events-none text-foreground/32"
					style={drawStyle}
					opacity={sphereReady ? 1 : 0}
					stroke-dasharray="6 8"
				/>
				<ellipse
					cx={CENTER}
					cy={CENTER}
					rx={RADIUS}
					ry="54"
					fill="none"
					stroke="currentColor"
					stroke-width="1.4"
					class="pointer-events-none text-foreground/24"
					style={drawStyle}
					opacity={sphereReady ? 1 : 0}
				/>
				<ellipse
					cx={CENTER}
					cy={CENTER}
					rx="82"
					ry={RADIUS}
					fill="none"
					stroke="currentColor"
					stroke-width="1.4"
					class="pointer-events-none text-foreground/18"
					style={drawStyle}
					opacity={sphereReady ? 1 : 0}
				/>
				<line
					x1={CENTER - RADIUS}
					y1={CENTER}
					x2={CENTER + RADIUS}
					y2={CENTER}
					stroke="currentColor"
					stroke-width="1.2"
					class="pointer-events-none text-foreground/20"
					style={`opacity: ${sphereReady ? 1 : 0}; transition: opacity ${DRAW_DURATION}ms linear;`}
				/>

				<line
					x1={CENTER}
					y1={CENTER}
					x2={tipX}
					y2={tipY}
					stroke="currentColor"
					stroke-width="4"
					stroke-linecap="round"
					class="pointer-events-none text-foreground"
				/>
				<circle cx={CENTER} cy={CENTER} r="7" class="pointer-events-none fill-foreground" />
				<circle
					bind:this={dragHandle}
					cx={tipX}
					cy={tipY}
					r="28"
					class={`${dragging ? 'cursor-grabbing' : 'cursor-grab'} fill-transparent pointer-events-auto`}
					pointer-events="all"
					role="slider"
					tabindex="0"
					aria-label="Qubit direction"
					aria-valuemin="0"
					aria-valuemax="100"
					aria-valuenow={Math.round(normalizedValue * 100)}
					stroke="transparent"
					stroke-width="0"
					style="touch-action: none;"
					onpointerdown={beginDrag}
					onkeydown={handleHandleKeydown}
				/>
				<circle
					cx={tipX}
					cy={tipY}
					r="12"
					class="pointer-events-none fill-background stroke-foreground/70"
					stroke-width="2"
				/>
				<circle cx={tipX} cy={tipY} r="4" class="pointer-events-none fill-foreground/70" />
				<polygon points={arrowHeadPoints} class="pointer-events-none fill-foreground" />
			</svg>
		</div>

		<button
			type="button"
			class={`shrink-0 cursor-pointer text-5xl font-semibold text-foreground transition-colors hover:text-foreground/72 sm:text-6xl ${readonly ? 'pointer-events-none opacity-60' : ''}`}
			onpointerdown={() => !readonly && setVectorToBit(1)}
			onclick={() => !readonly && setVectorToBit(1)}
			disabled={readonly}
			aria-label="Set qubit direction to 1"
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
