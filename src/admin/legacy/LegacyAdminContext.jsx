import React, { createContext, useContext } from "react";
import { useLegacyAdminData } from "./useLegacyAdminData";

const LegacyAdminContext = createContext(null);

export function LegacyAdminProvider({ children }) {
  const data = useLegacyAdminData();
  return <LegacyAdminContext.Provider value={data}>{children}</LegacyAdminContext.Provider>;
}

export function useLegacyAdmin() {
  const ctx = useContext(LegacyAdminContext);
  if (!ctx) throw new Error("useLegacyAdmin must be used within LegacyAdminProvider");
  return ctx;
}
