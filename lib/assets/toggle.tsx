import { motion } from "framer-motion";
import React from "react";

export function themeLoad(): string | number {
  if (process.browser && localStorage.getItem("theme")) {
    return isNaN(localStorage.getItem("theme") as unknown as number)
      ? (localStorage.getItem("theme") as string)
      : parseInt(localStorage.getItem("theme") as string);
  } else {
    return "dark";
  }
}

export const ThemeContext = React.createContext<{
  theme: { mode: string | number };
  setTheme: (p: { mode: string }) => void;
}>({
  theme: { mode: themeLoad() },
  setTheme: (p: { mode: string }) => {},
});

export function Toggle() {
  const { theme, setTheme } = React.useContext(ThemeContext);

  return (
    process.browser && (
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        width={20}
        height={20}
        className="select-none z-50 cursor-pointer text-gray-400"
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
        onClick={() =>
          setTheme({
            mode: theme.mode === "light" || theme.mode === 1 ? "dark" : "light",
          })
        }
      >
        {theme.mode === "light" || theme.mode === 1 ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        )}
      </motion.svg>
    )
  );
}
