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
      <Nav />

      <Grid>
        <section className="2xl:absolute xl:absolute left-5 2xl:mt-0 xl:mt-0 mt-12 2xl:grid xl:grid flex flex-col 2xl:space-y-0 xl:space-y-0 space-y-2 grid-cols-3 grid-flow-row gap-x-10 gap-y-8 h-5/12 2xl:w-5/6 xl:w-5/6 w-2/3">
          {Project.map((project, i) => {
            return (
              <motion.div
                className="relative flex flex-col justify-center space-y-2 w-full p-4 px-12 shadow-md hover:shadow-lg transition-shadow duration-500 bg-white dark:bg-black dark:text-white border dark:border-gray-800 border-black rounded-md"
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
                <a
                  href={project.default}
                  className="2xl:flex xl:flex lg:flex md:flex hidden duration-300 transition-colors absolute top-4 right-4 text-gray-500 hover:text-blue-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
                <header className="flex flex-row space-x-3">
                  <h2 className="text-4xl">{project.icon}</h2>
                  <h3 className="text-2xl">{project.name}</h3>
                </header>
                <p className="pl-2 text-gray-400">{project.description}</p>
                <div className="flex flex-row space-x-4">
                  {project.links.map((social, s) => {
                    return (
                      <motion.div
                        key={social.href}
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
