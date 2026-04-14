import React from "react";
import { Link } from "react-router-dom";

export default function SubmitBookSection() {
  return (
    <div className="bg-[#0a2e3e] py-24 px-4 relative overflow-hidden">
      {/* Decorative Blur Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#6B0C22]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-12 md:p-20 rounded-[3rem] shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
            <div className="text-white max-w-2xl">
              <h2 className="text-sm font-black text-teal-400 uppercase tracking-[0.3em] mb-6">
                Join the Winners
              </h2>
              <h3 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                Submit Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">Book Today!</span>
              </h3>
              <p className="text-lg md:text-2xl text-white/70 leading-relaxed font-light">
                Are you a self-published author? Interested in submitting your
                book to The Africa Laureate Awards? Take the next step in your career.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link to="/submit-your-book" className="no-underline">
                <button className="bg-[#d4af7a] hover:bg-white text-gray-900 hover:text-[#6B0C22] px-16 py-6 rounded-full font-black text-xl transition-all shadow-[0_20px_40px_rgba(212,175,122,0.3)] hover:shadow-[0_20px_40px_rgba(255,255,255,0.2)] hover:-translate-y-2 whitespace-nowrap active:scale-95 tracking-tighter uppercase">
                  SUBMIT NOW
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
