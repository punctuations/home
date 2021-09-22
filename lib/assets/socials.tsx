import { Twitter, AtSign, GitHub, Mail } from "react-feather";

export const Socials = [
  <a
    title="twitter"
    href={"/twitter"}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Twitter />
  </a>,
  <a
    title="discord"
    href={"/discord"}
    target="_blank"
    rel="noopener noreferrer"
  >
    <AtSign />
  </a>,
  <a title="github" href={"/github"} target="_blank" rel="noopener noreferrer">
    <GitHub />
  </a>,
  <a
    title="email"
    href="mailto:matt@dont-ping.me"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Mail />
  </a>,
];
