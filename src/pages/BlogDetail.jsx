import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Clock,
  Calendar,
  Tag,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";
const BASE_URL = "http://localhost:5000";

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchBlog = async () => {
    try {
      // Fetch main blog post
      const response = await fetch(`${API_URL}/blogs/${slug}`);
      const result = await response.json();

      if (result.success && result.data) {
        setBlog(result.data);

        // Fetch related posts
        fetchRelatedPosts(result.data.category, result.data._id);
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${BASE_URL}${url}`;
  };

  const fetchRelatedPosts = async (category, currentId) => {
    try {
      const response = await fetch(`${API_URL}/blogs`);
      const result = await response.json();
      if (result.success) {
        const filtered = result.data
          .filter((p) => p.category === category && p._id !== currentId)
          .slice(0, 3);
        setRelatedPosts(filtered);
      }
    } catch (error) {
      console.error("Error fetching related posts:", error);
    }
  };

  const formatContent = (content) => {
    if (!content) return "";

    // Basic markdown to HTML conversion
    let formatted = content
      // Bold
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      // Links
      .replace(
        /\[(.+?)\]\((.+?)\)/g,
        '<a href="$2" class="text-[#6B0C22] hover:underline" target="_blank" rel="noopener">$1</a>'
      )
      // Headings
      .replace(
        /^### (.+)$/gm,
        '<h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h3>'
      )
      .replace(
        /^## (.+)$/gm,
        '<h2 class="text-3xl font-bold text-gray-900 mt-10 mb-4">$1</h2>'
      )
      .replace(
        /^# (.+)$/gm,
        '<h1 class="text-4xl font-bold text-gray-900 mt-12 mb-6">$1</h1>'
      )
      // Bullet points
      .replace(/^- (.+)$/gm, '<li class="ml-6 mb-2">$1</li>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4">')
      // Line breaks
      .replace(/\n/g, "<br />");

    // Wrap in paragraphs if not already wrapped
    if (!formatted.startsWith("<")) {
      formatted = `<p class="mb-4">${formatted}</p>`;
    }

    return formatted;
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = blog?.title || "";

  const shareOnSocial = (platform) => {
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(shareTitle)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`,
    };

    window.open(urls[platform], "_blank", "width=600,height=400");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#6B0C22] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Post Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <Link
            to="/blog"
            className="bg-[#6B0C22] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8B1530] transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[#6B0C22] hover:text-[#8B1530] font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blog
          </Link>
        </div>
      </div>

      <div className="aspect-[21/9] max-h-[500px] bg-gray-200 overflow-hidden">
        <img
          src={getImageUrl(blog.featured_image_url || blog.featured_image)}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <article>
          {/* Category */}
          {blog.category && (
            <span className="inline-block bg-[#6B0C22] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              {blog.category}
            </span>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-[#6B0C22] rounded-full flex items-center justify-center text-white font-bold text-lg">
                {blog.author_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {blog.author_name || blog.author}
                </p>
                <p className="text-sm">Author</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-5 h-5" />
              <span>
                {new Date(blog.published_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-5 h-5" />
              <span>{blog.read_time_minutes} min read</span>
            </div>
          </div>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: formatContent(blog.content) }}
            style={{
              lineHeight: "1.8",
              fontSize: "1.125rem",
              color: "#374151",
            }}
          />

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {blog.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm flex items-center gap-2 hover:bg-gray-200 transition-colors"
                >
                  <Tag className="w-4 h-4" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Share */}
          <div className="border-t border-b py-6 mb-12">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Share this post
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() => shareOnSocial("facebook")}
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button
                  onClick={() => shareOnSocial("twitter")}
                  className="w-10 h-10 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center transition-colors"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button
                  onClick={() => shareOnSocial("linkedin")}
                  className="w-10 h-10 bg-blue-700 hover:bg-blue-800 text-white rounded-full flex items-center justify-center transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Related Posts
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                  >
                    <div className="aspect-video bg-gray-200 overflow-hidden">
                      <img
                        src={getImageUrl(post.featured_image_url || post.featured_image)}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-gray-900 group-hover:text-[#6B0C22] transition-colors line-clamp-2 mb-2">
                        {post.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};
export default BlogDetail;
