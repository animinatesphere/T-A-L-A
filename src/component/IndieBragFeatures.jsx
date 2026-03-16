import React from "react";
import { Facebook, Instagram, Twitter, Menu } from "lucide-react";
import left from "../assets/IMG_0917.PNG";
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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Book Image */}
          <div className="bg-[#0a2e3e] p-8 rounded-lg shadow-xl">
            <div className="bg-white p-6 rounded-lg">
              <Link to="/podcast">
                <img
                  src={left}
                  alt="Eat Read Dream Cookbook"
                  className="w-full rounded shadow-2xl"
                />
              </Link>
            </div>
          </div>

          {/* Right Side - Features */}
          <div className="bg-gradient-to-br from-[#6B0C22] to-[#8B1538] p-8 lg:p-12 rounded-lg shadow-xl text-white">
            <h2 className="text-4xl lg:text-5xl font-bold mb-8">Features</h2>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index}>
                  <a
                    href={feature.href}
                    className="text-lg lg:text-xl hover:text-gray-200 transition block py-2"
                  >
                    {feature.label}
                  </a>
                  {index < features.length - 1 && (
                    <div className="border-b border-white/30 mt-2"></div>
                  )}
                </div>
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
