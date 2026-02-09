"use client";

import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/achievements", label: "Achievements" },
  { href: "/about", label: "About Zahira" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-[#820000] transition hover:text-[#0e4d8d] sm:text-2xl"
        >
          Pride of Zahira
        </Link>
        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-[#820000] sm:text-base"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            className="rounded-md bg-[#0e4d8d] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#3d7ab8]"
          >
            Admin
          </Link>
        </div>
      </nav>
    </header>
  );
}
