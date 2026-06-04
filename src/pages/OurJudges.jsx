import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Award } from "lucide-react";

const API_URL = "https://www.theafricalaureateawards.org/api";
const BASE_URL = "";

export default function OurJudges() {
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJudges();
  }, []);

  const fetchJudges = async () => {
    try {
      const response = await fetch(`${API_URL}/judges`);
      const result = await response.json();
      setJudges(result.data);
    } catch (error) {
      console.error("Error fetching judges:", error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${BASE_URL}${url}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Our Judges
          </h1>
          <p className="text-xl text-gray-600 mb-4">Meet Our Judges</p>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white">
          <p className="text-gray-700 text-lg leading-relaxed text-center max-w-4xl mx-auto">
            Our judges are experienced readers and literary professionals who
            care deeply about books and the people who write them. They come
            from different backgrounds and read different genres, bringing
            varied perspectives to the book evaluation process. Each judge
            approaches every book with care and fairness, focusing on the
            quality of the book itself rather than following popularity or
            trends. Their role is to ensure that every submission is read
            thoughtfully and judged with integrity.
          </p>
        </div>
      </div>

      {/* Judges Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading judges...</p>
          </div>
        ) : judges.length === 0 ? (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No judges available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-12 lg:space-y-16">
            {judges.map((judge, index) => (
              <div
                key={judge.id}
                className={`flex flex-col ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } gap-8 lg:gap-12 items-center`}
              >
                {/* Image Section */}
                <div className="w-full lg:w-2/5 flex-shrink-0">
                  <div className="relative">
                    <div className="aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                      {judge.image_url ? (
                        <img
                          src={getImageUrl(judge.image_url)}
                          alt={judge.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                          <Award className="w-24 h-24 text-gray-300" />
                        </div>
                      )}
                    </div>
                    {/* Number Badge */}
                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-3xl font-bold text-white">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-3/5">
                  <div className="space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                      {judge.name}
                    </h2>
                    <p className="text-xl text-gray-600 font-medium">
                      {judge.title}
                    </p>
                    <div className="w-24 h-1 bg-gray-900"></div>
                    <p className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
                      {judge.bio}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-16 sm:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Submit Your Book Today!
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Are you a self-published author? Interested in submitting your book?
          </p>
          <Link to="/submit-your-book">
            <button className="bg-white text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2 shadow-lg">
              Submit Now
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
