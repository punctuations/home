import { NextSeo } from "next-seo";
import Head from "next/head";

export default function Hi() {
  return (
    <>
      <Head>
        <link rel="icon" href="https://github.com/punctuations.png" />
        <meta name="theme-color" content="#2f3136" />
      </Head>
      <NextSeo
        title="hi"
        titleTemplate="%s | matt.mdx"
        description="Student and Typescript Developer."
        openGraph={{
          type: "website",
          url: "https://dont-ping.me/",
          title: "hi - matt.mdx",
          description: "Student and Typescript Developer.",
          images: [
            {
              url: "https://github.com/punctuations.png",
              width: 400,
              height: 200,
            },
          ],
        }}
        twitter={{
          handle: "@atmattt",
          site: "@atmattt",
          cardType: "summary_large_image",
        }}
      />

      <main className="absolute w-full h-full grid place-content-center">
        <p>hi</p>
      </main>
    </>
  );
}
