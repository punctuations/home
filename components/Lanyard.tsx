import React from "react";

import Image from "next/image";

import { AnimatePresence, motion } from "framer-motion";
import { useLanyardWS } from "use-lanyard";

const Lanyard = () => {
  const snowflake = "291050399509774340";
  const lanyard = useLanyardWS(snowflake);

  return (
    <>
      <AnimatePresence>
        {lanyard?.listening_to_spotify && (
          <motion.div
            className="pointer-events-auto flex items-center select-none"
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
            exit={{ y: 20, opacity: 0 }}
          >
            <div className="flex flex-row items-center justify-center space-x-2">
              <a
                className="flex flex-row items-center"
                href={`https://open.spotify.com/search/${
                  lanyard.spotify ? lanyard.spotify.song : "Supernatural"
                }%20-%20${
                  lanyard.spotify ? lanyard.spotify.artist : "New Jeans"
                }`}
                target="_blank"
              >
                <figure className="flex flex-row items-end relative">
                  <div className="relative">
                    <Image
                      placeholder="blur"
                      blurDataURL={lanyard.spotify?.album_art_url!}
                      src={lanyard.spotify?.album_art_url!}
                      width={50}
                      height={50}
                      className="rounded-lg"
                      alt={"spotify album"}
                    />
                  </div>
                  <img
                    className="h-20 max-w-20 -z-10 blurred absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    src={lanyard.spotify?.album_art_url!}
                  />

                  <figcaption>
                    <svg
                      height={20}
                      width={20}
                      fill="currentColor"
                      viewBox="0 0 496 512"
                      className="absolute -bottom-1.5 -right-1.5 transition-colors duration-300 ease-in-out bg-black rounded-xl p-0.5"
                    >
                      <path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z" />
                    </svg>
                  </figcaption>
                </figure>
              </a>
              <div className="flex flex-col tracking-wide text-white w-3/4">
                <p className="font-bold">{lanyard.spotify?.song}</p>
                <p className="text-gray-600">by {lanyard.spotify?.artist}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Lanyard;
