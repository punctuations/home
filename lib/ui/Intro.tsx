import React from "react";
import { useKeyPress } from "ahooks";

import { AnimatePresence, motion } from "framer-motion";
import Message from "./Message";
import { LangContext } from "../assets/LangProvider";

export function Intro(props: { refer: string; children: React.ReactNode }) {
  const { lang } = React.useContext(LangContext);

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

  React.useEffect(() => {
    if (
      props.refer.startsWith("http://0.0.0.0:3000") ||
      props.refer.startsWith("http://localhost:3000") ||
      props.refer.startsWith("https://dont-ping.me")
    ) {
      setIntro(false);
    }
  }, []);

  useKeyPress("ENTER", () => setIntro(false));

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
            <Message hide text={lang.phrases.intro.name} />
            <Message text={lang.phrases.intro.short} />
          </Message.Provider>
          <button
            onClick={() => setIntro(false)}
            className="appearance-none focus:outline-none z-50 absolute bottom-12 right-12 text-lg text-black dark:text-white transition-colors duration-500 dark:hover:text-green-400 hover:text-green-500"
          >
            {lang.phrases.intro.skip} {props.refer} &#xbb;
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {!introduction && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                when: "beforeChildren",
              },
            }}
          >
            {props.children}
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
