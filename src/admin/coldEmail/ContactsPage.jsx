import React, { useEffect, useState, useCallback, useRef } from "react";
import { Users, UserCheck, UserX, Upload, Plus, Trash2, Search, X, CheckCircle2, AlertCircle } from "lucide-react";
import { apiGet, apiPost, apiDelete, apiUpload } from "../../services/api";
import Card, { StatCard } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Table, { Td } from "../components/ui/Table";
import EmptyState from "../components/ui/EmptyState";
import Pagination from "../components/ui/Pagination";
import Modal from "../components/ui/Modal";
import { Input, Label } from "../components/ui/Field";

const TABS = [
  { key: "", label: "All" },
  { key: "active", label: "Active" },
  { key: "suppressed", label: "Suppressed" },
];

function initials(contact) {
  const a = (contact.firstName || contact.email || "?").trim()[0] || "?";
  const b = (contact.lastName || "").trim()[0] || "";
  return (a + b).toUpperCase();
}

const AVATAR_TONES = [
  "bg-rose-100 text-rose-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
  "bg-cyan-100 text-cyan-700",
];
function avatarTone(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_TONES[hash % AVATAR_TONES.length];
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [counts, setCounts] = useState({ active: 0, suppressed: 0, total: 0 });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [allMatchingSelected, setAllMatchingSelected] = useState(false);
  const [expandingSelection, setExpandingSelection] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ email: "", firstName: "", lastName: "", bookName: "", company: "" });
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);
  const headerCheckboxRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet("/cold-email/contacts", { page, limit: 25, search, status: statusFilter });
      setContacts(res.contacts || []);
      setPages(res.pages || 1);
      setTotal(res.total || 0);
      setCounts(res.counts || { active: 0, suppressed: 0, total: 0 });
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  // Reset selection whenever the underlying filter/page changes so the
  // header checkbox and "select all matching" banner stay accurate.
  useEffect(() => {
    setSelected(new Set());
    setAllMatchingSelected(false);
  }, [page, search, statusFilter]);

  const pageAllSelected = contacts.length > 0 && contacts.every((c) => selected.has(c._id));
  const pageSomeSelected = contacts.some((c) => selected.has(c._id));

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = pageSomeSelected && !pageAllSelected;
    }
  }, [pageSomeSelected, pageAllSelected]);

  const toggleSelect = (id) => {
    setAllMatchingSelected(false);
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectPage = () => {
    setAllMatchingSelected(false);
    setSelected((prev) => {
      const next = new Set(prev);
      if (pageAllSelected) {
        contacts.forEach((c) => next.delete(c._id));
      } else {
        contacts.forEach((c) => next.add(c._id));
      }
      return next;
    });
  };

  const selectAllMatching = async () => {
    setExpandingSelection(true);
    try {
      const res = await apiGet("/cold-email/contacts/all-ids", { search, status: statusFilter });
      setSelected(new Set(res.ids || []));
      setAllMatchingSelected(true);
    } finally {
      setExpandingSelection(false);
    }
  };

  const clearSelection = () => {
    setSelected(new Set());
    setAllMatchingSelected(false);
  };

  const bulkDelete = async () => {
    if (!selected.size) return;
    if (!window.confirm(`Delete ${selected.size} contact(s)? This can't be undone.`)) return;
    setDeleting(true);
    try {
      await apiDelete("/cold-email/contacts", { ids: Array.from(selected) });
      clearSelection();
      load();
    } finally {
      setDeleting(false);
    }
  };

  const deleteOne = async (id) => {
    if (!window.confirm("Delete this contact?")) return;
    await apiDelete(`/cold-email/contacts/${id}`);
    load();
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    await apiPost("/cold-email/contacts", addForm);
    setAddForm({ email: "", firstName: "", lastName: "", bookName: "", company: "" });
    setAddOpen(false);
    load();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    setImportResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await apiUpload("/cold-email/contacts/import", formData);
      setImportResult(res);
      load();
    } catch (err) {
      setImportResult({ error: err.message });
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-500 text-sm mt-1">Everyone you can reach with a campaign.</p>
        </div>
        <div className="flex items-center gap-2">
          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="csv-import" />
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={importing}>
            <Upload size={16} />
            {importing ? "Importing..." : "Import CSV"}
          </Button>
          <Button onClick={() => setAddOpen(true)}>
            <Plus size={16} />
            Add Contact
          </Button>
        </div>
      </div>
      <p className="text-xs text-gray-400 -mt-4">
        CSV columns recognized: <strong className="text-gray-500 font-semibold">Author Name</strong> (or First/Last Name),{" "}
        <strong className="text-gray-500 font-semibold">Book Name</strong>, <strong className="text-gray-500 font-semibold">Author Email</strong> — any others are kept but unused in campaigns.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Active" value={counts.active} icon={UserCheck} />
        <StatCard label="Suppressed" value={counts.suppressed} icon={UserX} />
        <StatCard label="Total contacts" value={counts.total} icon={Users} />
      </div>

      {importResult && (
        <div
          className={`flex items-start gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
            importResult.error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {importResult.error ? <AlertCircle size={18} className="shrink-0 mt-0.5" /> : <CheckCircle2 size={18} className="shrink-0 mt-0.5" />}
          <p className="flex-1">
            {importResult.error
              ? importResult.error
              : `Imported ${importResult.imported}, ${importResult.duplicates} duplicates skipped, ${importResult.invalid} invalid rows.`}
          </p>
          <button onClick={() => setImportResult(null)} className="shrink-0 opacity-60 hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      )}

      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search contacts..."
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 shrink-0">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setPage(1);
                    setStatusFilter(tab.key);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                    statusFilter === tab.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {selected.size > 0 && (
          <div className="flex items-center justify-between gap-3 bg-[#6B0C22]/5 border border-[#6B0C22]/15 rounded-xl px-4 py-2.5 mb-3">
            <p className="text-sm font-semibold text-[#6B0C22]">
              {selected.size} contact{selected.size !== 1 ? "s" : ""} selected
            </p>
            <div className="flex items-center gap-3">
              <button onClick={clearSelection} className="text-xs font-semibold text-gray-500 hover:text-gray-700">
                Clear
              </button>
              <Button variant="danger" size="sm" onClick={bulkDelete} disabled={deleting}>
                <Trash2 size={14} />
                {deleting ? "Deleting..." : "Delete selected"}
              </Button>
            </div>
          </div>
        )}

        {pageAllSelected && !allMatchingSelected && total > contacts.length && (
          <div className="flex items-center justify-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 mb-3 text-sm text-blue-800">
            <span>
              All {contacts.length} contacts on this page are selected.
            </span>
            <button
              onClick={selectAllMatching}
              disabled={expandingSelection}
              className="font-semibold underline decoration-blue-300 hover:decoration-blue-600 disabled:opacity-50"
            >
              {expandingSelection ? "Selecting..." : `Select all ${total} contacts that match`}
            </button>
          </div>
        )}

        {loading ? (
          <p className="text-sm text-gray-400 py-8 text-center">Loading...</p>
        ) : contacts.length === 0 ? (
          <EmptyState
            icon={Users}
            title={search || statusFilter ? "No matching contacts" : "No contacts yet"}
            message={
              search || statusFilter
                ? "Try a different search term or filter."
                : "Import a CSV or add a contact to get started."
            }
          />
        ) : (
          <>
            <Table
              columns={[
                <input
                  ref={headerCheckboxRef}
                  type="checkbox"
                  checked={pageAllSelected}
                  onChange={toggleSelectPage}
                  aria-label="Select all on page"
                />,
                "Contact",
                "Book",
                "Status",
                "",
              ]}
            >
              {contacts.map((contact) => (
                <tr key={contact._id} className={`hover:bg-gray-50 ${selected.has(contact._id) ? "bg-[#6B0C22]/[0.03]" : ""}`}>
                  <Td className="w-8">
                    <input
                      type="checkbox"
                      checked={selected.has(contact._id)}
                      onChange={() => toggleSelect(contact._id)}
                    />
                  </Td>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarTone(contact._id)}`}
                      >
                        {initials(contact)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {[contact.firstName, contact.lastName].filter(Boolean).join(" ") || "—"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{contact.email}</p>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <p className="text-gray-700 truncate max-w-[220px]">{contact.bookName || "—"}</p>
                    {contact.company && <p className="text-xs text-gray-400 truncate max-w-[220px]">{contact.company}</p>}
                  </Td>
                  <Td>
                    <Badge status={contact.status} />
                  </Td>
                  <Td className="text-right">
                    <button onClick={() => deleteOne(contact._id)} className="text-gray-400 hover:text-red-600">
                      <Trash2 size={15} />
                    </button>
                  </Td>
                </tr>
              ))}
            </Table>
            <Pagination page={page} pages={pages} total={total} onChange={setPage} />
          </>
        )}
      </Card>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Contact"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddContact}>Add Contact</Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleAddContact}>
          <div>
            <Label>Author email *</Label>
            <Input
              type="email"
              required
              value={addForm.email}
              onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Author first name</Label>
              <Input value={addForm.firstName} onChange={(e) => setAddForm({ ...addForm, firstName: e.target.value })} />
            </div>
            <div>
              <Label>Author last name</Label>
              <Input value={addForm.lastName} onChange={(e) => setAddForm({ ...addForm, lastName: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Book name</Label>
            <Input
              value={addForm.bookName}
              onChange={(e) => setAddForm({ ...addForm, bookName: e.target.value })}
              placeholder="Used for the {{book_name}} merge tag"
            />
          </div>
          <div>
            <Label>Company / Publisher (optional)</Label>
            <Input value={addForm.company} onChange={(e) => setAddForm({ ...addForm, company: e.target.value })} />
          </div>
        </form>
      </Modal>
    </div>
  );
}
