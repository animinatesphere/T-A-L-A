import React, { useEffect, useState, useCallback } from "react";
import { Mail, Plus, Play, Pause, Trash2, X, Clock, Send, MessageSquare, ShieldOff, AlertTriangle, Inbox, RefreshCw } from "lucide-react";
import { apiGet, apiPost, apiPut, apiDelete } from "../../services/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import { SlideOver } from "../components/ui/Modal";
import Table, { Td } from "../components/ui/Table";
import Pagination from "../components/ui/Pagination";
import { Input, Label, Textarea } from "../components/ui/Field";

const EMPTY_STEP = () => ({ subject: "", body: "", waitDays: 0 });

function CampaignEditor({ open, onClose, onSaved }) {
  const [form, setForm] = useState({ name: "", fromName: "", steps: [EMPTY_STEP()], mailboxIds: [], contactIds: [] });
  const [mailboxes, setMailboxes] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [contactSearch, setContactSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setForm({ name: "", fromName: "", steps: [EMPTY_STEP()], mailboxIds: [], contactIds: [] });
    setError("");
    apiGet("/cold-email/mailboxes").then((res) => setMailboxes(res.mailboxes || []));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    apiGet("/cold-email/contacts", { page: 1, limit: 50, search: contactSearch }).then((res) =>
      setContacts(res.contacts || [])
    );
  }, [open, contactSearch]);

  const updateStep = (i, field, value) => {
    setForm((f) => ({ ...f, steps: f.steps.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)) }));
  };
  const addStep = () => setForm((f) => ({ ...f, steps: [...f.steps, EMPTY_STEP()] }));
  const removeStep = (i) => setForm((f) => ({ ...f, steps: f.steps.filter((_, idx) => idx !== i) }));

  const toggleMailbox = (id) => {
    setForm((f) => ({
      ...f,
      mailboxIds: f.mailboxIds.includes(id) ? f.mailboxIds.filter((x) => x !== id) : [...f.mailboxIds, id],
    }));
  };
  const toggleContact = (id) => {
    setForm((f) => ({
      ...f,
      contactIds: f.contactIds.includes(id) ? f.contactIds.filter((x) => x !== id) : [...f.contactIds, id],
    }));
  };
  const selectAllVisibleContacts = () => {
    setForm((f) => ({ ...f, contactIds: Array.from(new Set([...f.contactIds, ...contacts.map((c) => c._id)])) }));
  };

  const save = async (launch) => {
    setError("");
    if (!form.name.trim()) return setError("Campaign name is required");
    if (!form.steps.every((s) => s.subject.trim() && s.body.trim())) return setError("Every step needs a subject and body");
    setSaving(true);
    try {
      const res = await apiPost("/cold-email/campaigns", form);
      if (launch) await apiPost(`/cold-email/campaigns/${res.campaign._id}/launch`);
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="New Campaign"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="secondary" disabled={saving} onClick={() => save(false)}>
            Save as Draft
          </Button>
          <Button disabled={saving} onClick={() => save(true)}>
            Save & Launch
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Campaign Name *</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>From Name</Label>
            <Input value={form.fromName} onChange={(e) => setForm({ ...form, fromName: e.target.value })} placeholder="Optional" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Email Steps</Label>
            <button onClick={addStep} type="button" className="text-xs font-semibold text-[#6B0C22] hover:underline">
              + Add step
            </button>
          </div>
          <div className="space-y-4">
            {form.steps.map((step, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-500">
                    Step {i + 1} {i > 0 && `· wait after previous step`}
                  </p>
                  {form.steps.length > 1 && (
                    <button onClick={() => removeStep(i)} type="button" className="text-gray-400 hover:text-red-600">
                      <X size={14} />
                    </button>
                  )}
                </div>
                {i > 0 && (
                  <div className="w-32">
                    <Label>Wait days</Label>
                    <Input
                      type="number"
                      min={0}
                      value={step.waitDays}
                      onChange={(e) => updateStep(i, "waitDays", Number(e.target.value))}
                    />
                  </div>
                )}
                <div>
                  <Label>Subject</Label>
                  <Input value={step.subject} onChange={(e) => updateStep(i, "subject", e.target.value)} placeholder="{{author_name}}, quick question about {{book_name}}" />
                </div>
                <div>
                  <Label>Body</Label>
                  <Textarea
                    rows={5}
                    value={step.body}
                    onChange={(e) => updateStep(i, "body", e.target.value)}
                    placeholder="Hi {{author_name}}, I came across {{book_name}}..."
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Merge tags: {"{{author_name}}"} {"{{book_name}}"} {"{{first_name}}"} {"{{last_name}}"} {"{{full_name}}"} {"{{company}}"} {"{{email}}"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Send from</Label>
          {mailboxes.length === 0 ? (
            <p className="text-sm text-gray-400">No mailboxes connected yet — connect one in the Mailboxes tab.</p>
          ) : (
            <div className="space-y-2">
              {mailboxes.map((mb) => (
                <label key={mb._id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.mailboxIds.includes(mb._id)} onChange={() => toggleMailbox(mb._id)} />
                  {mb.email}
                </label>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Contacts ({form.contactIds.length} selected)</Label>
            <button onClick={selectAllVisibleContacts} type="button" className="text-xs font-semibold text-[#6B0C22] hover:underline">
              Select all shown
            </button>
          </div>
          <Input placeholder="Search contacts..." value={contactSearch} onChange={(e) => setContactSearch(e.target.value)} className="mb-2" />
          <div className="max-h-56 overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100">
            {contacts.map((c) => (
              <label key={c._id} className="flex items-center gap-2 text-sm px-3 py-2">
                <input type="checkbox" checked={form.contactIds.includes(c._id)} onChange={() => toggleContact(c._id)} />
                <span className="truncate">
                  {c.email} {c.firstName ? `· ${c.firstName} ${c.lastName || ""}` : ""}
                </span>
              </label>
            ))}
            {contacts.length === 0 && <p className="text-sm text-gray-400 px-3 py-4">No contacts found.</p>}
          </div>
        </div>
      </div>
    </SlideOver>
  );
}

const SEND_STATUS_TABS = [
  { key: "", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "sent", label: "Sent" },
  { key: "replied", label: "Replied" },
  { key: "bounced", label: "Bounced" },
  { key: "failed", label: "Failed" },
];

function KpiTile({ icon: Icon, label, value, tone }) {
  const tones = {
    gray: "bg-gray-100 text-gray-600",
    green: "bg-emerald-100 text-emerald-700",
    purple: "bg-purple-100 text-purple-700",
    red: "bg-red-100 text-red-700",
    amber: "bg-amber-100 text-amber-700",
  };
  return (
    <div className="bg-gray-50 rounded-xl p-3.5 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tones[tone]}`}>
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold text-gray-900 leading-tight">{value || 0}</p>
        <p className="text-[11px] text-gray-500 uppercase tracking-wide truncate">{label}</p>
      </div>
    </div>
  );
}

function CampaignDetail({ campaign: campaignSummary, onClose, onChanged }) {
  const [campaign, setCampaign] = useState(campaignSummary);
  const [sendBreakdown, setSendBreakdown] = useState({});
  const [sends, setSends] = useState([]);
  const [sendStatus, setSendStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [checkingReplies, setCheckingReplies] = useState(false);

  const loadCampaign = useCallback(async () => {
    const res = await apiGet(`/cold-email/campaigns/${campaignSummary._id}`);
    setCampaign(res.campaign);
    setSendBreakdown(res.sendBreakdown || {});
  }, [campaignSummary._id]);

  const loadSends = useCallback(async () => {
    const res = await apiGet(`/cold-email/campaigns/${campaignSummary._id}/sends`, { page, limit: 20, status: sendStatus });
    setSends(res.sends || []);
    setPages(res.pages || 1);
    setTotal(res.total || 0);
  }, [campaignSummary._id, page, sendStatus]);

  useEffect(() => {
    loadCampaign();
  }, [loadCampaign]);

  useEffect(() => {
    loadSends();
  }, [loadSends]);

  const checkReplies = async () => {
    setCheckingReplies(true);
    try {
      await apiPost(`/cold-email/campaigns/${campaignSummary._id}/check-replies`);
      await loadCampaign();
      await loadSends();
      onChanged?.();
    } finally {
      setCheckingReplies(false);
    }
  };

  const replyRate = campaign.stats?.sent ? Math.round(((campaign.stats?.replied || 0) / campaign.stats.sent) * 100) : 0;

  return (
    <SlideOver open={!!campaignSummary} onClose={onClose} title={campaign.name} size="xl">
      <div className="space-y-7">
        <div className="flex flex-wrap items-center gap-3">
          <Badge status={campaign.status} />
          {campaign.fromName && <span className="text-sm text-gray-500">From: {campaign.fromName}</span>}
          {campaign.launchedAt && (
            <span className="text-sm text-gray-400">· Launched {new Date(campaign.launchedAt).toLocaleDateString()}</span>
          )}
          <Button variant="secondary" size="sm" className="ml-auto" onClick={checkReplies} disabled={checkingReplies}>
            <RefreshCw size={13} className={checkingReplies ? "animate-spin" : ""} />
            {checkingReplies ? "Checking..." : "Check for replies"}
          </Button>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Performance</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <KpiTile icon={Send} label="Sent" value={campaign.stats?.sent} tone="gray" />
            <KpiTile icon={MessageSquare} label={`Replied (${replyRate}%)`} value={campaign.stats?.replied} tone="purple" />
            <KpiTile icon={Clock} label="Pending" value={sendBreakdown.pending} tone="amber" />
            <KpiTile icon={AlertTriangle} label="Failed" value={campaign.stats?.failed} tone="red" />
            <KpiTile icon={Inbox} label="Bounced" value={campaign.stats?.bounced} tone="red" />
            <KpiTile icon={ShieldOff} label="Unsubscribed" value={campaign.stats?.unsubscribed} tone="gray" />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Email sequence ({campaign.steps?.length || 0} step{campaign.steps?.length !== 1 ? "s" : ""})
          </p>
          <div className="space-y-3">
            {(campaign.steps || []).map((step, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">Step {i + 1}</span>
                  {i > 0 && <span className="text-[11px] text-gray-500">waits {step.waitDays} day{step.waitDays !== 1 ? "s" : ""} after previous</span>}
                </div>
                <div className="px-4 py-3 space-y-1.5">
                  <p className="text-sm font-semibold text-gray-900">{step.subject}</p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Sending from ({campaign.mailboxIds?.length || 0})
          </p>
          {campaign.mailboxIds?.length ? (
            <div className="flex flex-wrap gap-2">
              {campaign.mailboxIds.map((mb) => (
                <span key={mb._id} className="inline-flex items-center gap-1.5 text-xs bg-gray-100 rounded-full px-3 py-1.5 text-gray-700">
                  {mb.email}
                  <Badge status={mb.status} className="ml-0.5" />
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No mailboxes assigned.</p>
          )}
          <p className="text-xs text-gray-400 mt-2">{campaign.contactIds?.length || 0} contacts targeted</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Send Log</p>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {SEND_STATUS_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setPage(1);
                    setSendStatus(tab.key);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                    sendStatus === tab.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <Table columns={["Contact", "Step", "Status", "Scheduled", "Sent"]}>
            {sends.map((send) => (
              <tr key={send._id}>
                <Td className="font-medium text-gray-900">{send.contactEmail}</Td>
                <Td>{send.stepIndex + 1}</Td>
                <Td>
                  <Badge status={send.status} />
                </Td>
                <Td>{new Date(send.scheduledAt).toLocaleString()}</Td>
                <Td>{send.sentAt ? new Date(send.sentAt).toLocaleString() : "—"}</Td>
              </tr>
            ))}
          </Table>
          {sends.length === 0 && <p className="text-sm text-gray-400 py-6 text-center">No sends yet.</p>}
          <Pagination page={page} pages={pages} total={total} onChange={setPage} />
        </div>
      </div>
    </SlideOver>
  );
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [detail, setDetail] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet("/cold-email/campaigns");
      setCampaigns(res.campaigns || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const launch = async (c) => {
    if (!window.confirm(`Launch "${c.name}"? Emails will start sending shortly.`)) return;
    try {
      await apiPost(`/cold-email/campaigns/${c._id}/launch`);
      load();
    } catch (err) {
      alert(err.message);
    }
  };
  const pause = async (c) => {
    await apiPost(`/cold-email/campaigns/${c._id}/pause`);
    load();
  };
  const resume = async (c) => {
    await apiPost(`/cold-email/campaigns/${c._id}/resume`);
    load();
  };
  const remove = async (c) => {
    if (!window.confirm(`Delete campaign "${c.name}" and all its send history?`)) return;
    await apiDelete(`/cold-email/campaigns/${c._id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-500 text-sm mt-1">Multi-step outreach sequences sent from your connected mailboxes.</p>
        </div>
        <Button onClick={() => setEditorOpen(true)}>
          <Plus size={16} />
          New Campaign
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : campaigns.length === 0 ? (
        <Card>
          <EmptyState
            icon={Mail}
            title="No campaigns yet"
            message="Create a campaign, pick mailboxes and contacts, then launch."
            action={
              <Button onClick={() => setEditorOpen(true)}>
                <Plus size={16} />
                New Campaign
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {campaigns.map((c) => (
            <Card key={c._id} className="p-5 flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <button onClick={() => setDetail(c)} className="font-bold text-gray-900 text-left hover:underline">
                  {c.name}
                </button>
                <Badge status={c.status} />
              </div>
              <p className="text-xs text-gray-500 mb-4">
                {c.steps.length} step{c.steps.length !== 1 ? "s" : ""} · {c.mailboxIds.length} mailbox
                {c.mailboxIds.length !== 1 ? "es" : ""} · {c.contactIds.length} contacts
              </p>
              <div className="grid grid-cols-3 gap-2 text-center mb-4">
                <div>
                  <p className="font-bold text-gray-900">{c.stats?.sent || 0}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Sent</p>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{c.stats?.replied || 0}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Replied</p>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{c.stats?.failed || 0}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Failed</p>
                </div>
              </div>
              <div className="mt-auto flex gap-2">
                {c.status === "active" ? (
                  <Button variant="secondary" size="sm" className="flex-1" onClick={() => pause(c)}>
                    <Pause size={14} /> Pause
                  </Button>
                ) : c.status === "paused" ? (
                  <Button variant="secondary" size="sm" className="flex-1" onClick={() => resume(c)}>
                    <Play size={14} /> Resume
                  </Button>
                ) : (
                  <Button size="sm" className="flex-1" onClick={() => launch(c)}>
                    <Play size={14} /> Launch
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => remove(c)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <CampaignEditor open={editorOpen} onClose={() => setEditorOpen(false)} onSaved={load} />
      {detail && <CampaignDetail campaign={detail} onClose={() => setDetail(null)} onChanged={load} />}
    </div>
  );
}
