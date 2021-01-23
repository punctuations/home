import Head from "next/head";
import { theme, Toggle } from "../components/toggle";
import Proj from "../components/proj";
import Nav from "../components/nav";
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

			<div className="cursor-pointer absolute left-12 top-1/2 text-black dark:text-white">
				<Toggle />
			</div>
			<section className="flex flex-col ml-96 mt-32 select-none cursor-default">
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
						className="text-5xl font-semibold tracking-wide text-black header-dark"
					>
						projects
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
						className="text-5xl font-bold text-white header"
					>
						projects
					</motion.header>
				)}

				<section className="flex flex-col">
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
						className="mt-2 text-xl font-medium text-gray-400 dark:text-gray-400"
					>
						A list of all my current my projects.
					</motion.p>

					{Proj.map((content, i) => {
						return (
							<motion.div
								className="m-3 shadow-sm flex flex-row rounded-lg border border-gray-200 dark:border-gray-700 w-1/2 text-black dark:text-white"
								key={i}
								whileHover={{
									scale: 1.03,
									transition: {
										duration: 0.5,
										ease: "anticipate",
									},
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
							>
								{content}
							</motion.div>
						);
					})}
				</section>
			</section>
			<Nav />
		</>
	);
}
