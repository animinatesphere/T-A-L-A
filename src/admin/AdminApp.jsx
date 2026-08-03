import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Award } from "lucide-react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AdminLayout from "./components/AdminLayout";
import DashboardHome from "./DashboardHome";
import LegacyLayout from "./legacy/LegacyLayout";
import SubmissionsSection from "./legacy/SubmissionsSection";
import PodcastsSection from "./legacy/PodcastsSection";
import BooksSection from "./legacy/BooksSection";
import BlogsSection from "./legacy/BlogsSection";
import JudgesSection from "./legacy/JudgesSection";
import CampaignsPage from "./coldEmail/CampaignsPage";
import ContactsPage from "./coldEmail/ContactsPage";
import MailboxesPage from "./coldEmail/MailboxesPage";
import RepliesPage from "./coldEmail/RepliesPage";
import SuppressionPage from "./coldEmail/SuppressionPage";

function LoginScreen() {
  const { login, loading, error } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(form.username, form.password);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#6B0C22] rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-600">Enter your credentials to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] outline-none"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6B0C22] text-white py-3 rounded-lg font-bold hover:bg-[#8B1530] transition-colors disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminRoutes() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <LoginScreen />;

  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<DashboardHome />} />
        <Route element={<LegacyLayout />}>
          <Route path="submissions" element={<SubmissionsSection />} />
          <Route path="books" element={<BooksSection />} />
          <Route path="podcasts" element={<PodcastsSection />} />
          <Route path="blogs" element={<BlogsSection />} />
          <Route path="judges" element={<JudgesSection />} />
        </Route>
        <Route path="cold-email/campaigns" element={<CampaignsPage />} />
        <Route path="cold-email/contacts" element={<ContactsPage />} />
        <Route path="cold-email/mailboxes" element={<MailboxesPage />} />
        <Route path="cold-email/replies" element={<RepliesPage />} />
        <Route path="cold-email/suppression" element={<SuppressionPage />} />
      </Route>
    </Routes>
  );
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <AdminRoutes />
    </AuthProvider>
  );
}
