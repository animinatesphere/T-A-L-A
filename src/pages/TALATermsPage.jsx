import React, { useEffect, useState } from "react";
import {
  Shield,
  FileText,
  Award,
  AlertCircle,
  Lock,
  XCircle,
} from "lucide-react";

export default function TALATermsPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // defer state update to the next frame to trigger entrance animations
    const raf = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  const sections = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "1. Acceptance of Terms",
      content: [
        'By accessing or using the website located at www.theafricalaureateawards.org (the "Website"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you should not use the Website or its services.',
        "These Terms apply to all visitors, authors, readers, contributors, and any other users who access or interact with The Africa Laureate Awards through the Website.",
      ],
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "2. T.A.L.A. Medallion Certification",
      content: [
        "The Africa Laureate Awards (T.A.L.A) medallion is a certification mark owned and administered exclusively by The Africa Laureate Awards. It is awarded to self-published books that have successfully met the organisation's review and evaluation standards.",
        "The Medallion may only be used by authors whose books have been officially awarded a T.A.L.A. Medallion and only in connection with the specific book that was recognised. Approved use includes placement on book covers, promotional materials, and marketing content related to the awarded title.",
        "Any unauthorised use, alteration, misrepresentation, or application of the T.A.L.A. Medallion to books that have not been awarded certification is strictly prohibited and may result in withdrawal of recognition, public disqualification, and legal action where necessary.",
        "The Africa Laureate Awards reserves the right to revoke a Medallion if it is later discovered that an awarded work violates submission guidelines or these Terms.",
      ],
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "3. Intellectual Property and Usage Restrictions",
      content: [
        "All content on the Website, including but not limited to text, logos, trademarks, graphics, badges, certificates, podcast content, and digital materials, is the property of The Africa Laureate Awards unless otherwise stated.",
        "The name The Africa Laureate Awards, the T.A.L.A. logos, and the T.A.L.A. Medallions are protected intellectual property. No part of this intellectual property may be copied, reproduced, distributed, modified, or used for commercial purposes without prior written permission from the management of The Africa Laureate Awards.",
        "Authors retain full ownership of their submitted works. Submission of a book does not transfer copyright to The Africa Laureate Awards. However, by submitting a book, authors grant The Africa Laureate Awards permission to reference the book title, cover image, synopsis, and author information for evaluation, promotional, editorial, and archival purposes.",
      ],
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "4. Use of Website Content",
      content: [
        "The Website and its contents are provided for informational and professional use related to The Africa Laureate Awards. Users may view, download, and print content for personal, non-commercial purposes only.",
        "You may not use the Website in any way that could damage, disable, or interfere with its operation or attempt to gain unauthorised access to any part of the Website. Automated data scraping, duplication of content, or misuse of materials for misleading or fraudulent purposes is prohibited.",
        "The Africa Laureate Awards reserves the right to restrict or terminate access to the Website for users who violate these Terms or misuse the Website or its content.",
      ],
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "5. Submission and Refund Terms",
      content: [
        "By submitting a book to The Africa Laureate Awards, authors confirm that they hold the necessary rights to submit the work and that all information provided during submission is accurate and complete.",
        "A processing fee is required for each submission. This fee covers administrative costs, review coordination, and related operational expenses. Processing fees are non-refundable once a book has passed the initial screening stage and entered the review process.",
        "If a submission is declined during the initial screening stage for not meeting minimum standards, the processing fee will be refunded in full. Refunds will not be issued for withdrawals made by the author after submission or for books that are reviewed but not awarded a T.A.L.A. Medallion.",
        "The Africa Laureate Awards reserves the right to reject submissions that violate submission guidelines, misrepresent authorship or rights, or breach these Terms of Service.",
      ],
    },
    {
      icon: <XCircle className="w-6 h-6" />,
      title: "6. Limitation of Liability",
      content: [
        'The Africa Laureate Awards provides its Website and services on an "as is" and "as available" basis. While we make reasonable efforts to ensure accuracy, reliability, and continuity, we do not guarantee that the Website or any content will be error-free, uninterrupted, or free from technical issues.',
        "To the fullest extent permitted by law, The Africa Laureate Awards shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from the use of, or inability to use, the Website or its services.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className={`bg-gradient-to-br from-[#6B0C22] to-[#4a0818] text-white py-20 md:py-32 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
              <Shield className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Please read these terms carefully before using The Africa Laureate
              Awards services
            </p>
          </div>
        </div>
      </section>

      {/* Last Updated */}
      <section
        className={`py-8 bg-white border-b border-gray-200 transition-all duration-1000 delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">Last Updated: January 2026</p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-md p-8 transition-all duration-500 hover:shadow-lg ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-10"
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#6B0C22] rounded-lg flex items-center justify-center text-white">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 flex-1">
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-4 ml-16">
                  {section.content.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="text-gray-700 leading-relaxed text-lg"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section
        className={`py-16 md:py-24 bg-white transition-all duration-1000 delay-800 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#6B0C22] to-[#4a0818] rounded-2xl p-8 md:p-12 text-white">
            <div className="flex items-start gap-4 mb-6">
              <AlertCircle className="w-8 h-8 flex-shrink-0" />
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Important Notice
                </h2>
                <p className="text-lg text-gray-200 leading-relaxed mb-4">
                  By using The Africa Laureate Awards website and services, you
                  acknowledge that you have read, understood, and agree to be
                  bound by these Terms of Service.
                </p>
                <p className="text-lg text-gray-200 leading-relaxed">
                  If you have any questions about these terms, please contact us
                  before using our services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        className={`py-16 md:py-24 bg-gray-50 transition-all duration-1000 delay-900 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Questions About Our Terms?
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              If you need clarification on any of these terms or have concerns
              about your submission, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-[#6B0C22] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#8B1530] transition-colors inline-flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Contact Us
              </a>
              <a
                href="/faq"
                className="border-2 border-[#6B0C22] text-[#6B0C22] px-8 py-4 rounded-lg font-bold hover:bg-[#6B0C22] hover:text-white transition-colors inline-flex items-center justify-center gap-2"
              >
                <AlertCircle className="w-5 h-5" />
                View FAQ
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section
        className={`py-12 bg-white border-t border-gray-200 transition-all duration-1000 delay-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a
              href="/privacy"
              className="text-gray-600 hover:text-[#6B0C22] font-medium transition-colors"
            >
              Privacy Policy
            </a>
            <span className="text-gray-400">•</span>
            <a
              href="/about"
              className="text-gray-600 hover:text-[#6B0C22] font-medium transition-colors"
            >
              About T.A.L.A.
            </a>
            <span className="text-gray-400">•</span>
            <a
              href="/submit-your-book"
              className="text-gray-600 hover:text-[#6B0C22] font-medium transition-colors"
            >
              Submit Your Book
            </a>
            <span className="text-gray-400">•</span>
            <a
              href="/contact"
              className="text-gray-600 hover:text-[#6B0C22] font-medium transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
