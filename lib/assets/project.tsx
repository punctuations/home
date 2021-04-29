import { motion } from "framer-motion";

export const Project = [
  <div className="2xl:w-auto xl:w-auto lg:w-auto w-96 2xl:h-40 xl:h-40 lg:h-52 h-48 relative 2xl:p-4 xl:p-4 lg:p-4 p-0 dark:border border-0 border-gray-900 shadow-xl hover:shadow-2xl transition-shadow duration-500 flex flex-col space-x-4 space-y-4 rounded-lg">
    <div className="flex 2xl:flex-row xl:flex-row lg:flex-row md:flex-col sm:flex-col flex-col items-center justify-center">
      <div className="grid place-content-center py-2 pl-2">
        <h1 className="2xl:text-4xl xl:text-4xl lg:text-4xl text-2xl flex items-center justify-center">
          🍂
        </h1>
      </div>

      <div className="flex flex-col space-y-1">
        <header className="flex flex-row items-center justify-between ml-4 w-11/12">
          <h3 className="2xl:text-3xl xl:text-3xl lg:text-2xl text-xl font-medium text-gray-900 dark:text-gray-200">
            ac
          </h3>
          <a href="https://ac.vercel.app/" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 duration-500 text-gray-400 hover:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </header>
        <p className="text-gray-400 dark:text-gray-500 2xl:text-sm xl:text-sm text-xs p-1.5 ml-3 font-medium">
          Animal Crossing music depending on the time and weather!{" "}
        </p>
        <div className="absolute bottom-2 w-2/3 mt-3 flex flex-row justify-around items-center">
          <motion.div
            className="mt-1"
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
            <a
              href="https://twitter.com/atmattt/status/1339657922037497856?s=20"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width={20}
                height={20}
                fill="currentColor"
                strokeWidth={2}
                className="duration-500 transition-all opacity-40 dark:opacity-75 dark:hover:opacity-40 hover:opacity-75 dark:text-white"
              >
                <title>Twitter</title>
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </motion.div>

          <motion.div
            className="mt-1"
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.4,
                delay: 0.3,
                ease: [0.48, 0.15, 0.25, 0.96],
              },
            }}
          >
            <a
              href="https://github.com/punctuations/ac"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width={20}
                height={20}
                fill="currentColor"
                strokeWidth={2}
                className="duration-500 transition-all opacity-40 dark:opacity-75 dark:hover:opacity-40 hover:opacity-75 dark:text-white"
                viewBox="0 0 24 24"
              >
                <title>GitHub</title>
                <path d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.606 9.606 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48C19.137 20.107 22 16.373 22 11.969 22 6.463 17.522 2 12 2z" />
              </svg>
            </a>
          </motion.div>

          <motion.div
            className="mt-1"
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.4,
                delay: 0.35,
                ease: [0.48, 0.15, 0.25, 0.96],
              },
            }}
          >
            <a
              href="https://www.producthunt.com/posts/ac"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width={20}
                height={20}
                fill="currentColor"
                strokeWidth={2}
                className="duration-500 transition-all opacity-40 dark:opacity-75 dark:hover:opacity-40 hover:opacity-75 dark:text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <title>Product Hunt</title>
                <path d="M326.3 218.8c0 20.5-16.7 37.2-37.2 37.2h-70.3v-74.4h70.3c20.5 0 37.2 16.7 37.2 37.2zM504 256c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zm-128.1-37.2c0-47.9-38.9-86.8-86.8-86.8H169.2v248h49.6v-74.4h70.3c47.9 0 86.8-38.9 86.8-86.8z" />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  </div>,
  <div className="2xl:w-auto xl:w-auto lg:w-auto w-96 2xl:h-40 xl:h-40 lg:h-52 h-48 relative 2xl:p-4 xl:p-4 lg:p-4 p-0 dark:border border-0 border-gray-900 shadow-xl hover:shadow-2xl transition-shadow duration-500 flex flex-col space-x-4 space-y-4 rounded-lg">
    <div className="flex 2xl:flex-row xl:flex-row lg:flex-row md:flex-col sm:flex-col flex-col items-center justify-center">
      <div className="grid place-content-center py-2 pl-2">
        <h1 className="2xl:text-4xl xl:text-4xl lg:text-4xl text-2xl flex items-center justify-center">
          ℹ
        </h1>
      </div>

      <div className="flex flex-col space-y-1">
        <header className="flex flex-row items-center justify-between ml-4 w-11/12">
          <h3 className="2xl:text-3xl xl:text-3xl lg:text-2xl text-xl font-medium text-gray-900 dark:text-gray-200">
            ac - api
          </h3>
          <a href="https://ac-api.vercel.app/" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 duration-500 text-gray-400 hover:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </header>
        <p className="text-gray-400 dark:text-gray-500 2xl:text-sm xl:text-sm text-xs p-1.5 ml-3 font-medium">
          An official api for ac to get animal crossing data depending on your
          time and weather.{" "}
        </p>
        <div className="absolute bottom-2 w-2/3 mt-3 flex flex-row justify-around items-center">
          <motion.div
            className="mt-1"
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
            <a
              href="https://twitter.com/atmattt/status/1345465010496000000?s=20"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width={20}
                height={20}
                fill="currentColor"
                strokeWidth={2}
                className="duration-500 transition-all opacity-40 dark:opacity-75 dark:hover:opacity-40 hover:opacity-75 dark:text-white"
              >
                <title>Twitter</title>
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </motion.div>

          <motion.div
            className="mt-1"
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.4,
                delay: 0.3,
                ease: [0.48, 0.15, 0.25, 0.96],
              },
            }}
          >
            <a
              href="https://github.com/punctuations/ac-api"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width={20}
                height={20}
                fill="currentColor"
                strokeWidth={2}
                className="duration-500 transition-all opacity-40 dark:opacity-75 dark:hover:opacity-40 hover:opacity-75 dark:text-white"
                viewBox="0 0 24 24"
              >
                <title>GitHub</title>
                <path d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.606 9.606 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48C19.137 20.107 22 16.373 22 11.969 22 6.463 17.522 2 12 2z" />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  </div>,
  <div className="2xl:w-auto xl:w-auto lg:w-auto w-96 2xl:h-40 xl:h-40 lg:h-52 h-48 relative 2xl:p-4 xl:p-4 lg:p-4 p-0 dark:border border-0 border-gray-900 shadow-xl hover:shadow-2xl transition-shadow duration-500 flex flex-col space-x-4 space-y-4 rounded-lg">
    <div className="flex 2xl:flex-row xl:flex-row lg:flex-row md:flex-col sm:flex-col flex-col items-center justify-center">
      <div className="grid place-content-center py-2 pl-2">
        <h1 className="2xl:text-4xl xl:text-4xl lg:text-4xl text-2xl flex items-center justify-center">
          🌎
        </h1>
      </div>

      <div className="flex flex-col space-y-1">
        <header className="flex flex-row items-center justify-between ml-4 w-11/12">
          <h3 className="2xl:text-3xl xl:text-3xl lg:text-2xl text-xl font-medium text-gray-900 dark:text-gray-200">
            dont-ping.me
          </h3>
          <a href="https://dont-ping.me/" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 duration-500 text-gray-400 hover:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </header>
        <p className="text-gray-400 dark:text-gray-500 2xl:text-sm xl:text-sm text-xs p-1.5 ml-3 font-medium">
          The website you're on made using Typescript + Next.js{" "}
        </p>
        <div className="absolute bottom-2 w-2/3 mt-3 flex flex-row justify-around items-center">
          <motion.div
            className="mt-1"
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
            <a
              href="https://twitter.com/atmattt/status/1371824441932587012?s=20"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width={20}
                height={20}
                fill="currentColor"
                strokeWidth={2}
                className="duration-500 transition-all opacity-40 dark:opacity-75 dark:hover:opacity-40 hover:opacity-75 dark:text-white"
              >
                <title>Twitter</title>
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </motion.div>

          <motion.div
            className="mt-1"
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.4,
                delay: 0.3,
                ease: [0.48, 0.15, 0.25, 0.96],
              },
            }}
          >
            <a
              href="https://github.com/punctuations/home"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width={20}
                height={20}
                fill="currentColor"
                strokeWidth={2}
                className="duration-500 transition-all opacity-40 dark:opacity-75 dark:hover:opacity-40 hover:opacity-75 dark:text-white"
                viewBox="0 0 24 24"
              >
                <title>GitHub</title>
                <path d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.606 9.606 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48C19.137 20.107 22 16.373 22 11.969 22 6.463 17.522 2 12 2z" />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  </div>,
  <div className="2xl:w-auto xl:w-auto lg:w-auto w-96 2xl:h-40 xl:h-40 lg:h-52 h-48 relative 2xl:p-4 xl:p-4 lg:p-4 p-0 dark:border border-0 border-gray-900 shadow-xl hover:shadow-2xl transition-shadow duration-500 flex flex-col space-x-4 space-y-4 rounded-lg">
    <div className="flex 2xl:flex-row xl:flex-row lg:flex-row md:flex-col sm:flex-col flex-col items-center justify-center">
      <div className="grid place-content-center py-2 pl-2">
        <h1 className="2xl:text-4xl xl:text-4xl lg:text-4xl text-2xl flex items-center justify-center">
          📝
        </h1>
      </div>

      <div className="flex flex-col space-y-1">
        <header className="flex flex-row items-center justify-between ml-4 w-11/12">
          <h3 className="2xl:text-2xl xl:text-xl text-lg font-medium text-gray-900 dark:text-gray-200">
            next-glassmorphism
          </h3>
          <a href="https://dont-ping.me/" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 duration-500 text-gray-400 hover:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </header>
        <p className="text-gray-400 dark:text-gray-500 2xl:text-sm xl:text-sm text-xs p-1.5 ml-3 font-medium">
          A simple and easy to use glassmorphism boilerplate using Next.js and
          Tailwind CSS.{" "}
        </p>
        <div className="absolute bottom-2 w-2/3 mt-3 flex flex-row justify-around items-center">
          <motion.div
            className="mt-1"
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
            <a
              href="https://twitter.com/atmattt/status/1357762042837405697?s=20"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width={20}
                height={20}
                fill="currentColor"
                strokeWidth={2}
                className="duration-500 transition-all opacity-40 dark:opacity-75 dark:hover:opacity-40 hover:opacity-75 dark:text-white"
              >
                <title>Twitter</title>
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </motion.div>

          <motion.div
            className="mt-1"
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.4,
                delay: 0.3,
                ease: [0.48, 0.15, 0.25, 0.96],
              },
            }}
          >
            <a
              href="https://github.com/punctuations/next-glassmorphism"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width={20}
                height={20}
                fill="currentColor"
                strokeWidth={2}
                className="duration-500 transition-all opacity-40 dark:opacity-75 dark:hover:opacity-40 hover:opacity-75 dark:text-white"
                viewBox="0 0 24 24"
              >
                <title>GitHub</title>
                <path d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.606 9.606 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48C19.137 20.107 22 16.373 22 11.969 22 6.463 17.522 2 12 2z" />
              </svg>
            </a>
          </motion.div>

          <motion.div
            className="mt-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.4,
                delay: 0.35,
                ease: [0.48, 0.15, 0.25, 0.96],
              },
            }}
          >
            <a
              href="https://matt.hashnode.dev/glassmorphism-boilerplate-vercelhashnode"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width={23}
                height={23}
                fill="currentColor"
                strokeWidth={2}
                className="duration-500 transition-all opacity-40 dark:opacity-75 dark:hover:opacity-40 hover:opacity-75 dark:text-white"
                viewBox="0 0 24 24"
              >
                <title>Medium</title>
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  </div>,
  <div className="2xl:w-auto xl:w-auto lg:w-auto w-96 2xl:h-40 xl:h-40 lg:h-52 h-48 relative 2xl:p-4 xl:p-4 lg:p-4 p-0 dark:border border-0 border-gray-900 shadow-xl hover:shadow-2xl transition-shadow duration-500 flex flex-col space-x-4 space-y-4 rounded-lg">
    <div className="flex 2xl:flex-row xl:flex-row lg:flex-row md:flex-col sm:flex-col flex-col items-center justify-center">
      <div className="grid place-content-center py-2 pl-2">
        <h1 className="2xl:text-4xl xl:text-4xl lg:text-4xl text-2xl flex items-center justify-center">
          🖥
        </h1>
      </div>

      <div className="flex flex-col space-y-1">
        <header className="flex flex-row items-center justify-between ml-4 w-11/12">
          <h3 className="2xl:text-3xl xl:text-3xl lg:text-2xl text-xl font-medium text-gray-900 dark:text-gray-200">
            more to come
          </h3>
          <a href="https://github.com/punctuations" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 duration-500 text-gray-400 hover:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </header>
        <p className="text-gray-400 dark:text-gray-500 2xl:text-sm xl:text-sm text-xs p-1.5 ml-3 font-medium">
          I am constantly working on new and exciting projects; I will add them
          here when I'm done! :){" "}
        </p>
        <div className="absolute bottom-2 w-2/3 mt-3 flex flex-row justify-around items-center">
          <motion.div
            className="mt-1"
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.4,
                delay: 0.3,
                ease: [0.48, 0.15, 0.25, 0.96],
              },
            }}
          >
            <a
              href="https://github.com/punctuations/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width={20}
                height={20}
                fill="currentColor"
                strokeWidth={2}
                className="duration-500 transition-all opacity-40 dark:opacity-75 dark:hover:opacity-40 hover:opacity-75 dark:text-white"
                viewBox="0 0 24 24"
              >
                <title>GitHub</title>
                <path d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.606 9.606 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48C19.137 20.107 22 16.373 22 11.969 22 6.463 17.522 2 12 2z" />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  </div>,
];
