import React, { useState, useEffect } from "react";
import { BookOpen, ExternalLink, Play, Search, ArrowLeft } from "lucide-react";

const SUPABASE_URL = "https://sunipfnesvzlkcitbhns.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1bmlwZm5lc3Z6bGtjaXRiaG5zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTE2MDA0MCwiZXhwIjoyMDgwNzM2MDQwfQ.h_UMD88A5kTsZfM3JrkU89tMgDfUUrZY1cCEwIuuKtY";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [genres, setGenres] = useState([]);
  const [years, setYears] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books, selectedGenre, selectedYear, searchTerm]);

  const fetchBooks = async () => {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/award_winning_books?order=year_won.desc,title.asc`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        }
      );
      const data = await response.json();
      setBooks(data);

      const uniqueGenres = [
        ...new Set(data.map((book) => book.genre).filter(Boolean)),
      ];
      const uniqueYears = [
        ...new Set(data.map((book) => book.year_won).filter(Boolean)),
      ].sort((a, b) => b - a);

      setGenres(uniqueGenres);
      setYears(uniqueYears);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = [...books];

    if (selectedGenre !== "all") {
      filtered = filtered.filter((book) => book.genre === selectedGenre);
    }

    if (selectedYear !== "all") {
      filtered = filtered.filter(
        (book) => book.year_won === parseInt(selectedYear)
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBooks(filtered);
  };

  const resetFilters = () => {
    setSelectedGenre("all");
    setSelectedYear("all");
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#6B0C22] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading award-winning books...</p>
        </div>
      </div>
    );
  }

  // Book Detail Page View
  if (selectedBook) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Back Button Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => setSelectedBook(null)}
              className="flex items-center gap-2 text-[#6B0C22] hover:text-[#8B1530] font-semibold transition-all hover:gap-3"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Books
            </button>
          </div>
        </div>

        {/* Book Detail Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
              {/* Book Cover */}
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <img
                    src={selectedBook.cover_image_url}
                    alt={selectedBook.title}
                    className="w-full rounded-lg shadow-2xl"
                  />
                  {selectedBook.is_featured && (
                    <div className="mt-4 inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-bold">
                      ⭐ Featured Book
                    </div>
                  )}
                </div>
              </div>

              {/* Book Details */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-[#6B0C22] mb-3">
                    {selectedBook.title}
                  </h1>
                  <p className="text-2xl text-gray-600 italic mb-3">
                    by {selectedBook.author}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedBook.genre && (
                      <span className="inline-block bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-semibold">
                        {selectedBook.genre}
                      </span>
                    )}
                    {selectedBook.year_won && (
                      <span className="inline-block bg-[#6B0C22] text-white px-4 py-2 rounded-full text-sm font-bold">
                        Winner {selectedBook.year_won}
                      </span>
                    )}
                  </div>
                </div>

                {/* Synopsis/Description */}
                {(selectedBook.synopsis || selectedBook.description) && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {selectedBook.synopsis ? "Synopsis" : "Description"}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {selectedBook.synopsis || selectedBook.description}
                    </p>
                  </div>
                )}

                {/* Buy Links */}
                {(selectedBook.amazon_url || selectedBook.amazon_uk_url) && (
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      Buy This Book
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedBook.amazon_url && (
                        <a
                          href={selectedBook.amazon_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#6B0C22] hover:bg-[#8B1530] text-white px-8 py-4 rounded-lg transition flex items-center gap-2 font-bold text-lg shadow-lg hover:shadow-xl"
                        >
                          <ExternalLink className="w-5 h-5" />
                          Amazon.com
                        </a>
                      )}
                      {selectedBook.amazon_uk_url && (
                        <a
                          href={selectedBook.amazon_uk_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#6B0C22] hover:bg-[#8B1530] text-white px-8 py-4 rounded-lg transition flex items-center gap-2 font-bold text-lg shadow-lg hover:shadow-xl"
                        >
                          <ExternalLink className="w-5 h-5" />
                          Amazon.co.uk
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Video Trailer */}
                {selectedBook.video_trailer_url && (
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      Video Trailer
                    </h3>
                    <a
                      href={selectedBook.video_trailer_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg transition font-bold text-lg shadow-lg hover:shadow-xl"
                    >
                      <Play className="w-5 h-5" />
                      Watch Trailer
                    </a>
                  </div>
                )}

                {/* Website Links */}
                {(selectedBook.website_url || selectedBook.blog_url) && (
                  <div className="space-y-3 pt-6 border-t border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">
                      Author Links
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {selectedBook.website_url && (
                        <a
                          href={selectedBook.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#6B0C22] hover:text-[#8B1530] font-semibold flex items-center gap-2 text-lg"
                        >
                          <ExternalLink className="w-5 h-5" />
                          Author Website
                        </a>
                      )}
                      {selectedBook.blog_url && (
                        <a
                          href={selectedBook.blog_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#6B0C22] hover:text-[#8B1530] font-semibold flex items-center gap-2 text-lg"
                        >
                          <ExternalLink className="w-5 h-5" />
                          Author Blog
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Books List View
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#6B0C22] to-[#4a0818] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Award-Winning Books
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Discover outstanding self-published books recognized by The Africa
              Laureate Awards
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="w-full lg:w-64">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] focus:border-transparent outline-none bg-white"
              >
                <option value="all">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full lg:w-48">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] focus:border-transparent outline-none bg-white"
              >
                <option value="all">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {(selectedGenre !== "all" ||
              selectedYear !== "all" ||
              searchTerm) && (
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors whitespace-nowrap"
              >
                Reset Filters
              </button>
            )}
          </div>

          <div className="mt-4 text-gray-600">
            Showing{" "}
            <span className="font-semibold text-[#6B0C22]">
              {filteredBooks.length}
            </span>{" "}
            of {books.length} books
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredBooks.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No books found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={resetFilters}
              className="bg-[#6B0C22] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8B1530] transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => {
                  setSelectedBook(book);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="cursor-pointer group"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                  <img
                    src={book.cover_image_url}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";
                    }}
                  />
                  {book.is_featured && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                      Featured
                    </div>
                  )}
                  {book.year_won && (
                    <div className="absolute top-2 right-2 bg-[#6B0C22] text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                      {book.year_won}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <p className="font-bold text-sm line-clamp-2 mb-1">
                        {book.title}
                      </p>
                      <p className="text-xs opacity-90">by {book.author}</p>
                      {book.genre && (
                        <p className="text-xs opacity-75 mt-1">{book.genre}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
