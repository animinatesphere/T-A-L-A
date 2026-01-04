import React, { useEffect, useState } from "react";

import {
  Award,
  Users,
  BookOpen,
  Target,
  CheckCircle,
  Clock,
  Mail,
  Star,
  Globe,
  ArrowBigDown,
} from "lucide-react";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // defer state update to the next frame to trigger entrance animations
    const raf = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const benefits = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Author Spotlight Podcast Interview",
      description:
        "A featured interview on the T.A.L.A. podcast, focusing on the awarded book and the author's writing journey. The episode will be published on Spotify, Apple Podcasts, and other major streaming platforms.",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Social Media Promotion",
      description:
        "A dedicated promotional post on our verified Instagram and Facebook pages highlighting the awarded book and the author's brand. Each post is advertised, and we work closely with authors to identify and reach their target audience.",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Official T.A.L.A. Medallion",
      description:
        "A gold, silver, or bronze T.A.L.A. medallion issued for use on the front cover of the awarded book as a mark of recognition.",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Dedicated Website Feature",
      description:
        "A permanent book and author page on the T.A.L.A. website, featuring the book synopsis, author biography, and relevant contact details.",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Reviews and Editorial Coverage",
      description:
        "Publication of feedback, book reviews, and related editorial content on our blog and newsletter.",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Platform Maintenance and Operations",
      description:
        "Contribution toward the ongoing maintenance, hosting, and technical operation of the T.A.L.A. website and digital platforms.",
    },
  ];

  const processSteps = [
    {
      number: "01",
      title: "Submit Your Book",
      description:
        "All self-published authors are invited to nominate their digital books (ebooks) through our website. This requires the payment of a processing fee of $50.00 payable through Paystack payment gateway.",
    },
    {
      number: "02",
      title: "Initial Screening",
      description:
        "Each submission first undergoes an initial screening to confirm that the work meets our minimum standards for quality, originality, and content. This preliminary review may include an assessment of sample chapters available through online retailers such as Amazon or other digital booksellers, as well as selected portions of the submitted ebook.",
    },
    {
      number: "03",
      title: "Reader Review",
      description:
        "Books are reviewed by our growing network of readers made up of individuals and book club members based in Nigeria and six other countries around the world. This approach allows books to be read and assessed from different perspectives rather than from a single viewpoint.",
    },
    {
      number: "04",
      title: "Final Decision",
      description:
        "Once a final decision has been made on whether a book will receive a T.A.L.A. Medallion, the author will be notified by email. This notification will include a summary report outlining the ratings used in reaching the final decision.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className={`relative bg-cover bg-center text-white py-20 md:py-32 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
        style={{
          backgroundImage: `url(${`https://images.unsplash.com/photo-1755545730104-3cb4545282b1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d3JpdHRlciUyMGJvb2t8ZW58MHx8MHx8fDA%3D`})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#6B0C22]/90 to-[#4a0818]/65" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Who We Are
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
              Recognising and supporting quality self-published books and
              independent authors
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section
        className={`py-16 md:py-24 bg-white transition-all duration-1000 delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed mb-6">
              The Africa Laureate Awards (T.A.L.A.) is a literary award
              organisation established to recognise and support quality
              self-published books and independent authors. It is owned and
              operated by Ayodeji Ajagbe and Oluwaferanmi Adeyemi, two friends
              brought together by a mutual interest in books and a clear belief
              that independently published authors deserve global recognition
              for their work and services to humanity.
            </p>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed mb-6">
              T.A.L.A. focuses specifically on self-published books, with the
              aim of spotlighting books that show strong storytelling,
              originality, and professional publication standards. To achieve
              this, the awards draw on a growing network of readers made up of
              individuals and book club members based in Nigeria and six other
              countries around the world. This approach allows books to be read
              and assessed from different perspectives rather than from a single
              viewpoint.
            </p>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed">
              The name The Africa Laureate Awards and all T.A.L.A. logos are
              registered trademarks of the organisation. The T.A.L.A. Medallion
              is also a registered certification trademark, owned and
              administered solely by The Africa Laureate Awards. It is awarded
              only to self-published books that meet the organisation's
              selection standards and serves as a mark of distinction for
              recognised titles.
            </p>
          </div>
        </div>
      </section>

      {/* Why We Exist */}
      <section
        className={`py-16 md:py-24 bg-[#6B0C22] text-white transition-all duration-1000 delay-300 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{
          backgroundImage: `url(${`https://plus.unsplash.com/premium_photo-1667251760504-096946b820af?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8b3JhbmdlJTIwYm9va3xlbnwwfHwwfHx8MA%3D%3D`})`,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 ws">
              Why We Exist
            </h2>
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              The Africa Laureate Awards was established to bring credibility,
              visibility, and structure to the recognition of self-published
              books, while creating a platform that values good writing and
              takes independent authors seriously.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section
        className={`py-16 md:py-24 bg-gray-50 transition-all duration-1000 delay-400 ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#6B0C22] rounded-full mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed text-center">
              Our mission is to discover talented self-published authors and
              help them give their work the attention and recognition it
              deserves. Our primary focus is fiction across a wide range of
              genres; however, we selectively consider non-fiction books as
              well.
            </p>
          </div>
        </div>
      </section>

      {/* Mode of Operation Header */}
      <section
        className={`py-16 md:py-20 bg-white transition-all duration-1000 delay-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center hover:animate-bounce mx-auto w-16 h-16 bg-[#6B0C22] rounded-full mb-4">
            <Target className="w-8 h-8 text-white text-center" />
          </div>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Mode of Operation
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-4xl mx-auto mb-8">
              All self-published authors are invited to nominate their digital
              books (ebooks) through our website. This requires the payment of a
              processing fee of $50.00 payable through Paystack payment gateway.
              The processing fee supports the administrative, promotional, and
              operational aspects of The Africa Laureate Awards. It covers the
              following:
            </p>
            <div className="flex items-center justify-center animate-bounce mx-auto w-16 h-16 bg-[#6B0C22] rounded-full mb-4">
              <ArrowBigDown className="w-8 h-8 text-white text-center" />
            </div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-0 md:py-4 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className={`bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all duration-500 border border-gray-200 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${600 + idx * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#6B0C22] rounded-lg mb-4 text-white">
                  {benefit.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submission Policy */}
      <section
        className={`py-16 md:py-20 bg-white transition-all duration-1000 delay-700 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border-l-4 border-[#6B0C22]">
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed font-semibold">
              We do not accept submissions by anyone other than a book's author,
              or their designated representative.
            </p>
          </div>
        </div>
      </section>

      {/* Selection Process */}
      <section
        className={`py-16 md:py-24 bg-gray-50 transition-all duration-1000 delay-800 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center hover:animate-bounce mx-auto w-16 h-16 bg-[#6B0C22] rounded-full mb-4">
            <Target className="w-8 h-8 text-white text-center" />
          </div>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Selection Process
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed mb-6">
              All ebooks submitted to The Africa Laureate Awards (T.A.L.A.) are
              reviewed through a structured selection process. Each submission
              first undergoes an initial screening to confirm that the work
              meets our minimum standards for quality, originality, and content.
            </p>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed mb-6">
              This preliminary review may include an assessment of sample
              chapters available through online retailers such as Amazon or
              other digital booksellers, as well as selected portions of the
              submitted ebook. The purpose of this stage is to determine whether
              the work qualifies to proceed further in the evaluation process.
            </p>
            <div className="bg-[#6B0C22] text-white rounded-lg p-6">
              <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
                The Africa Laureate Awards reserves the right to decline a
                submission at the initial screening stage at its sole
                discretion. If a book does not meet our standards, the author
                will be notified by email, and the processing fee will be
                refunded in full.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-0 md:py-4 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {processSteps.map((step, idx) => (
              <div
                key={idx}
                className={`relative bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-500 ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-10"
                }`}
                style={{ transitionDelay: `${900 + idx * 100}ms` }}
              >
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#6B0C22] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {step.number}
                </div>
                <div className="ml-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Review Timeline */}
      <section
        className={`py-16 md:py-24 bg-white transition-all duration-1000 delay-1000 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#6B0C22] to-[#4a0818] rounded-2xl p-8 md:p-12 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <Clock className="w-12 h-12" />
                  <h2 className="text-3xl md:text-4xl font-bold">
                    Review Timeline
                  </h2>
                </div>
                <p className="text-lg md:text-xl lg:text-2xl text-gray-200 leading-relaxed">
                  Because of our selection process and our commitment to giving
                  each book fair and thoughtful consideration, the review period
                  at The Africa Laureate Awards (T.A.L.A.) may take up to three
                  weeks. Our aim, however, is to complete reviews within two
                  weeks whenever possible.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold mb-2">2-3</div>
                <div className="text-xl text-gray-200">Weeks</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Decision Section */}
      <section
        className={`py-16 md:py-24 bg-gray-50 transition-all duration-1000 delay-1100 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border-2 border-[#6B0C22]">
            <div className="flex items-start gap-4 mb-6">
              <Mail className="w-8 h-8 text-[#6B0C22] flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Final Decision & Notification
                </h2>
                <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed mb-4">
                  Once a final decision has been made on whether a book will
                  receive a T.A.L.A. Medallion, the author will be notified by
                  email. This notification will include a summary report
                  outlining the ratings used in reaching the final decision. The
                  decision is final, and no additional feedback will be provided
                  beyond the decision and the summary report.
                </p>
                <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed">
                  The summary report will include three selected comments from
                  our readers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Readers */}
      <section
        className={`py-16 md:py-24 bg-white transition-all duration-1000 delay-1200 ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#6B0C22] rounded-full mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Readers
            </h2>
          </div>
          <div className="bg-gray-50 rounded-2xl shadow-lg p-8 md:p-12">
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed mb-6">
              Our readers come from a wide range of backgrounds. Some are
              authors, while others have professional experience in areas
              related to books and writing, including editing, librarianship,
              and education. Many are avid readers who simply enjoy books and
              read extensively.
            </p>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed mb-6">
              These readers represent the wider reading public and may assess a
              book based on readability, engagement, and whether it is a title
              they would recommend to others with similar interests, rather than
              on technical or academic criteria alone. Reader comments are kept
              confidential and are not shared outside of T.A.L.A., allowing for
              honest and candid evaluations.
            </p>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed">
              Our goal is to highlight books our readers believe deserve
              attention while ensuring that the process is fair, respectful, and
              never harmful to an author's reputation or work.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className={`py-16 md:py-24 bg-gradient-to-br from-[#6B0C22] to-[#4a0818] text-white transition-all duration-1000 delay-1300 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{
          backgroundImage: `url(${`https://plus.unsplash.com/premium_photo-1667251760504-096946b820af?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8b3JhbmdlJTIwYm9va3xlbnwwfHwwfHx8MA%3D%3D`})`,
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Submit Your Book?
          </h2>
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-200 mb-8">
            Join our community of recognized self-published authors
          </p>
          <button className="bg-white text-[#6B0C22] px-8 md:px-12 py-4 rounded-lg font-bold text-lg md:text-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:scale-105">
            Submit Your Book Now
          </button>
        </div>
      </section>
    </div>
  );
}
