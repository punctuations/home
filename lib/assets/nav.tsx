import { useRouter } from "next/router";
import { motion } from "framer-motion";
import React from "react";

const Nav = () => {
  const router = useRouter();

  return (
    <motion.nav
      className="fixed z-20 top-6 right-6 dark:text-white flex space-x-6 items-center justify-center"
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
      {router.pathname === "/" ? (
        <>
          <button
            onClick={() => router.push("/projects")}
            className="outline-none appearance-none select-none text-lg group"
          >
            <span className="group-hover:underline group-hover:mr-1 transition-all duration-500">
              projects
            </span>{" "}
            &rsaquo;
          </button>
          <button
            onClick={() => router.push("/message")}
            className="outline-none appearance-none select-none text-lg group"
          >
            <span className="group-hover:underline group-hover:mr-1 transition-all duration-500">
              message
            </span>{" "}
            &rsaquo;
          </button>
        </>
      ) : router.pathname === "/projects" ? (
        <>
          <button
            onClick={() => router.push("/")}
            className="outline-none appearance-none select-none text-lg group"
          >
            <span className="group-hover:underline group-hover:mr-1 transition-all duration-500">
              home
            </span>{" "}
            &rsaquo;
          </button>
          <button
            onClick={() => router.push("/message")}
            className="outline-none appearance-none select-none text-lg group"
          >
            <span className="group-hover:underline group-hover:mr-1 transition-all duration-500">
              message
            </span>{" "}
            &rsaquo;
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => router.push("/")}
            className="outline-none appearance-none select-none text-lg group"
          >
            <span className="group-hover:underline group-hover:mr-1 transition-all duration-500">
              home
            </span>{" "}
            &rsaquo;
          </button>
          <button
            onClick={() => router.push("/projects")}
            className="outline-none appearance-none select-none text-lg group"
          >
            <span className="group-hover:underline group-hover:mr-1 transition-all duration-500">
              projects
            </span>{" "}
            &rsaquo;
          </button>
        </>
      )}
    </motion.nav>
  );
};

export default Nav;
