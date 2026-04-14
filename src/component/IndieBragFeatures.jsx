import React from "react";
import { Facebook, Instagram, Twitter, Menu } from "lucide-react";
import left from "../assets/IMG_2706.JPG";
import { Link } from "react-router-dom";
export default function IndieBragFeatures() {
  const features = [
    { label: "Books", href: "/books" },
    { label: "Categories", href: "/categories" },
    { label: "The Laureate Journal", href: "/blog" },
    { label: "The Reading Room", href: "/become-a-reader" },
    { label: "The Book Desk", href: "/book-desk" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Book Trailers", href: "/book-trailers" },
  ];

  return (
    <div id="features" className="py-24 bg-gray-50 overflow-hidden">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Book Image */}
          <div className="relative group animate-fade-in-up stagger-1">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#6B0C22]/20 to-teal-500/20 rounded-2xl blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-white p-4 rounded-2xl shadow-2xl transform transition duration-700 group-hover:scale-[1.02] group-hover:-rotate-1">
              <Link to="/podcast" className="block overflow-hidden rounded-xl">
                <img
                  src={left}
                  alt="Feature Highlight"
                  className="w-full h-full object-cover transform transition duration-1000 group-hover:scale-110"
                />
              </Link>
            </div>
          </div>

          {/* Right Side - Features */}
          <div className="animate-fade-in-up stagger-2">
            <div className="mb-12">
              <h2 className="text-sm font-black text-[#6B0C22] uppercase tracking-[0.3em] mb-4">
                Our Ecosystem
              </h2>
              <h3 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Empowering the <br />
                <span className="text-[#6B0C22]">Indie Author Voice</span>
              </h3>
            </div>

            <div className="grid gap-4">
              {features.map((feature, index) => (
                <Link
                  key={index}
                  to={feature.href}
                  className="group relative flex items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl transition-all duration-300 hover:border-[#6B0C22]/30 hover:shadow-[0_10px_30px_rgba(107,12,34,0.05)] hover:-translate-y-1 no-underline"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-[#6B0C22] group-hover:bg-[#6B0C22] group-hover:text-white transition-colors duration-300">
                      <span className="font-bold text-lg">{index + 1}</span>
                    </div>
                    <span className="text-lg font-bold text-gray-800 tracking-tight group-hover:text-[#6B0C22] transition-colors">
                      {feature.label}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#6B0C22] group-hover:border-[#6B0C22]/30 transition-all">
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Connect Section */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">
            Connect with <br /> The Africa Laureate Awards
          </h2>

          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/share/1DpEKeNpV8/?mibextid=wwXlfr"
              className="bg-[#6B0C22] hover:bg-[#8B1538] text-white p-4 rounded-full transition shadow-lg"
              aria-label="Facebook"
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a
              href="https://www.instagram.com/theafricalaureate?igsh=eTBpZ3oyZHNyM3l1&utm_source=qr"
              className="bg-[#6B0C22] hover:bg-[#8B1538] text-white p-4 rounded-full transition shadow-lg"
              aria-label="Instagram"
            >
              <Instagram className="h-6 w-6" />
            </a>
            <a
              href="https://twitter.com/laureateAwards?s=21"
              className="bg-[#6B0C22] hover:bg-[#8B1538] text-white p-4 rounded-full transition shadow-lg"
              aria-label="Twitter"
            >
              <Twitter className="h-6 w-6" />
            </a>
            <a
              href="https://www.threads.net/@theafricalaureateawards"
              className="bg-[#6B0C22] hover:bg-[#8B1538] text-white p-4 rounded-full transition shadow-lg flex items-center justify-center"
              aria-label="Threads"
            >
              <span className="text-xl font-bold">@</span>
            </a>
            <a
              href="https://www.tiktok.com/@theafricalaureateawards?_r=1&_t=ZS-92n2nSdpjj0sh"
              className="bg-[#6B0C22] hover:bg-[#8B1538] text-white p-4 rounded-full transition shadow-lg flex items-center justify-center"
              aria-label="More"
            >
              <span className="text-xl font-bold">+</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
