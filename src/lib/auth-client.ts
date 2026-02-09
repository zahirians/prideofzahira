"use client";

import { createClient } from "@/lib/supabase/client";

/** Client-side admin OTP request (for static export; no Server Actions). */
export async function requestAdminOtpClient(email: string) {
  const supabase = createClient();
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
