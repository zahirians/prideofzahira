"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAchievementByIdClient } from "@/lib/achievements-client";
import type { AchievementWithRelations } from "@/types/database";
import type { AchievementParticipant } from "@/types/database";
import type { Student } from "@/types/database";
import {
  CATEGORY_LABELS,
  CURRICULUM_LABELS,
  LEVEL_LABELS,
  PERSON_TYPE_LABELS,
  ACHIEVEMENT_TYPE_LABELS,
  PARTICIPANT_ROLE_LABELS,
} from "@/types/database";

export function AchievementDetailClient({ id }: { id: string }) {
  const [achievement, setAchievement] = useState<AchievementWithRelations | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    getAchievementByIdClient(id).then((a) => {
      if (!cancelled) setAchievement(a ?? null);
    });
    return () => { cancelled = true; };
  }, [id]);

  if (achievement === undefined) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center text-slate-500">
        Loading…
      </div>
    );
  }

  if (achievement === null) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-slate-600">Achievement not found.</p>
        <Link
          href="/achievements"
          className="mt-4 inline-block text-[#0e4d8d] hover:text-[#820000]"
        >
          ← Back to Achievements
        </Link>
      </div>
    );
  }

  const student = achievement.students;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/achievements"
        className="mb-6 inline-flex items-center text-sm text-[#0e4d8d] transition hover:text-[#820000]"
      >
        ← Back to Achievements
      </Link>

      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
        {achievement.media?.[0] && (
          <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
            <Image
              src={achievement.media[0].file_url}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#820000]/10 px-3 py-1 text-sm font-medium text-[#820000]">
              {CATEGORY_LABELS[achievement.category]}
            </span>
            <span className="rounded-full bg-[#0e4d8d]/10 px-3 py-1 text-sm font-medium text-[#0e4d8d]">
              {LEVEL_LABELS[achievement.level]}
            </span>
            <span className="rounded-full bg-[#0e4d8d]/10 px-3 py-1 text-sm font-medium text-[#0e4d8d]">
              {CURRICULUM_LABELS[achievement.curriculum_type]}
            </span>
            {achievement.age_group && (
              <span className="rounded-full bg-slate-200/80 px-3 py-1 text-sm text-slate-700">
                {achievement.age_group}
              </span>
            )}
            {achievement.result_position && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                {achievement.result_position}
              </span>
            )}
            <span className="text-sm text-slate-500">{achievement.year}</span>
          </div>

          <h1 className="mt-4 text-2xl font-bold text-slate-800 sm:text-3xl">
            {achievement.title}
          </h1>

          {achievement.event_name && (
            <p className="mt-2 text-slate-600">Event: {achievement.event_name}</p>
          )}

          {achievement.description && (
            <div className="mt-6 prose prose-slate max-w-none">
              <p className="text-slate-600">{achievement.description}</p>
            </div>
          )}

          {achievement.timing && (
            <p className="mt-2 text-slate-600">
              <span className="font-medium text-slate-700">Time / Result:</span> {achievement.timing}
            </p>
          )}

          {achievement.notes && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/50 p-4">
              <h3 className="text-sm font-semibold text-amber-900">Note</h3>
              <p className="mt-1 text-sm text-amber-900/90">{achievement.notes}</p>
            </div>
          )}

          {achievement.achievement_participants && achievement.achievement_participants.length > 0 && (
            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-800">Team / Participants</h2>
              <ul className="mt-4 space-y-2">
                {achievement.achievement_participants.map((p: AchievementParticipant & { students?: Student | null }) => {
                  const displayName = p.students ? p.students.full_name : p.name || "—";
                  return (
                    <li key={p.id} className="flex items-center justify-between gap-4 rounded-lg bg-white px-3 py-2">
                      <span className="font-medium text-slate-800">{displayName}</span>
                      <span className="rounded bg-slate-200 px-2 py-0.5 text-sm text-slate-600">
                        {PARTICIPANT_ROLE_LABELS[p.role]}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {student && (
            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-800">Achiever Details</h2>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-slate-500">Name</dt>
                  <dd className="font-medium text-slate-800">{student.full_name}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500">Index Number</dt>
                  <dd className="font-medium text-slate-800">{student.index_number}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500">Type</dt>
                  <dd className="font-medium text-slate-800">{PERSON_TYPE_LABELS[student.student_type]}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500">Achievement Type</dt>
                  <dd className="font-medium text-slate-800">
                    {ACHIEVEMENT_TYPE_LABELS[achievement.achievement_type]}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500">Batch / Year</dt>
                  <dd className="font-medium text-slate-800">{student.batch_year}</dd>
                </div>
              </dl>
            </div>
          )}

          {achievement.media && achievement.media.length > 1 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-slate-800">Gallery</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {achievement.media.slice(1).map((m) => (
                  <div key={m.id} className="relative aspect-video overflow-hidden rounded-lg border border-slate-200">
                    <Image
                      src={m.file_url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
