import Head from "next/head";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

import { Main } from "../lib/assets/main";
import { Presence } from "../lib/assets/presence";
import { Extras } from "../lib/assets/extras";

import Page from "../lib/ui/page";

import Lanyard from "../lib/ui/lanyard";
import { Toggle } from "../lib/assets/toggle";
import Fullscreen from "../lib/ui/fullscreen";
import { motion } from "framer-motion";

export default function Error() {
  const router = useRouter();
  return (
    <>
      <Head>
        <link rel="icon" href="https://github.com/punctuations.png" />
        <meta name="theme-color" content="#2f3136" />
      </Head>
      <NextSeo
        title="404"
        titleTemplate="%s | matt"
        description="Student and Typescript Developer."
        openGraph={{
          type: "website",
          url: "https://dont-ping.me/",
          title: "404 - matt",
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

      <Main>
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
            <p className="uppercase font-semibold text-red-400">404 Error</p>
            <h1 className="text-center 2xl:text-6xl xl:text-6xl lg:text-6xl md:text-5xl sm:text-4xl text-3xl font-bold dark:text-white">
              Page not found
            </h1>
          </div>

          <p className="text-center 2xl:text-xl xl:text-xl lg:text-xl md:text-lg text-base text-gray-400">
            Please check the URL in the address bar and try again.
          </p>
        </motion.header>
        <motion.button
          initial={{
            y: 20,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.4,
              delay: 0.15,
              ease: [0.48, 0.15, 0.25, 0.96],
            },
          }}
          onClick={() => router.push("/")}
          className="place-self-center 2xl:w-1/3 xl:w-1/3 lg:w-1/3 md:w-1/3 sm:w-1/3 w-2/3 px-7 py-4 rounded-md bg-white dark:bg-black text-gray-500 transition-colors duration-300 border border-gray-400 dark:border-gray-800 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white"
        >
          Return &rarr;
        </motion.button>
      </Main>

      <Presence>
        <Lanyard />
      </Presence>

      <Extras>
        <Toggle />
        <Fullscreen
          query={
            Array.isArray(router.query.code)
              ? router.query.code[0]
              : router.query.code
          }
        />
      </Extras>
    </>
  );
}
