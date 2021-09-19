import Head from "next/head";
import { NextSeo } from "next-seo";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

import { Grid } from "../lib/assets/grid";
import { Presence } from "../lib/assets/presence";
import { Extras } from "../lib/assets/extras";

import Page from "../lib/ui/page";

import Nav from "../lib/assets/nav";
import { Project } from "../lib/assets/project";
import Lanyard from "../lib/ui/lanyard";
import { Toggle } from "../lib/assets/toggle";
import Fullscreen from "../lib/ui/fullscreen";
import { Language } from "../lib/ui/language";

export default function Projects() {
  const router = useRouter();
  return (
    <>
      <Head>
        <link rel="icon" href="https://github.com/punctuations.png" />
        <meta name="theme-color" content="#2f3136" />
      </Head>
      <NextSeo
        title="projects"
        titleTemplate="%s | matt.mdx"
        description="Student and Typescript Developer."
        openGraph={{
          type: "website",
          url: "https://dont-ping.me/",
          title: "projects - matt.mdx",
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

      <Grid>
        <Nav />

        <section className="2xl:absolute xl:absolute left-5 top-24 2xl:mt-0 xl:mt-0 mt-12 2xl:grid xl:grid flex flex-col 2xl:space-y-0 xl:space-y-0 space-y-2 grid-cols-2 grid-flow-row gap-x-10 gap-y-8 h-5/12 2xl:w-5/6 xl:w-5/6 w-2/3 pb-5">
          {Project.map((project, i) => {
            return (
              <motion.div
                key={project.name}
                className={`relative overflow-hidden flex flex-col justify-center space-y-2 w-full 2xl:h-80 h-64 p-4 px-12 shadow-md hover:shadow-lg transition-shadow duration-500 dark:border-2 border-${`${
                  project.color.split("-")[1]
                }${
                  project.color.split("-")[2]
                    ? `-${project.color.split("-")[2]}`
                    : ""
                }`} ${project.color} dark:${project.dark_color} ${
                  project.text
                } dark:${project.dark_text} rounded-md`}
                initial={{ y: 20, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.4,
                    delay: 0.2 + (i / 100 + 0.05) * 5,
                    ease: [0.48, 0.15, 0.25, 0.96],
                  },
                }}
              >
                <header className="z-10 h-full w-full flex flex-col items-center mt-3 justify-start space-x-3">
                  <h3 className="2xl:text-3xl xl:text-2xl lg:text-2xl md:text-2xl sm:text-2xl text-lg flex items-center justify-center">
                    <span className="2xl:text-5xl xl:text-4xl lg:text-4xl md:text-4xl sm:text-4xl text-2xl">
                      {project.icon}
                    </span>
                    {project.name}
                  </h3>
                  <p className="2xl:pl-2 xl:pl-2 lg:pl-2 md:pl-2 sm:pl-2 pl-0 2xl:text-lg xl:text-base lg:text-base md:text-base sm:text-base text-xs opacity-50">
                    {project.description}
                  </p>
                </header>
                <div className="w-full 2xl:ml-20 2xl:pb-8 2xl:text-2xl 2xl:h-full h-1/2 flex justify-start">
                  <button
                    onClick={() => router.push(project.default)}
                    className="external outline-none"
                  >
                    <span className="hover:underline">Check it out</span>
                  </button>
                </div>

                <img
                  src={project.image}
                  alt={`${project.name} website`}
                  className="select-none pointer-events-none absolute 2xl:w-7/12 xl:w-96 lg:w-96 md:w-96 sm:w-96 w-11/12 2xl:-right-18 xl:-right-8 lg:-right-8 md:-right-8 sm:-right-40 -right-36 2xl:-bottom-20 xl:-bottom-20 lg:-bottom-20 md:-bottom-20 sm:-bottom-18 -bottom-9"
                />
              </motion.div>
            );
          })}
        </section>
      </Grid>

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
