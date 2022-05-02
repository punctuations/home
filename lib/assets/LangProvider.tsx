import React from "react";
import { phrases } from "./phrases";

export const LangContext = React.createContext({
  lang: {
    pref: "eng",
    phrases: phrases.eng,
  },
  setLang: (p: {
    pref: "eng" | "jp";
    phrases: {
      intro: {
        name: string;
        name_short: string;
        short: string;
        bio: string;
        skip: string;
      };
      lanyard: { cta: string; dc: string; listening: string; credit: string };
      navigation: string[];
      prompt: string;
      pages: { home: string; projects: string; message: string; music: string };
    };
  }) => {},
});

export const LangProvider = (props: { children: React.ReactNode }) => {
  const [lang, setLang] = React.useState({
    pref: "eng",
    phrases: phrases.eng,
  });

  const ctx = React.useMemo(() => ({ lang, setLang }), [lang]);

  function langLoad(): "eng" | "jp" {
    if (process.browser && localStorage.getItem("pref")) {
      return localStorage.getItem("pref") as "eng" | "jp";
    } else {
      return "eng";
    }
  }

  React.useEffect(() => {
    setLang({
      pref: langLoad(),
      phrases: phrases[langLoad()],
    });
  }, []);

  React.useEffect(() => {
    localStorage.setItem("pref", lang.pref);
  }, [lang.pref]);

  return (
    <LangContext.Provider value={ctx}>{props.children}</LangContext.Provider>
  );
};
