import { useLanyard } from "use-lanyard";
import { motion } from "framer-motion";

const Background = () => {
  const snowflake = "291050399509774340";
  const { data: lanyard } = useLanyard(snowflake);

  return (
    <>
      {lanyard && lanyard?.listening_to_spotify ? (
        <motion.img
          className="absolute w-full h-full flex items-center select-none filter blur-sm brightness-50"
          src={lanyard?.spotify?.album_art_url}
          initial={{ y: 20, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.4,
              delay: 0.15,
              ease: [0.48, 0.15, 0.25, 0.96],
            },
          }}
          exit={{ y: 20, opacity: 0 }}
        />
      ) : null}
    </>
  );
};

export default Background;
