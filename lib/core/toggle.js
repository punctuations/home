import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function theme() {
	const [theme, setTheme] = useState(0);

	useEffect(() => {
		if (process.browser) {
			setInterval(() => {
				if (!localStorage.getItem("theme")) {
					setTheme(0);
				} else {
					setTheme(parseInt(localStorage.getItem("theme")));
					parseInt(localStorage.getItem("theme"))
						? (document.querySelector("html").classList = "dark")
						: (document.querySelector("html").classList = "light");
				}
			}, 200);
		}
	}, []);

	return theme;
}

export function Toggle() {
	const [theme, setTheme] = useState(0);

	useEffect(() => {
		if (process.browser) {
			if (!localStorage.getItem("theme")) {
				setTheme(0);
			} else {
				setTheme(parseInt(localStorage.getItem("theme")));
				parseInt(localStorage.getItem("theme"))
					? (document.querySelector("html").classList = "dark")
					: (document.querySelector("html").classList = "light");
			}
		}
	}, []);

	function handleTheme() {
		if (theme) {
			setTheme(0);
			localStorage.setItem("theme", 0);
			document.querySelector("html").classList = "light";
		} else {
			setTheme(1);
			localStorage.setItem("theme", 1);
			document.querySelector("html").classList = "dark";
		}
	}

	return (
		<>
			{theme ? (
				<motion.svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					width={20}
					height={20}
					className="select-none z-50"
					initial={{ y: 20, opacity: 0 }}
					animate={{
						y: 0,
						opacity: 1,
						transition: {
							duration: 0.4,
							delay: 0.2,
							ease: [0.48, 0.15, 0.25, 0.96],
						},
					}}
					onClick={() => handleTheme()}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
					/>
				</motion.svg>
			) : (
				<motion.svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					width={20}
					height={20}
					className="select-none z-20"
					initial={{ y: 20, opacity: 0 }}
					animate={{
						y: 0,
						opacity: 1,
						transition: {
							duration: 0.4,
							delay: 0.2,
							ease: [0.48, 0.15, 0.25, 0.96],
						},
					}}
					onClick={() => handleTheme()}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
					/>
				</motion.svg>
			)}
		</>
	);
}
