import Head from "next/head";
import { NextSeo } from "next-seo";
import { motion } from "framer-motion";

import { Grid } from "../lib/assets/grid";
import { Presence } from "../lib/assets/presence";
import { Extras } from "../lib/assets/extras";

import Page from "../lib/ui/page";

import Nav from "../lib/assets/nav";
import { Project } from "../lib/assets/project";
import Lanyard from "../lib/ui/lanyard";
import { Toggle } from "../lib/assets/toggle";
import Fullscreen from "../lib/ui/fullscreen";

export default function Projects() {
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

      <Grid>
        <Nav />

        <section className="absolute 2xl:grid xl:grid flex flex-col 2xl:space-y-0 xl:space-y-0 space-y-5 grid-cols-3 grid-rows-3 gap-x-10 gap-y-8 h-5/6 2xl:w-5/6 xl:w-5/6 w-2/3 ">
          {Project.map((project, i) => {
            return (
              <motion.div
                className="flex flex-col justify-center space-y-2 w-full p-4 px-12 shadow-lg hover:shadow-xl transition-shadow duration-500 bg-white dark:bg-black dark:text-white dark:border border-gray-800 rounded-md"
                key={project.name}
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
                <header className="flex flex-row space-x-3">
                  <h2 className="text-4xl">{project.icon}</h2>
                  <h3 className="text-2xl">{project.name}</h3>
                </header>
                <p className="pl-2 text-gray-400">{project.description}</p>
                <div className="flex flex-row space-x-4">
                  {project.links.map((social, s) => {
                    return (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{
                          y: 0,
                          opacity: 1,
                          transition: {
                            duration: 0.4,
                            delay: 0.25 + (s / 100 + 0.05) * 5 + (i % 3) / 4,
                            ease: [0.48, 0.15, 0.25, 0.96],
                          },
                        }}
                      >
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {social.svg}
                        </a>
                      </motion.div>
                    );
                  })}
                </div>
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
        <Fullscreen />
      </Extras>
    </>
  );
}
