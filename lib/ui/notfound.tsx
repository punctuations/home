import {motion} from "framer-motion";
import React from "react";
import {useRouter} from "next/router";
import {LangContext} from "../assets/LangProvider";

export const NotFound = () => {
    const router = useRouter();

    const {lang} = React.useContext(LangContext)

    return (
        <>
        <motion.header
            initial={{
                y: 20,
                opacity: 0,
            }}
            animate={{
                y: 0,
                opacity: 1,
                transition: {
                    duration: 0.4,
                    delay: 0.1,
                    ease: [0.48, 0.15, 0.25, 0.96],
                },
            }}
            className="2xl:ml-24 xl:ml-24 lg:ml-24 ml-0 flex flex-col justify-center 2xl:items-start xl:items-start lg:items-start items-center space-y-6"
        >
            <div>
                <p className="uppercase font-semibold text-red-400">{lang.phrases.error.name}</p>
                <h1 className={`text-center ${lang.pref == "eng" ? "md:text-5xl lg:text-5xl" : ""} sm:text-4xl text-3xl font-bold dark:text-white`}>
                    {lang.phrases.error.desc}
                </h1>
            </div>

            <p className="text-center 2xl:text-xl xl:text-xl lg:text-xl md:text-lg text-base text-gray-400">
                {lang.phrases.error.instructions}
            </p>
        </motion.header>
    <motion.button
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
        onClick={() => router.push("/")}
        className="place-self-center 2xl:w-1/3 xl:w-1/3 lg:w-1/3 md:w-1/3 sm:w-1/3 w-2/3 px-7 py-4 rounded-md bg-white dark:bg-black text-gray-500 transition-colors duration-300 border border-gray-400 dark:border-gray-800 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white"
    >
        {lang.phrases.error.return} &rarr;
    </motion.button>
        </>
    )
}