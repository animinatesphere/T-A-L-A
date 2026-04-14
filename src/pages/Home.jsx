import React from "react";
import Navbar from "../component/Navbar";
import IndieBragFeatures from "../component/IndieBragFeatures";
import AwardWinningBooks from "./AwardWinningBooks";
import SubmitBookSection from "../component/SubmitBookSection";

export const Home = () => {
  return (
    <>
      {/* container */}
      <div>
        {/* hero section */}
        <div
          className="hero h-[450px] sm:h-[550px] md:h-[650px] lg:h-[850px] bg-cover bg-center bg-no-repeat flex justify-center items-center relative overflow-hidden"
          style={{
            backgroundPosition: "center bottom",
          }}
        >
          {/* Layered Overlay for Depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60"></div>
          <div className="absolute inset-0 bg-[#6B0C22]/10 backdrop-soft-wine"></div>

          {/* Decorative Elements */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#6B0C22]/20 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#8B1530]/20 rounded-full blur-3xl opacity-50"></div>

          {/* Content Container */}
          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center space-y-6 sm:space-y-8">
                <div className="inline-block animate-fade-in-up stagger-1">
                  <span className="bg-white/10 backdrop-blur-md border border-white/20 px-4 sm:px-6 py-2 rounded-full text-white text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.2em] sm:tracking-widest uppercase mb-4 sm:mb-6 inline-block">
                    Celebrating Excellence in Independent Publishing
                  </span>
                </div>
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-[1.1] sm:leading-[0.9] tracking-tighter text-white animate-fade-in-up stagger-2 drop-shadow-2xl px-2">
                  Award-Winning,
                  <br className="hidden sm:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
                    Reader-Recommended
                  </span>
                  <br className="hidden sm:block" />
                  Books
                </h1>
                
                <div className="animate-fade-in-up stagger-3 pt-6 sm:pt-8">
                  <a 
                    href="#features"
                    className="inline-flex items-center gap-3 sm:gap-4 bg-[#6B0C22] hover:bg-[#8B1530] text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(107,12,34,0.4)] group no-underline"
                  >
                    EXPLORE FEATURES
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* hero section */}
        <IndieBragFeatures />

        <AwardWinningBooks />

        <SubmitBookSection />
      </div>
      {/* container */}
    </>
  );
};
