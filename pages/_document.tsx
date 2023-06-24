import Document, {
	DocumentContext,
	Html,
	Head,
	Main,
	NextScript,
} from "next/document";

class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);
		return initialProps;
	}

	render() {
		return (
			<Html>
				<Head>
					<script async src="https://cdn.splitbee.io/sb.js" />

					{/* Global Site Tag (gtag.js) - Google Analytics */}
					{/* Necessary to prevent error: window.gtag is not defined for Next.js-hydration */}
					<script
						dangerouslySetInnerHTML={{
							__html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `,
						}}
					/>
				</Head>
				<body className="light-select dark:dark-select 2xl:overflow-hidden xl:overflow-hidden overflow-auto bg-white dark:bg-black bg dark:bg-dark transition-colors duration-300 ease-in-out">
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
export default MyDocument;
