"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requestAdminOtp(email: string) {
  const supabase = await createClient();
  const { data: allowed } = await supabase.rpc("is_allowed_admin_email", {
    e: email.trim().toLowerCase(),
  });
  if (!allowed) {
    return { error: "This email is not authorized to access admin." };
  }
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
    options: { shouldCreateUser: true },
  });
  if (error) return { error: error.message };
  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
