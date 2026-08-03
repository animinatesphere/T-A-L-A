import React from "react";
import { Podcast, Plus, Edit, Trash2, Upload, X, CheckCircle } from "lucide-react";
import { useLegacyAdmin } from "./LegacyAdminContext";
import { getImageUrl } from "./useLegacyAdminData";

export default function PodcastsSection() {
  const {
    podcasts,
    isPodcastModalOpen,
    editingPodcast,
    podcastImagePreview,
    podcastLoading,
    podcastFormData,
    setPodcastFormData,
    openPodcastModal,
    closePodcastModal,
    handlePodcastImageChange,
    clearPodcastImage,
    handlePodcastSubmit,
    deletePodcast,
  } = useLegacyAdmin();

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Manage Podcast Episodes</h3>
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
            <p className="text-gray-600">No podcast episodes yet. Click "Add New Episode" to get started.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {podcasts.map((podcast) => (
              <div key={podcast._id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  {podcast.cover_image_url ? (
                    <img src={podcast.cover_image_url} alt={podcast.title} className="w-full h-full object-cover" />
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
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">{podcast.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">with {podcast.guest_name}</p>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">{podcast.description}</p>
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

      {isPodcastModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-4 sm:my-8 max-h-[95vh] flex flex-col">
            <div className="sticky top-0 bg-[#6B0C22] text-white p-4 sm:p-6 rounded-t-2xl flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold">{editingPodcast ? "Edit Episode" : "Add New Episode"}</h2>
              <button onClick={closePodcastModal} className="hover:bg-white/10 p-2 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#6B0C22] transition-colors">
                  {podcastImagePreview ? (
                    <div className="relative">
                      <img
                        src={getImageUrl(podcastImagePreview)}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={clearPodcastImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block text-center">
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">Click to upload cover image</p>
                      <input type="file" accept="image/*" onChange={handlePodcastImageChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Episode Number *</label>
                  <input
                    type="number"
                    value={podcastFormData.episode_number}
                    onChange={(e) => setPodcastFormData({ ...podcastFormData, episode_number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g., 45:30"
                    value={podcastFormData.duration}
                    onChange={(e) => setPodcastFormData({ ...podcastFormData, duration: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Episode Title *</label>
                <input
                  type="text"
                  value={podcastFormData.title}
                  onChange={(e) => setPodcastFormData({ ...podcastFormData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Guest Name *</label>
                <input
                  type="text"
                  value={podcastFormData.guest_name}
                  onChange={(e) => setPodcastFormData({ ...podcastFormData, guest_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={podcastFormData.description}
                  onChange={(e) => setPodcastFormData({ ...podcastFormData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Spotify URL</label>
                <input
                  type="url"
                  value={podcastFormData.spotify_url}
                  onChange={(e) => setPodcastFormData({ ...podcastFormData, spotify_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Apple Podcast URL</label>
                <input
                  type="url"
                  value={podcastFormData.apple_podcast_url}
                  onChange={(e) => setPodcastFormData({ ...podcastFormData, apple_podcast_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">YouTube URL</label>
                <input
                  type="url"
                  value={podcastFormData.youtube_url}
                  onChange={(e) => setPodcastFormData({ ...podcastFormData, youtube_url: e.target.value })}
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
    </>
  );
}
