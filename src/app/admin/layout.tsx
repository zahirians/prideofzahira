import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignOutButton } from "@/components/admin/SignOutButton";

const adminNav = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/achievements/new", label: "Add Achievement" },
  { href: "/admin/categories", label: "Manage Categories" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Build-safe: on static export (e.g. GitHub Pages) there is no request context
  let user: { email?: string } | null = null;
  let adminUser: { id: string } | null = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
    if (user?.email) {
      const { data: admin } = await supabase
        .from("admin_users")
        .select("id")
        .eq("email", user.email)
        .single();
      adminUser = admin;
    }
  } catch {
    // Static build or no cookies
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100">
        {children}
      </div>
    );
  }

  if (!adminUser) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed left-0 top-0 z-40 h-screen w-56 border-r border-slate-200 bg-white shadow-sm">
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-200 p-4">
            <Link
              href="/admin/dashboard"
              className="text-lg font-bold text-[#820000]"
            >
              Admin
            </Link>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-[#820000]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-slate-200 p-4">
            <SignOutButton />
          </div>
        </div>
      </aside>
      <main className="pl-56">{children}</main>
    </div>
  );
}
