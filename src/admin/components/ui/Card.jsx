import React from "react";

export default function Card({ className = "", children, ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, hint }) {
  return (
    <Card className="p-5 flex items-center gap-4">
      {Icon && (
        <div className="w-11 h-11 rounded-xl bg-[#6B0C22]/10 text-[#6B0C22] flex items-center justify-center shrink-0">
          <Icon size={20} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
        <p className="text-xs text-gray-500 truncate">{label}</p>
        {hint && <p className="text-[11px] text-gray-400 mt-0.5">{hint}</p>}
      </div>
    </Card>
  );
}
