import React, { useState } from "react";
import {
  Upload,
  BookOpen,
  DollarSign,
  CreditCard,
  Check,
  X,
  AlertCircle,
} from "lucide-react";

const SUPABASE_URL = "https://sunipfnesvzlkcitbhns.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1bmlwZm5lc3Z6bGtjaXRiaG5zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTE2MDA0MCwiZXhwIjoyMDgwNzM2MDQwfQ.h_UMD88A5kTsZfM3JrkU89tMgDfUUrZY1cCEwIuuKtY";
const PAYSTACK_PUBLIC_KEY = "YOUR_PAYSTACK_PUBLIC_KEY"; // Get from paystack.com

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

  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
  });

  const [imagePreviews, setImagePreviews] = useState({
    preview1: "",
    preview2: "",
    preview3: "",
  });

  const [currency, setCurrency] = useState("USD");
  const amount = currency === "USD" ? 50 : 35000; // $50 or ₦35,000

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (imageKey, previewKey, file) => {
    if (file) {
      setImages({ ...images, [imageKey]: file });
      setImagePreviews({
        ...imagePreviews,
        [previewKey]: URL.createObjectURL(file),
      });
    }
  };

  const removeImage = (imageKey, previewKey) => {
    setImages({ ...images, [imageKey]: null });
    setImagePreviews({ ...imagePreviews, [previewKey]: "" });
  };

  const uploadImage = async (file, fileName) => {
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

  const handlePaystackPayment = () => {
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: formData.email,
      amount: amount * 100, // Convert to kobo/cents
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
      // Upload images
      const timestamp = Date.now();
      let imageUrls = {};

      if (images.image1) {
        imageUrls.cover_image_1 = await uploadImage(
          images.image1,
          `${timestamp}_1_${images.image1.name}`
        );
      }
      if (images.image2) {
        imageUrls.cover_image_2 = await uploadImage(
          images.image2,
          `${timestamp}_2_${images.image2.name}`
        );
      }
      if (images.image3) {
        imageUrls.cover_image_3 = await uploadImage(
          images.image3,
          `${timestamp}_3_${images.image3.name}`
        );
      }

      // Save submission to Supabase
      const submissionData = {
        ...formData,
        ...imageUrls,
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
      formData.relationship_to_author
    );
  };

  const validateStep2 = () => {
    return (
      formData.author_name &&
      formData.book_title &&
      formData.genre &&
      (images.image1 || images.image2 || images.image3)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#6B0C22] rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Submit Your Book
          </h1>
          <p className="text-gray-600">
            Complete the form below to submit your book for T.A.L.A. review
          </p>
        </div>

        {/* Progress Steps */}
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
                      ? "Personal Info"
                      : stepNum === 2
                      ? "Book Details"
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

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Personal Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
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

              <button
                onClick={() => validateStep1() && setStep(2)}
                disabled={!validateStep1()}
                className="w-full bg-[#6B0C22] text-white py-3 rounded-lg font-bold hover:bg-[#8B1530] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Book Details
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Book Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
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
                    Pen Name (if applicable)
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

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Book Series (if applicable)
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

              {/* Image Uploads */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Book Cover Images * (Upload at least one)
                </label>
                <div className="grid md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((num) => (
                    <div
                      key={num}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#6B0C22] transition-colors"
                    >
                      {imagePreviews[`preview${num}`] ? (
                        <div className="relative">
                          <img
                            src={imagePreviews[`preview${num}`]}
                            alt={`Preview ${num}`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            onClick={() =>
                              removeImage(`image${num}`, `preview${num}`)
                            }
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer block text-center">
                          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 mb-1">
                            Upload Image {num}
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageChange(
                                `image${num}`,
                                `preview${num}`,
                                e.target.files[0]
                              )
                            }
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  ))}
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
                  className="flex-1 bg-[#6B0C22] text-white py-3 rounded-lg font-bold hover:bg-[#8B1530] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className={`p-4 border-2 rounded-lg font-semibold transition-all ${
                      currency === "USD"
                        ? "border-[#6B0C22] bg-[#6B0C22]/5"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <DollarSign className="w-6 h-6 mx-auto mb-2" />
                    USD $50.00
                  </button>
                  <button
                    onClick={() => setCurrency("NGN")}
                    className={`p-4 border-2 rounded-lg font-semibold transition-all ${
                      currency === "NGN"
                        ? "border-[#6B0C22] bg-[#6B0C22]/5"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <span className="text-2xl">₦</span>
                    <div className="mt-2">NGN ₦35,000</div>
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Secure Payment</p>
                  <p>
                    Your payment is processed securely through Paystack. We
                    never store your card details.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePaystackPayment}
                  disabled={loading}
                  className="flex-1 bg-[#6B0C22] text-white py-3 rounded-lg font-bold hover:bg-[#8B1530] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
                className="bg-[#6B0C22] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#8B1530] transition-colors"
              >
                Submit Another Book
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Load Paystack Script */}
      <script src="https://js.paystack.co/v1/inline.js" />
    </div>
  );
}
