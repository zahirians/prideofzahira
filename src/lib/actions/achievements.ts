"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  AchievementWithRelations,
  Media,
  AchievementType,
  Category,
  CurriculumType,
} from "@/types/database";

export interface AchievementFilters {
  search?: string;
  year?: number;
  category?: Category;
  curriculum_type?: CurriculumType;
  achievement_type?: AchievementType;
  gender?: "male" | "female";
}

export async function getPublishedAchievements(
  filters: AchievementFilters = {}
): Promise<AchievementWithRelations[]> {
  const supabase = await createClient();

  let query = supabase
    .from("achievements")
    .select(
      `
      *,
      students (*)
    `
    )
    .eq("is_published", true);

  if (filters.year) {
    query = query.eq("year", filters.year);
  }
  if (filters.category) {
    query = query.eq("category", filters.category);
  }
  if (filters.curriculum_type) {
    query = query.eq("curriculum_type", filters.curriculum_type);
  }
  if (filters.achievement_type) {
    query = query.eq("achievement_type", filters.achievement_type);
  }
  if (filters.gender) {
    query = query.eq("students.gender", filters.gender);
  }

  const { data: achievements, error } = await query.order("year", {
    ascending: false,
  });

  if (error) {
    console.error("Error fetching achievements:", error);
    return [];
  }

  // Filter by search (name or index) client-side if needed
  let results = (achievements || []) as AchievementWithRelations[];
  if (filters.search?.trim()) {
    const search = filters.search.toLowerCase().trim();
    results = results.filter(
      (a) =>
        a.students?.full_name?.toLowerCase().includes(search) ||
        a.students?.index_number?.toLowerCase().includes(search) ||
        a.title?.toLowerCase().includes(search)
    );
  }

  // Fetch media for each achievement
  const achievementIds = results.map((a) => a.id);
  const { data: mediaData } = await supabase
    .from("media")
    .select("*")
    .in("achievement_id", achievementIds);

  const mediaByAchievement = (mediaData || []).reduce(
    (acc: Record<string, Media[]>, m: Media & { achievement_id: string }) => {
      const key = m.achievement_id;
      if (!acc[key]) acc[key] = [];
      acc[key].push(m);
      return acc;
    },
    {} as Record<string, Media[]>
  );

  return results.map((a) => ({
    ...a,
    media: mediaByAchievement[a.id] || [],
  }));
}

export async function getAchievementById(
  id: string
): Promise<AchievementWithRelations | null> {
  const supabase = await createClient();

  const { data: achievement, error } = await supabase
    .from("achievements")
    .select(
      `
      *,
      students (*)
    `
    )
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (error || !achievement) return null;

  const [{ data: media }, { data: participants }] = await Promise.all([
    supabase.from("media").select("*").eq("achievement_id", id),
    supabase
      .from("achievement_participants")
      .select("*, students(*)")
      .eq("achievement_id", id)
      .order("display_order", { ascending: true })
      .order("role", { ascending: true }),
  ]);

  return {
    ...achievement,
    media: media || [],
    achievement_participants: (participants || []).map((p: { students?: unknown }) => ({
      ...p,
      students: p.students || null,
    })),
  } as AchievementWithRelations;
}

export async function getStats() {
  const supabase = await createClient();

  const { count: achievementCount } = await supabase
    .from("achievements")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true);

  const { data: publishedAchievements } = await supabase
    .from("achievements")
    .select("id, student_id")
    .eq("is_published", true);

  const publishedIds = (publishedAchievements || []).map((a) => a.id);
  const mainStudentIds = (publishedAchievements || []).map((a) => a.student_id).filter(Boolean);

  let participantStudentIds: string[] = [];
  if (publishedIds.length > 0) {
    const { data: participants } = await supabase
      .from("achievement_participants")
      .select("student_id")
      .in("achievement_id", publishedIds)
      .not("student_id", "is", null);
    participantStudentIds = (participants || []).map((p) => p.student_id);
  }

  const uniqueStudents = new Set([...mainStudentIds, ...participantStudentIds]).size;

  const { data: years } = await supabase
    .from("achievements")
    .select("year")
    .eq("is_published", true);

  const yearSet = new Set((years || []).map((y) => y.year));

  return {
    totalAchievements: achievementCount || 0,
    uniqueAchievers: uniqueStudents,
    yearsCovered: yearSet.size,
    years: Array.from(yearSet).sort((a, b) => b - a),
  };
}

export async function getFeaturedAchievements(limit = 6) {
  const achievements = await getPublishedAchievements({});
  return achievements.slice(0, limit);
}
