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
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
      </svg>
    </button>
  );
};
