import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import localFont from "next/font/local";
import "./globals.css";

const Therma = localFont({
	src: [
		{
			path: "/font/ASTherma-BlackCondensed.otf",
			weight: "900",
			style: "normal",
		},
		{
			path: "/font/ASTherma-BoldCondensed.otf",
			weight: "700",
			style: "normal",
		},
		{
			path: "/font/ASTherma-MediumCondensed.otf",
			weight: "400",
			style: "normal",
		},
		{
			path: "/font/ASTherma-LightCondensed.otf",
			weight: "100",
			style: "normal",
		},
	],
});

export const metadata: Metadata = {
	title: "Matt's Space",
	description: "software developer",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={Therma.className}>
				{children}
				<SpeedInsights />
			</body>
		</html>
	);
}
