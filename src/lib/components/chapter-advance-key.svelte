<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowRight } from '@lucide/svelte';
	import { onDestroy } from 'svelte';

	let {
		href,
		ariaLabel = 'Go to the next chapter',
		beforeNavigate
	}: {
		href: string;
		ariaLabel?: string;
		beforeNavigate?: () => void;
	} = $props();

	const RAISED_CLASS =
		'shadow-[inset_0_3px_0_rgba(255,255,255,0.36),inset_0_-8px_0_rgba(120,81,0,0.14),0_8px_0_rgba(120,81,0,0.18),0_18px_42px_rgba(120,81,0,0.14)] hover:-translate-y-1 hover:bg-white/90';
	const PRESSED_CLASS =
		'translate-y-[4px] bg-white/86 shadow-[inset_0_2px_0_rgba(255,255,255,0.26),inset_0_-5px_0_rgba(120,81,0,0.14),0_3px_0_rgba(120,81,0,0.2)]';

	let pressed = $state(false);
	let timer: ReturnType<typeof setTimeout> | null = null;

	onDestroy(() => {
		if (timer) clearTimeout(timer);
	});

	function press() {
		pressed = true;
	}

	function release() {
		if (timer) return;
		pressed = false;
	}

	function handleClick(event: MouseEvent) {
		event.preventDefault();
		beforeNavigate?.();
		pressed = true;

		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			timer = null;
			void goto(href);
		}, 180);
	}
</script>

<a
	{href}
	aria-label={ariaLabel}
	class={`flex h-14 min-w-20 items-center justify-center rounded-xl border-2 border-foreground/24 bg-white/78 px-5 text-foreground backdrop-blur transition-all sm:h-16 sm:min-w-24 ${
		pressed ? PRESSED_CLASS : RAISED_CLASS
	}`}
	onpointerdown={press}
	onpointerup={release}
	onpointercancel={release}
	onpointerleave={release}
	onclick={handleClick}
>
	<ArrowRight class="size-6 sm:size-7" stroke-width={2.2} />
</a>
