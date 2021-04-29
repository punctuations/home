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

      <Page />

      <Grid>
        <Nav />

        {Project.map((project, i) => {
          return (
            <motion.div
              className="2xl:mr-24 xl:mr-24 lg:mr-24 mr-4"
              key={i}
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
              {project}
            </motion.div>
          );
        })}
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
