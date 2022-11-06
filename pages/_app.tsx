import { AppProps } from "next/app";
import "../styles/tailwind.css";
import React from "react";
import { useKeyPress } from "ahooks";
// @ts-ignore
import { Analytics } from "@vercel/analytics/react";

import { ThemeContext, themeLoad } from "../lib/assets/toggle";

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = React.useState<{
    mode: string | number;
  }>({
    mode: themeLoad(),
  });

  React.useEffect(() => {
    if (theme.mode) {
      if (theme.mode === "dark" || theme.mode === 1) {
        if (document.documentElement.classList.contains("light")) {
          document.documentElement.classList.remove("light");
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.add("dark");
        }
      } else {
        if (document.documentElement.classList.contains("dark")) {
          document.documentElement.classList.remove("dark");
          document.documentElement.classList.add("light");
        } else {
          document.documentElement.classList.add("light");
        }
      }
      localStorage.setItem("theme", theme.mode as string);
    }
  }, [theme.mode]);

  const value = React.useMemo(() => ({ theme, setTheme }), [theme]);

  useKeyPress("T", () => {
    if (
      document.activeElement?.tagName.toLowerCase() !== "input" &&
      document.activeElement?.tagName.toLowerCase() !== "textarea"
    )
      setTheme({
        mode: theme.mode === "light" ? "dark" : "light",
      });
  });

  return (
    <ThemeContext.Provider value={value}>
      <Component {...pageProps} />
      <Analytics />
    </ThemeContext.Provider>
  );
}
