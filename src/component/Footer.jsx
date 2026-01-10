import React from "react";
import logo from "../assets/unnamed (1).jpg";
import {
  Award,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const links = [
    { label: "Home", href: "/" },
    { label: "Books", href: "/books" },
    { label: "Judge", href: "/judge" },
    { label: "About", href: "/about" },
    { label: "Become a Reader", href: "/become-a-reader" },
    { label: "Submit Your Book", href: "/submit" },
  ];

  const resourceLinks = [
    { label: "FAQ", href: "/faq" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refund" },
  ];

  const supportLinks = [
    { label: "Contact Us", href: "/contact" },

    { label: "Podcast", href: "/podcast" },
  ];

  return (
    <footer className="bg-[#6B0C22] text-white pt-25">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <a className="flex items-center gap-3 text-white" href="/">
              <img
                src={logo}
                alt="logo"
                className="w-30 h-30 md:w-30 md:h-30 rounded-full shadow-2xl object-contain transform transition duration-500 hover:scale-105 bg-white/10 p-1 "
              />
            </a>
            <p className="text-gray-300 mb-6 leading-relaxed">
              The Africa Laureate Awards - Recognising and supporting quality
              self-published books and independent authors.
            </p>

            {/* Social Media Links */}
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/share/1ZnoT1qGJY/?mibextid=wwXIfr"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/laureateawards?s=21"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="Instagram: https://www.instagram.com/theafricalaureateawards?igsh=MWFkNGtlOW95Y2lzeQ%3D%3D&utm_source=qr"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.threads.net/@theafricalaureateawards"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-300"
              >
                <span className="text-xl font-bold">@</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-300"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {links.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 inline-block hover:translate-x-1 transform"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-4">Podcast</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 inline-block hover:translate-x-1 transform"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-3 mb-6">
              {supportLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 inline-block hover:translate-x-1 transform"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2 text-gray-300">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:theafricalaureateawards@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  theafricalaureateaward@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2 text-gray-300">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Lagos, Nigeria</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-300">
            <div className="text-center md:text-left">
              <p>
                &copy; {new Date().getFullYear()} The Africa Laureate Awards.
                All rights reserved.
              </p>
              <p className="text-lg font-bold mt-1">
                Designed by{" "}
                <Link to="https://hex-portfolio-zeta.vercel.app">
                  {" "}
                  Hexcode{" "}
                </Link>
              </p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </a>
              <span className="text-gray-500">•</span>
              <a href="/terms" className="hover:text-white transition-colors">
                Terms
              </a>
              <span className="text-gray-500">•</span>
              <a href="/cookies" className="hover:text-white transition-colors">
                Cookies
              </a>
              <span className="text-gray-500">•</span>
              <a href="/sitemap" className="hover:text-white transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
