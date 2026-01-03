import React, { useEffect, useState } from "react";
import { Sparkles, BookOpen, Heart } from "lucide-react";

export default function Loading({ minMs = 700 }) {
  const [show, setShow] = useState(true);
  const [loadingText, setLoadingText] = useState("Loading");

  useEffect(() => {
    const t = setTimeout(() => setShow(false), minMs);
    return () => clearTimeout(t);
  }, [minMs]);

  useEffect(() => {
    const phrases = [
      "Loading magic",
      "Preparing stories",
      "Opening books",
      "Almost there",
      "Just a moment",
    ];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % phrases.length;
      setLoadingText(phrases[index]);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 right-20 w-40 h-40 bg-yellow-300/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-pink-300/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center gap-8 z-10">
        {/* Logo container with floating animation */}
        <div className="relative">
          {/* Sparkle effects around logo */}
          <Sparkles className="absolute -top-4 -right-4 w-6 h-6 text-yellow-300 animate-ping" />
          <Sparkles className="absolute -bottom-4 -left-4 w-5 h-5 text-pink-300 animate-ping animation-delay-1000" />
          <Heart className="absolute top-0 -right-6 w-4 h-4 text-red-300 animate-bounce" />

          {/* Logo */}
          <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-2xl border-4 border-white/30 animate-float-slow">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            <div className="w-full h-full bg-white flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-purple-600 animate-pulse" />
            </div>
          </div>

          {/* Rotating ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white/50 animate-spin-slow" />
        </div>

        {/* Bouncing books */}
        <div className="flex items-end gap-3 h-16">
          <div
            className="w-3 h-8 bg-yellow-300 rounded-sm animate-bounce"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="w-3 h-12 bg-pink-400 rounded-sm animate-bounce"
            style={{ animationDelay: "0.1s" }}
          />
          <div
            className="w-3 h-10 bg-purple-400 rounded-sm animate-bounce"
            style={{ animationDelay: "0.2s" }}
          />
          <div
            className="w-3 h-14 bg-orange-400 rounded-sm animate-bounce"
            style={{ animationDelay: "0.3s" }}
          />
          <div
            className="w-3 h-9 bg-blue-400 rounded-sm animate-bounce"
            style={{ animationDelay: "0.4s" }}
          />
        </div>

        {/* Loading text */}
        <div className="text-center space-y-3">
          <div className="text-2xl font-bold text-white drop-shadow-lg flex items-center gap-2 justify-center">
            <span className="animate-fade-in">{loadingText}</span>
            <span className="inline-flex gap-1">
              <span className="animate-bounce" style={{ animationDelay: "0s" }}>
                .
              </span>
              <span
                className="animate-bounce"
                style={{ animationDelay: "0.1s" }}
              >
                .
              </span>
              <span
                className="animate-bounce"
                style={{ animationDelay: "0.2s" }}
              >
                .
              </span>
            </span>
          </div>
          <div className="text-white/90 text-sm font-medium">
            ✨ Preparing something special for you ✨
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
          <div className="h-full bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 animate-progress rounded-full" />
        </div>

        {/* Cute floating hearts */}
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-pink-400 rounded-full animate-pulse" />
          <div
            className="w-6 h-6 bg-yellow-300 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          />
          <div
            className="w-7 h-7 bg-purple-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          />
          <div
            className="w-5 h-5 bg-orange-300 rounded-full animate-bounce"
            style={{ animationDelay: "0.6s" }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float-slow {
          animation: float-slow 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }

        .animate-blob {
          animation: blob 7s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
