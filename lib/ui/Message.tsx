import React from "react";

import { motion } from "framer-motion";
import { chat, message } from "../types/constants";

const Message = (props: { text: string; hide?: boolean; to?: boolean }) => {
  return (
    <motion.div
      variants={message}
      className={`${
        props.to
          ? `${
              props.hide
                ? "message-hidden-to"
                : "message-to dark:message-dark-to"
            }`
          : `${
              props.hide
                ? "message-hidden dark:message-hidden-dark"
                : "message dark:message-dark"
            }`
      } select-none`}
    >
      {props.text}
    </motion.div>
  );
};

const Provider = (props: {
  children: React.ReactNode;
  pfp?: string;
  to?: boolean;
  className?: string;
}) => {
  return (
    <motion.div
      variants={chat}
      initial="hidden"
      animate="show"
      className={`flex ${props.pfp ? "flex-row space-x-3" : "flex-col"} ${
        props.to || props.pfp ? "items-end" : "items-start"
      } ${props.className}`}
    >
      {props.pfp ? (
        <>
          <motion.img
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                delay: 0.5,
                duration: 0.7,
                ease: [0.48, 0.15, 0.25, 0.96],
              },
            }}
            src={props.pfp}
            alt="pfp"
            className="z-10 mb-1.5 h-8 w-8 rounded-full"
          />
          <div className="flex flex-col items-start">{props.children}</div>
        </>
      ) : (
        props.children
      )}
    </motion.div>
  );
};

Message.Provider = Provider;

export default Message;
