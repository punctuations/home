import Head from "next/head";
import { Toggle } from "../lib/core/toggle";
import Nav from "../lib/components/nav.jsx";
import { NextSeo } from "next-seo";
import { motion } from "framer-motion";
import Lanyard from "../lib/components/lanyard";

export default function Projects() {
	return (
		<>
			<Head>
				<link rel="icon" href="/favicon.ico" />
				<meta name="theme-color" content="#2f3136" />
			</Head>
			<NextSeo
				title="404"
				titleTemplate="%s | matt.mdx"
				description="Student and Full-Stack JavaScript Engineer."
				openGraph={{
					type: "website",
					url: "https://dont-ping.me/",
					title: "404 - matt.mdx",
					description: "Student and Full-Stack JavaScript Engineer.",
					images: [
						{
							url: "https://github.com/punctuations.png",
							width: "400px",
							height: "300px",
						},
					],
				}}
				twitter={{
					handle: "@atmattt",
					site: "@atmattt",
					cardType: "summary_large_image",
				}}
			/>

			<div className="z-10 cursor-pointer absolute left-6 top-6 text-black dark:text-white">
				<Toggle />
			</div>

			<section className="absolute w-full h-full 2xl:top-1/12 xl:top-1/12 lg:top-1/12 md:top-1/12 sm:top-1/12 top-auto flex flex-col space-y-0 justify-center select-none cursor-default">
				<header className="2xl:ml-32 xl:ml-32 lg:ml-32 md:ml-32 sm:ml-32 ml-8">
					<motion.h1
						initial={{
							y: 20,
							opacity: 0,
						}}
						animate={{
							y: 0,
							opacity: 1,
							transition: {
								duration: 0.4,
								delay: 0.1,
								ease: [0.48, 0.15, 0.25, 0.96],
							},
						}}
						className="2xl:text-7xl xl:text-7xl lg:text-7xl md:text-7xl sm:text-5xl text-5xl font-bold dark:font-semibold tracking-wide dark:tracking-normal text-white dark:text-black header dark:header-dark"
					>
						matt
					</motion.h1>

					<motion.p
						initial={{
							y: 20,
							opacity: 0,
						}}
						animate={{
							y: 0,
							opacity: 1,
							transition: {
								duration: 0.4,
								delay: 0.15,
								ease: [0.48, 0.15, 0.25, 0.96],
							},
						}}
						className="text-lg font-medium text-gray-400 dark:text-gray-400"
					>
						16-year-old full-stack javascript engineer.
					</motion.p>

					<motion.p
						initial={{
							y: 20,
							opacity: 0,
						}}
						animate={{
							y: 0,
							opacity: 1,
							transition: {
								duration: 0.4,
								delay: 0.15,
								ease: [0.48, 0.15, 0.25, 0.96],
							},
						}}
						className="text-md font-medium text-gray-300 dark:text-gray-500"
					>
						Javascript + Node.js + Next.js
					</motion.p>
				</header>

				<section className="flex justify-center items-center">
					<motion.p
						className="m-4 font-semibold 2xl:text-5xl xl:text-5xl lg:text-5xl md:text-3xl sm:text-2xl text-xl text-black dark:text-white"
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
					>
						404: Page Not Found.
						<motion.p
							className="ml-2 2xl:text-lg xl:text-lg lg:text-lg md:text-lg sm:text-base text-sm font-normal text-gray-400 dark:text-gray-400"
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
						>
							Sorry! The specified location doesn't exist, please make sure you
							have the correct URL and try again.
						</motion.p>
					</motion.p>
				</section>
			</section>
			<motion.div
				className="fixed bottom-7 left-5 inline-flex mt-4"
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
			>
				<Lanyard />
			</motion.div>
			<Nav />
		</>
	);
}
