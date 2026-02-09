import { EditAchievementClient } from "./EditAchievementClient";

export async function generateStaticParams(): Promise<{ id: string }[]> {
  return [{ id: "placeholder" }];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAchievementPage({ params }: PageProps) {
  const { id } = await params;
  return <EditAchievementClient id={id} />;
}
