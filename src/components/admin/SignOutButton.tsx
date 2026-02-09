"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="w-full rounded-lg px-3 py-2 text-left text-sm text-[#0e4d8d] transition hover:bg-slate-100 hover:text-[#820000]"
    >
      Sign Out
    </button>
  );
}
