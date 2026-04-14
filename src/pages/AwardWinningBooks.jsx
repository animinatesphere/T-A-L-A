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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
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

  // Pagination Logic
  const totalPages = Math.ceil(books.length / itemsPerPage);
  const currentBooks = books.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const element = document.getElementById("award-books");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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

  // Navigate to book detail page
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
    <div id="award-books" className="bg-white">
      {/* Books Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-sm font-black text-[#6B0C22] uppercase tracking-[0.3em] mb-4">
                Hall of Fame
              </h2>
              <h3 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Award-Winning <br />
                <span className="text-[#6B0C22]">Masterpieces</span>
              </h3>
            </div>
            <Link to="/books" className="no-underline">
              <button className="bg-gray-900 hover:bg-[#6B0C22] text-white px-10 py-4 rounded-full font-bold transition-all shadow-xl hover:-translate-y-1">
                VIEW FULL COLLECTION
              </button>
            </Link>
          </div>

          {/* Books Grid */}
          {books.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
              <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">
                No award-winning books available yet.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16">
                {currentBooks.map((book, idx) => (
                  <div
                    key={book.id}
                    onClick={() => handleBookClick(book)}
                    className={`cursor-pointer group animate-fade-in-up`}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.1)] group-hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)] transition-all duration-500">
                      <img
                        src={book.cover_image_url}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <p className="font-bold text-lg leading-tight mb-2">
                            {book.title}
                          </p>
                          <p className="text-sm text-white/70 italic uppercase tracking-wider">
                            {book.author}
                          </p>
                        </div>
                      </div>
                      {book.is_featured && (
                        <div className="absolute top-4 right-4 glass-panel px-3 py-1.5 rounded-full text-[10px] text-white font-black uppercase tracking-widest">
                          FEATURED
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mt-12">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#6B0C22] hover:text-[#6B0C22] disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all font-bold"
                  >
                    ←
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-12 h-12 rounded-full font-bold transition-all ${
                        currentPage === i + 1
                          ? "bg-[#6B0C22] text-white shadow-lg"
                          : "bg-white border border-gray-200 text-gray-600 hover:border-[#6B0C22] hover:text-[#6B0C22]"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#6B0C22] hover:text-[#6B0C22] disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all font-bold"
                  >
                    →
                  </button>
                </div>
              )}
            </>
          )}

          {/* Latest Book Trailers Section */}
          {books.filter((book) => book.video_trailer_url).length > 0 && (
            <div className="mt-32">
              <div className="flex flex-col md:flex-row md:items-end justify-between items-center mb-12 border-b border-gray-100 pb-8">
                <div>
                  <h2 className="text-sm font-black text-teal-600 uppercase tracking-[0.3em] mb-4">
                    Visual Stories
                  </h2>
                  <h3 className="text-4xl lg:text-5xl font-bold text-gray-900">
                    Latest <span className="text-teal-600">Book Trailers</span>
                  </h3>
                </div>
                <Link to="/meet-the-winners" className="no-underline">
                  <button className="text-teal-600 font-bold hover:text-teal-700 transition-all flex items-center gap-2 group">
                    VIEW ALL TRAILERS
                    <span className="w-8 h-8 rounded-full border border-teal-100 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all">
                      →
                    </span>
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
