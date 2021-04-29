import { useRouter } from "next/router";
import { motion } from "framer-motion";

const Nav = () => {
  const router = useRouter();

  return (
    <motion.nav
      className="absolute 2xl:right-6 xl:right-6 lg:right-6 md:right-6 sm:right-4 right-0 dark:text-white"
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
      {router.pathname === "/" ? (
        <p
          onClick={() => router.push("/projects")}
          className="select-none transform-gpu rotate-90 cursor-pointer text-xl font-semibold"
        >
          @projects
        </p>
      ) : null}
      {router.pathname === "/projects" ? (
        <p
          onClick={() => router.push("/")}
          className="select-none transform-gpu rotate-90 cursor-pointer text-xl font-semibold"
        >
          @home
        </p>
      ) : null}
    </motion.nav>
  );
};

export default Nav;
