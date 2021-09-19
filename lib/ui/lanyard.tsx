import dynamic from "next/dynamic";
import Image from "next/image";

import { AnimatePresence, motion } from "framer-motion";
import { Activity, useLanyard } from "use-lanyard";

const Skeleton = dynamic(() => import("react-skeleton-loader"), { ssr: false });

const Lanyard = () => {
  const snowflake = "291050399509774340";
  const { data: lanyard } = useLanyard(snowflake);

  const activity = lanyard?.activities.find(
    (activity: Activity) => activity.type === 0
  );

  return (
    <>
      <AnimatePresence>
        {lanyard ? (
          <motion.div
            className="flex items-center select-none"
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
            {lanyard.listening_to_spotify ? (
              <div className="flex flex-row items-center justify-center space-x-2">
                <a
                  className="flex flex-row items-center"
                  href={`https://open.spotify.com/search/${
                    lanyard.spotify
                      ? lanyard.spotify.song
                      : "Never Gonna Give You Up"
                  }%20-%20${
                    lanyard.spotify ? lanyard.spotify.artist : "Rick Astley"
                  }`}
                  target="_blank"
                >
                  <figure className="flex flex-row items-end relative">
                    <Image
                      placeholder="blur"
                      blurDataURL={lanyard.spotify?.album_art_url as string}
                      src={lanyard.spotify?.album_art_url as string}
                      width={50}
                      height={50}
                      className="rounded-lg border-2 border-white dark:border-black"
                      alt={"spotify album"}
                    />

                    <figcaption>
                      <svg
                        height={20}
                        width={20}
                        fill="currentColor"
                        viewBox="0 0 496 512"
                        className="absolute -bottom-1.5 -right-1.5 text-green-500 transition-colors duration-300 ease-in-out bg-white dark:bg-black rounded-xl p-0.5"
                      >
                        <path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z" />
                      </svg>
                    </figcaption>
                  </figure>
                </a>
                <div className="flex flex-col text-xs text-black dark:text-white w-3/4">
                  <p className="font-bold">{lanyard.spotify?.song}</p>
                  <p className="text-gray-400 dark:text-gray-600">
                    by {lanyard.spotify?.artist}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {activity ? (
                  <>
                    {activity.assets && (
                      <div className="flex flex-row items-center justify-center space-x-2">
                        <figure className="flex flex-row items-end relative">
                          <img
                            src={`https://cdn.discordapp.com/app-assets/${BigInt(
                              activity.application_id as number
                            ).toString()}/${activity.assets.large_image}.png`}
                            alt={
                              activity.assets.large_text
                                ? activity.assets.large_text
                                : "large_text"
                            }
                            width={50}
                            height={50}
                            className="rounded-lg pointer-events-none border-2 border-white dark:border-black"
                          />

                          {activity.assets.small_image ? (
                            <figcaption>
                              <img
                                src={`https://cdn.discordapp.com/app-assets/${BigInt(
                                  activity.application_id as number
                                ).toString()}/${
                                  activity.assets.small_image
                                }.png`}
                                alt={
                                  activity.assets.small_text
                                    ? activity.assets.small_text
                                    : "small_text"
                                }
                                width={20}
                                height={20}
                                className="rounded-full absolute -bottom-1.5 -right-1.5 text-green-500 transition-colors duration-300 ease-in-out bg-white dark:bg-black p-0.5"
                              />
                            </figcaption>
                          ) : null}
                        </figure>

                        <div className="flex flex-col text-xs text-black dark:text-white">
                          <p className="font-bold">
                            {activity.assets.small_text ? (
                              activity.assets.small_text
                            ) : (
                              <>
                                {activity.assets.large_text ? (
                                  activity.assets.large_text
                                ) : (
                                  <>{activity.name ? activity.name : null}</>
                                )}
                              </>
                            )}
                          </p>
                          <p>
                            {activity.state ? (
                              activity.state
                            ) : (
                              <>{activity.details ? activity.details : null}</>
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                ) : null}
              </>
            )}
          </motion.div>
        ) : (
          <div className="flex space-x-3 items-end">
            <Skeleton width="50px" height="50px" widthRandomness={0} />
            <Skeleton count={2} />
            <Skeleton />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Lanyard;
