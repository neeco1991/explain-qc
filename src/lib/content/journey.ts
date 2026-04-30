export type JourneyStep = {
	number: string;
	label: string;
	href?: string;
	unlocked: boolean;
	active: boolean;
	highlighted: boolean;
};

const journeyBlueprint = [
	{ number: '01', label: 'storage', href: '/' },
	{ number: '02', label: 'bit', href: '/bit' },
	{ number: '03', label: 'qubit', href: '/chapters' },
	{ number: '04', label: 'measurement' },
	{ number: '05', label: 'bloch sphere' }
] as const;

export function buildJourneySteps(
	activeNumber: string,
	unlockedThrough: number,
	highlightedNumber: string | null = null
): JourneyStep[] {
	return journeyBlueprint.map((step, index) => ({
		...step,
		unlocked: index < unlockedThrough,
		active: step.number === activeNumber,
		highlighted: step.number === highlightedNumber
	}));
}
