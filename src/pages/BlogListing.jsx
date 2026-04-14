import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Clock,
  Calendar,
  Tag,
  ArrowRight,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom"; // Make sure to install react-router-dom

const SUPABASE_URL = "https://pnfebkenxtqfzfbewyiy.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuZmVia2VueHRxZnpmYmV3eWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MDczMjUsImV4cCI6MjA4MTk4MzMyNX0.xGaevgclohcy1Y8w9J83oZ0cQB2rN5WWEJwrDIDwk70";
const BlogListing = () => {
  const [blogs, setBlogs] = useState([]);
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/blog_posts?is_published=eq.true&order=published_date.desc`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      setBlogs(data);
      const featured = data.find((blog) => blog.is_featured);
      setFeaturedBlog(featured || data[0]);
    } catch (error) {
      console.error("Error fetching blogs:", error.message);
    } finally {
      setLoading(false);
    }
  };
  const categories = [
    "all",
    ...new Set(blogs.map((blog) => blog.category).filter(Boolean)),
  ];

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || blog.category === selectedCategory;
    return matchesSearch && matchesCategory && blog.id !== featuredBlog?.id;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#6B0C22] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#6B0C22] to-[#4a0818] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
          <p className="text-xl text-gray-200">
            Stories, insights, and updates from the world of literature
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Featured Post */}
        {featuredBlog && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-[#6B0C22] rounded-full animate-pulse"></div>
              <span className="text-[#6B0C22] font-semibold text-sm uppercase tracking-wide">
                Featured Post
              </span>
            </div>

            <Link to={`/blog/${featuredBlog.slug}`} className="group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="aspect-video md:aspect-auto bg-gray-200 overflow-hidden">
                    <img
                      src={featuredBlog.featured_image_url}
                      alt={featuredBlog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    {featuredBlog.category && (
                      <span className="text-[#6B0C22] font-semibold text-sm uppercase tracking-wide mb-3">
                        {featuredBlog.category}
                      </span>
                    )}
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-[#6B0C22] transition-colors">
                      {featuredBlog.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {featuredBlog.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(
                          featuredBlog.published_date,
                        ).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredBlog.read_time_minutes} min read
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#6B0C22] font-semibold group-hover:gap-4 transition-all">
                      Read More
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] focus:border-transparent outline-none"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-[#6B0C22] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category === "all" ? "All Posts" : category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No blog posts found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blog/${blog.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-video bg-gray-200 overflow-hidden">
                  <img
                    src={blog.featured_image_url}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  {blog.category && (
                    <span className="text-[#6B0C22] font-semibold text-xs uppercase tracking-wide">
                      {blog.category}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3 group-hover:text-[#6B0C22] transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {blog.read_time_minutes} min
                    </span>
                    <span>
                      {new Date(blog.published_date).toLocaleDateString()}
                    </span>
                  </div>
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {blog.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs flex items-center gap-1"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListing;
