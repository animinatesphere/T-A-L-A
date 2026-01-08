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
          className="hero h-[350px] sm:h-[450px] md:h-[550px]  lg:h-[750px] bg-cover bg-center bg-no-repeat flex justify-center items-center relative"
          style={{
            backgroundPosition: "center bottom",
          }}
        >
          {/* Optional: Dark overlay - remove if you don't need it */}
          {/* <div className="absolute inset-0 bg-black/30"></div> */}

          {/* Content Container */}
          <div className="relative z-10 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="text-[#0a2e3e]">All Award-Winning,</span>
                  <br />
                  <span className="text-[#6b0c22]">Reader-Recommended</span>
                  <br />
                  <span className="text-[#5d4e37]">Books</span>
                </h1>
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
