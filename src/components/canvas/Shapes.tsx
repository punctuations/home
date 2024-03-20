'use client';

import { Points } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef, useState, useEffect } from 'react';

import { Quaternion, Vector3 } from 'three';

import * as random from 'maath/random';
import * as buffer from 'maath/buffer';
import * as misc from 'maath/misc';

import * as path from '@/helpers/path';

import { Bloom, EffectComposer, Noise } from '@react-three/postprocessing';

import { vertex as VertexShader, fragment as FragmentShader } from '@/helpers/shaders';

export const Dots = (props) => {
	const pointsRef = useRef<THREE.Points>(null!);
	const [{ sphere, square, prism, final }] = useState(() => {
		const square = random.inBox(new Float32Array(2_500 * 3), { sides: 4 });
		const sphere = random.inSphere(square.slice(0), { radius: 2.5 });
		const prism = path.inPrism(sphere.slice(0), { width: 2.5, depth: 2 });

		const final = prism.slice(0);

		return { sphere, square, prism, final };
	});

	const [clock, setClock] = useState({ getElapsedTime: () => 0 });

	const rotationAxis = new Vector3(1, 1, 1).normalize();
	const q = new Quaternion();

	useEffect(() => {
		setClock(new THREE.Clock());
	}, []);

	useFrame(() => {
		const et = clock.getElapsedTime();

		const t = misc.remap(Math.sin(0.25 * et), [-1, 1], [0, 1]);

		const t2 = misc.remap(Math.cos(0.25 * et), [-1, 0], [0, 1]);

		path.lpi3([square, sphere, prism], final, t);

		buffer.rotate(square, {
			q: q.setFromAxisAngle(rotationAxis, t2 * 0.01),
		});

		buffer.rotate(sphere, {
			q: q.setFromAxisAngle(rotationAxis, t2 * 0.01),
		});

		buffer.rotate(prism, {
			q: q.setFromAxisAngle(rotationAxis, t2 * 0.01),
		});
	});

	const shaderMaterial = new THREE.ShaderMaterial({
		vertexShader: VertexShader,
		fragmentShader: FragmentShader,
		uniforms: {
			pointSize: { value: 10.0 }, // Set the point size
			pointColor: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
		},
	});

	return (
		<>
			<EffectComposer>
				<Bloom luminanceThreshold={0} luminanceSmoothing={0.1} height={300} />
				<Noise opacity={1} />
			</EffectComposer>
			<Points material={shaderMaterial} positions={final} stride={3} ref={pointsRef} {...props} />
		</>
	);
};

export const Demo = (props) => {
	const pointsRef = useRef<THREE.Points>(null!);
	const [{ sphere, square, prism }] = useState(() => {
		const square = random.inBox(new Float32Array(2_500 * 3), { sides: 4 });
		const sphere = random.inSphere(square.slice(0), { radius: 2.5 });
		const prism = path.inPrism(sphere.slice(0), { width: 2.5, depth: 2 });

		return { sphere, square, prism };
	});

	const [clock, setClock] = useState({ getElapsedTime: () => 0 });

	const rotationAxis = new Vector3(1, 1, 1).normalize();
	const q = new Quaternion();

	useEffect(() => {
		setClock(new THREE.Clock());
	}, []);

	useFrame(() => {
		const et = clock.getElapsedTime();

		const t = misc.remap(Math.cos(et * 0.1), [-1, 1], [0, 1]);

		buffer.rotate(square, {
			q: q.setFromAxisAngle(rotationAxis, t * 0.1),
		});

		buffer.rotate(sphere, {
			q: q.setFromAxisAngle(rotationAxis, t * 0.01),
		});

		buffer.rotate(prism, {
			q: q.setFromAxisAngle(rotationAxis, t * 0.1),
		});
	});

	const shaderMaterial = new THREE.ShaderMaterial({
		vertexShader: VertexShader,
		fragmentShader: FragmentShader,
		uniforms: {
			pointSize: { value: 10.0 }, // Set the point size
			pointColor: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
		},
	});

	return (
		<>
			<EffectComposer>
				<Bloom luminanceThreshold={0} luminanceSmoothing={0.1} height={300} />
				<Noise opacity={1} />
			</EffectComposer>
			<Points material={shaderMaterial} positions={square} stride={3} ref={pointsRef} {...props} />
		</>
	);
};
