"use client";

import { createContext, useContext } from "react";
import { useLanyardWS, type Types } from "use-lanyard";

const LanyardContext = createContext<Types.Presence | undefined>(undefined);

export function LanyardProvider({
  snowflake,
  initialData,
  children,
}: {
  snowflake: Types.Snowflake;
  initialData: Types.Presence;
  children: React.ReactNode;
}) {
  const presence = useLanyardWS(snowflake, { initialData });
  return (
    <LanyardContext.Provider value={presence}>
      {children}
    </LanyardContext.Provider>
  );
}

export function useLanyard() {
  return useContext(LanyardContext);
}
