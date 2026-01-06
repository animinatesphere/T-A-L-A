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
        <div className="hero h-screen bg-blend-multiply flex justify-center items-center bg-cover bg-center hero">
          <h1 className="text-[25px] sm:text-[25px] md:text-[30px] lg:text-[50px] text-center pt-[10%] font-bold text-white drop-shadow-lg pl-5">
            The Africa Laureate <br />
            <span className="text-[#6b0c22]"> Awards</span> <br /> for Literary
            Excellence
          </h1>
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
