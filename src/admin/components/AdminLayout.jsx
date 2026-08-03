import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Podcast,
  FileText,
  Award,
  Mail,
  Users,
  Inbox,
  ShieldOff,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV_SECTIONS = [
  {
    items: [{ to: "/Tala-admin", label: "Dashboard", icon: LayoutDashboard, end: true }],
  },
  {
    title: "Content",
    items: [
      { to: "/Tala-admin/submissions", label: "Submissions", icon: BookOpen },
      { to: "/Tala-admin/books", label: "Award Books", icon: Award },
      { to: "/Tala-admin/podcasts", label: "Podcasts", icon: Podcast },
      { to: "/Tala-admin/blogs", label: "Blog Posts", icon: FileText },
      { to: "/Tala-admin/judges", label: "Judges", icon: Users },
    ],
  },
  {
    title: "Cold Email",
    items: [
      { to: "/Tala-admin/cold-email/campaigns", label: "Campaigns", icon: Mail },
      { to: "/Tala-admin/cold-email/contacts", label: "Contacts", icon: Users },
      { to: "/Tala-admin/cold-email/mailboxes", label: "Mailboxes", icon: Inbox },
      { to: "/Tala-admin/cold-email/replies", label: "Replies", icon: Inbox },
      { to: "/Tala-admin/cold-email/suppression", label: "Suppression", icon: ShieldOff },
    ],
  },
];

function SidebarContent({ onNavigate }) {
  const { logout, admin } = useAuth();
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-6 flex items-center gap-3 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-white">
          T
        </div>
        <div>
          <p className="text-white font-bold leading-tight">T.A.L.A. Admin</p>
          <p className="text-white/40 text-xs">Control panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_SECTIONS.map((section, i) => (
          <div key={i}>
            {section.title && (
              <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/35">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                      isActive ? "bg-white text-[#6B0C22] shadow-sm" : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <item.icon size={17} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <div className="px-3 mb-2 text-xs text-white/40 truncate">{admin?.username || "Signed in"}</div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition"
        >
          <LogOut size={17} />
          Log out
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 bg-gradient-to-b from-[#6B0C22] to-[#4A0818]">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 h-full bg-gradient-to-b from-[#6B0C22] to-[#4A0818]">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white"
            >
              <X size={20} />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
            <Menu size={20} />
          </button>
          <p className="font-bold text-gray-900">T.A.L.A. Admin</p>
        </header>
        <main className="flex-1 min-w-0 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
