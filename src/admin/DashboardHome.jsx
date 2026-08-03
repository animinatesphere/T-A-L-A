import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Award, Podcast, FileText, Users, Mail, Inbox, ShieldOff, ArrowRight } from "lucide-react";
import { apiGet, API_URL, getAuthHeaders } from "../services/api";
import { StatCard } from "./components/ui/Card";

export default function DashboardHome() {
  const [siteStats, setSiteStats] = useState({ submissions: 0, pending: 0, books: 0, podcasts: 0, blogs: 0, judges: 0 });
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of submissions, content, and outreach.</p>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Content</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <StatCard label="Submissions" value={siteStats.submissions} icon={BookOpen} hint={`${siteStats.pending} pending`} />
          <StatCard label="Award Books" value={siteStats.books} icon={Award} />
          <StatCard label="Podcasts" value={siteStats.podcasts} icon={Podcast} />
          <StatCard label="Blog Posts" value={siteStats.blogs} icon={FileText} />
          <StatCard label="Judges" value={siteStats.judges} icon={Users} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Cold Email Outreach</h2>
          <Link to="/Tala-admin/cold-email/campaigns" className="text-sm font-semibold text-[#6B0C22] flex items-center gap-1 hover:underline">
            Open campaigns <ArrowRight size={14} />
          </Link>
        </div>
        {coldStats ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Active Campaigns" value={coldStats.activeCampaigns} icon={Mail} hint={`${coldStats.campaigns} total`} />
            <StatCard label="Contacts" value={coldStats.activeContacts} icon={Users} hint={`${coldStats.contacts} total`} />
            <StatCard label="Emails Sent" value={coldStats.sends} icon={Inbox} hint={`${coldStats.replied} replied`} />
            <StatCard label="Suppressed" value={coldStats.suppressed} icon={ShieldOff} hint={`${coldStats.mailboxes} mailboxes active`} />
          </div>
        ) : (
          <p className="text-sm text-gray-400">Cold email stats unavailable — check backend connection.</p>
        )}
      </div>
    </div>
  );
}
