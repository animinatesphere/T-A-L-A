import React from "react";
import { Link } from "react-router-dom";

export default function SubmitBookSection() {
  return (
    <div className="bg-[#0a2e3e] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Submit Your Book Today!
            </h2>
            <p className="text-lg md:text-xl text-gray-200">
              Are you a self-published author? Interested in submitting your
              book to indieBRAG?
            </p>
          </div>
          <Link to="/submit-your-book">
            <button className="bg-[#d4af7a] hover:bg-[#c19a61] text-gray-900 px-12 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg whitespace-nowrap w-full md:w-auto lg:w-[200px]">
              SUBMIT NOW
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
