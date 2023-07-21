import Head from "next/head";
import React from "react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

import { Main } from "../lib/assets/main";
import { Presence } from "../lib/assets/presence";
import { Extras } from "../lib/assets/extras";

import Page from "../lib/ui/page";

import Nav from "../lib/assets/nav";
import Header from "../lib/ui/header";
import Lanyard from "../lib/ui/lanyard";
import { Toggle } from "../lib/assets/toggle";
import Fullscreen from "../lib/ui/fullscreen";
import { Intro } from "../lib/ui/Intro";

import { Globe } from "../lib/assets/globe";
import { LangProvider } from "../lib/assets/LangProvider";
import Notice from "../lib/ui/notice";

export async function getServerSideProps(ctx: {
	req: { headers: { referer: string } };
}) {
	const refer = ctx.req.headers.referer ?? "";

	return {
		props: {
			refer,
		},
	};
}

export default function Home(props: { refer: string }) {
	const { query } = useRouter();

	return (
		<LangProvider>
			<Head>
				<link rel="icon" href="https://github.com/punctuations.png" />
				<meta name="theme-color" content="#2f3136" />
			</Head>
			<NextSeo
				title="home"
				titleTemplate="%s | matt"
				description="Student and Typescript Developer."
				openGraph={{
					type: "website",
					url: "https://dont-ping.me/",
					title: "home - matt",
					description: "Student and Typescript Developer.",
					images: [
						{
							url: "/full.png",
							width: 1224,
							height: 719,
						},
					],
				}}
				twitter={{
					handle: "@mttskbl",
					site: "@mttskbl",
					cardType: "summary_large_image",
				}}
			/>

			<Intro refer={props.refer}>
				<Page />

				<Main>
					<Nav />
					<Notice />

					<Header />
				</Main>

				<Presence>
					<Lanyard />
				</Presence>

				<Extras>
					<div className="flex flex-row space-x-4">
						<Globe />
						<Toggle />
					</div>

					<Fullscreen
						query={Array.isArray(query.code) ? query.code[0] : query.code}
					/>
				</Extras>
			</Intro>
		</LangProvider>
	);
}
