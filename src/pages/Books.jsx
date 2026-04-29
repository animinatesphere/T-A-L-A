import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  BookOpen,
  ExternalLink,
  Play,
  Search,
  ArrowLeft,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";
const BASE_URL = "http://localhost:5000";

export default function Books() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const location = useLocation();

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [genres, setGenres] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Generate slugs
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // View author function
  const viewAuthor = (book) => {
    const authorSlug = book.author_slug || generateSlug(book.author);

    setSelectedAuthor({
      name: book.author,
      slug: authorSlug,
      bio: book.author_bio || book.about_aurthor,
      image: book.author_image_url,
      facebook: book.facebook_url,
      instagram: book.instagram_url,
      twitter: book.twitter_url,
      threads: book.threads_url,
      website: book.website_url,
      blog: book.blog_url,
      books: books.filter((b) => b.author === book.author),
    });

    navigate(`/author/${authorSlug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books, selectedGenre, selectedYear, searchTerm]);

  // Handle URL-based routing
  useEffect(() => {
    if (books.length === 0) return;

    const path = location.pathname;

    // Check if we're on an author page
    if (path.startsWith("/author/")) {
      const authorSlug = path.split("/author/")[1].split("?")[0];

      const authorBook = books.find((book) => {
        const bookAuthorSlug = book.author_slug || generateSlug(book.author);
        return bookAuthorSlug === authorSlug;
      });

      if (authorBook) {
        const finalAuthorSlug =
          authorBook.author_slug || generateSlug(authorBook.author);

        setSelectedAuthor({
          name: authorBook.author,
          slug: finalAuthorSlug,
          bio: authorBook.author_bio || authorBook.about_aurthor,
          image: authorBook.author_image_url,
          facebook: authorBook.facebook_url,
          instagram: authorBook.instagram_url,
          twitter: authorBook.twitter_url,
          threads: authorBook.threads_url,
          website: authorBook.website_url,
          blog: authorBook.blog_url,
          books: books.filter((b) => b.author === authorBook.author),
        });
        setSelectedBook(null);
      }
    }
    // Check if we're on a book page via /books/:slug
    else if (slug && path.startsWith("/books/")) {
      const book = books.find((b) => generateSlug(b.title) === slug);

      if (book) {
        setSelectedBook(book);
        setSelectedAuthor(null);
      }
    } else {
      // We're on the main books page
      setSelectedBook(null);
      setSelectedAuthor(null);
    }
  }, [books, slug, location.pathname]);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/award-books`);
      const result = await response.json();
      const data = result.data;
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

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${BASE_URL}${url}`;
  };

  const filterBooks = () => {
    let filtered = [...books];

    if (selectedGenre !== "all") {
      filtered = filtered.filter((book) => book.genre === selectedGenre);
    }

    if (selectedYear !== "all") {
      filtered = filtered.filter(
        (book) => book.year_won === parseInt(selectedYear),
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredBooks(filtered);
    setCurrentPage(1);
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
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        {/* Back Button Header */}
        {/* <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => navigate("/books")}
              className="flex items-center gap-2 text-[#6B0C22] hover:text-[#8B1530] font-semibold transition-all hover:gap-3"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Books
            </button>
          </div>
        </div> */}

        {/* Hero Section with Cover */}
        <div className="bg-linear-to-br from-[#6B0C22] to-[#4a0818] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Book Cover */}
              <div className="flex justify-center md:justify-end">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-linear-to-r from-yellow-400 to-yellow-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                  <img
                    src={getImageUrl(selectedBook.cover_image_url)}
                    alt={selectedBook.title}
                    className="relative w-full max-w-sm rounded-xl shadow-2xl transform group-hover:scale-105 transition duration-500"
                  />
                  {selectedBook.is_featured && (
                    <div className="absolute top-4 -right-4 bg-yellow-400 text-gray-900 px-6 py-3 rounded-full text-sm font-bold shadow-xl rotate-12 animate-pulse">
                      ⭐ Featured
                    </div>
                  )}
                </div>
              </div>

              {/* Book Info */}
              <div className="space-y-6">
                <div>
                  {selectedBook.year_won && (
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                      🏆 Winner {selectedBook.year_won}
                    </span>
                  )}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                    {selectedBook.title}
                  </h1>
                  <p className="text-2xl md:text-3xl text-gray-200 italic mb-6">
                    by{" "}
                    <button
                      onClick={() => viewAuthor(selectedBook)}
                      className="hover:text-yellow-300 underline decoration-2 underline-offset-4 transition-colors cursor-pointer"
                    >
                      {selectedBook.author}
                    </button>
                  </p>
                  {selectedBook.genre && (
                    <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-full text-lg font-semibold">
                      {selectedBook.genre}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Synopsis */}
              {(selectedBook.synopsis || selectedBook.description) && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-1 h-8 bg-[#6B0C22] rounded-full"></div>
                    {selectedBook.synopsis ? "Synopsis" : "About This Book"}
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {selectedBook.synopsis || selectedBook.description}
                  </p>
                </div>
              )}

              {/* About the Author */}
              {selectedBook.about_aurthor && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-1 h-8 bg-[#6B0C22] rounded-full"></div>
                    About the Author
                  </h2>
                  <div className="flex items-start gap-6">
                    {selectedBook.author_image_url && (
                      <img
                        src={getImageUrl(selectedBook.author_image_url)}
                        alt={selectedBook.author}
                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 shadow-lg shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {selectedBook.author}
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-lg mb-6">
                        {selectedBook.about_aurthor}
                      </p>

                      {/* Social Links */}
                      {(selectedBook.facebook_url ||
                        selectedBook.instagram_url ||
                        selectedBook.twitter_url ||
                        selectedBook.threads_url) && (
                        <div>
                          <p className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                            Connect with the Author
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {selectedBook.facebook_url && (
                              <a
                                href={selectedBook.facebook_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-all hover:scale-105 shadow-md hover:shadow-lg"
                              >
                                <Facebook className="w-5 h-5" />
                                <span className="font-semibold">Facebook</span>
                              </a>
                            )}
                            {selectedBook.instagram_url && (
                              <a
                                href={selectedBook.instagram_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-5 py-2.5 rounded-lg transition-all hover:scale-105 shadow-md hover:shadow-lg"
                              >
                                <Instagram className="w-5 h-5" />
                                <span className="font-semibold">Instagram</span>
                              </a>
                            )}
                            {selectedBook.twitter_url && (
                              <a
                                href={selectedBook.twitter_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg transition-all hover:scale-105 shadow-md hover:shadow-lg"
                              >
                                <Twitter className="w-5 h-5" />
                                <span className="font-semibold">Twitter</span>
                              </a>
                            )}
                            {selectedBook.threads_url && (
                              <a
                                href={selectedBook.threads_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg transition-all hover:scale-105 shadow-md hover:shadow-lg"
                              >
                                <svg
                                  className="w-5 h-5"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M12.186 3.995c-.43.011-.86.055-1.285.131-2.266.403-4.205 1.894-5.13 3.944-.437.968-.628 1.985-.628 3.315v.936c0 1.33.191 2.347.628 3.315.925 2.05 2.864 3.541 5.13 3.944 1.394.248 2.817.15 4.125-.286 1.555-.518 2.817-1.494 3.633-2.807.394-.634.655-1.338.783-2.107.064-.385-.23-.739-.619-.739h-.123c-.306 0-.574.206-.653.5-.232.867-.679 1.613-1.313 2.186-.875.79-2.018 1.238-3.318 1.3-1.155.055-2.25-.183-3.156-.687-1.395-.776-2.363-2.14-2.657-3.746-.082-.448-.123-.913-.123-1.426v-.936c0-.513.041-.978.123-1.426.294-1.606 1.262-2.97 2.657-3.746.906-.504 2.001-.742 3.156-.687 1.3.062 2.443.51 3.318 1.3.634.573 1.081 1.319 1.313 2.186.079.294.347.5.653.5h.123c.389 0 .683-.354.619-.739-.128-.769-.389-1.473-.783-2.107-.816-1.313-2.078-2.289-3.633-2.807-.91-.303-1.872-.43-2.841-.413z" />
                                </svg>
                                <span className="font-semibold">Threads</span>
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Purchase Card */}
              {(selectedBook.amazon_url || selectedBook.amazon_uk_url) && (
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Get This Book
                  </h3>
                  <div className="space-y-3">
                    {selectedBook.amazon_url && (
                      <a
                        href={selectedBook.amazon_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#6B0C22] hover:bg-[#8B1530] text-white px-6 py-4 rounded-xl transition flex items-center justify-center gap-3 font-bold text-lg shadow-lg hover:shadow-xl group"
                      >
                        <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Buy on Amazon
                      </a>
                    )}
                    {selectedBook.amazon_uk_url && (
                      <a
                        href={selectedBook.amazon_uk_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#6B0C22] hover:bg-[#8B1530] text-white px-6 py-4 rounded-xl transition flex items-center justify-center gap-3 font-bold text-lg shadow-lg hover:shadow-xl group"
                      >
                        <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Buy on Amazon UK
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Video Trailer */}
              {selectedBook.video_trailer_url && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Watch Trailer
                  </h3>
                  <a
                    href={selectedBook.video_trailer_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-xl transition font-bold text-lg shadow-lg hover:shadow-xl group"
                  >
                    <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    Play Video
                  </a>
                </div>
              )}

              {/* Additional Links */}
              {(selectedBook.website_url || selectedBook.blog_url) && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    More Resources
                  </h3>
                  <div className="space-y-3">
                    {selectedBook.website_url && (
                      <a
                        href={selectedBook.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-[#6B0C22] hover:text-[#8B1530] font-semibold text-lg group"
                      >
                        <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Author Website
                      </a>
                    )}
                    {selectedBook.blog_url && (
                      <a
                        href={selectedBook.blog_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-[#6B0C22] hover:text-[#8B1530] font-semibold text-lg group"
                      >
                        <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform" />
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
    );
  }

  // Author Detail Page View
  if (selectedAuthor) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        {/* Back Button Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => navigate("/books")}
              className="flex items-center gap-2 text-[#6B0C22] hover:text-[#8B1530] font-semibold transition-all hover:gap-3"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Books
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-linear-to-br from-[#6B0C22] to-[#4a0818] text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Author Image */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-yellow-400 to-yellow-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                {selectedAuthor.image ? (
                  <img
                    src={getImageUrl(selectedAuthor.image)}
                    alt={selectedAuthor.name}
                    className="relative w-64 h-64 rounded-full object-cover border-8 border-white/20 shadow-2xl"
                  />
                ) : (
                  <div className="relative w-64 h-64 rounded-full bg-white/10 border-8 border-white/20 flex items-center justify-center shadow-2xl">
                    <span className="text-8xl font-bold text-white/50">
                      {selectedAuthor.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Author Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  {selectedAuthor.name}
                </h1>
                <p className="text-xl text-gray-200 mb-6">
                  Award-Winning Author
                </p>

                {/* Social Links */}
                {(selectedAuthor.facebook ||
                  selectedAuthor.instagram ||
                  selectedAuthor.twitter ||
                  selectedAuthor.threads) && (
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    {selectedAuthor.facebook && (
                      <a
                        href={selectedAuthor.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-5 py-3 rounded-lg transition-all hover:scale-105 shadow-lg"
                      >
                        <Facebook className="w-5 h-5" />
                        <span className="font-semibold">Facebook</span>
                      </a>
                    )}
                    {selectedAuthor.instagram && (
                      <a
                        href={selectedAuthor.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-5 py-3 rounded-lg transition-all hover:scale-105 shadow-lg"
                      >
                        <Instagram className="w-5 h-5" />
                        <span className="font-semibold">Instagram</span>
                      </a>
                    )}
                    {selectedAuthor.twitter && (
                      <a
                        href={selectedAuthor.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-5 py-3 rounded-lg transition-all hover:scale-105 shadow-lg"
                      >
                        <Twitter className="w-5 h-5" />
                        <span className="font-semibold">Twitter</span>
                      </a>
                    )}
                    {selectedAuthor.threads && (
                      <a
                        href={selectedAuthor.threads}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-5 py-3 rounded-lg transition-all hover:scale-105 shadow-lg"
                      >
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12.186 3.995c-.43.011-.86.055-1.285.131-2.266.403-4.205 1.894-5.13 3.944-.437.968-.628 1.985-.628 3.315v.936c0 1.33.191 2.347.628 3.315.925 2.05 2.864 3.541 5.13 3.944 1.394.248 2.817.15 4.125-.286 1.555-.518 2.817-1.494 3.633-2.807.394-.634.655-1.338.783-2.107.064-.385-.23-.739-.619-.739h-.123c-.306 0-.574.206-.653.5-.232.867-.679 1.613-1.313 2.186-.875.79-2.018 1.238-3.318 1.3-1.155.055-2.25-.183-3.156-.687-1.395-.776-2.363-2.14-2.657-3.746-.082-.448-.123-.913-.123-1.426v-.936c0-.513.041-.978.123-1.426.294-1.606 1.262-2.97 2.657-3.746.906-.504 2.001-.742 3.156-.687 1.3.062 2.443.51 3.318 1.3.634.573 1.081 1.319 1.313 2.186.079.294.347.5.653.5h.123c.389 0 .683-.354.619-.739-.128-.769-.389-1.473-.783-2.107-.816-1.313-2.078-2.289-3.633-2.807-.91-.303-1.872-.43-2.841-.413z" />
                        </svg>
                        <span className="font-semibold">Threads</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Biography */}
            <div className="lg:col-span-2 space-y-8">
              {/* Biography Section */}
              {selectedAuthor.bio && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-1 h-8 bg-[#6B0C22] rounded-full"></div>
                    About {selectedAuthor.name}
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                      {selectedAuthor.bio}
                    </p>
                  </div>
                </div>
              )}

              {/* Books by Author */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-1 h-8 bg-[#6B0C22] rounded-full"></div>
                  Books by {selectedAuthor.name}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {selectedAuthor.books.map((book) => (
                    <div
                      key={book.id}
                      onClick={() => {
                        const bookSlug = generateSlug(book.title);
                        navigate(`/books/${bookSlug}`);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="cursor-pointer group"
                    >
                      <div className="relative aspect-2/3 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                        <img
                          src={getImageUrl(book.cover_image_url)}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {book.year_won && (
                          <div className="absolute top-2 right-2 bg-[#6B0C22] text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                            {book.year_won}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                            <p className="font-bold text-sm line-clamp-2">
                              {book.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Total Books</span>
                    <span className="text-2xl font-bold text-[#6B0C22]">
                      {selectedAuthor.books.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Awards Won</span>
                    <span className="text-2xl font-bold text-[#6B0C22]">
                      {selectedAuthor.books.filter((b) => b.year_won).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Featured Books</span>
                    <span className="text-2xl font-bold text-[#6B0C22]">
                      {selectedAuthor.books.filter((b) => b.is_featured).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Genres */}
              {selectedAuthor.books.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      ...new Set(
                        selectedAuthor.books
                          .map((b) => b.genre)
                          .filter(Boolean),
                      ),
                    ].map((genre, idx) => (
                      <span
                        key={idx}
                        className="bg-[#6B0C22]/10 text-[#6B0C22] px-4 py-2 rounded-full text-sm font-semibold"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
      <div className="bg-linear-to-br from-[#6B0C22] to-[#4a0818] text-white py-16 md:py-24">
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
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mb-12">
              {filteredBooks
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage,
                )
                .map((book) => (
                  <div
                    key={book.id}
                    onClick={() => {
                      const bookSlug = generateSlug(book.title);
                      navigate(`/books/${bookSlug}`);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="cursor-pointer group"
                  >
                    <div className="relative aspect-2/3 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                      <img
                        src={book.cover_image_url}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";
                        }}
                      />
                      {book.is_featured && (
                        <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2.5 py-1 rounded-full text-[10px] font-black shadow-lg">
                          FEATURED
                        </div>
                      )}
                      {book.year_won && (
                        <div className="absolute top-3 right-3 bg-[#6B0C22] text-white px-2.5 py-1 rounded-full text-[10px] font-black shadow-lg">
                          {book.year_won}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-gray-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          <p className="font-bold text-sm line-clamp-2 mb-1">
                            {book.title}
                          </p>
                          <p className="text-[10px] opacity-70 uppercase tracking-wider">
                            by {book.author}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {Math.ceil(filteredBooks.length / itemsPerPage) > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#6B0C22] hover:text-[#6B0C22] disabled:opacity-20 transition-all"
                >
                  ←
                </button>
                {Array.from({
                  length: Math.ceil(filteredBooks.length / itemsPerPage),
                }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => {
                      setCurrentPage(i + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
                      currentPage === i + 1
                        ? "bg-[#6B0C22] text-white shadow-md"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-[#6B0C22] hover:text-[#6B0C22]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage(
                      Math.min(
                        Math.ceil(filteredBooks.length / itemsPerPage),
                        currentPage + 1,
                      ),
                    )
                  }
                  disabled={
                    currentPage ===
                    Math.ceil(filteredBooks.length / itemsPerPage)
                  }
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#6B0C22] hover:text-[#6B0C22] disabled:opacity-20 transition-all"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
