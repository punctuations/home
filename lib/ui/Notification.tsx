import React from "react";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";

const Notification = (props: {
  href?: string;
  duration?: number;
  dismiss?: boolean;
  variant?: "macOS" | "iOS";
  app?: string;
  title: string;
  text: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();

  const [hidden, setHiddenState] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (process.browser && !hidden)
      setHiddenState(JSON.parse(localStorage.getItem("dismissed") as string));
  }, []);

  React.useEffect(() => {
    if (!props.dismiss) {
      const timeout = setTimeout(() => {
        setHiddenState(true);
      }, props.duration ?? 5000);
    }
  }, []);

  React.useEffect(() => {
    if (process.browser && hidden)
      localStorage.setItem("dismissed", JSON.stringify(hidden));
  }, [hidden]);

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={{
            y: props.variant?.toLowerCase() === "macos" ? 0 : -100,
            x: props.variant?.toLowerCase() === "macos" ? 400 : 0,
          }}
          animate={{
            y: 0,
            x: 0,
            transition: {
              delay: 1,
              duration: 0.4,
              ease: [0.48, 0.15, 0.25, 0.96],
            },
          }}
          exit={{
            y: props.variant?.toLowerCase() === "macos" ? 0 : -100,
            x: props.variant?.toLowerCase() === "macos" ? 400 : 0,
            transition: {
              duration: 0.4,
              ease: [0.48, 0.15, 0.25, 0.96],
            },
          }}
          className={`relative group mt-2 text-black dark:text-white flex ${
            props.dismiss && props.variant?.toLowerCase() !== "macos"
              ? "justify-between"
              : "justify-start"
          } ${
            props.variant?.toLowerCase() === "macos"
              ? "shadow-sm border border-white border-opacity-40 dark:border-opacity-100 dark:border-gray-800 p-3 px-5"
              : "p-2 px-8"
          } w-full rounded-xl backdrop-filter backdrop-saturate-200 backdrop-blur-3xl bg-gray-200 dark:bg-gray-800 bg-opacity-40 dark:bg-opacity-60`}
        >
          <div
            className={`flex ${
              props.variant?.toLowerCase() === "macos"
                ? "flex-col space-y-2"
                : "items-center space-x-8"
            } justify-center`}
          >
            {props.variant?.toLowerCase() !== "macos" ? (
              <div className="h-9 w-9">{props.children}</div>
            ) : (
              <header className="inline-flex items-center space-x-2">
                <div className="h-5 w-5">{props.children}</div>
                <h3 className="text-xs uppercase opacity-60">{props.app}</h3>
              </header>
            )}
            <div
              className={`flex flex-col ${
                props.variant?.toLowerCase() !== "macos" ? "-space-y-1" : ""
              }`}
            >
              <h4
                className={`font-medium ${
                  props.variant?.toLowerCase() === "macos"
                    ? "text-sm"
                    : "text-base"
                }`}
              >
                {props.title}
              </h4>
              <p
                className={
                  props.variant?.toLowerCase() === "macos"
                    ? "text-xs"
                    : "text-sm"
                }
              >
                {props.text}
              </p>
            </div>
          </div>

          {props.dismiss &&
            (props.variant?.toLowerCase() === "macos" ? (
              <button
                onClick={() => setHiddenState(true)}
                className="absolute -top-1 -left-2 shadow-sm border border-white border-opacity-40 dark:border-opacity-100 dark:border-gray-800 rounded-full p-1 backdrop-filter backdrop-saturate-200 backdrop-blur-3xl bg-gray-200 dark:bg-gray-900 bg-opacity-40 dark:bg-opacity-60 group-hover:flex hidden appearance-none focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
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
            ) : (
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
            ))}
          {props.href && (
            <button
              onClick={() => router.push(props.href ?? "")}
              className="group-hover:flex hidden absolute top-1 right-4 p-0.5 px-2.5 rounded text-xl font-extralight hover:bg-gray-200 bg-opacity-20 transition-colors duration-200 appearance-none focus:outline-none"
            >
              &rsaquo;
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
