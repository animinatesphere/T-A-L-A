import React, { useEffect, useState } from "react";
import {
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Mail,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function TALARefundPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // defer state update to the next frame to trigger entrance animations
    const raf = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

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
              <DollarSign className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Refund Policy
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Understanding our fair and transparent refund process
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section
        className={`py-16 bg-white transition-all duration-1000 delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              The Africa Laureate Awards is committed to running a fair,
              transparent, and respectful submission process for all authors.
              This Refund Policy explains how processing fees are handled and
              outlines the circumstances under which a refund may be issued.
            </p>
          </div>

          <div className="bg-gradient-to-r from-[#6B0C22] to-[#4a0818] rounded-2xl p-8 text-white">
            <div className="flex items-start gap-4">
              <DollarSign className="w-8 h-8 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-3">Processing Fee</h3>
                <p className="text-gray-200 leading-relaxed">
                  Each book submitted to The Africa Laureate Awards requires a
                  processing fee. This fee supports the administrative work
                  involved in receiving submissions, coordinating readers,
                  managing evaluations, maintaining our digital platforms, and
                  communicating with authors throughout the review process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Eligibility Section */}
      <section
        className={`py-16 bg-gray-50 transition-all duration-1000 delay-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Initial Screening and Refund Eligibility
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                  Every submission first goes through an initial screening
                  stage. This stage is used to confirm that a book meets our
                  minimum eligibility and quality requirements before entering
                  the full review process.
                </p>
                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                  <p className="text-gray-800 leading-relaxed font-semibold mb-2">
                    ✓ Full Refund Issued
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    If a submitted book does not pass this initial screening and
                    is declined at this stage, the processing fee will be
                    refunded in full. The author will be notified by email of
                    the decision, along with confirmation that the refund will
                    be issued.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Non-Refundable Section */}
      <section
        className={`py-16 bg-white transition-all duration-1000 delay-400 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border-2 border-red-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Review Process and Non-Refundable Submissions
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                  Once a book has passed the initial screening stage and entered
                  the review process, the processing fee becomes non-refundable.
                  At this point, time, coordination, and resources have already
                  been committed to the evaluation of the submission, including
                  distribution to readers and internal review handling.
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-800 leading-relaxed font-semibold mb-2">
                        Important Notice
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Submitting a book to The Africa Laureate Awards means
                        the book is being considered for recognition, not that
                        recognition is guaranteed. Participation in the
                        submission process does not automatically result in an
                        award, certification, or promotional feature. All books
                        are assessed based on the same review standards, and
                        only those that meet our criteria are awarded a T.A.L.A.
                        Medallion.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                  <p className="text-gray-800 leading-relaxed font-semibold mb-2">
                    ✗ No Refund
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    For this reason, books that complete the review process but
                    are not awarded a Medallion are not eligible for a refund.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Non-Refundable Circumstances */}
      <section
        className={`py-16 bg-gray-50 transition-all duration-1000 delay-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Additional Non-Refundable Circumstances
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              Refunds will also not be issued in the following situations:
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700 leading-relaxed">
                  If an author chooses to withdraw their submission after it has
                  been submitted
                </p>
              </div>
              <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700 leading-relaxed">
                  If delays or complications arise due to incomplete,
                  inaccurate, or misleading submission information
                </p>
              </div>
              <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700 leading-relaxed">
                  If a submission is found to violate our submission guidelines
                  or Terms of Service after the review process has begun
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Processing */}
      <section
        className={`py-16 bg-white transition-all duration-1000 delay-600 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border-2 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Refund Processing
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  All approved refunds are issued using the original method of
                  payment. While we aim to process refunds promptly, the exact
                  timeframe may depend on the payment provider and banking
                  systems involved. Authors will receive confirmation once a
                  refund has been initiated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Questions Section */}
      <section
        className={`py-16 bg-gray-50 transition-all duration-1000 delay-700 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#6B0C22] to-[#4a0818] rounded-2xl p-8 md:p-12 text-white text-center">
            <Mail className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Questions and Clarifications
            </h2>
            <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              If you have questions about this Refund Policy or believe a refund
              decision has been made in error, you may contact The Africa
              Laureate Awards using the official contact details provided on our
              website. We are committed to addressing genuine concerns and
              providing clear explanations where needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <button className="bg-white text-[#6B0C22] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl hover:scale-105">
                  Contact Support
                </button>
              </Link>
              <Link to="/faq">
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-[#6B0C22] transition-colors shadow-xl hover:scale-105">
                  View FAQ
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      <section
        className={`py-16 bg-white transition-all duration-1000 delay-800 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Quick Summary
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-green-50 rounded-2xl p-8 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <h3 className="text-2xl font-bold text-gray-900">Refundable</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Books declined during initial screening receive a full refund of
                the processing fee.
              </p>
            </div>

            <div className="bg-red-50 rounded-2xl p-8 border-2 border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Non-Refundable
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Books that enter the review process, withdrawals after
                submission, or books not awarded a medallion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Links */}
      <section
        className={`py-12 bg-gray-50 border-t border-gray-200 transition-all duration-1000 delay-900 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a
              href="/terms"
              className="text-gray-600 hover:text-[#6B0C22] font-medium transition-colors"
            >
              Terms of Service
            </a>
            <span className="text-gray-400">•</span>
            <a
              href="/privacy"
              className="text-gray-600 hover:text-[#6B0C22] font-medium transition-colors"
            >
              Privacy Policy
            </a>
            <span className="text-gray-400">•</span>
            <a
              href="/faq"
              className="text-gray-600 hover:text-[#6B0C22] font-medium transition-colors"
            >
              FAQ
            </a>
            <span className="text-gray-400">•</span>
            <a
              href="/contact"
              className="text-gray-600 hover:text-[#6B0C22] font-medium transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
