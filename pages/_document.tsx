import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";

import { useState } from "react";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return initialProps;
  }

  render() {
    let theme = 0;

    if (process.browser) {
      setInterval(() => {
        if (!localStorage.getItem("theme")) {
          theme = 0;
        } else {
          theme = parseInt(localStorage.getItem("theme") as string);
          parseInt(localStorage.getItem("theme") as string)
            ? document.querySelector("html")?.classList.remove("light")
            : document.querySelector("html")?.classList.remove("dark");
          parseInt(localStorage.getItem("theme") as string)
            ? document.querySelector("html")?.classList.add("dark")
            : document.querySelector("html")?.classList.add("light");
        }
      }, 200);
    }

    return (
      <Html lang="en">
        <Head />
        <body className="light-select dark:dark-select dots dark:dots-dark 2xl:overflow-hidden xl:overflow-hidden lg:overflow-hidden overflow-auto bg-white dark:bg-black bg dark:bg-dark transition-colors duration-300 ease-in-out">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
export default MyDocument;
