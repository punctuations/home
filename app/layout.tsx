import GoogleAnalytics from "@/components/dom/GoogleAnalytics";
import { Layout } from "@/components/dom/Layout";
import "@/global.css";
import { Metadata } from "next";

const TRACKING_ID = process.env.NEXT_PUBLIC_GA4_TRACKING_ID!;

export const metadata: Metadata = {
	title: "Matt's space",
	description: "Student and Developer.",
	openGraph: {
		images: "/opengraph-image.png",
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang='en' className='antialiased'>
			{/*
        		<head /> will contain the components returned by the nearest parent
        		head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      		*/}
			<head />
			<body>
				{TRACKING_ID ? <GoogleAnalytics ga_id={TRACKING_ID} /> : null}
				<Layout>{children}</Layout>
			</body>
		</html>
	);
}
