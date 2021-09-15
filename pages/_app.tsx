import { AppProps } from "next/app";
import "../styles/tailwind.css";
import React from "react";
import { ThemeContext, themeLoad } from "../lib/assets/toggle";

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = React.useState<{
    mode: string | number;
  }>({
    mode: themeLoad(),
  });

  React.useEffect(() => {
    console.log("effected! " + theme.mode);
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

  return (
    <ThemeContext.Provider value={value}>
      <Component {...pageProps} />
    </ThemeContext.Provider>
  );
}
