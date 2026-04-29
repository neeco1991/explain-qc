export type InteractionChoice = {
	value: string;
	label: string;
	signal: string;
	feedback: string;
};

export type InteractionStep = {
	id: string;
	eyebrow: string;
	title: string;
	body: string;
	prompt: string;
	insight: string;
	choices: InteractionChoice[];
};

export type Chapter = {
	number: string;
	slug: string;
	title: string;
	summary: string;
	lead: string;
	duration: string;
	stageLabel: string;
	buildNote: string;
	highlights: string[];
	steps: InteractionStep[];
};

export const chapters: Chapter[] = [
	{
		number: '02',
		slug: 'classical-registers',
		title: 'From One Bit to Many Bits',
		summary: 'Classical computers scale by stacking definite bits into registers.',
		lead:
			'You already set a single bit to 0 or 1. The next step is to stack many definite bits together so the machine can hold counters, words, and instructions.',
		duration: '4 min',
		stageLabel: 'Register logic',
		buildNote:
			'This chapter extends the intro: classical systems gain power by combining many exact states, not by becoming ambiguous.',
		highlights: [
			'Each bit still keeps one exact value.',
			'Registers grow the number of possible patterns.',
			'Reading a classical register returns the stored pattern directly.'
		],
		steps: [
			{
				id: 'register-pattern',
				eyebrow: 'Step 1',
				title: 'A register is just several definite bits side by side.',
				body: 'Once one bit makes sense, a register is the same idea repeated. Each position is still either 0 or 1, but the whole pattern can represent something larger.',
				prompt: 'What does a 4-bit register contain at any moment?',
				insight:
					'Classical computing scales by arranging many simple states together, not by letting each state become fuzzy.',
				choices: [
					{
						value: 'one-pattern',
						label: 'One exact pattern such as 0101.',
						signal: 'Definite pattern',
						feedback:
							'Correct. A register holds one precise arrangement of bits at a time.'
					},
					{
						value: 'many-patterns',
						label: 'All matching patterns at once.',
						signal: 'Not classical',
						feedback:
							'That would break the classical model. Registers still resolve to one stored pattern.'
					}
				]
			},
			{
				id: 'register-growth',
				eyebrow: 'Step 2',
				title: 'More bits create more combinations, not stranger states.',
				body: 'If you add more bits, the machine can represent more possibilities. But each possibility is still a clean binary arrangement rather than a blended state.',
				prompt: 'What changes when you expand a classical register?',
				insight:
					'Capacity grows because the count of valid binary combinations grows, while each stored result stays exact.',
				choices: [
					{
						value: 'more-combinations',
						label: 'You gain more possible exact configurations.',
						signal: 'Combinational growth',
						feedback:
							'Exactly. More bits means more binary patterns, not more ambiguity per pattern.'
					},
					{
						value: 'blurred-state',
						label: 'The stored state becomes blurred across several answers.',
						signal: 'Wrong model',
						feedback:
							'No. That would be a quantum-style intuition, not a classical register.'
					}
				]
			},
			{
				id: 'register-readout',
				eyebrow: 'Step 3',
				title: 'Reading a classical register gives back the stored pattern.',
				body: 'When the processor or memory is read, you get the actual sequence of bits that was stored there. The result is explicit, not probabilistic.',
				prompt: 'What comes back when you read a classical register?',
				insight:
					'This direct readout is why classical systems are ideal for exact control flow, accounting, storage, and repeatable logic.',
				choices: [
					{
						value: 'stored-pattern',
						label: 'The exact bit pattern that was stored.',
						signal: 'Stable readout',
						feedback:
							'Correct. Classical readout recovers the stored register state directly.'
					},
					{
						value: 'probability-cloud',
						label: 'A cloud of possible patterns with no definite answer.',
						signal: 'Wrong model',
						feedback:
							'That would be the wrong expectation for ordinary classical hardware.'
					}
				]
			}
		]
	},
	{
		number: '03',
		slug: 'qubit-intuition',
		title: 'Qubits Carry Possibility',
		summary: 'A qubit can encode a weighted mix of outcomes before measurement.',
		lead:
			'This chapter swaps the switch metaphor for a state that must be described as a recipe of possibilities rather than a fixed yes-or-no slot.',
		duration: '4 min',
		stageLabel: 'Superposition intuition',
		buildNote: 'The goal is not math yet. It is the feel of “structured possibility” before a measurement happens.',
		highlights: [
			'A qubit is not two classical bits glued together.',
			'Measurement gives one answer, not every answer at once.',
			'Quantum power comes from how multiple qubits evolve together.'
		],
		steps: [
			{
				id: 'superposition',
				eyebrow: 'Step 1',
				title: 'A qubit is described by a blend before you measure it.',
				body: 'The safest non-technical framing is to say that a qubit carries a structured mixture of possible outcomes, with weights and phase behind the scenes.',
				prompt: 'Which picture is closer to a qubit before measurement?',
				insight: '“Both at once” is shorthand. The deeper idea is that the qubit evolves like a state with amplitudes that later influence measurement results.',
				choices: [
					{
						value: 'recipe',
						label: 'A recipe of possibilities that can later resolve.',
						signal: 'Good intuition',
						feedback: 'Yes. That is a safer mental model than pretending it is just two definite bits at once.'
					},
					{
						value: 'two-bits',
						label: 'Two ordinary bits hidden in one place.',
						signal: 'Too classical',
						feedback: 'Not quite. A qubit is not just compressed classical storage.'
					}
				]
			},
			{
				id: 'collapse',
				eyebrow: 'Step 2',
				title: 'Measurement turns possibility into a single observed answer.',
				body: 'When you measure a qubit, you do not get a half-answer. You get one classical result, with probabilities shaped by the qubit state.',
				prompt: 'What does measurement do to a qubit?',
				insight: 'This is why quantum algorithms are designed so useful answers become more likely by the time the final measurement happens.',
				choices: [
					{
						value: 'single-outcome',
						label: 'It produces one definite result.',
						signal: 'Measured outcome',
						feedback: 'Correct. The result is classical even if the evolution before it was quantum.'
					},
					{
						value: 'see-all',
						label: 'It reveals every possible answer simultaneously.',
						signal: 'Common myth',
						feedback: 'That is the popular myth. Measurement gives one outcome, not a full list.'
					}
				]
			},
			{
				id: 'multi-qubit',
				eyebrow: 'Step 3',
				title: 'Quantum advantage is about coordinated evolution.',
				body: 'The interesting part is not “magic storage.” It is how several qubits can evolve together so that some answers reinforce and others cancel.',
				prompt: 'Why can groups of qubits become useful?',
				insight: 'Interference and entanglement are the patterns we will later illustrate visually, including on the Bloch sphere for single-qubit motion.',
				choices: [
					{
						value: 'pattern-evolution',
						label: 'Because their combined state can be shaped toward useful outcomes.',
						signal: 'Interference matters',
						feedback: 'Exactly. The algorithm shapes probability by steering the joint quantum state.'
					},
					{
						value: 'infinite-facts',
						label: 'Because each qubit stores infinite classical facts.',
						signal: 'Wrong promise',
						feedback: 'That overstates what a qubit does and leads to the wrong expectations.'
					}
				]
			}
		]
	},
	{
		number: '04',
		slug: 'bloch-sphere',
		title: 'Bloch Sphere Ready',
		summary: 'The repository is prepared for 3D single-qubit scenes.',
		lead:
			'The next interactive layer will stop talking about qubits abstractly and start showing them as orientations and rotations on the Bloch sphere.',
		duration: '2 min',
		stageLabel: '3D stage setup',
		buildNote: 'The stack is already in place: Threlte and Three are installed for future Bloch-sphere chapters and gate animations.',
		highlights: [
			'The Bloch sphere gives a visual language for one qubit.',
			'Rotations become easier to explain than equations alone.',
			'This repo is already wired with the 3D libraries needed for that step.'
		],
		steps: [
			{
				id: 'sphere-purpose',
				eyebrow: 'Step 1',
				title: 'The Bloch sphere turns an abstract qubit into a visual position.',
				body: 'Instead of saying “state amplitudes” over and over, you can show a point on a sphere and describe how it moves.',
				prompt: 'What is the Bloch sphere mainly for in this project?',
				insight: 'It will help non-technical users connect gates and rotations to visible motion rather than symbols alone.',
				choices: [
					{
						value: 'orientation',
						label: 'To picture a qubit as an orientation in space.',
						signal: 'Visual intuition',
						feedback: 'Right. It is a teaching tool that makes single-qubit state changes tangible.'
					},
					{
						value: 'hard-drive',
						label: 'To show where quantum data sits inside the computer.',
						signal: 'Wrong metaphor',
						feedback: 'No. The Bloch sphere is conceptual, not a physical cutaway of hardware.'
					}
				]
			},
			{
				id: 'next-phase',
				eyebrow: 'Step 2',
				title: 'The 3D chapter can now be built on top of this starter.',
				body: 'The repo includes the libraries needed to render a Bloch sphere, animate state rotations, and step users through a guided lesson one chapter at a time.',
				prompt: 'What is the practical outcome of this setup?',
				insight: 'From here, the next implementation step is a true Threlte scene with axes, vectors, and gate-driven rotations.',
				choices: [
					{
						value: 'scene-ready',
						label: 'We can add interactive Bloch-sphere scenes without changing stacks.',
						signal: 'Ready for 3D',
						feedback: 'Exactly. The repo is scaffolded for chapter flow now and 3D quantum visuals next.'
					},
					{
						value: 'text-only',
						label: 'We still need to replace the frontend stack before visual chapters.',
						signal: 'No longer true',
						feedback: 'Not anymore. The required frontend pieces are already installed.'
					}
				]
			}
		]
	}
];
