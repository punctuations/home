import { motion } from "framer-motion";
import { Socials } from "../assets/socials";

const Card = () => {
  return (
    <section className="flex items-center justify-center w-5/6">
      <motion.div
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
        className="p-4 dark:border border-0 border-gray-900 shadow-xl hover:shadow-2xl transition-shadow duration-500 flex flex-col space-x-4 space-y-4 rounded-lg w-10/12 bg-white dark:bg-black"
      >
        <div className="flex 2xl:flex-row xl:flex-row lg:flex-row md:flex-col sm:flex-col flex-col">
          <div className="grid place-content-center py-2 pl-2">
            <img
              src={"https://github.com/punctuations.png"}
              className="select-none rounded-md max-w-28 max-h-28"
              alt="github pfp"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <header className="flex flex-row items-center justify-between ml-4 w-11/12">
              <h3 className="text-4xl font-medium text-gray-900 dark:text-gray-200">
                matt
              </h3>
              <a href="https://github.com/punctuations/" target="_blank">
                <p className="select-none border-gray-300 hover:bg-blue-500 border hover:border-transparent p-1 px-3 text-gray-500 hover:text-white rounded-2xl transition-colors duration-300">
                  Follow
                </p>
              </a>
            </header>
            <p className="text-gray-400 dark:text-gray-500 2xl:text-sm xl:text-sm lg:text-sm md:text-sm text-xs p-1.5 ml-3 font-medium">
              I’m Matt, I’m a student and Typescript Developer from British
              Columbia, Canada.{" "}
            </p>
            <div className="mt-3 flex flex-row justify-around items-center">
              {Socials.map((socials, i) => {
                return (
                  <motion.div
                    className="mt-1"
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
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Card;
