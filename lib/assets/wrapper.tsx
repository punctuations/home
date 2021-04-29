import { ReactNode } from "react";

export const Wrapper = (props: { children: ReactNode }) => {
  return (
    <main className="absolute w-full h-full 2xl:grid xl:grid lg:grid md:flex sm:flex flex place-content-center flex-col items-center justify-center">
      {props.children}
    </main>
  );
};
