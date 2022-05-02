import { useRouter } from "next/router";
import { motion } from "framer-motion";
import React from "react";
import { phrases } from "./phrases";

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
            className="appearance-none focus:outline-none select-none text-lg group"
          >
            <span className="group-hover:underline group-hover:mr-1 transition-all duration-500">
              {phrases.jp.navigation[1]}
            </span>{" "}
            &rsaquo;
          </button>
          <button
            onClick={() => router.push("/message")}
            className="appearance-none focus:outline-none select-none text-lg group"
          >
            <span className="group-hover:underline group-hover:mr-1 transition-all duration-500">
              {phrases.jp.navigation[2]}
            </span>{" "}
            &rsaquo;
          </button>
          <button
            onClick={() => router.push("/music")}
            className="appearance-none focus:outline-none select-none text-lg group"
          >
            <span className="group-hover:underline group-hover:mr-1 transition-all duration-500">
              {phrases.jp.navigation[3]}
            </span>{" "}
            &rsaquo;
          </button>
        </>
      ) : router.pathname === "/projects" ? (
        <>
          <button
            onClick={() => router.push("/")}
            className="appearance-none focus:outline-none select-none text-lg group"
          >
            <span className="group-hover:underline group-hover:mr-1 transition-all duration-500">
              {phrases.jp.navigation[0]}
            </span>{" "}
            &rsaquo;
          </button>
          <button
            onClick={() => router.push("/message")}
            className="appearance-none focus:outline-none select-none text-lg group"
          >
            <span className="group-hover:underline group-hover:mr-1 transition-all duration-500">
              {phrases.jp.navigation[2]}
            </span>{" "}
            &rsaquo;
          </button>
          <button
            onClick={() => router.push("/music")}
            className="appearance-none focus:outline-none select-none text-lg group"
          >
            <span className="group-hover:underline group-hover:mr-1 transition-all duration-500">
              {phrases.jp.navigation[3]}
            </span>{" "}
            &rsaquo;
          </button>
        </>
      ) : router.pathname === "/music" ? (
        <>
          <button
            onClick={() => router.push("/")}
            className="appearance-none focus:outline-none select-none text-lg group"
          >
            <span className="group-hover:underline group-hover:mr-1 transition-all duration-500">
              {phrases.jp.navigation[0]}
            </span>{" "}
            &rsaquo;
          </button>
          <button
            onClick={() => router.push("/message")}
            className="appearance-none focus:outline-none select-none text-lg group"
          >
            <span className="group-hover:underline group-hover:mr-1 transition-all duration-500">
              {phrases.jp.navigation[2]}
            </span>{" "}
            &rsaquo;
          </button>
          <button
            onClick={() => router.push("/projects")}
            className="appearance-none focus:outline-none select-none text-lg group"
          >
            <span className="group-hover:underline group-hover:mr-1 transition-all duration-500">
              {phrases.jp.navigation[1]}
            </span>{" "}
            &rsaquo;
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => router.push("/")}
            className="appearance-none focus:outline-none select-none text-lg group"
          >
            <span className="group-hover:underline group-hover:mr-1 transition-all duration-500">
              {phrases.jp.navigation[0]}
            </span>{" "}
            &rsaquo;
          </button>
          <button
            onClick={() => router.push("/projects")}
            className="appearance-none focus:outline-none select-none text-lg group"
          >
            <span className="group-hover:underline group-hover:mr-1 transition-all duration-500">
              {phrases.jp.navigation[1]}
            </span>{" "}
            &rsaquo;
          </button>
          <button
            onClick={() => router.push("/music")}
            className="appearance-none focus:outline-none select-none text-lg group"
          >
            <span className="group-hover:underline group-hover:mr-1 transition-all duration-500">
              {phrases.jp.navigation[3]}
            </span>{" "}
            &rsaquo;
          </button>
        </>
      )}
    </motion.nav>
  );
};

export default Nav;
