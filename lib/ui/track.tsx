import { useLanyard } from "use-lanyard";
import { motion } from "framer-motion";

const Track = () => {
  const snowflake = "291050399509774340";
  const { data: lanyard } = useLanyard(snowflake);

  return (
    <>
      {lanyard ? (
        <motion.section
          className="flex flex-row space-x-6 items-center justify-center select-none"
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
          exit={{ y: 20, opacity: 0 }}
        >
          {lanyard?.listening_to_spotify ? (
            <>
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
                <img
                  src={lanyard.spotify?.album_art_url}
                  width={100}
                  height={100}
                  className="rounded-lg border-2 border-white pointer-events-none"
                  alt={"spotify album"}
                />
              </a>
              <div className="flex flex-col">
                <h3 className="text-2xl font-semibold text-white">
                  {lanyard?.spotify?.song}
                </h3>
                <p className="text-xl text-gray-400">
                  {lanyard?.spotify?.artist}
                </p>
              </div>
            </>
          ) : (
            <div className="dark:border border-0 border-gray-900 px-4 py-4 rounded-lg shadow-lg flex flex-row space-x-4 items-center justify-center">
              <img
                className="rounded-md h-20 w-16"
                src={
                  "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.mobilephun.com%2Fwp-content%2Fuploads%2F2014%2F08%2Focean_waves.jpg&f=1&nofb=1"
                }
                alt="random placeholder image"
              />
              <div className="flex flex-col">
                <h3 className="dark:text-white text-lg font-semibold">
                  Sorry but nothing is playing on spotify right now!
                </h3>
                <p className="text-gray-400">
                  You can come back and check by later though!
                </p>
              </div>
            </div>
          )}
        </motion.section>
      ) : null}
    </>
  );
};

export default Track;
