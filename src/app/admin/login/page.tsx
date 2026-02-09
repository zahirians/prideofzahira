"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { requestAdminOtpClient } from "@/lib/auth-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  async function handleSendOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const value = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value.trim();
    if (!value) {
      setLoading(false);
      return;
    }
    setEmail(value);
    const result = await requestAdminOtpClient(value);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setOtpSent(true);
  }

  async function handleVerifyOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const code = (e.currentTarget.elements.namedItem("otp") as HTMLInputElement).value.trim();
    if (!code || !email) {
      setLoading(false);
      return;
    }
    const supabase = createClient();
    const { error: err } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="text-center">
          <Link
            href="/"
            className="text-2xl font-bold text-[#820000] hover:text-[#0e4d8d]"
          >
            Pride of Zahira
          </Link>
          <h1 className="mt-4 text-xl font-semibold text-slate-800">
            Admin Login
          </h1>
        </div>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-[#0e4d8d] focus:outline-none focus:ring-1 focus:ring-[#0e4d8d]"
                placeholder="admin@example.com"
              />
            </div>
            <p className="text-sm text-slate-600">
              Only authorized emails can sign in. We’ll send a one-time code to your inbox.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#820000] px-4 py-2 font-medium text-white transition hover:bg-[#a31f1f] disabled:opacity-70"
            >
              {loading ? "Sending code…" : "Send code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <p className="text-sm text-slate-600">
              Enter the 6-digit code sent to <strong>{email}</strong>
            </p>
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-slate-700"
              >
                Code
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-lg tracking-widest text-slate-800 placeholder-slate-400 focus:border-[#0e4d8d] focus:outline-none focus:ring-1 focus:ring-[#0e4d8d]"
              />
            </div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full rounded-lg bg-[#820000] px-4 py-2 font-medium text-white transition hover:bg-[#a31f1f] disabled:opacity-70"
            >
              {loading ? "Verifying…" : "Verify and sign in"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOtpSent(false);
                setOtp("");
                setError(null);
              }}
              className="w-full text-sm text-slate-600 hover:text-slate-800"
            >
              Use a different email
            </button>
          </form>
        )}

        <p className="text-center text-sm text-slate-600">
          <Link href="/" className="hover:text-[#0e4d8d]">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
