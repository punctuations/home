import Head from "next/head";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

import { Main } from "../lib/assets/main";
import { Presence } from "../lib/assets/presence";
import { Extras } from "../lib/assets/extras";

import Page from "../lib/ui/page";

import Nav from "../lib/assets/nav";
import Header from "../lib/ui/header";
import Card from "../lib/ui/card";
import Lanyard from "../lib/ui/lanyard";
import { Toggle } from "../lib/assets/toggle";
import Fullscreen from "../lib/ui/fullscreen";
import { Intro } from "../lib/ui/Intro";

export default function Home() {
  const { query } = useRouter();
  return (
    <>
      <Head>
        <link rel="icon" href="https://github.com/punctuations.png" />
        <meta name="theme-color" content="#2f3136" />
      </Head>
      <NextSeo
        title="home"
        titleTemplate="%s | matt.mdx"
        description="Student and Typescript Developer."
        openGraph={{
          type: "website",
          url: "https://dont-ping.me/",
          title: "home - matt.mdx",
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

      <Intro>
        <Page />

        <Main>
          <Nav />

          <Header />
          {/*<Card />*/}
        </Main>

        <Presence>
          <Lanyard />
        </Presence>

        <Extras>
          <Toggle />
          <Fullscreen
            query={Array.isArray(query.code) ? query.code[0] : query.code}
          />
        </Extras>
      </Intro>
    </>
  );
}
