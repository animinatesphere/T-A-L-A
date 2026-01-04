import React, { useState } from "react";
import {
  Upload,
  BookOpen,
  DollarSign,
  CreditCard,
  Check,
  X,
  AlertCircle,
  FileText,
  File,
} from "lucide-react";

const SUPABASE_URL = "https://sunipfnesvzlkcitbhns.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1bmlwZm5lc3Z6bGtjaXRiaG5zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTE2MDA0MCwiZXhwIjoyMDgwNzM2MDQwfQ.h_UMD88A5kTsZfM3JrkU89tMgDfUUrZY1cCEwIuuKtY";

const PAYSTACK_PUBLIC_KEY = "pk_live_6560af0a81f50cfdd244e08bf2e54169a3e434e9";

export default function BookSubmissionForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    relationship_to_author: "",
    author_name: "",
    pen_name: "",
    book_title: "",
    subtitle: "",
    genre: "",
    book_series: "",
    series_description: "",
    amazon_url: "",
    barnes_noble_url: "",
  });

  const [files, setFiles] = useState({
    book_cover: null,
    about_book_pdf: null,
    ebook: null,
  });

  const [filePreviews, setFilePreviews] = useState({
    book_cover_preview: "",
    about_book_pdf_name: "",
    ebook_name: "",
  });

  const [currency, setCurrency] = useState("USD");
  const amount = currency === "USD" ? 50 : 35000;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (fileType, file) => {
    if (file) {
      setFiles({ ...files, [fileType]: file });

      if (fileType === "book_cover") {
        setFilePreviews({
          ...filePreviews,
          book_cover_preview: URL.createObjectURL(file),
        });
      } else if (fileType === "about_book_pdf") {
        setFilePreviews({
          ...filePreviews,
          about_book_pdf_name: file.name,
        });
      } else if (fileType === "ebook") {
        setFilePreviews({
          ...filePreviews,
          ebook_name: file.name,
        });
      }
    }
  };

  const removeFile = (fileType) => {
    setFiles({ ...files, [fileType]: null });

    if (fileType === "book_cover") {
      setFilePreviews({ ...filePreviews, book_cover_preview: "" });
    } else if (fileType === "about_book_pdf") {
      setFilePreviews({ ...filePreviews, about_book_pdf_name: "" });
    } else if (fileType === "ebook") {
      setFilePreviews({ ...filePreviews, ebook_name: "" });
    }
  };

  const uploadFile = async (file, fileName, bucket) => {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/storage/v1/object/${bucket}/${fileName}`,
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
        return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`;
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    return null;
  };

  const handlePaystackPayment = () => {
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: formData.email,
      amount: amount * 100,
      currency: currency,
      ref: "TALA_" + Math.floor(Math.random() * 1000000000 + 1),
      callback: async function (response) {
        await saveSubmission(response.reference);
      },
      onClose: function () {
        alert("Payment window closed. Please try again.");
      },
    });
    handler.openIframe();
  };

  const saveSubmission = async (paymentReference) => {
    setLoading(true);

    try {
      const timestamp = Date.now();
      let fileUrls = {};

      if (files.book_cover) {
        fileUrls.cover_image_url = await uploadFile(
          files.book_cover,
          `${timestamp}_cover_${files.book_cover.name}`,
          "book-covers"
        );
      }

      if (files.about_book_pdf) {
        fileUrls.about_book_pdf_url = await uploadFile(
          files.about_book_pdf,
          `${timestamp}_about_${files.about_book_pdf.name}`,
          "book-documents"
        );
      }

      if (files.ebook) {
        fileUrls.ebook_url = await uploadFile(
          files.ebook,
          `${timestamp}_ebook_${files.ebook.name}`,
          "book-documents"
        );
      }

      const submissionData = {
        ...formData,
        ...fileUrls,
        payment_status: "completed",
        payment_amount: amount,
        payment_currency: currency,
        payment_reference: paymentReference,
        submission_status: "pending",
      };

      const response = await fetch(`${SUPABASE_URL}/rest/v1/book_submissions`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setStep(4);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error saving submission:", error);
      setSubmitStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const validateStep1 = () => {
    return (
      formData.first_name &&
      formData.last_name &&
      formData.email &&
      formData.relationship_to_author &&
      formData.author_name &&
      formData.book_title &&
      formData.genre
    );
  };

  const validateStep2 = () => {
    return files.book_cover && files.about_book_pdf && files.ebook;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#6B0C22] rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Submit Your Book
          </h1>
          <p className="text-gray-600">
            Complete the form to submit your book for T.A.L.A. review
          </p>
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Are You a Self-Published or Indie Author?
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
            <p>
              The Africa Laureate Awards exists to recognise quality
              self-published books and give independent authors the recognition
              and visibility their work deserves. We do this through a
              structured book evaluation process and the T.A.L.A. Medallion,
              which serves as a mark of recognition for outstanding
              self-published titles.
            </p>

            <p>
              Unlike traditional award programmes, we do not place books in
              competition with one another or select a single winner. There is
              no limit to the number of books that may receive a T.A.L.A.
              Medallion. Each book is assessed on its own merit. A T.A.L.A.
              Medallion on a book cover signals to readers that the work has
              gone through a careful review process and has met our standards.
            </p>

            <p>
              Self-published authors are invited to nominate their books for
              consideration. Every submission is reviewed through our selection
              process, and books that meet our criteria are awarded the T.A.L.A.
              Medallion. This recognition helps position a book for wider
              attention and serves as an important step toward building
              credibility and reader trust.
            </p>
          </div>

          <div className="mt-8 bg-gradient-to-r from-[#6B0C22] to-[#4a0818] text-white rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3">
              Ready to Submit Your Book?
            </h3>
            <p className="mb-4 text-gray-200">
              To submit your book, please complete the nomination form below. A
              processing fee of $50.00 applies and is payable through our secure
              payment system. This fee covers promotional costs, review
              coordination, and the operation of The Africa Laureate Awards
              platform.
            </p>
            <p className="text-gray-200">
              Once your submission and payment are received, you will get a
              confirmation email acknowledging your entry and outlining the
              review process in detail.
            </p>
          </div>

          <div className="mt-6 bg-blue-50 border-l-4 border-[#6B0C22] p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Submissions Are Open
            </h3>
            <p className="text-gray-700">
              Submit your book information and contact details here.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((stepNum) => (
              <React.Fragment key={stepNum}>
                <div
                  className={`flex items-center ${
                    stepNum <= step ? "text-[#6B0C22]" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      stepNum <= step
                        ? "bg-[#6B0C22] text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {stepNum < step ? <Check className="w-5 h-5" /> : stepNum}
                  </div>
                  <span className="ml-2 hidden md:block font-semibold">
                    {stepNum === 1
                      ? "Book Info"
                      : stepNum === 2
                      ? "Upload Files"
                      : "Payment"}
                  </span>
                </div>
                {stepNum < 3 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      stepNum < step ? "bg-[#6B0C22]" : "bg-gray-300"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Book Information
              </h2>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] focus:border-transparent outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] focus:border-transparent outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Relationship to Author *
                    </label>
                    <select
                      name="relationship_to_author"
                      value={formData.relationship_to_author}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] focus:border-transparent outline-none"
                      required
                    >
                      <option value="">Select...</option>
                      <option value="I am the author">I am the author</option>
                      <option value="Agent">Agent</option>
                      <option value="Publicist">Publicist</option>
                      <option value="Family Member">Family Member</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Book Details
                </h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Author Name *
                      </label>
                      <input
                        type="text"
                        name="author_name"
                        value={formData.author_name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] focus:border-transparent outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Pen Name
                      </label>
                      <input
                        type="text"
                        name="pen_name"
                        value={formData.pen_name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Book Title *
                    </label>
                    <input
                      type="text"
                      name="book_title"
                      value={formData.book_title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Genre *
                    </label>
                    <select
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] focus:border-transparent outline-none"
                      required
                    >
                      <option value="">Select Genre...</option>
                      <option value="Fiction">Fiction</option>
                      <option value="Non-Fiction">Non-Fiction</option>
                      <option value="Mystery">Mystery</option>
                      <option value="Romance">Romance</option>
                      <option value="Science Fiction">Science Fiction</option>
                      <option value="Fantasy">Fantasy</option>
                      <option value="Thriller">Thriller</option>
                      <option value="Biography">Biography</option>
                      <option value="Self-Help">Self-Help</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Book Series
                      </label>
                      <input
                        type="text"
                        name="book_series"
                        value={formData.book_series}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Amazon URL
                      </label>
                      <input
                        type="url"
                        name="amazon_url"
                        value={formData.amazon_url}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Barnes & Noble URL
                    </label>
                    <input
                      type="url"
                      name="barnes_noble_url"
                      value={formData.barnes_noble_url}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Series Description
                    </label>
                    <textarea
                      name="series_description"
                      value={formData.series_description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] focus:border-transparent outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => validateStep1() && setStep(2)}
                disabled={!validateStep1()}
                className="w-full bg-[#6B0C22] text-white py-3 rounded-lg font-bold hover:bg-[#8B1530] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Upload Files
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Upload Required Files
              </h2>
              <p className="text-gray-600 mb-6">
                Please upload the following files for your book submission:
              </p>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Book Cover Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#6B0C22] transition-colors">
                  {filePreviews.book_cover_preview ? (
                    <div className="relative">
                      <img
                        src={filePreviews.book_cover_preview}
                        alt="Book Cover"
                        className="max-w-xs mx-auto h-64 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeFile("book_cover")}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block text-center">
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-600 mb-2 font-semibold">
                        Click to upload Book Cover
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG or JPG (max 5MB)
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange("book_cover", e.target.files[0])
                        }
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  About Book PDF *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#6B0C22] transition-colors">
                  {filePreviews.about_book_pdf_name ? (
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-red-500" />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {filePreviews.about_book_pdf_name}
                          </p>
                          <p className="text-xs text-gray-500">PDF Document</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile("about_book_pdf")}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block text-center">
                      <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-600 mb-2 font-semibold">
                        Click to upload About Book PDF
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF file only (max 10MB)
                      </p>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) =>
                          handleFileChange("about_book_pdf", e.target.files[0])
                        }
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  eBook File *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#6B0C22] transition-colors">
                  {filePreviews.ebook_name ? (
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <File className="w-8 h-8 text-[#6B0C22]" />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {filePreviews.ebook_name}
                          </p>
                          <p className="text-xs text-gray-500">eBook File</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile("ebook")}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block text-center">
                      <File className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-600 mb-2 font-semibold">
                        Click to upload eBook
                      </p>
                      <p className="text-xs text-gray-500">
                        EPUB, MOBI, or PDF (max 50MB)
                      </p>
                      <input
                        type="file"
                        accept=".epub,.mobi,.pdf"
                        onChange={(e) =>
                          handleFileChange("ebook", e.target.files[0])
                        }
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => validateStep2() && setStep(3)}
                  disabled={!validateStep2()}
                  className="flex-1 bg-[#6B0C22] text-white py-3 rounded-lg font-bold hover:bg-[#8B1530] transition-colors disabled:opacity-50"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment</h2>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">Submission Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submitter:</span>
                    <span className="font-semibold">
                      {formData.first_name} {formData.last_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Book Title:</span>
                    <span className="font-semibold">{formData.book_title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Author:</span>
                    <span className="font-semibold">
                      {formData.author_name}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Currency
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setCurrency("USD")}
                    className={`p-4 border-2 rounded-lg font-semibold ${
                      currency === "USD"
                        ? "border-[#6B0C22] bg-[#6B0C22]/5"
                        : "border-gray-300"
                    }`}
                  >
                    <DollarSign className="w-6 h-6 mx-auto mb-2" />
                    USD $50.00
                  </button>
                  <button
                    onClick={() => setCurrency("NGN")}
                    className={`p-4 border-2 rounded-lg font-semibold ${
                      currency === "NGN"
                        ? "border-[#6B0C22] bg-[#6B0C22]/5"
                        : "border-gray-300"
                    }`}
                  >
                    <span className="text-2xl">₦</span>
                    <div className="mt-2">NGN ₦35,000</div>
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Secure Payment</p>
                  <p>Your payment is processed securely through Paystack.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300"
                >
                  Back
                </button>
                <button
                  onClick={handlePaystackPayment}
                  disabled={loading}
                  className="flex-1 bg-[#6B0C22] text-white py-3 rounded-lg font-bold hover:bg-[#8B1530] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CreditCard className="w-5 h-5" />
                  Pay {currency} {currency === "USD" ? "$50" : "₦35,000"}
                </button>
              </div>
            </div>
          )}

          {step === 4 && submitStatus === "success" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Submission Successful!
              </h2>
              <p className="text-gray-600 mb-6">
                Thank you for submitting your book to T.A.L.A. We'll review your
                submission and get back to you within 2-3 weeks.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-[#6B0C22] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#8B1530]"
              >
                Submit Another Book
              </button>
            </div>
          )}
        </div>
      </div>

      <script src="https://js.paystack.co/v1/inline.js" />
    </div>
  );
}
