import React from "react";
import { BookOpen, Filter, Eye, Trash2, CheckCircle, XCircle, File } from "lucide-react";
import { useLegacyAdmin } from "./LegacyAdminContext";
import { getImageUrl, getStatusColor } from "./useLegacyAdminData";

export default function SubmissionsSection() {
  const {
    loading,
    filter,
    setFilter,
    filteredSubmissions,
    selectedSubmission,
    setSelectedSubmission,
    deleteSubmission,
    updateSubmissionStatus,
    approveAndAddToAwards,
  } = useLegacyAdmin();

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-6">
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
                        {submission.submission_status.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-700 font-medium mb-2">by {submission.author_name}</p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <span className="font-semibold">Submitted by:</span> {submission.first_name}{" "}
                        {submission.last_name} ({submission.email})
                      </p>
                      <p>
                        <span className="font-semibold">Genre:</span> {submission.genre} |
                        <span className="font-semibold"> Payment:</span> {submission.payment_currency}{" "}
                        {submission.payment_amount}
                      </p>
                      <p className="text-xs text-gray-500">
                        Submitted: {new Date(submission.created_at).toLocaleDateString()}
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

                <div className="flex gap-2 flex-wrap">
                  {submission.submission_status === "pending" && (
                    <>
                      <button
                        onClick={() => updateSubmissionStatus(submission._id, "under_review")}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
                      >
                        Mark Under Review
                      </button>
                      <button
                        onClick={() => approveAndAddToAwards(submission)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors"
                      >
                        Approve & Add to Awards
                      </button>
                      <button
                        onClick={() => updateSubmissionStatus(submission._id, "rejected")}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {submission.submission_status === "approved" && (
                    <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-semibold">
                      Approved & In Awards
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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

            <div className="p-4 sm:p-6 space-y-6 overflow-y-auto custom-scrollbar">
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

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Book Title</h4>
                  <p className="text-gray-900">{selectedSubmission.book_title}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Subtitle</h4>
                  <p className="text-gray-900">{selectedSubmission.subtitle || "N/A"}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Author Name</h4>
                  <p className="text-gray-900">{selectedSubmission.author_name}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Pen Name</h4>
                  <p className="text-gray-900">{selectedSubmission.pen_name || "N/A"}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Genre</h4>
                  <p className="text-gray-900">{selectedSubmission.genre}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Book Series</h4>
                  <p className="text-gray-900">{selectedSubmission.book_series || "N/A"}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-bold text-lg mb-3">Submitter Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Name</h4>
                    <p className="text-gray-900">
                      {selectedSubmission.first_name} {selectedSubmission.last_name}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Email</h4>
                    <p className="text-gray-900">{selectedSubmission.email}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Relationship to Author</h4>
                    <p className="text-gray-900">{selectedSubmission.relationship_to_author}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Payment</h4>
                    <p className="text-gray-900">
                      {selectedSubmission.payment_currency} {selectedSubmission.payment_amount}
                    </p>
                  </div>
                </div>
              </div>

              {(selectedSubmission.about_book_pdf_url || selectedSubmission.ebook_url) && (
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
            </div>
            <div className="sticky bottom-0 bg-gray-50 p-4 sm:p-6 border-t rounded-b-2xl flex flex-col sm:flex-row gap-3 z-10">
              <button
                onClick={() => approveAndAddToAwards(selectedSubmission)}
                className="flex-1 bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <CheckCircle className="w-5 h-5" />
                Approve & Add to Awards
              </button>
              <button
                onClick={() => updateSubmissionStatus(selectedSubmission._id, "rejected")}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <XCircle className="w-5 h-5" />
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
