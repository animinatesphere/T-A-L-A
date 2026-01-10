import React from "react";
import { BookOpen, Award, Mail, Phone } from "lucide-react";
import judge1 from "../assets/IMG_9341.PNG";
import judge2 from "../assets/IMG_0232.JPG";
import { Link } from "react-router-dom";
export default function OurJudges() {
  const judges = [
    {
      id: 1,
      name: "Joshua Ìdòwú Omídire",
      title: "Biographer, Poet & Publisher",
      bio: "Joshua Ìdòwú Omídire is a biographer, poet, language enthusiast, logophile, headitor, ghostwriter, movie critic, book reviewer, publisher, and digital media strategist. He leads Famecliff Digital PRO, a creative hub powered by a team of content gurus dedicated to solving writing, editing, publishing, and branding puzzles for individuals and organisations alike.",
      img: judge1,
    },
    {
      id: 2,
      name: "Ayodeji Ajagbe",
      title: "Award-Winning Author",
      bio: "Ayodeji Ajagbe is an award-winning author. He finished as the first runner-up in the 2020 National Essay Writing competition. His books have received great reviews and recognitions from retailers and bookstores such as Reader Central, Miray Books, Litireso Reviews, Romelia Lungu, and many more. Litireso listed his book – Reflection: Rulers and Preys – as one of its top-10 most-rated books of 2020. He writes thrillers for both adults and teens, these include Sad Love Story and his young adult debut, What Happened to Helen. He was born in Ibadan, Oyo State, and has lived most of his life there. When he is not writing, he can be found reading a book, taking a walk, or hunting for local bookstores around.",

      img: judge2,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}

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
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                      <img src={judge.img} alt="" />
                    </div>
                  </div>
                  {/* Number Badge */}
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-white">
                      {judge.id}
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
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                    {judge.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
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
