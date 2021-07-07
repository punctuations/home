import { useEffect } from "react";
import { Main } from "../lib/assets/main";
import Head from "next/head";
import { NextSeo } from "next-seo";

export default function Discord() {
  useEffect(() => {
    window.location.href = "https://discord.gg/R3QtA68Cbf";
  }, []);
  return (
    <>
      <Head>
        <link rel="icon" href="https://github.com/punctuations.png" />
        <meta name="theme-color" content="#2f3136" />
      </Head>
      <NextSeo
        title="discord"
        titleTemplate="%s | matt.mdx"
        description="Student and Typescript Developer."
        openGraph={{
          type: "website",
          url: "https://dont-ping.me/",
          title: "discord - matt.mdx",
          description: "Student and Typescript Developer.",
          images: [
            {
              url: "https://presence.vercel.app/api/discord/user/291050399509774340?bg=2f3136&text=fff&desc=f8f8ff&accent=fff&type=png",
              width: 955,
              height: 295,
            },
          ],
        }}
        twitter={{
          handle: "@atmattt",
          site: "@atmattt",
          cardType: "summary_large_image",
        }}
      />

      <Main>
        <a href={"https://discord.gg/R3QtA68Cbf"}>Redirecting...</a>
      </Main>
    </>
  );
}
