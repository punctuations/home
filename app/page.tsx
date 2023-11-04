'use client';

import Lanyard from '@/components/dom/Lanyard';
import Listen from '@/components/dom/Listen';
import { Socials } from '@/components/dom/Socials';
import { Project } from '@/components/dom/projects';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import 'src/styles/extended.css';

const Dots = dynamic(() => import('@/components/canvas/Shapes').then((mod) => mod.Dots), { ssr: false });
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

export default function Page() {
	const code = useSearchParams().get('code');
	const router = useRouter();

	return (
		<main className='relative w-full h-full flex items-center justify-center text-white'>
			<section className='z-30 text-center space-y-6'>
				<motion.h3
					initial={{ y: 20, opacity: 0 }}
					animate={{
						y: 0,
						opacity: 1,
						transition: {
							duration: 0.4,
							delay: 0.2,
							ease: [0.48, 0.15, 0.25, 0.96],
						},
					}}
					exit={{ y: 20, opacity: 0 }}
					className='text-5xl font-bold mb-2'
				>
					Hi, I'm Matt 👋
				</motion.h3>
				<desc className='text-gray-400'>
					<motion.p
						initial={{ y: 20, opacity: 0 }}
						animate={{
							y: 0,
							opacity: 1,
							transition: {
								duration: 0.4,
								delay: 0.25,
								ease: [0.48, 0.15, 0.25, 0.96],
							},
						}}
						exit={{ y: 20, opacity: 0 }}
						className='text-lg'
					>
						I'm an eighteen-year-old software developer
					</motion.p>
					<motion.p
						initial={{ y: 20, opacity: 0 }}
						animate={{
							y: 0,
							opacity: 1,
							transition: {
								duration: 0.4,
								delay: 0.3,
								ease: [0.48, 0.15, 0.25, 0.96],
							},
						}}
						exit={{ y: 20, opacity: 0 }}
					>
						Currently I'm a student studying both Computer Science and Linguistics.
					</motion.p>
					<motion.p
						initial={{ y: 20, opacity: 0 }}
						animate={{
							y: 0,
							opacity: 1,
							transition: {
								duration: 0.4,
								delay: 0.35,
								ease: [0.48, 0.15, 0.25, 0.96],
							},
						}}
						exit={{ y: 20, opacity: 0 }}
						className='mt-2'
					>
						Come check out what I'm up to on{' '}
						<a
							href='https://blog.mattt.space'
							className='text-white hover:text-gray-300 transition-colors duration-500 underline'
						>
							my blog!
						</a>
					</motion.p>
				</desc>
				<ul className='flex justify-around'>
					{Socials.map((s, i) => {
						return (
							<motion.li
								key={s.key}
								initial={{ y: 20, opacity: 0 }}
								animate={{
									y: 0,
									opacity: 1,
									transition: {
										duration: 0.4,
										delay: 0.25 + i * 0.05,
										ease: [0.48, 0.15, 0.25, 0.96],
									},
								}}
								exit={{ y: 20, opacity: 0 }}
							>
								{s}
							</motion.li>
						);
					})}
				</ul>
			</section>

			<div className='fixed z-30 px-5 bottom-5 flex w-full justify-between'>
				<Lanyard />
				<Listen query={code} />
			</div>

			<div className='fixed z-20 w-full h-full bg-black/70' />
			<div className='z-10 fixed w-full h-full flex justify-center items-center'>
				<View className='flex flex-col justify-center items-center h-full w-full'>
					<Suspense fallback={null}>
						<Dots position={[0, 0, -2]} />
						<Common color='black' />
					</Suspense>
				</View>
			</div>
		</main>
	);
}
