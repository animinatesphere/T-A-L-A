import React from "react";
import { Outlet } from "react-router-dom";
import { LegacyAdminProvider } from "./LegacyAdminContext";
import NotificationToast from "./NotificationToast";

export default function LegacyLayout() {
  return (
    <LegacyAdminProvider>
      <Outlet />
      <NotificationToast />
    </LegacyAdminProvider>
  );
}
