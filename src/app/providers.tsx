"use client";

import { AppContextProvider } from "@/AppContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AppContextProvider>{children}</AppContextProvider>;
}
