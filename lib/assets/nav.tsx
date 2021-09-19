import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const Nav = () => {
  const router = useRouter();

  const [menu, setMenuState] = React.useState<boolean>(false);

  return (
    <motion.nav
      className="absolute z-20 top-1/2 2xl:right-6 xl:right-6 lg:right-6 md:right-6 sm:right-4 right-6 dark:text-white flex items-center justify-center"
      initial={{ y: 20, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.4,
          delay: 0.25,
          ease: [0.48, 0.15, 0.25, 0.96],
        },
      }}
    >
      <p
        onClick={() => setMenuState(!menu)}
        className="flex select-none cursor-pointer text-xl font-semibold"
      >
        @
      </p>
      <AnimatePresence>
        {menu && (
          <motion.div
            className="absolute right-7 z-20 w-40 flex flex-col space-y-2 justify-center items-center py-6 rounded-lg bg-white dark:bg-black dark:border border-gray-800 shadow-lg"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
          >
            {router.pathname === "/" ? (
              <>
                <p
                  onClick={() => router.push("/projects")}
                  className="select-none cursor-pointer text-lg inline-flex items-center justify-center space-x-1"
                >
                  <span>projects</span>{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={15}
                    height={15}
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
                </p>
                <p
                  onClick={() => router.push("/message")}
                  className="select-none cursor-pointer text-lg inline-flex items-center justify-center space-x-1"
                >
                  <span>message</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={15}
                    height={15}
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
                </p>
              </>
            ) : router.pathname === "/projects" ? (
              <>
                <p
                  onClick={() => router.push("/")}
                  className="select-none cursor-pointer text-lg inline-flex items-center justify-center space-x-1"
                >
                  <span>home</span>{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={15}
                    height={15}
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
                </p>
                <p
                  onClick={() => router.push("/message")}
                  className="select-none cursor-pointer text-lg inline-flex items-center justify-center space-x-1"
                >
                  <span>message</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={15}
                    height={15}
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
                </p>
              </>
            ) : (
              <>
                <p
                  onClick={() => router.push("/")}
                  className="select-none cursor-pointer text-lg inline-flex items-center justify-center space-x-1"
                >
                  <span>home</span>{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={15}
                    height={15}
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
                </p>
                <p
                  onClick={() => router.push("/projects")}
                  className="select-none cursor-pointer text-lg inline-flex items-center justify-center space-x-1"
                >
                  <span>projects</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={15}
                    height={15}
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
                </p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Nav;
