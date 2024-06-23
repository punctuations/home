"use client";

import Lanyard from "@/components/dom/Lanyard";
import Listen from "@/components/dom/Listen";
import { Socials } from "@/components/dom/Socials";
// import { Project } from '@/components/dom/projects';
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { motion } from "framer-motion";

import "src/styles/extended.css";
// import { Background } from "@/components/canvas/Background";

export default function Page() {
	const code = useSearchParams().get("code");

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
					Hi, I&apos;m Matt 👋
				</motion.h3>
				<div className='text-gray-400'>
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
						I&apos;m a nineteen-year-old software developer
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
						Currently I&apos;m a student studying both Computer Science and Mathematics.
					</motion.p>
					{/* <motion.p
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
						Come check out what I&apos;m up to on{" "}
						<a
							href='https://blog.mattt.space'
							className='text-white hover:text-gray-300 transition-colors duration-500 underline'
						>
							my blog!
						</a>
					</motion.p> */}
				</div>
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
			<Suspense fallback={null}>
				{/* <Background className="z-10 fixed w-full h-full flex justify-center items-center" /> */}
			</Suspense>
		</main>
	);
}
