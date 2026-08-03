import React, { useEffect, useState, useCallback, useRef } from "react";
import { Users, Upload, Plus, Trash2, Search } from "lucide-react";
import { apiGet, apiPost, apiDelete, apiUpload } from "../../services/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Table, { Td } from "../components/ui/Table";
import EmptyState from "../components/ui/EmptyState";
import Pagination from "../components/ui/Pagination";
import Modal from "../components/ui/Modal";
import { Input, Label } from "../components/ui/Field";

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [counts, setCounts] = useState({ active: 0, suppressed: 0, total: 0 });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ email: "", firstName: "", lastName: "", company: "" });
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const fileInputRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet("/cold-email/contacts", { page, limit: 25, search });
      setContacts(res.contacts || []);
      setPages(res.pages || 1);
      setTotal(res.total || 0);
      setCounts(res.counts || { active: 0, suppressed: 0, total: 0 });
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === contacts.length) setSelected(new Set());
    else setSelected(new Set(contacts.map((c) => c._id)));
  };

  const bulkDelete = async () => {
    if (!selected.size) return;
    if (!window.confirm(`Delete ${selected.size} contact(s)?`)) return;
    await apiDelete("/cold-email/contacts", { ids: Array.from(selected) });
    setSelected(new Set());
    load();
  };

  const deleteOne = async (id) => {
    if (!window.confirm("Delete this contact?")) return;
    await apiDelete(`/cold-email/contacts/${id}`);
    load();
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    await apiPost("/cold-email/contacts", addForm);
    setAddForm({ email: "", firstName: "", lastName: "", company: "" });
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
          <p className="text-gray-500 text-sm mt-1">
            {counts.active} active · {counts.suppressed} suppressed · {counts.total} total
          </p>
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

      {importResult && (
        <div
          className={`px-4 py-3 rounded-xl text-sm font-medium ${
            importResult.error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {importResult.error
            ? importResult.error
            : `Imported ${importResult.imported}, ${importResult.duplicates} duplicates skipped, ${importResult.invalid} invalid rows.`}
        </div>
      )}

      <Card className="p-4">
        <div className="flex items-center justify-between gap-3 mb-4">
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
          {selected.size > 0 && (
            <Button variant="danger" size="sm" onClick={bulkDelete}>
              <Trash2 size={14} />
              Delete {selected.size} selected
            </Button>
          )}
        </div>

        {loading ? (
          <p className="text-sm text-gray-400 py-8 text-center">Loading...</p>
        ) : contacts.length === 0 ? (
          <EmptyState icon={Users} title="No contacts yet" message="Import a CSV or add a contact to get started." />
        ) : (
          <>
            <Table columns={["", "Email", "Name", "Company", "Status", ""]}>
              {contacts.map((contact) => (
                <tr key={contact._id} className="hover:bg-gray-50">
                  <Td className="w-8">
                    <input
                      type="checkbox"
                      checked={selected.has(contact._id)}
                      onChange={() => toggleSelect(contact._id)}
                    />
                  </Td>
                  <Td className="font-medium text-gray-900">{contact.email}</Td>
                  <Td>{[contact.firstName, contact.lastName].filter(Boolean).join(" ") || "—"}</Td>
                  <Td>{contact.company || "—"}</Td>
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
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" checked={selected.size === contacts.length} onChange={toggleSelectAll} />
              <span className="text-xs text-gray-500">Select all on page</span>
            </div>
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
            <Label>Email *</Label>
            <Input
              type="email"
              required
              value={addForm.email}
              onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>First name</Label>
              <Input value={addForm.firstName} onChange={(e) => setAddForm({ ...addForm, firstName: e.target.value })} />
            </div>
            <div>
              <Label>Last name</Label>
              <Input value={addForm.lastName} onChange={(e) => setAddForm({ ...addForm, lastName: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Company</Label>
            <Input value={addForm.company} onChange={(e) => setAddForm({ ...addForm, company: e.target.value })} />
          </div>
        </form>
      </Modal>
    </div>
  );
}
