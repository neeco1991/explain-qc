export type QubitBasisState = 0 | 1;

export type QubitCoefficients = {
	zero: number;
	one: number;
};

export type QubitVector = {
	x: number;
	y: number;
};

export type QubitTerm = {
	coefficient: string;
	basis: QubitBasisState;
};

export const QUBIT_RADIUS = 198;
export const DEFAULT_QUBIT_VECTOR: QubitVector = { x: 0, y: -QUBIT_RADIUS };
export const DEFAULT_QUBIT_COEFFICIENTS: QubitCoefficients = {
	zero: Math.SQRT1_2,
	one: Math.SQRT1_2
};
export const MEASUREMENT_QUBIT_VECTOR_KEY = 'explain-qc.measurement-qubit-vector';

export function clampQubitVector(vector: QubitVector): QubitVector {
	const length = Math.hypot(vector.x, vector.y);
	const scale = length > QUBIT_RADIUS ? QUBIT_RADIUS / length : 1;

	return {
		x: vector.x * scale,
		y: vector.y * scale
	};
}

export function vectorForBasisState(state: QubitBasisState): QubitVector {
	return {
		x: state === 0 ? -QUBIT_RADIUS : QUBIT_RADIUS,
		y: 0
	};
}

export function coefficientsFromVector(vector: QubitVector): QubitCoefficients {
	const basisPosition = Math.min(1, Math.max(-1, vector.x / QUBIT_RADIUS));

	return {
		zero: Math.sqrt((1 - basisPosition) / 2),
		one: Math.sqrt((1 + basisPosition) / 2)
	};
}

export function buildQubitTerms(coefficients: QubitCoefficients): QubitTerm[] {
	const terms: QubitTerm[] = [];
	const zeroCoefficient = formatCoefficient(coefficients.zero);
	const oneCoefficient = formatCoefficient(coefficients.one);

	if (zeroCoefficient !== null) {
		terms.push({ coefficient: zeroCoefficient, basis: 0 });
	}

	if (oneCoefficient !== null) {
		terms.push({ coefficient: oneCoefficient, basis: 1 });
	}

	return terms;
}

export function chooseMeasurementOutcome(coefficients: QubitCoefficients): QubitBasisState {
	const zeroWeight = coefficients.zero ** 2;
	const oneWeight = coefficients.one ** 2;
	const totalWeight = zeroWeight + oneWeight;

	if (totalWeight <= 0) {
		return Math.random() < 0.5 ? 0 : 1;
	}

	return Math.random() < zeroWeight / totalWeight ? 0 : 1;
}

export function parseStoredQubitVector(value: string): QubitVector | null {
	try {
		const parsed = JSON.parse(value);

		if (!isFiniteNumber(parsed?.x) || !isFiniteNumber(parsed?.y)) {
			return null;
		}

		return clampQubitVector({ x: parsed.x, y: parsed.y });
	} catch {
		return null;
	}
}

function formatCoefficient(value: number) {
	const rounded = Math.round(value * 100) / 100;

	if (rounded === 0) return null;
	if (rounded === 1) return '';

	return rounded.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}

function isFiniteNumber(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value);
}
