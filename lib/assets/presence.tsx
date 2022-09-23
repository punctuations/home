import { ReactNode } from "react";

export const Presence = (props: { children: ReactNode }) => {
  return (
    <section className="fixed left-3 bottom-3 py-1 rounded-md dark:bg-black bg-white">
      {props.children}
    </section>
  );
};
