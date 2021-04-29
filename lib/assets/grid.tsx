import { ReactNode } from "react";

export const Grid = (props: { children: ReactNode }) => {
  return (
    <main className="absolute w-full h-full 2xl:grid xl:grid lg:grid md:flex sm:flex flex grid-cols-3 2xl:gap-x-4 xl:gap-x-4 lg:gap-x-4 gap-x-0 gap-y-6 place-content-center flex-col items-center 2xl:justify-center xl:justify-center lg:justify-center justify-start 2xl:top-auto xl:top-auto lg:top-auto top-1/3">
      {props.children}
    </main>
  );
};
