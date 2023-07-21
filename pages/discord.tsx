import { useEffect } from "react";
import Head from "next/head";
import { NextSeo } from "next-seo";

export default function Discord() {
	useEffect(() => {
		window.location.href = "https://discord.gg/R3QtA68Cbf";
	}, []);
	return (
		<>
			<Head>
				<link rel="icon" href="https://github.com/punctuations.png" />
				<meta name="theme-color" content="#2f3136" />
			</Head>
			<NextSeo
				title="discord"
				titleTemplate="%s | matt"
				description="Student and Typescript Developer."
				openGraph={{
					type: "website",
					url: "https://dont-ping.me/",
					title: "discord - matt",
					description: "Student and Typescript Developer.",
					images: [
						{
							url: "https://presence.im/api/discord/user/291050399509774340?bg=2f3136&text=fff&desc=f8f8ff&accent=fff&type=png",
							width: 955,
							height: 295,
						},
					],
				}}
				twitter={{
					handle: "@mttskbl",
					site: "@mttskbl",
					cardType: "summary_large_image",
				}}
			/>

			<div>
				<a href={"https://discord.gg/R3QtA68Cbf"}>Redirecting...</a>
			</div>
		</>
	);
}
