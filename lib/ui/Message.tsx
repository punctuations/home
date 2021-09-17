import React from "react";

import { motion } from "framer-motion";
import { chat, message } from "../types/constants";

const Message = (props: { text: string }) => {
  return (
    <motion.div
      variants={message}
      className="message dark:message-dark select-none"
    >
      {props.text}
    </motion.div>
  );
};

const Provider = (props: { children: React.ReactNode }) => {
  return (
    <motion.div
      variants={chat}
      initial="hidden"
      animate="show"
      className="flex flex-col items-start"
    >
      {props.children}
    </motion.div>
  );
};

Message.Provider = Provider;

export default Message;
