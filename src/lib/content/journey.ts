export type JourneyStep = {
	number: string;
	label: string;
	unlocked: boolean;
	active: boolean;
};

const journeyBlueprint = [
	{ number: '01', label: 'bit' },
	{ number: '02', label: 'registers' },
	{ number: '03', label: 'qubits' },
	{ number: '04', label: 'bloch sphere' }
] as const;

export function buildJourneySteps(activeNumber: string, unlockedThrough: number): JourneyStep[] {
	return journeyBlueprint.map((step, index) => ({
		...step,
		unlocked: index < unlockedThrough,
		active: step.number === activeNumber
	}));
}
