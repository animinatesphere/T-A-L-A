import React, { useState, useEffect } from "react";
import {
  Upload,
  BookOpen,
  DollarSign,
  CreditCard,
  Check,
  X,
  AlertCircle,
  File,
} from "lucide-react";

const SUPABASE_URL = "https://sunipfnesvzlkcitbhns.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1bmlwZm5lc3Z6bGtjaXRiaG5zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTE2MDA0MCwiZXhwIjoyMDgwNzM2MDQwfQ.h_UMD88A5kTsZfM3JrkU89tMgDfUUrZY1cCEwIuuKtY";

const PAYSTACK_PUBLIC_KEY = "pk_live_6560af0a81f50cfdd244e08bf2e54169a3e434e9";
const KORAPAY_PUBLIC_KEY = "pk_live_tVMURvLgbVLgPHjnXnwtJwGCP77yqfKXo4HKeXUr";

export default function BookSubmissionForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    relationship_to_author: "",
    about_aurthor: "",
    author_name: "",
    pen_name: "",
    book_title: "",
    subtitle: "",
    genre: "",
    book_series: "",
    book_description: "",
    date_of_publication: "",
    barnes_noble_url: "",
    facebook_url: "",
    instagram_url: "",
    twitter_url: "",
    threads_url: "",
  });

  const genre = [
    "Select Genre..",
    "Self-Help",
    "Biography",
    "Thriller",
    "Fantasy",
    "Science Fiction",
    "Romance",
    "Mystery",
    "Non-Fiction",
    "Literary Fiction",
    "Historical Fiction",
    "Horror",
    "Young Adult",
    "Children's Fiction",
  ];

  const [files, setFiles] = useState({
    book_cover: null,
    author_image: null,
    about_book_pdf: null,
    ebook: null,
  });

  const [filePreviews, setFilePreviews] = useState({
    book_cover_preview: "",
    author_image_preview: "",
    about_book_pdf_name: "",
    ebook_name: "",
  });

  const [currency, setCurrency] = useState("USD");
  const amount = currency === "USD" ? 50 : 20000;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const paystackScript = document.createElement("script");
    paystackScript.src = "https://js.paystack.co/v1/inline.js";
    paystackScript.async = true;
    document.body.appendChild(paystackScript);

    const korapayScript = document.createElement("script");
    korapayScript.src =
      "https://korablobstorage.blob.core.windows.net/modal-bucket/korapay-collections.min.js";
    korapayScript.async = true;
    document.body.appendChild(korapayScript);

    return () => {
      document.body.removeChild(paystackScript);
      document.body.removeChild(korapayScript);
    };
  }, []);

  const handleFileChange = (fileType, file) => {
    if (file) {
      setFiles({ ...files, [fileType]: file });

      if (fileType === "book_cover") {
        setFilePreviews({
          ...filePreviews,
          book_cover_preview: URL.createObjectURL(file),
        });
      } else if (fileType === "author_image") {
        setFilePreviews({
          ...filePreviews,
          author_image_preview: URL.createObjectURL(file),
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
    } else if (fileType === "author_image") {
      setFilePreviews({ ...filePreviews, author_image_preview: "" });
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

  const handleKorapayPayment = () => {
    window.Korapay.initialize({
      key: KORAPAY_PUBLIC_KEY,
      reference: "TALA_" + Math.floor(Math.random() * 1000000000 + 1),
      amount: 5000,
      currency: "USD",
      customer: {
        name: `${formData.first_name} ${formData.last_name}`,
        email: formData.email,
      },
      onClose: function () {
        alert("Payment window closed. Please try again.");
      },
      onSuccess: function (data) {
        saveSubmission(data.reference);
      },
      // eslint-disable-next-line no-unused-vars
      onFailed: function (data) {
        alert("Payment failed. Please try again.");
      },
    });
  };

  const handlePaystackPayment = () => {
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: formData.email,
      amount: 1000,
      currency: "NGN",
      ref: "TALA_" + Math.floor(Math.random() * 1000000000 + 1),
      callback: function (response) {
        saveSubmission(response.reference);
      },
      onClose: function () {
        alert("Payment window closed. Please try again.");
      },
    });
    handler.openIframe();
  };

  const handlePayment = () => {
    if (currency === "USD") {
      handleKorapayPayment();
    } else {
      handlePaystackPayment();
    }
  };

  const generateAuthorSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
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
      if (files.author_image) {
        fileUrls.author_image_url = await uploadFile(
          files.author_image,
          `${timestamp}_author_${files.author_image.name}`,
          "author-images"
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

      // 1. Save to book_submissions table
      const submissionData = {
        ...formData,
        ...fileUrls,
        payment_status: "completed",
        payment_amount: amount,
        payment_currency: currency,
        payment_reference: paymentReference,
        submission_status: "pending",
      };

      const submissionResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/book_submissions`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify(submissionData),
        }
      );

      // 2. Also add to award_winning_books table
      const awardBookData = {
        title: formData.book_title,
        author: formData.author_name,
        cover_image_url: fileUrls.cover_image_url || "",
        author_image_url: fileUrls.author_image_url || "",
        description: formData.book_description || "",
        synopsis: formData.book_description || "",
        genre: formData.genre,
        year_won: new Date().getFullYear(),
        author_slug: generateAuthorSlug(formData.author_name),
        author_bio: formData.about_aurthor || "",
        website_url: "",
        blog_url: "",
        amazon_url: formData.barnes_noble_url || "",
        amazon_uk_url: "",
        video_trailer_url: "",
        is_featured: false,
        display_order: 999,
      };

      const awardResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/award_winning_books`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify(awardBookData),
        }
      );

      if (submissionResponse.ok && awardResponse.ok) {
        setSubmitStatus("success");
        setStep(4);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSubmitStatus("error");
        setStep(4);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error saving submission:", error);
      setSubmitStatus("error");
      setStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
      formData.about_aurthor &&
      formData.author_name &&
      formData.book_title &&
      formData.genre &&
      formData.genre !== "Select Genre.."
    );
  };

  const validateStep2 = () => {
    return files.book_cover && files.author_image && files.ebook;
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

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Are You a Self-Published or Indie Author?
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
            <p>
              The Africa Laureate Awards exists to recognise quality
              self-published books and give independent authors the recognition
              and visibility their work deserves.
            </p>
          </div>

          <div className="mt-8 bg-gradient-to-r from-[#6B0C22] to-[#4a0818] text-white rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3">
              Ready to Submit Your Book?
            </h3>
            <p className="mb-4 text-gray-200">
              To submit your book, please complete the nomination form below. A
              processing fee of $50.00 applies.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((stepNum) => (
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
                      : stepNum === 3
                      ? "Payment"
                      : "Complete"}
                  </span>
                </div>
                {stepNum < 4 && (
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
                      About Author *
                    </label>
                    <textarea
                      name="about_aurthor"
                      value={formData.about_aurthor}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] focus:border-transparent outline-none resize-none"
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
                      {genre.map((g, index) => (
                        <option value={g} key={index}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Book Description
                    </label>
                    <textarea
                      name="book_description"
                      value={formData.book_description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] focus:border-transparent outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  if (validateStep1()) {
                    setStep(2);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Front Cover Image *
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
                        Click to upload Front Cover
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
                  Author Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#6B0C22] transition-colors">
                  {filePreviews.author_image_preview ? (
                    <div className="relative">
                      <img
                        src={filePreviews.author_image_preview}
                        alt="Author"
                        className="max-w-xs mx-auto h-64 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeFile("author_image")}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block text-center">
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-600 mb-2 font-semibold">
                        Click to upload Author Image
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG or JPG (max 5MB)
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange("author_image", e.target.files[0])
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
                  onClick={() => {
                    setStep(1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (validateStep2()) {
                      setStep(3);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
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
                    <div className="mt-2">NGN ₦20,000</div>
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Secure Payment</p>
                  <p>
                    Your payment is processed securely through{" "}
                    {currency === "USD" ? "Korapay" : "Paystack"}.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setStep(2);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300"
                >
                  Back
                </button>
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1 bg-[#6B0C22] text-white py-3 rounded-lg font-bold hover:bg-[#8B1530] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CreditCard className="w-5 h-5" />
                  {loading
                    ? "Processing..."
                    : `Pay ${currency} ${
                        currency === "USD" ? "$50" : "₦20,000"
                      }`}
                </button>
              </div>
            </div>
          )}

          {step === 4 && submitStatus === "success" && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                🎉 Submission Successful!
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                Thank you for submitting your book to T.A.L.A.
              </p>
              <p className="text-gray-600 mb-8">
                Your book "<strong>{formData.book_title}</strong>" by{" "}
                <strong>{formData.author_name}</strong> has been successfully
                submitted and will be reviewed by our team.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                <h3 className="font-bold text-green-900 mb-3">
                  What happens next?
                </h3>
                <ul className="text-left text-gray-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>You'll receive a confirmation email shortly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      Our team will review your submission within 2-3 weeks
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Your book is now in our awards consideration</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="bg-[#6B0C22] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#8B1530] transition-colors"
              >
                Submit Another Book
              </button>
            </div>
          )}

          {step === 4 && submitStatus === "error" && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <X className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Submission Failed
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                There was an error processing your submission. Please try again
                or contact our support team.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setStep(3)}
                  className="bg-[#6B0C22] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#8B1530] transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
