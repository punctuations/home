import React from "react";

import { AnimatePresence, motion } from "framer-motion";

const Notification = (props: {
  title: string;
  text: string;
  children: React.ReactNode;
}) => {
  const [hidden, setHiddenState] = React.useState<boolean>(false);

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={{ y: -100 }}
          animate={{
            y: 0,
            transition: {
              delay: 1,
              duration: 0.4,
              ease: [0.48, 0.15, 0.25, 0.96],
            },
          }}
          exit={{
            y: -100,
            transition: {
              duration: 0.4,
              ease: [0.48, 0.15, 0.25, 0.96],
            },
          }}
          className="mt-2 text-black dark:text-white flex justify-between w-full p-2 px-8 rounded-xl backdrop-filter backdrop-saturate-200 backdrop-blur-3xl bg-gray-200 dark:bg-gray-900 bg-opacity-40 dark:bg-opacity-60"
        >
          <div className="flex items-center justify-center space-x-8">
            {props.children}
            <div className="flex flex-col -space-y-1">
              <h4 className="font-medium">{props.title}</h4>
              <p className="text-sm">{props.text}</p>
            </div>
          </div>

          <button
            onClick={() => setHiddenState(true)}
            className="appearance-none focus:outline-none"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
