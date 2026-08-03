import React from "react";

export function Label({ children }) {
  return <label className="block text-xs font-semibold text-gray-600 mb-1.5">{children}</label>;
}

export function Input(props) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B0C22]/30 focus:border-[#6B0C22] ${props.className || ""}`}
    />
  );
}

export function Textarea(props) {
  return (
    <textarea
      {...props}
      className={`w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B0C22]/30 focus:border-[#6B0C22] ${props.className || ""}`}
    />
  );
}

export function Select(props) {
  return (
    <select
      {...props}
      className={`w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#6B0C22]/30 focus:border-[#6B0C22] ${props.className || ""}`}
    />
  );
}
