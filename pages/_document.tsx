import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentInitialProps,
  DocumentContext,
} from "next/document";
import React, { ReactElement } from "react";

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render(): ReactElement {
    return (
      <Html lang="en">
        <Head />
        <body className="bg-white dark:bg-black bg dark:bg-dark transition-colors duration-300 ease-in-out">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
