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
} from "lucide-react";

const SUPABASE_URL = "https://sunipfnesvzlkcitbhns.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1bmlwZm5lc3Z6bGtjaXRiaG5zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTE2MDA0MCwiZXhwIjoyMDgwNzM2MDQwfQ.h_UMD88A5kTsZfM3JrkU89tMgDfUUrZY1cCEwIuuKtY";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("submissions");
  const [submissions, setSubmissions] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Podcast modal states
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

  useEffect(() => {
    fetchSubmissions();
    fetchPodcasts();

    // Poll for new submissions every 30 seconds
    const interval = setInterval(() => {
      fetchSubmissions();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/book_submissions?order=created_at.desc`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        }
      );
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPodcasts = async () => {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/podcasts?order=episode_number.desc`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        }
      );
      const data = await response.json();
      setPodcasts(data);
    } catch (error) {
      console.error("Error fetching podcasts:", error);
    }
  };

  const updateSubmissionStatus = async (id, status, notes = "") => {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/book_submissions?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          submission_status: status,
          admin_notes: notes,
          updated_at: new Date().toISOString(),
        }),
      });
      fetchSubmissions();
      setSelectedSubmission(null);
    } catch (error) {
      console.error("Error updating submission:", error);
    }
  };

  const deleteSubmission = async (id) => {
    if (window.confirm("Are you sure you want to delete this submission?")) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/book_submissions?id=eq.${id}`, {
          method: "DELETE",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
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

    let coverImageUrl = podcastFormData.cover_image_url;

    if (podcastImageFile) {
      coverImageUrl = await uploadPodcastImage(podcastImageFile);
    }

    const podcastData = {
      ...podcastFormData,
      cover_image_url: coverImageUrl,
      episode_number: parseInt(podcastFormData.episode_number),
    };

    try {
      if (editingPodcast) {
        await fetch(
          `${SUPABASE_URL}/rest/v1/podcasts?id=eq.${editingPodcast.id}`,
          {
            method: "PATCH",
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              "Content-Type": "application/json",
              Prefer: "return=minimal",
            },
            body: JSON.stringify(podcastData),
          }
        );
      } else {
        await fetch(`${SUPABASE_URL}/rest/v1/podcasts`, {
          method: "POST",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify(podcastData),
        });
      }

      fetchPodcasts();
      closePodcastModal();
    } catch (error) {
      console.error("Error saving podcast:", error);
    } finally {
      setPodcastLoading(false);
    }
  };

  const deletePodcast = async (id) => {
    if (window.confirm("Are you sure you want to delete this podcast?")) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/podcasts?id=eq.${id}`, {
          method: "DELETE",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        });
        fetchPodcasts();
      } catch (error) {
        console.error("Error deleting podcast:", error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#6B0C22] to-[#4a0818] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                T.A.L.A. Admin Dashboard
              </h1>
              <p className="text-sm text-gray-200 mt-1">
                Manage book submissions and podcasts
              </p>
            </div>
            <div className="relative">
              <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors relative">
                <Bell className="w-6 h-6" />
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
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
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Submissions</p>
                <p className="text-3xl font-bold text-gray-900">
                  {submissions.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#6B0C22] rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {pendingCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-600">
                  {
                    submissions.filter(
                      (s) => s.submission_status === "approved"
                    ).length
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Podcasts</p>
                <p className="text-3xl font-bold text-[#6B0C22]">
                  {podcasts.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Podcast className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("submissions")}
                className={`px-6 py-4 font-semibold transition-colors ${
                  activeTab === "submissions"
                    ? "text-[#6B0C22] border-b-2 border-[#6B0C22]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Book Submissions
                  {pendingCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab("podcasts")}
                className={`px-6 py-4 font-semibold transition-colors ${
                  activeTab === "podcasts"
                    ? "text-[#6B0C22] border-b-2 border-[#6B0C22]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Podcast className="w-5 h-5" />
                  Manage Podcasts
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
                        className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">
                                {submission.book_title}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                  submission.submission_status
                                )}`}
                              >
                                {submission.submission_status
                                  .replace("_", " ")
                                  .toUpperCase()}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-1">
                              by {submission.author_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Submitted by: {submission.first_name}{" "}
                              {submission.last_name} ({submission.email})
                            </p>
                            <p className="text-sm text-gray-500">
                              Genre: {submission.genre} | Payment:{" "}
                              {submission.payment_currency}{" "}
                              {submission.payment_amount}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              Submitted:{" "}
                              {new Date(
                                submission.created_at
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedSubmission(submission)}
                              className="p-2 bg-[#6B0C22] text-white rounded-lg hover:bg-[#8B1530] transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => deleteSubmission(submission.id)}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-2">
                          {submission.submission_status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  updateSubmissionStatus(
                                    submission.id,
                                    "under_review"
                                  )
                                }
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
                              >
                                Mark Under Review
                              </button>
                              <button
                                onClick={() =>
                                  updateSubmissionStatus(
                                    submission.id,
                                    "approved"
                                  )
                                }
                                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  updateSubmissionStatus(
                                    submission.id,
                                    "rejected"
                                  )
                                }
                                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                              >
                                Reject
                              </button>
                            </>
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
                        key={podcast.id}
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
                              onClick={() => deletePodcast(podcast.id)}
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
          </div>
        </div>
      </div>

      {/* Submission Details Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full my-8">
            <div className="sticky top-0 bg-[#6B0C22] text-white p-6 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-2xl font-bold">Submission Details</h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Book Images */}
              <div>
                <h3 className="font-bold text-lg mb-3">Book Cover Images</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    selectedSubmission.cover_image_1,
                    selectedSubmission.cover_image_2,
                    selectedSubmission.cover_image_3,
                  ]
                    .filter(Boolean)
                    .map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Cover ${idx + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
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

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t">
                <button
                  onClick={() =>
                    updateSubmissionStatus(selectedSubmission.id, "approved")
                  }
                  className="flex-1 bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full my-8">
            <div className="sticky top-0 bg-[#6B0C22] text-white p-6 rounded-t-2xl flex justify-between items-center">
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
    </div>
  );
}
