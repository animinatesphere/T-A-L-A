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
    <header className=" bg-[#6B0C22]/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a className="flex items-center gap-3 text-white" href="/">
          <img
            src={logo}
            alt="logo"
            className="w-30 h-30 md:w-30 md:h-30 rounded-full shadow-2xl object-contain transform transition duration-500 hover:scale-105 bg-white/10 p-1 "
          />
        </a>

        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 text-white"
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

          <nav className="hidden md:flex items-center gap-6">
            <ul className="flex items-center gap-6 m-0 p-0">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="group relative text-white ws text-[20px] hover:text-white transition"
                  >
                    <span className="relative z-10">{l.label}</span>
                    <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-gradient-to-r from-yellow-400 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden fixed inset-x-0 top-0 bg-[#6B0C22]/100 backdrop-blur-sm p-6 shadow-2xl z-50">
            <div className="max-w-3xl mx-auto flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={logo}
                    alt="logo"
                    className="w-14 h-14 rounded-full shadow-lg object-contain bg-white/10 p-1"
                  />
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white text-2xl p-2 leading-none"
                >
                  ✕
                </button>
              </div>

              <nav className="flex flex-col gap-3 mt-2">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="text-white text-lg py-3 px-4 rounded-md hover:bg-white/5 transition"
                  >
                    {l.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
