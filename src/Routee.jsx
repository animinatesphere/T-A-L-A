import React from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import Navbar from "./component/Navbar";
import About from "./pages/About";
import Loading from "./component/Loading";
import TALA404Page from "./pages/TALA404Page";
import Footer from "./component/Footer";
import TALAFAQPage from "./component/TALAFAQPage";
import TALAContactPage from "./pages/TALAContactPage";
import TALAPodcastPage from "./pages/TALAPodcastPage";
import AdminDashboard from "./admin/AdminDashboard";
import BookSubmissionForm from "./pages/BookSubmissionForm";
import TALATermsPage from "./pages/TALATermsPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const Routee = () => {
  return (
    <>
      <Loading minMs={700} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<TALAFAQPage />} />
        <Route path="/contact" element={<TALAContactPage />} />
        <Route path="/podcast" element={<TALAPodcastPage />} />
        <Route path="/Tala-admin" element={<AdminDashboard />} />
        <Route path="/submit-your-book" element={<BookSubmissionForm />} />
        <Route path="/terms" element={<TALATermsPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="*" element={<TALA404Page />} />
      </Routes>
      <Footer />
    </>
  );
};

export default Routee;
