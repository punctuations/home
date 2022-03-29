import { motion } from "framer-motion";
import { Socials } from "../assets/socials";
import Message from "./Message";
import ntw from "number-to-words";

const Header = () => {
  return (
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
      <Message.Provider
        className="2xl:flex xl:flex lg:flex hidden"
        pfp={"https://github.com/punctuations.png"}
      >
        <Message text={"👀💬"} />
      </Message.Provider>
      <h1 className="text-center 2xl:text-6xl xl:text-6xl lg:text-6xl md:text-5xl sm:text-4xl text-3xl font-bold dark:text-white">
        Hey, I'm Matt <span className="wave">👋</span>
      </h1>
      <p className="text-center 2xl:text-xl xl:text-xl lg:text-xl md:text-lg text-base text-gray-400">
        I'm a {ntw.toWords(new Date().getFullYear() - 2005)}-year-old TypeScript
        developer!
      </p>
      <div className="flex space-x-9">
        {Socials.map((socials, i) => {
          return (
            <motion.div
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
              {socials}
            </motion.div>
          );
        })}
      </div>
    </motion.header>
  );
};

export default Header;
