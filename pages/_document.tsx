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
      <Html lang="en">
        <Head />
        <body
          className="2xl:overflow-hidden xl:overflow-hidden lg:overflow-hidden overflow-auto bg-white dark:bg-black bg dark:bg-dark transition-colors duration-300 ease-in-out"
          style={{
            backgroundImage:
              "radial-gradient(#e3e3e3 1px,transparent 0), radial-gradient(#e3e3e3 1px,transparent 0)",
            backgroundPosition: "0 0,25px 25px",
            backgroundAttachment: "fixed",
            backgroundSize: "50px 50px",
          }}
        >
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
export default MyDocument;
