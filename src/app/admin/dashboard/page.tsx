"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CATEGORY_LABELS,
  LEVEL_LABELS,
} from "@/types/database";
import type { Category, Level } from "@/types/database";
import { getAllAchievementsClient } from "@/lib/admin-client";
import { deleteAchievementClient, togglePublishStatusClient } from "@/lib/admin-client";

export default function AdminDashboardPage() {
  const [achievements, setAchievements] = useState<Awaited<ReturnType<typeof getAllAchievementsClient>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      getAllAchievementsClient().then((data) => {
        if (!cancelled) {
          setAchievements(data);
        }
        setLoading(false);
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this achievement?")) return;
    await deleteAchievementClient(id);
    setAchievements((prev) => prev.filter((a) => a.id !== id));
  }

  async function handleTogglePublish(id: string, is_published: boolean) {
    await togglePublishStatusClient(id, is_published);
    setAchievements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_published } : a))
    );
  }

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-slate-600">Loading…</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
      <p className="mt-1 text-slate-600">Manage achievements and content.</p>

      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-800">All Achievements</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {achievements.map((a) => (
                <tr key={a.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Link
                      href={`/admin/achievements/${a.id}/edit`}
                      className="font-medium text-[#0e4d8d] hover:text-[#820000]"
                    >
                      {a.title}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-700">
                    {a.students?.full_name ?? "—"}
                    {a.students?.index_number && (
                      <span className="text-[#0e4d8d]"> #{a.students.index_number}</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                    {CATEGORY_LABELS[a.category as Category]}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                    {LEVEL_LABELS[a.level as Level]}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">{a.year}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        a.is_published ? "bg-[#820000]/10 text-[#820000]" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {a.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(a.id, !a.is_published)}
                      className="text-[#0e4d8d] hover:text-[#820000]"
                    >
                      {a.is_published ? "Unpublish" : "Publish"}
                    </button>
                    {" · "}
                    <Link href={`/admin/achievements/${a.id}/edit`} className="text-[#0e4d8d] hover:text-[#820000]">
                      Edit
                    </Link>
                    {" · "}
                    <button
                      type="button"
                      onClick={() => handleDelete(a.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
