import Link from "next/link";
import Image from "next/image";
import type { AchievementWithRelations } from "@/types/database";
import { CATEGORY_LABELS, LEVEL_LABELS } from "@/types/database";

interface AchievementCardProps {
  achievement: AchievementWithRelations;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const student = achievement.students;

  return (
    <Link
      href={`/achievements/${achievement.id}`}
      className="group block overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#820000]/50 hover:shadow-md"
    >
      <div className="flex gap-4">
        {achievement.media?.[0] && (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
            <Image
              src={achievement.media[0].file_url}
              alt=""
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-800 group-hover:text-[#820000]">
            {achievement.title}
          </h3>
          {student && (
            <p className="mt-1 text-sm text-slate-600">
              {student.full_name}
              {student.index_number && (
                <span className="text-[#0e4d8d]"> • #{student.index_number}</span>
              )}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#820000]/10 px-2 py-0.5 text-xs font-medium text-[#820000]">
              {CATEGORY_LABELS[achievement.category]}
            </span>
            <span className="rounded-full bg-[#0e4d8d]/10 px-2 py-0.5 text-xs font-medium text-[#0e4d8d]">
              {LEVEL_LABELS[achievement.level]}
            </span>
            <span className="text-xs text-slate-500">{achievement.year}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
