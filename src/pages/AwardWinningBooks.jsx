import React, { useState, useEffect } from "react";
import { BookOpen, Play } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const SUPABASE_URL = "https://sunipfnesvzlkcitbhns.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1bmlwZm5lc3Z6bGtjaXRiaG5zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTE2MDA0MCwiZXhwIjoyMDgwNzM2MDQwfQ.h_UMD88A5kTsZfM3JrkU89tMgDfUUrZY1cCEwIuuKtY";

// Helper function to create URL-friendly slug
// const createSlug = (text) => {
//   return text
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-+|-+$/g, "");
// };

export default function AwardWinningBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/award_winning_books?order=display_order.asc,year_won.desc`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        }
      );
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const videoId = url.match(
      // eslint-disable-next-line no-useless-escape
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    )?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  // Navigate to book detail page with author name slug
  const handleBookClick = () => {
    navigate(`/books`);
  };

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="w-12 h-12 border-4 border-[#6B0C22] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading award-winning books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Books Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-12 flex items-center justify-between border-b-2 border-gray-200 pb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-[#6B0C22] mb-4">
              Nominations Now Open <br /> for the 2026 Book Awards
            </h2>
            <Link to="/submit-your-book">
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                VIEW ALL
              </button>
            </Link>
          </div>

          {/* Books Grid */}
          {books.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No award-winning books available yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-20">
              {books.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleBookClick(book)}
                  className="cursor-pointer group"
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    <img
                      src={book.cover_image_url}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {book.is_featured && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Featured
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <p className="font-bold text-sm line-clamp-2">
                          {book.title}
                        </p>
                        <p className="text-xs opacity-90">by {book.author}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Latest Book Trailers Section */}
          {books.filter((book) => book.video_trailer_url).length > 0 && (
            <div className="mt-20">
              <div className="flex justify-between items-center mb-8 border-b-2 border-gray-200 pb-4">
                <h2 className="text-3xl md:text-4xl font-bold text-teal-700">
                  Celebrating the Latest <br /> Africa Laureate Award Winners
                </h2>
                <Link to="/meet-the-winners">
                  <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16]">
                    VIEW ALL
                  </button>
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {books
                  .filter((book) => book.video_trailer_url)
                  .slice(0, 2)
                  .map((book) => (
                    <div
                      key={book.id}
                      className="bg-white rounded-lg shadow-lg overflow-hidden"
                    >
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="aspect-video bg-black relative">
                          {getYouTubeEmbedUrl(book.video_trailer_url) ? (
                            <iframe
                              src={getYouTubeEmbedUrl(book.video_trailer_url)}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title={book.title}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white">
                              <Play className="w-16 h-16" />
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {book.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4">
                            by {book.author}
                          </p>
                          <p className="text-gray-700 text-sm line-clamp-4">
                            {book.description}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookClick(book);
                            }}
                            className="mt-4 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                          >
                            VIEW THIS BOOK
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
