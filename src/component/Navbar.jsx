import React, { useState } from "react";
import logo from "../assets/unnamed (1).jpg";

const links = [
  { label: "Home", href: "/" },
  { label: "Books", href: "/books" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Become a Reader", href: "/become-a-reader" },
  { label: "Donate", href: "/donate" },
  { label: "Submit Your Book", href: "/submit-your-book" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 bg-[#6B0C22] backdrop-blur-xl border-b border-white/5 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a
            className="flex items-center gap-4 text-white no-underline group"
            href="/"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-white/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <img
                src={logo}
                alt="logo"
                className="relative w-12 h-12 md:w-16 md:h-16 rounded-full shadow-2xl object-cover transform transition duration-500 group-hover:scale-110 bg-white p-0.5"
              />
            </div>
            
          </a>

          <div className="flex items-center gap-8">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <ul className="flex items-center gap-8 m-0 p-0 list-none">
                {links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="group relative text-white/80 text-[15px] font-bold hover:text-white transition-all no-underline whitespace-nowrap uppercase tracking-widest active:scale-95 block"
                    >
                      <span className="relative z-10">{l.label}</span>
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-1 bg-white rounded-full opacity-0 group-hover:w-full group-hover:opacity-100 transition-all duration-300" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Hamburger Button */}
            <button
              className="md:hidden p-3 text-white bg-white/10 hover:bg-white/20 rounded-2xl transition-all active:scale-90"
              aria-label="Toggle menu"
              onClick={() => setOpen(!open)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 8h16M4 16h16"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
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
