"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getPublishedAchievementsClient,
  getStatsClient,
  type AchievementFilters as ClientFilters,
} from "@/lib/achievements-client";
import { AchievementCard } from "@/components/achievements/AchievementCard";
import { AchievementFilters } from "@/components/achievements/AchievementFilters";

function AchievementsContent() {
  const searchParams = useSearchParams();
  const [achievements, setAchievements] = useState<Awaited<ReturnType<typeof getPublishedAchievementsClient>>>([]);
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getStatsClient>> | null>(null);
  const [loading, setLoading] = useState(true);

  const filters: ClientFilters = useMemo(() => ({
    search: searchParams.get("search") ?? undefined,
    year: searchParams.get("year") ? parseInt(searchParams.get("year")!, 10) : undefined,
    category: (searchParams.get("category") as ClientFilters["category"]) ?? undefined,
    curriculum_type: (searchParams.get("curriculum") as ClientFilters["curriculum_type"]) ?? undefined,
    achievement_type: (searchParams.get("type") as ClientFilters["achievement_type"]) ?? undefined,
    gender: (searchParams.get("gender") as "male" | "female") ?? undefined,
  }), [searchParams]);

  const load = useCallback(async () => {
    setLoading(true);
    const [list, s] = await Promise.all([
      getPublishedAchievementsClient(filters),
      getStatsClient(),
    ]);
    setAchievements(list);
    setStats(s);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    queueMicrotask(() => load());
  }, [load]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">
        Achievements
      </h1>
      <p className="mt-2 text-slate-600">
        Browse and search achievements by students and alumni.
      </p>

      {stats && (
        <div className="mt-8">
          <AchievementFilters years={stats.years} />
        </div>
      )}

      <div className="mt-8">
        {loading ? (
          <div className="mt-6 h-64 animate-pulse rounded-xl bg-slate-200" />
        ) : achievements.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-slate-600">No achievements found.</p>
            <p className="mt-1 text-sm text-slate-500">
              Try adjusting your filters or search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AchievementsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-12">Loading…</div>}>
      <AchievementsContent />
    </Suspense>
  );
}
