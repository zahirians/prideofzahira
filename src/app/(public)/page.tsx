"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getStatsClient, getPublishedAchievementsClient } from "@/lib/achievements-client";
import { AchievementCard } from "@/components/achievements/AchievementCard";

export default function HomePage() {
  const [stats, setStats] = useState<{
    totalAchievements: number;
    uniqueAchievers: number;
    yearsCovered: number;
  } | null>(null);
  const [featured, setFeatured] = useState<Awaited<ReturnType<typeof getPublishedAchievementsClient>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [s, list] = await Promise.all([
        getStatsClient(),
        getPublishedAchievementsClient({}),
      ]);
      if (!cancelled) {
        setStats(s);
        setFeatured(list.slice(0, 6));
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-slate-500">
        Loading…
      </div>
    );
  }

  return (
    <div>
      <section className="relative overflow-hidden border-b border-slate-200 bg-white py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#82000008_0%,_transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-[#820000] sm:text-5xl lg:text-6xl">
            Pride of Zahira
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 sm:text-xl">
            Celebrating students and alumni of Zahira College, Mawanella who have
            achieved excellence in curricular, co-curricular, and
            extra-curricular activities.
          </p>
          <Link
            href="/achievements"
            className="mt-8 inline-flex items-center rounded-lg bg-[#820000] px-6 py-3 text-base font-medium text-white transition hover:bg-[#a31f1f]"
          >
            Explore Achievements
          </Link>
        </div>
      </section>

      {stats && (
        <section className="border-b border-slate-200 bg-slate-50/50 py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                <p className="text-3xl font-bold text-[#820000]">{stats.totalAchievements}</p>
                <p className="mt-1 text-sm text-slate-600">Total Achievements</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                <p className="text-3xl font-bold text-[#0e4d8d]">{stats.uniqueAchievers}</p>
                <p className="mt-1 text-sm text-slate-600">Unique Achievers</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                <p className="text-3xl font-bold text-[#820000]">{stats.yearsCovered}</p>
                <p className="mt-1 text-sm text-slate-600">Years Covered</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Featured Achievements
            </h2>
            <Link
              href="/achievements"
              className="text-sm font-medium text-[#0e4d8d] transition hover:text-[#820000]"
            >
              View all →
            </Link>
          </div>
          {featured.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-center text-slate-500">
              No achievements yet. Check back soon!
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
