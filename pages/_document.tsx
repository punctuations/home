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
          
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-Q290BD7D61"></script>
          <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-Q290BD7D61');
          </script>
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
