import { ReactNode } from "react";

export const Presence = (props: { children: ReactNode }) => {
  return (
    <section className="z-10 fixed left-3 bottom-3 py-1 pl-1 pr-2 rounded-md dark:bg-black bg-white duration-300">
      {props.children}
    </section>
  );
};
