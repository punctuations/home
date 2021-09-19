import React from "react";

import { motion } from "framer-motion";
import Message from "./Message";

export function Intro(props: { children: React.ReactNode }) {
  const intro = {
    show: {
      opacity: 100,
    },
    hide: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        duration: 3.5,
        ease: [0.87, 0, 0.13, 1],
      },
    },
  };

  const [introduction, setIntro] = React.useState<boolean>(true);

  return (
    <>
      {introduction && (
        <motion.div
          variants={intro}
          initial="show"
          animate="hide"
          className="absolute w-full h-full flex items-center justify-center z-40"
          onAnimationComplete={() => setIntro(false)}
        >
          <Message.Provider>
            <Message text={"Hey, I'm Matt :)"} />
            <Message text={"I'm a Typescript Developer!"} />
          </Message.Provider>
          <button
            onClick={() => setIntro(false)}
            className="z-50 absolute bottom-12 right-12 text-lg text-black dark:text-white transition-colors duration-500 dark:hover:text-green-400 hover:text-green-500"
          >
            skip &#xbb;
          </button>
        </motion.div>
      )}

      {!introduction && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              delay: 0.5,
            },
          }}
        >
          {props.children}
        </motion.section>
      )}
    </>
  );
}
