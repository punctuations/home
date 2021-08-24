import { ReactNode } from "react";

export const Grid = (props: { children: ReactNode }) => {
  return (
    <main className="2xl:absolute xl:absolute w-full h-full 2xl:grid xl:grid flex grid-cols-3 2xl:gap-x-4 xl:gap-x-4 gap-x-0 gap-y-6 place-content-center flex-col items-center 2xl:justify-center xl:justify-center justify-start 2xl:top-auto xl:top-auto top-1/3">
      {props.children}
    </main>
  );
};
