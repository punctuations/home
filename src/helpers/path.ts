type TypedArray = Float32Array | Float64Array;

import { lerp as _lerp } from 'maath/misc';

export function cloud(buffer: TypedArray, options?: { speed: number }) {
	const defaultOptions = {
		speed: 1,
	};

	options = options ?? defaultOptions;

	for (let i = 0; i < buffer.length; i++) {
		// Generate random ontop of pre-existing coordinate
		let pt = buffer[i] + (Math.random() - 0.5) * 0.1;

		// We add the 3 values to the attribute array for every loop
		buffer.set([pt], i);
	}
}

/**
 *
 * Calculate binomial coefficients (n choose k)
 *
 * @param n possibilities
 * @param k unordered outcome
 * @returns k-subsets possible out of the set of n distinct items
 */
export function choose(n: number, k: number) {
	let coeff = 1;

	for (let x = n - k + 1; x <= n; x++) {
		coeff *= x;
	}

	for (let x = 1; x <= k; x++) {
		coeff /= x;
	}

	return coeff;
}

/**
 *
 * Returns the result of lagrange polynomial interpolation between A, B, and C by the time of t (given 0 <= t <= 1)
 *
 * @param v array of three numbers to interpolate between
 * @param t time, reccomended (0 <= t <= 1)
 * @returns 3-point interpolation given pos of t
 */
function _lpi3(v: [number, number, number], t: number) {
	return 2 * (t - 1) * (t - 0.5) * v[0] - 4 * (t - 1) * t * v[1] + 2 * (t - 0.5) * t * v[2];
}

/**
 *
 * Interpolates using Lagrane Interpolation between three buffers, passed in as array into final
 *
 * @param buffers array of three buffers: bufferA, bufferB, bufferC
 * @param final interpolation buffer (output)
 * @param t time, reccomended (0 <= t <= 1)
 */
export function lpi3(buffers: [TypedArray, TypedArray, TypedArray], final: TypedArray, t: number) {
	for (let i = 0; i < buffers[0].length; i++) {
		final[i] = _lpi3([buffers[0][i], buffers[1][i], buffers[2][i]], t);
	}
}

type Equilateral = {
	width?: number;
	height?: number;
	center?: [number, number];
};

const defaultEquilateral = {
	width: 3,
	height: 3,
	center: [0, 0],
};

// random equilateral, theory dervied here: https://math.stackexchange.com/questions/3537762/random-point-in-a-triangle
export function inEquilateral(buffer: TypedArray, equilateral?: Equilateral) {
	let { width, height, center } = {
		...defaultEquilateral,
		...equilateral,
	};

	center = [width + center[0], height + center[1]];

	for (let i = 0; i < buffer.length; i += 2) {
		let r1 = Math.random();
		let r2 = Math.random();

		// if over the diagonal, then flip r1 & r2
		if (r1 + r2 > 1) {
			r1 = 1 - r1;
			r2 = 1 - r2;
		}

		let x = 2 * width * r2 + width * r1;
		let y = 2 * height * r1;

		buffer[i] = x - center[0]; // equilateral
		buffer[i + 1] = y - center[1]; // equilateral
	}

	return buffer;
}

// TODO: make uniformally distributed
export function onEquilateral(buffer: TypedArray, equilateral?: Equilateral) {
	let { width, height, center } = {
		...defaultEquilateral,
		...equilateral,
	};

	center = [width * 0.5 + center[0], height * 0.5 + center[1]];

	for (let i = 0; i < buffer.length; i += 2) {
		let side = Math.floor(Math.random() * 3); // Randomly select a side (0, 1, or 2)
		let r = Math.random(); // Random number between 0 and 1

		let x, y;

		// Depending on the selected side, calculate the points on the perimeter
		if (side === 0) {
			// Side 0 (bottom side)
			x = r * width;
			y = 0;
		} else if (side === 1) {
			// Side 1 (left side)
			x = r * width * 0.5;
			y = r * height;
		} else {
			// Side 2 (right side)
			x = width + r * width * -0.5;
			y = r * height;
		}

		buffer[i] = x - center[0];
		buffer[i + 1] = y - center[1];
	}

	return buffer;
}

const defaultPrism = {
	width: 2,
	depth: 3,
	height: 2,
	center: [0, 0, 0],
};

export function inPrism(
	buffer: TypedArray,
	options?: { width?: number; height?: number; depth?: number; center?: [number, number, number] },
) {
	let { width, height, depth, center } = {
		...defaultPrism,
		...options,
	};

	center = [width + center[0], height + center[1], depth + center[2]];

	// https://math.stackexchange.com/questions/3537762/random-point-in-a-triangle
	for (let i = 0; i < buffer.length; i += 3) {
		let r1 = Math.random();
		let r2 = Math.random();

		// if over the diagonal, then flip r1 & r2
		if (r1 + r2 > 1) {
			r1 = 1 - r1;
			r2 = 1 - r2;
		}

		let x = width * 2 * r2 + width * r1;
		let y = height * 2 * r1;

		buffer[i] = x - center[0]; // equilateral
		buffer[i + 1] = y - center[1]; // equilateral
		buffer[i + 2] = Math.random() * (2 * depth) - center[2];
	}

	return buffer;
}

export function onPrism(
	buffer: TypedArray,
	options?: { width?: number; height?: number; depth?: number; center?: [number, number, number] },
) {
	let { width, height, depth, center } = {
		...defaultPrism,
		...options,
	};

	// https://math.stackexchange.com/questions/3537762/random-point-in-a-triangle
	for (let i = 0; i < buffer.length; i += 3) {
		let r1 = Math.random();
		let r2 = Math.random();

		// Diagonal flipping logic
		if (r1 + r2 > 1) {
			r1 = 1 - r1;
			r2 = 1 - r2;
		}

		let x, y, z;

		// Randomly choose one of the six faces of the prism
		let face = Math.floor(Math.random() * 3);

		// Generate random points on the selected face
		switch (face) {
			case 0: // Front face
				x = (2 * r1 - 1) * width + width * r2;
				y = (2 * r2 - 1) * height;
				z = depth;
				break;
			case 1: // Back face
				x = (2 * r1 - 1) * width + width * r2;
				y = (2 * r2 - 1) * height;
				z = -depth;
				break;
			case 2: // Top face

				let side = Math.floor(Math.random() * 3); // Randomly select a side (0, 1, or 2)
				let r = Math.random();

				// Depending on the selected side, calculate the points on the perimeter
				if (side === 0) {
					// Side 0 (bottom side)
					x = r * 2 * width;
					y = 0;
				} else if (side === 1) {
					// Side 1 (left side)
					x = r * width;
					y = r * 2 * height;
				} else {
					// Side 2 (rights side)
					x = 2 * width + r * -width;
					y = 2 * r * height;
				}

				x += -width;
				y += -height;

				z = (2 * r2 - 1) * depth;
				break;
		}

		buffer[i] = x - center[0];
		buffer[i + 1] = y - center[1];
		buffer[i + 2] = z - center[2];
	}

	return buffer;
}
