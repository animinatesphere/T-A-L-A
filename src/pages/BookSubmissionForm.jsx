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

const API_URL = "/api";

const PAYSTACK_PUBLIC_KEY = "pk_live_6560af0a81f50cfdd244e08bf2e54169a3e434e9";
// Add Flutterwave public key at the top with other constants
const FLUTTERWAVE_PUBLIC_KEY = "FLWPUBK-454bd6769e18e2102daaf9a567da00b3-X";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
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
    "Poetry",
    "Graphic Novel",
    "Best Biography Book",
    "Best Autobiography or Memoir – Public Life & Influence",
    "Best Autobiography or Memoir – Family & Identity",
    "Best Autobiography or Memoir – Personal Struggle & Recovery",
    "Best Multicultural Non-Fiction Book",
    "Best LGBTQ+ Non-Fiction Book",
    "Best Juvenile & Young Adult Non-Fiction Book",
    "Best Book Series – Fiction",
    "Best Book Series – Non-Fiction",
    "Best Cover Design – Fiction",
    "Best Cover Design – Non-Fiction",
    "Best Audiobook Narration – Fiction",
    "Best Audiobook Narration – Mystery / Thriller",
    "Best Audiobook Narration – Non-Fiction",
    "Best Juvenile Fiction Book",
    "Best Young Adult Fiction Book – General",
    "Best Young Adult Fiction Book – Fantasy",
    "Best Novella or Short Fiction Book",
    "Best Short Story Collection",

    "Best Poetry Collection",
    "Best Themed Poetry Collection",
    "Best Anthology Book",
    "Best Romance Book",
    "Best Thriller Book",
    "Best Suspense / Thriller Book",
    "Best Mystery Book",
    "Best Historical Fiction Book",
    "Best Fantasy Book",
    "Best Science Fiction Book",
    "Best Horror Book",
    "Best Military & Wartime Fiction Book",
    "Best Faith-Based Fiction Book",
    "Best Visionary & New Age Fiction Book",
    "Best Humor Book",
    "Best Erotica Book",
    "Best LGBTQ+ Fiction Book",
    "Best Multicultural Fiction Book",
    "Best Author of the Year",
    "Best Literary Fiction Book",
    "Best Popular Fiction Book",
    "Best Debut Novel",
    "Best First Book – Fiction",
    "Best First Book – Non-Fiction",
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

  // useEffect(() => {
  //   const paystackScript = document.createElement("script");
  //   paystackScript.src = "https://js.paystack.co/v1/inline.js";
  //   paystackScript.async = true;
  //   document.body.appendChild(paystackScript);

  //   const korapayScript = document.createElement("script");
  //   korapayScript.src =
  //     "https://korablobstorage.blob.core.windows.net/modal-bucket/korapay-collections.min.js";
  //   korapayScript.async = true;
  //   document.body.appendChild(korapayScript);

  //   return () => {
  //     document.body.removeChild(paystackScript);
  //     document.body.removeChild(korapayScript);
  //   };
  // }, []);
  // Update the useEffect to load Flutterwave script
  useEffect(() => {
    const paystackScript = document.createElement("script");
    paystackScript.src = "https://js.paystack.co/v1/inline.js";
    paystackScript.async = true;
    document.body.appendChild(paystackScript);

    const flutterwaveScript = document.createElement("script");
    flutterwaveScript.src = "https://checkout.flutterwave.com/v3.js";
    flutterwaveScript.async = true;
    document.body.appendChild(flutterwaveScript);

    return () => {
      document.body.removeChild(paystackScript);
      document.body.removeChild(flutterwaveScript);
    };
  }, []);
  const handleFileChange = (fileType, file) => {
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert("File size should be less than 100MB");
        return;
      }
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
      // URL encode the filename to handle spaces and special characters
      const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");

      const arrayBuffer = await file.arrayBuffer();

      console.log(`Uploading to bucket: ${bucket}, file: ${sanitizedFileName}`);

      const response = await fetch(
        `${SUPABASE_URL}/storage/v1/object/${bucket}/${sanitizedFileName}`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": file.type || "application/octet-stream",
          },
          body: arrayBuffer,
        },
      );

      const result = await response.json();

      if (response.ok) {
        console.log("Upload successful:", result);
        // Return URL-encoded path
        return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${encodeURIComponent(
          sanitizedFileName,
        )}`;
      } else {
        console.error("Upload failed:", result);
        alert(`Upload failed for ${bucket}: ${result.message || result.error}`);
        return null;
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(`Error uploading file: ${error.message}`);
      return null;
    }
  };
  // Replace handleKorapayPayment with this Flutterwave function
  const handleFlutterwavePayment = () => {
    const modal = window.FlutterwaveCheckout({
      public_key: FLUTTERWAVE_PUBLIC_KEY,
      tx_ref: "TALA_" + Math.floor(Math.random() * 1000000000 + 1),
      amount: 1,
      currency: "USD",
      payment_options: "card,ussd,banktransfer",
      customer: {
        email: formData.email,
        name: `${formData.first_name} ${formData.last_name}`,
      },
      customizations: {
        title: "T.A.L.A. Book Submission",
        description: "Book submission processing fee",
        logo: "https://your-logo-url.com/logo.png", // Optional: Add your logo URL
      },
      callback: function (data) {
        console.log("Payment successful:", data);
        if (data.status === "successful") {
          saveSubmission(data.tx_ref);
        }
        modal.close();
      },
      onclose: function () {
        console.log("Payment window closed");
      },
    });
  };

  const handlePaystackPayment = () => {
    if (!window.PaystackPop) {
      alert("Payment system is still loading. Please wait a moment and try again.");
      return;
    }

    if (!PAYSTACK_PUBLIC_KEY) {
      alert("Payment system configuration error. Please contact support.");
      return;
    }

    if (!formData.email || !formData.email.includes("@")) {
      alert("Please provide a valid email address before proceeding to payment.");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: formData.email.trim(),
      amount: 10000, // 20,000 Naira in kobo
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
      handleFlutterwavePayment();
    } else {
      handlePaystackPayment();
    }
  };

  // const handlePayment = () => {
  //   // Comment out payment functions for testing
  //   // if (currency === "USD") {
  //   //   handleFlutterwavePayment();
  //   // } else {
  //   //   handlePaystackPayment();
  //   // }

  //   // Directly call saveSubmission with a test reference for testing
  //   saveSubmission("TEST_" + Math.floor(Math.random() * 1000000000 + 1));
  // };

  // const generateAuthorSlug = (name) => {
  //   return name
  //     .toLowerCase()
  //     .replace(/[^a-z0-9]+/g, "-")
  //     .replace(/(^-|-$)/g, "");
  // };
  // Add this function before saveSubmission
  const sendEmailNotification = async (submissionData, fileUrls) => {
    try {
      const formData = new FormData();

      // Web3Forms API key
      formData.append("access_key", "7ad34e05-087f-49d6-b593-0a57134ddf96");

      // Email details
      formData.append(
        "subject",
        `New Book Submission: ${submissionData.book_title}`,
      );
      formData.append("from_name", "T.A.L.A. Submission System");

      // Clean Plain Text email body
      const emailBody = `
🌟 NEW BOOK SUBMISSION RECEIVED 🌟

-----------------------------------------
SUBMITTER INFORMATION
-----------------------------------------
- Name: ${submissionData.first_name} ${submissionData.last_name}
- Email: ${submissionData.email}
- Relationship to Author: ${submissionData.relationship_to_author}

-----------------------------------------
AUTHOR INFORMATION
-----------------------------------------
- Author Name: ${submissionData.author_name}
- Pen Name: ${submissionData.pen_name || "N/A"}
- About Author: ${submissionData.about_aurthor}

-----------------------------------------
BOOK DETAILS
-----------------------------------------
- Title: ${submissionData.book_title}
- Subtitle: ${submissionData.subtitle || "N/A"}
- Genre: ${submissionData.genre}
- Book Series: ${submissionData.book_series || "N/A"}
- Date of Publication: ${submissionData.date_of_publication || "N/A"}
- Description: ${submissionData.book_description || "N/A"}

-----------------------------------------
UPLOADED FILES (Click to View/Download)
-----------------------------------------
- Book Cover: ${fileUrls.cover_image_url || "Not uploaded"}
- Author Image: ${fileUrls.author_image_url || "Not uploaded"}
- About Book PDF: ${fileUrls.about_book_pdf_url || "Not uploaded"}
- eBook: ${fileUrls.ebook_url || "Not uploaded"}

-----------------------------------------
PAYMENT & STATUS
-----------------------------------------
- Amount: ${submissionData.payment_currency} ${submissionData.payment_amount}
- Reference: ${submissionData.payment_reference}
- Status: ${submissionData.payment_status}

-----------------------------------------
Review this submission in your Admin Dashboard:
https://www.theafricalaureateawards.org/Tala-admin
`;

      formData.append("message", emailBody);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        console.log("Email notification sent successfully");
      } else {
        console.error("Failed to send email notification");
      }
    } catch (error) {
      console.error("Error sending email notification:", error);
    }
  };

  const saveSubmission = async (paymentReference) => {
    setLoading(true);

    try {
      const submissionData = new FormData();

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        submissionData.append(key, formData[key]);
      });

      // Add files
      if (files.book_cover) submissionData.append("book_cover", files.book_cover);
      if (files.author_image)
        submissionData.append("author_image", files.author_image);
      if (files.about_book_pdf)
        submissionData.append("about_book_pdf", files.about_book_pdf);
      if (files.ebook) submissionData.append("ebook", files.ebook);

      // Add payment info
      submissionData.append("payment_status", "completed");
      submissionData.append("payment_amount", amount);
      submissionData.append("payment_currency", currency);
      submissionData.append("payment_reference", paymentReference);
      submissionData.append("submission_status", "pending");

      const submissionResponse = await fetch(`${API_URL}/submissions`, {
        method: "POST",
        body: submissionData,
      });

      if (submissionResponse.ok) {
        const result = await submissionResponse.json();
        
        // Construct full URLs for the email since backend returns relative paths
        const baseUrl = window.location.origin;
        const fileUrls = {
          cover_image_url: result.data.cover_image_url ? `${baseUrl}${result.data.cover_image_url}` : null,
          author_image_url: result.data.author_image_url ? `${baseUrl}${result.data.author_image_url}` : null,
          about_book_pdf_url: result.data.about_book_pdf_url ? `${baseUrl}${result.data.about_book_pdf_url}` : null,
          ebook_url: result.data.ebook_url ? `${baseUrl}${result.data.ebook_url}` : null,
        };

        // Send email notification
        await sendEmailNotification(result.data, fileUrls);

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

          <div className="mt-8 bg-linear-to-r from-[#6B0C22] to-[#4a0818] text-white rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3">
              Ready to Submit Your Book?
            </h3>
            <p className="mb-4 text-gray-200">
              To submit your book, please complete the nomination form below. A
              processing fee of $50.00 applies for authors living outside of
              Nigeria and N20,000 for authors based in Nigeria
            </p>
          </div>
          {/* <div className="mt-8 bg-gradient-to-r from-[#6B0C22] to-[#4a0818] text-white rounded-xl p-6">
            <h3 className="text-xl font-bold ">Note</h3>
            <p className="mb-4 text-gray-200">
              <br />
              when you submit your book details and payment please make sure you
              wait until the submission is complete before navigating away from
              the page.
            </p>
          </div> */}
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
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Social Media Links (Optional)
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      name="facebook_url"
                      value={formData.facebook_url}
                      onChange={handleChange}
                      placeholder="https://facebook.com/yourpage"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      name="instagram_url"
                      value={formData.instagram_url}
                      onChange={handleChange}
                      placeholder="https://instagram.com/yourprofile"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Twitter URL
                    </label>
                    <input
                      type="url"
                      name="twitter_url"
                      value={formData.twitter_url}
                      onChange={handleChange}
                      placeholder="https://twitter.com/yourhandle"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Threads URL
                    </label>
                    <input
                      type="url"
                      name="threads_url"
                      value={formData.threads_url}
                      onChange={handleChange}
                      placeholder="https://threads.net/@yourhandle"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] focus:border-transparent outline-none"
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
                        PNG or JPG (max 100mb)
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
                        PNG or JPG (max 100mb)
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
                        EPUB, MOBI, or PDF (max 100mb)
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
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
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
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Secure Payment</p>
                  <p>
                    Your payment is processed securely through{" "}
                    {currency === "USD" ? "flutterwave" : "Paystack"}.
                  </p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Payment Currency Notice</p>
                  <p>
                    Authors based in Nigeria are required to complete payment
                    using the Nigerian Naira (NGN) Option.Authors based outside
                    Nigeria should complete payment using the US Dollar (USD)
                    option
                    <br />
                    Please select the appropriate currency at checkout to avoid
                    payment issues or delays in processing your submission.
                  </p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Note</p>
                  <p>
                    when you submit your book details and payment please make
                    sure you wait until the submission is complete before
                    navigating away from the page.
                  </p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Note</p>
                  <p>
                    if you are paying from U.S , your bank may require you to
                    approve this international transaction
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
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span>You'll receive a confirmation email shortly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span>
                      Our team will review your submission within 2-3 weeks
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
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
