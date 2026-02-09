"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  CATEGORY_LABELS,
  type Category,
} from "@/types/database";

const CATEGORIES = Object.entries(CATEGORY_LABELS) as [Category, string][];

const CURRICULUM_OPTIONS = [
  { value: "curricular", label: "Curricular" },
  { value: "co_curricular", label: "Co-Curricular" },
  { value: "extra_curricular", label: "Extra-Curricular" },
];

const ACHIEVEMENT_OPTIONS = [
  { value: "individual", label: "Individual" },
  { value: "group", label: "Group" },
];

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export function AchievementFilters({ years }: { years: number[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/achievements?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const input = form.elements.namedItem("search") as HTMLInputElement;
      updateFilter("search", input.value.trim() || null);
    },
    [updateFilter]
  );

  const search = searchParams.get("search") ?? "";
  const year = searchParams.get("year") ?? "";
  const category = searchParams.get("category") ?? "";
  const curriculum = searchParams.get("curriculum") ?? "";
  const type = searchParams.get("type") ?? "";
  const gender = searchParams.get("gender") ?? "";

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <form onSubmit={handleSearchSubmit}>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Search
        </label>
        <div className="flex gap-2">
          <input
            type="search"
            name="search"
            placeholder="Name or index number..."
            defaultValue={search}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-[#0e4d8d] focus:outline-none focus:ring-1 focus:ring-[#0e4d8d]"
          />
          <button
            type="submit"
            className="rounded-lg bg-[#820000] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#a31f1f]"
          >
            Search
          </button>
        </div>
      </form>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Year
          </label>
          <select
            value={year}
            onChange={(e) => updateFilter("year", e.target.value || null)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-[#0e4d8d] focus:outline-none"
          >
            <option value="">All years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => updateFilter("category", e.target.value || null)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-[#0e4d8d] focus:outline-none"
          >
            <option value="">All categories</option>
            {CATEGORIES.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Curriculum Type
          </label>
          <select
            value={curriculum}
            onChange={(e) =>
              updateFilter("curriculum", e.target.value || null)
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-[#0e4d8d] focus:outline-none"
          >
            <option value="">All types</option>
            {CURRICULUM_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Individual / Group
          </label>
          <select
            value={type}
            onChange={(e) => updateFilter("type", e.target.value || null)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-[#0e4d8d] focus:outline-none"
          >
            <option value="">All</option>
            {ACHIEVEMENT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => updateFilter("gender", e.target.value || null)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-[#0e4d8d] focus:outline-none"
          >
            <option value="">All</option>
            {GENDER_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
