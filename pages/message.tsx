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
import { Language } from "../lib/ui/language";
import { motion } from "framer-motion";
import Form from "../lib/ui/form";

export default function Home() {
  const { query } = useRouter();
  return (
    <>
      <Head>
        <link rel="icon" href="https://github.com/punctuations.png" />
        <meta name="theme-color" content="#2f3136" />
      </Head>
      <NextSeo
        title="message"
        titleTemplate="%s | matt.mdx"
        description="Student and Typescript Developer."
        openGraph={{
          type: "website",
          url: "https://dont-ping.me/",
          title: "message - matt.mdx",
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

      <Page />
      <Language />

      <Main>
        <Nav />

        <motion.header
          initial={{
            y: 20,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.4,
              delay: 0.1,
              ease: [0.48, 0.15, 0.25, 0.96],
            },
          }}
          className="2xl:ml-24 xl:ml-24 lg:ml-24 ml-0 flex flex-col justify-center 2xl:items-start xl:items-start lg:items-start items-center space-y-6"
        >
          <div>
            <p className="uppercase font-semibold text-red-400">new</p>
            <h1 className="text-center 2xl:text-6xl xl:text-6xl lg:text-6xl md:text-5xl sm:text-4xl text-3xl font-bold dark:text-white">
              Message
            </h1>
          </div>

          <div>
            <p className="text-center 2xl:text-xl xl:text-xl lg:text-xl md:text-lg text-base text-gray-400">
              Shoot me a message via discord's webhooks!
            </p>
            <p className="text-base text-gray-300">
              Based on conrad's{" "}
              <a className="underline" href="https://send.cnrad.dev">
                send
              </a>
              .
            </p>
          </div>
        </motion.header>
        <Form />
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
    </>
  );
}
