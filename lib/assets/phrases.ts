import ntw from "number-to-words";

export const phrases = {
  eng: {
    intro: {
      name: "Hey, I'm Matt",
      name_short: "matt",
      short: "I'm a TypeScript Developer",
      bio: `I'm a ${ntw.toWords(
        new Date().getFullYear() - 2005
      )}-year-old TypeScript developer`,
      skip: "skip",
    },
    lanyard: {
      cta: "Listen Along",
      dc: "Disconnect",
      listening: "LISTENING ON SPOTIFY",
      credit: "by",
    },
    error: {
      name: "404 ERROR",
      desc: "Page not found",
      instructions: "Please check the URL in the address bar and try again.",
      return: "Return"
    },
    navigation: ["home", "projects", "message", "music"],
    prompt: "Message",
    fin: "Done",
    pages: {
      home: "HOME",
      projects: "PROJECTS",
      message: "PING",
      music: "MUSIC",
    },
  },
  jp: {
    intro: {
      name: "マットです",
      name_short: "マット",
      short: "Typescript開発です！",
      bio: `${new Date().getFullYear() - 2005}歳のTypescript開発者です!`,
      skip: "早送り",
    },
    lanyard: {
      cta: "一緒に聞く",
      dc: "一緒に聞くのをやめなさい",
      listening: "Spotifyで聴く",
      credit: "",
    },
    error: {
      name: "404エラー",
      desc: "お探しのページは見つかりませんでした",
      instructions: "ページが削除されているか、アドレスが変更されている可能性があります。",
      return: "戻る"
    },
    navigation: ["家", "プロジェクト", "チャット", "音楽"],
    prompt: "チャット",
    fin: "完了",
    pages: {
      home: "家",
      projects: "プロジェクト",
      message: "チャット",
      music: "音楽",
    },
  },
};
