import Head from "next/head";
import { Toggle } from "../lib/core/toggle";
import Proj from "../lib/core/proj";
import Nav from "../lib/components/nav.jsx";
import { NextSeo } from "next-seo";
import { AnimateSharedLayout, motion } from "framer-motion";
import Lanyard from "../lib/components/lanyard";

export default function Projects() {
	return (
		<>
			<Head>
				<link rel="icon" href="/favicon.ico" />
				<meta name="theme-color" content="#2f3136" />
			</Head>
			<NextSeo
				title="projects"
				titleTemplate="%s | matt.mdx"
				description="Student and Full-Stack JavaScript Engineer."
				openGraph={{
					type: "website",
					url: "https://dont-ping.me/",
					title: "projects - matt.mdx",
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

			<div className="z-10 cursor-pointer absolute left-6 top-6 text-black dark:text-white">
				<Toggle />
			</div>

			<section className="absolute w-full h-full 2xl:top-1/12 xl:top-1/12 lg:top-1/12 md:top-1/12 sm:top-1/12 top-6/12 flex flex-col justify-evenly select-none cursor-default">
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
					className="2xl:ml-32 xl:ml-32 lg:ml-32 md:ml-32 sm:ml-32 ml-16"
				>
					<h1 className="2xl:text-5xl xl:text-5xl lg:text-5xl md:text-5xl sm:text-3xl text-3xl font-bold dark:font-semibold tracking-normal dark:tracking-wide text-white dark:text-black header dark:header-dark">
						projects
					</h1>
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
						className="mt-2 2xl:text-xl xl:text-xl lg:text-xl md:text-xl sm:text-lg text-lg font-medium text-gray-400 dark:text-gray-400"
					>
						A list of all my current my projects.
					</motion.p>
				</motion.header>

				<section>
					<motion.div className="2xl:grid xl:grid lg:grid md:grid sm:grid flex flex-col items-center justify-center space-x-3 2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 2xl:gap-x-8 xl:gap-x-8 lg:gap-x-7 md:gap-x-6 sm:gap-x-2 gap-x-0 2xl:gap-y-3 xl:gap-y-3 lg:gap-y-3 md:gap-y-3 sm:gap-y-3 gap-y-3">
						{Proj.map((content, i) => {
							return (
								<motion.div
									key={i}
									transition={{
										duration: 0.5,
										ease: [0.4, 0, 0.2, 1],
									}}
									whileHover={{
										scale: 1.03,
									}}
									initial={{ y: 20, opacity: 0 }}
									animate={{
										y: 0,
										opacity: 1,
										transition: {
											duration: 0.4,
											delay: 0.15 + (i / 100 + 0.05) * 5,
											ease: [0.48, 0.15, 0.25, 0.96],
										},
									}}
									className="shadow-xl hover:shadow-2xl transition-shadow duration-500 flex flex-col space-x-4 space-y-4 rounded-lg w-11/12 2xl:ml-4 xl:ml-4 lg:ml-3 md:ml-2 sm:ml-1 ml-0 border-gray-300 dark:border-gray-900 border"
								>
									<div className="flex 2xl:flex-row xl:flex-row lg:flex-row md:flex-col sm:flex-col flex-col">
										{content}
									</div>
								</motion.div>
							);
						})}
					</motion.div>
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
