import React, { useEffect, useState } from "react";
import {
  Award,
  BookOpen,
  Heart,
  Zap,
  Ghost,
  Rocket,
  Users,
  Music,
  Mic,
  Palette,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function TALACategoriesPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // defer state update to the next frame to trigger entrance animations
    const raf = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const categoryGroups = [
    {
      title: "Core Literary Awards",
      icon: <Award className="w-6 h-6" />,
      color: "from-[#6B0C22] to-[#4a0818]",
      categories: [
        "Best Author of the Year",
        "Best Literary Fiction Book",
        "Best Popular Fiction Book",
        "Best Debut Novel",
        "Best First Book – Fiction",
        "Best First Book – Non-Fiction",
      ],
    },
    {
      title: "Fiction Genre Awards",
      icon: <BookOpen className="w-6 h-6" />,
      color: "from-purple-600 to-purple-800",
      categories: [
        "Best Romance Book",
        "Best Thriller Book",
        "Best Suspense / Thriller Book",
        "Best Mystery Book",
        "Best Historical Fiction Book",
        "Best Fantasy Book",
        "Best Science Fiction Book",
        "Best Horror Book",
        "Best Military & Wartime Fiction Book",
        "Best Faith-Based Fiction Book",
        "Best Visionary & New Age Fiction Book",
        "Best Humor Book",
        "Best Erotica Book",
        "Best LGBTQ+ Fiction Book",
        "Best Multicultural Fiction Book",
      ],
    },
    {
      title: "Children Books & Young Adult Fiction Awards",
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-600 to-blue-800",
      categories: [
        "Best Juvenile Fiction Book",
        "Best Young Adult Fiction Book – General",
        "Best Young Adult Fiction Book – Fantasy",
        "Best Novella or Short Fiction Book",
        "Best Short Story Collection",
      ],
    },
    {
      title: "Poetry & Anthologies",
      icon: <Music className="w-6 h-6" />,
      color: "from-pink-600 to-pink-800",
      categories: [
        "Best Poetry Collection",
        "Best Themed Poetry Collection",
        "Best Anthology Book",
      ],
    },
    {
      title: "Non-Fiction Awards",
      icon: <BookOpen className="w-6 h-6" />,
      color: "from-orange-600 to-orange-800",
      categories: [
        "Best True Crime Book",
        "Best Creative Non-Fiction Book",
        "Best Biography Book",
        "Best Autobiography or Memoir – Public Life & Influence",
        "Best Autobiography or Memoir – Family & Identity",
        "Best Autobiography or Memoir – Personal Struggle & Recovery",
        "Best Multicultural Non-Fiction Book",
        "Best LGBTQ+ Non-Fiction Book",
        "Best Juvenile & Young Adult Non-Fiction Book",
      ],
    },
    {
      title: "Series, Design & Audiobook Narration",
      icon: <Palette className="w-6 h-6" />,
      color: "from-green-600 to-green-800",
      categories: [
        "Best Book Series – Fiction",
        "Best Book Series – Non-Fiction",
        "Best Cover Design – Fiction",
        "Best Cover Design – Non-Fiction",
        "Best Audiobook Narration – Fiction",
        "Best Audiobook Narration – Mystery / Thriller",
        "Best Audiobook Narration – Non-Fiction",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className={`bg-gradient-to-br from-[#6B0C22] to-[#4a0818] text-white py-20 md:py-32 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
              <Award className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Explore Our Award Categories
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
              The Africa Laureate Award features over forty categories,
              celebrating excellence in a wide array of publishing genres and
              formats
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section
        className={`py-16 bg-white transition-all duration-1000 delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
              From fiction and non-fiction categories to specialized ebook
              awards, The Africa Laureate Awards recognise outstanding works in
              fiction, non-fiction, poetry and many more. With a category for
              everyone, we encourage you to submit your books and showcase your
              talents and writing prowess.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {categoryGroups.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className={`transition-all duration-500 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${400 + groupIndex * 100}ms` }}
              >
                {/* Group Header */}
                <div
                  className={`bg-gradient-to-r ${group.color} text-white rounded-2xl p-6 mb-6 shadow-lg`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      {group.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold">
                        {group.title}
                      </h2>
                      <p className="text-sm text-white/80 mt-1">
                        {group.categories.length} Categories
                      </p>
                    </div>
                  </div>
                </div>

                {/* Categories List */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.categories.map((category, catIndex) => (
                    <div
                      key={catIndex}
                      className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#6B0C22] rounded-lg flex items-center justify-center text-white text-sm font-bold group-hover:scale-110 transition-transform">
                          {groupIndex === 0
                            ? catIndex + 1
                            : groupIndex === 1
                            ? catIndex + 7
                            : groupIndex === 2
                            ? catIndex + 22
                            : groupIndex === 3
                            ? catIndex + 27
                            : groupIndex === 4
                            ? catIndex + 30
                            : catIndex + 39}
                        </div>
                        <h3 className="text-gray-900 font-semibold leading-snug flex-1">
                          {category}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className={`py-16 bg-white transition-all duration-1000 delay-600 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-gradient-to-br from-[#6B0C22] to-[#4a0818] text-white rounded-2xl p-8">
              <div className="text-5xl font-bold mb-2">45+</div>
              <div className="text-lg">Award Categories</div>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-2xl p-8">
              <div className="text-5xl font-bold mb-2">6</div>
              <div className="text-lg">Major Categories</div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-8">
              <div className="text-5xl font-bold mb-2">∞</div>
              <div className="text-lg">Opportunities</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className={`py-16 md:py-24 bg-gradient-to-br from-[#6B0C22] to-[#4a0818] text-white transition-all duration-1000 delay-800 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Submit Your Book?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Find the perfect category for your work and take the first step
            toward recognition
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/submit-your-book">
              <button className="bg-white text-[#6B0C22] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl hover:scale-105">
                Submit Your Book
              </button>
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-[#6B0C22] transition-colors shadow-xl hover:scale-105">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
