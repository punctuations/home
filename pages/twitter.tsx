import { useEffect } from "react";
import Head from "next/head";
import { NextSeo } from "next-seo";

export default function Twitter() {
  useEffect(() => {
    window.location.href = "https://twitter.com/atmattt";
  }, []);
  return (
    <>
      <Head>
        <link rel="icon" href="https://github.com/punctuations.png" />
        <meta name="theme-color" content="#2f3136" />
      </Head>
      <NextSeo
        title="twitter"
        titleTemplate="%s | matt"
        description="Student and Typescript Developer."
        openGraph={{
          type: "website",
          url: "https://dont-ping.me/",
          title: "twitter - matt",
          description: "Student and Typescript Developer.",
          images: [
            {
              url: "https://presence.vercel.app/api/twitter/card/atmattt?bg=2f3136&text=fff&type=png",
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

      <div>
        <a href={"https://twitter.com/atmattt"}>Redirecting...</a>
      </div>
    </>
  );
}
