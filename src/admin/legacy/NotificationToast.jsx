import React from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { useLegacyAdmin } from "./LegacyAdminContext";

export default function NotificationToast() {
  const { notification } = useLegacyAdmin();
  if (!notification.show) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] animate-fade-in-up">
      <div
        className={`${
          notification.type === "error" ? "bg-red-600" : "bg-green-600"
        } text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 backdrop-blur-sm`}
      >
        {notification.type === "error" ? <XCircle className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
        <p className="font-bold tracking-wide">{notification.message}</p>
      </div>
    </div>
  );
}
