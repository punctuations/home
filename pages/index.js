import Head from "next/head";
import { useState } from "react";
import Song from "../components/song.jsx";
import Nav from "../components/nav.jsx";
import Socials from "../components/socials";
import { theme, Toggle } from "../components/toggle";
import { NextSeo } from "next-seo";
import { motion } from "framer-motion";
import useSWR from "swr";
import moment from "moment-timezone";

export async function getStaticProps() {
	const fetcher = (url) =>
		fetch(url, { mode: "no-cors" }).then((r) => r.json());

	const weather = await fetcher(
		"http://api.weatherapi.com/v1/current.json?key=e900e6ba03db4c49939213648202912&q=Vancouver"
	);

	return {
		props: {
			weather,
		},
	};
}

export default function Home(props) {
	const fetcher = (...args) =>
		fetch(...args, { mode: "no-cors" }).then((r) => r.json());
	const {
		data: weather,
	} = useSWR(
		"http://api.weatherapi.com/v1/current.json?key=e900e6ba03db4c49939213648202912&q=Vancouver",
		fetcher,
		{ initialData: props.weather, revalidateOnMount: true }
	);

	const [time, setTime] = useState(null);

	setInterval(() => {
		setTime(moment.tz("America/Vancouver").format());
	}, 1000);

	return (
		<>
			<Head>
				<link rel="icon" href="/favicon.ico" />
				<meta name="theme-color" content="#2f3136" />
			</Head>
			<NextSeo
				title="portfolio"
				titleTemplate="%s | matt.mdx"
				description="Student and Full-Stack JavaScript Engineer."
				openGraph={{
					type: "website",
					url: "https://dont-ping.me/",
					title: "portfolio - matt.mdx",
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
						className="relative left-full text-5xl font-semibold tracking-wide text-black header-dark"
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
						className="relative left-full text-5xl font-bold text-white header"
					>
						matt
					</motion.header>
				)}

				<section className="relative left-full flex flex-col">
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

					<motion.div
						className="inline-flex mt-3 text-black dark:text-white"
						initial={{
							y: 20,
							opacity: 0,
						}}
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
						{theme() ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								width={20}
								height={20}
								className="mt-2"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
									clipRule="evenodd"
								/>
							</svg>
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								width={20}
								height={20}
								className="mt-2"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						)}
						<p className="text-xl m-1 mt-0.5">
							{new Date(time).toLocaleTimeString("en-US")}
						</p>
					</motion.div>
					<motion.div
						className="inline-flex mt-1 text-black dark:text-white"
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
					>
						{theme() ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								width={20}
								height={20}
								className="mt-2"
							>
								<path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
							</svg>
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								width={20}
								height={20}
								className="mt-2"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
								/>
							</svg>
						)}
						<p className="text-xl m-1 mt-0.5">
							{weather ? weather.current.condition.text : "loading..."} in{" "}
							<a
								href="https://vancouver.ca"
								rel="noopener noreferrer"
								target="_blank"
								className="font-medium"
							>
								Vancouver, British Columbia
							</a>
						</p>
					</motion.div>
					<motion.div
						className="inline-flex mt-4"
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
						<Song />
					</motion.div>
				</section>
			</section>
			<div className="absolute right-12 top-3/12">
				{Socials.map((socials, i) => {
					return (
						<motion.div
							key={i}
							initial={{ y: 20, opacity: 0 }}
							animate={{
								y: 0,
								opacity: 1,
								transition: {
									duration: 0.4,
									delay: 0.35 + (i / 100 + 0.05) * 5,
									ease: [0.48, 0.15, 0.25, 0.96],
								},
							}}
						>
							{socials}
						</motion.div>
					);
				})}
			</div>
			<Nav />
		</>
	);
}
