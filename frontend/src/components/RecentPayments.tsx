"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Payment {
  id: string;
  amount: number;
  asset: string;
  status: string;
  description: string | null;
  created_at: string;
}

interface PaginatedResponse {
  payments: Payment[];
  total_count: number;
  total_pages: number;
  page: number;
  limit: number;
}

const LIMIT = 10;

export default function RecentPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate component to avoid SSR mismatch when accessing localStorage
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const controller = new AbortController();

    const fetchPayments = async () => {
      try {
        const apiKey = localStorage.getItem("merchant_api_key");
        if (!apiKey) {
          setError("API key not found. Please register or log in.");
          setLoading(false);
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const response = await fetch(
          `${apiUrl}/api/payments?page=${page}&limit=${LIMIT}`,
          {
            headers: {
              "x-api-key": apiKey,
            },
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch payments");
        }

        const data: PaginatedResponse = await response.json();
        setPayments(data.payments ?? []);
        setTotalPages(data.total_pages ?? 1);
        setTotalCount(data.total_count ?? 0);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();

    return () => controller.abort();
  }, [page, hydrated]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 w-full rounded-lg bg-white/5" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-6 text-center">
        <p className="text-sm text-yellow-400">{error}</p>
        <p className="mt-2 text-xs text-slate-500">
          Make sure the backend is running and the payments endpoint is available.
        </p>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-sm text-slate-400">No payments yet.</p>
        <p className="mt-1 text-xs text-slate-500">
          Payments will appear here once they are created via the API.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-slate-400">
                Status
              </th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-slate-400">
                Amount
              </th>
              <th className="hidden px-4 py-3 font-mono text-xs uppercase tracking-wider text-slate-400 sm:table-cell">
                Description
              </th>
              <th className="hidden px-4 py-3 font-mono text-xs uppercase tracking-wider text-slate-400 md:table-cell">
                Date
              </th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-slate-400">
                Link
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="transition-colors hover:bg-white/5"
              >
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      payment.status === "confirmed"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-white">
                  {payment.amount} {payment.asset}
                </td>
                <td className="hidden px-4 py-3 text-slate-400 sm:table-cell">
                  {payment.description || "—"}
                </td>
                <td className="hidden px-4 py-3 text-slate-400 md:table-cell">
                  {new Date(payment.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/pay/${payment.id}`}
                    className="font-mono text-xs text-mint transition-colors hover:text-glow"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-400">
              <span className="font-medium text-white">{totalCount}</span> total
              {totalCount !== 1 ? "s" : ""} •{" "}
              <span className="font-medium text-white">
                {(page - 1) * LIMIT + 1}
              </span>
              –
              <span className="font-medium text-white">
                {Math.min(page * LIMIT, totalCount)}
              </span>
            </div>
            <div className="text-xs font-mono text-slate-500">
              Page <span className="text-white">{page}</span> of{" "}
              <span className="text-white">{totalPages}</span>
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous
            </button>
            <div className="hidden gap-1 sm:flex">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`rounded-md px-2.5 py-2 text-xs font-medium transition-colors ${
                    page === p
                      ? "bg-mint text-black"
                      : "border border-white/10 text-slate-400 hover:bg-white/5"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
