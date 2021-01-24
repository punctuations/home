import Head from "next/head";
import { theme, Toggle } from "../components/toggle";
import Proj from "../components/proj";
import Nav from "../components/nav.jsx";
import { NextSeo } from "next-seo";
import { motion } from "framer-motion";

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
							height: "200px",
						},
					],
				}}
				twitter={{
					handle: "@atmattt",
					site: "@atmattt",
					cardType: "summary_large_image",
				}}
			/>

			<div className="cursor-pointer absolute left-12 top-1/2 text-black dark:text-white">
				<Toggle />
			</div>
			<section className="absolute flex flex-col top-2/12 select-none cursor-default">
				{theme() ? (
					<motion.header
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
						className="relative left-1/2 text-5xl font-semibold tracking-wide text-black header-dark"
					>
						matt
					</motion.header>
				) : (
					<motion.header
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
						className="relative left-1/2 text-5xl font-bold text-white header"
					>
						matt
					</motion.header>
				)}

				<section className="relative left-1/2 flex flex-col">
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

					<motion.p
						className="m-4 font-semibold text-5xl text-black dark:text-white"
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
					>
						404: Page not found.
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
									delay: 0.25,
									ease: [0.48, 0.15, 0.25, 0.96],
								},
							}}
							className="ml-2 text-lg font-normal text-gray-400 dark:text-gray-400"
						>
							Sorry! The specified location doesn't exist, please make sure you
							have the correct URL and try again.
						</motion.p>
					</motion.p>
				</section>
			</section>
			<Nav />
		</>
	);
}
