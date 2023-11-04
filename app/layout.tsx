import { Layout } from "@/components/dom/Layout";
import "@/global.css";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Matt | Space",
	description: "Student and Developer.",
	openGraph: {
		images: ["/opengraph-image.png"],
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
				<Layout>{children}</Layout>
			</body>
		</html>
	);
}
