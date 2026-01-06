import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6B0C22] to-[#4a0818] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10 pb-8 border-b-2 border-[#6B0C22]">
            <h1 className="text-4xl md:text-5xl font-bold text-[#6B0C22] mb-3">
              Privacy Policy
            </h1>
            <p className="text-gray-600 text-lg italic">
              The Africa Laureate Awards
            </p>
          </div>

          {/* Scope Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#6B0C22] mb-4">
              Scope of This Privacy Policy
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              This Privacy Policy applies to the website located at{" "}
              <a
                href="https://www.theafricalaureateawards.org"
                className="text-[#6B0C22] font-semibold hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.theafricalaureateawards.org
              </a>{" "}
              (the "Award Website"). It does not apply to any other websites,
              including websites that link to the Award Website or third-party
              websites that may be linked from it. The Africa Laureate Awards
              has no control over the content, policies, or practices of
              third-party websites or their operators.
            </p>
          </section>

          {/* Collection and Use Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#6B0C22] mb-4">
              Collection and Use of Personal Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              The Africa Laureate Awards allows visitors to submit information
              through the Award Website. To provide our services, the website
              includes various forms where you may voluntarily provide personal
              information such as your name, email address, and other relevant
              details when contacting us or submitting a book.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 text-justify">
              We use this information to respond to enquiries, process
              submissions, communicate decisions, and provide services offered
              by The Africa Laureate Awards that may be relevant to you.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">
              As part of our review process, The Africa Laureate Awards may
              provide selected readers with digital copies of submitted books.
              To enable this, authors may be asked to upload an ebook version of
              their work through the website. These ebooks are used strictly for
              evaluation purposes.
            </p>
          </section>

          {/* Disclosure Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#6B0C22] mb-4">
              Disclosure of Personal Information
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              The Africa Laureate Awards does not sell, trade, or disclose the
              personal information of authors, readers, or website visitors to
              third parties. Personal information submitted to us is used solely
              for the purposes outlined in this policy.
            </p>
          </section>

          {/* Governing Laws Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#6B0C22] mb-4">
              Governing Laws and Jurisdiction
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              This Privacy Policy, and The Africa Laureate Awards' collection
              and use of personal information, shall be governed and interpreted
              in accordance with the laws of the Federal Republic of Nigeria and
              the laws of Oyo State. Any disputes arising from this policy shall
              be subject to the jurisdiction of the appropriate courts.
            </p>
          </section>

          {/* Changes Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#6B0C22] mb-4">
              Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              The Africa Laureate Awards reserves the right to update or change
              this Privacy Policy at any time without prior notice. Visitors are
              encouraged to review this page periodically to stay informed of
              any updates.
            </p>
          </section>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-300 text-center">
            <p className="text-gray-600 mb-2">
              &copy; 2025 The Africa Laureate Awards. All rights reserved.
            </p>
            <p className="text-gray-500 italic text-sm">
              Last updated: January 2025
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
