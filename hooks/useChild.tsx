"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Child = {
  name: string;
  age: number;
  neurotype: string;
};

type ChildContextValue = {
  activeChild: Child | null;
  setActiveChild: React.Dispatch<React.SetStateAction<Child | null>>;
};

const ChildContext = createContext<ChildContextValue | undefined>(undefined);

export function ChildProvider({ children }: { children: ReactNode }) {
  const [activeChild, setActiveChild] = useState<Child | null>(null);

  const value = useMemo(
    () => ({ activeChild, setActiveChild }),
    [activeChild]
  );

  return <ChildContext.Provider value={value}>{children}</ChildContext.Provider>;
}

export function useChild() {
  const ctx = useContext(ChildContext);
  if (!ctx) {
    throw new Error("useChild must be used within a ChildProvider");
  }
  return ctx;
}
