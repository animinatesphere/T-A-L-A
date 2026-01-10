// BookDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ExternalLink,
  Play,
  ArrowLeft,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
} from "lucide-react";

const SUPABASE_URL = "https://sunipfnesvzlkcitbhns.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1bmlwZm5lc3Z6bGtjaXRiaG5zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTE2MDA0MCwiZXhwIjoyMDgwNzM2MDQwfQ.h_UMD88A5kTsZfM3JrkU89tMgDfUUrZY1cCEwIuuKtY";

// Helper function to create URL-friendly slug
const createSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const Bookme = () => {
  const { authorName } = useParams(); // Get author name from URL
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorName]);

  const fetchBook = async () => {
    try {
      // Fetch all books and find matching one by slug
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/award_winning_books`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        }
      );
      const data = await response.json();

      // Find book where author name slug matches URL
      const foundBook = data.find((b) => createSlug(b.author) === authorName);

      if (foundBook) {
        setBook(foundBook);
      }
    } catch (error) {
      console.error("Error fetching book:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="w-12 h-12 border-4 border-[#6B0C22] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 mb-4">Book not found</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#6B0C22] text-white px-6 py-2 rounded-lg hover:bg-[#8B1538]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#6B0C22] hover:text-[#8B1538] mb-8 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Books
        </button>

        {/* Book Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Book Cover */}
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={book.cover_image_url}
                  alt={book.title}
                  className="w-full max-w-md rounded-lg shadow-2xl"
                />
                {book.is_featured && (
                  <div className="absolute top-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    Featured
                  </div>
                )}
              </div>
            </div>

            {/* Book Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-[#6B0C22] mb-3">
                  {book.title}
                </h1>
                <p className="text-2xl text-gray-600 italic mb-4">
                  by {book.author}
                </p>
                {book.genre && (
                  <p className="text-base text-gray-500">Genre: {book.genre}</p>
                )}
                {book.year_won && (
                  <div className="inline-block bg-yellow-100 text-yellow-800 px-5 py-2 rounded-full text-sm font-bold mt-4">
                    🏆 Winner {book.year_won}
                  </div>
                )}
              </div>

              {/* Synopsis */}
              {book.synopsis && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-3">
                    Synopsis
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {book.synopsis}
                  </p>
                </div>
              )}

              {!book.synopsis && book.description && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-3">
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {book.description}
                  </p>
                </div>
              )}

              {/* Website Links */}
              {(book.website_url || book.blog_url) && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 text-lg">
                    Website(s)
                  </h4>
                  <div className="flex gap-3 flex-wrap">
                    {book.blog_url && (
                      <a
                        href={book.blog_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#6B0C22] hover:underline flex items-center gap-2 font-medium"
                      >
                        <ExternalLink className="w-5 h-5" />
                        Visit Blog
                      </a>
                    )}
                    {book.website_url && (
                      <a
                        href={book.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#6B0C22] hover:underline flex items-center gap-2 font-medium"
                      >
                        <ExternalLink className="w-5 h-5" />
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Buy Links */}
              {(book.amazon_url || book.amazon_uk_url) && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 text-lg">
                    Purchase This Book
                  </h4>
                  <div className="flex gap-3 flex-wrap">
                    {book.amazon_url && (
                      <a
                        href={book.amazon_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#6B0C22] hover:bg-[#8B1538] text-white px-6 py-3 rounded-lg transition flex items-center gap-2 font-semibold"
                      >
                        <ExternalLink className="w-5 h-5" />
                        Buy on Amazon.com
                      </a>
                    )}
                    {book.amazon_uk_url && (
                      <a
                        href={book.amazon_uk_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#6B0C22] hover:bg-[#8B1538] text-white px-6 py-3 rounded-lg transition flex items-center gap-2 font-semibold"
                      >
                        <ExternalLink className="w-5 h-5" />
                        Buy on Amazon.co.uk
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Video Trailer */}
              {book.video_trailer_url && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 text-lg">
                    Video Trailer
                  </h4>
                  <button
                    onClick={() =>
                      window.open(book.video_trailer_url, "_blank")
                    }
                    className="bg-[#6B0C22] hover:bg-[#8B1538] text-white px-6 py-3 rounded-lg transition flex items-center gap-2 font-semibold"
                  >
                    <Play className="w-5 h-5" />
                    WATCH TRAILER
                  </button>
                </div>
              )}

              {/* Social Media Links */}
              {(book.facebook_url ||
                book.twitter_url ||
                book.instagram_url ||
                book.whatsapp_url) && (
                <div className="space-y-3 pt-6 border-t">
                  <h4 className="font-semibold text-gray-700 text-lg">
                    Connect with the Author
                  </h4>
                  <div className="flex gap-3">
                    {book.facebook_url && (
                      <a
                        href={book.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition"
                      >
                        <Facebook className="w-5 h-5" />
                      </a>
                    )}
                    {book.twitter_url && (
                      <a
                        href={book.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-lg transition"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {book.instagram_url && (
                      <a
                        href={book.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-lg transition"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                    {book.whatsapp_url && (
                      <a
                        href={book.whatsapp_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition"
                      >
                        <MessageCircle className="w-5 h-5" />
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
};

export default Bookme;
