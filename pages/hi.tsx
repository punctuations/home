import { NextSeo } from "next-seo";
import Head from "next/head";

import Message from "../lib/ui/Message";

export default function Hi() {
  return (
    <>
      <Head>
        <link rel="icon" href="https://github.com/punctuations.png" />
        <meta name="theme-color" content="#2f3136" />
      </Head>
      <NextSeo
        title="hi"
        titleTemplate="%s | matt"
        description="Student and Typescript Developer."
        openGraph={{
          type: "website",
          url: "https://dont-ping.me/",
          title: "hi - matt",
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
          handle: "@atmattt",
          site: "@atmattt",
          cardType: "summary_large_image",
        }}
      />

      <main className="absolute w-full h-full flex flex-col items-center justify-center">
        <Message.Provider>
          <Message text={"2021-10-1"} />
        </Message.Provider>
      </main>
    </>
  );
}
