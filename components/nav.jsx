import { motion } from "framer-motion";
import Link from "next/link";

export default function Nav() {
	return (
		<div className="absolute 2xl:left-4/6 xl:left-4/6 lg:left-4/6 md:left-4/6 sm:left-3/6 left-3/6 2xl:top-2/12 xl:top-2/12 lg:top-2/12 md:top-1/12 sm:top-1/12 top-1/12 select-none">
			<p className="flex flex-row">
				<motion.span className="m-1.5">
					<Link href="/">
						<p className="duration-200 cursor-pointer text-black dark:text-white font-medium hover:text-green-300 active:text-green-300 dark:hover:text-green-300">
							Home
						</p>
					</Link>
				</motion.span>{" "}
				<motion.span className="m-1.5 ml-8">
					<Link href="projects">
						<p className="duration-200 cursor-pointer text-black dark:text-white font-medium hover:text-green-300 active:text-green-300 dark:hover:text-green-300">
							Projects
						</p>
					</Link>
				</motion.span>
			</p>
		</div>
	);
}
