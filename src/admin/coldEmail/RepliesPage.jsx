import React, { useEffect, useState, useCallback } from "react";
import { Inbox, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { apiGet, apiPost } from "../../services/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Pagination from "../components/ui/Pagination";

export default function RepliesPage() {
  const [replies, setReplies] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet("/cold-email/replies", { page, limit: 25 });
      setReplies(res.replies || []);
      setPages(res.pages || 1);
      setTotal(res.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const checkNow = async () => {
    setChecking(true);
    try {
      await apiPost("/cold-email/replies/check");
      await load();
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Replies</h1>
          <p className="text-gray-500 text-sm mt-1">{total} replies received across all campaigns.</p>
        </div>
        <Button variant="secondary" onClick={checkNow} disabled={checking}>
          <RefreshCw size={16} className={checking ? "animate-spin" : ""} />
          {checking ? "Checking..." : "Check for New Replies"}
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 py-8 text-center">Loading...</p>
      ) : replies.length === 0 ? (
        <Card>
          <EmptyState icon={Inbox} title="No replies yet" message="When contacts reply to your campaigns, they'll show up here." />
        </Card>
      ) : (
        <div className="space-y-3">
          {replies.map((reply) => {
            const isOpen = expanded === reply._id;
            const contact = reply.contactId;
            return (
              <Card key={reply._id} className="p-5">
                <button
                  onClick={() => setExpanded(isOpen ? null : reply._id)}
                  className="w-full flex items-start justify-between gap-4 text-left"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">
                      {contact ? [contact.firstName, contact.lastName].filter(Boolean).join(" ") || contact.email : reply.contactEmail}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {reply.contactEmail} {contact?.company ? `· ${contact.company}` : ""}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {reply.campaignId?.name || "Unknown campaign"} · {new Date(reply.repliedAt).toLocaleString()}
                    </p>
                  </div>
                  {isOpen ? <ChevronUp size={18} className="shrink-0 text-gray-400" /> : <ChevronDown size={18} className="shrink-0 text-gray-400" />}
                </button>
                {isOpen && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Subject: {reply.replySubject || "(no subject)"}</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{reply.replyBody || "(empty body)"}</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
      <Pagination page={page} pages={pages} total={total} onChange={setPage} />
    </div>
  );
}
