import { Twitter, AtSign, GitHub, Mail } from "react-feather";

export const Socials = [
  <a
    title="twitter"
    href={"/twitter"}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Twitter className="hover:opacity-40 duration-500 transition-opacity dark:text-white" />
  </a>,
  <a
    title="discord"
    href={"/discord"}
    target="_blank"
    rel="noopener noreferrer"
  >
    <AtSign className="hover:opacity-40 duration-500 transition-opacity dark:text-white" />
  </a>,
  <a title="github" href={"/github"} target="_blank" rel="noopener noreferrer">
    <GitHub className="hover:opacity-40 duration-500 transition-opacity dark:text-white" />
  </a>,
  <a
    title="email"
    href="mailto:matt@dont-ping.me"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Mail className="hover:opacity-40 duration-500 transition-opacity dark:text-white" />
  </a>,
];
