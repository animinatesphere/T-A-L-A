import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Award,
  Podcast,
  FileText,
  Users,
  Mail,
  Inbox,
  ShieldOff,
  ArrowRight,
  Plus,
  Upload,
  Send,
} from "lucide-react";
import { apiGet, API_URL, getAuthHeaders } from "../services/api";
import { useAuth } from "./context/AuthContext";
import Card, { StatCard } from "./components/ui/Card";

const QUICK_ACTIONS = [
  { to: "/Tala-admin/cold-email/campaigns", label: "New Campaign", icon: Send },
  { to: "/Tala-admin/cold-email/contacts", label: "Import Contacts", icon: Upload },
  { to: "/Tala-admin/submissions", label: "Review Submissions", icon: BookOpen },
  { to: "/Tala-admin/books", label: "Add Award Book", icon: Plus },
];

function StatSkeleton() {
  return (
    <Card className="p-5 flex items-center gap-4 animate-pulse">
      <div className="w-11 h-11 rounded-xl bg-gray-100 shrink-0" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-5 w-10 bg-gray-100 rounded" />
        <div className="h-3 w-16 bg-gray-100 rounded" />
      </div>
    </Card>
  );
}

export default function DashboardHome() {
  const { admin } = useAuth();
  const [siteStats, setSiteStats] = useState(null);
  const [coldStats, setColdStats] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [subsRes, booksRes, podRes, blogRes, judgeRes] = await Promise.all([
          fetch(`${API_URL}/submissions`, { headers: getAuthHeaders() }).then((r) => r.json()),
          fetch(`${API_URL}/award-books`).then((r) => r.json()),
          fetch(`${API_URL}/podcasts`).then((r) => r.json()),
          fetch(`${API_URL}/blogs`).then((r) => r.json()),
          fetch(`${API_URL}/judges`).then((r) => r.json()),
        ]);
        const submissions = subsRes.data || [];
        setSiteStats({
          submissions: submissions.length,
          pending: submissions.filter((s) => s.submission_status === "pending").length,
          books: (booksRes.data || []).length,
          podcasts: (podRes.data || []).length,
          blogs: (blogRes.data || []).length,
          judges: (judgeRes.data || []).length,
        });
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
      }
    })();

    apiGet("/cold-email/stats")
      .then((res) => setColdStats(res.stats))
      .catch(() => setColdStats(null));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#6B0C22] to-[#8B1530] px-6 py-8 sm:px-8 text-white">
        <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/5" />
        <div className="absolute right-16 -bottom-16 w-40 h-40 rounded-full bg-white/5" />
        <div className="relative">
          <p className="text-white/70 text-sm font-medium">{greeting}{admin?.username ? `, ${admin.username}` : ""}</p>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1">T.A.L.A. Admin Dashboard</h1>
          <p className="text-white/70 text-sm mt-2 max-w-lg">
            Overview of submissions, published content, and your cold email outreach — all in one place.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3.5 hover:border-[#6B0C22]/30 hover:shadow-md transition group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#6B0C22]/10 text-[#6B0C22] flex items-center justify-center shrink-0 group-hover:bg-[#6B0C22] group-hover:text-white transition">
              <action.icon size={16} />
            </div>
            <span className="text-sm font-semibold text-gray-800 leading-tight">{action.label}</span>
          </Link>
        ))}
      </div>

      <Card className="p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Content</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {!siteStats ? (
            Array.from({ length: 5 }).map((_, i) => <StatSkeleton key={i} />)
          ) : (
            <>
              <StatCard label="Submissions" value={siteStats.submissions} icon={BookOpen} hint={`${siteStats.pending} pending`} />
              <StatCard label="Award Books" value={siteStats.books} icon={Award} />
              <StatCard label="Podcasts" value={siteStats.podcasts} icon={Podcast} />
              <StatCard label="Blog Posts" value={siteStats.blogs} icon={FileText} />
              <StatCard label="Judges" value={siteStats.judges} icon={Users} />
            </>
          )}
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Cold Email Outreach</h2>
          <Link
            to="/Tala-admin/cold-email/campaigns"
            className="text-sm font-semibold text-[#6B0C22] flex items-center gap-1 hover:underline"
          >
            Open campaigns <ArrowRight size={14} />
          </Link>
        </div>
        {coldStats === null ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatSkeleton key={i} />
            ))}
          </div>
        ) : coldStats ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Active Campaigns" value={coldStats.activeCampaigns} icon={Mail} hint={`${coldStats.campaigns} total`} />
            <StatCard label="Contacts" value={coldStats.activeContacts} icon={Users} hint={`${coldStats.contacts} total`} />
            <StatCard label="Emails Sent" value={coldStats.sends} icon={Inbox} hint={`${coldStats.replied} replied`} />
            <StatCard label="Suppressed" value={coldStats.suppressed} icon={ShieldOff} hint={`${coldStats.mailboxes} mailboxes active`} />
          </div>
        ) : (
          <p className="text-sm text-gray-400">Cold email stats unavailable — check backend connection.</p>
        )}
      </Card>
    </div>
  );
}
