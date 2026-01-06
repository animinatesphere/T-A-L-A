import React, { useState, useEffect } from "react";
import { BookOpen, ExternalLink, Play, X, Filter, Search } from "lucide-react";

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

      // Extract unique genres and years
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

    // Filter by genre
    if (selectedGenre !== "all") {
      filtered = filtered.filter((book) => book.genre === selectedGenre);
    }

    // Filter by year
    if (selectedYear !== "all") {
      filtered = filtered.filter(
        (book) => book.year_won === parseInt(selectedYear)
      );
    }

    // Filter by search term
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
            {/* Search */}
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

            {/* Genre Filter */}
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

            {/* Year Filter */}
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

            {/* Reset Button */}
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

          {/* Results Count */}
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
                onClick={() => setSelectedBook(book)}
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

      {/* Book Detail Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-5xl w-full my-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedBook(null)}
              className="sticky top-4 float-right bg-white text-gray-600 hover:text-gray-900 p-2 rounded-full shadow-lg z-10 mr-4"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* Book Cover */}
              <div className="flex justify-center">
                <img
                  src={selectedBook.cover_image_url}
                  alt={selectedBook.title}
                  className="w-full max-w-sm rounded-lg shadow-2xl"
                />
              </div>

              {/* Book Details */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-[#6B0C22] mb-2">
                    {selectedBook.title}
                  </h2>
                  <p className="text-xl text-gray-600 italic mb-2">
                    by {selectedBook.author}
                  </p>
                  {selectedBook.genre && (
                    <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {selectedBook.genre}
                    </span>
                  )}
                  {selectedBook.year_won && (
                    <div className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-bold mt-3 ml-2">
                      Winner {selectedBook.year_won}
                    </div>
                  )}
                </div>

                {/* Synopsis/Description */}
                {(selectedBook.synopsis || selectedBook.description) && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      {selectedBook.synopsis ? "Synopsis" : "Description"}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {selectedBook.synopsis || selectedBook.description}
                    </p>
                  </div>
                )}

                {/* Buy Links */}
                {(selectedBook.amazon_url || selectedBook.amazon_uk_url) && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700">Buy Now</h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedBook.amazon_url && (
                        <a
                          href={selectedBook.amazon_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#6B0C22] hover:bg-[#8B1530] text-white px-6 py-3 rounded-lg transition flex items-center gap-2 font-semibold"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Amazon.com
                        </a>
                      )}
                      {selectedBook.amazon_uk_url && (
                        <a
                          href={selectedBook.amazon_uk_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#6B0C22] hover:bg-[#8B1530] text-white px-6 py-3 rounded-lg transition flex items-center gap-2 font-semibold"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Amazon.co.uk
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Website Links */}
                {(selectedBook.website_url || selectedBook.blog_url) && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700">
                      Author Links
                    </h4>
                    <div className="flex gap-4">
                      {selectedBook.website_url && (
                        <a
                          href={selectedBook.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#6B0C22] hover:underline flex items-center gap-1 font-medium"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Website
                        </a>
                      )}
                      {selectedBook.blog_url && (
                        <a
                          href={selectedBook.blog_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#6B0C22] hover:underline flex items-center gap-1 font-medium"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Blog
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Video Trailer */}
                {selectedBook.video_trailer_url && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">
                      Video Trailer
                    </h4>
                    <a
                      href={selectedBook.video_trailer_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#6B0C22] hover:bg-[#8B1530] text-white px-6 py-3 rounded-lg transition font-semibold"
                    >
                      <Play className="w-5 h-5" />
                      Watch Trailer
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
