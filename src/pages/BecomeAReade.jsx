import React, { useState } from "react";
import { BookOpen, CheckCircle, Award } from "lucide-react";

export default function BecomeAReader() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    country: "",
    city: "",
    genres: [],
    readingDevice: "",
    experience: "",
    whyJoin: "",
    agree: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const genres = [
    "Fiction",
    "Non-Fiction",
    "Mystery/Thriller",
    "Romance",
    "Science Fiction",
    "Fantasy",
    "Historical Fiction",
    "Biography/Memoir",
    "Self-Help",
    "Young Adult",
    "Children's Literature",
    "Poetry",
    "Literary Fiction",
    "Adventure",
    "Horror",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGenreToggle = (genre) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.confirmEmail ||
      !formData.country ||
      !formData.city ||
      formData.genres.length === 0 ||
      !formData.readingDevice ||
      !formData.experience ||
      !formData.whyJoin ||
      !formData.agree
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Email matching validation
    if (formData.email !== formData.confirmEmail) {
      alert("Email addresses do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: "7ad34e05-087f-49d6-b593-0a57134ddf96", // Replace with your Web3Forms access key
          subject: "New Reader Application - TALA",
          from_name: `${formData.firstName} ${formData.lastName}`,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          country: formData.country,
          city: formData.city,
          genres: formData.genres.join(", "),
          reading_device: formData.readingDevice,
          experience: formData.experience,
          why_join: formData.whyJoin,
          agreement: formData.agree ? "Yes" : "No",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        alert(
          "There was an error submitting your application. Please try again."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "There was an error submitting your application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-red-900 to-red-950 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <CheckCircle className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Application Submitted!
            </h1>
            <p className="text-xl text-gray-200">
              Thank you for your interest in joining our readers' team.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What happens next?
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We review applications promptly and will get back to you as soon
              as possible. If your application is approved, you'll receive an
              email with further instructions on how to access books and submit
              your reviews.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-red-900 hover:bg-red-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Submit Another Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-900 to-red-950 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <BookOpen className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Become a Reader
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Join The Africa Laureate Awards global readers' team
            </p>
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 mb-8">
          <h2 className="text-3xl font-bold text-red-900 mb-6">
            Do you love to read?
          </h2>

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p>
              If you enjoy reading and sharing thoughtful opinions on books, we
              invite you to join The Africa Laureate Awards global readers'
              team. As a reader, you'll tell us a bit about yourself and the
              kinds of books you enjoy, then receive digital copies of selected
              self-published titles to read and review.
            </p>

            <p>
              Your evaluation will be considered alongside feedback from other
              readers who assess the same book. Together, these reviews help us
              decide whether a title qualifies for a T.A.L.A. Medallion.
            </p>
          </div>

          {/* Requirements */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-red-900" />
              Requirements
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-red-900 font-bold">•</span>
                <span>Be at least 18 years old</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-900 font-bold">•</span>
                <span>Have completed secondary school</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-900 font-bold">•</span>
                <span>
                  Have access to an ebook reader, or the ability to read ebooks
                  on your computer or mobile device
                </span>
              </li>
            </ul>
          </div>

          <p className="mt-6 text-gray-700">
            If you meet these requirements and are interested in joining, please
            complete the application form below. We review applications promptly
            and will get back to you as soon as possible.
          </p>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold text-red-900 mb-8">
            Application Form
          </h2>

          <div className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                Personal Information
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Email Address *
                  </label>
                  <input
                    type="email"
                    name="confirmEmail"
                    value={formData.confirmEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Reading Preferences */}
            <div className="space-y-6 pt-6">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                Reading Preferences
              </h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  What genres do you enjoy reading? (Select all that apply) *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {genres.map((genre) => (
                    <label
                      key={genre}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.genres.includes(genre)}
                        onChange={() => handleGenreToggle(genre)}
                        className="w-4 h-4 text-red-900 border-gray-300 rounded focus:ring-red-900"
                      />
                      <span className="text-sm text-gray-700">{genre}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  What device(s) do you use to read ebooks? *
                </label>
                <select
                  name="readingDevice"
                  value={formData.readingDevice}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none bg-white"
                >
                  <option value="">Select a device</option>
                  <option value="kindle">Kindle</option>
                  <option value="ipad">iPad/Tablet</option>
                  <option value="computer">Computer</option>
                  <option value="smartphone">Smartphone</option>
                  <option value="multiple">Multiple devices</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Do you have experience reviewing or critiquing books? *
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Please describe any relevant experience, including blog reviews, Goodreads reviews, book clubs, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Why do you want to join The Africa Laureate Awards readers'
                  team? *
                </label>
                <textarea
                  name="whyJoin"
                  value={formData.whyJoin}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell us what motivates you to become a reader for TALA..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>

            {/* Agreement */}
            <div className="pt-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="w-5 h-5 text-red-900 border-gray-300 rounded focus:ring-red-900 mt-1"
                />
                <span className="text-sm text-gray-700">
                  I confirm that I am at least 18 years old, have completed
                  secondary school, and have the ability to read and review
                  ebooks. I understand that my reviews will be used to help
                  determine T.A.L.A. Medallion qualifications. *
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-red-900 hover:bg-red-800 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-red-900 mb-4 flex items-center gap-2">
            <Award className="w-7 h-7" />
            What You'll Receive
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-red-900 mt-1 flex-shrink-0" />
              <span>
                Free access to selected self-published books in digital format
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-red-900 mt-1 flex-shrink-0" />
              <span>
                The opportunity to discover new authors and diverse stories
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-red-900 mt-1 flex-shrink-0" />
              <span>
                A chance to contribute to recognizing literary excellence
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-red-900 mt-1 flex-shrink-0" />
              <span>Recognition as part of our global readers' community</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
