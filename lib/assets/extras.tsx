import { ReactNode } from "react";
import { motion } from "framer-motion";

export const Extras = (props: { children: ReactNode }) => {
  return (
    <motion.section
      className="absolute right-5 bottom-5 dark:text-white flex flex-col items-center space-y-4"
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
      {props.children}
    </motion.section>
  );
};
