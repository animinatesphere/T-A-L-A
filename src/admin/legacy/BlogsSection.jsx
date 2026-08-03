import React from "react";
import { BookOpen, Plus, Edit, Trash2, Upload, X, CheckCircle } from "lucide-react";
import { useLegacyAdmin } from "./LegacyAdminContext";
import { getImageUrl } from "./useLegacyAdminData";

export default function BlogsSection() {
  const {
    blogs,
    isBlogModalOpen,
    editingBlog,
    blogImagePreview,
    blogLoading,
    blogFormData,
    setBlogFormData,
    openBlogModal,
    closeBlogModal,
    handleBlogImageChange,
    clearBlogImage,
    handleBlogSubmit,
    deleteBlog,
    generateSlug,
  } = useLegacyAdmin();

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Manage Blog Posts</h3>
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
            <p className="text-gray-600">No blog posts yet. Click "Create New Post" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {blogs.map((blog) => (
              <div key={blog._id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex gap-4 p-4">
                  <div className="w-48 h-32 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                    {blog.featured_image_url ? (
                      <img src={blog.featured_image_url} alt={blog.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg line-clamp-1">{blog.title}</h3>
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
                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{blog.excerpt}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>By {blog.author_name}</span>
                          {blog.category && <span>• {blog.category}</span>}
                          <span>• {blog.read_time_minutes} min read</span>
                          {blog.published_date && <span>• {new Date(blog.published_date).toLocaleDateString()}</span>}
                        </div>
                      </div>

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

      {isBlogModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl my-4 sm:my-8 max-h-[95vh] flex flex-col">
            <div className="sticky top-0 bg-[#6B0C22] text-white p-4 sm:p-6 rounded-t-2xl flex justify-between items-center z-10">
              <h2 className="text-xl sm:text-2xl font-bold">{editingBlog ? "Edit Blog Post" : "Create New Blog Post"}</h2>
              <button onClick={closeBlogModal} className="hover:bg-white/10 p-2 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Featured Image *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#6B0C22] transition-colors">
                  {blogImagePreview ? (
                    <div className="relative">
                      <img
                        src={getImageUrl(blogImagePreview)}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <button
                        onClick={clearBlogImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block text-center">
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">Click to upload featured image</p>
                      <input type="file" accept="image/*" onChange={handleBlogImageChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Post Title *</label>
                <input
                  type="text"
                  value={blogFormData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setBlogFormData({
                      ...blogFormData,
                      title,
                      slug: editingBlog ? blogFormData.slug : generateSlug(title),
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  placeholder="Enter blog post title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">URL Slug *</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">/blog/</span>
                  <input
                    type="text"
                    value={blogFormData.slug}
                    onChange={(e) =>
                      setBlogFormData({ ...blogFormData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                    placeholder="post-url-slug"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Auto-generated from title. You can customize it.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Excerpt (Short Description)</label>
                <textarea
                  value={blogFormData.excerpt}
                  onChange={(e) => setBlogFormData({ ...blogFormData, excerpt: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none resize-none"
                  placeholder="Brief description for blog listing..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Content * (Supports Markdown)</label>
                <textarea
                  value={blogFormData.content}
                  onChange={(e) => setBlogFormData({ ...blogFormData, content: e.target.value })}
                  rows={12}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none resize-none font-mono text-sm"
                  placeholder="Write your blog post content here..."
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Author Name *</label>
                  <input
                    type="text"
                    value={blogFormData.author_name}
                    onChange={(e) => setBlogFormData({ ...blogFormData, author_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={blogFormData.category}
                    onChange={(e) => setBlogFormData({ ...blogFormData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                    placeholder="News, Reviews, Tips, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Read Time (minutes)</label>
                  <input
                    type="number"
                    value={blogFormData.read_time_minutes}
                    onChange={(e) => setBlogFormData({ ...blogFormData, read_time_minutes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Publish Date</label>
                  <input
                    type="date"
                    value={blogFormData.published_date}
                    onChange={(e) => setBlogFormData({ ...blogFormData, published_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={Array.isArray(blogFormData.tags) ? blogFormData.tags.join(", ") : ""}
                  onChange={(e) =>
                    setBlogFormData({
                      ...blogFormData,
                      tags: e.target.value.split(",").map((tag) => tag.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  placeholder="writing, books, literature"
                />
              </div>

              <div className="flex gap-6">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={blogFormData.is_published}
                    onChange={(e) => setBlogFormData({ ...blogFormData, is_published: e.target.checked })}
                    className="w-5 h-5 text-[#6B0C22] rounded focus:ring-2 focus:ring-[#6B0C22]"
                  />
                  <label htmlFor="is_published" className="font-semibold text-gray-700">
                    Publish Post
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_featured_blog"
                    checked={blogFormData.is_featured}
                    onChange={(e) => setBlogFormData({ ...blogFormData, is_featured: e.target.checked })}
                    className="w-5 h-5 text-[#6B0C22] rounded focus:ring-2 focus:ring-[#6B0C22]"
                  />
                  <label htmlFor="is_featured_blog" className="font-semibold text-gray-700">
                    Mark as Featured
                  </label>
                </div>
              </div>

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
    </>
  );
}
