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
        <div className="hero h-[200px] min-h-screen bg-cover bg-center bg-no-repeat flex justify-center items-center relative ">
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Content */}
          <div className="relative z-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-center font-bold text-white drop-shadow-2xl leading-tight">
              The Africa Laureate <br />
              <span className="text-[#6b0c22] drop-shadow-lg">
                {" "}
                Awards
              </span>{" "}
              <br />
              for Literary Excellence
            </h1>
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
