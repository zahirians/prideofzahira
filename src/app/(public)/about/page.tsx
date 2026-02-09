export const metadata = {
  title: "About Zahira | Pride of Zahira",
  description:
    "Learn about Zahira College, Mawanella and the Pride of Zahira platform.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[#820000] sm:text-4xl">
        About Zahira College, Mawanella
      </h1>

      <div className="mt-8 space-y-8 text-slate-600">
        <section>
          <h2 className="text-xl font-semibold text-slate-800">
            Our School
          </h2>
          <p className="mt-2 leading-relaxed">
            Zahira College, Mawanella is an esteemed institution committed to
            nurturing academic excellence, character development, and holistic
            growth. Our students and alumni continue to achieve remarkable
            milestones in various fields, bringing pride to our institution and
            community.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800">
            Purpose of This Platform
          </h2>
          <p className="mt-2 leading-relaxed">
            Pride of Zahira is a dedicated platform to showcase and celebrate
            the achievements of our students and old boys/girls. Whether in
            curricular, co-curricular, or extra-curricular activities, we believe
            every accomplishment deserves recognition.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800">
            What We Celebrate
          </h2>
          <ul className="mt-2 list-inside list-disc space-y-2 text-slate-600">
            <li>Academic excellence and competitions</li>
            <li>Sports and athletics</li>
            <li>Arts and culture</li>
            <li>Leadership and community service</li>
            <li>Zonal, provincial, national, and international achievements</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
