import React from "react";

import { phrases } from "./phrases";
import { LangContext } from "./LangProvider";

export const Globe = () => {
  const { lang, setLang } = React.useContext(LangContext);

  function switchLang() {
    if (lang.pref == "eng") {
      setLang({ pref: "jp", phrases: phrases.jp });
    } else {
      setLang({ pref: "eng", phrases: phrases.eng });
    }
  }

  return (
    <button onClick={() => switchLang()}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </button>
  );
};
