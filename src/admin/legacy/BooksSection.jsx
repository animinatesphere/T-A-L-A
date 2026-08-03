import React from "react";
import { BookOpen, Plus, Edit, Trash2, File, Upload, X, CheckCircle } from "lucide-react";
import { useLegacyAdmin } from "./LegacyAdminContext";
import { getImageUrl } from "./useLegacyAdminData";

export default function BooksSection() {
  const {
    awardBooks,
    isBookModalOpen,
    editingBook,
    bookImagePreview,
    authorImagePreview,
    bookLoading,
    bookFormData,
    setBookFormData,
    openBookModal,
    closeBookModal,
    handleBookImageChange,
    clearBookImage,
    handleAuthorImageChange,
    clearAuthorImage,
    handleBookSubmit,
    deleteBook,
  } = useLegacyAdmin();

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Manage Award-Winning Books</h3>
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
            <p className="text-gray-600">No award-winning books yet. Click "Add New Book" to get started.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awardBooks.map((book) => (
              <div key={book._id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-[3/4] bg-gray-200 relative">
                  {book.cover_image_url ? (
                    <img src={book.cover_image_url} alt={book.title} className="w-full h-full object-cover" />
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
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">{book.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">{book.description}</p>

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

      {isBookModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full my-8">
            <div className="sticky top-0 bg-[#6B0C22] text-white p-6 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-2xl font-bold">{editingBook ? "Edit Book" : "Add New Award-Winning Book"}</h2>
              <button onClick={closeBookModal} className="hover:bg-white/10 p-2 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Book Cover Image *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#6B0C22] transition-colors">
                  {bookImagePreview ? (
                    <div className="relative">
                      <img
                        src={getImageUrl(bookImagePreview)}
                        alt="Preview"
                        className="w-full h-64 object-contain rounded-lg"
                      />
                      <button
                        onClick={clearBookImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block text-center">
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">Click to upload book cover</p>
                      <input type="file" accept="image/*" onChange={handleBookImageChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Author Photo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#6B0C22] transition-colors">
                  {authorImagePreview ? (
                    <div className="relative">
                      <img
                        src={getImageUrl(authorImagePreview)}
                        alt="Author"
                        className="w-32 h-32 object-cover rounded-full mx-auto"
                      />
                      <button
                        onClick={clearAuthorImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block text-center">
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">Click to upload author photo</p>
                      <input type="file" accept="image/*" onChange={handleAuthorImageChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Book Title *</label>
                  <input
                    type="text"
                    value={bookFormData.title}
                    onChange={(e) => setBookFormData({ ...bookFormData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Author Name *</label>
                  <input
                    type="text"
                    value={bookFormData.author}
                    onChange={(e) => setBookFormData({ ...bookFormData, author: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pen Name</label>
                  <input
                    type="text"
                    value={bookFormData.pen_name || ""}
                    onChange={(e) => setBookFormData({ ...bookFormData, pen_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={bookFormData.subtitle || ""}
                    onChange={(e) => setBookFormData({ ...bookFormData, subtitle: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Book Series</label>
                  <input
                    type="text"
                    value={bookFormData.book_series || ""}
                    onChange={(e) => setBookFormData({ ...bookFormData, book_series: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Publication</label>
                  <input
                    type="text"
                    value={bookFormData.date_of_publication || ""}
                    onChange={(e) => setBookFormData({ ...bookFormData, date_of_publication: e.target.value })}
                    placeholder="e.g., January 2024"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <h4 className="font-bold text-gray-900 mb-3 mt-4">Social Media Links</h4>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook URL</label>
                  <input
                    type="url"
                    value={bookFormData.facebook_url || ""}
                    onChange={(e) => setBookFormData({ ...bookFormData, facebook_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram URL</label>
                  <input
                    type="url"
                    value={bookFormData.instagram_url || ""}
                    onChange={(e) => setBookFormData({ ...bookFormData, instagram_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Twitter/X URL</label>
                  <input
                    type="url"
                    value={bookFormData.twitter_url || ""}
                    onChange={(e) => setBookFormData({ ...bookFormData, twitter_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Threads URL</label>
                  <input
                    type="url"
                    value={bookFormData.threads_url || ""}
                    onChange={(e) => setBookFormData({ ...bookFormData, threads_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <h4 className="font-bold text-gray-900 mb-3 mt-4">Submitted Files</h4>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">About Book PDF URL</label>
                  <input
                    type="url"
                    value={bookFormData.about_book_pdf_url || ""}
                    onChange={(e) => setBookFormData({ ...bookFormData, about_book_pdf_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">eBook URL</label>
                  <input
                    type="url"
                    value={bookFormData.ebook_url || ""}
                    onChange={(e) => setBookFormData({ ...bookFormData, ebook_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Author URL Slug</label>
                  <input
                    type="text"
                    value={bookFormData.author_slug}
                    onChange={(e) =>
                      setBookFormData({
                        ...bookFormData,
                        author_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                      })
                    }
                    placeholder="john-doe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">URL-friendly version of author name (e.g., john-doe)</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Author Biography</label>
                  <textarea
                    value={bookFormData.author_bio}
                    onChange={(e) => setBookFormData({ ...bookFormData, author_bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none resize-none"
                    placeholder="Write a brief biography of the author..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Genre</label>
                  <input
                    type="text"
                    value={bookFormData.genre}
                    onChange={(e) => setBookFormData({ ...bookFormData, genre: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Year Won *</label>
                  <input
                    type="number"
                    value={bookFormData.year_won}
                    onChange={(e) => setBookFormData({ ...bookFormData, year_won: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Display Order</label>
                  <input
                    type="number"
                    value={bookFormData.display_order}
                    onChange={(e) => setBookFormData({ ...bookFormData, display_order: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Short Description</label>
                <textarea
                  value={bookFormData.description}
                  onChange={(e) => setBookFormData({ ...bookFormData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Synopsis</label>
                <textarea
                  value={bookFormData.synopsis}
                  onChange={(e) => setBookFormData({ ...bookFormData, synopsis: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none resize-none"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Website URL</label>
                  <input
                    type="url"
                    value={bookFormData.website_url}
                    onChange={(e) => setBookFormData({ ...bookFormData, website_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Blog URL</label>
                  <input
                    type="url"
                    value={bookFormData.blog_url}
                    onChange={(e) => setBookFormData({ ...bookFormData, blog_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Amazon.com URL</label>
                  <input
                    type="url"
                    value={bookFormData.amazon_url}
                    onChange={(e) => setBookFormData({ ...bookFormData, amazon_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Amazon.co.uk URL</label>
                  <input
                    type="url"
                    value={bookFormData.amazon_uk_url}
                    onChange={(e) => setBookFormData({ ...bookFormData, amazon_uk_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Video Trailer URL (YouTube)</label>
                  <input
                    type="url"
                    value={bookFormData.video_trailer_url}
                    onChange={(e) => setBookFormData({ ...bookFormData, video_trailer_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={bookFormData.is_featured}
                  onChange={(e) => setBookFormData({ ...bookFormData, is_featured: e.target.checked })}
                  className="w-5 h-5 text-[#6B0C22] rounded focus:ring-2 focus:ring-[#6B0C22]"
                />
                <label htmlFor="is_featured" className="font-semibold text-gray-700">
                  Mark as Featured Book
                </label>
              </div>

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
    </>
  );
}
