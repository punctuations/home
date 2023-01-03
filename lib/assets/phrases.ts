import ntw from "number-to-words";

const age = ntw.toWords(
  new Date().getFullYear() - 2005
)
const vowel = '^[aieouAIEOU].*'

export const phrases = {
  eng: {
    intro: {
      name: "Hey, I'm Matt",
      name_short: "matt",
      short: "I'm a Software Developer",
      bio: `I'm ${age.match(vowel) ? "an" : "a"} ${age}-year-old software developer`,
      intro:
        "Currently I'm a student studying both computer science and linguistics.",
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
      return: "Return",
    },
    navigation: ["Home", "Projects", "Message", "Music"],
    form: {
      phone: "phone",
      email: "email",
    },
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
      short: "ソフトウェア開発です！",
      bio: `${new Date().getFullYear() - 2005}歳のソフトウェア開発者です!`,
      intro: "現在、コンピューターサイエンスと言語学を勉強している学生です",
      skip: "スキップ",
    },
    lanyard: {
      cta: "一緒に聴く",
      dc: "一緒に聴くのをやめなさい",
      listening: "Spotifyで聴く",
      credit: "",
    },
    error: {
      name: "404エラー",
      desc: "お探しのページは見つかりませんでした",
      instructions:
        "ページが削除されているか、アドレスが変更されている可能性があります。",
      return: "戻る",
    },
    navigation: ["ホーム", "プロジェクト", "チャット", "音楽"],
    form: {
      phone: "電話番号",
      email: "メール",
    },
    prompt: "メッセージ",
    fin: "完了",
    pages: {
      home: "ホーム",
      projects: "プロジェクト",
      message: "チャット",
      music: "音楽",
    },
  },
};
