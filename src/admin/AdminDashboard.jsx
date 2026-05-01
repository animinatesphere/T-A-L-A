import React, { useState, useEffect } from "react";
import {
  Bell,
  BookOpen,
  Podcast,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MessageSquare,
  Edit,
  Trash2,
  X,
  Upload,
  Plus,
  Filter,
  Award,
  File, // ADD THIS LINE
} from "lucide-react";

const API_URL = "/api";
const BASE_URL = ""; // Relative to root

const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  // If it starts with /uploads, it's a server path
  return path;
};
const BASE_URL = "";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("submissions");
  const [submissions, setSubmissions] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");

  // Podcast modal states
  const [isPodcastModalOpen, setIsPodcastModalOpen] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState(null);
  const [podcastImageFile, setPodcastImageFile] = useState(null);
  const [podcastImagePreview, setPodcastImagePreview] = useState("");
  const [podcastLoading, setPodcastLoading] = useState(false);

  const [awardBooks, setAwardBooks] = useState([]);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [bookImageFile, setBookImageFile] = useState(null);
  const [bookImagePreview, setBookImagePreview] = useState("");
  const [bookLoading, setBookLoading] = useState(false);
  const [podcastFormData, setPodcastFormData] = useState({
    title: "",
    guest_name: "",
    description: "",
    episode_number: "",
    duration: "",
    spotify_url: "",
    apple_podcast_url: "",
    youtube_url: "",
    cover_image_url: "",
  });
  const [bookFormData, setBookFormData] = useState({
    title: "",
    subtitle: "",
    author: "",
    pen_name: "",
    cover_image_url: "",
    author_image_url: "",
    description: "",
    synopsis: "",
    genre: "",
    book_series: "",
    date_of_publication: "",
    year_won: new Date().getFullYear(),
    author_slug: "",
    author_bio: "",
    website_url: "",
    blog_url: "",
    amazon_url: "",
    amazon_uk_url: "",
    video_trailer_url: "",
    facebook_url: "",
    instagram_url: "",
    twitter_url: "",
    threads_url: "",
    about_book_pdf_url: "",
    ebook_url: "",
    is_featured: false,
    display_order: 0,
  });
  // Blog states
  const [blogs, setBlogs] = useState([]);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogImageFile, setBlogImageFile] = useState(null);
  const [blogImagePreview, setBlogImagePreview] = useState("");
  const [blogLoading, setBlogLoading] = useState(false);

  const [blogFormData, setBlogFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image_url: "",
    author_name: "",
    author_avatar_url: "",
    category: "",
    tags: [],
    is_published: false,
    is_featured: false,
    read_time_minutes: 5,
    published_date: new Date().toISOString().split("T")[0],
  });
  // Judge states
  const [judges, setJudges] = useState([]);
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);
  const [editingJudge, setEditingJudge] = useState(null);
  const [judgeImageFile, setJudgeImageFile] = useState(null);
  const [judgeImagePreview, setJudgeImagePreview] = useState("");
  const [judgeLoading, setJudgeLoading] = useState(false);
  const [judgeFormData, setJudgeFormData] = useState({
    name: "",
    title: "",
    bio: "",
    image_url: "",
    display_order: 0,
    is_active: true,
  });

  const fetchJudges = async () => {
    try {
      const response = await fetch(`${API_URL}/judges`);
      const result = await response.json();
      setJudges(result.data);
    } catch (error) {
      console.error("Error fetching judges:", error);
    }
  };
  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${API_URL}/blogs`);
      const result = await response.json();
      setBlogs(result.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const result = await response.json();
      if (result.success) {
        localStorage.setItem("tala_admin_token", result.token);
        setIsAuthenticated(true);
      } else {
        setLoginError(result.error);
      }
    } catch (error) {
      setLoginError("Login failed. Please try again.");
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("tala_admin_token");
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${BASE_URL}${url}`;
  };
  // Add to existing useEffect
  useEffect(() => {
    const token = localStorage.getItem("tala_admin_token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchSubmissions();
    fetchPodcasts();
    fetchAwardBooks();
    fetchJudges();
    fetchBlogs();

    const interval = setInterval(() => {
      fetchSubmissions();
      fetchAwardBooks();
      fetchJudges();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Add this function after updateSubmissionStatus
  const approveAndAddToAwards = async (submission) => {
    if (
      !window.confirm(
        `Approve "${submission.book_title}" and add to Award-Winning Books?`
      )
    ) {
      return;
    }

    try {
      // 1. Update submission status to approved
      const updateResponse = await fetch(`${API_URL}/submissions/${submission._id}`, {
        method: "PATCH",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submission_status: "approved",
        }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update submission status");
      }

      // 2. Add to award_winning_books table with ALL fields from submission
      const awardBookData = {
        // Basic book info
        title: submission.book_title,
        subtitle: submission.subtitle || "",
        author: submission.author_name,
        pen_name: submission.pen_name || "",

        // Images
        cover_image_url: submission.cover_image_url || "",
        author_image_url: submission.author_image_url || "",

        // Descriptions
        description: submission.book_description || "",
        synopsis: submission.book_description || "",
        author_bio: submission.about_aurthor || "",

        // Book details
        genre: submission.genre || "",
        book_series: submission.book_series || "",
        date_of_publication: submission.date_of_publication || "",
        year_won: new Date().getFullYear(),

        // Author info
        author_slug: generateAuthorSlug(submission.author_name),

        // URLs - Purchase links
        amazon_url: submission.barnes_noble_url || "",
        amazon_uk_url: "",
        website_url: "",
        blog_url: "",
        video_trailer_url: "",

        // Social media URLs
        facebook_url: submission.facebook_url || "",
        instagram_url: submission.instagram_url || "",
        twitter_url: submission.twitter_url || "",
        threads_url: submission.threads_url || "",

        // Files
        about_book_pdf_url: submission.about_book_pdf_url || "",
        ebook_url: submission.ebook_url || "",

        // Display settings
        is_featured: false,
        display_order: 999,
      };

      const awardResponse = await fetch(`${API_URL}/award-books`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(awardBookData),
      });

      if (awardResponse.ok) {
        alert("✅ Submission approved and added to Award-Winning Books!");
        fetchSubmissions();
        fetchAwardBooks();
        setSelectedSubmission(null);
      } else {
        const errorText = await awardResponse.text();
        console.error("Failed to add to award books:", errorText);
        alert(
          "Submission approved but failed to add to awards. Check console for details."
        );
      }
    } catch (error) {
      console.error("Error approving submission:", error);
      alert("Error approving submission. Please try again.");
    }
  };

  // Helper function for author slug
  const generateAuthorSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };
  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const openBlogModal = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setBlogFormData({
        ...blog,
        tags: blog.tags || [],
        published_date: blog.published_date
          ? new Date(blog.published_date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
      setBlogImagePreview(blog.featured_image_url);
    } else {
      setEditingBlog(null);
      setBlogFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        featured_image_url: "",
        author_name: "",
        author_avatar_url: "",
        category: "",
        tags: [],
        is_published: false,
        is_featured: false,
        read_time_minutes: 5,
        published_date: new Date().toISOString().split("T")[0],
      });
      setBlogImagePreview("");
    }
    setBlogImageFile(null);
    setIsBlogModalOpen(true);
  };

  const closeBlogModal = () => {
    setIsBlogModalOpen(false);
    setEditingBlog(null);
    setBlogImageFile(null);
    setBlogImagePreview("");
  };

  const handleBlogImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 100MB)
      if (file.size > MAX_FILE_SIZE) {
        alert("Image size should be less than 100MB");
        return;
      }

      setBlogImageFile(file);
      setBlogImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadBlogImage = async (file) => {
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;

    try {
      // Try using FormData instead
      const formData = new FormData();
      formData.append("", file); // Empty string as key for Supabase

      const response = await fetch(
        `${SUPABASE_URL2}/storage/v1/object/blog-images/${fileName}`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_ANON_KEY2,
            Authorization: `Bearer ${SUPABASE_ANON_KEY2}`,
          },
          body: formData,
        }
      );

      const result = await response.text();
      console.log("Upload response:", response.status, result);

      if (response.ok) {
        return `${SUPABASE_URL2}/storage/v1/object/public/blog-images/${fileName}`;
      } else {
        console.error("Upload failed:", result);
        alert(`Upload failed: ${result}`);
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleBlogSubmit = async () => {
    setBlogLoading(true);

    const formData = new FormData();
    Object.keys(blogFormData).forEach((key) => {
      formData.append(key, blogFormData[key]);
    });

    if (blogImageFile) {
      formData.append("image", blogImageFile);
    }

    try {
      let response;
      if (editingBlog) {
        response = await fetch(`${API_URL}/blogs/${editingBlog._id}`, {
          method: "PATCH",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(blogFormData),
        });
      } else {
        response = await fetch(`${API_URL}/blogs`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: formData,
        });
      }

      if (response.ok) {
        fetchBlogs();
        closeBlogModal();
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Error saving blog post. Please try again.");
    } finally {
      setBlogLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await fetch(`${API_URL}/blogs/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });
        fetchBlogs();
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };
  // Add this new fetch function
  const fetchAwardBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/award-books`);
      const result = await response.json();
      setAwardBooks(result.data);
    } catch (error) {
      console.error("Error fetching award books:", error);
    }
  };
  useEffect(() => {
    fetchSubmissions();
    fetchPodcasts();
    fetchAwardBooks();
    fetchBlogs();
    fetchJudges();

    // Poll for new submissions every 30 seconds
    const interval = setInterval(() => {
      fetchSubmissions();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`${API_URL}/submissions`, {
        headers: getAuthHeaders(),
      });
      const result = await response.json();
      setSubmissions(result.data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPodcasts = async () => {
    try {
      const response = await fetch(`${API_URL}/podcasts`);
      const result = await response.json();
      setPodcasts(result.data);
    } catch (error) {
      console.error("Error fetching podcasts:", error);
    }
  };

  const updateSubmissionStatus = async (id, status, notes = "") => {
    try {
      await fetch(`${API_URL}/submissions/${id}`, {
        method: "PATCH",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submission_status: status,
          admin_notes: notes,
        }),
      });
      fetchSubmissions();
      setSelectedSubmission(null);
    } catch (error) {
      console.error("Error updating submission:", error);
    }
  };
  // Judge management functions
  const openJudgeModal = (judge = null) => {
    if (judge) {
      setEditingJudge(judge);
      setJudgeFormData(judge);
      setJudgeImagePreview(judge.image_url);
    } else {
      setEditingJudge(null);
      setJudgeFormData({
        name: "",
        title: "",
        bio: "",
        image_url: "",
        display_order: 0,
        is_active: true,
      });
      setJudgeImagePreview("");
    }
    setJudgeImageFile(null);
    setIsJudgeModalOpen(true);
  };

  const closeJudgeModal = () => {
    setIsJudgeModalOpen(false);
    setEditingJudge(null);
    setJudgeImageFile(null);
    setJudgeImagePreview("");
  };

  const handleJudgeImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert("Image size should be less than 100MB");
        return;
      }
      setJudgeImageFile(file);
      setJudgeImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadJudgeImage = async (file) => {
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    try {
      const response = await fetch(
        `${SUPABASE_URL}/storage/v1/object/judge-images/${fileName}`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: file,
        }
      );

      if (response.ok) {
        return `${SUPABASE_URL}/storage/v1/object/public/judge-images/${fileName}`;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    return null;
  };
  const handleJudgeSubmit = async () => {
    setJudgeLoading(true);

    const formData = new FormData();
    Object.keys(judgeFormData).forEach((key) => {
      formData.append(key, judgeFormData[key]);
    });

    if (judgeImageFile) {
      formData.append("image", judgeImageFile);
    }

    try {
      let response;
      if (editingJudge) {
        response = await fetch(`${API_URL}/judges/${editingJudge._id}`, {
          method: "PATCH",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(judgeFormData),
        });
      } else {
        response = await fetch(`${API_URL}/judges`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: formData,
        });
      }

      if (response.ok) {
        fetchJudges();
        closeJudgeModal();
      }
    } catch (error) {
      console.error("Error saving judge:", error);
      alert("Error saving judge. Please try again.");
    } finally {
      setJudgeLoading(false);
    }
  };

  const deleteJudge = async (id) => {
    if (window.confirm("Are you sure you want to delete this judge?")) {
      try {
        await fetch(`${API_URL}/judges/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });
        fetchJudges();
      } catch (error) {
        console.error("Error deleting judge:", error);
      }
    }
  };

  const deleteSubmission = async (id) => {
    if (window.confirm("Are you sure you want to delete this submission?")) {
      try {
        await fetch(`${API_URL}/submissions/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });
        fetchSubmissions();
      } catch (error) {
        console.error("Error deleting submission:", error);
      }
    }
  };


  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "under_review":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Podcast management functions
  const openPodcastModal = (podcast = null) => {
    if (podcast) {
      setEditingPodcast(podcast);
      setPodcastFormData(podcast);
      setPodcastImagePreview(podcast.cover_image_url);
    } else {
      setEditingPodcast(null);
      setPodcastFormData({
        title: "",
        guest_name: "",
        description: "",
        episode_number: "",
        duration: "",
        spotify_url: "",
        apple_podcast_url: "",
        youtube_url: "",
        cover_image_url: "",
      });
      setPodcastImagePreview("");
    }
    setPodcastImageFile(null);
    setIsPodcastModalOpen(true);
  };

  const closePodcastModal = () => {
    setIsPodcastModalOpen(false);
    setEditingPodcast(null);
    setPodcastImageFile(null);
    setPodcastImagePreview("");
  };

  const handlePodcastImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert("Image size should be less than 100MB");
        return;
      }
      setPodcastImageFile(file);
      setPodcastImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadPodcastImage = async (file) => {
    const fileName = `${Date.now()}_${file.name}`;
    try {
      const response = await fetch(
        `${SUPABASE_URL}/storage/v1/object/podcast-covers/${fileName}`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: file,
        }
      );

      if (response.ok) {
        return `${SUPABASE_URL}/storage/v1/object/public/podcast-covers/${fileName}`;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    return null;
  };

  const handlePodcastSubmit = async () => {
    setPodcastLoading(true);

    const formData = new FormData();
    Object.keys(podcastFormData).forEach((key) => {
      formData.append(key, podcastFormData[key]);
    });

    if (podcastImageFile) {
      formData.append("cover_image", podcastImageFile);
    }

    try {
      let response;
      if (editingPodcast) {
        response = await fetch(`${API_URL}/podcasts/${editingPodcast._id}`, {
          method: "PATCH",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(podcastFormData),
        });
      } else {
        response = await fetch(`${API_URL}/podcasts`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: formData,
        });
      }

      if (response.ok) {
        fetchPodcasts();
        closePodcastModal();
      }
    } catch (error) {
      console.error("Error saving podcast:", error);
      alert("Error saving podcast. Please try again.");
    } finally {
      setPodcastLoading(false);
    }
  };

  const deletePodcast = async (id) => {
    if (window.confirm("Are you sure you want to delete this podcast episode?")) {
      try {
        await fetch(`${API_URL}/podcasts/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });
        fetchPodcasts();
      } catch (error) {
        console.error("Error deleting podcast:", error);
      }
    }
  };

  const openBookModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setBookFormData(book);
      setBookImagePreview(book.cover_image_url);
    } else {
      setEditingBook(null);
      setBookFormData({
        title: "",
        author: "",
        cover_image_url: "",
        description: "",
        synopsis: "",
        genre: "",
        year_won: new Date().getFullYear(),
        website_url: "",
        blog_url: "",
        amazon_url: "",
        amazon_uk_url: "",
        video_trailer_url: "",
        is_featured: false,
        display_order: 0,
      });
      setBookImagePreview("");
    }
    setBookImageFile(null);
    setIsBookModalOpen(true);
  };

  const closeBookModal = () => {
    setIsBookModalOpen(false);
    setEditingBook(null);
    setBookImageFile(null);
    setBookImagePreview("");
  };

  const handleBookImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert("Image size should be less than 100MB");
        return;
      }
      setBookImageFile(file);
      setBookImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadBookImage = async (file) => {
    const fileName = `${Date.now()}_${file.name}`;
    try {
      const response = await fetch(
        `${SUPABASE_URL}/storage/v1/object/book-covers/${fileName}`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: file,
        }
      );

      if (response.ok) {
        return `${SUPABASE_URL}/storage/v1/object/public/book-covers/${fileName}`;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    return null;
  };

  const handleBookSubmit = async () => {
    setBookLoading(true);

    const formData = new FormData();
    Object.keys(bookFormData).forEach((key) => {
      formData.append(key, bookFormData[key]);
    });

    if (bookImageFile) {
      formData.append("cover_image", bookImageFile);
    }

    try {
      let response;
      if (editingBook) {
        response = await fetch(`${API_URL}/award-books/${editingBook._id}`, {
          method: "PATCH",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookFormData),
        });
      } else {
        response = await fetch(`${API_URL}/award-books`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: formData,
        });
      }

      if (response.ok) {
        fetchAwardBooks();
        closeBookModal();
      }
    } catch (error) {
      console.error("Error saving book:", error);
      alert("Error saving book. Please try again.");
    } finally {
      setBookLoading(false);
    }
  };

  const deleteBook = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await fetch(`${API_URL}/award-books/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });
        fetchAwardBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };



  const filteredSubmissions = submissions.filter((sub) => {
    if (filter === "all") return true;
    return sub.submission_status === filter;
  });

  const pendingCount = submissions.filter(
    (s) => s.submission_status === "pending"
  ).length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-[#6B0C22] rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-600">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
            </div>

            {loginError && <p className="text-red-600 text-sm">{loginError}</p>}

            <button
              type="submit"
              className="w-full bg-[#6B0C22] text-white py-3 rounded-lg font-bold hover:bg-[#8B1530] transition-colors"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#6B0C22] via-[#8B1530] to-[#4a0818] text-white shadow-2xl relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                T.A.L.A. Admin Dashboard
              </h1>
              <p className="text-sm md:text-base text-gray-200">
                Manage submissions, podcasts, books, blogs, and judges
              </p>
            </div>
            <div className="relative">
              <button className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110 relative group">
                <Bell className="w-6 h-6 group-hover:animate-bounce" />
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold animate-pulse shadow-lg">
                    {pendingCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {/* Total Submissions Card */}
          <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl p-6 transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Submissions</p>
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#6B0C22] to-[#8B1530] bg-clip-text text-transparent">
                  {submissions.length}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-[#6B0C22] to-[#8B1530] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Pending Review Card */}
          <div className="group bg-gradient-to-br from-white to-yellow-50 rounded-2xl shadow-lg hover:shadow-2xl p-6 transition-all duration-300 hover:-translate-y-1 border border-yellow-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Pending Review</p>
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  {pendingCount}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Approved Card */}
          <div className="group bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg hover:shadow-2xl p-6 transition-all duration-300 hover:-translate-y-1 border border-green-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Approved</p>
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {
                    submissions.filter(
                      (s) => s.submission_status === "approved"
                    ).length
                  }
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Total Podcasts Card */}
          <div className="group bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg hover:shadow-2xl p-6 transition-all duration-300 hover:-translate-y-1 border border-purple-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Podcasts</p>
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {podcasts.length}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Podcast className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Award-Winning Books Card */}
          <div className="group bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg hover:shadow-2xl p-6 transition-all duration-300 hover:-translate-y-1 border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Award Books</p>
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {awardBooks.length}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Blog Posts Card */}
          <div className="group bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-lg hover:shadow-2xl p-6 transition-all duration-300 hover:-translate-y-1 border border-indigo-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Blog Posts</p>
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {blogs.length}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Edit className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Judges Card */}
          <div className="group bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-lg hover:shadow-2xl p-6 transition-all duration-300 hover:-translate-y-1 border border-orange-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Judges</p>
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {judges.length}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Award className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl mb-6 overflow-hidden">
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex min-w-max md:min-w-0">
              <button
                onClick={() => setActiveTab("submissions")}
                className={`px-4 md:px-6 py-4 font-semibold transition-all duration-300 whitespace-nowrap relative ${
                  activeTab === "submissions"
                    ? "text-white bg-gradient-to-r from-[#6B0C22] to-[#8B1530]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Book Submissions</span>
                  <span className="sm:hidden">Submissions</span>
                  {pendingCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                      {pendingCount}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab("podcasts")}
                className={`px-4 md:px-6 py-4 font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeTab === "podcasts"
                    ? "text-white bg-gradient-to-r from-[#6B0C22] to-[#8B1530]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Podcast className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Manage Podcasts</span>
                  <span className="sm:hidden">Podcasts</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("books")}
                className={`px-4 md:px-6 py-4 font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeTab === "books"
                    ? "text-white bg-gradient-to-r from-[#6B0C22] to-[#8B1530]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Award-Winning Books</span>
                  <span className="sm:hidden">Awards</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("blogs")}
                className={`px-4 md:px-6 py-4 font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeTab === "blogs"
                    ? "text-white bg-gradient-to-r from-[#6B0C22] to-[#8B1530]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Edit className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Blog Posts</span>
                  <span className="sm:hidden">Blogs</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("judges")}
                className={`px-4 md:px-6 py-4 font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeTab === "judges"
                    ? "text-white bg-gradient-to-r from-[#6B0C22] to-[#8B1530]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Judges</span>
                </div>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === "submissions" && (
              <div>
                {/* Filter */}
                <div className="flex items-center gap-4 mb-6">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] focus:border-transparent outline-none"
                  >
                    <option value="all">All Submissions</option>
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-[#6B0C22] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading submissions...</p>
                  </div>
                ) : filteredSubmissions.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No submissions found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredSubmissions.map((submission) => (
                      <div
                        key={submission.id}
                        className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-200"
                      >
                        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-4">
                          <div className="flex-1 w-full lg:w-auto">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#6B0C22] to-[#8B1530] bg-clip-text text-transparent">
                                {submission.book_title}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${getStatusColor(
                                  submission.submission_status
                                )}`}
                              >
                                {submission.submission_status
                                  .replace("_", " ")
                                  .toUpperCase()}
                              </span>
                            </div>
                            <p className="text-gray-700 font-medium mb-2">
                              by {submission.author_name}
                            </p>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p>
                                <span className="font-semibold">Submitted by:</span> {submission.first_name}{" "}
                                {submission.last_name} ({submission.email})
                              </p>
                              <p>
                                <span className="font-semibold">Genre:</span> {submission.genre} | 
                                <span className="font-semibold"> Payment:</span>{" "}
                                {submission.payment_currency}{" "}
                                {submission.payment_amount}
                              </p>
                              <p className="text-xs text-gray-500">
                                Submitted:{" "}
                                {new Date(
                                  submission.created_at
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedSubmission(submission)}
                              className="p-3 bg-gradient-to-r from-[#6B0C22] to-[#8B1530] text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-110"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => deleteSubmission(submission._id)}
                              className="p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-110"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-2 flex-wrap">
                          {submission.submission_status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  updateSubmissionStatus(
                                    submission._id,
                                    "under_review"
                                  )
                                }
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
                              >
                                Mark Under Review
                              </button>
                              <button
                                onClick={() =>
                                  approveAndAddToAwards(submission)
                                }
                                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors"
                              >
                                ✅ Approve & Add to Awards
                              </button>
                              <button
                                onClick={() =>
                                  updateSubmissionStatus(
                                    submission._id,
                                    "rejected"
                                  )
                                }
                                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {submission.submission_status === "approved" && (
                            <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-semibold">
                              ✅ Approved & In Awards
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === "podcasts" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Manage Podcast Episodes
                  </h3>
                  <button
                    onClick={() => openPodcastModal()}
                    className="bg-[#6B0C22] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8B1530] transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add New Episode
                  </button>
                </div>

                {podcasts.length === 0 ? (
                  <div className="text-center py-12">
                    <Podcast className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      No podcast episodes yet. Click "Add New Episode" to get
                      started.
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {podcasts.map((podcast) => (
                      <div
                        key={podcast._id}
                        className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="aspect-video bg-gray-200 relative">
                          {podcast.cover_image_url ? (
                            <img
                              src={podcast.cover_image_url}
                              alt={podcast.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Podcast className="w-16 h-16 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2 bg-[#6B0C22] text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Ep {podcast.episode_number}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-1 line-clamp-1">
                            {podcast.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            with {podcast.guest_name}
                          </p>
                          <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                            {podcast.description}
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openPodcastModal(podcast)}
                              className="flex-1 bg-[#6B0C22] text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#8B1530] transition-colors text-sm"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => deletePodcast(podcast._id)}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === "books" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Manage Award-Winning Books
                  </h3>
                  <button
                    onClick={() => openBookModal()}
                    className="bg-[#6B0C22] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8B1530] transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add New Book
                  </button>
                </div>

                {awardBooks.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      No award-winning books yet. Click "Add New Book" to get
                      started.
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {awardBooks.map((book) => (
                      <div
                        key={book._id}
                        className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="aspect-[3/4] bg-gray-200 relative">
                          {book.cover_image_url ? (
                            <img
                              src={book.cover_image_url}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="w-16 h-16 text-gray-400" />
                            </div>
                          )}
                          {book.is_featured && (
                            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                              Featured
                            </div>
                          )}
                          <div className="absolute top-2 right-2 bg-[#6B0C22] text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {book.year_won}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-1 line-clamp-1">
                            {book.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            by {book.author}
                          </p>
                          <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                            {book.description}
                          </p>

                          {/* Download buttons for files */}
                          {(book.about_book_pdf_url || book.ebook_url) && (
                            <div className="mb-3 space-y-2">
                              {book.about_book_pdf_url && (
                                <a
                                  href={book.about_book_pdf_url}
                                  download
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                                >
                                  <File className="w-4 h-4" />
                                  Download About Book PDF
                                </a>
                              )}
                              {book.ebook_url && (
                                <a
                                  href={book.ebook_url}
                                  download
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                                >
                                  <File className="w-4 h-4" />
                                  Download eBook
                                </a>
                              )}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <button
                              onClick={() => openBookModal(book)}
                              className="flex-1 bg-[#6B0C22] text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#8B1530] transition-colors text-sm"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => deleteBook(book._id)}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === "blogs" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Manage Blog Posts
                  </h3>
                  <button
                    onClick={() => openBlogModal()}
                    className="bg-[#6B0C22] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8B1530] transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Create New Post
                  </button>
                </div>

                {blogs.length === 0 ? (
                  <div className="text-center py-12">
                    <Edit className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      No blog posts yet. Click "Create New Post" to get started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {blogs.map((blog) => (
                      <div
                        key={blog._id}
                        className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="flex gap-4 p-4">
                          {/* Featured Image */}
                          <div className="w-48 h-32 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                            {blog.featured_image_url ? (
                              <img
                                src={blog.featured_image_url}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="w-12 h-12 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-bold text-lg line-clamp-1">
                                    {blog.title}
                                  </h3>
                                  {blog.is_published ? (
                                    <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                                      Published
                                    </span>
                                  ) : (
                                    <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                                      Draft
                                    </span>
                                  )}
                                  {blog.is_featured && (
                                    <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                                      Featured
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                                  {blog.excerpt}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span>By {blog.author_name}</span>
                                  {blog.category && (
                                    <span>• {blog.category}</span>
                                  )}
                                  <span>
                                    • {blog.read_time_minutes} min read
                                  </span>
                                  {blog.published_date && (
                                    <span>
                                      •{" "}
                                      {new Date(
                                        blog.published_date
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openBlogModal(blog)}
                                  className="p-2 bg-[#6B0C22] text-white rounded-lg hover:bg-[#8B1530] transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => deleteBlog(blog._id)}
                                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === "judges" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Manage Judges
                  </h3>
                  <button
                    onClick={() => openJudgeModal()}
                    className="bg-[#6B0C22] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8B1530] transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add New Judge
                  </button>
                </div>

                {judges.length === 0 ? (
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      No judges yet. Click "Add New Judge" to get started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {judges.map((judge) => (
                      <div
                        key={judge._id}
                        className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="flex gap-6 p-6">
                          {/* Judge Image */}
                          <div className="w-32 h-32 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                            {judge.image_url ? (
                              <img
                                src={judge.image_url}
                                alt={judge.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Award className="w-12 h-12 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-bold text-xl">
                                    {judge.name}
                                  </h3>
                                  {!judge.is_active && (
                                    <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                                      Inactive
                                    </span>
                                  )}
                                </div>
                                <p className="text-[#6B0C22] font-medium mb-2">
                                  {judge.title}
                                </p>
                                <p className="text-gray-600 text-sm line-clamp-3">
                                  {judge.bio}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                  Display Order: {judge.display_order}
                                </p>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openJudgeModal(judge)}
                                  className="p-2 bg-[#6B0C22] text-white rounded-lg hover:bg-[#8B1530] transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => deleteJudge(judge._id)}
                                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submission Details Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl my-4 sm:my-8 max-h-[95vh] flex flex-col">
            <div className="sticky top-0 bg-[#6B0C22] text-white p-4 sm:p-6 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-2xl font-bold">Submission Details</h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-3">Uploaded Images</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedSubmission.cover_image_url && (
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Book Cover</p>
                      <img
                        src={getImageUrl(selectedSubmission.cover_image_url)}
                        alt="Book Cover"
                        className="w-full h-48 object-contain rounded-lg border bg-gray-50"
                      />
                    </div>
                  )}
                  {selectedSubmission.author_image_url && (
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Author Image</p>
                      <img
                        src={getImageUrl(selectedSubmission.author_image_url)}
                        alt="Author Image"
                        className="w-full h-48 object-contain rounded-lg border bg-gray-50"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Book Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">
                    Book Title
                  </h4>
                  <p className="text-gray-900">
                    {selectedSubmission.book_title}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Subtitle</h4>
                  <p className="text-gray-900">
                    {selectedSubmission.subtitle || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">
                    Author Name
                  </h4>
                  <p className="text-gray-900">
                    {selectedSubmission.author_name}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Pen Name</h4>
                  <p className="text-gray-900">
                    {selectedSubmission.pen_name || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Genre</h4>
                  <p className="text-gray-900">{selectedSubmission.genre}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">
                    Book Series
                  </h4>
                  <p className="text-gray-900">
                    {selectedSubmission.book_series || "N/A"}
                  </p>
                </div>
              </div>

              {/* Submitter Info */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-lg mb-3">
                  Submitter Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Name</h4>
                    <p className="text-gray-900">
                      {selectedSubmission.first_name}{" "}
                      {selectedSubmission.last_name}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Email</h4>
                    <p className="text-gray-900">{selectedSubmission.email}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">
                      Relationship to Author
                    </h4>
                    <p className="text-gray-900">
                      {selectedSubmission.relationship_to_author}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">
                      Payment
                    </h4>
                    <p className="text-gray-900">
                      {selectedSubmission.payment_currency}{" "}
                      {selectedSubmission.payment_amount}
                    </p>
                  </div>
                </div>
              </div>
              {/* // In the selectedSubmission modal, add this section before the Action Buttons: */}
              {/* Files Section */}
              {(selectedSubmission.about_book_pdf_url ||
                selectedSubmission.ebook_url) && (
                <div className="border-t pt-6">
                  <h3 className="font-bold text-lg mb-3">Submitted Documents</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedSubmission.about_book_pdf_url && (
                      <a
                        href={getImageUrl(selectedSubmission.about_book_pdf_url)}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 font-medium"
                      >
                        <File className="w-5 h-5" />
                        Download PDF
                      </a>
                    )}
                    {selectedSubmission.ebook_url && (
                      <a
                        href={getImageUrl(selectedSubmission.ebook_url)}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200 font-medium"
                      >
                        <File className="w-5 h-5" />
                        Download eBook
                      </a>
                    )}
                  </div>
                </div>
              )}
              {/* Action Buttons in Modal */}
              <div className="flex gap-3 pt-6 border-t">
                <button
                  onClick={() => approveAndAddToAwards(selectedSubmission)}
                  className="flex-1 bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve & Add to Awards
                </button>
                <button
                  onClick={() =>
                    updateSubmissionStatus(selectedSubmission.id, "rejected")
                  }
                  className="flex-1 bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Podcast Modal */}
      {isPodcastModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-4 sm:my-8 max-h-[95vh] flex flex-col">
            <div className="sticky top-0 bg-[#6B0C22] text-white p-4 sm:p-6 rounded-t-2xl flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold">
                {editingPodcast ? "Edit Episode" : "Add New Episode"}
              </h2>
              <button
                onClick={closePodcastModal}
                className="hover:bg-white/10 p-2 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cover Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#6B0C22] transition-colors">
                  {podcastImagePreview ? (
                    <div className="relative">
                      <img
                        src={podcastImagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setPodcastImagePreview("");
                          setPodcastImageFile(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block text-center">
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">
                        Click to upload cover image
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePodcastImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Episode Number *
                  </label>
                  <input
                    type="number"
                    value={podcastFormData.episode_number}
                    onChange={(e) =>
                      setPodcastFormData({
                        ...podcastFormData,
                        episode_number: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 45:30"
                    value={podcastFormData.duration}
                    onChange={(e) =>
                      setPodcastFormData({
                        ...podcastFormData,
                        duration: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Episode Title *
                </label>
                <input
                  type="text"
                  value={podcastFormData.title}
                  onChange={(e) =>
                    setPodcastFormData({
                      ...podcastFormData,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Guest Name *
                </label>
                <input
                  type="text"
                  value={podcastFormData.guest_name}
                  onChange={(e) =>
                    setPodcastFormData({
                      ...podcastFormData,
                      guest_name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={podcastFormData.description}
                  onChange={(e) =>
                    setPodcastFormData({
                      ...podcastFormData,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Spotify URL
                </label>
                <input
                  type="url"
                  value={podcastFormData.spotify_url}
                  onChange={(e) =>
                    setPodcastFormData({
                      ...podcastFormData,
                      spotify_url: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Apple Podcast URL
                </label>
                <input
                  type="url"
                  value={podcastFormData.apple_podcast_url}
                  onChange={(e) =>
                    setPodcastFormData({
                      ...podcastFormData,
                      apple_podcast_url: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  YouTube URL
                </label>
                <input
                  type="url"
                  value={podcastFormData.youtube_url}
                  onChange={(e) =>
                    setPodcastFormData({
                      ...podcastFormData,
                      youtube_url: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                />
              </div>

              <button
                onClick={handlePodcastSubmit}
                disabled={podcastLoading}
                className="w-full bg-[#6B0C22] text-white py-3 rounded-lg font-bold hover:bg-[#8B1530] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {podcastLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    {editingPodcast ? "Update Episode" : "Add Episode"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Book Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full my-8">
            <div className="sticky top-0 bg-[#6B0C22] text-white p-6 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {editingBook ? "Edit Book" : "Add New Award-Winning Book"}
              </h2>
              <button
                onClick={closeBookModal}
                className="hover:bg-white/10 p-2 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Cover Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Book Cover Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#6B0C22] transition-colors">
                  {bookImagePreview ? (
                    <div className="relative">
                      <img
                        src={bookImagePreview}
                        alt="Preview"
                        className="w-full h-64 object-contain rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setBookImagePreview("");
                          setBookImageFile(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block text-center">
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">
                        Click to upload book cover
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBookImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
              {/* After the Book Cover Image upload, add this: */}

              {/* Author Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Author Photo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#6B0C22] transition-colors">
                  {bookFormData.author_image_url ? (
                    <div className="relative">
                      <img
                        src={bookFormData.author_image_url}
                        alt="Author"
                        className="w-32 h-32 object-cover rounded-full mx-auto"
                      />
                      <button
                        onClick={() =>
                          setBookFormData({
                            ...bookFormData,
                            author_image_url: "",
                          })
                        }
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block text-center">
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">
                        Click to upload author photo
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const url = await uploadBookImage(file);
                            setBookFormData({
                              ...bookFormData,
                              author_image_url: url,
                            });
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    value={bookFormData.title}
                    onChange={(e) =>
                      setBookFormData({
                        ...bookFormData,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                    required
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    value={bookFormData.author}
                    onChange={(e) =>
                      setBookFormData({
                        ...bookFormData,
                        author: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                    required
                  />
                </div>
                {/* Find the Author Name field and add these after it: */}
                {/* After the Author Name and Year Won fields, add: */}

                {/* Pen Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pen Name
                  </label>
                  <input
                    type="text"
                    value={bookFormData.pen_name || ""}
                    onChange={(e) =>
                      setBookFormData({
                        ...bookFormData,
                        pen_name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={bookFormData.subtitle || ""}
                    onChange={(e) =>
                      setBookFormData({
                        ...bookFormData,
                        subtitle: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>

                {/* Book Series */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Book Series
                  </label>
                  <input
                    type="text"
                    value={bookFormData.book_series || ""}
                    onChange={(e) =>
                      setBookFormData({
                        ...bookFormData,
                        book_series: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>

                {/* Date of Publication */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Publication
                  </label>
                  <input
                    type="text"
                    value={bookFormData.date_of_publication || ""}
                    onChange={(e) =>
                      setBookFormData({
                        ...bookFormData,
                        date_of_publication: e.target.value,
                      })
                    }
                    placeholder="e.g., January 2024"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>

                {/* After the existing URL fields (video_trailer_url), add: */}

                {/* Social Media URLs */}
                <div className="md:col-span-2">
                  <h4 className="font-bold text-gray-900 mb-3 mt-4">
                    Social Media Links
                  </h4>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={bookFormData.facebook_url || ""}
                    onChange={(e) =>
                      setBookFormData({
                        ...bookFormData,
                        facebook_url: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={bookFormData.instagram_url || ""}
                    onChange={(e) =>
                      setBookFormData({
                        ...bookFormData,
                        instagram_url: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Twitter/X URL
                  </label>
                  <input
                    type="url"
                    value={bookFormData.twitter_url || ""}
                    onChange={(e) =>
                      setBookFormData({
                        ...bookFormData,
                        twitter_url: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Threads URL
                  </label>
                  <input
                    type="url"
                    value={bookFormData.threads_url || ""}
                    onChange={(e) =>
                      setBookFormData({
                        ...bookFormData,
                        threads_url: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>

                {/* File URLs (read-only, from submission) */}
                <div className="md:col-span-2">
                  <h4 className="font-bold text-gray-900 mb-3 mt-4">
                    Submitted Files
                  </h4>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    About Book PDF URL
                  </label>
                  <input
                    type="url"
                    value={bookFormData.about_book_pdf_url || ""}
                    onChange={(e) =>
                      setBookFormData({
                        ...bookFormData,
                        about_book_pdf_url: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    eBook URL
                  </label>
                  <input
                    type="url"
                    value={bookFormData.ebook_url || ""}
                    onChange={(e) =>
                      setBookFormData({
                        ...bookFormData,
                        ebook_url: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none bg-gray-50"
                  />
                </div>
                {/* Author Slug */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Author URL Slug
                  </label>
                  <input
                    type="text"
                    value={bookFormData.author_slug}
                    onChange={(e) =>
                      setBookFormData({
                        ...bookFormData,
                        author_slug: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, "-"),
                      })
                    }
                    placeholder="john-doe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL-friendly version of author name (e.g., john-doe)
                  </p>
                </div>

                {/* Author Bio - add this before the Description field */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Author Biography
                  </label>
                  <textarea
                    value={bookFormData.author_bio}
                    onChange={(e) =>
                      setBookFormData({
                        ...bookFormData,
                        author_bio: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none resize-none"
                    placeholder="Write a brief biography of the author..."
                  />
                </div>
                {/* Genre */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Genre
                  </label>
                  <input
                    type="text"
                    value={bookFormData.genre}
                    onChange={(e) =>
                      setBookFormData({
                        ...bookFormData,
                        genre: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>

                {/* Year Won */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Year Won *
                  </label>
                  <input
                    type="number"
                    value={bookFormData.year_won}
                    onChange={(e) =>
                      setBookFormData({
                        ...bookFormData,
                        year_won: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                    required
                  />
                </div>

                {/* Display Order */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={bookFormData.display_order}
                    onChange={(e) =>
                      setBookFormData({
                        ...bookFormData,
                        display_order: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Short Description
                </label>
                <textarea
                  value={bookFormData.description}
                  onChange={(e) =>
                    setBookFormData({
                      ...bookFormData,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none resize-none"
                />
              </div>

              {/* Synopsis */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Synopsis
                </label>
                <textarea
                  value={bookFormData.synopsis}
                  onChange={(e) =>
                    setBookFormData({
                      ...bookFormData,
                      synopsis: e.target.value,
                    })
                  }
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none resize-none"
                />
              </div>

              {/* URLs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={bookFormData.website_url}
                    onChange={(e) =>
                      setBookFormData({
                        ...bookFormData,
                        website_url: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Blog URL
                  </label>
                  <input
                    type="url"
                    value={bookFormData.blog_url}
                    onChange={(e) =>
                      setBookFormData({
                        ...bookFormData,
                        blog_url: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Amazon.com URL
                  </label>
                  <input
                    type="url"
                    value={bookFormData.amazon_url}
                    onChange={(e) =>
                      setBookFormData({
                        ...bookFormData,
                        amazon_url: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Amazon.co.uk URL
                  </label>
                  <input
                    type="url"
                    value={bookFormData.amazon_uk_url}
                    onChange={(e) =>
                      setBookFormData({
                        ...bookFormData,
                        amazon_uk_url: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Video Trailer URL (YouTube)
                  </label>
                  <input
                    type="url"
                    value={bookFormData.video_trailer_url}
                    onChange={(e) =>
                      setBookFormData({
                        ...bookFormData,
                        video_trailer_url: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={bookFormData.is_featured}
                  onChange={(e) =>
                    setBookFormData({
                      ...bookFormData,
                      is_featured: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-[#6B0C22] rounded focus:ring-2 focus:ring-[#6B0C22]"
                />
                <label
                  htmlFor="is_featured"
                  className="font-semibold text-gray-700"
                >
                  Mark as Featured Book
                </label>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleBookSubmit}
                disabled={bookLoading}
                className="w-full bg-[#6B0C22] text-white py-3 rounded-lg font-bold hover:bg-[#8B1530] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {bookLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    {editingBook ? "Update Book" : "Add Book"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Blog Modal */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl my-4 sm:my-8 max-h-[95vh] flex flex-col">
            <div className="sticky top-0 bg-[#6B0C22] text-white p-4 sm:p-6 rounded-t-2xl flex justify-between items-center z-10">
              <h2 className="text-xl sm:text-2xl font-bold">
                {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
              </h2>
              <button
                onClick={closeBlogModal}
                className="hover:bg-white/10 p-2 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              {/* Featured Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Featured Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#6B0C22] transition-colors">
                  {blogImagePreview ? (
                    <div className="relative">
                      <img
                        src={blogImagePreview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setBlogImagePreview("");
                          setBlogImageFile(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block text-center">
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">
                        Click to upload featured image
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBlogImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Post Title *
                </label>
                <input
                  type="text"
                  value={blogFormData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setBlogFormData({
                      ...blogFormData,
                      title,
                      slug: editingBlog
                        ? blogFormData.slug
                        : generateSlug(title),
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  placeholder="Enter blog post title"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL Slug *
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">/blog/</span>
                  <input
                    type="text"
                    value={blogFormData.slug}
                    onChange={(e) =>
                      setBlogFormData({
                        ...blogFormData,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, "-"),
                      })
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                    placeholder="post-url-slug"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Auto-generated from title. You can customize it.
                </p>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Excerpt (Short Description)
                </label>
                <textarea
                  value={blogFormData.excerpt}
                  onChange={(e) =>
                    setBlogFormData({
                      ...blogFormData,
                      excerpt: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none resize-none"
                  placeholder="Brief description for blog listing..."
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Content * (Supports Markdown)
                </label>
                <textarea
                  value={blogFormData.content}
                  onChange={(e) =>
                    setBlogFormData({
                      ...blogFormData,
                      content: e.target.value,
                    })
                  }
                  rows={12}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none resize-none font-mono text-sm"
                  placeholder="Write your blog post content here...

  You can use basic formatting:
  **bold text**
  *italic text*
  [link text](url)
  - bullet point

  Or write in plain HTML"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Author Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    value={blogFormData.author_name}
                    onChange={(e) =>
                      setBlogFormData({
                        ...blogFormData,
                        author_name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                    placeholder="John Doe"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={blogFormData.category}
                    onChange={(e) =>
                      setBlogFormData({
                        ...blogFormData,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                    placeholder="News, Reviews, Tips, etc."
                  />
                </div>

                {/* Read Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Read Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={blogFormData.read_time_minutes}
                    onChange={(e) =>
                      setBlogFormData({
                        ...blogFormData,
                        read_time_minutes: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                    min="1"
                  />
                </div>

                {/* Published Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    value={blogFormData.published_date}
                    onChange={(e) =>
                      setBlogFormData({
                        ...blogFormData,
                        published_date: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={
                    Array.isArray(blogFormData.tags)
                      ? blogFormData.tags.join(", ")
                      : ""
                  }
                  onChange={(e) =>
                    setBlogFormData({
                      ...blogFormData,
                      tags: e.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  placeholder="writing, books, literature"
                />
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={blogFormData.is_published}
                    onChange={(e) =>
                      setBlogFormData({
                        ...blogFormData,
                        is_published: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-[#6B0C22] rounded focus:ring-2 focus:ring-[#6B0C22]"
                  />
                  <label
                    htmlFor="is_published"
                    className="font-semibold text-gray-700"
                  >
                    Publish Post
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_featured_blog"
                    checked={blogFormData.is_featured}
                    onChange={(e) =>
                      setBlogFormData({
                        ...blogFormData,
                        is_featured: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-[#6B0C22] rounded focus:ring-2 focus:ring-[#6B0C22]"
                  />
                  <label
                    htmlFor="is_featured_blog"
                    className="font-semibold text-gray-700"
                  >
                    Mark as Featured
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleBlogSubmit}
                disabled={blogLoading}
                className="w-full bg-[#6B0C22] text-white py-3 rounded-lg font-bold hover:bg-[#8B1530] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {blogLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    {editingBlog ? "Update Post" : "Create Post"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Judge Modal */}
      {/* Judge Modal - RESPONSIVE */}
      {isJudgeModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-4 sm:my-8 max-h-[95vh] flex flex-col">
            <div className="sticky top-0 bg-[#6B0C22] text-white p-4 sm:p-6 rounded-t-2xl flex justify-between items-center z-10">
              <h2 className="text-xl sm:text-2xl font-bold">
                {editingJudge ? "Edit Judge" : "Add New Judge"}
              </h2>
              <button
                onClick={closeJudgeModal}
                className="hover:bg-white/10 p-2 rounded-lg"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              {/* Judge Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Judge Photo *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#6B0C22] transition-colors">
                  {judgeImagePreview ? (
                    <div className="relative">
                      <img
                        src={judgeImagePreview}
                        alt="Preview"
                        className="w-full h-48 sm:h-64 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setJudgeImagePreview("");
                          setJudgeImageFile(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block text-center">
                      <Upload className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm sm:text-base text-gray-600">
                        Click to upload judge photo
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleJudgeImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={judgeFormData.name}
                  onChange={(e) =>
                    setJudgeFormData({
                      ...judgeFormData,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none text-sm sm:text-base"
                  placeholder="Joshua Ìdòwú Omídire"
                  required
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Professional Title *
                </label>
                <input
                  type="text"
                  value={judgeFormData.title}
                  onChange={(e) =>
                    setJudgeFormData({
                      ...judgeFormData,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none text-sm sm:text-base"
                  placeholder="Biographer, Poet & Publisher"
                  required
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Biography *
                </label>
                <textarea
                  value={judgeFormData.bio}
                  onChange={(e) =>
                    setJudgeFormData({
                      ...judgeFormData,
                      bio: e.target.value,
                    })
                  }
                  rows={6}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none resize-none text-sm sm:text-base"
                  placeholder="Write a detailed biography of the judge..."
                  required
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={judgeFormData.display_order}
                  onChange={(e) =>
                    setJudgeFormData({
                      ...judgeFormData,
                      display_order: e.target.value,
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none text-sm sm:text-base"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower numbers appear first (0, 1, 2, ...)
                </p>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={judgeFormData.is_active}
                  onChange={(e) =>
                    setJudgeFormData({
                      ...judgeFormData,
                      is_active: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-[#6B0C22] rounded focus:ring-2 focus:ring-[#6B0C22]"
                />
                <label
                  htmlFor="is_active"
                  className="font-semibold text-gray-700 text-sm sm:text-base"
                >
                  Active Judge (Show on website)
                </label>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleJudgeSubmit}
                disabled={judgeLoading}
                className="w-full bg-[#6B0C22] text-white py-3 rounded-lg font-bold hover:bg-[#8B1530] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {judgeLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    {editingJudge ? "Update Judge" : "Add Judge"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
