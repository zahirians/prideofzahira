"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AchievementForm } from "@/components/admin/AchievementForm";
import { getAchievementForEditClient, updateAchievementClient } from "@/lib/admin-client";

export function EditAchievementPageClient({ id }: { id: string }) {
  const router = useRouter();
  const [achievement, setAchievement] = useState<Awaited<ReturnType<typeof getAchievementForEditClient>>>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAchievementForEditClient(id).then((a) => {
      setAchievement(a);
      setLoading(false);
    });
  }, [id]);

  async function handleUpdate(formData: FormData) {
    await updateAchievementClient(id, formData);
    router.push("/admin/dashboard");
    router.refresh();
  }

  if (loading) return <div className="p-8">Loading…</div>;
  if (!achievement) return <div className="p-8">Achievement not found.</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800">Edit Achievement</h1>
      <p className="mt-1 text-slate-600">Update achievement details.</p>
      <AchievementForm action={handleUpdate} achievement={achievement} />
    </div>
  );
}
