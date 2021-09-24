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
import Notification from "../lib/ui/Notification";

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
        <div className="absolute z-50 top-0 right-2 w-1/4">
          <Notification
            href={"https://github.com/punctuations/home"}
            variant={"macOS"}
            app={"Launch"}
            title={"👀💬"}
            text={"The new UI has launched!"}
          >
            <img
              alt={"launch icon"}
              src="https://cdn.discordapp.com/attachments/708830079551275098/890787858862968872/unknown.png"
              className="rounded"
            />
          </Notification>
        </div>
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
