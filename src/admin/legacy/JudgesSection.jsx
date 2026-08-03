import React from "react";
import { Award, Plus, Edit, Trash2, Upload, X, CheckCircle } from "lucide-react";
import { useLegacyAdmin } from "./LegacyAdminContext";
import { getImageUrl } from "./useLegacyAdminData";

export default function JudgesSection() {
  const {
    judges,
    isJudgeModalOpen,
    editingJudge,
    judgeImagePreview,
    judgeLoading,
    judgeFormData,
    setJudgeFormData,
    openJudgeModal,
    closeJudgeModal,
    handleJudgeImageChange,
    clearJudgeImage,
    handleJudgeSubmit,
    deleteJudge,
  } = useLegacyAdmin();

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Manage Judges</h3>
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
            <p className="text-gray-600">No judges yet. Click "Add New Judge" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {judges.map((judge) => (
              <div key={judge._id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex gap-6 p-6">
                  <div className="w-32 h-32 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                    {judge.image_url ? (
                      <img src={judge.image_url} alt={judge.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Award className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-xl">{judge.name}</h3>
                          {!judge.is_active && (
                            <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-[#6B0C22] font-medium mb-2">{judge.title}</p>
                        <p className="text-gray-600 text-sm line-clamp-3">{judge.bio}</p>
                        <p className="text-xs text-gray-400 mt-2">Display Order: {judge.display_order}</p>
                      </div>

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

      {isJudgeModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-4 sm:my-8 max-h-[95vh] flex flex-col">
            <div className="sticky top-0 bg-[#6B0C22] text-white p-4 sm:p-6 rounded-t-2xl flex justify-between items-center z-10">
              <h2 className="text-xl sm:text-2xl font-bold">{editingJudge ? "Edit Judge" : "Add New Judge"}</h2>
              <button onClick={closeJudgeModal} className="hover:bg-white/10 p-2 rounded-lg">
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Judge Photo *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#6B0C22] transition-colors">
                  {judgeImagePreview ? (
                    <div className="relative">
                      <img
                        src={getImageUrl(judgeImagePreview)}
                        alt="Preview"
                        className="w-full h-48 sm:h-64 object-cover rounded-lg"
                      />
                      <button
                        onClick={clearJudgeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block text-center">
                      <Upload className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm sm:text-base text-gray-600">Click to upload judge photo</p>
                      <input type="file" accept="image/*" onChange={handleJudgeImageChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={judgeFormData.name}
                  onChange={(e) => setJudgeFormData({ ...judgeFormData, name: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none text-sm sm:text-base"
                  placeholder="Full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Title *</label>
                <input
                  type="text"
                  value={judgeFormData.title}
                  onChange={(e) => setJudgeFormData({ ...judgeFormData, title: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none text-sm sm:text-base"
                  placeholder="Biographer, Poet & Publisher"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Biography *</label>
                <textarea
                  value={judgeFormData.bio}
                  onChange={(e) => setJudgeFormData({ ...judgeFormData, bio: e.target.value })}
                  rows={6}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none resize-none text-sm sm:text-base"
                  placeholder="Write a detailed biography of the judge..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Display Order</label>
                <input
                  type="number"
                  value={judgeFormData.display_order}
                  onChange={(e) => setJudgeFormData({ ...judgeFormData, display_order: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none text-sm sm:text-base"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first (0, 1, 2, ...)</p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={judgeFormData.is_active}
                  onChange={(e) => setJudgeFormData({ ...judgeFormData, is_active: e.target.checked })}
                  className="w-5 h-5 text-[#6B0C22] rounded focus:ring-2 focus:ring-[#6B0C22]"
                />
                <label htmlFor="is_active" className="font-semibold text-gray-700 text-sm sm:text-base">
                  Active Judge (Show on website)
                </label>
              </div>

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
    </>
  );
}
