"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AchievementForm } from "@/components/admin/AchievementForm";
import { getAchievementForEditClient, updateAchievementClient } from "@/lib/admin-client";

export function EditAchievementClient({ id }: { id: string }) {
  const router = useRouter();
  const [achievement, setAchievement] = useState<Awaited<ReturnType<typeof getAchievementForEditClient>>>(undefined);

  useEffect(() => {
    getAchievementForEditClient(id).then(setAchievement);
  }, [id]);

  async function handleUpdate(formData: FormData) {
    await updateAchievementClient(id, formData);
    router.push("/admin/dashboard");
    router.refresh();
  }

  if (achievement === undefined) {
    return (
      <div className="p-8">
        <p className="text-slate-600">Loading…</p>
      </div>
    );
  }

  if (achievement === null) {
    return (
      <div className="p-8">
        <p className="text-slate-600">Achievement not found.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800">Edit Achievement</h1>
      <p className="mt-1 text-slate-600">Update achievement details.</p>
      <AchievementForm action={handleUpdate} achievement={achievement} />
    </div>
  );
}
