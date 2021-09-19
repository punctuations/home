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
      <button
        onClick={() => setMenuState(!menu)}
        className="outline-none appearance-none flex select-none opacity-60"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>
      <AnimatePresence>
        {menu && (
          <motion.div
            className="absolute right-7 z-20 w-40 flex flex-col space-y-2 justify-center items-center py-6 rounded-lg bg-white dark:bg-black dark:border border-gray-800 shadow-2xl"
            initial={{ opacity: 0, scale: 0, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0, x: 40 }}
          >
            {router.pathname === "/" ? (
              <>
                <button
                  onClick={() => router.push("/projects")}
                  className="outline-none appearance-none select-none text-lg text-blue-500 group"
                >
                  <span className="group-hover:underline">Projects</span>{" "}
                  &rsaquo;
                </button>
                <button
                  onClick={() => router.push("/message")}
                  className="outline-none appearance-none select-none text-lg text-blue-500 group"
                >
                  <span className="group-hover:underline">Message</span>{" "}
                  &rsaquo;
                </button>
              </>
            ) : router.pathname === "/projects" ? (
              <>
                <button
                  onClick={() => router.push("/")}
                  className="outline-none appearance-none select-none text-lg text-blue-500 group"
                >
                  <span className="group-hover:underline">Home</span> &rsaquo;
                </button>
                <button
                  onClick={() => router.push("/message")}
                  className="outline-none appearance-none select-none text-lg text-blue-500 group"
                >
                  <span className="group-hover:underline">Message</span>{" "}
                  &rsaquo;
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/")}
                  className="outline-none appearance-none select-none text-lg text-blue-500 group"
                >
                  <span className="group-hover:underline">Home</span> &rsaquo;
                </button>
                <button
                  onClick={() => router.push("/projects")}
                  className="outline-none appearance-none select-none text-lg text-blue-500 group"
                >
                  <span className="group-hover:underline">Projects</span>{" "}
                  &rsaquo;
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Nav;
