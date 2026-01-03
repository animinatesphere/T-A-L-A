import React, { useEffect, useState } from "react";
import { Home, Search, BookOpen, ArrowLeft, Award } from "lucide-react";

export default function TALA404Page() {
  const [isVisible, setIsVisible] = useState(false);
  const [floatingBooks, setFloatingBooks] = useState([]);

  useEffect(() => {
    // Generate random floating book positions
    const books = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
    }));

    // Defer state updates to the next frame to avoid synchronous setState in effect
    const raf = requestAnimationFrame(() => {
      setIsVisible(true);
      setFloatingBooks(books);
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6B0C22] via-[#8B1530] to-[#4a0818] relative overflow-hidden flex items-center justify-center">
      {/* Floating Books Background */}
      {floatingBooks.map((book) => (
        <div
          key={book.id}
          className="absolute text-white opacity-10"
          style={{
            left: `${book.left}%`,
            top: `${book.top}%`,
            animation: `float ${book.duration}s ease-in-out infinite`,
            animationDelay: `${book.delay}s`,
          }}
        >
          <BookOpen className="w-12 h-12 md:w-16 md:h-16" />
        </div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo/Brand */}
        <div
          className={`flex items-center justify-center mb-8 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10"
          }`}
        >
          <Award className="w-12 h-12 md:w-16 md:h-16 text-white mr-3" />
          <span className="text-3xl md:text-4xl font-bold text-white">
            T.A.L.A.
          </span>
        </div>

        {/* 404 Number */}
        <div
          className={`transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        >
          <h1 className="text-9xl md:text-[200px] font-bold text-white mb-4 leading-none drop-shadow-2xl">
            404
          </h1>
        </div>

        {/* Message */}
        <div
          className={`transition-all duration-1000 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Looks like this story hasn't been written yet. The page you're
            looking for seems to have wandered off into the literary wilderness.
          </p>
        </div>

        {/* Action Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-600 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <button className="group flex items-center gap-2 bg-white text-[#6B0C22] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:scale-105 w-full sm:w-auto">
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Go Home
          </button>

          <button className="group flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-[#6B0C22] transition-all duration-300 shadow-xl hover:scale-105 w-full sm:w-auto">
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Search Site
          </button>
        </div>

        {/* Quick Links */}
        <div
          className={`mt-12 transition-all duration-1000 delay-800 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-gray-300 mb-4 text-sm uppercase tracking-wider font-semibold">
            Or try these pages
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#"
              className="text-white hover:text-gray-200 underline transition-colors"
            >
              About Us
            </a>
            <span className="text-gray-400">•</span>
            <a
              href="#"
              className="text-white hover:text-gray-200 underline transition-colors"
            >
              Browse Books
            </a>
            <span className="text-gray-400">•</span>
            <a
              href="#"
              className="text-white hover:text-gray-200 underline transition-colors"
            >
              Submit Your Book
            </a>
            <span className="text-gray-400">•</span>
            <a
              href="#"
              className="text-white hover:text-gray-200 underline transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* Back Button */}
        <div
          className={`mt-12 transition-all duration-1000 delay-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <button className="group inline-flex items-center gap-2 text-gray-200 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm uppercase tracking-wider font-semibold">
              Go Back
            </span>
          </button>
        </div>
      </div>

      {/* CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
      `}</style>
    </div>
  );
}
