import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-lg font-semibold text-[#820000]">
              Pride of Zahira
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Zahira College, Mawanella — Celebrating Excellence
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/"
              className="text-sm text-slate-600 transition hover:text-[#820000]"
            >
              Home
            </Link>
            <Link
              href="/achievements"
              className="text-sm text-slate-600 transition hover:text-[#820000]"
            >
              Achievements
            </Link>
            <Link
              href="/about"
              className="text-sm text-slate-600 transition hover:text-[#820000]"
            >
              About Zahira
            </Link>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Pride of Zahira. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
