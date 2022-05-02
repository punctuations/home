import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { phrases } from "../assets/phrases";

const Page = () => {
  const router = useRouter();

  return (
    <motion.header
      className="absolute left-4 top-4 select-none dark:text-white"
      initial={{ y: 20, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.4,
          delay: 0.05,
          ease: [0.48, 0.15, 0.25, 0.96],
        },
      }}
    >
      {router.pathname === "/" ? (
        <h3 className="text-2xl font-bold">{phrases.jp.pages.home}</h3>
      ) : router.pathname === "/projects" ? (
        <h3 className="text-2xl font-bold">{phrases.jp.pages.projects}</h3>
      ) : router.pathname === "/message" ? (
        <h3 className="text-2xl font-bold">{phrases.jp.pages.message}</h3>
      ) : router.pathname === "/music" ? (
        <h3 className="text-2xl font-bold">{phrases.jp.pages.music}</h3>
      ) : (
        <h3 className="text-2xl font-bold">404</h3>
      )}
    </motion.header>
  );
};

export default Page;
