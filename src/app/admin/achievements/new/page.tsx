"use client";

import { useRouter } from "next/navigation";
import { AchievementForm } from "@/components/admin/AchievementForm";
import { createAchievementClient } from "@/lib/admin-client";

export default function AddAchievementPage() {
  const router = useRouter();

  async function handleCreate(formData: FormData) {
    await createAchievementClient(formData);
    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800">Add Achievement</h1>
      <p className="mt-1 text-slate-600">
        Add a new achievement for a student or alumnus.
      </p>
      <AchievementForm action={handleCreate} />
    </div>
  );
}
