import React, { useEffect, useMemo, useState } from "react";
import { DollarSign, Banknote, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { API_URL, getAuthHeaders } from "../services/api";
import Card, { StatCard } from "./components/ui/Card";
import Table, { Td } from "./components/ui/Table";
import EmptyState from "./components/ui/EmptyState";
import MonthlyBarChart from "./components/ui/MonthlyBarChart";

const MONTHS_BACK = 12;

function monthKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function lastNMonthKeys(n) {
  const keys = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push({ key: monthKey(d), label: d.toLocaleDateString("en-US", { month: "short" }) });
  }
  return keys;
}

function compactNumber(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${Math.round(n)}`;
}

const usdValue = (v) => `$${v.toLocaleString("en-US")}`;
const usdAxis = (v) => `$${compactNumber(v)}`;
const ngnValue = (v) => `₦${v.toLocaleString("en-US")}`;
const ngnAxis = (v) => `₦${compactNumber(v)}`;

export default function RevenuePage() {
  const [submissions, setSubmissions] = useState(null);
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    fetch(`${API_URL}/submissions`, { headers: getAuthHeaders() })
      .then((r) => r.json())
      .then((res) => setSubmissions(res.data || []))
      .catch(() => setSubmissions([]));
  }, []);

  const stats = useMemo(() => {
    if (!submissions) return null;
    const completed = submissions.filter((s) => s.payment_status === "completed");
    const pending = submissions.filter((s) => s.payment_status !== "completed");

    const totals = { USD: 0, NGN: 0 };
    completed.forEach((s) => {
      if (s.payment_currency === "USD" || s.payment_currency === "NGN") {
        totals[s.payment_currency] += Number(s.payment_amount) || 0;
      }
    });

    const monthKeys = lastNMonthKeys(MONTHS_BACK);
    const buckets = { USD: {}, NGN: {} };
    monthKeys.forEach(({ key }) => {
      buckets.USD[key] = 0;
      buckets.NGN[key] = 0;
    });
    completed.forEach((s) => {
      if (s.payment_currency !== "USD" && s.payment_currency !== "NGN") return;
      const key = monthKey(s.createdAt);
      if (key in buckets[s.payment_currency]) {
        buckets[s.payment_currency][key] += Number(s.payment_amount) || 0;
      }
    });

    const series = {
      USD: monthKeys.map(({ key, label }) => ({ label, value: buckets.USD[key] })),
      NGN: monthKeys.map(({ key, label }) => ({ label, value: buckets.NGN[key] })),
    };

    const recent = [...completed]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 8);

    const conversionRate = submissions.length ? Math.round((completed.length / submissions.length) * 100) : 0;

    return { completed, pending, totals, series, recent, conversionRate, total: submissions.length };
  }, [submissions]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Revenue</h1>
        <p className="text-gray-500 text-sm mt-1">Submission fee revenue across currencies.</p>
      </div>

      {!stats ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : stats.total === 0 ? (
        <Card>
          <EmptyState icon={DollarSign} title="No submissions yet" message="Revenue will appear here once book submissions come in." />
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Revenue (USD)" value={usdValue(stats.totals.USD)} icon={DollarSign} />
            <StatCard label="Revenue (NGN)" value={ngnValue(stats.totals.NGN)} icon={Banknote} />
            <StatCard label="Paid submissions" value={stats.completed.length} icon={CheckCircle2} hint={`of ${stats.total} total`} />
            <StatCard label="Conversion rate" value={`${stats.conversionRate}%`} icon={TrendingUp} hint="submitted → paid" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(12,163,12,0.12)", color: "#0ca30c" }}>
                <CheckCircle2 size={18} />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{stats.completed.length}</p>
                <p className="text-xs text-gray-500">Completed payments</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(250,178,25,0.15)", color: "#a5730f" }}>
                <Clock size={18} />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{stats.pending.length}</p>
                <p className="text-xs text-gray-500">Pending / unpaid</p>
              </div>
            </Card>
          </div>

          <Card className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Monthly revenue — last {MONTHS_BACK} months
              </h2>
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                {["USD", "NGN"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                      currency === c ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <MonthlyBarChart
              data={stats.series[currency]}
              color="#6B0C22"
              formatValue={currency === "USD" ? usdValue : ngnValue}
              formatAxis={currency === "USD" ? usdAxis : ngnAxis}
              title={`Monthly ${currency} revenue`}
            />
          </Card>

          <Card className="p-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">Recent payments</h2>
            {stats.recent.length === 0 ? (
              <EmptyState icon={DollarSign} title="No payments yet" />
            ) : (
              <Table columns={["Author", "Book", "Amount", "Date"]}>
                {stats.recent.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <Td className="font-medium text-gray-900">{s.author_name}</Td>
                    <Td className="text-gray-600">{s.book_title}</Td>
                    <Td className="text-gray-900 font-semibold">
                      {s.payment_currency === "USD" ? usdValue(s.payment_amount) : ngnValue(s.payment_amount)}
                    </Td>
                    <Td className="text-gray-500">{new Date(s.createdAt).toLocaleDateString()}</Td>
                  </tr>
                ))}
              </Table>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
