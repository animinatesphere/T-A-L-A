import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Inbox, Mail, Plus, Trash2, Pause, Play, Minus, AlertCircle, CheckCircle, Check } from "lucide-react";
import { apiGet, apiPatch, apiDelete, API_URL } from "../../services/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import { Label } from "../components/ui/Field";

function MailboxCard({ mailbox, onChanged, onRemove, onToggleStatus }) {
  const [limitValue, setLimitValue] = useState(mailbox.dailyLimit);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    setLimitValue(mailbox.dailyLimit);
  }, [mailbox.dailyLimit]);

  const dirty = Number(limitValue) !== mailbox.dailyLimit && Number(limitValue) > 0;

  const saveLimit = async () => {
    if (!dirty) return;
    setSaving(true);
    try {
      await onChanged(mailbox, Number(limitValue));
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1800);
    } finally {
      setSaving(false);
    }
  };

  const pct = Math.min(100, Math.round((mailbox.sentToday / (mailbox.dailyLimit || 1)) * 100));

  return (
    <Card className="p-5 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#6B0C22]/10 text-[#6B0C22] flex items-center justify-center shrink-0">
            <Mail size={18} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{mailbox.email}</p>
            <Badge status={mailbox.status} className="mt-1" />
          </div>
        </div>
        <button
          onClick={() => onRemove(mailbox)}
          className="text-gray-400 hover:text-red-600 p-1 shrink-0"
          title="Disconnect mailbox"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {mailbox.errorMessage && (
        <p className="flex items-start gap-1.5 text-xs text-red-600 mb-3 bg-red-50 rounded-lg px-2.5 py-2">
          <AlertCircle size={13} className="shrink-0 mt-0.5" />
          {mailbox.errorMessage}
        </p>
      )}

      <div className="flex items-center justify-between text-sm text-gray-600 mb-1.5">
        <span>Sent today</span>
        <span className="font-semibold text-gray-900">
          {mailbox.sentToday} / {mailbox.dailyLimit}
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-5">
        <div
          className={`h-1.5 rounded-full transition-all ${pct >= 100 ? "bg-amber-500" : "bg-[#6B0C22]"}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mb-5">
        <Label>Daily send limit</Label>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setLimitValue((v) => Math.max(1, Number(v) - 5))}
              className="px-2.5 py-2 text-gray-500 hover:bg-gray-50 disabled:opacity-30"
              disabled={Number(limitValue) <= 1}
            >
              <Minus size={14} />
            </button>
            <input
              type="number"
              min={1}
              value={limitValue}
              onChange={(e) => setLimitValue(e.target.value)}
              className="w-16 text-center border-x border-gray-200 py-2 text-sm focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setLimitValue((v) => Number(v) + 5)}
              className="px-2.5 py-2 text-gray-500 hover:bg-gray-50"
            >
              <Plus size={14} />
            </button>
          </div>
          {dirty ? (
            <Button size="sm" onClick={saveLimit} disabled={saving} className="flex-1">
              {saving ? "Saving..." : "Save"}
            </Button>
          ) : justSaved ? (
            <span className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold text-emerald-600">
              <Check size={15} /> Saved
            </span>
          ) : (
            <span className="flex-1 text-xs text-gray-400 text-center">emails / day</span>
          )}
        </div>
      </div>

      <Button variant="secondary" size="sm" className="w-full mt-auto" onClick={() => onToggleStatus(mailbox)}>
        {mailbox.status === "active" ? (
          <>
            <Pause size={14} /> Pause sending
          </>
        ) : (
          <>
            <Play size={14} /> Resume sending
          </>
        )}
      </Button>
    </Card>
  );
}

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
    await load();
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
            <MailboxCard
              key={mailbox._id}
              mailbox={mailbox}
              onChanged={updateLimit}
              onRemove={remove}
              onToggleStatus={toggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
