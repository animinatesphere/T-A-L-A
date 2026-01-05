import React, { useState } from "react";
import logo from "../assets/unnamed (1).jpg";

const links = [
  { label: "Home", href: "/" },
  { label: "Books", href: "/books" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Become a Reader", href: "/Become-a-reader" },
  { label: "Submit Your Book", href: "/submit-your-book" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <header className=" top-0 bg-[#6B0C22]/95 backdrop-blur-sm border-b border-white/10 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a
            className="flex items-center gap-3 text-white no-underline"
            href="/"
          >
            <img
              src={logo}
              alt="logo"
              className="w-12 h-12 md:w-14 md:h-14 rounded-full shadow-2xl object-cover transform transition duration-500 hover:scale-105 bg-white/10 p-1"
            />
          </a>

          <div className="flex items-center gap-4">
            {/* Hamburger Button */}
            <button
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
              onClick={() => setOpen(!open)}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 7h18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M3 12h18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M3 17h18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <ul className="flex items-center gap-6 m-0 p-0 list-none">
                {links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="group relative text-white text-[18px] hover:text-white transition no-underline whitespace-nowrap"
                    >
                      <span className="relative z-10">{l.label}</span>
                      <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-gradient-to-r from-yellow-400 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-[55]"
            onClick={() => setOpen(false)}
          />

          {/* Mobile Menu Panel */}
          <div className="md:hidden fixed inset-x-0 top-0 bg-[#6B0C22] shadow-2xl z-[60] animate-slide-down">
            <div className="p-6">
              {/* Menu Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <img
                    src={logo}
                    alt="logo"
                    className="w-14 h-14 rounded-full shadow-lg object-cover bg-white/10 p-1"
                  />
                  <span className="text-white font-bold text-xl">T.A.L.A.</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white text-2xl p-2 leading-none hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              {/* Menu Links */}
              <nav className="flex flex-col gap-2">
                {links.map((l, idx) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="text-white text-lg py-3 px-4 rounded-lg hover:bg-white/10 transition-all no-underline transform hover:translate-x-1"
                    style={{
                      animation: `slideIn 0.3s ease-out ${idx * 0.05}s both`,
                    }}
                  >
                    {l.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
