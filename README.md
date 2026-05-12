# Explain QC

Interactive SvelteKit project for explaining the difference between classical and quantum computers to non-technical people, one page at a time.

## Current scope

- `/storage` is the first lesson, focused on how computers store information
- The bit is represented by a draggable arrow that resolves to `0` or `1`
- `/bit` is the second lesson, `What's a classical bit?`
- `/qubit` is the third lesson, focused on a qubit and an interactive Bloch sphere
- `/measurement` is the fourth lesson, showing measurement collapse
- `/bloch-sphere` is the fifth lesson, focused on the Bloch sphere view
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

- `src/routes/storage/+page.svelte`: first lesson, storage
- `src/routes/bit/+page.svelte`: second lesson, bit
- `src/routes/qubit/+page.svelte`: third lesson, qubit
- `src/routes/measurement/+page.svelte`: fourth lesson, measurement
- `src/routes/bloch-sphere/+page.svelte`: fifth lesson, bloch sphere
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
