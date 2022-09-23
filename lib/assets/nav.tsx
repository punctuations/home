import { useRouter } from "next/router";
import { motion } from "framer-motion";
import React from "react";
import { LangContext } from "./LangProvider";

const Nav = () => {
  const router = useRouter();

  const { lang } = React.useContext(LangContext);

  return (
    <motion.nav className="fixed z-20 top-6 right-6 dark:text-white flex space-x-6 items-center justify-center">
      <div className="dark:bg-black bg-white border-gray-300 dark:border-gray-800 border px-4 py-2 rounded-md flex space-x-2">
        <button
          onClick={() => router.push("/")}
          className={`${
            router.pathname == "/"
              ? "bg-gray-200/75 dark:bg-gray-800/60"
              : "hover:bg-gray-100/75 dark:hover:bg-gray-900/75"
          } transition-colors duration-200 px-2 py-1 rounded-md`}
        >
          {lang.phrases.navigation[0]}
        </button>
        <button
          onClick={() => router.push("/projects")}
          className={`${
            router.pathname == "/projects"
              ? "bg-gray-200/75 dark:bg-gray-800/60"
              : "hover:bg-gray-100/75 dark:hover:bg-gray-900/75"
          } transition-colors duration-200  px-2 py-1 rounded-md`}
        >
          {lang.phrases.navigation[1]}
        </button>
        <button
          onClick={() => router.push("/message")}
          className={`${
            router.pathname == "/message"
              ? "bg-gray-200/75 dark:bg-gray-800/60"
              : "hover:bg-gray-100/75 dark:hover:bg-gray-900/75"
          } transition-colors duration-200 px-2 py-1 rounded-md`}
        >
          {lang.phrases.navigation[2]}
        </button>
        <button
          onClick={() => router.push("/music")}
          className={`${
            router.pathname == "/music"
              ? "bg-gray-200/75 dark:bg-gray-800/60"
              : "hover:bg-gray-100/75 dark:hover:bg-gray-900/75"
          } transition-colors duration-200 px-2 py-1 rounded-md`}
        >
          {lang.phrases.navigation[3]}
        </button>
      </div>
    </motion.nav>
  );
};

export default Nav;
