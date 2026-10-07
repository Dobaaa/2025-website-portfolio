"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { API_ORIGIN, PortfolioPayload } from "@/lib/portfolio";

type PortfolioState = {
  status: "loading" | "ready" | "error";
  data: PortfolioPayload | null;
};

const PortfolioContext = createContext<PortfolioState>({
  status: "loading",
  data: null,
});

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PortfolioState>({
    status: "loading",
    data: null,
  });

  useEffect(() => {
    let active = true;

    fetch(`${API_ORIGIN}/api/public/portfolio`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Portfolio request failed");
        return response.json();
      })
      .then((payload: PortfolioPayload) => {
        if (active) setState({ status: "ready", data: payload });
      })
      .catch(() => {
        if (active) setState({ status: "error", data: null });
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <PortfolioContext.Provider value={state}>{children}</PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
