import { getAchievementIdsForBuild } from "@/lib/achievements-build";
import { AchievementDetailClient } from "./AchievementDetailClient";

export async function generateStaticParams() {
  const ids = await getAchievementIdsForBuild();
  return ids;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AchievementDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <AchievementDetailClient id={id} />;
}
