import React, { useEffect, useState } from "react";
import { Award } from "lucide-react";

export default function Loading({ minMs = 700 }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), minMs);
    return () => clearTimeout(t);
  }, [minMs]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#6B0C22] to-[#4a0818]">
      {/* Main content */}
      <div className="flex flex-col items-center gap-8">
        {/* Logo with pulse animation */}
        <div className="relative">
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm animate-pulse">
            <Award className="w-12 h-12 text-white" />
          </div>

          {/* Rotating ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white/50 animate-spin" />
        </div>

        {/* Brand name */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">T.A.L.A.</h2>
          <p className="text-white/80 text-sm">Loading...</p>
        </div>

        {/* Simple progress bar */}
        <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white animate-progress rounded-full" />
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        .animate-progress {
          animation: progress 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
