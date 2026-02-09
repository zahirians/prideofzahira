import {
  CATEGORY_LABELS,
  CURRICULUM_LABELS,
  LEVEL_LABELS,
} from "@/types/database";

export const metadata = {
  title: "Manage Categories | Pride of Zahira Admin",
};

export default function AdminCategoriesPage() {
  const categories = Object.entries(CATEGORY_LABELS);
  const curriculumTypes = Object.entries(CURRICULUM_LABELS);
  const levels = Object.entries(LEVEL_LABELS);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800">Manage Categories</h1>
      <p className="mt-1 text-slate-600">
        Reference for achievement categories and classification options.
      </p>

      <div className="mt-8 space-y-8">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">Achievement Categories</h2>
          <p className="mt-1 text-sm text-slate-600">
            Used when classifying achievements by type of activity.
          </p>
          <ul className="mt-4 space-y-2">
            {categories.map(([key, label]) => (
              <li
                key={key}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2"
              >
                <span className="font-mono text-sm text-[#0e4d8d]">{key}</span>
                <span className="text-slate-700">{label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">Curriculum Types</h2>
          <p className="mt-1 text-sm text-slate-600">
            Curricular, co-curricular, or extra-curricular.
          </p>
          <ul className="mt-4 space-y-2">
            {curriculumTypes.map(([key, label]) => (
              <li
                key={key}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2"
              >
                <span className="font-mono text-sm text-[#0e4d8d]">{key}</span>
                <span className="text-slate-700">{label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">Achievement Levels</h2>
          <p className="mt-1 text-sm text-slate-600">
            Level of competition or recognition (School to International).
          </p>
          <ul className="mt-4 space-y-2">
            {levels.map(([key, label]) => (
              <li
                key={key}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2"
              >
                <span className="font-mono text-sm text-[#0e4d8d]">{key}</span>
                <span className="text-slate-700">{label}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
