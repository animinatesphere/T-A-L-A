import React, { useEffect, useState, useCallback } from "react";
import { ShieldOff, Plus, Trash2, Search } from "lucide-react";
import { apiGet, apiPost, apiDelete } from "../../services/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Table, { Td } from "../components/ui/Table";
import EmptyState from "../components/ui/EmptyState";
import Pagination from "../components/ui/Pagination";
import { Input } from "../components/ui/Field";

export default function SuppressionPage() {
  const [entries, setEntries] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet("/cold-email/suppression", { page, limit: 25, search });
      setEntries(res.entries || []);
      setPages(res.pages || 1);
      setTotal(res.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    load();
  }, [load]);

  const addEmail = async (e) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    await apiPost("/cold-email/suppression", { email: newEmail.trim(), reason: "manual" });
    setNewEmail("");
    load();
  };

  const remove = async (email) => {
    if (!window.confirm(`Remove ${email} from the suppression list? They will become emailable again.`)) return;
    await apiDelete(`/cold-email/suppression/${encodeURIComponent(email)}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Suppression List</h1>
        <p className="text-gray-500 text-sm mt-1">Addresses that will never receive outreach emails.</p>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search suppressed emails..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="pl-9"
            />
          </div>
          <form onSubmit={addEmail} className="flex items-center gap-2">
            <Input
              type="email"
              placeholder="email@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-56"
            />
            <Button type="submit" size="sm">
              <Plus size={14} />
              Add
            </Button>
          </form>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400 py-8 text-center">Loading...</p>
        ) : entries.length === 0 ? (
          <EmptyState icon={ShieldOff} title="No suppressed addresses" message="Unsubscribes and manual suppressions will appear here." />
        ) : (
          <>
            <Table columns={["Email", "Reason", "Added", ""]}>
              {entries.map((entry) => (
                <tr key={entry._id} className="hover:bg-gray-50">
                  <Td className="font-medium text-gray-900">{entry.email}</Td>
                  <Td>
                    <Badge status={entry.reason} />
                  </Td>
                  <Td>{new Date(entry.addedAt).toLocaleDateString()}</Td>
                  <Td className="text-right">
                    <button onClick={() => remove(entry.email)} className="text-gray-400 hover:text-red-600">
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
    </div>
  );
}
