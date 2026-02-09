/**
 * Build-time only: fetch achievement ids for static export (generateStaticParams).
 * Uses env vars so must run during next build.
 */
import { createClient } from "@supabase/supabase-js";

export async function getAchievementIdsForBuild(): Promise<{ id: string }[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  const supabase = createClient(url, key);
  const { data } = await supabase
    .from("achievements")
    .select("id")
    .eq("is_published", true);
  return (data || []).map((r) => ({ id: r.id }));
}
