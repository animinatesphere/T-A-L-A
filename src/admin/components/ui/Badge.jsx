import React from "react";

const tones = {
  gray: "bg-gray-100 text-gray-700",
  green: "bg-emerald-100 text-emerald-700",
  red: "bg-red-100 text-red-700",
  yellow: "bg-amber-100 text-amber-700",
  blue: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  wine: "bg-[#6B0C22]/10 text-[#6B0C22]",
};

const STATUS_TONES = {
  active: "green",
  draft: "gray",
  paused: "yellow",
  completed: "blue",
  pending: "gray",
  sent: "green",
  failed: "red",
  skipped: "gray",
  replied: "purple",
  bounced: "red",
  suppressed: "red",
  error: "red",
  approved: "green",
  rejected: "red",
  under_review: "yellow",
};

export default function Badge({ tone, status, children, className = "" }) {
  const resolvedTone = tone || STATUS_TONES[status] || "gray";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${tones[resolvedTone]} ${className}`}
    >
      {children ?? (status ? status.replace(/_/g, " ") : "")}
    </span>
  );
}
