import React from "react";

import { motion } from "framer-motion";
import { chat, message } from "../types/constants";

const Message = (props: { text: string; to?: boolean }) => {
  return (
    <motion.div
      variants={message}
      className={`${
        props.to
          ? "message-to dark:message-dark-to"
          : "message dark:message-dark"
      } select-none`}
    >
      {props.text}
    </motion.div>
  );
};

const Provider = (props: { children: React.ReactNode; to?: boolean }) => {
  return (
    <motion.div
      variants={chat}
      initial="hidden"
      animate="show"
      className={`flex flex-col ${props.to ? "items-end" : "items-start"}`}
    >
      {props.children}
    </motion.div>
  );
};

Message.Provider = Provider;

export default Message;
