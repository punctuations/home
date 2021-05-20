import { ReactNode } from "react";

export const Main = (props: { children: ReactNode }) => {
  return (
    <main className="absolute w-full h-full 2xl:grid xl:grid lg:grid flex grid-cols-2 place-content-center flex-col space-y-6 items-center justify-center">
      {props.children}
    </main>
  );
};
