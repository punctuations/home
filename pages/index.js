import Head from "next/head";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Tooltip } from "@material-ui/core";
import Lanyard from "../lib/components/lanyard.jsx";
import Nav from "../lib/components/nav.jsx";
import Socials from "../lib/core/socials";
import { theme, Toggle } from "../lib/core/toggle";
import { NextSeo } from "next-seo";
import { motion } from "framer-motion";
import useSWR from "swr";
import moment from "moment-timezone";

const Skeleton = dynamic(() => import("react-skeleton-loader"), { ssr: false });
const Flag = dynamic(() => import("react-flagpack"), { ssr: false });

export async function getStaticProps() {
	const fetcher = (url) =>
		fetch(url, { mode: "no-cors" }).then((r) => r.json());

	const weather = await fetcher(
		"http://api.weatherapi.com/v1/current.json?key=e900e6ba03db4c49939213648202912&q=Vancouver"
	);

	const gh = await fetcher("https://api.github.com/users/punctuations");

	return {
		props: {
			weather,
			gh,
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
	const { data: gh } = useSWR(
		"https://api.github.com/users/punctuations",
		fetcher,
		{ initialData: props.gh }
	);

	const [time, setTime] = useState(null);

	setInterval(() => {
		setTime(moment.tz("America/Vancouver").format());
	}, 1000);

	return (
		<>
			<Head>
				<link rel="icon" href="https://github.com/punctuations.png" />
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

			<div className="z-10 cursor-pointer absolute left-6 top-6 text-black dark:text-white">
				<Toggle />
			</div>

			<section className="absolute w-full h-full 2xl:top-auto xl:top-auto lg:top-auto md:top-auto sm:top-auto top-2/12 flex flex-row items-center justify-center select-none cursor-default">
				<div className="2xl:grid xl:grid lg:grid md:grid sm:flex flex flex-col grid-cols-2 place-content-center 2xl:space-y-0 xl:space-y-0 lg:space-y-0 md:space-y-0 sm:space-y-0 space-y-6">
					<section>
						<header>
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
								className="text-7xl font-bold dark:font-semibold tracking-wide dark:tracking-normal text-white dark:text-black header dark:header-dark"
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

						<section className="flex flex-col">
							<motion.div
								className="inline-flex text-black dark:text-white"
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
									<Tooltip
										title={
											<Flag
												className="select-none"
												size="S"
												code="CA"
												hasBorderRadius
												hasBorder={false}
											/>
										}
										placement="right"
									>
										<a
											href="https://vancouver.ca"
											rel="noopener noreferrer"
											target="_blank"
											className="font-medium"
										>
											Vancouver, British Columbia{" "}
										</a>
									</Tooltip>
								</p>
							</motion.div>
						</section>
					</section>
					<section className="flex items-center justify-center">
						<motion.div
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
							className="p-4 shadow-xl hover:shadow-2xl transition-shadow duration-500 flex flex-col space-x-4 space-y-4 rounded-lg w-11/12 border-gray-300 dark:border-gray-900 border"
						>
							<div className="flex 2xl:flex-row xl:flex-row lg:flex-row md:flex-col sm:flex-col flex-col">
								{gh ? (
									<>
										<figure className="relative flex flex-col justify-center items-center">
											<img
												src="https://github.com/punctuations.png"
												className="rounded-full max-w-28 max-h-28 hover:scale-105 transform-gpu transition-transform duration-300"
											/>
											<figcaption className="p-1 px-4 bg-purple-500 text-white font-medium rounded-lg absolute -bottom-3 hover:scale-105 transform-gpu transition-transform duration-300">
												PRO
											</figcaption>
										</figure>
										<div className="flex flex-col space-y-5">
											<header className="flex flex-row items-center justify-between ml-4">
												<h3 className="text-4xl font-medium text-gray-900 dark:text-gray-200">
													matt
												</h3>
												<a
													href="https://github.com/punctuations/"
													target="_blank"
												>
													<p className="-mt-3 border-gray-300 hover:bg-purple-500 border hover:border-transparent p-1 px-3 text-gray-500 hover:text-white rounded-2xl transition-colors duration-300">
														Follow
													</p>
												</a>
											</header>
											<p className="text-gray-400 dark:text-gray-500 text-sm p-1.5 ml-3 font-medium">
												16-year-old Student and Full-Stack JavaScript Engineer{" "}
											</p>
										</div>
									</>
								) : (
									<>
										<figure className="relative flex flex-col justify-center items-center">
											<Skeleton
												widthRandomness="0"
												width="100px"
												height="100px"
												borderRadius="9999px"
											/>
											<Skeleton widthRandomness="0" width="70px" />
										</figure>
										<div className="flex flex-col space-y-5 2xl:w-112 xl:w-112 lg:w-112 md:w-full sm:w-full w-full">
											<header className="flex flex-row items-center justify-between ml-4">
												<h3>
													<Skeleton
														widthRandomness="0"
														height="20px"
														width="90px"
													/>
												</h3>
												<a
													href="https://github.com/punctuations/"
													target="_blank"
												>
													<p className="-mt-3 border-gray-300 hover:bg-purple-500 border hover:border-transparent p-1 px-3 text-gray-500 hover:text-white rounded-2xl transition-colors duration-300">
														Follow
													</p>
												</a>
											</header>
											<p className="p-1.5 ml-3">
												<Skeleton
													widthRandomness={0.06}
													height="15px"
													width="350px"
													count={2}
												/>
												<Skeleton
													widthRandomness={0}
													height="15px"
													width="100px"
												/>
											</p>
										</div>
									</>
								)}
							</div>
							<hr />
							<div className="flex flex-row justify-around items-center">
								{Socials.map((socials, i) => {
									return (
										<motion.div
											className="mt-1"
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
						</motion.div>
					</section>
				</div>
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
