'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import 'src/styles/extended.css';

const Dots = dynamic(() => import('@/components/canvas/Shapes').then((mod) => mod.Demo), { ssr: false });
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
	ssr: false,
	loading: () => (
		<div className='flex h-96 w-full flex-col items-center justify-center'>
			<svg className='-ml-1 mr-3 h-5 w-5 animate-spin text-white' fill='none' viewBox='0 0 24 24'>
				<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
				<path
					className='opacity-75'
					fill='currentColor'
					d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
				/>
			</svg>
		</div>
	),
});
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false });

import { Metadata } from 'next';

const metadata: Metadata = {
	title: 'Demo | Space',
};

export default function Demo() {
	return (
		<>
			<div className='z-10 fixed w-full h-full flex justify-center items-center'>
				<View className='flex flex-col justify-center items-center h-full w-full'>
					<Suspense fallback={null}>
						<Dots position={[0, 0, -5]} />
						<Common color='black' />
					</Suspense>
				</View>
			</div>
		</>
	);
}
