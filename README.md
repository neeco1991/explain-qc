# Explain QC

Interactive SvelteKit project for explaining the difference between classical and quantum computers to non-technical people, one page at a time.

## Current scope

- `/` is the first lesson, `What's a classical bit?`
- The bit is represented by a draggable arrow that resolves to `0` or `1`
- `/chapters` is the second lesson, focused on a qubit and an interactive Bloch sphere
- A shared shell handles the page title, chapter progression, and footer explanation area
- Each lesson has its own dedicated internal interaction instead of using a generic chapter engine
- `three`, `Threlte`, and animation tooling are already installed for future 3D scenes

## Stack

- `SvelteKit` + `Svelte 5`
- `Tailwind CSS 4`
- `shadcn-svelte`
- `GSAP`
- `three`
- `@threlte/core`
- `@threlte/extras`

## Project structure

- `src/routes/+page.svelte`: first lesson, `What's a classical bit?`
- `src/routes/chapters/+page.svelte`: second lesson, qubit
- `src/lib/components/journey-shell.svelte`: shared page chrome
- `src/lib/components/journey-progress.svelte`: chapter progression UI
- `src/lib/components/bit-interaction.svelte`: first-page interaction
- `src/lib/components/qubit-interaction.svelte`: second-page interaction
- `src/lib/content/journey.ts`: shared progression metadata

## Development

```sh
pnpm dev
```

## Validation

```sh
pnpm check
pnpm build
```

## Notes

- The app is being built page by page, not from a reusable chapter-content system
- `@sveltejs/adapter-auto` is still in place; switch adapters when you target a specific deployment platform
