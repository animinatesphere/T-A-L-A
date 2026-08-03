import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Inbox, Plus, Trash2, Pause, Play, AlertCircle, CheckCircle } from "lucide-react";
import { apiGet, apiPatch, apiDelete, API_URL } from "../../services/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import { Input, Label } from "../components/ui/Field";

export default function MailboxesPage() {
  const [mailboxes, setMailboxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet("/cold-email/mailboxes");
      setMailboxes(res.mailboxes || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const banner =
    searchParams.get("connected") === "1"
      ? { type: "success", text: "Gmail mailbox connected successfully." }
      : searchParams.get("error")
      ? { type: "error", text: `Could not connect Gmail: ${searchParams.get("error")}` }
      : null;

  const dismissBanner = () => {
    searchParams.delete("connected");
    searchParams.delete("error");
    setSearchParams(searchParams, { replace: true });
  };

  const toggleStatus = async (mailbox) => {
    const status = mailbox.status === "active" ? "paused" : "active";
    await apiPatch(`/cold-email/mailboxes/${mailbox._id}`, { status });
    load();
  };

  const updateLimit = async (mailbox, dailyLimit) => {
    await apiPatch(`/cold-email/mailboxes/${mailbox._id}`, { dailyLimit });
    load();
  };

  const remove = async (mailbox) => {
    if (!window.confirm(`Disconnect ${mailbox.email}? Campaigns using this mailbox will pause sending from it.`)) return;
    await apiDelete(`/cold-email/mailboxes/${mailbox._id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mailboxes</h1>
          <p className="text-gray-500 text-sm mt-1">Gmail accounts sending your outreach campaigns.</p>
        </div>
        <Button as="a" href={`${API_URL}/cold-email/auth/google`}>
          <Plus size={16} />
          Connect Gmail
        </Button>
      </div>

      {banner && (
        <div
          className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium ${
            banner.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}
        >
          <span className="flex items-center gap-2">
            {banner.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {banner.text}
          </span>
          <button onClick={dismissBanner} className="text-xs underline">
            Dismiss
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : mailboxes.length === 0 ? (
        <Card>
          <EmptyState
            icon={Inbox}
            title="No mailboxes connected"
            message="Connect a Gmail account so campaigns have somewhere to send from. Until Google OAuth credentials are configured on the backend, this button will show a setup message."
            action={
              <Button as="a" href={`${API_URL}/cold-email/auth/google`}>
                <Plus size={16} />
                Connect Gmail
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mailboxes.map((mailbox) => (
            <Card key={mailbox._id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{mailbox.email}</p>
                  <Badge status={mailbox.status} className="mt-1" />
                </div>
                <button onClick={() => remove(mailbox)} className="text-gray-400 hover:text-red-600 p-1">
                  <Trash2 size={16} />
                </button>
              </div>

              {mailbox.errorMessage && <p className="text-xs text-red-600 mb-2">{mailbox.errorMessage}</p>}

              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <span>
                  Sent today: <strong>{mailbox.sentToday}</strong> / {mailbox.dailyLimit}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                <div
                  className="bg-[#6B0C22] h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, (mailbox.sentToday / (mailbox.dailyLimit || 1)) * 100)}%` }}
                />
              </div>

              <div className="mb-4">
                <Label>Daily limit</Label>
                <Input
                  type="number"
                  min={1}
                  defaultValue={mailbox.dailyLimit}
                  onBlur={(e) => {
                    const val = Number(e.target.value);
                    if (val && val !== mailbox.dailyLimit) updateLimit(mailbox, val);
                  }}
                />
              </div>

              <Button variant="secondary" size="sm" className="w-full" onClick={() => toggleStatus(mailbox)}>
                {mailbox.status === "active" ? (
                  <>
                    <Pause size={14} /> Pause
                  </>
                ) : (
                  <>
                    <Play size={14} /> Resume
                  </>
                )}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
