import { useState, useEffect } from "react";
import { API_URL, getAuthHeaders } from "../../services/api";

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("blob:") || path.startsWith("data:")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return cleanPath;
};

export const getStatusColor = (status) => {
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

const generateAuthorSlug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const generateSlug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function useLegacyAdminData() {
  const [submissions, setSubmissions] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const [isPodcastModalOpen, setIsPodcastModalOpen] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState(null);
  const [podcastImageFile, setPodcastImageFile] = useState(null);
  const [podcastImagePreview, setPodcastImagePreview] = useState("");
  const [podcastLoading, setPodcastLoading] = useState(false);
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

  const [awardBooks, setAwardBooks] = useState([]);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [bookImageFile, setBookImageFile] = useState(null);
  const [bookImagePreview, setBookImagePreview] = useState("");
  const [authorImageFile, setAuthorImageFile] = useState(null);
  const [authorImagePreview, setAuthorImagePreview] = useState("");
  const [bookLoading, setBookLoading] = useState(false);
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

  const [notification, setNotification] = useState({ message: "", type: null, show: false });

  const showNotify = (message, type = "success") => {
    setNotification({ message, type, show: true });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`${API_URL}/submissions`, { headers: getAuthHeaders() });
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

  const fetchAwardBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/award-books?t=${Date.now()}`);
      const result = await response.json();
      setAwardBooks(result.data);
    } catch (error) {
      console.error("Error fetching award books:", error);
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

  const fetchJudges = async () => {
    try {
      const response = await fetch(`${API_URL}/judges`);
      const result = await response.json();
      setJudges(result.data);
    } catch (error) {
      console.error("Error fetching judges:", error);
    }
  };

  useEffect(() => {
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
  }, []);

  const updateSubmissionStatus = async (id, status, notes = "") => {
    try {
      await fetch(`${API_URL}/submissions/${id}`, {
        method: "PATCH",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ submission_status: status, admin_notes: notes }),
      });
      showNotify(`Submission ${status} successfully!`);
      fetchSubmissions();
      setSelectedSubmission(null);
    } catch (error) {
      console.error("Error updating submission:", error);
    }
  };

  const approveAndAddToAwards = async (submission) => {
    if (!window.confirm(`Approve "${submission.book_title}" and add to Award-Winning Books?`)) return;

    try {
      const updateResponse = await fetch(`${API_URL}/submissions/${submission._id}`, {
        method: "PATCH",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ submission_status: "approved" }),
      });
      if (!updateResponse.ok) throw new Error("Failed to update submission status");

      const awardBookData = {
        title: submission.book_title,
        subtitle: submission.subtitle || "",
        author: submission.author_name,
        pen_name: submission.pen_name || "",
        cover_image_url: submission.cover_image_url || "",
        author_image_url: submission.author_image_url || "",
        description: submission.book_description || "",
        synopsis: submission.book_description || "",
        author_bio: submission.about_aurthor || "",
        genre: submission.genre || "",
        book_series: submission.book_series || "",
        date_of_publication: submission.date_of_publication || "",
        year_won: new Date().getFullYear(),
        author_slug: generateAuthorSlug(submission.author_name),
        amazon_url: submission.barnes_noble_url || "",
        amazon_uk_url: "",
        website_url: "",
        blog_url: "",
        video_trailer_url: "",
        facebook_url: submission.facebook_url || "",
        instagram_url: submission.instagram_url || "",
        twitter_url: submission.twitter_url || "",
        threads_url: submission.threads_url || "",
        about_book_pdf_url: submission.about_book_pdf_url || "",
        ebook_url: submission.ebook_url || "",
        is_featured: false,
        display_order: 999,
      };

      const awardResponse = await fetch(`${API_URL}/award-books`, {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(awardBookData),
      });

      if (awardResponse.ok) {
        showNotify("Submission approved and added to Award-Winning Books!");
        fetchSubmissions();
        fetchAwardBooks();
        setSelectedSubmission(null);
      } else {
        console.error("Failed to add to award books:", await awardResponse.text());
        showNotify("Submission approved but failed to add to awards.", "error");
      }
    } catch (error) {
      console.error("Error approving submission:", error);
      showNotify("Error approving submission. Please try again.", "error");
    }
  };

  const deleteSubmission = async (id) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) return;
    try {
      await fetch(`${API_URL}/submissions/${id}`, { method: "DELETE", headers: getAuthHeaders() });
      fetchSubmissions();
    } catch (error) {
      console.error("Error deleting submission:", error);
    }
  };

  // Podcasts
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
        showNotify("Image size should be less than 100MB", "error");
        return;
      }
      setPodcastImageFile(file);
      setPodcastImagePreview(URL.createObjectURL(file));
    }
  };

  const clearPodcastImage = () => {
    setPodcastImagePreview("");
    setPodcastImageFile(null);
  };

  const handlePodcastSubmit = async () => {
    setPodcastLoading(true);
    const formData = new FormData();
    Object.keys(podcastFormData).forEach((key) => formData.append(key, podcastFormData[key]));
    if (podcastImageFile) formData.append("cover_image", podcastImageFile);

    try {
      let response;
      if (editingPodcast) {
        response = await fetch(`${API_URL}/podcasts/${editingPodcast._id}`, {
          method: "PATCH",
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify(podcastFormData),
        });
      } else {
        response = await fetch(`${API_URL}/podcasts`, { method: "POST", headers: getAuthHeaders(), body: formData });
      }
      if (response.ok) {
        showNotify(editingPodcast ? "Podcast updated successfully!" : "Podcast added successfully!");
        fetchPodcasts();
        closePodcastModal();
      }
    } catch (error) {
      console.error("Error saving podcast:", error);
      showNotify("Error saving podcast. Please try again.", "error");
    } finally {
      setPodcastLoading(false);
    }
  };

  const deletePodcast = async (id) => {
    if (!window.confirm("Are you sure you want to delete this podcast episode?")) return;
    try {
      await fetch(`${API_URL}/podcasts/${id}`, { method: "DELETE", headers: getAuthHeaders() });
      fetchPodcasts();
    } catch (error) {
      console.error("Error deleting podcast:", error);
    }
  };

  // Books
  const openBookModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setBookFormData(book);
      setBookImagePreview(book.cover_image_url);
      setAuthorImagePreview(book.author_image_url);
    } else {
      setEditingBook(null);
      setBookFormData({
        title: "",
        author: "",
        cover_image_url: "",
        author_image_url: "",
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
      setAuthorImagePreview("");
    }
    setBookImageFile(null);
    setAuthorImageFile(null);
    setIsBookModalOpen(true);
  };

  const closeBookModal = () => {
    setIsBookModalOpen(false);
    setEditingBook(null);
    setBookImageFile(null);
    setBookImagePreview("");
    setAuthorImageFile(null);
    setAuthorImagePreview("");
  };

  const handleBookImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        showNotify("Image size should be less than 100MB", "error");
        return;
      }
      setBookImageFile(file);
      setBookImagePreview(URL.createObjectURL(file));
    }
  };

  const clearBookImage = () => {
    setBookImagePreview("");
    setBookImageFile(null);
  };

  const handleAuthorImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        showNotify("Image size should be less than 100MB", "error");
        return;
      }
      setAuthorImageFile(file);
      setAuthorImagePreview(URL.createObjectURL(file));
    }
  };

  const clearAuthorImage = () => {
    setAuthorImagePreview("");
    setAuthorImageFile(null);
  };

  const handleBookSubmit = async () => {
    setBookLoading(true);
    const formData = new FormData();
    Object.keys(bookFormData).forEach((key) => formData.append(key, bookFormData[key]));
    if (bookImageFile) formData.append("cover_image", bookImageFile);
    if (authorImageFile) formData.append("author_image", authorImageFile);

    try {
      let response;
      if (editingBook) {
        response = await fetch(`${API_URL}/award-books/${editingBook._id}`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: formData,
        });
      } else {
        response = await fetch(`${API_URL}/award-books`, { method: "POST", headers: getAuthHeaders(), body: formData });
      }
      if (response.ok) {
        showNotify(editingBook ? "Book updated successfully!" : "Book added successfully!");
        fetchAwardBooks();
        closeBookModal();
      }
    } catch (error) {
      console.error("Error saving book:", error);
      showNotify("Error saving book. Please try again.", "error");
    } finally {
      setBookLoading(false);
    }
  };

  const deleteBook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await fetch(`${API_URL}/award-books/${id}`, { method: "DELETE", headers: getAuthHeaders() });
      fetchAwardBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  // Blogs
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
      if (!file.type.startsWith("image/")) {
        showNotify("Please select an image file", "error");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        showNotify("Image size should be less than 100MB", "error");
        return;
      }
      setBlogImageFile(file);
      setBlogImagePreview(URL.createObjectURL(file));
    }
  };

  const clearBlogImage = () => {
    setBlogImagePreview("");
    setBlogImageFile(null);
  };

  const handleBlogSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setBlogLoading(true);
    const formData = new FormData();
    Object.keys(blogFormData).forEach((key) => {
      if (key === "tags") formData.append(key, JSON.stringify(blogFormData[key]));
      else formData.append(key, blogFormData[key]);
    });
    if (blogImageFile) formData.append("featured_image", blogImageFile);

    try {
      const url = editingBlog ? `${API_URL}/blogs/${editingBlog._id}` : `${API_URL}/blogs`;
      const method = editingBlog ? "PATCH" : "POST";
      const response = await fetch(url, { method, headers: getAuthHeaders(), body: formData });
      if (response.ok) {
        showNotify(`Blog post ${editingBlog ? "updated" : "created"} successfully!`);
        fetchBlogs();
        closeBlogModal();
      } else {
        const error = await response.json();
        showNotify(`Error: ${error.error}`, "error");
      }
    } catch (error) {
      console.error("Error saving blog post:", error);
      showNotify("Error saving blog post. Please try again.", "error");
    } finally {
      setBlogLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    try {
      await fetch(`${API_URL}/blogs/${id}`, { method: "DELETE", headers: getAuthHeaders() });
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  // Judges
  const openJudgeModal = (judge = null) => {
    if (judge) {
      setEditingJudge(judge);
      setJudgeFormData(judge);
      setJudgeImagePreview(judge.image_url);
    } else {
      setEditingJudge(null);
      setJudgeFormData({ name: "", title: "", bio: "", image_url: "", display_order: 0, is_active: true });
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
        showNotify("Please select an image file", "error");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        showNotify("Image size should be less than 100MB", "error");
        return;
      }
      setJudgeImageFile(file);
      setJudgeImagePreview(URL.createObjectURL(file));
    }
  };

  const clearJudgeImage = () => {
    setJudgeImagePreview("");
    setJudgeImageFile(null);
  };

  const handleJudgeSubmit = async () => {
    setJudgeLoading(true);
    const formData = new FormData();
    Object.keys(judgeFormData).forEach((key) => formData.append(key, judgeFormData[key]));
    if (judgeImageFile) formData.append("image", judgeImageFile);

    try {
      const url = editingJudge ? `${API_URL}/judges/${editingJudge._id}` : `${API_URL}/judges`;
      const method = editingJudge ? "PATCH" : "POST";
      const response = await fetch(url, { method, headers: getAuthHeaders(), body: formData });
      if (response.ok) {
        showNotify(editingJudge ? "Judge updated successfully!" : "Judge added successfully!");
        fetchJudges();
        closeJudgeModal();
      }
    } catch (error) {
      console.error("Error saving judge:", error);
      showNotify("Error saving judge. Please try again.", "error");
    } finally {
      setJudgeLoading(false);
    }
  };

  const deleteJudge = async (id) => {
    if (!window.confirm("Are you sure you want to delete this judge?")) return;
    try {
      await fetch(`${API_URL}/judges/${id}`, { method: "DELETE", headers: getAuthHeaders() });
      fetchJudges();
    } catch (error) {
      console.error("Error deleting judge:", error);
    }
  };

  const filteredSubmissions = submissions.filter((sub) => filter === "all" || sub.submission_status === filter);
  const pendingCount = submissions.filter((s) => s.submission_status === "pending").length;

  return {
    // submissions
    submissions, filteredSubmissions, pendingCount, selectedSubmission, setSelectedSubmission,
    loading, filter, setFilter, updateSubmissionStatus, approveAndAddToAwards, deleteSubmission,
    // podcasts
    podcasts, isPodcastModalOpen, editingPodcast, podcastImagePreview, podcastLoading, podcastFormData,
    setPodcastFormData, openPodcastModal, closePodcastModal, handlePodcastImageChange, clearPodcastImage, handlePodcastSubmit, deletePodcast,
    // books
    awardBooks, isBookModalOpen, editingBook, bookImagePreview, authorImagePreview, bookLoading, bookFormData,
    setBookFormData, openBookModal, closeBookModal, handleBookImageChange, clearBookImage, handleAuthorImageChange, clearAuthorImage, handleBookSubmit, deleteBook,
    // blogs
    blogs, isBlogModalOpen, editingBlog, blogImagePreview, blogLoading, blogFormData, setBlogFormData,
    openBlogModal, closeBlogModal, handleBlogImageChange, clearBlogImage, handleBlogSubmit, deleteBlog, generateSlug,
    // judges
    judges, isJudgeModalOpen, editingJudge, judgeImagePreview, judgeLoading, judgeFormData, setJudgeFormData,
    openJudgeModal, closeJudgeModal, handleJudgeImageChange, clearJudgeImage, handleJudgeSubmit, deleteJudge,
    // shared
    notification, showNotify,
  };
}
