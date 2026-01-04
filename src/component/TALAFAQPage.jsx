import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  Award,
  Clock,
  DollarSign,
  Mail,
  CheckCircle,
  BookOpen,
  Users,
} from "lucide-react";

export default function TALAFAQPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    // defer state update to the next frame to trigger entrance animations
    const raf = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      icon: <HelpCircle className="w-6 h-6" />,
      question: "What is The Africa Laureate Awards?",
      answer:
        "The Africa Laureate Awards (T.A.L.A.) is a literary awards platform focused on recognising outstanding self-published books. We evaluate independently published works through a reader-led review process and honour titles that meet our standards of quality and originality. Our mission is to give credible recognition to self-published authors and help their work reach a wider audience.",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      question: "How do I submit my book?",
      answer:
        "You can submit your book by filling out the nomination form available on the Submit Your Book page of our website.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      question: "Who can enter The Africa Laureate Awards?",
      answer:
        "Any independent author, editor, illustrator, publisher or self-published author from around the world can enter books published within the eligible date range. Visit our submission guidelines for more information.",
    },
    {
      icon: <HelpCircle className="w-6 h-6" />,
      question: "Will my personal information be shared with anyone?",
      answer:
        "We take great care to protect the privacy of authors who nominate their books for our consideration. For further details, please refer to our website's Privacy Policy page for how we handle all personal and non-personal information.",
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      question: "What does the $50.00 fee cover?",
      answer:
        "The $50.00 processing fee covers the full review and recognition process, including:\n\n• An author spotlight interview on the T.A.L.A. podcast, distributed to Spotify, Apple Podcasts, and other major streaming platforms\n\n• A dedicated promotional post on our verified Instagram and Facebook pages, with paid advertising run to reach the author's target audience\n\n• A gold, silver, or bronze T.A.L.A. medallion for use on the book's front cover\n\n• A dedicated book and author page on the T.A.L.A. website\n\n• Editorial feedback and book reviews published on our blog and newsletter\n\n• The ongoing maintenance and operation of the T.A.L.A. website and platforms\n\nThis fee supports both the evaluation of submissions and the promotion of awarded books.",
    },
    {
      icon: <Award className="w-6 h-6" />,
      question: "What do winners receive?",
      answer:
        "As a T.A.L.A award winner, you will receive a shiny gold, silver or bronze medal, along with a beautiful certificate and foil seals to showcase your achievement. In addition to that, your book will get a whole year of promotion through The Africa Laureate Award website and our social media pages, helping you reach new readers.\n\nWinning a T.A.L.A can boost your credibility, leading to increased sales and media opportunities. You'll also join a fantastic community of fellow award-winning authors and publishers, opening doors for networking and collaboration.",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      question: "How will my book be judged?",
      answer:
        "Please visit the 'About Us/Mode of Operation' page of our website for more information.",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      question: "Can I submit my book before its publication date?",
      answer:
        "Yes! We accept Advanced Reader's Copy (ARC) of any book set in the same year that the award takes place.",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      question:
        "How will I be notified after you have made a decision on my book?",
      answer:
        "After a decision is made, the author will be notified by email accordingly. This notification will include a summary report showing the ratings that were used to make the final decision (see sample report). This decision is final and no feedback will be provided beyond the decision and summary report.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      question: "How long will it take to get a decision?",
      answer:
        "Due to our commitment to give each book the recognition it deserves, our review process may take up to four weeks. However, our target is to complete it within two weeks.",
    },
    {
      icon: <Award className="w-6 h-6" />,
      question:
        "How can winning The Africa Laureate Award benefit me as an author?",
      answer:
        "Winning The Africa Laureate Award is an incredible opportunity that attracts a lot of benefits. Not only do you gain recognition in the writing and publishing community, but you also boost your credibility, making your book stand out in a competitive market.\n\nIn addition, you will enjoy exclusive promotional opportunities, including features on The Africa Laureate Award website and social media, which can help you connect with new readers and increase your book sales.",
    },
    {
      icon: <HelpCircle className="w-6 h-6" />,
      question:
        "If my book is awarded a T.A.L.A. medallion, does it apply to other books I have written?",
      answer:
        "The Africa Laureate Awards only applies to the specific book that was submitted for the award. An author is welcomed to submit more than one book.",
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      question:
        "If my book is not awarded a T.A.L.A medallion, will I get my fee back?",
      answer:
        "If your book does not pass the initial screening process, the processing fee will be refunded in full.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      question: "Can I nominate a book written by someone else?",
      answer:
        "We only consider books that are written by the author or their designated representative (e.g agent, publicist, family member).",
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
              <HelpCircle className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Find answers to common questions about The Africa Laureate Awards
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section
        className={`py-12 bg-white border-b border-gray-200 transition-all duration-1000 delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#6B0C22] rounded-lg mb-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-[#6B0C22] mb-1">
                2-4
              </div>
              <div className="text-sm text-gray-600">Weeks Review</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#6B0C22] rounded-lg mb-3">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-[#6B0C22] mb-1">
                $50
              </div>
              <div className="text-sm text-gray-600">Processing Fee</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#6B0C22] rounded-lg mb-3">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-[#6B0C22] mb-1">
                3
              </div>
              <div className="text-sm text-gray-600">Medal Types</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#6B0C22] rounded-lg mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-[#6B0C22] mb-1">
                Global
              </div>
              <div className="text-sm text-gray-600">Submissions</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-lg ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-10"
                }`}
                style={{ transitionDelay: `${300 + index * 50}ms` }}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#6B0C22] rounded-lg flex items-center justify-center text-white">
                      {faq.icon}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 flex-1 pr-4">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-6 h-6 text-[#6B0C22] flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    openIndex === index
                      ? "max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 md:px-8 pb-6 pl-20 md:pl-24">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section
        className={`py-16 md:py-24 bg-white transition-all duration-1000 delay-500 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-[#6B0C22] to-[#4a0818] rounded-2xl p-8 md:p-12 text-white">
            <Mail className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Still Have Questions?
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our team is here to help
              you with any inquiries about The Africa Laureate Awards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-[#6B0C22] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:scale-105">
                Contact Support
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-[#6B0C22] transition-all duration-300 shadow-lg hover:scale-105">
                Submit Your Book
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section
        className={`py-16 md:py-24 bg-gray-50 transition-all duration-1000 delay-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Additional Resources
            </h2>
            <p className="text-lg text-gray-600">
              Learn more about The Africa Laureate Awards
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#6B0C22] rounded-full mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">About Us</h3>
              <p className="text-gray-600 mb-4">
                Learn about our mission and how we evaluate books
              </p>
              <a
                href="/about"
                className="text-[#6B0C22] font-semibold hover:underline"
              >
                Read More →
              </a>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#6B0C22] rounded-full mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Submit Your Book
              </h3>
              <p className="text-gray-600 mb-4">
                Ready to get your book recognized? Start here
              </p>
              <a
                href="/submit"
                className="text-[#6B0C22] font-semibold hover:underline"
              >
                Submit Now →
              </a>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#6B0C22] rounded-full mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Become a Reader
              </h3>
              <p className="text-gray-600 mb-4">
                Join our community of literary evaluators
              </p>
              <a
                href="/reader"
                className="text-[#6B0C22] font-semibold hover:underline"
              >
                Learn More →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
