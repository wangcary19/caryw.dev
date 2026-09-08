"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface ReadingState {
  isReading: boolean;
  setReading: (value: boolean) => void;
}

const ReadingContext = createContext<ReadingState>({
  isReading: false,
  setReading: () => {},
});

export function ReadingProvider({ children }: { children: ReactNode }) {
  const [isReading, setReading] = useState(false);

  return (
    <ReadingContext.Provider value={{ isReading, setReading }}>
      {children}
    </ReadingContext.Provider>
  );
}

export function useReading() {
  return useContext(ReadingContext);
}
