import { motion } from "framer-motion";
import { LangContext } from "../assets/LangProvider";
import React from "react";

const Notice = () => {
  const { lang } = React.useContext(LangContext);

  return (
    <>
      {lang.pref == "jp" ? (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.4,
              delay: 0.15,
              ease: [0.48, 0.15, 0.25, 0.96],
            },
          }}
          className="select-none absolute top-0 left-[10%] sm:flex hidden px-4 py-3 border dark:border-gray-700 border-gray-200 rounded-lg flex-row space-x-2 text-gray-400 dark:text-white items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.4}
            stroke="currentColor"
            className="w-8 h-8 text-yellow-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <div className="flex flex-col">
            <p>間違った翻訳？</p>
            <p>メールを送ってください!</p>
          </div>
        </motion.div>
      ) : null}
    </>
  );
};

export default Notice;
